import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  accentColor?: "amber" | "emerald" | "blue" | "indigo";
}

export default function StatCard({
  label,
  value,
  description,
  icon,
  accentColor = "amber",
}: StatCardProps) {
  const colorMap = {
    amber: "bg-amber-50 text-amber-900 border-amber-200/70",
    emerald: "bg-emerald-50 text-emerald-900 border-emerald-200/70",
    blue: "bg-blue-50 text-blue-900 border-blue-200/70",
    indigo: "bg-indigo-50 text-indigo-900 border-indigo-200/70",
  };

  const badgeMap = {
    amber: "text-amber-700 bg-amber-100",
    emerald: "text-emerald-700 bg-emerald-100",
    blue: "text-blue-700 bg-blue-100",
    indigo: "text-indigo-700 bg-indigo-100",
  };

  return (
    <div className={`p-5 rounded-2xl border ${colorMap[accentColor]} shadow-2xs transition-all hover:shadow-xs`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        {icon && (
          <div className={`p-2 rounded-xl ${badgeMap[accentColor]}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900">
          {value}
        </span>
        <span className="text-xs font-medium text-slate-400">demo count</span>
      </div>
      {description && (
        <p className="mt-1 text-xs text-slate-500 font-normal">
          {description}
        </p>
      )}
    </div>
  );
}
