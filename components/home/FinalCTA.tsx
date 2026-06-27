import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export function FinalCTA() {
  const t = useTranslations('FinalCTA');
  return (
    <section className="relative overflow-hidden bg-cta-gradient">
      <div className="pointer-events-none absolute -start-10 top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -end-10 bottom-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />

      <div className="relative mx-auto max-w-6xl px-6 py-24 text-center md:px-10 md:py-32">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white md:text-5xl">
          {t('title')}
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base font-semibold leading-relaxed text-white/80">
          {t('subtitle1')}
          <br />
          {t('subtitle2')}
        </p>
        <div className="mt-10">
          <Button
            href="/creer-ma-chanson"
            variant="white"
            icon={<span className="inline-block">🎵</span>}
            className="!px-10 !py-5 text-base"
          >
            {t('btn')}
          </Button>
        </div>
      </div>
    </section>
  );
}
