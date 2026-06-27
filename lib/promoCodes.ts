export type PromoType = "percentage" | "fixed";

export interface PromoCode {
  code: string;
  type: PromoType;
  value: number; // e.g., 30 for 30%, 50 for 50 dhs
}

// Dictionary of valid promo codes
// Keys should be uppercase for case-insensitive matching
export const PROMO_CODES: Record<string, PromoCode> = {
  "VIBEZ30": {
    code: "VIBEZ30",
    type: "percentage",
    value: 30,
  },
};

export function getPromoCode(code: string): PromoCode | null {
  if (!code) return null;
  const normalizedCode = code.trim().toUpperCase();
  return PROMO_CODES[normalizedCode] || null;
}

export function calculateDiscount(amount: number, promo: PromoCode | null): number {
  if (!promo) return 0;
  
  if (promo.type === "percentage") {
    return (amount * promo.value) / 100;
  }
  
  if (promo.type === "fixed") {
    return Math.min(amount, promo.value); // Cannot discount more than the total amount
  }
  
  return 0;
}
