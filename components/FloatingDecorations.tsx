"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { mulberry32, rand, pick } from "@/lib/random";
import Petal from "./art/Petal";
import Butterfly from "./art/Butterfly";
import { Pearl, Sparkle } from "./art/Ornaments";

interface FloatingDecorationsProps {
  reduced?: boolean;
  /** density multiplier (mobile can pass a lower value) */
  density?: number;
}

const PETAL_COLORS: [string, string][] = [
  ["#f3cfcb", "#e9aaa3"],
  ["#e6a4ac", "#d67f8c"],
  ["#f9e5e3", "#f3cfcb"],
  ["#efdcae", "#e3c583"],
];

/**
 * Everything that keeps the scene alive: petals drifting down, butterflies
 * occasionally crossing, pearls slowly rotating, sparkles shimmering.
 * Every element moves independently — nothing is ever perfectly still.
 */
export default function FloatingDecorations({
  reduced = false,
  density = 1,
}: FloatingDecorationsProps) {
  const items = useMemo(() => {
    const rng = mulberry32(2024);
    const petalCount = Math.round(14 * density);
    const petals = Array.from({ length: petalCount }, (_, i) => ({
      id: `p${i}`,
      x: rand(rng, 0, 100),
      size: rand(rng, 14, 30),
      dur: rand(rng, 14, 26),
      delay: rand(rng, 0, 16),
      sway: rand(rng, 30, 90),
      spin: rand(rng, 180, 520) * (rng() > 0.5 ? 1 : -1),
      colors: pick(rng, PETAL_COLORS),
    }));

    const sparkleCount = Math.round(12 * density);
    const sparkles = Array.from({ length: sparkleCount }, (_, i) => ({
      id: `s${i}`,
      x: rand(rng, 3, 97),
      y: rand(rng, 5, 95),
      size: rand(rng, 8, 18),
      dur: rand(rng, 2.4, 5),
      delay: rand(rng, 0, 5),
    }));

    const pearlCount = Math.round(5 * density);
    const pearls = Array.from({ length: pearlCount }, (_, i) => ({
      id: `pe${i}`,
      x: rand(rng, 6, 94),
      y: rand(rng, 10, 90),
      size: rand(rng, 10, 20),
      dur: rand(rng, 8, 16),
      delay: rand(rng, 0, 6),
    }));

    const butterflies = Array.from({ length: 2 }, (_, i) => ({
      id: `b${i}`,
      y: rand(rng, 15, 70),
      size: rand(rng, 30, 46),
      dur: rand(rng, 16, 24),
      delay: rand(rng, 2, 12),
      dir: i % 2 === 0 ? 1 : -1,
      color: pick(rng, ["#dd857c", "#c05a6d", "#d2a959"]),
    }));

    return { petals, sparkles, pearls, butterflies };
  }, [density]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-40">
      {/* drifting petals */}
      {items.petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute will-transform"
          style={{ left: `${p.x}%`, top: -40 }}
          initial={{ y: -40, opacity: 0 }}
          animate={
            reduced
              ? { opacity: 0.5, y: 40 }
              : {
                  y: ["-6vh", "108vh"],
                  x: [0, p.sway, -p.sway * 0.6, 0],
                  rotate: [0, p.spin],
                  opacity: [0, 0.9, 0.9, 0],
                }
          }
          transition={{
            duration: reduced ? 1 : p.dur,
            delay: p.delay,
            repeat: reduced ? 0 : Infinity,
            ease: "easeInOut",
          }}
        >
          <Petal size={p.size} color={p.colors[0]} edge={p.colors[1]} />
        </motion.div>
      ))}

      {/* shimmering sparkles */}
      {items.sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute"
          style={{ left: `${s.x}%`, top: `${s.y}%` }}
          animate={
            reduced
              ? { opacity: 0.4 }
              : { opacity: [0, 1, 0], scale: [0.4, 1, 0.4], rotate: [0, 40] }
          }
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: reduced ? 0 : Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkle size={s.size} />
        </motion.div>
      ))}

      {/* slowly rotating pearls */}
      {items.pearls.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          animate={
            reduced
              ? { opacity: 0.6 }
              : { rotate: [0, 360], y: [0, -12, 0], opacity: [0.5, 0.9, 0.5] }
          }
          transition={{
            rotate: { duration: p.dur, repeat: Infinity, ease: "linear" },
            y: {
              duration: p.dur * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            },
            opacity: {
              duration: p.dur * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <Pearl size={p.size} />
        </motion.div>
      ))}

      {/* butterflies crossing the screen */}
      {!reduced &&
        items.butterflies.map((b) => (
          <motion.div
            key={b.id}
            className="absolute"
            style={{ top: `${b.y}%` }}
            initial={{ x: b.dir === 1 ? "-10vw" : "110vw" }}
            animate={{
              x: b.dir === 1 ? "110vw" : "-10vw",
              y: [0, -40, 20, -30, 0],
            }}
            transition={{
              x: {
                duration: b.dur,
                delay: b.delay,
                repeat: Infinity,
                repeatDelay: 8,
                ease: "easeInOut",
              },
              y: {
                duration: b.dur / 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <div style={{ transform: b.dir === 1 ? "none" : "scaleX(-1)" }}>
              <Butterfly seed={b.id.charCodeAt(1) + 3} size={b.size} color={b.color} />
            </div>
          </motion.div>
        ))}
    </div>
  );
}
