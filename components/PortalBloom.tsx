"use client";

import { motion, type TargetAndTransition, type Transition } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { mulberry32, rand, randInt } from "@/lib/random";
import FlowerHead, { BOUQUET_SPECIES, type FlowerSpecies } from "./art/FlowerHead";
import { experienceContent } from "@/lib/content";

interface PortalBloomProps {
  reduced?: boolean;
  onSfx?: (kind: "wax" | "paper" | "petal" | "chime") => void;
  onFinished: () => void;
}

type Stage = "idle" | "bloom" | "full" | "fall";

export default function PortalBloom({ reduced = false, onSfx, onFinished }: PortalBloomProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const [dims, setDims] = useState({ w: 1280, h: 800 });

  useEffect(() => {
    const set = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  const isMobile = dims.w < 640;

  const flowers = useMemo(() => {
    const rng = mulberry32(88);
    const { w, h } = dims;
    // tile the whole viewport (with overscan) so flowers fill edge-to-edge & overlap
    const cell = isMobile ? 132 : 178;
    const cols = Math.ceil(w / cell) + 3;
    const rows = Math.ceil(h / cell) + 3;
    const cx = w / 2;
    const cy = h / 2;

    const list = [];
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let cCol = 0; cCol < cols; cCol++) {
        const gx = (cCol + 0.5) * cell - (cols * cell) / 2 + rand(rng, -cell * 0.4, cell * 0.4);
        const gy = (r + 0.5) * cell - (rows * cell) / 2 + rand(rng, -cell * 0.4, cell * 0.4);
        const dist = Math.hypot(gx, gy);
        const angle = Math.atan2(gy, gx);
        const curl = Math.min(dist * 0.45, 260);
        list.push({
          id: idx++,
          tx: gx,
          ty: gy,
          midX: gx * 0.45 + Math.cos(angle + Math.PI / 2) * curl,
          midY: gy * 0.45 + Math.sin(angle + Math.PI / 2) * curl,
          dist,
          size: rand(rng, isMobile ? 150 : 230, isMobile ? 250 : 380),
          species: BOUQUET_SPECIES[randInt(rng, 0, BOUQUET_SPECIES.length - 1)] as FlowerSpecies,
          seed: 1000 + idx * 7,
          spin: rand(rng, -160, 160),
          swayAmp: rand(rng, 4, 10),
          swayDur: rand(rng, 4, 7),
          fallDelay: rand(rng, 0, 0.6),
          fallDur: rand(rng, 1.7, 2.8),
          fallSway: rand(rng, -80, 80),
          z: randInt(rng, 1, 999),
          emitDelay: 0,
        });
      }
    }
    // spiral emission order: sort by distance from centre, nearest first
    const order = [...list].sort((a, b) => a.dist - b.dist);
    const step = reduced ? 0.004 : isMobile ? 0.01 : 0.012;
    order.forEach((f, rank) => {
      f.emitDelay = rank * step;
    });
    return list;
  }, [dims, isMobile, reduced]);

  const tap = () => {
    if (stage !== "idle") return;
    onSfx?.("paper");
    onSfx?.("chime");
    setStage("bloom");
    const maxEmit = flowers.reduce((m, f) => Math.max(m, f.emitDelay), 0);
    const bloomMs = reduced ? 600 : maxEmit * 1000 + 1500;
    setTimeout(() => setStage("full"), bloomMs);
    const holdMs = reduced ? 300 : 1600;
    setTimeout(() => {
      onSfx?.("petal");
      setStage("fall");
    }, bloomMs + holdMs);
    setTimeout(() => onFinished(), bloomMs + holdMs + (reduced ? 500 : 2000));
  };

  return (
    <motion.div
      className="absolute inset-0 z-40 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* expanding warm glow on tap */}
      {stage !== "idle" && (
        <motion.div
          className="pointer-events-none absolute rounded-full"
          style={{
            width: 200, height: 200,
            background: "radial-gradient(circle, rgba(249,229,227,0.9), rgba(233,170,163,0.4) 50%, transparent 72%)",
          }}
          initial={{ scale: 0, opacity: 0.9 }}
          animate={{ scale: Math.max(dims.w, dims.h) / 40, opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      )}

      {/* the letter in the centre (tap target) */}
      <motion.button
        type="button"
        onClick={tap}
        aria-label={experienceContent.portalPrompt}
        className="relative z-[1000] flex flex-col items-center"
        animate={
          stage === "idle" && !reduced
            ? { y: [0, -10, 0] }
            : { opacity: stage === "idle" ? 1 : 0, scale: stage === "idle" ? 1 : 0.5 }
        }
        transition={stage === "idle" ? { duration: 3.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.6 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg width={150} height={112} viewBox="0 0 150 112" className="drop-shadow-[0_16px_30px_rgba(90,64,51,0.25)]">
          <defs>
            <linearGradient id="portalEnv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f6ecd8" />
              <stop offset="100%" stopColor="#e6d0a5" />
            </linearGradient>
          </defs>
          <rect x={2} y={2} width={146} height={108} rx={8} fill="url(#portalEnv)" stroke="#cdb27f" strokeWidth={1.5} />
          <path d="M2 8 L75 64 L148 8" fill="none" stroke="#cdb27f" strokeWidth={1.5} />
          <circle cx={75} cy={60} r={9} fill="#b98fc0" />
        </svg>
        <motion.span
          className="mt-6 font-script text-2xl text-rose-500"
          animate={reduced ? undefined : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.6, repeat: Infinity }}
        >
          {experienceContent.portalPrompt}
        </motion.span>
      </motion.button>

      {/* dense flower burst filling the whole screen */}
      {stage !== "idle" &&
        flowers.map((f) => {
          let animate: TargetAndTransition;
          let transition: Transition;
          if (stage === "bloom") {
            animate = {
              x: [0, f.midX, f.tx],
              y: [0, f.midY, f.ty],
              scale: [0, 1.12, 1],
              rotate: [0, f.spin * 0.5, f.spin],
              opacity: [0, 1, 1],
            };
            transition = { duration: reduced ? 0.5 : 1.4, delay: f.emitDelay, ease: [0.16, 0.8, 0.3, 1], times: [0, 0.6, 1] };
          } else if (stage === "full") {
            animate = {
              x: f.tx,
              y: f.ty,
              scale: [1, 1.05, 1],
              rotate: [f.spin, f.spin + f.swayAmp, f.spin - f.swayAmp, f.spin],
              opacity: 1,
            };
            transition = { duration: f.swayDur, repeat: Infinity, ease: "easeInOut" };
          } else {
            animate = {
              x: f.tx + f.fallSway,
              y: dims.h / 2 + f.size + 140,
              rotate: f.spin + (f.fallSway > 0 ? 120 : -120),
              opacity: [1, 1, 0],
              scale: 1,
            };
            transition = { duration: f.fallDur, delay: f.fallDelay, ease: [0.4, 0, 0.7, 1] };
          }
          return (
            <motion.div
              key={f.id}
              className="pointer-events-none absolute left-1/2 top-1/2 will-transform"
              style={{ zIndex: f.z, marginLeft: -f.size / 2, marginTop: -f.size / 2 }}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={animate}
              transition={transition}
            >
              <FlowerHead species={f.species} seed={f.seed} size={f.size} />
            </motion.div>
          );
        })}

      {/* oil-canvas paint texture unifying the flower field */}
      {stage !== "idle" && (
        <div
          className="paper-texture pointer-events-none absolute inset-0 z-[1100]"
          style={{ mixBlendMode: "soft-light", opacity: 0.45 }}
        />
      )}
    </motion.div>
  );
}
