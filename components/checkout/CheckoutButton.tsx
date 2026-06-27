"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

interface CheckoutButtonProps {
  orderId: string;
  amount: number;
  promoCode?: string | null;
}

export function CheckoutButton({ orderId, amount, promoCode }: CheckoutButtonProps) {
  const t = useTranslations('Checkout');

  const handleCheckout = () => {
    const phoneNumber = "NUMERO_WHATSAPP"; // Replace later
    let message = t('whatsappMsg', { orderId, amount: amount.toFixed(2) });
    if (promoCode) {
      message += `\nCode promo appliqué : ${promoCode}`;
    }
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // Open in a new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="w-full">
      <button
        onClick={handleCheckout}
        className="w-full flex items-center justify-center gap-3 rounded-full bg-[#25D366] text-white py-4 px-8 text-base font-bold shadow-lg shadow-[#25D366]/30 transition-all duration-200 hover:shadow-xl hover:shadow-[#25D366]/40 hover:scale-[1.01] cursor-pointer"
      >
        <span className="text-xl">💬</span>
        <span>{t('whatsappBtn')} · {amount.toFixed(2)} dhs</span>
      </button>

      <div className="mt-5 flex flex-col items-center gap-2.5 select-none">
        <p className="text-center text-xs font-semibold text-muted/90 flex items-center justify-center gap-1.5 bg-surface px-4 py-1.5 rounded-full border border-border">
          <span>🤝</span>
          <span>{t('whatsappGuarantee')}</span>
        </p>
        <p className="text-center text-[11px] font-medium text-accent-yellow/80 bg-accent-yellow/10 px-3 py-1 rounded-full border border-accent-yellow/20 flex items-center gap-1.5">
          <span>✏️</span>
          <span>{t('whatsappEdit')}</span>
        </p>
      </div>
    </div>
  );
}
