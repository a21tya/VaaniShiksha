import type { LearningKit } from "../types/lesson";
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);
const strings = (value: unknown, fields: string[]) => record(value) && fields.every(field => typeof value[field] === "string" && (value[field] as string).trim().length > 0);
export function validateOfflineKit(raw: unknown, input: { title: string; lessonText: string; grade: string; subject: string; sourceLanguage: string; targetLanguage: string }): LearningKit {
  const fail = (part: string) => { throw new Error(`The local model produced an incomplete ${part}. Try shorter source text or use a saved lesson. Nothing has been saved.`); };
  if (!record(raw)) return fail("response");
  if (!strings(raw.lesson, ["hindi", "santhali", "romanization", "simpleExplanation"]) || !strings(raw.activity, ["title", "instructions"])) return fail("lesson or activity");
  for (const [key, fields] of [["vocabulary", ["hindi", "santhali", "romanization", "meaning"]], ["flashcards", ["front", "back"]]] as const) {
    if (!Array.isArray(raw[key]) || !raw[key].length || !raw[key].every(item => strings(item, [...fields]))) return fail(key);
  }
  if (!Array.isArray(raw.quiz) || !raw.quiz.length || !raw.quiz.every(question => strings(question, ["question", "correctAnswer"]) && Array.isArray(question.options) && question.options.length === 4 && question.options.every((option: unknown) => typeof option === "string" && option.trim()) && new Set(question.options).size === 4 && question.options.includes(question.correctAnswer))) return fail("quiz");
  const lesson = raw.lesson as LearningKit["lesson"];
  if (input.targetLanguage === "Santhali" && !/[\u1c50-\u1c7f]/u.test(lesson.santhali)) throw new Error("The local model could not produce an Ol Chiki translation. Use a teacher-reviewed Santali lesson; this model's Santali quality is not verified.");
  return {
    title: input.title, grade: input.grade, subject: input.subject,
    sourceLanguage: input.sourceLanguage as LearningKit["sourceLanguage"], targetLanguage: input.targetLanguage as LearningKit["targetLanguage"],
    lesson: { ...lesson, hindi: input.lessonText }, vocabulary: raw.vocabulary as LearningKit["vocabulary"], flashcards: raw.flashcards as LearningKit["flashcards"], quiz: raw.quiz as LearningKit["quiz"], activity: raw.activity as LearningKit["activity"],
    quality: { reviewRequired: true, confidence: "low", reviewNotes: "Generated on this device by a small experimental model. A teacher must check facts, translations and answers. Santali quality is not verified." }, verificationStatus: "needs_review",
  };
}
