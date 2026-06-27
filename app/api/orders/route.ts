import { type NextRequest } from "next/server";
import { createOrder } from "@/lib/orders";

export async function POST(request: NextRequest) {
  try {
    const answers = await request.json();

    // Validations de base
    if (!answers) {
      return Response.json(
        { error: "Le corps de la requête est vide." },
        { status: 400 }
      );
    }

    if (!answers.recipientName || !answers.recipientName.trim()) {
      return Response.json(
        { error: "Le prénom du destinataire est requis." },
        { status: 400 }
      );
    }

    if (!answers.email || !answers.email.trim()) {
      return Response.json(
        { error: "L'adresse e-mail est requise." },
        { status: 400 }
      );
    }

    const order = createOrder(answers);

    return Response.json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating order:", error);
    return Response.json(
      { error: "Une erreur est survenue lors de la création de la commande." },
      { status: 500 }
    );
  }
}
