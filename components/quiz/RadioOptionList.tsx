import type { QuizOption } from "@/data/quizData";

interface RadioOptionListProps {
  options: QuizOption[];
  value: string | null;
  onChange: (value: string) => void;
}

export function RadioOptionList({
  options,
  value,
  onChange,
}: RadioOptionListProps) {
  return (
    <div className="space-y-3" role="listbox">
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onChange(option.value)}
            className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all duration-200 ${
              isSelected
                ? "border-2 border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.01]"
                : "border-border-light bg-surface hover:border-border hover:bg-subtle/10"
            }`}
          >
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                isSelected ? "border-foreground" : "border-subtle"
              }`}
            >
              {isSelected && (
                <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
              )}
            </span>
            <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
