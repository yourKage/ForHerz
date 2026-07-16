"use client";

import { useMemo } from "react";
import { mulberry32, rand, pick } from "@/lib/random";
import FlowerHead, { BOUQUET_SPECIES, type FlowerSpecies } from "./art/FlowerHead";

interface BotanicalWallpaperProps {
  /** overall opacity of the decorative flora */
  faded?: boolean;
}

/**
 * A soft, faded pressed-flower wallpaper — scattered watercolour blooms around
 * the edges, gentle vines, and a pale sunburst, on warm cream paper.
 */
export default function BotanicalWallpaper({ faded = true }: BotanicalWallpaperProps) {
  const flora = useMemo(() => {
    const rng = mulberry32(1993);
    // cluster blooms toward the corners/edges, leaving the centre calm
    const spots = [
      { x: 4, y: 6 }, { x: 22, y: 4 }, { x: 50, y: 3 }, { x: 76, y: 5 }, { x: 95, y: 8 },
      { x: 3, y: 30 }, { x: 97, y: 34 },
      { x: 6, y: 62 }, { x: 96, y: 66 },
      { x: 4, y: 92 }, { x: 26, y: 95 }, { x: 52, y: 96 }, { x: 74, y: 94 }, { x: 95, y: 92 },
    ];
    return spots.map((s, i) => ({
      id: i,
      x: s.x + rand(rng, -3, 3),
      y: s.y + rand(rng, -3, 3),
      size: rand(rng, 90, 190),
      rot: rand(rng, -40, 40),
      species: pick(rng, BOUQUET_SPECIES) as FlowerSpecies,
      seed: 500 + i * 13,
    }));
  }, []);

  const op = faded ? 0.22 : 0.6;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* warm cream paper base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 40%, #fbf3e2 0%, #f6ecd6 55%, #efe2c6 100%)",
        }}
      />

      {/* pale sunburst top-left */}
      <div
        className="absolute"
        style={{
          left: "22%",
          top: "10%",
          width: 420,
          height: 420,
          transform: "translate(-50%,-50%)",
          background:
            "repeating-conic-gradient(from 0deg, rgba(214,169,89,0.10) 0deg 4deg, transparent 4deg 9deg)",
          borderRadius: "50%",
          maskImage: "radial-gradient(circle, #000 40%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle, #000 40%, transparent 72%)",
        }}
      />

      {/* faint vine curls */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path
          d="M64 6 C 72 20 60 34 70 46 C 80 58 66 70 74 86"
          fill="none"
          stroke="rgba(111,133,91,0.18)"
          strokeWidth={0.5}
        />
        <path
          d="M30 90 C 22 76 34 64 24 52 C 16 42 26 30 20 16"
          fill="none"
          stroke="rgba(111,133,91,0.16)"
          strokeWidth={0.5}
        />
      </svg>

      {/* scattered faded blooms */}
      {flora.map((f) => (
        <div
          key={f.id}
          className="absolute"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            transform: `translate(-50%,-50%) rotate(${f.rot}deg)`,
            opacity: op,
            filter: "saturate(0.8) blur(0.3px)",
          }}
        >
          <FlowerHead species={f.species} seed={f.seed} size={f.size} />
        </div>
      ))}

      {/* paper texture + soft haze */}
      <div className="paper-texture absolute inset-0 opacity-30 mix-blend-multiply" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 45%, rgba(251,243,226,0.5) 0%, transparent 60%)" }}
      />
    </div>
  );
}
