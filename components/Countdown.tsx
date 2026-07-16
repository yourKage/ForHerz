"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { experienceContent } from "@/lib/content";
import FlowerHead from "./art/FlowerHead";

interface CountdownProps {
  reduced?: boolean;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function daysSince(dateStr: string): number {
  const then = new Date(dateStr + "T00:00:00").getTime();
  return Math.max(0, Math.floor((Date.now() - then) / MS_PER_DAY));
}

function daysUntil(dateStr: string): number {
  const then = new Date(dateStr + "T00:00:00").getTime();
  return Math.max(0, Math.ceil((then - Date.now()) / MS_PER_DAY));
}

/** A little animated counter tile. */
function Tile({ value, label, reduced }: { value: number; label: string; reduced?: boolean }) {
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1400;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, reduced]);

  return (
    <div className="flex flex-col items-center">
      <span className="font-script text-6xl leading-none text-wine-500 sm:text-7xl">
        {display.toLocaleString()}
      </span>
      <span className="mt-2 max-w-[9rem] font-body text-xs uppercase tracking-[0.24em] text-forest-500/70">
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ reduced = false }: CountdownProps) {
  const { countdown } = experienceContent;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null; // dates are client-only to avoid hydration drift

  const together = daysSince(countdown.startDate);
  const untilReunion = countdown.reunionDate ? daysUntil(countdown.reunionDate) : null;

  return (
    <section className="flex flex-col items-center py-14 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 160, damping: 14 }}
        className="mb-6"
      >
        <FlowerHead species="peony" seed={19} size={64} painterly />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="flex flex-wrap items-start justify-center gap-x-16 gap-y-8"
      >
        <Tile value={together} label={countdown.startLabel} reduced={reduced} />
        {untilReunion !== null && (
          <Tile value={untilReunion} label={countdown.reunionLabel} reduced={reduced} />
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4 }}
        className="mt-8 font-serif text-base italic text-forest-500/75"
      >
        {countdown.caption}
      </motion.p>
    </section>
  );
}
