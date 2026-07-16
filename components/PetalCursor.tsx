"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { mulberry32, rand } from "@/lib/random";
import FlowerHead from "./art/FlowerHead";
import type { FlowerSpecies } from "./art/FlowerHead";

interface PetalCursorProps {
  reduced?: boolean;
}

const SPECIES: FlowerSpecies[] = ["cosmos", "rose", "peony", "hydrangea", "lily", "anemone"];

interface TrailPetal {
  id: number;
  x: number;
  y: number;
  size: number;
  drift: number;
  rotate: number;
  species: FlowerSpecies;
}

/**
 * A soft petal trail that follows the cursor — desktop only (fine pointer +
 * hover), and disabled under reduced-motion. Purely decorative, non-blocking.
 */
export default function PetalCursor({ reduced = false }: PetalCursorProps) {
  const [petals, setPetals] = useState<TrailPetal[]>([]);
  const [enabled, setEnabled] = useState(false);
  const idRef = useRef(0);
  const lastRef = useRef(0);
  const rngRef = useRef(mulberry32(4242));

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(fine);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const rng = rngRef.current;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastRef.current < 55) return; // throttle spawn rate
      lastRef.current = now;
      const id = idRef.current++;
      const petal: TrailPetal = {
        id,
        x: e.clientX + rand(rng, -6, 6),
        y: e.clientY + rand(rng, -6, 6),
        size: rand(rng, 12, 22),
        drift: rand(rng, -26, 26),
        rotate: rand(rng, -50, 50),
        species: SPECIES[id % SPECIES.length],
      };
      setPetals((prev) => [...prev.slice(-16), petal]); // cap concurrent petals
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  const remove = (id: number) => setPetals((prev) => prev.filter((p) => p.id !== id));

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      <AnimatePresence>
        {petals.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{ left: p.x, top: p.y }}
            initial={{ opacity: 0.9, scale: 0.6, x: "-50%", y: "-50%", rotate: p.rotate }}
            animate={{ opacity: 0, scale: 1, x: p.drift, y: 60, rotate: p.rotate + 90 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            onAnimationComplete={() => remove(p.id)}
          >
            <FlowerHead species={p.species} seed={p.id % 20} size={p.size} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
