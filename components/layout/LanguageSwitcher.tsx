"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'fr' ? 'ar' : 'fr';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-0.5 sm:py-1 mx-1 sm:mx-2 border border-border rounded-md text-muted hover:text-foreground transition-colors"
      dir="ltr"
    >
      {locale === 'fr' ? 'العربية' : 'FR'}
    </button>
  );
}
