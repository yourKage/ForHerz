"use client";

import { useMemo } from "react";
import { mulberry32, rand } from "@/lib/random";

interface VintagePaperBgProps {
  /** show faint newspaper columns behind the crumple */
  newspaper?: boolean;
  tone?: "cream" | "kraft";
}

/**
 * Warm crumpled paper with optional faint aged-newspaper columns showing
 * through. Soft, nostalgic, and non-distracting.
 */
export default function VintagePaperBg({ newspaper = true, tone = "cream" }: VintagePaperBgProps) {
  const crumples = useMemo(() => {
    const rng = mulberry32(313);
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: rand(rng, 0, 100),
      y: rand(rng, 0, 100),
      s: rand(rng, 120, 340),
      dark: rng() > 0.5,
      o: rand(rng, 0.04, 0.1),
    }));
  }, []);

  const base =
    tone === "kraft"
      ? "radial-gradient(120% 100% at 50% 30%, #e9d4ad 0%, #ddc290 55%, #cdb079 100%)"
      : "radial-gradient(120% 100% at 50% 20%, #f6efdd 0%, #efe3c6 55%, #e6d7b4 100%)";

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: base }} />

      {/* faint aged newspaper columns */}
      {newspaper && (
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent 0px, transparent 5px, rgba(60,44,34,0.9) 5px, rgba(60,44,34,0.9) 6px), repeating-linear-gradient(90deg, transparent 0px, transparent 120px, rgba(60,44,34,0.5) 120px, rgba(60,44,34,0.5) 122px)",
            backgroundSize: "100% 12px, 244px 100%",
            mixBlendMode: "multiply",
          }}
        />
      )}

      {/* crumple highlights & shadows */}
      {crumples.map((c) => (
        <div
          key={c.id}
          className="absolute rounded-full blur-2xl"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            width: c.s,
            height: c.s,
            transform: "translate(-50%,-50%)",
            background: c.dark
              ? `radial-gradient(circle, rgba(90,64,51,${c.o}) 0%, transparent 70%)`
              : `radial-gradient(circle, rgba(255,250,235,${c.o + 0.05}) 0%, transparent 70%)`,
          }}
        />
      ))}

      <div className="paper-texture absolute inset-0 opacity-50 mix-blend-multiply" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 50%, transparent 55%, rgba(90,64,51,0.16) 100%)",
        }}
      />
    </div>
  );
}
