import Link from "next/link";
import { type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "white";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  icon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-cta-gradient text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02] border-0",
  secondary:
    "bg-surface text-foreground hover:bg-border-light border-2 border-border shadow-sm",
  ghost:
    "bg-transparent text-foreground hover:bg-border-light border-2 border-transparent",
  white:
    "bg-white text-foreground shadow-lg hover:bg-white/90 border-0",
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  icon,
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-bold transition-all duration-200 ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </Link>
  );
}
