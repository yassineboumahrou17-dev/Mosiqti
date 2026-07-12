import { Link } from "@/i18n/routing";
import { getOrderById } from "@/lib/orders";
import { getOptionLabel } from "@/lib/quiz";
import { PaymentSummary } from "@/components/checkout/PaymentSummary";
import { getTranslations } from "next-intl/server";

interface CheckoutPageProps {
  searchParams: Promise<{ orderId?: string }>;
}

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const { orderId } = await searchParams;
  console.log("[CheckoutPage] Requested orderId:", orderId);
  const t = await getTranslations('Checkout');
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
          href="/creer-ma-chanson"
          className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {t('empty.btn')}
        </Link>
      </div>
    );
  }

  const order = await getOrderById(orderId);

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
          href="/creer-ma-chanson"
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
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        
        {/* En-tête */}
        <div className="mb-10 text-center md:text-start">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {t('header.kicker')}
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {t('header.title')}
          </h1>
          <p className="mt-2 text-sm text-muted font-medium">
            {t('header.ref')} <span className="font-mono font-bold text-foreground">{order.id}</span>
          </p>
        </div>

        {/* Grille principale */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Colonne gauche (Récapitulatif) — 2 tiers */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Box 1 : Caractéristiques de la Chanson */}
            <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <span>🎵</span> {t('style.title')}
              </h2>
              
              <div className="grid gap-y-4 gap-x-6 sm:grid-cols-2 text-sm text-start">
                <div>
                  <p className="text-xs font-semibold text-subtle uppercase tracking-wider">{t('style.recipient')}</p>
                  <p className="mt-1 font-bold text-foreground capitalize">
                    {getOptionLabel("recipientType", answers.recipientType, tQuiz)} ({answers.recipientName})
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-subtle uppercase tracking-wider">{t('style.genre')}</p>
                  <p className="mt-1 font-bold text-foreground capitalize">
                    {getOptionLabel("genre", answers.genre, tQuiz, answers)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-subtle uppercase tracking-wider">{t('style.voice')}</p>
                  <p className="mt-1 font-bold text-foreground capitalize">
                    {getOptionLabel("voiceGender", answers.voiceGender, tQuiz)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-subtle uppercase tracking-wider">{t('style.language')}</p>
                  <p className="mt-1 font-bold text-foreground capitalize">
                    {getOptionLabel("songLanguage", answers.songLanguage, tQuiz)}
                  </p>
                </div>
              </div>
            </div>

            {/* Box 2 : L'histoire */}
            <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <span>✍️</span> {t('story.title')}
              </h2>
              
              <div className="space-y-5 text-sm leading-relaxed text-start">
                <div>
                  <h3 className="text-xs font-bold text-subtle uppercase tracking-wider mb-1.5">
                    {t('story.qualities')}
                  </h3>
                  <p className="text-foreground font-medium bg-background/50 rounded-xl p-4 border border-border/40 whitespace-pre-line italic">
                    « {answers.beautifulQualities} »
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-subtle uppercase tracking-wider mb-1.5">
                    {t('story.memories')}
                  </h3>
                  <p className="text-foreground font-medium bg-background/50 rounded-xl p-4 border border-border/40 whitespace-pre-line italic">
                    « {answers.specialMoments} »
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-subtle uppercase tracking-wider mb-1.5">
                    {t('story.message')}
                  </h3>
                  <p className="text-foreground font-medium bg-background/50 rounded-xl p-4 border border-border/40 whitespace-pre-line italic">
                    « {answers.specialMessage} »
                  </p>
                </div>
              </div>
            </div>

            {/* Box 3 : Contact */}
            <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-sm">
              <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <span>📧</span> {t('contact.title')}
              </h2>
              
              <div className="grid gap-y-4 gap-x-6 sm:grid-cols-2 text-sm text-start">
                <div>
                  <p className="text-xs font-semibold text-subtle uppercase tracking-wider">{t('contact.email')}</p>
                  <p className="mt-1 font-bold text-foreground select-all">
                    {answers.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-subtle uppercase tracking-wider">{t('contact.phone')}</p>
                  <p className="mt-1 font-bold text-foreground rtl:dir-ltr rtl:text-end">
                    {answers.phoneCountryCode} {answers.phoneNumber}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Colonne droite (Paiement) — 1 tiers */}
          <div className="space-y-6">
            <PaymentSummary 
              orderId={order.id} 
              baseAmount={order.amount} 
              selectedOffer={answers.selectedOffer} 
            />
          </div>

        </div>

      </div>
    </div>
  );
}
