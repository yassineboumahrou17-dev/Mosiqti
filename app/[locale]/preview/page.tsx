import { getOrderById } from "@/lib/orders";
import { getTranslations } from "next-intl/server";
import PreviewPlayer from "./PreviewPlayer";

interface PreviewPageProps {
  searchParams: Promise<{ quizId?: string, orderId?: string }>;
}

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const params = await searchParams;
  const orderId = params.quizId || params.orderId;
  const t = await getTranslations('Checkout');

  if (!orderId) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">Lien invalide</h1>
        <p className="mt-4 text-muted">Aucun identifiant fourni.</p>
      </div>
    );
  }

  const order = await getOrderById(orderId);

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">Introuvable</h1>
        <p className="mt-4 text-muted">Cette commande n'existe pas.</p>
      </div>
    );
  }

  if (order.status === "paid") {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">Commande Validée</h1>
        <p className="mt-4 text-muted">Vous avez déjà validé votre commande. Votre chanson complète est en cours de création !</p>
      </div>
    );
  }

  if (order.previewStatus !== "ready" || !order.previewAudioUrl) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">Génération en cours...</h1>
        <p className="mt-4 text-muted">Votre aperçu est en train d'être généré par nos artistes. Veuillez revenir dans quelques minutes.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero-gradient pb-24 pt-12">
      <div className="mx-auto max-w-2xl px-6 md:px-10 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Votre aperçu gratuit (30s)
        </h1>
        <p className="mt-4 text-muted font-medium">
          Découvrez un extrait de ce que pourrait donner votre chanson.
          <br />
          <span className="text-accent-yellow">Attention : Ce lien est écoutable une seule fois.</span>
        </p>

        <div className="mt-12 bg-surface rounded-3xl p-8 border border-border shadow-xl">
          {order.hasListenedToPreview ? (
            <div className="space-y-4">
              <span className="text-4xl block">🎧</span>
              <h2 className="text-xl font-bold text-foreground">Aperçu déjà écouté</h2>
              <p className="text-muted text-sm">Vous avez déjà consommé votre écoute unique.</p>
              <a href={`/checkout?orderId=${order.id}`} className="mt-6 inline-block w-full bg-primary text-white font-bold py-3 px-6 rounded-full hover:bg-primary-dark transition-colors">
                Finaliser ma commande pour obtenir la version complète
              </a>
            </div>
          ) : (
            <PreviewPlayer orderId={order.id} audioUrl={order.previewAudioUrl} />
          )}
        </div>
      </div>
    </div>
  );
}
