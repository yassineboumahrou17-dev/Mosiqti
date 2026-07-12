"use client";

import { Section, SectionHeader } from "@/components/ui/Section";
import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface AudioTrack {
  id: string;
  title: string;
  style: string;
  src: string;
  description: string;
  startTime: number;
  endTime: number;
}

export function AudioExamples() {
  const t = useTranslations('AudioExamples');

  const examples = [
    {
      id: "kamal_lina",
      title: "Kamal w Lina",
      style: t('t1Style'),
      src: "/audio-previews/kamal_w_lina.mp3",
      description: t('t1Desc'),
      startTime: 6.3,
      endTime: 36.3,
    },
    {
      id: "lotar",
      title: "Lotar Nostalgie",
      style: t('t2Style'),
      src: "/audio-previews/lotar_nostalgie.mp3",
      description: t('t2Desc'),
      startTime: 30,
      endTime: 60,
    },
    {
      id: "ya_omi",
      title: "Ya Omi Shireen",
      style: t('t3Style'),
      src: "/audio-previews/ya_omi_shireen.mp3",
      description: t('t3Desc'),
      startTime: 30,
      endTime: 60,
    },
    {
      id: "aix",
      title: "Aix Memory",
      style: t('t4Style'),
      src: "/audio-previews/aix_memory.mp3",
      description: t('t4Desc'),
      startTime: 30,
      endTime: 60,
    },
    {
      id: "mma_dyali",
      title: "Mma Dyali",
      style: t('t5Style'),
      src: "/audio-previews/mma_dyali.mp3",
      description: t('t5Desc'),
      startTime: 30,
      endTime: 60,
    },
    {
      id: "tmara",
      title: "Tmara d Lḥenna",
      style: t('t6Style'),
      src: "/audio-previews/tmara_d_lhenna.mp3",
      description: t('t6Desc'),
      startTime: 30,
      endTime: 60,
    },
  ];

  return (
    <Section background="default" id="examples">
      <SectionHeader 
        title={t('sectionTitle')} 
        subtitle={t('sectionSubtitle')}
      />

      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {examples.map((track) => (
          <AudioCard key={track.id} track={track} />
        ))}
      </div>
    </Section>
  );
}

function AudioCard({ track }: { track: AudioTrack }) {
  const t = useTranslations('AudioExamples');

  return (
    <div className="flex flex-col rounded-2xl bg-surface p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
      <div className="mb-4">
        <span className="inline-block rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary mb-2">
          {track.style}
        </span>
        <h3 className="text-lg font-bold text-foreground">{track.title}</h3>
        <p className="mt-2 text-sm text-subtle">{track.description}</p>
      </div>
      
      <div className="mt-auto pt-4 border-t border-border/50">
        <CustomAudioPlayer 
          src={track.src} 
          startTime={track.startTime} 
          endTime={track.endTime} 
        />
      </div>
    </div>
  );
}

function CustomAudioPlayer({ src, startTime, endTime }: { src: string, startTime: number, endTime: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [currentTime, setCurrentTime] = useState(0); 
  const duration = endTime - startTime;
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      let relativeTime = audio.currentTime - startTime;
      if (relativeTime < 0) relativeTime = 0;
      
      if (audio.currentTime >= endTime) {
        audio.pause();
        audio.currentTime = startTime;
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      } else {
        setCurrentTime(relativeTime);
        setProgress((relativeTime / duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      if (audio) audio.currentTime = startTime;
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [startTime, endTime, duration]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio.currentTime < startTime || audio.currentTime >= endTime) {
        audio.currentTime = startTime;
      }
      audio.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newProgress = parseFloat(e.target.value);
    const newRelativeTime = (newProgress / 100) * duration;
    
    audio.currentTime = startTime + newRelativeTime;
    setProgress(newProgress);
    setCurrentTime(newRelativeTime);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 w-full bg-gray-500 text-white rounded-md p-2 px-3">
      <audio ref={audioRef} src={`${src}#t=${startTime},${endTime}`} preload="none" />
      
      <button 
        onClick={togglePlay}
        className="flex-shrink-0 flex items-center justify-center focus:outline-none"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
            <path d="M5 3l14 9-14 9V3z" />
          </svg>
        )}
      </button>

      <span className="text-[11px] font-medium w-9 text-right tabular-nums">
        {formatTime(currentTime)}
      </span>

      <div className="text-[10px] opacity-60">|</div>

      <input 
        type="range" 
        min="0" 
        max="100" 
        step="0.1"
        value={progress}
        onChange={handleSeek}
        className="flex-grow h-1.5 rounded-full appearance-none cursor-pointer bg-white/30 accent-white"
        style={{
          background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
        }}
      />

      <span className="text-[11px] font-medium w-9 text-left tabular-nums">
        {formatTime(duration)}
      </span>
      
      <button className="flex-shrink-0 focus:outline-none ml-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 5l7 7-7 7" />
          <path d="M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
