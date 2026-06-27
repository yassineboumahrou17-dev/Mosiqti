import { Button } from "@/components/ui/Button";
import { Section, SectionHeader } from "@/components/ui/Section";

import { useTranslations } from "next-intl";

export function WhatsIncluded() {
  const t = useTranslations('WhatsIncluded');

  const features = [
    {
      icon: "🎙️",
      title: t('feature1'),
      description: t('desc1'),
    },
    {
      icon: "✍️",
      title: t('feature2'),
      description: t('desc2'),
    },
    {
      icon: "📩",
      title: t('feature3'),
      description: t('desc3'),
    },
  ];
  return (
    <Section id="inclus" background="gradient">
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <div className="mx-auto max-w-3xl">


        <div className="space-y-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-start gap-4 rounded-2xl bg-surface p-6 shadow-sm"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-border-light text-xl">
                {feature.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-accent-mint">✓</span>
                  <h3 className="font-bold text-foreground">{feature.title}</h3>
                </div>
                <p className="mt-1 text-sm font-medium text-muted">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {/* Card Standard */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-border bg-surface p-6 sm:p-8 shadow-md transition-all hover:-translate-y-1 hover:shadow-lg">
            <h3 className="font-display text-2xl font-bold text-foreground">{t('standardTitle')}</h3>
            <p className="mt-2 text-xs font-semibold text-muted">{t('standardSubtitle')}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-foreground">190</span>
              <span className="text-lg font-bold text-muted">{t('currency')}</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm font-medium text-muted">
              <li className="flex items-center gap-2">
                <span className="text-accent-mint">✓</span> {t('standardItem1')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-mint">✓</span> {t('standardItem2')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-mint">✓</span> {t('standardItem3')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-accent-mint">✓</span> {t('standardItem4')}
              </li>
            </ul>
            <div className="mt-8">
              <Button href="/creer-ma-chanson?plan=standard" className="w-full justify-center !py-3.5 text-sm" variant="secondary">
                {t('standardBtn')}
              </Button>
            </div>
          </div>

          {/* Card Express */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-primary bg-surface p-6 sm:p-8 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute end-0 top-0 bg-primary px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white rounded-es-xl">
              {t('popular')}
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground">{t('expressTitle')}</h3>
            <p className="mt-2 text-xs font-semibold text-muted">{t('expressSubtitle')}</p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display text-4xl font-bold text-foreground">290</span>
              <span className="text-lg font-bold text-muted">{t('currency')}</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm font-medium text-muted">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {t('expressItem1')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {t('expressItem2')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {t('expressItem3')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {t('expressItem4')}
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span> {t('expressItem5')}
              </li>
            </ul>
            <div className="mt-8">
              <Button href="/creer-ma-chanson?plan=express" className="w-full justify-center !py-3.5 text-sm">
                {t('expressBtn')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
