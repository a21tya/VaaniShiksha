import { LearningKit, SavedLesson } from "@/types/lesson";

const STORAGE_KEY = "vaanishiksha_saved_lessons_v1";

const DEMO_SAVED_LESSON: SavedLesson = {
  id: "demo-plants-around-us",
  title: "Plants Around Us (हमारे आसपास के पौधे)",
  grade: "Grade 2",
  subject: "Environmental Studies",
  sourceLanguage: "Hindi",
  targetLanguage: "Santhali",
  createdAt: "2026-09-01T10:00:00.000Z",
  updatedAt: "2026-09-01T10:00:00.000Z",
  verificationStatus: "verified",
  verifiedAt: "09:30 AM, 09/01/2026",
  verifiedBy: "Teacher",
  kit: {
    title: "Plants Around Us (हमारे आसपास के पौधे / ᱟᱵᱚ ᱨᱮᱱᱟᱜ ᱫᱟᱨᱮ ᱠᱚ)",
    sourceLanguage: "Hindi",
    targetLanguage: "Santhali",
    grade: "Grade 2",
    subject: "Environmental Studies",
    verificationStatus: "verified",
    verifiedAt: "09:30 AM, 09/01/2026",
    verifiedBy: "Teacher",
    lesson: {
      hindi: "हमारे आसपास कई प्रकार के पौधे होते हैं। कुछ पौधे बड़े होते हैं जिन्हें पेड़ कहते हैं, और कुछ पौधे छोटे होते हैं।",
      santhali: "ᱟᱵᱚ ᱯᱟᱦᱴᱟ ᱨᱮ ᱟᱭᱢᱟ ᱞᱮᱠᱟᱱ ᱫᱟᱨᱮ ᱠᱚ ᱢᱮᱱᱟᱜ-ᱟ: ᱫᱟᱨᱮ (Dare), ᱥᱟᱠᱟᱢ (Sakam), ᱵᱟᱦᱟ (Baha) ᱟᱨ ᱨᱮᱦᱮᱫ (Rehed)᱾",
      romanization: "Abo pahta re aima lekan dare ko menag-a: dare, sakam, baha ar rehed.",
      simpleExplanation: "पौधों के अलग-अलग भाग जैसे जड़, तना, पत्ता और फूल हमारे जीवन के लिए अति आवश्यक हैं।"
    },
    vocabulary: [
      {
        hindi: "पौधा (Paudha)",
        santhali: "ᱫᱟᱨᱮ",
        romanization: "Dare",
        meaning: "A living thing that grows in earth with roots, stems, and leaves."
      },
      {
        hindi: "पत्ता (Patta)",
        santhali: "ᱥᱟᱠᱟᱢ",
        romanization: "Sakam",
        meaning: "The flat green part of a plant that catches sunlight."
      },
      {
        hindi: "फूल (Phool)",
        santhali: "ᱵᱟᱦᱟ",
        romanization: "Baha",
        meaning: "The colorful part of a plant that blooms."
      },
      {
        hindi: "जड़ (Jad)",
        santhali: "ᱨᱮᱦᱮᱫ",
        romanization: "Rehed",
        meaning: "The part underground that drinks water for the plant."
      }
    ],
    flashcards: [
      {
        front: "पौधे को संथाली (Ol Chiki) में क्या कहते हैं?",
        back: "ᱫᱟᱨᱮ (Dare) - Plant / Tree"
      },
      {
        front: "पत्ते को संथाली (Ol Chiki) में क्या कहते हैं?",
        back: "ᱥᱟᱠᱟᱢ (Sakam) - Leaf"
      },
      {
        front: "फूल को संथाली (Ol Chiki) में क्या कहते हैं?",
        back: "ᱵᱟᱦᱟ (Baha) - Flower"
      },
      {
        front: "जड़ को संथाली (Ol Chiki) में क्या कहते हैं?",
        back: "ᱨᱮᱦᱮᱫ (Rehed) - Root"
      }
    ],
    quiz: [
      {
        question: "पौधे का कौन सा भाग ज़मीन के नीचे रहता है?",
        options: [
          "ᱥᱟᱠᱟᱢ (Sakam / पत्ता)",
          "ᱨᱮᱦᱮᱫ (Rehed / जड़)",
          "ᱵᱟᱦᱟ (Baha / फूल)",
          "ᱫᱟᱨᱮ (Dare / पौधा)"
        ],
        correctAnswer: "ᱨᱮᱦᱮᱫ (Rehed / जड़)"
      },
      {
        question: "संथाली शब्द 'ᱵᱟᱦᱟ' (Baha) का हिंदी अर्थ क्या है?",
        options: ["जड़", "तना", "फूल", "फल"],
        correctAnswer: "फूल"
      }
    ],
    activity: {
      title: "Leaf Collector Challenge (ᱥᱟᱠᱟᱢ Game)",
      instructions: "1. Find 3 different leaves in your school yard.\n2. Bring them to class and say their names in Santhali (ᱥᱟᱠᱟᱢ - Sakam) to your teacher!"
    },
    quality: {
      reviewRequired: false,
      confidence: "high",
      reviewNotes: "Verified standard Santhali primary lesson kit."
    }
  }
};

export function getSavedLessons(): SavedLesson[] {
  if (typeof window === "undefined") return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // Seed initial demo lesson if library is empty
      const initial = [DEMO_SAVED_LESSON];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: SavedLesson[] = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [DEMO_SAVED_LESSON];
  } catch (err) {
    console.error("Error reading saved lessons from localStorage:", err);
    return [DEMO_SAVED_LESSON];
  }
}

export function getSavedLessonById(id: string): SavedLesson | null {
  const lessons = getSavedLessons();
  return lessons.find((l) => l.id === id) || null;
}

export function saveLessonToLibrary(kit: LearningKit, existingId?: string): SavedLesson {
  const lessons = getSavedLessons();
  const now = new Date().toISOString();

  const status = kit.verificationStatus || (kit.quality.reviewRequired ? "needs_review" : "ai_generated");

  if (existingId) {
    const idx = lessons.findIndex((l) => l.id === existingId);
    if (idx !== -1) {
      const updatedLesson: SavedLesson = {
        ...lessons[idx],
        title: kit.title,
        grade: kit.grade,
        subject: kit.subject,
        updatedAt: now,
        verificationStatus: status,
        verifiedAt: kit.verifiedAt || lessons[idx].verifiedAt,
        verifiedBy: kit.verifiedBy || lessons[idx].verifiedBy,
        kit: {
          ...kit,
          verificationStatus: status,
        },
      };
      lessons[idx] = updatedLesson;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
      return updatedLesson;
    }
  }

  // Create new saved lesson
  const newId = `lesson-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const newSavedLesson: SavedLesson = {
    id: newId,
    title: kit.title,
    grade: kit.grade,
    subject: kit.subject,
    sourceLanguage: kit.sourceLanguage || "Hindi",
    targetLanguage: kit.targetLanguage || "Santhali",
    createdAt: now,
    updatedAt: now,
    verificationStatus: status,
    verifiedAt: kit.verifiedAt,
    verifiedBy: kit.verifiedBy,
    kit: {
      ...kit,
      verificationStatus: status,
    },
  };

  lessons.unshift(newSavedLesson);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lessons));
  return newSavedLesson;
}

export function updateSavedLesson(id: string, kit: LearningKit): SavedLesson | null {
  return saveLessonToLibrary(kit, id);
}

export function deleteSavedLesson(id: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    const lessons = getSavedLessons();
    const filtered = lessons.filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error("Error deleting lesson from localStorage:", err);
    return false;
  }
}
