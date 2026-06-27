import { Suspense } from "react";
import { QuizWizard } from "@/components/quiz/QuizWizard";

export default function CreateSongPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><span className="animate-pulse text-lg">Chargement...</span></div>}>
        <QuizWizard />
      </Suspense>
    </div>
  );
}
