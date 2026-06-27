import { useTranslations } from "next-intl";

export function PromoBanner() {
  const t = useTranslations('PromoBanner');
  return (
    <div className="bg-foreground py-2.5 overflow-hidden whitespace-nowrap flex">
      {/* Duplicate the scrolling element to create a seamless infinite loop */}
      {[...Array(2)].map((_, i) => (
        <div key={i} className="animate-marquee-banner shrink-0 text-xs font-semibold tracking-wide text-white rtl:animate-marquee-banner-rtl flex items-center justify-around min-w-full">
          {[...Array(5)].map((_, j) => (
            <span key={j} className="mx-4">{t('text')}</span>
          ))}
        </div>
      ))}
    </div>
  );
}
