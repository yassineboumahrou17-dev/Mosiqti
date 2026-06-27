"use client";

import { Section, SectionHeader } from "@/components/ui/Section";
import { useRef } from "react";
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const t = useTranslations('AudioExamples');

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      if (audioRef.current.currentTime > track.endTime) {
        audioRef.current.pause();
        audioRef.current.currentTime = track.startTime;
      }
    }
  };

  const handlePlay = () => {
    if (audioRef.current && audioRef.current.currentTime < track.startTime) {
      audioRef.current.currentTime = track.startTime;
    }
  };

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
        <audio 
          ref={audioRef}
          controls 
          preload="none"
          controlsList="nodownload"
          onContextMenu={(e) => e.preventDefault()}
          className="w-full h-10 outline-none"
          src={`${track.src}#t=${track.startTime},${track.endTime}`}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
        >
          {t('notSupported')}
        </audio>
      </div>
    </div>
  );
}
