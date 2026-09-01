import Link from "next/link";

interface LessonCardProps {
  title: string;
  grade: string;
  subject: string;
  sourceLang: string;
  targetLang: string;
  status: "Verified" | "Draft" | "In Review";
  activityCount: number;
  studentUrl?: string;
}

export default function LessonCard({
  title,
  grade,
  subject,
  sourceLang,
  targetLang,
  status,
  activityCount,
  studentUrl = "/student",
}: LessonCardProps) {
  const statusStyles = {
    Verified: "bg-emerald-100 text-emerald-800 border-emerald-300",
    Draft: "bg-amber-100 text-amber-800 border-amber-300",
    "In Review": "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-md">
            {grade} • {subject}
          </span>
          <span
            className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${statusStyles[status]}`}
          >
            {status}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
          {title}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          <span className="font-semibold text-slate-700">Pair:</span>
          <span>{sourceLang}</span>
          <span className="text-amber-600 font-bold">→</span>
          <span className="font-medium text-slate-900">{targetLang}</span>
        </div>

        <p className="mt-3 text-xs text-slate-500 flex items-center gap-2">
          <span>📚 {activityCount} Learning Activities</span>
          <span>•</span>
          <span className="text-amber-700 font-medium">[Demo Data]</span>
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
        <Link
          href={studentUrl}
          className="flex-1 text-center py-2 px-3 text-xs font-semibold rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-2xs"
        >
          Preview Student Mode
        </Link>
        <button
          type="button"
          disabled
          className="py-2 px-3 text-xs font-medium text-slate-400 bg-slate-100 rounded-xl border border-slate-200 cursor-not-allowed"
          title="Editing will be connected in next phase"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
