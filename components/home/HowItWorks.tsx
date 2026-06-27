import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "next-intl";

export function HowItWorks() {
  const t = useTranslations('HowItWorks');

  const steps = [
    {
      number: "1",
      emoji: "✍️",
      color: "from-primary/20 to-accent-pink/20",
      title: t('step1Title'),
      description: t('step1Desc'),
    },
    {
      number: "2",
      emoji: "🎸",
      color: "from-secondary/20 to-accent-pink/20",
      title: t('step2Title'),
      description: t('step2Desc'),
    },
    {
      number: "3",
      emoji: "🎁",
      color: "from-accent-yellow/30 to-primary/20",
      title: t('step3Title'),
      description: t('step3Desc'),
    },
  ];

  return (
    <Section id="comment-ca-marche">
      <SectionHeader
        title={t('sectionTitle')}
        subtitle={t('sectionSubtitle')}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`rounded-3xl bg-gradient-to-br ${step.color} p-8 shadow-sm`}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-surface text-lg font-bold text-primary shadow-sm">
                {step.number}
              </span>
              <span className="text-3xl">{step.emoji}</span>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">
              {step.title}
            </h3>
            <p className="mt-3 text-sm font-medium leading-relaxed text-muted">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
