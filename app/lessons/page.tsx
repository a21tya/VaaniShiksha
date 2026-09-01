"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import { SavedLesson } from "@/types/lesson";
import { getSavedLessons, deleteSavedLesson } from "@/lib/storage";

export default function LessonLibraryPage() {
  const [lessons, setLessons] = useState<SavedLesson[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLessons(getSavedLessons());
      setIsLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id: string) => {
    deleteSavedLesson(id);
    setLessons(getSavedLessons());
    setDeleteConfirmationId(null);
  };

  if (!isLoaded) {
    return (
      <PageContainer className="flex flex-col gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-500">
          Loading lesson library...
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="flex flex-col gap-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-950 text-xs sm:text-sm font-semibold mb-2">
            <span>📚 Educator Repository • Local Storage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Teacher Lesson Library
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1">
            Manage, verify, edit, and deploy saved Santhali curriculum units directly to Student Mode.
          </p>
        </div>

        <div>
          <Link
            href="/create-lesson"
            className="px-6 py-3 rounded-xl bg-amber-600 text-white font-semibold text-sm sm:text-base shadow-xs hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <span className="text-lg leading-none">+</span>
            <span>Create New Lesson</span>
          </Link>
        </div>
      </div>

      {/* Lessons List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Saved Curriculum Units ({lessons.length})
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            Persisted in local browser storage
          </span>
        </div>

        {lessons.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-900 font-bold text-3xl flex items-center justify-center mx-auto">
              📖
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">No Saved Lessons Yet</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Generate a new mother-tongue lesson kit and click &ldquo;Save to Library&rdquo; to store it here.
              </p>
            </div>
            <Link
              href="/create-lesson"
              className="inline-block px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 transition-colors shadow-2xs"
            >
              Generate First Lesson ➔
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
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
                        ✅ Verified by Teacher
                      </span>
                    ) : lesson.verificationStatus === "needs_review" ? (
                      <span className="px-2.5 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                        ⚠️ Needs Review
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-900 rounded-full border border-blue-200">
                        🤖 AI Generated
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {lesson.title}
                  </h3>

                  {/* Language Pair */}
                  <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Pair:</span>
                    <span className="font-bold text-slate-900">
                      {lesson.sourceLanguage || "Hindi"} ➔ {lesson.targetLanguage || "Santhali"}
                    </span>
                  </div>

                  {/* Verification & Timestamp Info */}
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    {lesson.verifiedAt ? (
                      <p className="text-emerald-800 font-medium">
                        Verified by {lesson.verifiedBy || "Teacher"} ({lesson.verifiedAt})
                      </p>
                    ) : (
                      <p className="italic">Not yet verified by teacher</p>
                    )}
                    <p>
                      Saved: {new Date(lesson.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/student?id=${lesson.id}`}
                      className="flex-1 text-center py-2.5 px-3 text-xs font-bold rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-2xs"
                    >
                      🎒 Start Student Mode
                    </Link>
                    <Link
                      href={`/create-lesson?id=${lesson.id}`}
                      className="py-2.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      title="Open and edit lesson"
                    >
                      ✏️ Edit
                    </Link>
                  </div>

                  {/* Delete Option */}
                  {deleteConfirmationId === lesson.id ? (
                    <div className="p-2 bg-red-50 border border-red-200 rounded-xl text-xs flex items-center justify-between gap-2">
                      <span className="text-red-900 font-medium">Delete this lesson?</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(lesson.id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-white bg-red-600 rounded-lg hover:bg-red-700"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmationId(null)}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white border border-slate-300 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmationId(lesson.id)}
                      className="text-right text-[11px] font-medium text-slate-400 hover:text-red-600 transition-colors pt-1"
                    >
                      🗑️ Delete lesson
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
