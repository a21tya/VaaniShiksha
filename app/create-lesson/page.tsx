"use client";

import { useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import LanguageSelector from "@/components/LanguageSelector";
import { LearningKit, GenerateLessonResponse } from "@/types/lesson";

export default function CreateLessonPage() {
  const [title, setTitle] = useState("Plants Around Us (हमारे आसपास के पौधे)");
  const [grade, setGrade] = useState("Grade 2");
  const [subject, setSubject] = useState("Environmental Studies");
  const [sourceLang, setSourceLang] = useState("Hindi");
  const [targetLang, setTargetLang] = useState("Santhali");
  const [content, setContent] = useState(
    "हमारे आसपास कई प्रकार के पौधे पाए जाते हैं। पौधों के मुख्य भाग होते हैं: जड़, तना, पत्ता और फूल। पौधे हमें ताज़ी हवा और फल देते हैं।"
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Learning Kit State
  const [learningKit, setLearningKit] = useState<LearningKit | null>(null);
  
  // Teacher Review & Verification States
  const [isEditing, setIsEditing] = useState(false);
  const [editableKit, setEditableKit] = useState<LearningKit | null>(null);

  // Flashcard & Quiz Interactive States
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{ [qIdx: number]: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setIsEditing(false);

    try {
      const response = await fetch("/api/generate-lesson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonText: content,
          grade,
          subject,
          targetLanguage: targetLang,
        }),
      });

      const result: GenerateLessonResponse = await response.json();

      if (!response.ok || !result.success) {
        setErrorMessage(
          result.success === false
            ? result.error
            : "An unexpected error occurred while generating the lesson kit."
        );
        return;
      }

      setLearningKit(result.data);
      setEditableKit(null);
      setActiveCardIndex(0);
      setIsCardFlipped(false);
      setSelectedQuizAnswers({});

      // Scroll smoothly to result
      setTimeout(() => {
        document.getElementById("generated-kit-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to communicate with server.";
      setErrorMessage(`Network or server error: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Review & Verification Action Handlers
  const handleStartEditing = () => {
    if (!learningKit) return;
    setEditableKit(JSON.parse(JSON.stringify(learningKit)));
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setEditableKit(null);
    setIsEditing(false);
  };

  const handleSaveEdits = () => {
    if (!editableKit) return;
    setLearningKit(JSON.parse(JSON.stringify(editableKit)));
    setIsEditing(false);
  };

  const handleApproveAndVerify = () => {
    const baseKit = editableKit || learningKit;
    if (!baseKit) return;

    const updatedKit: LearningKit = JSON.parse(JSON.stringify(baseKit));
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const formattedDate = now.toLocaleDateString();

    updatedKit.verificationStatus = "verified";
    updatedKit.verifiedAt = `${formattedTime}, ${formattedDate}`;
    updatedKit.verifiedBy = "Teacher";

    setLearningKit(updatedKit);
    setEditableKit(null);
    setIsEditing(false);
  };

  return (
    <PageContainer className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Breadcrumb & Title */}
      <div>
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-2">
          <Link href="/teacher" className="hover:text-amber-700">
            Teacher Dashboard
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Create New Lesson</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Mother-Tongue Lesson Kit
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1">
          Provide standard textbook material in Hindi to generate Santhali pedagogical adaptations powered by Gemini 3.6 Flash.
        </p>
      </div>

      {/* Language Selector Component */}
      <LanguageSelector
        sourceLang={sourceLang}
        targetLang={targetLang}
        onChangeSource={setSourceLang}
        onChangeTarget={setTargetLang}
        isEditable={true}
      />

      {/* Lesson Creation Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lesson Title */}
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="lesson-title"
              className="block text-sm font-bold uppercase tracking-wider text-slate-800"
            >
              Lesson Title <span className="text-amber-600">*</span>
            </label>
            <input
              id="lesson-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Plants Around Us (हमारे आसपास के पौधे)"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm sm:text-base focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
            />
          </div>

          {/* Grade Select */}
          <div className="space-y-2">
            <label
              htmlFor="grade-select"
              className="block text-sm font-bold uppercase tracking-wider text-slate-800"
            >
              Grade Level <span className="text-amber-600">*</span>
            </label>
            <select
              id="grade-select"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm sm:text-base focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
            >
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 5">Grade 5</option>
            </select>
          </div>

          {/* Subject Select */}
          <div className="space-y-2">
            <label
              htmlFor="subject-select"
              className="block text-sm font-bold uppercase tracking-wider text-slate-800"
            >
              Subject <span className="text-amber-600">*</span>
            </label>
            <select
              id="subject-select"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm sm:text-base focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
            >
              <option value="Hindi">Hindi</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Environmental Studies">Environmental Studies</option>
              <option value="Science">Science</option>
            </select>
          </div>
        </div>

        {/* Source Content Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="lesson-content"
              className="block text-sm font-bold uppercase tracking-wider text-slate-800"
            >
              Source Lesson Content ({sourceLang}) <span className="text-amber-600">*</span>
            </label>
            <span className="text-xs text-slate-500">
              Paste textbook paragraph or teacher notes
            </span>
          </div>
          <textarea
            id="lesson-content"
            required
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type or paste standard Hindi textbook content here..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm sm:text-base leading-relaxed focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
          />
        </div>

        {/* Action Button & Loading Indicator */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-sm sm:text-base shadow-xs transition-all flex items-center justify-center gap-2.5 ${
              isLoading
                ? "bg-amber-400 text-amber-950 cursor-wait"
                : "bg-amber-600 text-white hover:bg-amber-700 active:scale-98"
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-amber-950"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Generating Santhali Learning Kit...</span>
              </>
            ) : (
              <>
                <span>✨ Generate Learning Kit</span>
              </>
            )}
          </button>

          <Link
            href="/teacher"
            className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel & Return to Dashboard
          </Link>
        </div>

        {/* Error Notification Banner */}
        {errorMessage && (
          <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-950 text-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-red-800">
              <span className="text-lg">⚠️</span>
              <span>Generation Error</span>
            </div>
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}
      </form>

      {/* Generated Learning Kit & Teacher Review Section */}
      {learningKit && (
        <div id="generated-kit-section" className="flex flex-col gap-8 pt-4">
          
          {/* Educational Safety Banner */}
          <div className="bg-amber-50 border border-amber-200 text-amber-950 p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0">
              🛡️
            </div>
            <div className="flex-1">
              <p className="font-bold text-amber-950">
                Educational Quality Guardrail:
              </p>
              <p className="text-amber-900">
                AI-generated translations should be reviewed by a teacher before classroom use.
              </p>
            </div>
          </div>

          {/* Verification Status & Review Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                    {learningKit.grade} • {learningKit.subject}
                  </span>

                  {/* Verification Status Badge */}
                  {learningKit.verificationStatus === "verified" ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                      <span>✅ Verified by Teacher</span>
                    </span>
                  ) : learningKit.verificationStatus === "needs_review" ? (
                    <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
                      ⚠️ Needs Review
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200">
                      🤖 AI Generated
                    </span>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableKit?.title || ""}
                      onChange={(e) =>
                        setEditableKit((prev) =>
                          prev ? { ...prev, title: e.target.value } : null
                        )
                      }
                      className="w-full px-3 py-1.5 text-2xl font-bold border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                    />
                  ) : (
                    learningKit.title
                  )}
                </h2>

                {learningKit.verificationStatus === "verified" && learningKit.verifiedAt && (
                  <p className="text-xs text-emerald-800 mt-1 font-medium">
                    Verified by {learningKit.verifiedBy || "Teacher"} on {learningKit.verifiedAt}
                  </p>
                )}
              </div>

              {/* AI Confidence vs Teacher Verification Info */}
              <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    AI Confidence:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      learningKit.quality.confidence === "high"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : learningKit.quality.confidence === "medium"
                        ? "bg-amber-100 text-amber-800 border border-amber-300"
                        : "bg-red-100 text-red-800 border border-red-300"
                    }`}
                  >
                    {learningKit.quality.confidence}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 italic max-w-xs text-right hidden sm:inline-block">
                  AI confidence scores automated accuracy; Teacher verification confirms pedagogical readiness.
                </span>
              </div>
            </div>

            {/* Action Bar for Review, Edit, Save, and Approve */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-700 flex items-center gap-2">
                <span className="text-base">👩‍🏫</span>
                <span className="font-semibold">
                  {isEditing
                    ? "Editing Mode Active: Modify Santhali translations, vocabulary, or quiz questions below."
                    : learningKit.verificationStatus === "verified"
                    ? "This lesson kit has been reviewed and verified by a teacher for classroom presentation."
                    : "Review AI translations below, make any corrections, and click 'Approve & Verify'."}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancelEditing}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdits}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-2xs"
                    >
                      💾 Save Edits
                    </button>
                    <button
                      type="button"
                      onClick={handleApproveAndVerify}
                      className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
                    >
                      ✅ Save & Approve
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleStartEditing}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs"
                    >
                      ✏️ Edit Content
                    </button>
                    <button
                      type="button"
                      onClick={handleApproveAndVerify}
                      className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-xs"
                    >
                      {learningKit.verificationStatus === "verified" ? "Re-verify Kit" : "✅ Approve & Verify"}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Quality Notes */}
            {learningKit.quality.reviewNotes && (
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs sm:text-sm text-slate-700">
                <span className="font-bold text-amber-950 block mb-1">
                  🔍 Model Linguistic Notes:
                </span>
                <p>{learningKit.quality.reviewNotes}</p>
              </div>
            )}
          </div>

          {/* Dual-Language Lesson Story Card */}
          <section className="bg-white rounded-3xl border border-emerald-200 p-6 md:p-8 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>📖 Lesson Story & Vernacular Adaptation</span>
              </h3>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {isEditing ? "Editable Fields" : "Classroom Ready"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hindi Source */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Hindi (Source Curriculum)
                </span>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={editableKit?.lesson.hindi || ""}
                    onChange={(e) =>
                      setEditableKit((prev) =>
                        prev
                          ? {
                              ...prev,
                              lesson: { ...prev.lesson, hindi: e.target.value },
                            }
                          : null
                      )
                    }
                    className="w-full p-3 rounded-xl border border-amber-300 text-sm font-medium text-slate-900 bg-white"
                  />
                ) : (
                  <p className="font-medium text-slate-900 text-base sm:text-lg leading-relaxed">
                    {learningKit.lesson.hindi}
                  </p>
                )}
              </div>

              {/* Santhali Adaptation */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Santhali Vernacular Adaptation (Ol Chiki Script)
                </span>
                {isEditing ? (
                  <textarea
                    rows={4}
                    value={editableKit?.lesson.santhali || ""}
                    onChange={(e) =>
                      setEditableKit((prev) =>
                        prev
                          ? {
                              ...prev,
                              lesson: { ...prev.lesson, santhali: e.target.value },
                            }
                          : null
                      )
                    }
                    className="w-full p-3 rounded-xl border border-emerald-300 font-santhali text-lg font-bold text-emerald-950 bg-white"
                  />
                ) : (
                  <p className="font-santhali font-bold text-emerald-950 text-xl sm:text-2xl leading-relaxed">
                    {learningKit.lesson.santhali}
                  </p>
                )}

                <div className="pt-1">
                  <span className="text-xs font-bold text-slate-600 block">Pronunciation Romanization:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editableKit?.lesson.romanization || ""}
                      onChange={(e) =>
                        setEditableKit((prev) =>
                          prev
                            ? {
                                ...prev,
                                lesson: { ...prev.lesson, romanization: e.target.value },
                              }
                            : null
                        )
                      }
                      className="w-full p-2 rounded-lg border border-emerald-300 text-xs text-slate-900 bg-white mt-1"
                    />
                  ) : (
                    <p className="text-xs sm:text-sm text-emerald-800">
                      {learningKit.lesson.romanization}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Concept Takeaway */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 space-y-1">
              <strong className="text-slate-900 block">💡 Key Concept Takeaway:</strong>
              {isEditing ? (
                <textarea
                  rows={2}
                  value={editableKit?.lesson.simpleExplanation || ""}
                  onChange={(e) =>
                    setEditableKit((prev) =>
                      prev
                        ? {
                            ...prev,
                            lesson: { ...prev.lesson, simpleExplanation: e.target.value },
                          }
                        : null
                    )
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white"
                />
              ) : (
                <p>{learningKit.lesson.simpleExplanation}</p>
              )}
            </div>
          </section>

          {/* Vocabulary Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                Key Vocabulary Words
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {(isEditing ? editableKit?.vocabulary : learningKit.vocabulary)?.length} Terms
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(isEditing ? editableKit?.vocabulary : learningKit.vocabulary)?.map((v, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2 hover:border-amber-300 transition-colors"
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Hindi Term</label>
                        <input
                          type="text"
                          value={v.hindi}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableKit((prev) => {
                              if (!prev) return null;
                              const newVocab = [...prev.vocabulary];
                              newVocab[idx] = { ...newVocab[idx], hindi: val };
                              return { ...prev, vocabulary: newVocab };
                            });
                          }}
                          className="w-full p-1.5 text-xs border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Santhali (Ol Chiki)</label>
                        <input
                          type="text"
                          value={v.santhali}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableKit((prev) => {
                              if (!prev) return null;
                              const newVocab = [...prev.vocabulary];
                              newVocab[idx] = { ...newVocab[idx], santhali: val };
                              return { ...prev, vocabulary: newVocab };
                            });
                          }}
                          className="w-full p-1.5 text-sm font-santhali font-bold border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Romanization</label>
                        <input
                          type="text"
                          value={v.romanization}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableKit((prev) => {
                              if (!prev) return null;
                              const newVocab = [...prev.vocabulary];
                              newVocab[idx] = { ...newVocab[idx], romanization: val };
                              return { ...prev, vocabulary: newVocab };
                            });
                          }}
                          className="w-full p-1.5 text-xs border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Meaning</label>
                        <input
                          type="text"
                          value={v.meaning}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableKit((prev) => {
                              if (!prev) return null;
                              const newVocab = [...prev.vocabulary];
                              newVocab[idx] = { ...newVocab[idx], meaning: val };
                              return { ...prev, vocabulary: newVocab };
                            });
                          }}
                          className="w-full p-1.5 text-xs border rounded-lg"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-bold text-slate-900">{v.hindi}</span>
                        <span className="text-xs text-slate-500 font-medium">({v.romanization})</span>
                      </div>
                      <div className="font-santhali text-2xl font-bold text-emerald-800">
                        {v.santhali}
                      </div>
                      <p className="text-xs text-slate-600 pt-1 border-t border-slate-100">
                        {v.meaning}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Interactive Flashcards */}
          {(isEditing ? editableKit?.flashcards : learningKit.flashcards) && (
            <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>📇 Interactive Flashcards</span>
                </h3>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Card {activeCardIndex + 1} of {(isEditing ? editableKit?.flashcards : learningKit.flashcards)?.length}
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  {editableKit?.flashcards.map((fc, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                      <span className="text-xs font-bold text-slate-700">Card #{idx + 1}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Front (Prompt)</label>
                          <input
                            type="text"
                            value={fc.front}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditableKit((prev) => {
                                if (!prev) return null;
                                const newFc = [...prev.flashcards];
                                newFc[idx] = { ...newFc[idx], front: val };
                                return { ...prev, flashcards: newFc };
                              });
                            }}
                            className="w-full p-2 text-xs border rounded-lg bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase">Back (Answer)</label>
                          <input
                            type="text"
                            value={fc.back}
                            onChange={(e) => {
                              const val = e.target.value;
                              setEditableKit((prev) => {
                                if (!prev) return null;
                                const newFc = [...prev.flashcards];
                                newFc[idx] = { ...newFc[idx], back: val };
                                return { ...prev, flashcards: newFc };
                              });
                            }}
                            className="w-full p-2 text-xs border rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Flashcard Body */}
                  <div
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="cursor-pointer min-h-[160px] p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 flex flex-col items-center justify-center text-center space-y-3 transition-transform hover:scale-[1.01]"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                      {isCardFlipped ? "Back (Answer / Vernacular)" : "Front (Click to Flip)"}
                    </span>
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-900">
                      {isCardFlipped
                        ? learningKit.flashcards[activeCardIndex]?.back
                        : learningKit.flashcards[activeCardIndex]?.front}
                    </p>
                    <span className="text-xs text-amber-700 italic">
                      {isCardFlipped ? "Click to see question" : "Click to reveal translation"}
                    </span>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCardIndex(
                          (prev) => (prev - 1 + learningKit.flashcards.length) % learningKit.flashcards.length
                        );
                        setIsCardFlipped(false);
                      }}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      ◀ Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsCardFlipped(!isCardFlipped)}
                      className="px-5 py-2 text-xs font-bold rounded-xl bg-amber-600 text-white hover:bg-amber-700 shadow-2xs"
                    >
                      🔄 Flip Card
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCardIndex((prev) => (prev + 1) % learningKit.flashcards.length);
                        setIsCardFlipped(false);
                      }}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      Next ▶
                    </button>
                  </div>
                </>
              )}
            </section>
          )}

          {/* Quiz Section */}
          {(isEditing ? editableKit?.quiz : learningKit.quiz) && (
            <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>📝 Classroom Comprehension Quiz</span>
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  {(isEditing ? editableKit?.quiz : learningKit.quiz)?.length} Questions
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  {editableKit?.quiz.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700">Question #{qIdx + 1}</label>
                        <input
                          type="text"
                          value={q.question}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableKit((prev) => {
                              if (!prev) return null;
                              const newQuiz = [...prev.quiz];
                              newQuiz[qIdx] = { ...newQuiz[qIdx], question: val };
                              return { ...prev, quiz: newQuiz };
                            });
                          }}
                          className="w-full p-2 text-xs font-semibold border rounded-lg bg-white mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIdx) => (
                          <div key={optIdx}>
                            <label className="text-[10px] font-bold text-slate-500">Option {optIdx + 1}</label>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditableKit((prev) => {
                                  if (!prev) return null;
                                  const newQuiz = [...prev.quiz];
                                  const newOpts = [...newQuiz[qIdx].options] as [string, string, string, string];
                                  newOpts[optIdx] = val;
                                  newQuiz[qIdx] = { ...newQuiz[qIdx], options: newOpts };
                                  return { ...prev, quiz: newQuiz };
                                });
                              }}
                              className="w-full p-1.5 text-xs border rounded-lg bg-white"
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Correct Answer String</label>
                        <input
                          type="text"
                          value={q.correctAnswer}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditableKit((prev) => {
                              if (!prev) return null;
                              const newQuiz = [...prev.quiz];
                              newQuiz[qIdx] = { ...newQuiz[qIdx], correctAnswer: val };
                              return { ...prev, quiz: newQuiz };
                            });
                          }}
                          className="w-full p-1.5 text-xs font-bold text-emerald-800 border border-emerald-300 rounded-lg bg-white mt-0.5"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {learningKit.quiz.map((q, qIdx) => {
                    const selectedAnswer = selectedQuizAnswers[qIdx];

                    return (
                      <div key={qIdx} className="space-y-3">
                        <p className="text-sm sm:text-base font-bold text-slate-900">
                          {qIdx + 1}. {q.question}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedAnswer === opt;
                            const isCorrect = opt === q.correctAnswer;
                            const showResult = Boolean(selectedAnswer);

                            let buttonStyle = "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800";
                            if (showResult) {
                              if (isCorrect) {
                                buttonStyle = "bg-emerald-100 border-emerald-400 text-emerald-950 font-bold";
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
                                className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all ${buttonStyle}`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {selectedAnswer && (
                          <p className="text-xs font-semibold mt-1">
                            {selectedAnswer === q.correctAnswer ? (
                              <span className="text-emerald-700">✅ Correct answer!</span>
                            ) : (
                              <span className="text-red-600">
                                ❌ Incorrect. Correct answer: {q.correctAnswer}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* Activity Section */}
          <section className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-6 md:p-8 text-white shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shrink-0">
                🎨
              </div>
              <div className="flex-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                  Recommended Classroom Activity
                </span>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableKit?.activity.title || ""}
                    onChange={(e) =>
                      setEditableKit((prev) =>
                        prev
                          ? {
                              ...prev,
                              activity: { ...prev.activity, title: e.target.value },
                            }
                          : null
                      )
                    }
                    className="w-full p-2 text-lg font-bold text-slate-900 bg-white rounded-xl mt-1"
                  />
                ) : (
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {learningKit.activity.title}
                  </h3>
                )}
              </div>
            </div>

            {isEditing ? (
              <textarea
                rows={3}
                value={editableKit?.activity.instructions || ""}
                onChange={(e) =>
                  setEditableKit((prev) =>
                    prev
                      ? {
                          ...prev,
                          activity: { ...prev.activity, instructions: e.target.value },
                        }
                      : null
                  )
                }
                className="w-full p-3 text-sm text-slate-900 bg-white rounded-xl font-medium"
              />
            ) : (
              <p className="text-sm sm:text-base text-amber-50 leading-relaxed whitespace-pre-line">
                {learningKit.activity.instructions}
              </p>
            )}
          </section>
        </div>
      )}

      {/* System Explanation Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4 shadow-2xs">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>🧠 How the VaaniShiksha AI Engine operates</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-900">1. Vernacular Translation</div>
            <p className="text-slate-600 text-xs sm:text-sm">
              Translates source text into Santhali (Ol Chiki script), maintaining dialectal fidelity.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-900">2. Vocabulary Extraction</div>
            <p className="text-slate-600 text-xs sm:text-sm">
              Identifies key primary terms and generates visual vocabulary cards with audio prompts.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="font-bold text-slate-900">3. Teacher Verification</div>
            <p className="text-slate-600 text-xs sm:text-sm">
              Presents generated materials to the teacher for one-click verification or manual correction.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
