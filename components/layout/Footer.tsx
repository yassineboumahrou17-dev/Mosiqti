import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations('Footer');
  return (
    <footer className="bg-footer-gradient text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="text-center">
          <p className="font-display text-3xl font-bold">
            🎵 Mosiqti
          </p>
          <p className="mt-3 text-sm font-medium text-white/60">
            {t('description')}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-white/70">
          <Link href="#" className="transition-colors hover:text-white">
            {t('contact')}
          </Link>
          <Link href="#" className="transition-colors hover:text-white">
            {t('terms')}
          </Link>
          <Link href="#" className="transition-colors hover:text-white">
            {t('sales')}
          </Link>
          <Link href="#" className="transition-colors hover:text-white">
            {t('refunds')}
          </Link>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-xs font-medium text-white/40">
            © {new Date().getFullYear()} Mosiqti. {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
