import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations('Header');

  const navLinks = [
    { href: "/#comment-ca-marche", label: t('howItWorks') },
    { href: "/#pour-qui", label: t('forWhom') },
    { href: "/#examples", label: t('examples') },
    { href: "/#inclus", label: t('included') },
    { href: "/#faq", label: t('faq') },
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 md:px-10">
        <div className="flex flex-1 items-center justify-start">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 font-display text-lg sm:text-xl font-bold tracking-tight text-foreground md:text-2xl shrink-0"
          >
            <span className="text-lg sm:text-xl">🎵</span>
            Mosiqti
          </Link>
        </div>

        <nav className="hidden items-center justify-center gap-4 lg:gap-6 xl:gap-8 md:flex shrink-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-muted transition-colors hover:text-primary whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1.5 sm:gap-0">
          <LanguageSwitcher />
          <Link
            href="/track"
            className="text-[9px] sm:text-[10px] font-medium text-muted opacity-80 transition-opacity hover:opacity-100 whitespace-nowrap"
          >
            {t('trackOrder')}
          </Link>
          <Button
            href="/creer-ma-chanson"
            className="ms-1.5 sm:ms-2 !px-2.5 sm:!px-5 !py-2 sm:!py-2.5 text-[9px] sm:text-xs md:!px-6 md:!py-3 md:text-sm whitespace-nowrap"
          >
            {t('createSong')}
          </Button>
        </div>

      </div>
    </header>
  );
}
