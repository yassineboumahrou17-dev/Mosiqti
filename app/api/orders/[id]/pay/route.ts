import { type NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrderPaymentMethod } from "@/lib/orders";
import { sendPaymentConfirmationNotification } from "@/lib/notifications";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { paymentMethod, promoCode } = body;

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "La méthode de paiement est requise." },
        { status: 400 }
      );
    }

    const order = await getOrderById(id);
    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable." },
        { status: 404 }
      );
    }

    // Mettre à jour la méthode de paiement dans Google Sheets
    await updateOrderPaymentMethod(id, paymentMethod);

    // Envoyer la notification de confirmation de paiement (email via Resend)
    await sendPaymentConfirmationNotification(id);

    if (paymentMethod === "upay") {
      // Simulation d'une session UPay
      // Dans un cas réel, on appellerait l'API UPay ici pour générer l'URL de paiement
      const mockPaymentUrl = `/checkout/success?orderId=${id}`;
      return NextResponse.json({ url: mockPaymentUrl });
    }

    // Pour virement bancaire et CashPlus, on retourne simplement un succès
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Error updating payment method:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors du traitement du paiement." },
      { status: 500 }
    );
  }
}
