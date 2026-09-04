import { LearningKit, SavedLesson, AudioRecord } from "@/types/lesson";
import { DEMO_SAVED_LESSON, DEMO_SAVED_LESSON_COUNTING, DEMO_SAVED_LESSON_ANIMALS } from "@/lib/demo-data";
import { get, set, createStore, del, keys } from "idb-keyval";

const STORAGE_KEY = "vaanishiksha_saved_lessons_v1";
let audioStore: ReturnType<typeof createStore> | undefined;

function getAudioStore() {
  if (typeof window === "undefined") return undefined;
  if (!audioStore) {
    audioStore = createStore("vaanishiksha_audio_cache_v1", "audio_store");
  }
  return audioStore;
}

export async function getSavedLessons(): Promise<SavedLesson[]> {
  if (typeof window === "undefined") return [];

  try {
    const data = await get<SavedLesson[]>(STORAGE_KEY);
    if (!data || !Array.isArray(data)) {
      // Seed initial demo lesson if library is empty
      const initial = [DEMO_SAVED_LESSON];
      await set(STORAGE_KEY, initial);
      return initial;
    }
    return data;
  } catch (err) {
    console.error("Error reading saved lessons from IndexedDB:", err);
    return [DEMO_SAVED_LESSON];
  }
}

export async function getSavedLessonById(id: string): Promise<SavedLesson | null> {
  if (id === "demo-plants" || id === "demo-plants-around-us") return DEMO_SAVED_LESSON;
  if (id === "demo-counting") return DEMO_SAVED_LESSON_COUNTING;
  if (id === "demo-animals") return DEMO_SAVED_LESSON_ANIMALS;
  const lessons = await getSavedLessons();
  return lessons.find((l) => l.id === id) || null;
}

export async function saveLessonToLibrary(kit: LearningKit, existingId?: string): Promise<SavedLesson> {
  const lessons = await getSavedLessons();
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
      await set(STORAGE_KEY, lessons);
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
  await set(STORAGE_KEY, lessons);
  return newSavedLesson;
}

export async function updateSavedLesson(id: string, kit: LearningKit): Promise<SavedLesson | null> {
  return await saveLessonToLibrary(kit, id);
}

export async function deleteSavedLesson(id: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  try {
    const lessons = await getSavedLessons();
    const filtered = lessons.filter((l) => l.id !== id);
    await set(STORAGE_KEY, filtered);
    
    // Also remove associated audio from cache
    await deleteAudioForLesson(id);
    
    return true;
  } catch (err) {
    console.error("Error deleting lesson from IndexedDB:", err);
    return false;
  }
}

// --- Audio Cache Operations ---

export async function saveAudioBlob(audioId: string, blob: Blob, lessonId: string): Promise<void> {
  const store = getAudioStore();
  if (!store) return;
  const record: AudioRecord = { id: audioId, blob, lessonId };
  await set(audioId, record, store);
}

export async function getAudioBlob(audioId: string): Promise<Blob | null> {
  const store = getAudioStore();
  if (!store) return null;
  const record = await get<AudioRecord>(audioId, store);
  return record ? record.blob : null;
}

export async function deleteAudioForLesson(lessonId: string): Promise<void> {
  const store = getAudioStore();
  if (!store) return;
  
  try {
    const allKeys = await keys(store);
    for (const key of allKeys) {
      const record = await get<AudioRecord>(key, store);
      if (record && record.lessonId === lessonId) {
        await del(key, store);
      }
    }
  } catch (err) {
    console.error("Error deleting audio for lesson from IndexedDB:", err);
  }
}
