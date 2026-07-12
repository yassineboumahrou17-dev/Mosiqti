import { PRICE_STANDARD, PRICE_EXPRESS, type QuizAnswers } from "@/data/quizData";
import { appendOrderToSheet, getOrderFromSheet, markOrderAsPaidInSheet } from "./googleSheets";

export interface Order {
  id: string;
  answers: QuizAnswers;
  status: "pending" | "paid";
  amount: number;
  createdAt: string;
  previewStatus?: "none" | "generating" | "ready" | "failed";
  previewAudioUrl?: string;
  hasListenedToPreview?: boolean;
  paymentMethod?: "upay" | "bankTransfer" | "cashplus" | string;
}

export async function createOrder(answers: QuizAnswers): Promise<Order> {
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const amount = answers.selectedOffer === "express" ? PRICE_EXPRESS : PRICE_STANDARD;

  const newOrder: Order = {
    id: orderId,
    answers,
    status: "pending",
    amount,
    createdAt: new Date().toISOString(),
    previewStatus: "none",
    hasListenedToPreview: false,
  };

  // Send to Google Sheets and await it so the serverless function doesn't kill it
  await appendOrderToSheet(newOrder).catch(console.error);
  
  return newOrder;
}

export async function getOrderById(id: string): Promise<Order | undefined> {
  return await getOrderFromSheet(id);
}

export async function updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
  // Not fully supported in Google Sheets DB approach yet.
  console.warn("updateOrder is not fully implemented for Google Sheets");
  return undefined;
}

export async function markOrderAsPaid(id: string): Promise<Order | undefined> {
  const success = await markOrderAsPaidInSheet(id);
  if (success) {
    return await getOrderFromSheet(id);
  }
  return undefined;
}

export async function updateOrderPaymentMethod(id: string, method: string): Promise<Order | undefined> {
  const { updateOrderPaymentMethodInSheet } = await import("./googleSheets");
  const success = await updateOrderPaymentMethodInSheet(id, method);
  if (success) {
    return await getOrderFromSheet(id);
  }
  return undefined;
}
