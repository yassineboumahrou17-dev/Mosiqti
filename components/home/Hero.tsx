"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export function Hero() {
  const t = useTranslations('Hero');
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Sync isMuted with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch((err) => {
        console.error("Video playback failed:", err);
      });
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    setCurrentTime(current);
    if (duration > 0) {
      setProgress((current / duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressBarRef.current || duration === 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percentage * 100);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="pointer-events-none absolute -start-20 top-20 h-64 w-64 rounded-full bg-accent-pink/20 blur-3xl" />
      <div className="pointer-events-none absolute -end-20 top-40 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 start-1/3 h-48 w-48 rounded-full bg-accent-yellow/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6 md:px-10 md:pb-24 md:pt-14">
        <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full bg-surface px-4 py-2 sm:px-5 sm:py-2.5 shadow-md shadow-secondary/10">
          <span className="text-accent-yellow text-sm sm:text-base">★★★★★</span>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wide text-foreground text-center">
            {t('badge')}
          </span>
        </div>

        {/* Lecteur Vidéo Interactif */}
        <div className="mx-auto mb-10 max-w-2xl overflow-hidden rounded-3xl border-4 border-white bg-black shadow-2xl shadow-secondary/20 relative aspect-video">
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex cursor-pointer items-center justify-center group"
          >
            <video
              ref={videoRef}
              src="/0623.mp4"
              playsInline
              className="h-full w-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={handleEnded}
            />

            {/* Voile sombre et flou de pause */}
            {!isPlaying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all duration-300">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                  <span className="ms-1 text-2xl sm:text-3xl text-primary translate-x-[2px] rtl:-translate-x-[2px]">
                    ▶
                  </span>
                </div>
                <p className="mt-4 text-[10px] sm:text-xs font-bold text-white/90 tracking-wider uppercase drop-shadow-md select-none">
                  {t('clickToWatch')}
                </p>
              </div>
            )}

            {/* Barre de contrôle du bas */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-3 start-3 end-3 sm:bottom-4 sm:start-4 sm:end-4 flex items-center gap-2 sm:gap-3 rounded-2xl bg-black/60 px-3 py-2 sm:px-4 sm:py-3 backdrop-blur-md transition-all duration-300"
            >
              <button
                type="button"
                onClick={togglePlay}
                className="text-white hover:text-primary transition-colors text-base sm:text-lg"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>

              <span className="text-[10px] sm:text-xs text-white/90 select-none font-mono">
                {formatTime(currentTime)}
              </span>

              {/* Barre de progression cliquable */}
              <div 
                ref={progressBarRef}
                onClick={handleProgressClick}
                className="h-2 flex-1 rounded-full bg-white/30 cursor-pointer relative group/bar py-1"
              >
                <div className="absolute inset-y-1 start-0 rounded-full bg-primary" style={{ width: `${progress}%` }} />
                <div 
                  className="absolute h-3 w-3 rounded-full bg-white border border-primary -translate-y-0.5 shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity" 
                  style={{ insetInlineStart: `calc(${progress}% - 6px)`, top: "2px" }}
                />
              </div>

              <span className="text-[10px] sm:text-xs text-white/90 select-none font-mono">
                {formatTime(duration)}
              </span>

              <button
                type="button"
                onClick={toggleMute}
                className="text-white hover:text-primary transition-colors text-base sm:text-lg"
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl px-2">
            {t('title1')}
            <br />
            {t('title2')}
            <span className="font-script text-4xl sm:text-5xl text-accent-pink md:text-6xl lg:text-7xl animate-pulse inline-block">
              {t('titleHighlight')}
            </span>
            {t('title3')}
          </h1>

          <p className="mx-auto mt-6 max-w-lg text-sm sm:text-base font-medium leading-relaxed text-muted md:text-lg px-4">
            {t('description')}
          </p>

          <div className="mt-8 sm:mt-10 px-4">
            <Button
              href="/creer-ma-chanson"
              icon={<span className="text-lg animate-bounce inline-block">🎵</span>}
              className="w-full sm:w-auto !px-8 sm:!px-10 !py-4 sm:!py-5 text-sm sm:text-base justify-center"
            >
              {t('createSong')}
            </Button>
          </div>

          <p className="mt-5 text-[10px] sm:text-xs font-semibold text-subtle px-2">
            {t('guarantee')}
          </p>
        </div>
      </div>
    </section>
  );
}
