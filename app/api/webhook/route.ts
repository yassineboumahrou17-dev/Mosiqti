import { type NextRequest } from "next/server";
import { markOrderAsPaid } from "@/lib/orders";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    return Response.json(
      { error: "Stripe configuration is missing on server." },
      { status: 500 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event: Stripe.Event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // En développement local sans secret de webhook configuré, on extrait directement le corps de la requête
      console.warn("STRIPE_WEBHOOK_SECRET absent. Traitement direct du payload (non sécurisé, utile en dev).");
      event = JSON.parse(body);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return Response.json(
      { error: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  // Gérer l'événement checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;

    if (orderId) {
      console.log(`Paiement Stripe reçu pour la commande : ${orderId}`);
      markOrderAsPaid(orderId);
    } else {
      console.error("Aucun orderId trouvé dans les métadonnées de la session Stripe.");
    }
  }

  return Response.json({ received: true });
}
