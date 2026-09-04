import { Suspense } from "react";
import PageContainer from "@/components/PageContainer";
import StudentModeContent from "./student-mode-content";

export const dynamic = "force-dynamic";

function StudentModeFallback() {
  return (
    <PageContainer className="max-w-4xl mx-auto py-12 text-center text-slate-500">
      Loading student learning mode...
    </PageContainer>
  );
}

export default async function StudentModePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawId = params.id;
  const lessonId = Array.isArray(rawId) ? (rawId[0] ?? null) : (rawId ?? null);

  return (
    <Suspense fallback={<StudentModeFallback />}>
      <StudentModeContent key={lessonId ?? "default"} lessonId={lessonId} />
    </Suspense>
  );
}
