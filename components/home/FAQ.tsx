"use client";

import { useState } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "next-intl";

export function FAQ() {
  const t = useTranslations('Faq');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { question: t('q1'), answer: t('a1') },
    { question: t('q2'), answer: t('a2') },
    { question: t('q3'), answer: t('a3') },
    { question: t('q4'), answer: t('a4') },
    { question: t('q5'), answer: t('a5') },
    { question: t('q6'), answer: t('a6') },
  ];

  return (
    <Section id="faq" background="surface">
      <SectionHeader
        title={t('sectionTitle')}
        subtitle={t('sectionSubtitle')}
      />

      <div className="mx-auto max-w-2xl space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={faq.question}
            className="overflow-hidden rounded-2xl border-2 border-border bg-surface transition-colors hover:border-secondary/30"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between px-6 py-5 text-left"
            >
              <span className="pe-4 font-bold text-foreground text-start">
                {faq.question}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold transition-colors ${
                  openIndex === index
                    ? "bg-primary text-white"
                    : "bg-border text-muted"
                }`}
              >
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <p className="border-t border-border px-6 pb-5 pt-2 text-sm font-medium leading-relaxed text-muted">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>

      <p className="mx-auto mt-12 max-w-md text-center text-sm font-medium text-muted">
        {t('moreQuestions')}{" "}
        <a
          href="mailto:hello@Mosiqti.com"
          className="font-bold text-primary hover:underline"
        >
          hello@Mosiqti.com
        </a>
      </p>
    </Section>
  );
}
