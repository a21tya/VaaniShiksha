"use client";

import { useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import LanguageSelector from "@/components/LanguageSelector";

export default function CreateLessonPage() {
  const [title, setTitle] = useState("Plants Around Us (हमारे आसपास के पौधे)");
  const [grade, setGrade] = useState("Grade 2");
  const [subject, setSubject] = useState("Environmental Studies");
  const [sourceLang, setSourceLang] = useState("Hindi");
  const [targetLang, setTargetLang] = useState("Santhali");
  const [content, setContent] = useState(
    "हमारे आसपास कई तरह के पौधे पाए जाते हैं। पौधों के मुख्य भाग हैं: जड़, तना, पत्ता और फूल। पौधे हमारे जीवन के लिए बहुत उपयोगी हैं।"
  );
  const [submittedState, setSubmittedState] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedState(true);
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
          Provide standard textbook material in Hindi to generate Santhali pedagogical adaptations.
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
              Paste textbook paragraph or notes
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

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-600 text-white font-semibold text-sm sm:text-base shadow-xs hover:bg-amber-700 transition-all flex items-center justify-center gap-2 group"
          >
            <span>✨ Generate Learning Kit</span>
          </button>

          <Link
            href="/teacher"
            className="text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Cancel & Return to Dashboard
          </Link>
        </div>

        {/* Phase Connection Notice */}
        {submittedState && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-sm space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <span className="text-lg">ℹ️</span>
              <span>AI Generation Connection Notice</span>
            </div>
            <p className="leading-relaxed">
              <strong>AI generation will be connected in the next development phase.</strong> In this prototype shell, no real AI API or fake response is executed.
            </p>
            <div className="pt-1">
              <Link
                href="/student"
                className="inline-flex items-center gap-1 font-semibold text-amber-900 underline hover:text-amber-950"
              >
                View Demonstration Student Mode for &ldquo;Plants Around Us&rdquo; ➔
              </Link>
            </div>
          </div>
        )}
      </form>

      {/* System Explanation Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4 shadow-2xs">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>🧠 What the eventual VaaniShiksha AI Engine will do</span>
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
