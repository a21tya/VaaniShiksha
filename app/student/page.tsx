"use client";

import { useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";

const VOCABULARY_CARDS = [
  {
    id: 1,
    english: "Plant",
    hindi: "पौधा (Paudha)",
    santhali: "ᱫᱟᱨᱮ (Dare)",
    icon: "🌱",
    meaning: "A living thing that grows in earth and has roots, leaves, and stems.",
  },
  {
    id: 2,
    english: "Leaf",
    hindi: "पत्ता (Patta)",
    santhali: "ᱥᱟᱠᱟᱢ (Sakam)",
    icon: "🍃",
    meaning: "The flat green part of a plant that makes food from sunlight.",
  },
  {
    id: 3,
    english: "Flower",
    hindi: "फूल (Phool)",
    santhali: "ᱵᱟᱦᱟ (Baha)",
    icon: "🌸",
    meaning: "The colorful part of a plant that produces seeds.",
  },
  {
    id: 4,
    english: "Root",
    hindi: "जड़ (Jad)",
    santhali: "ᱨᱮᱦᱮᱫ (Rehed)",
    icon: "🪴",
    meaning: "The part of a plant that grows underground and takes in water.",
  },
];

export default function StudentModePage() {
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  const handleNext = () => {
    setActiveCardIndex((prev) => (prev + 1) % VOCABULARY_CARDS.length);
  };

  const handlePrev = () => {
    setActiveCardIndex(
      (prev) => (prev - 1 + VOCABULARY_CARDS.length) % VOCABULARY_CARDS.length
    );
  };

  const currentCard = VOCABULARY_CARDS[activeCardIndex];

  return (
    <PageContainer className="max-w-4xl mx-auto flex flex-col gap-8">
      {/* Student Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
            🎒 Student Learning Corner • Primary Mode
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Plants Around Us
          </h1>
          <p className="text-emerald-100 text-sm font-medium">
            हमारे आसपास के पौधे • ᱟᱵᱚ ᱟ elements
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-xs shrink-0">
          <span>Language Pair:</span>
          <span className="font-bold bg-white text-emerald-900 px-2 py-0.5 rounded-md">
            Hindi ➔ Santhali
          </span>
        </div>
      </div>

      {/* Readable Story/Lesson Content Card */}
      <section className="bg-white rounded-3xl border border-emerald-100 p-6 md:p-8 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>📖 Lesson Story</span>
          </h2>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Grade 2 EVS
          </span>
        </div>

        <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Hindi (Source Textbook)
            </span>
            <p className="font-medium text-slate-900 text-base">
              &ldquo;हमारे आसपास कई प्रकार के पौधे होते हैं। कुछ पौधे बड़े होते हैं जिन्हें पेड़ कहते हैं, और कुछ पौधे छोटे होते हैं।&rdquo;
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Santhali Vernacular Adaptation ( Ol Chiki & Speech Prompt )
            </span>
            <p className="font-medium text-slate-900 text-base">
              &ldquo;ᱟᱵᱚ ᱟ elements: ᱫᱟᱨᱮ (Dare) ᱟᱨ ᱥᱟᱠᱟᱢ (Sakam) ...&rdquo;
            </p>
            <p className="text-xs text-emerald-700 italic">
              [Demonstration Santhali adaptation for primary learners]
            </p>
          </div>
        </div>
      </section>

      {/* Vocabulary Flashcards Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Vocabulary Flashcards
            </h2>
            <p className="text-xs text-slate-500">
              Click &ldquo;Next Card&rdquo; to explore key words in Hindi and Santhali
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Card {activeCardIndex + 1} of {VOCABULARY_CARDS.length}
          </span>
        </div>

        {/* Featured Card Display */}
        <div className="bg-white rounded-3xl border-2 border-emerald-200 p-8 shadow-sm text-center flex flex-col items-center space-y-4 transition-all">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-4xl shadow-2xs">
            {currentCard.icon}
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {currentCard.english}
            </span>
            <h3 className="text-3xl font-extrabold text-slate-900 mt-1">
              {currentCard.hindi}
            </h3>
            <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-950 font-bold text-lg border border-amber-200">
              <span>Santhali:</span>
              <span className="text-amber-800">{currentCard.santhali}</span>
            </div>
          </div>

          <p className="text-xs text-slate-600 max-w-md italic">
            &ldquo;{currentCard.meaning}&rdquo;
          </p>

          {/* Interactive Navigation Controls */}
          <div className="pt-4 flex items-center gap-3 w-full max-w-xs justify-center">
            <button
              onClick={handlePrev}
              type="button"
              className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
            >
              ◀ Previous
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              Next Card ▶
            </button>
          </div>
        </div>

        {/* Small Grid Overview of All Vocab Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {VOCABULARY_CARDS.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => setActiveCardIndex(idx)}
              className={`p-3 rounded-2xl border text-center transition-all ${
                idx === activeCardIndex
                  ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/50"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="text-xl mb-1">{card.icon}</div>
              <div className="text-xs font-bold text-slate-900">{card.hindi}</div>
              <div className="text-[11px] font-medium text-amber-700">
                {card.santhali}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Simple Classroom Activity Prompt */}
      <section className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 md:p-8 text-white shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl">
            🎨
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Classroom Activity Prompt
            </span>
            <h3 className="text-xl font-bold text-white">
              Leaf Collector Challenge (ᱥᱟᱠᱟᱢ (Sakam) Game)
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-amber-50 leading-relaxed">
          Find 3 different leaves in your school yard. Bring them to class and say their names in Santhali (<strong>ᱥᱟᱠᱟᱢ - Sakam</strong>) to your teacher!
        </p>

        <div className="pt-2 flex items-center justify-between border-t border-white/20 text-xs text-amber-100">
          <span>Demonstration classroom activity</span>
          <Link
            href="/teacher"
            className="px-3.5 py-1.5 rounded-xl bg-white text-slate-900 font-semibold hover:bg-amber-50 transition-colors"
          >
            Return to Teacher View
          </Link>
        </div>
      </section>

      {/* Demo Notice */}
      <div className="text-center p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-500">
        <p>
          💡 <strong>Demonstration UI:</strong> This is a student mode prototype interface. Real quiz logic, audio playback, and live progress tracking will be connected in future development phases.
        </p>
      </div>
    </PageContainer>
  );
}
