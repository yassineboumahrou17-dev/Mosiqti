import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";
import { useTranslations } from "next-intl";

export function GiftCategories() {
  const t = useTranslations('GiftCategories');

  const categories = [
    {
      emoji: "💑",
      title: t('cat1Title'),
      description: t('cat1Desc'),
      color: "border-accent-pink/40 hover:border-accent-pink",
    },
    {
      emoji: "👶",
      title: t('cat2Title'),
      description: t('cat2Desc'),
      color: "border-accent-yellow/40 hover:border-accent-yellow",
    },
    {
      emoji: "🕊️",
      title: t('cat3Title'),
      description: t('cat3Desc'),
      color: "border-secondary/40 hover:border-secondary",
    },
    {
      emoji: "👨‍👩‍👧",
      title: t('cat4Title'),
      description: t('cat4Desc'),
      color: "border-primary/40 hover:border-primary",
    },
    {
      emoji: "🙋",
      title: t('cat5Title'),
      description: t('cat5Desc'),
      color: "border-accent-mint/40 hover:border-accent-mint",
    },
    {
      emoji: "🤝",
      title: t('cat6Title'),
      description: t('cat6Desc'),
      color: "border-secondary/40 hover:border-secondary",
    },
    {
      emoji: "💪",
      title: t('cat7Title'),
      description: t('cat7Desc'),
      color: "border-primary/40 hover:border-primary",
    },
    {
      emoji: "🌱",
      title: t('cat8Title'),
      description: t('cat8Desc'),
      color: "border-accent-mint/40 hover:border-accent-mint",
    },
  ];

  return (
    <Section id="pour-qui" background="surface">
      <SectionHeader
        title={t('sectionTitle')}
        subtitle={t('sectionSubtitle')}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div
            key={category.title}
            className={`group rounded-2xl border-2 bg-surface p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-secondary/10 ${category.color}`}
          >
            <span className="text-3xl">{category.emoji}</span>
            <h3 className="mt-4 font-display text-lg font-bold text-foreground">
              {category.title}
            </h3>
            <p className="mt-2 text-sm font-medium text-muted">
              {category.description}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Button href="/creer-ma-chanson" icon={<span>🎵</span>}>
          {t('createSong')}
        </Button>
      </div>
    </Section>
  );
}
