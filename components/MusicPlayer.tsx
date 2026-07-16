"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { experienceContent } from "@/lib/content";

interface MusicPlayerProps {
  reduced?: boolean;
  autoStart?: boolean;
  muted?: boolean;
  /** externally pause the music (e.g. while the voice note plays) */
  paused?: boolean;
}

const BARS = 26;

function fmt(sec: number) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MusicPlayer({ reduced = false, autoStart = false, muted = false, paused = false }: MusicPlayerProps) {
  const playlist = experienceContent.playlist;
  const [track, setTrack] = useState(0);
  const current = playlist[track];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const duckRafRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [levels, setLevels] = useState<number[]>(() => Array(BARS).fill(0.2));
  const [unavailable, setUnavailable] = useState(false);

  const setupAnalyser = () => {
    const audio = audioRef.current;
    if (!audio || ctxRef.current) return;
    try {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new Ctor();
      const srcNode = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      srcNode.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
    } catch {
      /* analyser optional */
    }
  };

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    setupAnalyser();
    ctxRef.current?.resume?.();
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setUnavailable(true);
    }
  };
  const pause = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };
  const toggle = () => (playing ? pause() : play());

  const go = (dir: 1 | -1) => {
    setUnavailable(false);
    setProgress(0);
    setCur(0);
    setTrack((t) => (t + dir + playlist.length) % playlist.length);
  };

  // when the track changes, load it and keep playing if we were
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (playing && !muted) {
      audio.play().then(() => setPlaying(true)).catch(() => setUnavailable(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track]);

  // autostart (best-effort — gesture already happened earlier in the flow)
  useEffect(() => {
    if (autoStart && !muted) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  // respond to mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (muted) audio.pause();
    audio.muted = muted;
    if (muted) setPlaying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muted]);

  // duck the music down (not off) while the voice note plays, then bring it
  // smoothly back up — a soft volume fade so we can still hear it underneath.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const target = paused ? 0.14 : 1;
    if (duckRafRef.current) cancelAnimationFrame(duckRafRef.current);
    const start = audio.volume;
    const t0 = performance.now();
    const dur = 450;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      audio.volume = Math.min(1, Math.max(0, start + (target - start) * p));
      if (p < 1) duckRafRef.current = requestAnimationFrame(step);
    };
    duckRafRef.current = requestAnimationFrame(step);
    return () => {
      if (duckRafRef.current) cancelAnimationFrame(duckRafRef.current);
    };
  }, [paused]);

  // progress + waveform loop
  useEffect(() => {
    const tick = () => {
      const audio = audioRef.current;
      if (audio && audio.duration) {
        setCur(audio.currentTime);
        setDur(audio.duration);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
      const analyser = analyserRef.current;
      if (analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const bins = Math.floor(data.length / BARS) || 1;
        const next: number[] = [];
        for (let i = 0; i < BARS; i++) {
          let sum = 0;
          for (let j = 0; j < bins; j++) sum += data[i * bins + j];
          next.push(Math.max(0.14, sum / bins / 255));
        }
        setLevels(next);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    if (playing && !reduced) rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, reduced]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="pointer-events-auto flex w-[320px] max-w-[86vw] items-center gap-3 rounded-2xl border p-3"
      style={{
        background: "linear-gradient(180deg,rgba(248,244,236,0.72),rgba(242,234,217,0.55))",
        borderColor: "rgba(242,234,217,0.7)",
        borderBottom: "4px solid rgba(29,61,84,0.22)",
        boxShadow: "0 16px 40px rgba(14,46,24,0.2), inset 0 1px 0 rgba(255,255,255,0.6)",
        WebkitBackdropFilter: "blur(16px)",
        backdropFilter: "blur(16px)",
      }}
      role="group"
      aria-label="Music player"
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={current.src}
        preload="metadata"
        onError={() => setUnavailable(true)}
        onEnded={() => go(1)}
      />

      {/* album art */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
        <motion.div
          className="absolute inset-0"
          style={{ background: "conic-gradient(from 0deg,#1E4D2B,#5A8A64,#e3c583,#c05a6d,#1E4D2B)" }}
          animate={reduced || !playing ? undefined : { rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-cream-50">
          <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor"><path d="M9 17V5l10-2v12" fill="none" stroke="currentColor" strokeWidth="1.6"/><circle cx="7" cy="17" r="2.4"/><circle cx="17" cy="15" r="2.4"/></svg>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate font-serif text-sm font-semibold text-forest-600">{current.title}</p>
        <p className="truncate font-body text-xs text-sage-500">
          {unavailable ? `add ${current.src.split("/").pop()} to /public/music` : current.artist}
        </p>

        <div className="mt-1.5 flex h-6 items-end gap-[2px]">
          {levels.map((l, i) => (
            <motion.span
              key={i}
              className="flex-1 rounded-full"
              style={{ minWidth: 2, background: "linear-gradient(to top,#1E4D2B,#e3c583)" }}
              animate={{ height: `${Math.max(12, l * 100)}%` }}
              transition={{ duration: 0.12, ease: "easeOut" }}
            />
          ))}
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <div className="h-1.5 flex-1 cursor-pointer overflow-hidden rounded-full bg-forest-500/15" onClick={seek}>
            <div className="h-full rounded-full bg-gradient-to-r from-forest-500 to-gold-400" style={{ width: `${progress}%` }} />
          </div>
          <span className="font-body text-[10px] tabular-nums text-forest-500/60">{fmt(cur)}/{fmt(dur)}</span>
        </div>
      </div>

      {/* transport: prev / play / next */}
      <div className="flex shrink-0 flex-col items-center gap-1">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          className="flex h-11 w-11 items-center justify-center rounded-full text-cream-50 transition-transform active:translate-y-[2px]"
          style={{ background: playing ? "#163D22" : "#1E4D2B", boxShadow: "0 9px 18px rgba(14,46,24,0.24)" }}
        >
          {playing ? (
            <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor"><rect x={3} y={2} width={4} height={12} rx={1} /><rect x={9} y={2} width={4} height={12} rx={1} /></svg>
          ) : (
            <svg width={16} height={16} viewBox="0 0 16 16" fill="currentColor"><path d="M4 2.5 L13 8 L4 13.5 Z" /></svg>
          )}
        </button>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous track"
            className="flex h-6 w-6 items-center justify-center rounded-full text-forest-600 transition hover:bg-forest-500/10"
          >
            <svg width={13} height={13} viewBox="0 0 16 16" fill="currentColor"><path d="M12 3 L5 8 L12 13 Z" /><rect x={3} y={3} width={2} height={10} rx={1} /></svg>
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next track"
            className="flex h-6 w-6 items-center justify-center rounded-full text-forest-600 transition hover:bg-forest-500/10"
          >
            <svg width={13} height={13} viewBox="0 0 16 16" fill="currentColor"><path d="M4 3 L11 8 L4 13 Z" /><rect x={11} y={3} width={2} height={10} rx={1} /></svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
