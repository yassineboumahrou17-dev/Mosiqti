"use client";

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { ChangeEvent } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = e.target.value;
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <div className="mx-1 sm:mx-2 relative inline-block">
      <select
        value={locale}
        onChange={handleLocaleChange}
        className="appearance-none bg-transparent text-[10px] sm:text-xs font-semibold px-2 py-0.5 sm:py-1 pr-6 border border-border rounded-md text-muted hover:text-foreground transition-colors outline-none cursor-pointer"
        dir="ltr"
      >
        <option value="ma">الدارجة</option>
        <option value="ar">العربية</option>
        <option value="fr">Français</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-1 flex items-center px-1 text-muted">
        <svg className="h-3 w-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
