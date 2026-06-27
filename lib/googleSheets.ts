import { google } from "googleapis";
import { type Order } from "./orders";

export async function appendOrderToSheet(order: Order) {
  try {
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const sheetId = process.env.GOOGLE_SHEET_ID || "10rRkZZM50hGb_u9pixFtyYVSbKYdnbGSoff4aegJpQU";

    if (!clientEmail || !privateKey || !sheetId) {
      console.warn("Google Sheets credentials are not fully configured.");
      return false;
    }

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const phone = `${order.answers.phoneCountryCode || ""} ${order.answers.phoneNumber || ""}`.trim();

    const row = [
      order.id,
      order.createdAt,
      order.amount,
      order.status,
      order.answers.selectedOffer || "",
      order.answers.recipientName || "",
      order.answers.recipientType || "",
      order.answers.genre === "autre" ? `Autre: ${order.answers.customGenre}` : order.answers.genre || "",
      order.answers.voiceGender || "",
      order.answers.songLanguage || "",
      order.answers.beautifulQualities || "",
      order.answers.specialMoments || "",
      order.answers.specialMessage || "",
      order.answers.email || "",
      phone,
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "A1", // Append to the first available row starting from column A
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });

    console.log("Successfully appended row to Google Sheets:", response.data.updates?.updatedRange);
    return true;
  } catch (error) {
    console.error("Failed to append order to Google Sheets:", error);
    return false;
  }
}
