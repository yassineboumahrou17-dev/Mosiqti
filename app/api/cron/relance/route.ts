import { NextResponse } from "next/server";
import { getPendingOrdersForRelance, markOrderAsRelanceSent } from "@/lib/googleSheets";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Check authorization header for Vercel Cron
  // Normally you should verify the secret, but for now we'll rely on basic check or skip for testing.
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const ordersToRelance = await getPendingOrdersForRelance();

    if (!ordersToRelance || ordersToRelance.length === 0) {
      return NextResponse.json({ message: "No pending orders to relance." });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error("[CRON] RESEND_API_KEY is not configured.");
      return new NextResponse("Resend API Key missing", { status: 500 });
    }

    const resend = new Resend(resendApiKey);
    let sentCount = 0;

    for (const order of ordersToRelance) {
      const email = order.answers.email;
      if (!email) continue;

      const checkoutUrl = `https://mosiqti.com/checkout?orderId=${order.id}`;

      try {
        await resend.emails.send({
          from: "Mosiqti <contact@mosiqti.com>", // Update to your verified domain
          to: email,
          subject: "🎵 N'oubliez pas votre chanson sur-mesure !",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; line-height: 1.5;">
              <h2 style="color: #333;">Mosiqti</h2>
              <p>Bonjour,</p>
              <p>Vous avez commencé à créer une chanson personnalisée pour <strong>${order.answers.recipientName || "votre proche"}</strong>, mais vous n'avez pas encore finalisé votre commande.</p>
              <p>Toutes vos informations sont sauvegardées ! Il ne vous reste plus qu'une étape pour que nos artistes se mettent au travail.</p>
              <br>
              <a href="${checkoutUrl}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Finaliser ma commande</a>
              <p style="margin-top: 30px; font-size: 12px; color: #666;">
                Si le bouton ne fonctionne pas, copiez ce lien : <br>
                ${checkoutUrl}
              </p>
            </div>
          `,
        });

        await markOrderAsRelanceSent(order.id);
        sentCount++;
        console.log(`[CRON] Relance sent to ${email} for order ${order.id}`);
      } catch (e) {
        console.error(`[CRON] Failed to send relance to ${email}:`, e);
      }
    }

    return NextResponse.json({ message: `Successfully sent ${sentCount} relance emails.` });
  } catch (error) {
    console.error("[CRON] Error executing relance cron job:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
