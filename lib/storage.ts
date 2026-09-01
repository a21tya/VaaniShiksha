import { LearningKit, SavedLesson } from "@/types/lesson";
import { DEMO_SAVED_LESSON } from "@/lib/demo-data";

const STORAGE_KEY = "vaanishiksha_saved_lessons_v1";

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
