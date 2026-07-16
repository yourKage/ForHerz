"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { mulberry32, rand } from "@/lib/random";

interface BackgroundProps {
  reduced?: boolean;
}

/**
 * The dreamlike backdrop for the whole experience:
 * layered watercolour blooms, a paper-fibre texture, slow moving light rays,
 * fine film grain and a bed of drifting depth particles.
 */
export default function Background({ reduced = false }: BackgroundProps) {
  const blobs = useMemo(() => {
    const rng = mulberry32(99);
    return Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: rand(rng, 5, 85),
      y: rand(rng, 5, 85),
      size: rand(rng, 260, 520),
      hue: [
        "rgba(233,170,163,0.35)",
        "rgba(214,127,140,0.28)",
        "rgba(183,196,164,0.30)",
        "rgba(227,197,131,0.28)",
        "rgba(233,212,232,0.30)",
      ][i % 5],
      dur: rand(rng, 16, 30),
      dx: rand(rng, -40, 40),
      dy: rand(rng, -30, 30),
    }));
  }, []);

  const dust = useMemo(() => {
    const rng = mulberry32(444);
    return Array.from({ length: 26 }, (_, i) => ({
      id: i,
      x: rand(rng, 0, 100),
      y: rand(rng, 0, 100),
      r: rand(rng, 1, 3),
      dur: rand(rng, 12, 26),
      delay: rand(rng, 0, 10),
      drift: rand(rng, -30, 30),
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden grain">
      {/* base warm wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% -10%, #fdfaf3 0%, #faf3e6 45%, #f2e6cf 100%)",
        }}
      />

      {/* watercolour blooms */}
      {blobs.map((b) => (
        <motion.div
          key={b.id}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: b.size,
            height: b.size,
            background: `radial-gradient(circle at 40% 40%, ${b.hue}, transparent 70%)`,
          }}
          animate={
            reduced
              ? undefined
              : { x: [0, b.dx, 0], y: [0, b.dy, 0], scale: [1, 1.08, 1] }
          }
          transition={{
            duration: b.dur,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* moving light rays */}
      {!reduced && (
        <motion.div
          className="absolute -inset-[20%]"
          style={{
            background:
              "conic-gradient(from 200deg at 60% -10%, transparent 0deg, rgba(255,246,214,0.35) 20deg, transparent 55deg, rgba(255,246,214,0.22) 90deg, transparent 130deg)",
            mixBlendMode: "screen",
          }}
          animate={{ rotate: [0, 8, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* paper fibre texture */}
      <div className="paper-texture absolute inset-0 opacity-40 mix-blend-multiply" />

      {/* depth dust particles */}
      {dust.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.r,
            height: d.r,
            boxShadow: "0 0 6px rgba(255,246,214,0.9)",
          }}
          animate={
            reduced
              ? { opacity: 0.4 }
              : {
                  y: [0, -60, 0],
                  x: [0, d.drift, 0],
                  opacity: [0, 0.8, 0],
                }
          }
          transition={{
            duration: d.dur,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* soft vignette to focus the centre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(90,64,51,0.18) 100%)",
        }}
      />
    </div>
  );
}
