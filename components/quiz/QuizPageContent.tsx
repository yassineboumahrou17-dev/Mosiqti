import { QuizFieldInput } from "@/components/quiz/QuizFieldInput";
import type { QuizAnswers, QuizPage } from "@/data/quizData";

interface QuizPageContentProps {
  page: QuizPage;
  answers: QuizAnswers;
  onUpdate: <K extends keyof QuizAnswers>(
    key: K,
    value: QuizAnswers[K],
  ) => void;
}

export function QuizPageContent({
  page,
  answers,
  onUpdate,
}: QuizPageContentProps) {
  return (
    <div className="space-y-10">
      {page.fields
        .filter((field) => !field.condition || field.condition(answers))
        .map((field) => (
        <div key={field.id} id={`field-${field.id}`} className="animate-fade-in scroll-mt-24">
          <h3 className="mb-4 text-base font-semibold text-foreground">
            {field.label}
          </h3>
          {field.hint && (
            <p className="mb-4 text-sm font-light italic text-muted">
              {field.hint}
            </p>
          )}
          <QuizFieldInput
            field={field}
            answers={answers}
            onUpdate={onUpdate}
          />
        </div>
      ))}
    </div>
  );
}
