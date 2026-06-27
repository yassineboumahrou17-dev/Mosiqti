import { Link } from "@/i18n/routing";
import { markOrderAsPaid } from "@/lib/orders";
import { getOptionLabel } from "@/lib/quiz";
import { getTranslations } from "next-intl/server";

interface SuccessPageProps {
  searchParams: Promise<{
    orderId?: string;
    demo?: string;
    session_id?: string;
  }>;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { orderId } = await searchParams;
  const t = await getTranslations('Success');
  const tQuiz = await getTranslations('Quiz');

  if (!orderId) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center md:px-10 md:py-32">
        <span className="text-4xl">⚠️</span>
        <h1 className="mt-6 font-display text-2xl font-bold text-foreground">
          {t('empty.title')}
        </h1>
        <p className="mt-4 text-sm font-light text-muted">
          {t('empty.desc')}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t('empty.btn')}
        </Link>
      </div>
    );
  }

  // Marquer immédiatement la commande comme payée dans la base locale (démo ou redirection réussie)
  const order = markOrderAsPaid(orderId);

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center md:px-10 md:py-32">
        <span className="text-4xl">🔍</span>
        <h1 className="mt-6 font-display text-2xl font-bold text-foreground">
          {t('notFound.title')}
        </h1>
        <p className="mt-4 text-sm font-light text-muted">
          {t('notFound.desc', { orderId })}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t('notFound.btn')}
        </Link>
      </div>
    );
  }

  const { answers } = order;

  return (
    <div className="min-h-screen bg-hero-gradient pb-24 pt-12">
      <div className="mx-auto max-w-2xl px-6 py-12 md:px-10">
        
        {/* Carte succès */}
        <div className="overflow-hidden rounded-3xl border-2 border-border bg-surface p-8 shadow-xl text-center relative">
          {/* Confettis / Décorations */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-cta-gradient" />
          
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-mint/10 text-4xl text-accent-mint animate-bounce">
            🎉
          </div>

          <p className="text-xs font-bold uppercase tracking-widest text-accent-mint">
            {t('header.kicker')}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-foreground md:text-4xl">
            {t('header.title')}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-muted">
            {t.rich('header.desc', { name: answers.recipientName, strong: (chunks) => <strong className="text-foreground">{chunks}</strong> })}
          </p>

          {/* Badge statut */}
          <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-accent-mint/10 px-4 py-1.5 text-xs font-bold text-accent-mint">
            <span>✓</span> {t('header.badge')}
          </div>

          {/* Récapitulatif technique */}
          <div className="mt-8 rounded-2xl border border-border/80 bg-background/50 p-5 text-start text-sm leading-relaxed">
            <h2 className="font-bold text-foreground mb-3 text-xs uppercase tracking-wider text-subtle">
              {t('details.title')}
            </h2>
            <ul className="space-y-2">
              <li className="flex justify-between gap-4">
                <span className="text-muted font-medium">{t('details.recipient')}</span>
                <span className="font-bold text-foreground capitalize text-end">
                  {getOptionLabel("recipientType", answers.recipientType, tQuiz)} ({answers.recipientName})
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-muted font-medium">{t('details.genre')}</span>
                <span className="font-bold text-foreground capitalize text-end">
                  {getOptionLabel("genre", answers.genre, tQuiz, answers)}
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-muted font-medium">{t('details.voice')}</span>
                <span className="font-bold text-foreground capitalize text-end">
                  {getOptionLabel("voiceGender", answers.voiceGender, tQuiz)}
                </span>
              </li>
              <li className="flex justify-between gap-4">
                <span className="text-muted font-medium">{t('details.language')}</span>
                <span className="font-bold text-foreground capitalize text-end">
                  {getOptionLabel("songLanguage", answers.songLanguage, tQuiz)}
                </span>
              </li>
              <li className="flex justify-between gap-4 border-t border-border/50 pt-2.5 mt-2.5">
                <span className="text-muted font-medium">{t('details.email')}</span>
                <span className="font-bold text-foreground select-all text-end">{answers.email}</span>
              </li>
            </ul>
          </div>

          {/* Étapes suivantes */}
          <div className="mt-8 text-start">
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              {t('steps.title')}
            </h2>
            
            <div className="relative border-s-2 border-border ps-6 space-y-6">
              {/* Etape 1 */}
              <div className="relative">
                <div className="absolute -start-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary" />
                <h3 className="text-sm font-bold text-foreground">{t('steps.step1Title')}</h3>
                <p className="mt-1 text-xs text-muted leading-relaxed font-medium">
                  {t('steps.step1Desc')}
                </p>
              </div>

              {/* Etape 2 */}
              <div className="relative">
                <div className="absolute -start-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary" />
                <h3 className="text-sm font-bold text-foreground">{t('steps.step2Title')}</h3>
                <p className="mt-1 text-xs text-muted leading-relaxed font-medium">
                  {t('steps.step2Desc', { genre: (answers.genre === "autre" ? answers.customGenre : answers.genre) || "" })}
                </p>
              </div>

              {/* Etape 3 */}
              <div className="relative">
                <div className="absolute -start-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-pink" />
                <h3 className="text-sm font-bold text-foreground">{t('steps.step3Title')}</h3>
                <p className="mt-1 text-xs text-muted leading-relaxed font-medium">
                  {t('steps.step3Desc', { 
                    delay: answers.selectedOffer === "express" ? t('steps.expressDelay') : t('steps.standardDelay'),
                    email: answers.email 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Boutons actions */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="rounded-full bg-foreground px-8 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
            >
              {t('btn')}
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
