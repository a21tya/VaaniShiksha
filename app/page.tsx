import Link from "next/link";
import PageContainer from "@/components/PageContainer";

export default function Home() {
  return (
    <PageContainer className="flex flex-col gap-12 md:gap-16">
      {/* Prototype Banner */}
      <div className="bg-amber-50 border border-amber-200/80 text-amber-900 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-medium shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
            SIH26042 Prototype
          </span>
          <span>
            Initial Development Stage • Vernacular Focus: <strong>Hindi → Santhali</strong>
          </span>
        </div>
        <span className="hidden sm:inline-block text-amber-700 font-normal">
          UI Shell & Workflow Preview
        </span>
      </div>

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-semibold">
          <span>🌾 Mother Tongue-Based Primary Education</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          AI-Powered Vernacular Pedagogy for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
            Mother-Tongue-Based
          </span>{" "}
          Primary Education
        </h1>

        <p className="text-lg sm:text-xl font-medium text-amber-900/90 max-w-2xl mx-auto italic">
          &ldquo;Learning begins in the language children understand best.&rdquo;
        </p>

        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          <strong>VaaniShiksha</strong> helps teachers transform lesson content into
          age-appropriate learning material in children&apos;s familiar languages, ensuring
          no child is left behind due to language barriers in early education.
        </p>

        {/* Primary Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/teacher"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-600 text-white font-semibold text-base shadow-sm hover:bg-amber-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
          >
            <span>Teacher Dashboard</span>
            <span className="group-hover:translate-x-1 transition-transform">➔</span>
          </Link>

          <Link
            href="/student"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-700 text-white font-semibold text-base shadow-sm hover:bg-emerald-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
          >
            <span>Student Mode</span>
            <span className="group-hover:translate-x-1 transition-transform">➔</span>
          </Link>
        </div>
      </section>

      {/* Product Mission & Context Card */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              The Vision
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Bridging the Vernacular Learning Gap
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              In primary education across tribal and multi-lingual regions in India, children often enter school with a rich oral heritage in their mother tongue (such as Santhali), but standard textbooks are printed in regional state languages (such as Hindi).
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              VaaniShiksha empowers educators to quickly generate dual-language, culturally contextualized classroom activities, vocabulary cards, and audio prompts.
            </p>
          </div>

          <div className="bg-amber-50/60 rounded-2xl p-6 border border-amber-100 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>🔄 Prototype Workflow Preview</span>
            </h3>
            <ol className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="bg-amber-200 text-amber-900 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <span>Teacher submits standard Hindi text lesson content.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-200 text-amber-900 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <span>System performs vernacular translation & pedagogical adaptation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-200 text-amber-900 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <span>Teacher reviews, verifies, and corrects the generated kit.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-amber-200 text-amber-900 font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">
                  4
                </span>
                <span>Students interact with bilingual learning materials and audio.</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900">
            Key Platform Capabilities
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Planned prototype features for mother-tongue primary education
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl mb-4">
              🌐
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Vernacular Translation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Context-aware translation from standard Hindi into native tribal languages like Santhali, honoring local dialects and terms.
            </p>
            <span className="inline-block text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              Prototype Focus: Hindi → Santhali
            </span>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xl mb-4">
              ✨
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              AI Lesson Generation
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Automatically generates primary grade vocabulary lists, comprehension checks, and story adaptations from raw teacher notes.
            </p>
            <span className="inline-block text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Planned AI Pipeline
            </span>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl mb-4">
              🎮
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Interactive Learning
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Child-friendly visual flashcards, audio-guided prompts, and simple classroom activities designed for Grades 1–5.
            </p>
            <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Interactive Demo Ready
            </span>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xl mb-4">
              ✅
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Teacher Review & Verification
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Human-in-the-loop review workflow allowing teachers to inspect, refine, and verify all AI translations before classroom deployment.
            </p>
            <span className="inline-block text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              Pedagogical Quality Guard
            </span>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-300 transition-all sm:col-span-2 lg:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xl mb-4">
              📶
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Low-Connectivity Friendly
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Designed specifically for rural primary schools with limited internet access, supporting offline caching and lightweight resource bundles.
            </p>
            <span className="inline-block text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              Rural Primary School Architecture Focus
            </span>
          </div>
        </div>
      </section>

      {/* Stage Disclaimer Note */}
      <div className="text-center p-4 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-500">
        <p>
          💡 <strong>Prototype Notice:</strong> Features listed above reflect the full platform architecture. In this initial stage, backend AI engines and live translation APIs remain disconnected.
        </p>
      </div>
    </PageContainer>
  );
}
