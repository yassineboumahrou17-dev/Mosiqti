"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export function MobileFloatingCTA() {
  const t = useTranslations('Header');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past the hero section
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`md:hidden fixed bottom-4 start-4 end-4 z-50 transition-all duration-300 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <Button
        href="/creer-ma-chanson"
        className="w-full justify-center shadow-2xl shadow-primary/40 border border-white/20 !py-4 text-base"
        icon={<span className="text-lg">🎵</span>}
      >
        {t('createSong')}
      </Button>
    </div>
  );
}
