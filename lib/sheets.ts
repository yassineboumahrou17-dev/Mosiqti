import { google } from "googleapis";
import type { Order } from "./orders";
import { getOptionLabel } from "./quiz";
import { getTranslations } from "next-intl/server";

const SPREADSHEET_ID = "10rRkZZM50hGb_u9pixFtyYVSbKYdnbGSoff4aegJpQU";

export async function appendOrderToSheet(order: Order) {
  const credentials = {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  if (!credentials.client_email || !credentials.private_key) {
    console.error("Missing Google Sheets credentials. Cannot append to sheets.");
    return false;
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const tQuiz = await getTranslations('Quiz');
    const { answers, amount, status, createdAt, id } = order;

    // Formatting data for the sheet
    const row = [
      id,
      new Date(createdAt).toLocaleString("fr-FR"),
      status,
      answers.selectedOffer === "express" ? "Express" : "Standard",
      amount,
      answers.email,
      `${answers.phoneCountryCode} ${answers.phoneNumber}`,
      getOptionLabel("recipientType", answers.recipientType, tQuiz),
      answers.recipientName,
      getOptionLabel("genre", answers.genre, tQuiz, answers),
      getOptionLabel("voiceGender", answers.voiceGender, tQuiz),
      getOptionLabel("songLanguage", answers.songLanguage, tQuiz),
      answers.beautifulQualities,
      answers.specialMoments,
      answers.specialMessage,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Feuille 1!A:Z", // Will append to the first empty row in this range
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    });

    console.log(`Order ${id} successfully appended to Google Sheets.`);
    return true;
  } catch (error) {
    console.error("Failed to append to Google Sheets:", error);
    return false;
  }
}
