"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import { SavedLesson } from "@/types/lesson";
import { getSavedLessons } from "@/lib/storage";

export default function StudentCatalogPage() {
  const [lessons, setLessons] = useState<SavedLesson[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchLessons = async () => {
      try {
        const data = await getSavedLessons();
        if (mounted) {
          setLessons(data);
          setIsLoaded(true);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchLessons();
    return () => { mounted = false; };
  }, []);

  if (!isLoaded) {
    return (
      <PageContainer className="flex flex-col gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500">
          Loading your lessons...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 text-white">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs sm:text-sm font-semibold mb-2">
            <span>🎒 Student Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            My Lessons
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base mt-2 font-medium">
            Choose a lesson to start learning in Santhali!
          </p>
        </div>
      </div>

      {/* Lessons List Section */}
      <div className="space-y-4">
        {lessons.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-900 font-bold text-3xl flex items-center justify-center mx-auto">
              📖
            </div>
            <div className="space-y-1">
               <h3 className="text-lg font-bold text-slate-900">No Lessons Yet</h3>
               <p className="text-sm text-slate-600 max-w-md mx-auto">
                 Ask your teacher to create some lessons for you!
               </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <Link
                href={`/student?id=${lesson.id}`}
                key={lesson.id}
                className="group bg-white rounded-3xl border-2 border-slate-100 p-6 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between space-y-5 cursor-pointer block"
              >
                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 rounded-md">
                      {lesson.grade} • {lesson.subject}
                    </span>

                    {/* Verification Status */}
                    {lesson.verificationStatus === "verified" ? (
                      <span className="px-2.5 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-900 rounded-full border border-emerald-300">
                        ✅ Verified
                      </span>
                    ) : lesson.verificationStatus === "needs_review" ? (
                      <span className="px-2.5 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                        ⚠️ Draft
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-900 rounded-full border border-blue-200">
                        🤖 AI Generated
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-extrabold text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors">
                    {lesson.title}
                  </h3>

                  {/* Language Pair */}
                  <div className="text-xs text-slate-600 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Pair:</span>
                    <span className="font-bold text-slate-900">
                      {lesson.sourceLanguage || "Hindi"} ➔ {lesson.targetLanguage || "Santhali"}
                    </span>
                  </div>
                </div>

                {/* Start Learning Button */}
                <div className="pt-2">
                  <div className="w-full text-center py-3 px-4 text-sm font-bold rounded-xl bg-emerald-100 text-emerald-900 group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-2xs">
                    Start Learning ➔
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
