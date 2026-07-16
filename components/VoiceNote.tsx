"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { mulberry32, rand } from "@/lib/random";
import { experienceContent } from "@/lib/content";

interface VoiceNoteProps {
  reduced?: boolean;
  /** fires true when the note starts, false when it stops/ends */
  onActiveChange?: (active: boolean) => void;
}

const BARS = 26;

function fmt(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VoiceNote({ reduced = false, onActiveChange }: VoiceNoteProps) {
  const { label, src, duration: fallbackDuration } = experienceContent.voice;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState<number>(fallbackDuration);
  const [unavailable, setUnavailable] = useState(false);

  const bars = useMemo(() => {
    const rng = mulberry32(321);
    return Array.from({ length: BARS }, (_, i) => {
      const env = Math.sin((i / (BARS - 1)) * Math.PI);
      return 0.22 + env * rand(rng, 0.35, 0.95);
    });
  }, []);

  const progress = dur ? Math.min(1, t / dur) : 0;

  // follow real playback time
  useEffect(() => {
    if (!playing) return;
    const loop = () => {
      const audio = audioRef.current;
      if (audio) setT(audio.currentTime);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      onActiveChange?.(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
        onActiveChange?.(true);
      } catch {
        setUnavailable(true);
      }
    }
  };

  return (
    <div
      className="flex items-center gap-3 rounded-full border p-2.5 pr-4"
      style={{
        background: "linear-gradient(180deg,rgba(250,246,237,0.98),rgba(242,234,217,0.94))",
        borderColor: "rgba(196,184,164,0.7)",
        borderBottom: "3px solid rgba(180,165,138,0.85)",
        boxShadow: "0 12px 26px rgba(88,69,35,0.12), inset 0 1px 0 rgba(255,255,255,0.7)",
      }}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const d = (e.currentTarget as HTMLAudioElement).duration;
          if (isFinite(d) && d > 0) setDur(d);
        }}
        onEnded={() => {
          setPlaying(false);
          setT(0);
          onActiveChange?.(false);
        }}
        onError={() => setUnavailable(true)}
      />

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause voice note" : "Play voice note"}
        className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-cream-50 transition-transform active:translate-y-[2px]"
        style={{ background: playing ? "#163D22" : "#1E4D2B", boxShadow: "0 9px 18px rgba(14,46,24,0.24)" }}
      >
        {playing ? (
          <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor">
            <rect x={3} y={2} width={4} height={12} rx={1} />
            <rect x={9} y={2} width={4} height={12} rx={1} />
          </svg>
        ) : (
          <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2.5 L13 8 L4 13.5 Z" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className="font-serif text-lg font-semibold leading-none text-forest-600">{label}</p>
        <p className="mt-0.5 font-serif text-sm italic text-sage-500">
          {unavailable ? "add note.mp3 to /public/voice" : playing ? "listening…" : "tap to listen"}
        </p>
      </div>

      {/* waveform */}
      <div className="hidden h-7 items-center gap-[3px] sm:flex">
        {bars.map((h, i) => {
          const active = i / BARS <= progress || (playing && i < 8);
          return (
            <motion.span
              key={i}
              className="w-[3px] rounded-full"
              style={{ background: active ? "rgba(30,77,43,0.85)" : "rgba(90,138,100,0.3)" }}
              animate={{ height: `${(playing && active && !reduced ? h * (0.85 + 0.3 * Math.sin(i + t * 6)) : h) * 100}%` }}
              transition={{ duration: 0.15 }}
            />
          );
        })}
      </div>

      <span className="font-body text-sm font-bold tabular-nums text-forest-500/70">
        {fmt(dur - t)}
      </span>
    </div>
  );
}
