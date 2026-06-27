import fs from "fs";
import path from "path";
import { PRICE_STANDARD, PRICE_EXPRESS, type QuizAnswers } from "@/data/quizData";
import { appendOrderToSheet } from "./googleSheets";

export interface Order {
  id: string;
  answers: QuizAnswers;
  status: "pending" | "paid";
  amount: number;
  createdAt: string;
}

const ORDERS_FILE_PATH = path.join(process.cwd(), "data", "orders.json");

// Helper to ensure the directory exists and read the file
function getOrders(): Record<string, Order> {
  try {
    const dirPath = path.dirname(ORDERS_FILE_PATH);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(ORDERS_FILE_PATH)) {
      fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify({}, null, 2), "utf-8");
      return {};
    }

    const data = fs.readFileSync(ORDERS_FILE_PATH, "utf-8");
    return JSON.parse(data || "{}");
  } catch (error) {
    console.error("Failed to read orders file:", error);
    return {};
  }
}

// Helper to write to file
function saveOrders(orders: Record<string, Order>): boolean {
  try {
    fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(orders, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.error("Failed to save orders file:", error);
    return false;
  }
}

export function createOrder(answers: QuizAnswers): Order {
  const orders = getOrders();
  const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const amount = answers.selectedOffer === "express" ? PRICE_EXPRESS : PRICE_STANDARD;

  const newOrder: Order = {
    id: orderId,
    answers,
    status: "pending",
    amount,
    createdAt: new Date().toISOString(),
  };

  orders[orderId] = newOrder;
  saveOrders(orders);
  return newOrder;
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders();
  return orders[id];
}

export function markOrderAsPaid(id: string): Order | undefined {
  const orders = getOrders();
  const order = orders[id];
  
  if (order) {
    if (order.status !== "paid") {
      order.status = "paid";
      orders[id] = order;
      saveOrders(orders);
      
      // Envoyer à Google Sheets uniquement une fois payé
      appendOrderToSheet(order).catch(console.error);
    }
    return order;
  }
  
  return undefined;
}
