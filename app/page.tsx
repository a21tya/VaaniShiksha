import Link from "next/link";
import Image from "next/image";
import PageContainer from "@/components/PageContainer";

export default function Home() {
  return (
    <PageContainer className="flex flex-col gap-12 md:gap-16">
      {/* Prototype Status Banner */}
      <div className="bg-amber-50 border border-amber-200/80 text-amber-950 px-4 py-3 rounded-xl flex items-center justify-between text-xs sm:text-sm font-medium shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            SIH26042 Prototype
          </span>
          <span>
            Vernacular Focus: <strong>Hindi → Santhali</strong> (Mother-Tongue Education)
          </span>
        </div>
        <span className="hidden sm:inline-block text-amber-800 font-normal">
          Initial V1.1 UI Shell
        </span>
      </div>

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-2">
        {/* Official Logo Banner */}
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs inline-block">
            <Image
              src="/vaanishiksha-logo-cropped.jpeg"
              alt="VaaniShiksha Logo"
              width={360}
              height={144}
              className="h-16 sm:h-20 w-auto object-contain"
              priority
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 border border-amber-200 text-amber-950 text-xs sm:text-sm font-semibold">
          <span>🌾 Mother Tongue-Based Primary Education</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          AI-Powered Vernacular Pedagogy for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
            Mother-Tongue-Based
          </span>{" "}
          Primary Education
        </h1>

        <p className="text-xl sm:text-2xl font-semibold text-amber-900/90 max-w-3xl mx-auto italic">
          &ldquo;Learning begins in the language children understand best.&rdquo;
        </p>

        <p className="text-base sm:text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed">
          VaaniShiksha empowers rural teachers to automatically adapt standard curriculum into interactive, localized lessons. By bridging the language gap, we help tribal students transition into formal education using their mother tongue, preventing early dropout and building foundational literacy.
        </p>

        {/* Primary Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/teacher"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-600 text-white font-semibold text-base shadow-xs hover:bg-amber-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
          >
            <span>Teacher Dashboard</span>
            <span className="group-hover:translate-x-1 transition-transform">➔</span>
          </Link>

          <Link
            href="/student/catalog"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-700 text-white font-semibold text-base shadow-xs hover:bg-emerald-800 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
          >
            <span>Student Mode</span>
            <span className="group-hover:translate-x-1 transition-transform">➔</span>
          </Link>
        </div>
      </section>

      {/* Problem -> Solution Flow Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-2xs space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Problem & Solution Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            How VaaniShiksha Bridges the Classroom Gap
          </h2>
          <p className="text-sm text-slate-600">
            From standard Hindi textbooks to engaging Santhali learning in primary schools
          </p>
        </div>

        {/* Visual Workflow Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center pt-4">
          {/* Step 1 */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              1
            </div>
            <h3 className="text-xs font-bold text-slate-900">Language Barrier</h3>
            <p className="text-xs text-slate-600">Textbooks printed in Hindi</p>
          </div>

          <div className="hidden sm:flex justify-center text-amber-600 font-bold text-xl">
            ➔
          </div>

          {/* Step 2 */}
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              2
            </div>
            <h3 className="text-xs font-bold text-amber-950">Teacher&apos;s Input</h3>
            <p className="text-xs text-amber-800">Hindi lesson text</p>
          </div>

          <div className="hidden sm:flex justify-center text-amber-600 font-bold text-xl">
            ➔
          </div>

          {/* Step 3 */}
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center space-y-1 sm:col-span-1">
            <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-950 font-bold text-xs flex items-center justify-center mx-auto mb-2">
              3
            </div>
            <h3 className="text-xs font-bold text-emerald-950">VaaniShiksha</h3>
            <p className="text-xs text-emerald-800">Vernacular Adaptation</p>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 pt-2">
          <span className="text-emerald-700 font-bold text-sm">↓ Results in</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
          <div className="p-4 rounded-2xl bg-emerald-100/70 border border-emerald-200 text-center">
            <h4 className="text-sm font-bold text-emerald-950">Vernacular Learning Kit</h4>
            <p className="text-xs text-emerald-800 mt-1">
              Bilingual story, Santhali Ol Chiki vocabulary, and classroom activities
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-100/70 border border-emerald-200 text-center">
            <h4 className="text-sm font-bold text-emerald-950">Happy Primary Learner</h4>
            <p className="text-xs text-emerald-800 mt-1">
              Child understands foundational concepts in their familiar mother tongue
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">
            Key Platform Capabilities
          </h2>
          <p className="text-sm text-slate-600">
            Live features driving mother-tongue primary education
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl">
              🌐
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Vernacular Translation
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Context-aware translation from standard Hindi into native tribal languages like Santhali, honoring local dialects and terms.
            </p>
            <span className="inline-block text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Focus: Hindi → Santhali
            </span>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-xl">
              ✨
            </div>
            <h3 className="text-base font-bold text-slate-900">
              AI Lesson Generation
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Automatically generates primary grade vocabulary lists, comprehension checks, and story adaptations from raw teacher notes.
            </p>
            <span className="inline-block text-xs font-semibold text-slate-100 bg-slate-800 px-2.5 py-1 rounded-md">
              ⚡ Live Gemini AI Pipeline
            </span>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
              🎮
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Interactive Learning
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Child-friendly visual flashcards, audio-guided prompts, and simple classroom activities designed for Grades 1–5.
            </p>
            <span className="inline-block text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Interactive Demo Ready
            </span>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xl">
              ✅
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Teacher Review & Verification
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Human-in-the-loop review workflow allowing teachers to inspect, refine, and verify all AI translations before classroom deployment.
            </p>
            <span className="inline-block text-xs font-semibold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
              Pedagogical Quality Guard
            </span>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 sm:col-span-2 lg:col-span-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xl">
              📶
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Low-Connectivity Friendly
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Designed specifically for rural primary schools with limited internet access, supporting offline caching and lightweight resource bundles.
            </p>
            <span className="inline-block text-xs font-semibold text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
              Rural Primary School Focus
            </span>
          </div>
        </div>
      </section>

      {/* Prototype Notice */}
      <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs sm:text-sm text-emerald-900">
        <p>
          💡 <strong>SIH Demo Ready:</strong> The backend AI engines (Google Gemini) and live Santhali TTS endpoints are fully connected and active.
        </p>
      </div>
    </PageContainer>
  );
}
