"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function TrackForm() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId && email) {
      router.push(`/track?orderId=${encodeURIComponent(orderId)}&email=${encodeURIComponent(email)}`);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#fff8f5] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="text-center">
          <h1 className="font-serif text-2xl font-bold text-[#2d2d2d] sm:text-3xl">
            Trouvez votre chanson
          </h1>
          <p className="mt-3 text-sm font-medium text-gray-500">
            Entrez les détails de votre commande pour suivre ou écouter votre chanson.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <input
              type="text"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Référence (ex: ord_...)"
              className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#ff7a45] focus:outline-none focus:ring-1 focus:ring-[#ff7a45]"
            />
          </div>
          <div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Adresse e-mail"
              className="w-full rounded-2xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:border-[#ff7a45] focus:outline-none focus:ring-1 focus:ring-[#ff7a45]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded-2xl bg-[#ff7a45] px-6 py-4 text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#ff7a45]/20"
          >
            Trouver ma chanson
          </button>
        </form>
      </div>
    </div>
  );
}
