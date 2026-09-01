import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { LearningKit, GenerateLessonResponse } from "@/types/lesson";

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000;

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

export async function POST(request: NextRequest): Promise<NextResponse<GenerateLessonResponse>> {
  try {
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
6. Educational Content: Produce rich pedagogical materials: simplified explanation, key vocabulary flashcards with clear child-friendly meanings, a multiple-choice quiz with 3-4 options and one clear correct answer, and an interactive tactile classroom activity.
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
                  description: "4 multiple choice options",
                },
                correctAnswer: { type: Type.STRING, description: "Exact string matching one of the options" },
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
        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: userPrompt,
          config: generateConfig,
        });

        responseText = response.text ?? null;
        if (responseText) {
          break;
        }
      } catch (err: unknown) {
        lastError = err;
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

    const learningKit: LearningKit = JSON.parse(responseText);

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
