import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { LearningKit, GenerateLessonResponse } from "@/types/lesson";

// --- Constants ---
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;
const MAX_LESSON_TEXT_LENGTH = 5000;
const GEMINI_TIMEOUT_MS = 90_000; // 90 seconds hard timeout

// --- Simple in-memory rate limiter (H4) ---
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// --- Ol Chiki Unicode presence check (M1) ---
const OL_CHIKI_REGEX = /[\u1C50-\u1C7F]/;
function containsOlChiki(text: string): boolean {
  return OL_CHIKI_REGEX.test(text);
}

// --- Helpers ---
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isTransientGeminiError(error: unknown): boolean {
  if (!error) return false;

  const errMsg = String(error instanceof Error ? error.message : error);
  const errStatus = (error as { status?: number | string })?.status;
  const errCode = (error as { code?: number | string })?.code;

  // Do NOT retry client/auth/permission errors
  if (errStatus === 400 || errStatus === 401 || errStatus === 403 || errStatus === 404) {
    return false;
  }
  if (
    errMsg.includes("API_KEY_INVALID") ||
    errMsg.includes("API key not valid") ||
    errMsg.includes("PERMISSION_DENIED") ||
    errMsg.includes("Invalid API key")
  ) {
    return false;
  }

  // Check for 503, UNAVAILABLE, 429 rate limit, high demand, or network transient errors
  if (
    errStatus === 503 ||
    errStatus === 429 ||
    errCode === 503 ||
    errCode === 429 ||
    errMsg.includes("503") ||
    errMsg.includes("UNAVAILABLE") ||
    errMsg.includes("high demand") ||
    errMsg.includes("overloaded") ||
    errMsg.includes("RESOURCE_EXHAUSTED") ||
    errMsg.includes("Resource has been exhausted") ||
    errMsg.includes("temporarily unavailable") ||
    errMsg.includes("fetch failed") ||
    errMsg.includes("ECONNRESET") ||
    errMsg.includes("ETIMEDOUT")
  ) {
    return true;
  }

  return false;
}

// --- Semantic validation of Gemini output (C1, H2, M1) ---
interface ValidationResult {
  valid: boolean;
  warnings: string[];
  kit: LearningKit;
}

function validateAndRepairLearningKit(raw: Record<string, unknown>): ValidationResult {
  const warnings: string[] = [];
  const kit = raw as unknown as LearningKit;

  // Required top-level string fields
  for (const field of ["title", "grade", "subject"] as const) {
    if (!kit[field] || typeof kit[field] !== "string" || !kit[field].trim()) {
      warnings.push(`Missing or empty required field: '${field}'`);
    }
  }

  // Lesson object
  if (!kit.lesson || typeof kit.lesson !== "object") {
    return { valid: false, warnings: ["Missing 'lesson' object entirely"], kit };
  }
  for (const lf of ["hindi", "santhali", "romanization", "simpleExplanation"] as const) {
    if (!kit.lesson[lf] || typeof kit.lesson[lf] !== "string" || !kit.lesson[lf].trim()) {
      warnings.push(`Missing or empty lesson field: 'lesson.${lf}'`);
    }
  }

  // Ol Chiki presence check (M1)
  if (kit.lesson.santhali && !containsOlChiki(kit.lesson.santhali)) {
    warnings.push("lesson.santhali does not contain Ol Chiki Unicode characters (U+1C50–U+1C7F)");
  }

  // Vocabulary array
  if (!Array.isArray(kit.vocabulary) || kit.vocabulary.length === 0) {
    warnings.push("Vocabulary array is missing or empty");
  } else {
    for (let i = 0; i < kit.vocabulary.length; i++) {
      const v = kit.vocabulary[i];
      if (!v.hindi || !v.santhali || !v.romanization || !v.meaning) {
        warnings.push(`Vocabulary item [${i}] has missing fields`);
      }
      if (v.santhali && !containsOlChiki(v.santhali)) {
        warnings.push(`Vocabulary item [${i}] santhali field lacks Ol Chiki characters`);
      }
    }
  }

  // Flashcards array
  if (!Array.isArray(kit.flashcards) || kit.flashcards.length === 0) {
    warnings.push("Flashcards array is missing or empty");
  }

  // Quiz array with correctAnswer validation (H2)
  if (!Array.isArray(kit.quiz) || kit.quiz.length === 0) {
    warnings.push("Quiz array is missing or empty");
  } else {
    for (let i = 0; i < kit.quiz.length; i++) {
      const q = kit.quiz[i];

      // Ensure options is an array with at least 2 items
      if (!Array.isArray(q.options) || q.options.length < 2) {
        warnings.push(`Quiz question [${i}] has fewer than 2 options`);
      }

      // Pad options to exactly 4 if fewer
      if (Array.isArray(q.options) && q.options.length > 0 && q.options.length < 4) {
        while (q.options.length < 4) {
          (q.options as string[]).push(`—`);
        }
        warnings.push(`Quiz question [${i}] had fewer than 4 options; padded with placeholders`);
      }

      // Validate correctAnswer is in options (H2)
      if (q.correctAnswer && Array.isArray(q.options)) {
        const exactMatch = q.options.includes(q.correctAnswer);
        if (!exactMatch) {
          // Attempt fuzzy match: find option that starts with or contains correctAnswer
          const fuzzyMatch = q.options.find(
            (opt: string) =>
              opt.includes(q.correctAnswer) || q.correctAnswer.includes(opt)
          );
          if (fuzzyMatch) {
            warnings.push(
              `Quiz question [${i}] correctAnswer "${q.correctAnswer}" fuzzy-matched to option "${fuzzyMatch}"`
            );
            q.correctAnswer = fuzzyMatch;
          } else {
            warnings.push(
              `Quiz question [${i}] correctAnswer "${q.correctAnswer}" does not match any option — flagging for review`
            );
          }
        }
      }
    }
  }

  // Activity object
  if (!kit.activity || !kit.activity.title || !kit.activity.instructions) {
    warnings.push("Activity object is missing or incomplete");
  }

  // Quality object
  if (!kit.quality || typeof kit.quality !== "object") {
    warnings.push("Quality object is missing");
    (kit as unknown as Record<string, unknown>).quality = {
      reviewRequired: true,
      confidence: "low" as const,
      reviewNotes: "Quality metadata was missing from AI response",
    };
  }

  // If any warnings, force review
  if (warnings.length > 0) {
    kit.quality.reviewRequired = true;
    if (kit.quality.confidence === "high") {
      kit.quality.confidence = "medium";
    }
    const validationNote = `[Auto-validation] ${warnings.length} issue(s): ${warnings.join("; ")}`;
    kit.quality.reviewNotes = kit.quality.reviewNotes
      ? `${kit.quality.reviewNotes} | ${validationNote}`
      : validationNote;
  }

  // A kit is "valid" if it has the bare minimum to render
  const valid = Boolean(
    kit.lesson?.hindi &&
    kit.lesson?.santhali &&
    Array.isArray(kit.vocabulary) &&
    kit.vocabulary.length > 0
  );

  return { valid, warnings, kit };
}


export async function POST(request: NextRequest): Promise<NextResponse<GenerateLessonResponse>> {
  try {
    // --- Rate limiting (H4) ---
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please wait a moment before generating another lesson.",
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid request payload. Expected JSON body." },
        { status: 400 }
      );
    }

    const { lessonText, grade, subject, targetLanguage } = body;

    if (!lessonText || typeof lessonText !== "string" || !lessonText.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing or empty required field: 'lessonText'." },
        { status: 400 }
      );
    }

    // Input length guard (C3)
    if (lessonText.trim().length > MAX_LESSON_TEXT_LENGTH) {
      return NextResponse.json(
        {
          success: false,
          error: `Lesson text is too long (${lessonText.trim().length} characters). Maximum allowed: ${MAX_LESSON_TEXT_LENGTH} characters.`,
        },
        { status: 400 }
      );
    }

    if (!grade || typeof grade !== "string" || !grade.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing or empty required field: 'grade'." },
        { status: 400 }
      );
    }

    if (!subject || typeof subject !== "string" || !subject.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing or empty required field: 'subject'." },
        { status: 400 }
      );
    }

    if (!targetLanguage || targetLanguage !== "Santhali") {
      return NextResponse.json(
        { success: false, error: "Invalid target language. Currently supported: 'Santhali'." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || !apiKey.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY is not configured on the server. Please add GEMINI_API_KEY to your environment variables (.env.local).",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
You are an expert bilingual primary school educator and vernacular pedagogy specialist for Indian mother-tongue education (MTB-MLE).
Your mission is to transform standard Hindi primary school textbook content into an engaging, culturally contextualized, age-appropriate vernacular learning kit in Santhali (Ol Chiki script with phonetic Latin Romanization).

CRITICAL PEDAGOGICAL & LINGUISTIC RULES FOR SANTHALI:
1. Accuracy & Authenticity: Prefer accurate standard Santhali vocabulary and legitimate Ol Chiki characters (Unicode range U+1C50–U+1C7F) along with standard phonetic Latin transcription in romanization.
2. Educational Meaning: Preserve the pedagogical intent and core concepts of the Hindi source lesson.
3. Age-Appropriate: Keep all explanations, vocabulary, and instructions simple, encouraging, and suitable for the specified primary grade (Grades 1–5).
4. No Hallucination / Fabrication: Santhali is a lower-resource language. Do NOT blindly fabricate or invent words when uncertain. If an exact Santhali term is uncommon or uncertain, use standard recognized terms, loan terms in context, or explain simply.
5. Quality Guardrail:
   - If translation quality is high and authoritative, set reviewRequired=false and confidence="high".
   - If any translation or Ol Chiki representation is uncertain, set reviewRequired=true, confidence="medium" or "low", and clearly detail the uncertainty in reviewNotes.
   - Never present uncertain vernacular translations as authoritative.
6. Educational Content: Produce rich pedagogical materials: simplified explanation, key vocabulary flashcards with clear child-friendly meanings, a multiple-choice quiz with exactly 4 options and one clear correct answer, and an interactive tactile classroom activity.
7. Quiz correctAnswer MUST be an exact string copy of one of the quiz options — not a paraphrase or substring.
`;

    const userPrompt = `
Transform this Hindi primary school lesson into a structured Santhali Learning Kit.

Target Parameters:
- Grade: ${grade}
- Subject: ${subject}
- Source Language: Hindi
- Target Language: Santhali

Source Hindi Lesson Content:
"""
${lessonText.trim()}
"""

Generate a complete, structured JSON response adhering strictly to the schema.
`;

    const generateConfig = {
      systemInstruction,
      responseMimeType: "application/json",
      thinkingConfig: {
        thinkingBudget: 2048,
      },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: "Engaging bilingual title of the lesson (e.g., 'पौधे हमारे मित्र / ᱟᱵᱚ ᱨᱮᱱᱟᱜ ᱫᱟᱨᱮ ᱠᱚ')",
          },
          sourceLanguage: { type: Type.STRING, enum: ["Hindi"] },
          targetLanguage: { type: Type.STRING, enum: ["Santhali"] },
          grade: { type: Type.STRING },
          subject: { type: Type.STRING },
          lesson: {
            type: Type.OBJECT,
            properties: {
              hindi: { type: Type.STRING, description: "Core lesson story/content in Hindi" },
              santhali: { type: Type.STRING, description: "Adapted lesson content in Santhali Ol Chiki script" },
              romanization: { type: Type.STRING, description: "Phonetic Romanized Santhali reading pronunciation" },
              simpleExplanation: { type: Type.STRING, description: "Child-friendly 1-2 sentence concept takeaway" },
            },
            required: ["hindi", "santhali", "romanization", "simpleExplanation"],
          },
          vocabulary: {
            type: Type.ARRAY,
            description: "Key 3 to 6 primary vocabulary terms",
            items: {
              type: Type.OBJECT,
              properties: {
                hindi: { type: Type.STRING, description: "Hindi word (e.g., 'पत्ता (Patta)')" },
                santhali: { type: Type.STRING, description: "Santhali word in Ol Chiki (e.g., 'ᱥᱟᱠᱟᱢ')" },
                romanization: { type: Type.STRING, description: "Pronunciation in Roman letters (e.g., 'Sakam')" },
                meaning: { type: Type.STRING, description: "Simple child-friendly meaning in English/Hindi" },
              },
              required: ["hindi", "santhali", "romanization", "meaning"],
            },
          },
          flashcards: {
            type: Type.ARRAY,
            description: "3 to 6 learning flashcard pairs",
            items: {
              type: Type.OBJECT,
              properties: {
                front: { type: Type.STRING, description: "Front side concept or question" },
                back: { type: Type.STRING, description: "Back side answer / vernacular word & meaning" },
              },
              required: ["front", "back"],
            },
          },
          quiz: {
            type: Type.ARRAY,
            description: "2 to 3 simple comprehension questions",
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "Question prompt in Hindi / bilingual" },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Exactly 4 multiple choice options",
                },
                correctAnswer: { type: Type.STRING, description: "Exact string copy of one of the options" },
              },
              required: ["question", "options", "correctAnswer"],
            },
          },
          activity: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Classroom activity title" },
              instructions: { type: Type.STRING, description: "Step-by-step simple classroom activity instructions" },
            },
            required: ["title", "instructions"],
          },
          quality: {
            type: Type.OBJECT,
            properties: {
              reviewRequired: { type: Type.BOOLEAN, description: "True if human teacher verification is recommended" },
              confidence: { type: Type.STRING, enum: ["high", "medium", "low"] },
              reviewNotes: { type: Type.STRING, description: "Linguistic review notes or notes on dialectal/translation confidence" },
            },
            required: ["reviewRequired", "confidence", "reviewNotes"],
          },
        },
        required: [
          "title",
          "sourceLanguage",
          "targetLanguage",
          "grade",
          "subject",
          "lesson",
          "vocabulary",
          "flashcards",
          "quiz",
          "activity",
          "quality",
        ],
      },
    };

    let lastError: unknown = null;
    let responseText: string | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        // Wrap Gemini call with AbortController timeout (C2)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);

        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: userPrompt,
            config: {
              ...generateConfig,
              abortSignal: controller.signal,
            },
          });

          responseText = response.text ?? null;
          if (responseText) {
            break;
          }
        } finally {
          clearTimeout(timeoutId);
        }
      } catch (err: unknown) {
        lastError = err;

        // Check if this was our timeout abort
        if (err instanceof Error && err.name === "AbortError") {
          console.error(
            `[Gemini API] Request attempt ${attempt + 1}/${MAX_RETRIES + 1} timed out after ${GEMINI_TIMEOUT_MS / 1000}s`
          );
          // Treat timeout as transient — retry
          if (attempt < MAX_RETRIES) {
            const delay = INITIAL_DELAY_MS * Math.pow(2, attempt) + Math.random() * 300;
            console.warn(`[Gemini API] Retrying in ${Math.round(delay)}ms...`);
            await sleep(delay);
            continue;
          }
          break;
        }

        const isTransient = isTransientGeminiError(err);
        console.error(
          `[Gemini API] Request attempt ${attempt + 1}/${MAX_RETRIES + 1} failed (transient=${isTransient}):`,
          err instanceof Error ? err.message : err
        );

        if (attempt < MAX_RETRIES && isTransient) {
          const delay = INITIAL_DELAY_MS * Math.pow(2, attempt) + Math.random() * 300;
          console.warn(`[Gemini API] Retrying in ${Math.round(delay)}ms...`);
          await sleep(delay);
          continue;
        }

        // Non-transient or retries exhausted
        break;
      }
    }

    if (!responseText) {
      // Check for timeout
      if (lastError instanceof Error && lastError.name === "AbortError") {
        return NextResponse.json(
          {
            success: false,
            error: "The AI generation timed out. Please try again with a shorter lesson text.",
          },
          { status: 504 }
        );
      }

      if (lastError && isTransientGeminiError(lastError)) {
        return NextResponse.json(
          {
            success: false,
            error: "The AI service is temporarily busy. Please try again in a moment.",
          },
          { status: 503 }
        );
      }

      const isAuthError =
        lastError instanceof Error &&
        (lastError.message.includes("API_KEY_INVALID") || lastError.message.includes("API key not valid"));

      if (isAuthError) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid Gemini API key. Please verify your GEMINI_API_KEY in .env.local.",
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate learning kit. Please try again in a moment.",
        },
        { status: 500 }
      );
    }

    // --- Parse and validate (C1, H2, M1) ---
    let rawParsed: Record<string, unknown>;
    try {
      rawParsed = JSON.parse(responseText);
    } catch {
      console.error("[Gemini API] Failed to parse response as JSON:", responseText.substring(0, 500));
      return NextResponse.json(
        {
          success: false,
          error: "The AI returned an invalid response format. Please try again.",
        },
        { status: 502 }
      );
    }

    const { valid, warnings, kit: learningKit } = validateAndRepairLearningKit(rawParsed);

    if (warnings.length > 0) {
      console.warn(`[Gemini API] Validation produced ${warnings.length} warning(s):`, warnings);
    }

    if (!valid) {
      console.error("[Gemini API] Generated kit failed minimum validation:", warnings);
      return NextResponse.json(
        {
          success: false,
          error: "The AI generated an incomplete learning kit. Please try again.",
        },
        { status: 502 }
      );
    }

    learningKit.verificationStatus = learningKit.quality.reviewRequired ? "needs_review" : "ai_generated";

    return NextResponse.json({
      success: true,
      data: learningKit,
    });
  } catch (error: unknown) {
    console.error("[generate-lesson route error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred while processing the lesson kit.",
      },
      { status: 500 }
    );
  }
}
