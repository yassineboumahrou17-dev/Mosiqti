import { NextResponse } from "next/server";
import { getPendingOrdersForRelance, markOrderAsRelanceSent } from "@/lib/googleSheets";
import { sendAbandonedCartNotification } from "@/lib/notifications";

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

    let sentCount = 0;

    for (const { order, stage } of ordersToRelance) {
      try {
        await sendAbandonedCartNotification(order.id, stage);
        await markOrderAsRelanceSent(order.id, stage);
        sentCount++;
      } catch (e) {
        console.error(`[CRON] Failed to send relance to order ${order.id}:`, e);
      }
    }

    return NextResponse.json({ message: `Successfully sent ${sentCount} relance notifications.` });
  } catch (error) {
    console.error("[CRON] Error executing relance cron job:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
