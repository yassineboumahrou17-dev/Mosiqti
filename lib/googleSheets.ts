import { google } from "googleapis";
import { unstable_noStore as noStore } from "next/cache";
import { type Order } from "./orders";

function getSheetsClient() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const cleanedKey = rawKey ? rawKey.replace(/^"|"$/g, '') : undefined;
  const privateKey = cleanedKey?.replace(/\\n/g, "\n");
  const sheetId = process.env.GOOGLE_SHEET_ID || "10rRkZZM50hGb_u9pixFtyYVSbKYdnbGSoff4aegJpQU";

  if (!clientEmail || !privateKey || !sheetId) {
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return { sheets: google.sheets({ version: "v4", auth }), sheetId };
}

export async function appendOrderToSheet(order: Order) {
  noStore();
  try {
    const client = getSheetsClient();
    if (!client) {
      console.warn("Google Sheets credentials are not fully configured.");
      return false;
    }
    const { sheets, sheetId } = client;

    const rawPhone = `${order.answers.phoneCountryCode || ""} ${order.answers.phoneNumber || ""}`.trim();
    const phone = rawPhone ? `'${rawPhone}` : "";

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
      range: "A1",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [row] },
    });

    console.log("Successfully appended row to Google Sheets:", response.data.updates?.updatedRange);
    return true;
  } catch (error) {
    console.error("Failed to append order to Google Sheets:", error);
    return false;
  }
}

export async function updateOrderPaymentMethodInSheet(orderId: string, paymentMethod: string): Promise<boolean> {
  noStore();
  try {
    const client = getSheetsClient();
    if (!client) return false;
    const { sheets, sheetId } = client;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A:A", // We only need to find the row index by ID
    });

    const rows = response.data.values;
    if (!rows) return false;

    const rowIndex = rows.findIndex(r => r[0] === orderId);
    if (rowIndex === -1) return false;

    // Update column P (index 15) with the payment method
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `P${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [[paymentMethod]] },
    });

    return true;
  } catch (error) {
    console.error("Failed to update payment method in Google Sheets:", error);
    return false;
  }
}

export async function getOrderFromSheet(orderId: string): Promise<Order | undefined> {
  noStore();
  try {
    const client = getSheetsClient();
    if (!client) return undefined;
    const { sheets, sheetId } = client;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A:P",
    });

    const rows = response.data.values;
    if (!rows) return undefined;

    const row = rows.find(r => r[0]?.trim() === orderId?.trim());
    if (!row) {
      console.error("[DEBUG] Order NOT found! orderId:", orderId);
      console.error("[DEBUG] Available IDs in sheet:", rows.map(r => r[0]));
      return undefined;
    }

    const genreField = row[7] || "";
    const genre = genreField.startsWith("Autre: ") ? "autre" : genreField;
    const customGenre = genreField.startsWith("Autre: ") ? genreField.replace("Autre: ", "") : "";

    return {
      id: row[0],
      createdAt: row[1],
      amount: Number(row[2]),
      status: row[3] as "pending" | "paid",
      answers: {
        selectedOffer: row[4] as "standard" | "express",
        recipientName: row[5],
        recipientType: row[6],
        genre,
        customGenre,
        voiceGender: row[8],
        songLanguage: row[9],
        beautifulQualities: row[10],
        specialMoments: row[11],
        specialMessage: row[12],
        email: row[13],
        phoneNumber: row[14] || "",
        phoneCountryCode: "",
      },
      paymentMethod: row[15] as any, // Column P
    };
  } catch (error) {
    console.error("Failed to get order from Google Sheets:", error);
    return undefined;
  }
}

export async function markOrderAsPaidInSheet(orderId: string): Promise<boolean> {
  noStore();
  try {
    const client = getSheetsClient();
    if (!client) return false;
    const { sheets, sheetId } = client;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A:D",
    });

    const rows = response.data.values;
    if (!rows) return false;

    const rowIndex = rows.findIndex(r => r[0] === orderId);
    if (rowIndex === -1) return false;

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `D${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [["paid"]] },
    });

    return true;
  } catch (error) {
    console.error("Failed to mark order as paid in Google Sheets:", error);
    return false;
  }
}

export async function getPendingOrdersForRelance(): Promise<Order[]> {
  noStore();
  try {
    const client = getSheetsClient();
    if (!client) return [];
    const { sheets, sheetId } = client;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A:Q", // include column Q for relanceSent
    });

    const rows = response.data.values;
    if (!rows) return [];

    const pendingOrders: Order[] = [];
    const now = new Date().getTime();

    for (let i = 1; i < rows.length; i++) { // Skip header if present, or just process all rows
      const row = rows[i];
      if (!row || !row[0]) continue;

      const status = row[3];
      const relanceSent = row[16]; // Column Q
      const createdAtStr = row[1];

      if (status === "pending" && relanceSent !== "oui") {
        const createdAt = new Date(createdAtStr).getTime();
        const diffHours = (now - createdAt) / (1000 * 60 * 60);

        // Relance if between 1 hour and 24 hours old
        if (diffHours >= 1 && diffHours <= 24) {
          const genreField = row[7] || "";
          const genre = genreField.startsWith("Autre: ") ? "autre" : genreField;
          const customGenre = genreField.startsWith("Autre: ") ? genreField.replace("Autre: ", "") : "";

          pendingOrders.push({
            id: row[0],
            createdAt: row[1],
            amount: Number(row[2]),
            status: "pending",
            answers: {
              selectedOffer: row[4] as any,
              recipientName: row[5],
              recipientType: row[6],
              genre,
              customGenre,
              voiceGender: row[8],
              songLanguage: row[9],
              beautifulQualities: row[10],
              specialMoments: row[11],
              specialMessage: row[12],
              email: row[13],
              phoneNumber: row[14] || "",
              phoneCountryCode: "",
            },
            paymentMethod: row[15] as any,
          });
        }
      }
    }

    return pendingOrders;
  } catch (error) {
    console.error("Failed to get pending orders for relance:", error);
    return [];
  }
}

export async function markOrderAsRelanceSent(orderId: string): Promise<boolean> {
  noStore();
  try {
    const client = getSheetsClient();
    if (!client) return false;
    const { sheets, sheetId } = client;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A:A",
    });

    const rows = response.data.values;
    if (!rows) return false;

    const rowIndex = rows.findIndex(r => r[0] === orderId);
    if (rowIndex === -1) return false;

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Q${rowIndex + 1}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [["oui"]] },
    });

    return true;
  } catch (error) {
    console.error("Failed to mark relance as sent in Google Sheets:", error);
    return false;
  }
}
