import { type NextRequest } from "next/server";
import { getOrderById } from "@/lib/orders";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return Response.json(
        { error: "L'identifiant de la commande est requis." },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return Response.json(
        { error: "Commande non trouvée." },
        { status: 404 }
      );
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      console.log(
        "STRIPE_SECRET_KEY non définie. Utilisation du Mode Démo."
      );
      // Mode Démo: Simule le paiement et renvoie vers la page succès en local
      const successUrl = `/checkout/success?orderId=${orderId}&demo=true`;
      return Response.json({ url: successUrl });
    }

    // Mode Stripe Réel / Test
    const stripe = new Stripe(stripeSecretKey);
    const origin = request.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mad",
            product_data: {
              name: `Chanson personnalisée pour ${order.answers.recipientName} (${order.answers.selectedOffer === "express" ? "Formule Express" : "Formule Standard"})`,
              description: `Style : ${order.answers.genre === "autre" ? order.answers.customGenre : order.answers.genre} · Voix : ${order.answers.voiceGender} · Langue : ${order.answers.songLanguage}`,
            },
            unit_amount: order.amount * 100, // En centimes (ex: 19000 pour 190 dhs)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/checkout/success?orderId=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?orderId=${orderId}`,
      customer_email: order.answers.email,
      metadata: {
        orderId: order.id,
      },
    });

    if (!session.url) {
      return Response.json(
        { error: "Erreur lors de la création de la session Stripe." },
        { status: 500 }
      );
    }

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return Response.json(
      { error: "Une erreur est survenue lors de l'initialisation du paiement." },
      { status: 500 }
    );
  }
}
