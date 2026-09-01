"use client";

import { useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";

const VOCABULARY_CARDS = [
  {
    id: 1,
    english: "Plant",
    hindi: "पौधा (Paudha)",
    santhaliOlChiki: "ᱫᱟᱨᱮ",
    santhaliPhonetic: "Dare",
    icon: "🌱",
    meaning: "A living thing that grows in earth with roots, stems, and leaves.",
  },
  {
    id: 2,
    english: "Leaf",
    hindi: "पत्ता (Patta)",
    santhaliOlChiki: "ᱥᱟᱠᱟᱢ",
    santhaliPhonetic: "Sakam",
    icon: "🍃",
    meaning: "The flat green part of a plant that catches sunlight.",
  },
  {
    id: 3,
    english: "Flower",
    hindi: "फूल (Phool)",
    santhaliOlChiki: "ᱵᱟᱦᱟ",
    santhaliPhonetic: "Baha",
    icon: "🌸",
    meaning: "The colorful part of a plant that blooms.",
  },
  {
    id: 4,
    english: "Root",
    hindi: "जड़ (Jad)",
    santhaliOlChiki: "ᱨᱮᱦᱮᱫ",
    santhaliPhonetic: "Rehed",
    icon: "🪴",
    meaning: "The part underground that drinks water for the plant.",
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
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="inline-block px-3.5 py-1 bg-white/20 rounded-full text-xs sm:text-sm font-semibold uppercase tracking-wider backdrop-blur-xs">
            🎒 Student Corner • Grade 2 EVS
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Plants Around Us
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg font-medium">
            हमारे आसपास के पौधे • <span className="font-santhali text-amber-200">ᱟᱵᱚ ᱨᱮᱱᱟᱜ ᱫᱟᱨᱮ ᱠᱚ</span> (Abo Renag Dare Ko)
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/25 text-xs sm:text-sm shrink-0">
          <span>Language Pair:</span>
          <span className="font-bold bg-white text-emerald-950 px-2.5 py-1 rounded-lg">
            Hindi ➔ Santhali
          </span>
        </div>
      </div>

      {/* Readable Story / Lesson Content Card */}
      <section className="bg-white rounded-3xl border border-emerald-200/80 p-6 sm:p-8 shadow-2xs space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>📖 Lesson Story</span>
          </h2>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Primary Read-Aloud Unit
          </span>
        </div>

        <div className="space-y-4">
          {/* Hindi Source Box */}
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
              Hindi (Curriculum Text)
            </span>
            <p className="font-medium text-slate-900 text-lg sm:text-xl leading-relaxed">
              &ldquo;हमारे आसपास कई प्रकार के पौधे होते हैं। कुछ पौधे बड़े होते हैं जिन्हें पेड़ कहते हैं, और कुछ पौधे छोटे होते हैं।&rdquo;
            </p>
          </div>

          {/* Santhali Adaptation Box with Ol Chiki rendering fix */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Santhali Vernacular Adaptation (Ol Chiki Script)
            </span>
            <p className="font-santhali font-semibold text-emerald-950 text-xl sm:text-2xl leading-relaxed">
              &ldquo;ᱟᱵᱚ ᱯᱟᱦᱴᱟ ᱨᱮ ᱟᱭᱢᱟ ᱞᱮᱠᱟᱱ ᱫᱟᱨᱮ ᱠᱚ ᱢᱮᱱᱟᱜ-ᱟ: ᱫᱟᱨᱮ (Dare), ᱥᱟᱠᱟᱢ (Sakam), ᱵᱟᱦᱟ (Baha) ᱟᱨ ᱨᱮᱦᱮᱫ (Rehed)᱾&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-emerald-800 italic">
              [Demonstration Santhali audio-guided adaptation for primary learners]
            </p>
          </div>
        </div>
      </section>

      {/* Vocabulary Flashcards Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Vocabulary Flashcards
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Click &ldquo;Next Card&rdquo; to learn key words in Hindi and Santhali
            </p>
          </div>

          <span className="text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300">
            Card {activeCardIndex + 1} of {VOCABULARY_CARDS.length}
          </span>
        </div>

        {/* Featured Flashcard */}
        <div className="bg-white rounded-3xl border-2 border-emerald-300 p-8 shadow-sm text-center flex flex-col items-center space-y-5 transition-all">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-5xl shadow-2xs">
            {currentCard.icon}
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {currentCard.english}
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              {currentCard.hindi}
            </h3>

            <div className="mt-3 inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-amber-100 border border-amber-300 text-slate-900">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Santhali (Ol Chiki):
              </span>
              <span className="font-santhali font-extrabold text-2xl sm:text-3xl text-emerald-900">
                {currentCard.santhaliOlChiki}
              </span>
              <span className="text-sm font-semibold text-slate-700">
                ({currentCard.santhaliPhonetic})
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-700 max-w-md leading-relaxed italic">
            &ldquo;{currentCard.meaning}&rdquo;
          </p>

          {/* Large Student Interaction Controls */}
          <div className="pt-4 flex items-center gap-4 w-full max-w-sm justify-center">
            <button
              onClick={handlePrev}
              type="button"
              className="flex-1 py-3 px-5 text-sm font-bold rounded-2xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors shadow-2xs"
            >
              ◀ Previous Card
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="flex-1 py-3 px-5 text-sm font-bold rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Next Card ▶
            </button>
          </div>
        </div>

        {/* Small Grid Overview of Vocab Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
          {VOCABULARY_CARDS.map((card, idx) => (
            <button
              key={card.id}
              onClick={() => setActiveCardIndex(idx)}
              className={`p-4 rounded-2xl border text-center transition-all ${
                idx === activeCardIndex
                  ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400/50 shadow-2xs"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="text-2xl mb-1.5">{card.icon}</div>
              <div className="text-sm font-bold text-slate-900">{card.hindi}</div>
              <div className="font-santhali text-base font-bold text-emerald-800 mt-0.5">
                {card.santhaliOlChiki} <span className="font-sans text-xs font-medium text-slate-500">({card.santhaliPhonetic})</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Simple Classroom Activity Prompt */}
      <section className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shrink-0">
            🎨
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Classroom Activity Prompt
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Leaf Collector Challenge (<span className="font-santhali">ᱥᱟᱠᱟᱢ</span> Game)
            </h3>
          </div>
        </div>

        <p className="text-sm sm:text-base text-amber-50 leading-relaxed">
          Find 3 different leaves in your school yard. Bring them to class and say their names in Santhali (<strong className="font-santhali font-normal text-lg">ᱥᱟᱠᱟᱢ</strong> - Sakam) to your teacher!
        </p>

        <div className="pt-2 flex items-center justify-between border-t border-white/20 text-xs sm:text-sm text-amber-100">
          <span>Demonstration classroom activity</span>
          <Link
            href="/teacher"
            className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold hover:bg-amber-50 transition-colors shadow-2xs"
          >
            Return to Teacher View
          </Link>
        </div>
      </section>

      {/* Demo Notice */}
      <div className="text-center p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-600">
        <p>
          💡 <strong>Demonstration UI:</strong> This is a student mode prototype interface. Real quiz logic, audio playback, and live progress tracking will be connected in future development phases.
        </p>
      </div>
    </PageContainer>
  );
}
