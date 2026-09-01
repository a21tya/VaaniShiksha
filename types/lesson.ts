export interface LearningKit {
  title: string;
  sourceLanguage: "Hindi";
  targetLanguage: "Santhali";
  grade: string;
  subject: string;
  lesson: {
    hindi: string;
    santhali: string;
    romanization: string;
    simpleExplanation: string;
  };
  vocabulary: Array<{
    hindi: string;
    santhali: string;
    romanization: string;
    meaning: string;
  }>;
  flashcards: Array<{
    front: string;
    back: string;
  }>;
  quiz: Array<{
    question: string;
    options: [string, string, string, string];
    correctAnswer: string;
  }>;
  activity: {
    title: string;
    instructions: string;
  };
  quality: {
    reviewRequired: boolean;
    confidence: "high" | "medium" | "low";
    reviewNotes: string;
  };
}

export interface GenerateLessonRequest {
  lessonText: string;
  grade: string;
  subject: string;
  targetLanguage: "Santhali";
}

export type GenerateLessonResponse =
  | {
      success: true;
      data: LearningKit;
    }
  | {
      success: false;
      error: string;
    };
