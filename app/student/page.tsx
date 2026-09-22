import { Suspense } from "react";
import PageContainer from "@/components/PageContainer";
import StudentModeContent from "./student-mode-content";


function StudentModeFallback() {
  return (
    <PageContainer className="max-w-4xl mx-auto py-12 text-center text-slate-500">
      Loading student learning mode...
    </PageContainer>
  );
}

export default function StudentModePage() {
  return (
    <Suspense fallback={<StudentModeFallback />}>
      <StudentModeContent lessonId={null} />
    </Suspense>
  );
}
