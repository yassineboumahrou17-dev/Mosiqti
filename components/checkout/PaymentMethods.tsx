"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";

interface PaymentMethodsProps {
  orderId: string;
  amount: number;
}

export function PaymentMethods({ orderId, amount }: PaymentMethodsProps) {
  const t = useTranslations('Checkout.payment');
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<"bankTransfer" | "upay" | "cashplus">("upay");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    
    try {
      const res = await fetch(`/api/orders/${orderId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentMethod: selectedMethod }),
      });

      if (!res.ok) {
        throw new Error("Erreur lors du traitement du paiement.");
      }

      const data = await res.json();

      if (selectedMethod === "upay") {
        if (data.url) {
          router.push(data.url);
        } else {
          router.push(`/success?orderId=${orderId}`);
        }
      } else {
        router.push(`/success?orderId=${orderId}`);
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur s'est produite lors de l'initialisation du paiement.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <h3 className="text-sm font-bold text-foreground mb-3">{t('title')}</h3>
      
      {/* Options de paiement */}
      <div className="grid gap-3 sm:grid-cols-1">
        <label className={`relative flex cursor-pointer rounded-xl border-2 p-4 shadow-sm focus:outline-none ${selectedMethod === 'upay' ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="upay"
            className="sr-only"
            checked={selectedMethod === 'upay'}
            onChange={() => setSelectedMethod('upay')}
          />
          <span className="flex flex-1">
            <span className="flex flex-col">
              <span className="block text-sm font-bold text-foreground flex items-center gap-2">
                💳 {t('methods.upay')}
              </span>
            </span>
          </span>
          <span className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedMethod === 'upay' ? 'border-primary bg-primary' : 'border-muted'}`}>
            {selectedMethod === 'upay' && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
          </span>
        </label>

        <label className={`relative flex cursor-pointer rounded-xl border-2 p-4 shadow-sm focus:outline-none ${selectedMethod === 'bankTransfer' ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="bankTransfer"
            className="sr-only"
            checked={selectedMethod === 'bankTransfer'}
            onChange={() => setSelectedMethod('bankTransfer')}
          />
          <span className="flex flex-1">
            <span className="flex flex-col">
              <span className="block text-sm font-bold text-foreground flex items-center gap-2">
                🏦 {t('methods.bankTransfer')}
              </span>
            </span>
          </span>
          <span className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedMethod === 'bankTransfer' ? 'border-primary bg-primary' : 'border-muted'}`}>
            {selectedMethod === 'bankTransfer' && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
          </span>
        </label>

        <label className={`relative flex cursor-pointer rounded-xl border-2 p-4 shadow-sm focus:outline-none ${selectedMethod === 'cashplus' ? 'border-primary bg-primary/5' : 'border-border bg-surface'}`}>
          <input
            type="radio"
            name="paymentMethod"
            value="cashplus"
            className="sr-only"
            checked={selectedMethod === 'cashplus'}
            onChange={() => setSelectedMethod('cashplus')}
          />
          <span className="flex flex-1">
            <span className="flex flex-col">
              <span className="block text-sm font-bold text-foreground flex items-center gap-2">
                💸 {t('methods.cashplus')}
              </span>
            </span>
          </span>
          <span className={`h-5 w-5 rounded-full border flex items-center justify-center ${selectedMethod === 'cashplus' ? 'border-primary bg-primary' : 'border-muted'}`}>
            {selectedMethod === 'cashplus' && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
          </span>
        </label>
      </div>

      {/* Détails de la méthode sélectionnée */}
      <div className="mt-6 rounded-xl border border-border bg-surface p-4 text-sm text-start">
        {selectedMethod === 'bankTransfer' && (
          <div className="space-y-3">
            <p className="font-medium text-foreground">{t('bankTransfer.desc')}</p>
            <div className="bg-background rounded-lg p-3 font-mono text-xs space-y-1 border border-border-light">
              <p>{t('bankTransfer.bank')}</p>
              <p>{t('bankTransfer.rib')}</p>
              <p>{t('bankTransfer.owner')}</p>
            </div>
            <p className="text-xs text-accent-yellow bg-accent-yellow/10 p-2 rounded-lg font-medium">
              ⚠️ {t('bankTransfer.instructions', { orderId })}
            </p>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="mt-4 w-full rounded-full bg-foreground text-white py-3 font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isProcessing ? "..." : t('bankTransfer.confirmBtn')}
            </button>
          </div>
        )}

        {selectedMethod === 'upay' && (
          <div className="space-y-4">
            <p className="font-medium text-foreground">{t('upay.desc')}</p>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 rounded-full bg-[#0052FF] text-white py-3.5 font-bold transition-all hover:bg-[#0040CC] hover:scale-[1.02] disabled:opacity-50"
            >
              <span>💳</span> {isProcessing ? "..." : t('upay.btn')} · {amount.toFixed(2)} dhs
            </button>
          </div>
        )}

        {selectedMethod === 'cashplus' && (
          <div className="space-y-3">
            <p className="font-medium text-foreground">{t('cashplus.desc')}</p>
            <div className="bg-background rounded-lg p-3 font-mono text-sm border border-border-light font-bold text-center">
              {t('cashplus.code')}
            </div>
            <p className="text-xs text-accent-yellow bg-accent-yellow/10 p-2 rounded-lg font-medium">
              ⚠️ {t('cashplus.instructions', { orderId })}
            </p>
            <button
              onClick={handleConfirm}
              disabled={isProcessing}
              className="mt-4 w-full rounded-full bg-foreground text-white py-3 font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {isProcessing ? "..." : t('cashplus.confirmBtn')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
