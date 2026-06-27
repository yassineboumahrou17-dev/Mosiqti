import { RadioOptionList } from "@/components/quiz/RadioOptionList";
import { PHONE_COUNTRY_OPTIONS } from "@/data/quizData";
import type { QuizAnswers, QuizField } from "@/data/quizData";

interface QuizFieldInputProps {
  field: QuizField;
  answers: QuizAnswers;
  onUpdate: <K extends keyof QuizAnswers>(
    key: K,
    value: QuizAnswers[K],
  ) => void;
}

export function QuizFieldInput({
  field,
  answers,
  onUpdate,
}: QuizFieldInputProps) {
  const value = answers[field.field];

  if (field.type === "radio" && field.options) {
    return (
      <RadioOptionList
        options={field.options}
        value={value as string | null}
        onChange={(v) => onUpdate(field.field, v as QuizAnswers[typeof field.field])}
      />
    );
  }

  if (field.type === "select" && field.options) {
    return (
      <div className="relative">
        <select
          value={value as string}
          onChange={(e) =>
            onUpdate(field.field, e.target.value as QuizAnswers[typeof field.field])
          }
          className="w-full appearance-none rounded-xl border border-border-light bg-surface px-5 py-4 pe-10 text-sm font-light text-foreground focus:border-foreground focus:outline-none"
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-4">
          <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    );
  }

  if (field.type === "tel") {
    return (
      <div className="flex gap-3">
        <div className="relative shrink-0 w-28 sm:w-32">
          <select
            value={answers.phoneCountryCode}
            onChange={(e) => onUpdate("phoneCountryCode", e.target.value)}
            className="w-full appearance-none rounded-xl border border-border-light bg-surface px-3 py-4 pe-8 text-sm font-light text-foreground focus:border-foreground focus:outline-none"
          >
            {PHONE_COUNTRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
            <svg className="h-4 w-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <input
          type="tel"
          value={answers.phoneNumber}
          onChange={(e) => onUpdate("phoneNumber", e.target.value)}
          placeholder={field.placeholder}
          className="w-full rounded-xl border border-border-light bg-surface px-5 py-4 text-sm font-light text-foreground placeholder:text-subtle focus:border-foreground focus:outline-none"
        />
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <textarea
        value={value as string}
        onChange={(e) =>
          onUpdate(field.field, e.target.value as QuizAnswers[typeof field.field])
        }
        placeholder={field.placeholder}
        rows={6}
        className="w-full resize-none rounded-xl border border-border-light bg-surface px-5 py-4 text-sm font-light leading-relaxed text-foreground placeholder:text-subtle focus:border-foreground focus:outline-none"
      />
    );
  }

  const inputType = field.type === "email" ? "email" : "text";

  return (
    <input
      type={inputType}
      value={value as string}
      onChange={(e) =>
        onUpdate(field.field, e.target.value as QuizAnswers[typeof field.field])
      }
      placeholder={field.placeholder}
      className="w-full rounded-xl border border-border-light bg-surface px-5 py-4 text-sm font-light text-foreground placeholder:text-subtle focus:border-foreground focus:outline-none"
    />
  );
}
