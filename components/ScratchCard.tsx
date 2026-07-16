"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/lib/gallery";

interface ScratchCardProps {
  item: GalleryItem;
  index: number;
  reduced?: boolean;
  onSfx?: (kind: "wax" | "paper" | "petal" | "chime") => void;
}

const REVEAL_THRESHOLD = 0.5;

/** A vintage polaroid whose photo is hidden under a green scratch layer, with
 *  a handwritten caption on the print — and a note on the back (tap to flip). */
export default function ScratchCard({ item, index, reduced = false, onSfx }: ScratchCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inView, setInView] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const drawing = useRef(false);
  const rot = ((index * 41) % 9) - 4; // deterministic slight tilt

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { rootMargin: "220px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // soft page-turn sound the moment a photo is revealed
  useEffect(() => {
    if (revealed) onSfx?.("paper");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed]);

  useEffect(() => {
    if (!inView || revealed || reduced) return;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);
    const w = rect.width;
    const h = rect.height;
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#2f6b3e");
    g.addColorStop(1, "#163D22");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(242,234,217,0.94)";
    ctx.font = `italic 600 ${Math.round(w / 8.5)}px Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("scratch", w / 2, h / 2 - w / 18);
    ctx.font = `italic 600 ${Math.round(w / 8.5)}px Georgia, serif`;
    ctx.fillText("me", w / 2, h / 2 + w / 12);
  }, [inView, revealed, reduced]);

  const percentScratched = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return 0;
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;
    const { width, height } = canvas;
    const step = 8;
    const data = ctx.getImageData(0, 0, width, height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * step) {
      total++;
      if (data[i] === 0) clear++;
    }
    return total ? clear / total : 0;
  }, []);

  const scratchAt = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = wrap.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 26, 0, Math.PI * 2);
    ctx.fill();
  }, []);

  const finish = useCallback(() => {
    if (percentScratched() > REVEAL_THRESHOLD) setRevealed(true);
  }, [percentScratched]);

  const onDown = (e: React.PointerEvent) => {
    if (revealed || reduced) return;
    drawing.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    scratchAt(e.clientX, e.clientY);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    scratchAt(e.clientX, e.clientY);
  };
  const onUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    finish();
  };

  const canFlip = revealed && !!item.note;
  const toggleFlip = () => {
    if (!canFlip) return;
    onSfx?.("paper");
    setFlipped((f) => !f);
  };

  return (
    <motion.figure
      initial={{ opacity: 0, y: 60, rotate: rot * 1.8, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, rotate: rot, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? undefined : { rotate: rot * 0.4, scale: 1.03, zIndex: 20 }}
      className="relative w-full select-none"
      style={{ perspective: 1200 }}
    >
      <motion.div
        className="relative"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* ---------- FRONT ---------- */}
        <div style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
          <div
            className="rounded-[4px] bg-[#fbf7ec] p-3 pb-11 shadow-[0_14px_34px_rgba(60,40,20,0.28)]"
            style={{ border: "1px solid rgba(180,165,138,0.5)" }}
          >
            <div
              ref={wrapRef}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-[2px] bg-forest-700/30"
              style={{ touchAction: "none" }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerLeave={onUp}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.caption}
                loading="lazy"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
                style={{ filter: "sepia(0.16) saturate(1.04) contrast(1.02)" }}
              />
              <div className="pointer-events-none absolute inset-0" style={{ boxShadow: "inset 0 0 34px rgba(22,61,34,0.28)" }} />
              {!reduced && (
                <motion.canvas
                  ref={canvasRef}
                  className="absolute inset-0 h-full w-full"
                  animate={{ opacity: revealed ? 0 : 1 }}
                  transition={{ duration: 0.6 }}
                  style={{ pointerEvents: revealed ? "none" : "auto", cursor: "crosshair" }}
                />
              )}
              {reduced && !revealed && (
                <button
                  type="button"
                  onClick={() => setRevealed(true)}
                  className="absolute inset-0 flex items-center justify-center font-serif text-xl italic text-cream-50"
                  style={{ background: "linear-gradient(150deg,#2f6b3e,#163D22)" }}
                >
                  Tap to reveal
                </button>
              )}

              {/* flip affordance, once revealed */}
              {canFlip && (
                <motion.button
                  type="button"
                  onClick={toggleFlip}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="absolute bottom-1.5 right-1.5 flex items-center gap-1 rounded-full bg-forest-600/80 px-2.5 py-1 font-body text-[0.62rem] uppercase tracking-wide text-cream-50 backdrop-blur-sm"
                  aria-label="Flip to read the note"
                >
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M3 12a9 9 0 0 1 15-6.7L21 8 M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  note
                </motion.button>
              )}
            </div>

            {/* handwritten caption on the print */}
            <figcaption className="absolute inset-x-0 bottom-0 px-3 pb-2 text-center">
              <p className="font-script text-[1.35rem] leading-tight text-wine-500">{item.caption}</p>
            </figcaption>
          </div>
        </div>

        {/* ---------- BACK ---------- */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className="paper-texture flex h-full w-full flex-col rounded-[4px] bg-[#fbf7ec] p-5 shadow-[0_14px_34px_rgba(60,40,20,0.28)]"
            style={{ border: "1px solid rgba(180,165,138,0.5)" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="font-serif text-xs italic text-forest-500/60">on the back —</span>
              <button
                type="button"
                onClick={toggleFlip}
                className="rounded-full border border-forest-500/30 px-2 py-0.5 font-body text-[0.6rem] uppercase tracking-wide text-forest-500"
                aria-label="Flip back to the photo"
              >
                flip back
              </button>
            </div>
            <div className="flex flex-1 items-center">
              <p className="font-script text-[1.35rem] leading-snug text-wine-500">{item.note}</p>
            </div>
            <div className="mt-2 h-px w-14 self-center bg-forest-500/30" />
          </div>
        </div>
      </motion.div>
    </motion.figure>
  );
}
