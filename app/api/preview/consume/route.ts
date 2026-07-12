import { type NextRequest } from "next/server";
import { updateOrder } from "@/lib/orders";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return Response.json({ error: "Missing orderId" }, { status: 400 });
    }

    const order = updateOrder(orderId, { hasListenedToPreview: true });

    if (!order) {
      return Response.json({ error: "Order not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error consuming preview:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
