"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CheckoutButton } from "./CheckoutButton";
import { getPromoCode, calculateDiscount, PromoCode } from "@/lib/promoCodes";

interface PaymentSummaryProps {
  orderId: string;
  baseAmount: number;
  selectedOffer: string | null;
}

export function PaymentSummary({ orderId, baseAmount, selectedOffer }: PaymentSummaryProps) {
  const t = useTranslations('Checkout');
  const [promoInput, setPromoInput] = useState("");
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleApplyPromo = () => {
    setErrorMsg("");
    setSuccessMsg("");
    
    if (!promoInput.trim()) return;

    const promo = getPromoCode(promoInput);
    if (promo) {
      setActivePromo(promo);
      setSuccessMsg(t('promoCode.success'));
      setPromoInput("");
    } else {
      setErrorMsg(t('promoCode.invalid'));
    }
  };

  const handleRemovePromo = () => {
    setActivePromo(null);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const discountAmount = calculateDiscount(baseAmount, activePromo);
  const totalAmount = baseAmount - discountAmount;

  return (
    <div className="rounded-2xl border-2 border-border bg-surface p-6 shadow-md sticky top-24">
      <h2 className="font-display text-xl font-bold text-foreground mb-4">
        {t('receipt.title')}
      </h2>
      
      <div className="space-y-3.5 border-b border-border pb-4 text-sm font-medium text-muted">
        <div className="flex justify-between gap-4 text-start">
          <span>{t('receipt.creation')} ({selectedOffer === "express" ? t('receipt.express') : t('receipt.standard')})</span>
          <span className="font-semibold text-foreground whitespace-nowrap">{baseAmount.toFixed(2)} dhs</span>
        </div>
        <div className="flex justify-between gap-4 text-xs text-accent-mint font-bold text-start">
          <span>{t('receipt.writing')}</span>
          <span>{t('receipt.included')}</span>
        </div>
        <div className="flex justify-between gap-4 text-xs text-accent-mint font-bold text-start">
          <span>{t('receipt.delivery')}</span>
          <span>{t('receipt.included')}</span>
        </div>
        
        {/* Ligne de réduction dynamique */}
        {activePromo && (
          <div className="flex justify-between gap-4 text-sm text-accent-yellow font-bold text-start">
            <span className="flex items-center gap-1">
              {t('promoCode.discount')} ({activePromo.code})
              <button 
                onClick={handleRemovePromo}
                className="text-[10px] text-muted hover:text-red-500 font-normal ms-1 px-1.5 py-0.5 rounded bg-background border border-border"
              >
                {t('promoCode.remove')}
              </button>
            </span>
            <span className="whitespace-nowrap">- {discountAmount.toFixed(2)} dhs</span>
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between pt-4 gap-4">
        <span className="text-base font-bold text-foreground">{t('receipt.total')}</span>
        <span className="text-3xl font-display font-bold text-primary whitespace-nowrap">
          {totalAmount.toFixed(2)} dhs
        </span>
      </div>

      {/* Code Promo Input */}
      {!activePromo && (
        <div className="mt-5 space-y-2">
          <label className="text-xs font-semibold text-foreground">{t('promoCode.label')}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
              placeholder={t('promoCode.placeholder')}
              className="flex-1 rounded-xl border border-border-light bg-background px-4 py-2.5 text-sm font-bold text-foreground focus:border-foreground focus:outline-none"
            />
            <button
              onClick={handleApplyPromo}
              className="rounded-xl border border-transparent bg-muted px-4 py-2.5 text-sm font-bold text-surface transition-colors hover:bg-foreground"
            >
              {t('promoCode.apply')}
            </button>
          </div>
          {errorMsg && <p className="text-xs text-red-500 font-medium">{errorMsg}</p>}
          {successMsg && <p className="text-xs text-accent-mint font-bold">{successMsg}</p>}
        </div>
      )}

      {/* Bouton de paiement Stripe / WhatsApp */}
      <div className="mt-6">
        <CheckoutButton 
          orderId={orderId} 
          amount={totalAmount} 
          promoCode={activePromo?.code} 
        />
      </div>

      {/* Garanties et réassurance */}
      <div className="mt-8 space-y-4 border-t border-border pt-6 text-xs text-muted text-start">
        <div className="flex gap-3">
          <span className="text-base">📅</span>
          <div>
            <p className="font-bold text-foreground">
              {selectedOffer === "express" ? t('guarantees.expressDelivery') : t('guarantees.standardDelivery')}
            </p>
            <p className="font-medium mt-0.5">{t('guarantees.deliveryDesc')}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <span className="text-base">⭐</span>
          <div>
            <p className="font-bold text-foreground">{t('guarantees.emotionTitle')}</p>
            <p className="font-medium mt-0.5">{t('guarantees.emotionDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
