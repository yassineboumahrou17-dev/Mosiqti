import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ActionButtonVariant = "primary" | "secondary" | "ghost";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ActionButtonVariant;
}

const variants: Record<ActionButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-hover border border-accent disabled:opacity-40 disabled:cursor-not-allowed",
  secondary:
    "bg-surface text-foreground hover:bg-background border border-border disabled:opacity-40 disabled:cursor-not-allowed",
  ghost:
    "bg-transparent text-muted hover:text-foreground border border-transparent disabled:opacity-40 disabled:cursor-not-allowed",
};

export function ActionButton({
  children,
  variant = "primary",
  className = "",
  ...props
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium tracking-wide transition-colors duration-200 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
