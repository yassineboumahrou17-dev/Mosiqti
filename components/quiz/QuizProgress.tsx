interface QuizProgressProps {
  percent: number;
}

export function QuizProgress({ percent }: QuizProgressProps) {
  return (
    <div className="w-full">
      <p className="mb-2 text-sm font-light text-muted">{percent} % complété</p>
      <div className="h-1 w-full rounded-full bg-border-light">
        <div
          className="h-1 rounded-full bg-foreground transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
