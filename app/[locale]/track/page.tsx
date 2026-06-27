import { getOrderById } from "@/lib/orders";
import { getOptionLabel } from "@/lib/quiz";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { TrackForm } from "@/components/track/TrackForm";
import { getTranslations } from "next-intl/server";

export default async function TrackPage({ searchParams }: { searchParams: Promise<{ orderId?: string, email?: string }> }) {
  const { orderId, email } = await searchParams;
  const t = await getTranslations('Track');
  const tCheckout = await getTranslations('Checkout');
  const tQuiz = await getTranslations('Quiz');

  if (!orderId || !email) {
    return <TrackForm />;
  }

  const order = getOrderById(orderId);
  if (!order || order.answers.email.toLowerCase() !== email.toLowerCase().trim()) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#fff8f5] px-4 py-12">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <span className="text-4xl">🔍</span>
          <h1 className="mt-6 font-serif text-2xl font-bold text-[#2d2d2d]">
            {t('notFound.title')}
          </h1>
          <p className="mt-3 text-sm font-medium text-gray-500 leading-relaxed">
            {t('notFound.desc')}
          </p>
          <Link
            href="/track"
            className="mt-8 inline-block w-full rounded-2xl bg-[#ff7a45] px-6 py-4 text-sm font-bold text-white transition-transform hover:scale-[1.02] shadow-md shadow-[#ff7a45]/20"
          >
            {t('notFound.btn')}
          </Link>
        </div>
      </div>
    );
  }

  const { answers } = order;

  return (
    <div className="min-h-screen bg-hero-gradient pb-24 pt-12">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        {/* En‑tête */}
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

        {/* Contenu principal */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Colonne gauche – résumé */}
          <div className="space-y-6 lg:col-span-2">
            {/* Box 1 – caractéristiques */}
            <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-sm text-start">
              <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <span>🎵</span> {tCheckout('style.title')}
              </h2>
              <div className="grid gap-y-4 gap-x-6 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs font-semibold text-subtle uppercase tracking-wider">{tCheckout('style.recipient')}</p>
                  <p className="mt-1 font-bold text-foreground capitalize">
                    {getOptionLabel("recipientType", answers.recipientType, tQuiz)} ({answers.recipientName})
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-subtle uppercase tracking-wider">{tCheckout('style.genre')}</p>
                  <p className="mt-1 font-bold text-foreground capitalize">
                    {getOptionLabel("genre", answers.genre, tQuiz, answers)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-subtle uppercase tracking-wider">{tCheckout('style.voice')}</p>
                  <p className="mt-1 font-bold text-foreground capitalize">
                    {getOptionLabel("voiceGender", answers.voiceGender, tQuiz)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-subtle uppercase tracking-wider">{tCheckout('style.language')}</p>
                  <p className="mt-1 font-bold text-foreground capitalize">
                    {getOptionLabel("songLanguage", answers.songLanguage, tQuiz)}
                  </p>
                </div>
              </div>
            </div>
            {/* Box 2 – histoire */}
            <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-sm text-start">
              <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <span>✍️</span> {tCheckout('story.title')}
              </h2>
              <div className="space-y-5 text-sm leading-relaxed">
                <div>
                  <h3 className="text-xs font-bold text-subtle uppercase tracking-wider mb-1.5">
                    {tCheckout('story.qualities')}
                  </h3>
                  <p className="text-foreground font-medium bg-background/50 rounded-xl p-4 border border-border/40 whitespace-pre-line italic">
                    « {answers.beautifulQualities} »
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-subtle uppercase tracking-wider mb-1.5">
                    {tCheckout('story.memories')}
                  </h3>
                  <p className="text-foreground font-medium bg-background/50 rounded-xl p-4 border border-border/40 whitespace-pre-line italic">
                    « {answers.specialMoments} »
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-subtle uppercase tracking-wider mb-1.5">
                    {tCheckout('story.message')}
                  </h3>
                  <p className="text-foreground font-medium bg-background/50 rounded-xl p-4 border border-border/40 whitespace-pre-line italic">
                    « {answers.specialMessage} »
                  </p>
                </div>
              </div>
            </div>
            {/* Box 3 – contact */}
            <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-sm text-start">
              <h2 className="font-display text-xl font-bold text-foreground mb-5 flex items-center gap-2">
                <span>📧</span> {tCheckout('contact.title')}
              </h2>
              <div className="grid gap-y-4 gap-x-6 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs font-semibold text-subtle uppercase tracking-wider">{tCheckout('contact.email')}</p>
                  <p className="mt-1 font-bold text-foreground select-all">{answers.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-subtle uppercase tracking-wider">{tCheckout('contact.phone')}</p>
                  <p className="mt-1 font-bold text-foreground rtl:dir-ltr rtl:text-end">{answers.phoneCountryCode} {answers.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite – statut & action */}
          <div className="space-y-6">
            {/* Ticket */}
            <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-md sticky top-24">
              <h2 className="font-display text-xl font-bold text-foreground mb-4">
                {tCheckout('receipt.title')}
              </h2>
              <div className="space-y-3.5 border-b border-border pb-4 text-sm font-medium text-muted">
                <div className="flex justify-between gap-4 text-start">
                  <span>{tCheckout('receipt.creation')} ({order.answers.selectedOffer === "express" ? tCheckout('receipt.express') : tCheckout('receipt.standard')})</span>
                  <span className="font-semibold text-foreground whitespace-nowrap">{order.amount.toFixed(2)} dhs</span>
                </div>
                <div className="flex justify-between gap-4 text-xs text-accent-mint font-bold text-start">
                  <span>{tCheckout('receipt.writing')}</span>
                  <span>{tCheckout('receipt.included')}</span>
                </div>
                <div className="flex justify-between gap-4 text-xs text-accent-mint font-bold text-start">
                  <span>{tCheckout('receipt.delivery')}</span>
                  <span>{tCheckout('receipt.included')}</span>
                </div>
              </div>
              <div className="flex items-baseline justify-between pt-4 gap-4">
                <span className="text-base font-bold text-foreground">{tCheckout('receipt.total')}</span>
                <span className="text-3xl font-display font-bold text-primary whitespace-nowrap">{order.amount.toFixed(2)} dhs</span>
              </div>

              {/* Statut */}
              <div className="mt-6 text-center">
                {order.status === "paid" ? (
                  <p className="text-lg font-medium text-green-600">{t('status.paid')}</p>
                ) : (
                  <p className="text-lg font-medium text-yellow-700">{t('status.pending')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
