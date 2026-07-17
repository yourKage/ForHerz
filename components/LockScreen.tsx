"use client";

import { motion, useAnimationControls } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { mulberry32, rand } from "@/lib/random";
import { experienceContent } from "@/lib/content";
import BotanicalWallpaper from "./BotanicalWallpaper";

interface LockScreenProps {
  reduced?: boolean;
  onUnlock: () => void;
  onInteract?: () => void;
}

const INK = "#2f5d3f";

// Build a torn-paper rectangle path (straight sides, jagged top & bottom).
function tornPaperPath(seed: number, w: number, h: number) {
  const rng = mulberry32(seed);
  const steps = 26;
  const jag = 3.2;
  const pts: string[] = [];
  // top edge L→R
  pts.push(`M0 ${rand(rng, 0, jag)}`);
  for (let i = 1; i <= steps; i++) {
    const x = (i / steps) * w;
    const y = rand(rng, 0, jag);
    pts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  pts.push(`L${w} ${h - jag}`);
  // bottom edge R→L
  for (let i = 1; i <= steps; i++) {
    const x = w - (i / steps) * w;
    const y = h - rand(rng, 0, jag);
    pts.push(`L${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  pts.push("Z");
  return pts.join(" ");
}

export default function LockScreen({ reduced = false, onUnlock, onInteract }: LockScreenProps) {
  const { lockCode, lockWelcome, lockHint, lockError } = experienceContent;
  const codeLen = lockCode.length;
  const [entry, setEntry] = useState("");
  const [error, setError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const controls = useAnimationControls();

  const W = 300;
  const H = 560;
  const path = useMemo(() => tornPaperPath(42, W, H), []);

  // shrink the card uniformly on short phone screens so nothing is cut off
  const [vh, setVh] = useState(800);
  useEffect(() => {
    const on = () => setVh(window.innerHeight);
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  const fit = Math.min(1, (vh - 32) / 660);

  const press = useCallback(
    (digit: string) => {
      if (unlocked || entry.length >= codeLen) return;
      onInteract?.();
      const next = entry + digit;
      setError(false);
      setEntry(next);
      if (next.length === codeLen) {
        if (next === lockCode) {
          setUnlocked(true);
          setTimeout(onUnlock, 900);
        } else {
          setTimeout(() => {
            setError(true);
            if (!reduced) {
              controls.start({
                x: [0, -12, 12, -10, 10, -6, 6, 0],
                transition: { duration: 0.5 },
              });
            }
            setEntry("");
          }, 180);
        }
      }
    },
    [entry, unlocked, lockCode, codeLen, onUnlock, controls, reduced, onInteract],
  );

  const del = useCallback(() => {
    setError(false);
    setEntry((e) => e.slice(0, -1));
  }, []);

  const pad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"];

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
    >
      <BotanicalWallpaper faded />

      <div style={{ transform: `scale(${fit})`, transformOrigin: "center" }}>
      <motion.div
        className="relative"
        style={{ width: W, maxWidth: "88vw" }}
        animate={controls}
      >
        {/* torn paper card */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full drop-shadow-[0_20px_45px_rgba(90,64,51,0.25)]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="lockpaper" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f2e7d0" />
              <stop offset="100%" stopColor="#e7d9ba" />
            </linearGradient>
          </defs>
          <path d={path} fill="url(#lockpaper)" />
        </svg>
        <div className="paper-texture pointer-events-none absolute inset-0 opacity-40 mix-blend-multiply" />

        {/* card content */}
        <div className="relative flex flex-col items-center px-8 py-12">
          {/* padlock */}
          <motion.svg
            width={54}
            height={54}
            viewBox="0 0 24 24"
            fill="none"
            stroke={INK}
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M7 10 V7 a5 5 0 0 1 10 0 v3"
              animate={unlocked ? { rotate: -28, x: -6, y: -2 } : { rotate: 0 }}
              style={{ transformOrigin: "17px 10px" }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
            />
            <rect x={4.5} y={10} width={15} height={10.5} rx={2.4} fill="rgba(47,93,63,0.06)" />
            <circle cx={12} cy={14.5} r={1.4} fill={INK} stroke="none" />
            <path d="M12 15.6 v2.2" />
          </motion.svg>

          <h1 className="mt-5 font-script text-3xl" style={{ color: INK }}>
            {lockWelcome}
          </h1>
          <p className="mt-1 font-serif text-sm italic" style={{ color: INK, opacity: 0.7 }}>
            {error ? lockError : lockHint}
          </p>

          {/* code dots (count matches the passcode length) */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {Array.from({ length: codeLen }).map((_, i) => (
              <motion.span
                key={i}
                className="h-3 w-3 rounded-full border-2"
                style={{ borderColor: INK }}
                animate={{
                  backgroundColor: i < entry.length ? INK : "rgba(0,0,0,0)",
                  scale: i === entry.length - 1 ? [1.4, 1] : 1,
                }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>

          {/* number pad */}
          <div className="mt-8 grid grid-cols-3 gap-x-6 gap-y-4">
            {pad.map((k, i) =>
              k === "" ? (
                <span key={i} />
              ) : k === "del" ? (
                <button
                  key={i}
                  type="button"
                  onClick={del}
                  aria-label="Delete"
                  className="flex h-14 w-14 items-center justify-center rounded-full transition active:scale-90"
                  style={{ color: INK }}
                >
                  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth={1.5}>
                    <path d="M9 5 L20 5 a1 1 0 0 1 1 1 v12 a1 1 0 0 1 -1 1 L9 19 L2 12 Z" />
                    <path d="M12 9 l5 6 M17 9 l-5 6" strokeLinecap="round" />
                  </svg>
                </button>
              ) : (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => press(k)}
                  whileTap={{ scale: 0.85 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full font-serif text-2xl transition hover:bg-[rgba(47,93,63,0.08)]"
                  style={{ color: INK }}
                >
                  {k}
                </motion.button>
              ),
            )}
          </div>
        </div>
      </motion.div>
      </div>
    </motion.div>
  );
}
