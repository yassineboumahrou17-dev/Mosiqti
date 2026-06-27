"use client";

import { useState } from "react";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "next-intl";

export function Testimonials() {
  const t = useTranslations('Testimonials');

  const testimonials = [
    {
      quote: t('t1q'),
      author: t('t1a'),
      occasion: t('t1o'),
    },
    {
      quote: t('t2q'),
      author: t('t2a'),
      occasion: t('t2o'),
    },
    {
      quote: t('t3q'),
      author: t('t3a'),
      occasion: t('t3o'),
    },
    {
      quote: t('t4q'),
      author: t('t4a'),
      occasion: t('t4o'),
    },
  ];

  const [active, setActive] = useState(0);
  const currentT = testimonials[active];

  return (
    <Section background="gradient">
      <SectionHeader title={t('sectionTitle')} />

      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl bg-surface p-10 shadow-lg shadow-secondary/10 md:p-14">
          <p className="text-center text-4xl text-accent-yellow">★★★★★</p>
          <blockquote className="mt-6 text-center font-display text-xl font-medium leading-relaxed text-foreground md:text-2xl">
            &ldquo;{currentT.quote}&rdquo;
          </blockquote>
          <p className="mt-6 text-center text-sm font-bold text-primary">
            {currentT.author}
          </p>
          <p className="text-center text-xs font-semibold text-subtle">
            {currentT.occasion}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Témoignage ${i + 1}`}
              className={`h-2.5 rounded-full transition-all ${
                i === active
                  ? "w-8 bg-primary"
                  : "w-2.5 bg-border hover:bg-subtle"
              }`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
