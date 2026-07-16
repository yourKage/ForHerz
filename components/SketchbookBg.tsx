"use client";

import { useMemo } from "react";
import { mulberry32, rand, pick } from "@/lib/random";

/** Faint pencil-sketch doodles scattered on the page. */
function Doodle({ kind }: { kind: "flower" | "star" | "heart" | "leaf" | "swirl" }) {
  const stroke = "rgba(90,64,51,0.28)";
  const common = { fill: "none", stroke, strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "flower")
    return (
      <svg width={70} height={70} viewBox="-35 -35 70 70">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx={0} cy={-16} rx={7} ry={13} transform={`rotate(${a})`} {...common} />
        ))}
        <circle r={5} {...common} />
        <path d="M0 6 C 4 20 -2 30 2 40" {...common} />
      </svg>
    );
  if (kind === "star")
    return (
      <svg width={46} height={46} viewBox="-23 -23 46 46">
        <path d="M0 -20 L5 -6 L20 -6 L8 3 L12 18 L0 9 L-12 18 L-8 3 L-20 -6 L-5 -6 Z" {...common} />
      </svg>
    );
  if (kind === "heart")
    return (
      <svg width={44} height={44} viewBox="-22 -22 44 44">
        <path d="M0 14 C -18 0 -14 -18 0 -8 C 14 -18 18 0 0 14 Z" {...common} />
      </svg>
    );
  if (kind === "leaf")
    return (
      <svg width={54} height={54} viewBox="-27 -27 54 54">
        <path d="M-16 16 C -6 -6 6 -6 16 -16 C 6 -6 -6 6 -16 16 Z" {...common} />
        <path d="M-16 16 L16 -16" {...common} />
      </svg>
    );
  return (
    <svg width={60} height={40} viewBox="-30 -20 60 40">
      <path d="M-26 0 C -14 -18 -2 18 10 0 C 16 -10 24 -6 26 2" {...common} />
    </svg>
  );
}

export default function SketchbookBg() {
  const doodles = useMemo(() => {
    const rng = mulberry32(7788);
    const kinds = ["flower", "star", "heart", "leaf", "swirl"] as const;
    return Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: rand(rng, 6, 92),
      y: rand(rng, 4, 96),
      rot: rand(rng, -30, 30),
      scale: rand(rng, 0.7, 1.5),
      kind: pick(rng, kinds),
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* sketchbook paper */}
      <div className="absolute inset-0" style={{ background: "#f5eeda" }} />

      {/* faint graph/dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(90,64,51,0.12) 1px, transparent 1.4px)",
          backgroundSize: "26px 26px",
          opacity: 0.5,
        }}
      />

      {/* pencil doodles */}
      {doodles.map((d) => (
        <div
          key={d.id}
          className="absolute"
          style={{ left: `${d.x}%`, top: `${d.y}%`, transform: `translate(-50%,-50%) rotate(${d.rot}deg) scale(${d.scale})` }}
        >
          <Doodle kind={d.kind} />
        </div>
      ))}

      {/* spiral binding down the left edge */}
      <div className="absolute inset-y-0 left-0 w-10">
        <div className="absolute inset-y-0 left-6 w-px bg-ink-500/15" />
        {Array.from({ length: 26 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-3 h-3.5 w-6 rounded-full border border-ink-500/25"
            style={{ top: `${(i + 0.5) * (100 / 26)}%`, transform: "translateY(-50%)", background: "linear-gradient(180deg,rgba(255,255,255,0.5),rgba(90,64,51,0.08))" }}
          />
        ))}
      </div>

      {/* faint coffee ring */}
      <div
        className="absolute"
        style={{
          right: "8%", top: "22%", width: 120, height: 120, borderRadius: "50%",
          border: "3px solid rgba(120,85,60,0.10)", boxShadow: "inset 0 0 0 6px rgba(120,85,60,0.04)",
        }}
      />

      {/* grain + warm vignette */}
      <div className="paper-texture absolute inset-0 opacity-40 mix-blend-multiply" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 100% at 50% 45%, transparent 60%, rgba(90,64,51,0.14) 100%)" }} />
    </div>
  );
}
