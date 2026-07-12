"use client";

import { useState, useRef } from "react";

interface PreviewPlayerProps {
  orderId: string;
  audioUrl: string;
}

export default function PreviewPlayer({ orderId, audioUrl }: PreviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isConsumed, setIsConsumed] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlay = async () => {
    if (isConsumed) return;

    if (!isPlaying) {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
      
      // Marquer comme consommé dans la BDD
      try {
        await fetch("/api/preview/consume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
      } catch (err) {
        console.error("Error consuming preview", err);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsConsumed(true); // Ne plus autoriser le replay
  };

  if (isConsumed) {
    return (
      <div className="space-y-4">
        <span className="text-4xl block">✨</span>
        <h2 className="text-xl font-bold text-foreground">Aperçu terminé</h2>
        <p className="text-muted text-sm">Cet aperçu vous a plu ? Validez votre commande pour obtenir la chanson complète en haute qualité, avec les paroles imprimables.</p>
        <a href={`/checkout?orderId=${orderId}`} className="mt-6 inline-block w-full bg-primary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-primary-dark transition-all hover:scale-[1.02]">
          Finaliser ma commande
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center gap-6">
        <button
          onClick={handlePlay}
          className="w-24 h-24 rounded-full bg-foreground text-surface flex items-center justify-center hover:scale-105 transition-transform shadow-2xl"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          )}
        </button>
        <p className="text-sm font-semibold text-muted">
          {isPlaying ? "Lecture en cours..." : "Cliquez pour écouter"}
        </p>
      </div>

      <audio 
        ref={audioRef} 
        src={audioUrl} 
        onEnded={handleEnded} 
        className="hidden"
      />
    </div>
  );
}
