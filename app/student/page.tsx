"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import PageContainer from "@/components/PageContainer";
import { LearningKit, SavedLesson } from "@/types/lesson";
import { getSavedLessonById } from "@/lib/storage";

const DEFAULT_DEMO_KIT: LearningKit = {
  title: "Plants Around Us (हमारे आसपास के पौधे)",
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
};

const STEPS = [
  { id: 1, name: "Story Lesson", icon: "📖" },
  { id: 2, name: "Vocabulary", icon: "🔤" },
  { id: 3, name: "Flashcards", icon: "📇" },
  { id: 4, name: "Quiz", icon: "📝" },
  { id: 5, name: "Activity", icon: "🎨" },
];

function StudentModeContent() {
  const searchParams = useSearchParams();
  const lessonIdParam = searchParams.get("id");

  const [savedLesson, setSavedLesson] = useState<SavedLesson | null>(null);
  const [kit, setKit] = useState<LearningKit>(DEFAULT_DEMO_KIT);
  const [currentStep, setCurrentStep] = useState(1);

  // Flashcards state
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{ [qIdx: number]: string }>({});

  useEffect(() => {
    if (lessonIdParam) {
      const loaded = getSavedLessonById(lessonIdParam);
      if (loaded) {
        const timer = setTimeout(() => {
          setSavedLesson(loaded);
          setKit(loaded.kit);
        }, 0);
        return () => clearTimeout(timer);
      }
    }
  }, [lessonIdParam]);

  const currentCard = kit.flashcards && kit.flashcards.length > 0 ? kit.flashcards[activeCardIndex] : null;

  return (
    <PageContainer className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Primary Student Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <span className="inline-block px-3.5 py-1 bg-white/20 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-xs">
              🎒 Student Corner • {kit.grade || "Grade 2"} {kit.subject || "EVS"}
            </span>

            {/* Verification Badge */}
            {(savedLesson?.verificationStatus === "verified" || kit.verificationStatus === "verified") ? (
              <span className="inline-block px-3 py-1 bg-emerald-950/80 text-emerald-200 border border-emerald-400 rounded-full text-xs font-bold shadow-2xs">
                ✅ Verified by Teacher
              </span>
            ) : (savedLesson?.verificationStatus === "needs_review" || kit.verificationStatus === "needs_review") ? (
              <span className="inline-block px-3 py-1 bg-amber-950/80 text-amber-200 border border-amber-400 rounded-full text-xs font-bold">
                ⚠️ Needs Review
              </span>
            ) : (
              <span className="inline-block px-3 py-1 bg-blue-950/80 text-blue-200 border border-blue-400 rounded-full text-xs font-bold">
                🤖 AI Generated
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {kit.title}
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg font-medium font-santhali">
            {kit.lesson.santhali}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/25 text-xs sm:text-sm">
            <span>Pair:</span>
            <span className="font-bold bg-white text-emerald-950 px-2.5 py-1 rounded-lg">
              {kit.sourceLanguage || "Hindi"} ➔ {kit.targetLanguage || "Santhali"}
            </span>
          </div>

          <Link
            href="/lessons"
            className="text-xs text-emerald-100 hover:text-white underline font-semibold"
          >
            ← Back to Lesson Library
          </Link>
        </div>
      </div>

      {/* Child-Friendly Progression Navigation Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-2xs">
        <div className="grid grid-cols-5 gap-1 text-center">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(step.id)}
                className={`py-2.5 sm:py-3 px-1 rounded-xl text-xs sm:text-sm font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 ${
                  isActive
                    ? "bg-emerald-700 text-white shadow-xs"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-base sm:text-lg">{step.icon}</span>
                <span className="hidden xs:inline sm:inline">{step.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Story Lesson */}
      {currentStep === 1 && (
        <section className="bg-white rounded-3xl border border-emerald-200/80 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>📖 Lesson Story & Vernacular Adaptation</span>
            </h2>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Primary Read-Aloud
            </span>
          </div>

          <div className="space-y-4">
            {/* Hindi Source Box */}
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Hindi (Curriculum Text)
              </span>
              <p className="font-medium text-slate-900 text-lg sm:text-xl leading-relaxed">
                {kit.lesson.hindi}
              </p>
            </div>

            {/* Santhali Adaptation Box */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Santhali Vernacular Adaptation (Ol Chiki Script)
              </span>
              <p className="font-santhali font-bold text-emerald-950 text-xl sm:text-2xl leading-relaxed">
                {kit.lesson.santhali}
              </p>
              {kit.lesson.romanization && (
                <p className="text-xs sm:text-sm text-emerald-800 pt-1">
                  <strong>Pronunciation:</strong> {kit.lesson.romanization}
                </p>
              )}
            </div>

            {/* Concept Takeaway */}
            {kit.lesson.simpleExplanation && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800">
                <strong className="text-slate-900">💡 Key Concept Takeaway:</strong>{" "}
                {kit.lesson.simpleExplanation}
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 text-sm font-bold rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-2xs flex items-center gap-2"
            >
              <span>Next: Learn Vocabulary</span>
              <span>➔</span>
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: Vocabulary */}
      {currentStep === 2 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Vocabulary Words
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Learn key terms in Hindi and Santhali (Ol Chiki)
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300">
              {kit.vocabulary.length} Words
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {kit.vocabulary.map((vocab, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border-2 border-emerald-200 shadow-2xs space-y-3 hover:border-emerald-400 transition-all"
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-bold text-slate-900">{vocab.hindi}</span>
                  <span className="text-xs font-semibold text-slate-500">({vocab.romanization})</span>
                </div>
                <div className="font-santhali font-extrabold text-3xl text-emerald-900">
                  {vocab.santhali}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-100 italic">
                  &ldquo;{vocab.meaning}&rdquo;
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-between gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 text-sm font-bold rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              ◀ Back to Story
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 text-sm font-bold rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800 shadow-2xs"
            >
              Next: Try Flashcards ➔
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: Flashcards */}
      {currentStep === 3 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Interactive Flashcards
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Tap card to flip between question and Santhali translation
              </p>
            </div>

            <span className="text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300">
              Card {activeCardIndex + 1} of {kit.flashcards.length}
            </span>
          </div>

          {currentCard && (
            <div className="bg-white rounded-3xl border-2 border-emerald-300 p-8 shadow-sm text-center flex flex-col items-center space-y-5 transition-all">
              <div
                onClick={() => setIsCardFlipped(!isCardFlipped)}
                className="cursor-pointer w-full min-h-[180px] p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 flex flex-col items-center justify-center text-center space-y-3 transition-transform hover:scale-[1.01]"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-amber-900">
                  {isCardFlipped ? "Back (Answer / Santhali)" : "Front (Click to Flip)"}
                </span>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-santhali">
                  {isCardFlipped ? currentCard.back : currentCard.front}
                </p>
                <span className="text-xs text-amber-800 font-semibold italic">
                  {isCardFlipped ? "Click to see front" : "Click to reveal answer"}
                </span>
              </div>

              <div className="flex items-center justify-center gap-4 w-full max-w-sm">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCardIndex(
                      (prev) => (prev - 1 + kit.flashcards.length) % kit.flashcards.length
                    );
                    setIsCardFlipped(false);
                  }}
                  className="flex-1 py-3 px-4 text-xs sm:text-sm font-bold rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200"
                >
                  ◀ Previous
                </button>
                <button
                  type="button"
                  onClick={() => setIsCardFlipped(!isCardFlipped)}
                  className="flex-1 py-3 px-4 text-xs sm:text-sm font-bold rounded-2xl bg-amber-600 text-white hover:bg-amber-700 shadow-2xs"
                >
                  🔄 Flip
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCardIndex((prev) => (prev + 1) % kit.flashcards.length);
                    setIsCardFlipped(false);
                  }}
                  className="flex-1 py-3 px-4 text-xs sm:text-sm font-bold rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200"
                >
                  Next ▶
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-between gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 text-sm font-bold rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              ◀ Back to Vocab
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 text-sm font-bold rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800 shadow-2xs"
            >
              Next: Take Quiz ➔
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: Quiz */}
      {currentStep === 4 && (
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Comprehension Quiz
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Answer questions to check understanding of Santhali terms
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-300">
              {kit.quiz.length} Questions
            </span>
          </div>

          <div className="space-y-6">
            {kit.quiz.map((q, qIdx) => {
              const selectedAnswer = selectedQuizAnswers[qIdx];

              return (
                <div key={qIdx} className="space-y-3">
                  <p className="text-base sm:text-lg font-bold text-slate-900">
                    {qIdx + 1}. {q.question}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswer === opt;
                      const isCorrect = opt === q.correctAnswer;
                      const showResult = Boolean(selectedAnswer);

                      let buttonStyle = "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800";
                      if (showResult) {
                        if (isCorrect) {
                          buttonStyle = "bg-emerald-100 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400";
                        } else if (isSelected && !isCorrect) {
                          buttonStyle = "bg-red-100 border-red-400 text-red-950 font-bold";
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            setSelectedQuizAnswers((prev) => ({
                              ...prev,
                              [qIdx]: opt,
                            }));
                          }}
                          className={`p-4 rounded-2xl border text-left text-sm font-santhali transition-all ${buttonStyle}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {selectedAnswer && (
                    <p className="text-xs sm:text-sm font-semibold mt-1">
                      {selectedAnswer === q.correctAnswer ? (
                        <span className="text-emerald-700">✅ Correct answer! Excellent!</span>
                      ) : (
                        <span className="text-red-600">
                          ❌ Try again. Correct answer: {q.correctAnswer}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between gap-4">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 text-sm font-bold rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              ◀ Back to Flashcards
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="px-6 py-3 text-sm font-bold rounded-2xl bg-emerald-700 text-white hover:bg-emerald-800 shadow-2xs"
            >
              Next: Classroom Activity ➔
            </button>
          </div>
        </section>
      )}

      {/* STEP 5: Activity & Completion */}
      {currentStep === 5 && (
        <section className="space-y-6">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shrink-0">
                🎨
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                  Classroom Activity Challenge
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {kit.activity.title}
                </h2>
              </div>
            </div>

            <p className="text-base sm:text-lg text-amber-50 leading-relaxed whitespace-pre-line">
              {kit.activity.instructions}
            </p>
          </div>

          {/* Completion Celebration State */}
          <div className="bg-white rounded-3xl border-2 border-emerald-300 p-8 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-900 font-bold text-3xl flex items-center justify-center mx-auto">
              🌟
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-slate-900">
                Lesson Completed!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Great job studying <strong>{kit.title}</strong> in Santhali!
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedQuizAnswers({});
                  setActiveCardIndex(0);
                }}
                className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                🔄 Restart Lesson
              </button>
              <Link
                href="/lessons"
                className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow-2xs"
              >
                📚 Return to Lesson Library
              </Link>
            </div>
          </div>

          <div className="pt-2 flex justify-start">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 text-sm font-bold rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200"
            >
              ◀ Back to Quiz
            </button>
          </div>
        </section>
      )}

      {/* Demo Notice */}
      <div className="text-center p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-600">
        <p>
          💡 <strong>Student Mode:</strong> Interactive primary learner view connected to the teacher&apos;s saved lesson library.
        </p>
      </div>
    </PageContainer>
  );
}

export default function StudentModePage() {
  return (
    <Suspense
      fallback={
        <PageContainer className="max-w-4xl mx-auto py-12 text-center text-slate-500">
          Loading student learning mode...
        </PageContainer>
      }
    >
      <StudentModeContent />
    </Suspense>
  );
}
