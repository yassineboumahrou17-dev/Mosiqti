import { type NextRequest } from "next/server";
import { getOrderFromSheet } from "@/lib/googleSheets";

export async function GET(request: NextRequest) {
  try {
    const order = await getOrderFromSheet("ord_1783868900857_64qz4");
    
    // Also try to read process.env to see if keys look healthy
    const email = process.env.GOOGLE_CLIENT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY;
    const keyPrefix = key ? key.substring(0, 35) : "MISSING";
    const keyIncludesSlashN = key ? key.includes("\\n") : false;
    const keyIncludesRealNewline = key ? key.includes("\n") : false;

    return Response.json({
      success: true,
      foundOrder: !!order,
      orderId: order?.id || "Not found",
      envHealth: {
        email: email ? email.substring(0, 10) + "..." : "MISSING",
        keyPrefix,
        keyIncludesSlashN,
        keyIncludesRealNewline,
        keyLength: key ? key.length : 0,
      }
    });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message });
  }
}
