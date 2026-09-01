import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import StatCard from "@/components/StatCard";
import LessonCard from "@/components/LessonCard";
import LanguageSelector from "@/components/LanguageSelector";

const DEMO_LESSONS = [
  {
    id: "1",
    title: "Plants Around Us (हमारे आसपास के पौधे)",
    grade: "Grade 2",
    subject: "Environmental Studies",
    sourceLang: "Hindi",
    targetLang: "Santhali",
    status: "Verified" as const,
    activityCount: 8,
    studentUrl: "/student",
  },
  {
    id: "2",
    title: "Numbers 1–20 (संख्याएँ 1 से 20)",
    grade: "Grade 1",
    subject: "Mathematics",
    sourceLang: "Hindi",
    targetLang: "Santhali",
    status: "Verified" as const,
    activityCount: 10,
    studentUrl: "/student",
  },
  {
    id: "3",
    title: "Animals Around Us (हमारे आसपास के जानवर)",
    grade: "Grade 3",
    subject: "Science",
    sourceLang: "Hindi",
    targetLang: "Santhali",
    status: "Draft" as const,
    activityCount: 6,
    studentUrl: "/student",
  },
];

export default function TeacherDashboard() {
  return (
    <PageContainer className="flex flex-col gap-8">
      {/* Top Header & Greeting Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-200 text-amber-900 text-xs font-semibold mb-2">
            <span>👩‍🏫 Educator Hub • Primary Education</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome, Teacher
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your mother-tongue lesson kits, review translations, and adapt primary learning materials.
          </p>
        </div>

        {/* Primary Action Button */}
        <div>
          <Link
            href="/create-lesson"
            className="px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold text-sm shadow-xs hover:bg-amber-700 transition-all flex items-center justify-center gap-2 group shrink-0"
          >
            <span className="text-lg leading-none">+</span>
            <span>Create New Lesson</span>
          </Link>
        </div>
      </div>

      {/* Language Area Indicator */}
      <LanguageSelector sourceLang="Hindi" targetLang="Santhali" />

      {/* Dashboard Statistics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Overview Metrics
          </h2>
          <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
            Demonstration Metrics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Lessons Created"
            value="12"
            description="Total Hindi lessons adapted for primary grades"
            accentColor="amber"
            icon={<span className="text-lg">📖</span>}
          />
          <StatCard
            label="Verified Lessons"
            value="9"
            description="Reviewed & approved Santhali translation kits"
            accentColor="emerald"
            icon={<span className="text-lg">✅</span>}
          />
          <StatCard
            label="Learning Activities"
            value="24"
            description="Interactive flashcards and classroom prompts"
            accentColor="blue"
            icon={<span className="text-lg">🎨</span>}
          />
        </div>
      </div>

      {/* Recent Lessons Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Demonstration Lessons
            </h2>
            <p className="text-xs text-slate-500">
              Curriculum units ready for mother-tongue classroom learning
            </p>
          </div>

          <Link
            href="/create-lesson"
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline"
          >
            + Add Another Lesson
          </Link>
        </div>

        {/* Lesson Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {DEMO_LESSONS.map((lesson) => (
            <LessonCard key={lesson.id} {...lesson} />
          ))}
        </div>
      </div>

      {/* Teacher Guide Box */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base shrink-0">
            💡
          </div>
          <div>
            <p className="font-semibold text-slate-800">
              How VaaniShiksha helps in your classroom:
            </p>
            <p className="text-slate-500">
              Enter standard textbook lesson text, generate Santhali vocabulary flashcards, and preview how students see the lesson.
            </p>
          </div>
        </div>

        <Link
          href="/create-lesson"
          className="px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
        >
          Try Lesson Creation ➔
        </Link>
      </div>
    </PageContainer>
  );
}
