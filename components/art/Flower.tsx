"use client";

import { motion } from "framer-motion";
import { mulberry32, rand, randInt, type Rng } from "@/lib/random";
import { FLOWER_PALETTES, type Palette } from "./palette";

interface FlowerProps {
  seed: number;
  /** diameter in px */
  size?: number;
  /** seconds before this flower begins to bloom */
  delay?: number;
  /** if false, renders fully-open (for static scene decor) */
  animate?: boolean;
  className?: string;
}

// Build a single teardrop/rounded petal path pointing "up" from origin (0,0).
function petalPath(rng: Rng): string {
  const width = rand(rng, 7, 11);
  const len = rand(rng, 20, 27);
  const tip = rand(rng, 0.3, 0.55);
  // cubic bezier petal, symmetric-ish with a soft notch
  return `M0 0
    C ${-width} ${-len * 0.35}, ${-width * 0.7} ${-len * (1 - tip)}, ${-width * 0.2} ${-len}
    C 0 ${-len * (1 + tip * 0.15)}, ${width * 0.2} ${-len}, ${width * 0.2} ${-len}
    C ${width * 0.7} ${-len * (1 - tip)}, ${width} ${-len * 0.35}, 0 0 Z`;
}

/**
 * A layered, organic flower. Each ring of petals unfolds with its own spring,
 * micro-delay and slight rotation overshoot so no two blooms look alike.
 */
export default function Flower({
  seed,
  size = 90,
  delay = 0,
  animate = true,
  className,
}: FlowerProps) {
  const rng = mulberry32(seed);
  const palette: Palette = FLOWER_PALETTES[seed % FLOWER_PALETTES.length];

  const rings = randInt(rng, 2, 3);
  const layers = Array.from({ length: rings }, (_, r) => {
    const petals = randInt(rng, 5, 8);
    const scale = 1 - r * rand(rng, 0.28, 0.36);
    const rot = rand(rng, 0, 40);
    const paths = Array.from({ length: petals }, () => petalPath(rng));
    return { petals, scale, rot, paths, ringSeed: rng() };
  });

  const spin = rand(rng, -8, 8);

  return (
    <motion.svg
      viewBox="-40 -40 80 80"
      width={size}
      height={size}
      className={className}
      style={{ overflow: "visible" }}
      initial={animate ? { rotate: spin - 6, scale: 0.2, opacity: 0 } : false}
      animate={{ rotate: spin, scale: 1, opacity: 1 }}
      transition={{
        delay,
        scale: { type: "spring", stiffness: 120, damping: 12, delay },
        rotate: { duration: 2.4, ease: [0.22, 1, 0.36, 1], delay },
        opacity: { duration: 0.6, delay },
      }}
    >
      <defs>
        <radialGradient id={`fg-${seed}`} cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor={palette.inner} />
          <stop offset="70%" stopColor={palette.outer} />
          <stop offset="100%" stopColor={palette.edge} />
        </radialGradient>
      </defs>

      {layers.map((layer, r) => (
        <g key={r} transform={`rotate(${layer.rot})`}>
          {layer.paths.map((d, i) => {
            const angle = (i / layer.petals) * 360;
            const petalDelay =
              delay + r * 0.28 + i * 0.045 + layer.ringSeed * 0.15;
            return (
              <motion.path
                key={i}
                d={d}
                fill={`url(#fg-${seed})`}
                stroke={palette.edge}
                strokeWidth={0.4}
                style={{
                  transformOrigin: "0px 0px",
                  transformBox: "view-box",
                }}
                initial={
                  animate
                    ? { rotate: angle, scale: 0.05, opacity: 0 }
                    : { rotate: angle, scale: layer.scale, opacity: 1 }
                }
                animate={{ rotate: angle, scale: layer.scale, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 9,
                  delay: petalDelay,
                }}
              />
            );
          })}
        </g>
      ))}

      {/* pistil / core */}
      <motion.circle
        r={rand(rng, 5.5, 8)}
        fill={palette.core}
        initial={animate ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 11,
          delay: delay + rings * 0.28 + 0.1,
        }}
      />
      {/* stamen dots */}
      {Array.from({ length: randInt(rng, 6, 10) }).map((_, i, a) => {
        const ang = (i / a.length) * Math.PI * 2;
        const rr = rand(rng, 2, 4.5);
        return (
          <motion.circle
            key={i}
            cx={Math.cos(ang) * rr}
            cy={Math.sin(ang) * rr}
            r={rand(rng, 0.7, 1.3)}
            fill={palette.edge}
            initial={animate ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={{
              delay: delay + rings * 0.28 + 0.2 + i * 0.02,
              type: "spring",
              stiffness: 200,
              damping: 12,
            }}
          />
        );
      })}
    </motion.svg>
  );
}
