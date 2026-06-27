"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { QuizPageContent } from "@/components/quiz/QuizPageContent";
import { QuizProgress } from "@/components/quiz/QuizProgress";
import {
  getPageSubtitle,
  getProgressPercent,
  INITIAL_QUIZ_ANSWERS,
  isPageValid,
  getFirstInvalidField,
} from "@/lib/quiz";
import { type QuizAnswers, getQuizPages } from "@/data/quizData";

export function QuizWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('Quiz');
  const QUIZ_PAGES = getQuizPages(t);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(INITIAL_QUIZ_ANSWERS);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const errorRef = useRef<HTMLParagraphElement>(null);

  // Removed useEffect for auto-scrolling to avoid conflicting with field scroll

  const plan = searchParams.get("plan");

  useEffect(() => {
    if (plan === "standard" || plan === "express") {
      setAnswers((prev) => ({ ...prev, selectedOffer: plan }));
    }
  }, [plan]);

  const page = QUIZ_PAGES[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === QUIZ_PAGES.length - 1;
  const progress = getProgressPercent(currentIndex, QUIZ_PAGES.length);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentIndex]);

  const updateAnswer = useCallback(
    <K extends keyof QuizAnswers>(field: K, value: QuizAnswers[K]) => {
      setAnswers((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    [],
  );

  const goNext = async () => {
    if (!isPageValid(page, answers)) {
      setError(t('wizard.errorRequired'));
      
      const firstInvalidField = getFirstInvalidField(page, answers);
      if (firstInvalidField) {
        setTimeout(() => {
          const el = document.getElementById(`field-${firstInvalidField.id}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.classList.add("animate-shake");
            setTimeout(() => el.classList.remove("animate-shake"), 500);
          }
        }, 50);
      }
      return;
    }

    if (isLast) {
      setIsSubmitting(true);
      setError(null);
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(answers),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || t('wizard.errorSubmit'));
        }

        router.push(`/checkout?orderId=${data.orderId}`);
      } catch (err) {
        console.error("Order submission failed:", err);
        const errMsg = err instanceof Error && err.message !== t('wizard.errorSubmit') ? err.message : t('wizard.errorGeneric');
        setError(errMsg);
        setIsSubmitting(false);
        setTimeout(() => {
          if (errorRef.current) {
            errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 50);
      }
      return;
    }

    setCurrentIndex((i) => i + 1);
    setError(null);
  };

  const goBack = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
    setError(null);
  };

  const subtitle = getPageSubtitle(page, answers, t);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-background pb-32">
      <div className="mx-auto max-w-xl px-6 py-12 md:px-10 md:py-16">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {page.title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-sm font-light leading-relaxed text-muted md:text-base">
              {subtitle}
            </p>
          )}
        </div>

        <div key={page.id} className="animate-fade-in">
          <QuizPageContent
            page={page}
            answers={answers}
            onUpdate={updateAnswer}
          />

          {error && (
            <p
              ref={errorRef}
              className="mt-6 text-center text-sm font-semibold text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm animate-shake"
            >
              ⚠️ {error}
            </p>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 start-0 end-0 border-t border-border-light bg-surface px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-6">
          {isFirst ? (
            <Link
              href="/"
              className="shrink-0 text-sm font-light text-muted transition-colors hover:text-foreground flex items-center gap-1"
            >
              <span className="rtl:-scale-x-100">←</span> {t('wizard.back')}
            </Link>
          ) : (
            <div className="w-16 shrink-0" />
          )}

          <div className="flex-1">
            <QuizProgress percent={progress} />
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={goBack}
              disabled={isFirst || isSubmitting}
              aria-label="Question précédente"
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-foreground text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-30 rtl:-scale-x-100"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={isSubmitting}
              aria-label={isLast ? "Finaliser la commande" : "Question suivante"}
              className="flex h-11 w-11 items-center justify-center rounded-lg bg-foreground text-white transition-opacity hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-30 rtl:-scale-x-100"
            >
              {isSubmitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "›"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
