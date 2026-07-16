"use client";

import { motion } from "framer-motion";
import { mulberry32, rand, type Rng } from "@/lib/random";
import { LEAF_GREENS } from "./palette";

interface LeafProps {
  seed: number;
  size?: number;
  delay?: number;
  animate?: boolean;
  className?: string;
}

function leafPath(rng: Rng): string {
  const w = rand(rng, 9, 14);
  const l = rand(rng, 26, 38);
  const curve = rand(rng, 0.2, 0.5);
  return `M0 0
    C ${w} ${-l * curve}, ${w * 0.6} ${-l * 0.85}, 0 ${-l}
    C ${-w * 0.6} ${-l * 0.85}, ${-w} ${-l * curve}, 0 0 Z`;
}

export default function Leaf({
  seed,
  size = 60,
  delay = 0,
  animate = true,
  className,
}: LeafProps) {
  const rng = mulberry32(seed * 7 + 3);
  const color = LEAF_GREENS[Math.floor(rng() * LEAF_GREENS.length)];
  const dark = LEAF_GREENS[3];
  const d = leafPath(rng);
  const bend = rand(rng, -14, 14);

  return (
    <motion.svg
      viewBox="-20 -40 40 44"
      width={size}
      height={size}
      className={className}
      style={{ overflow: "visible" }}
      initial={animate ? { scale: 0, rotate: bend - 20, opacity: 0 } : false}
      animate={{ scale: 1, rotate: bend, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 11,
        delay,
      }}
    >
      <defs>
        <linearGradient id={`lg-${seed}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={dark} />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#lg-${seed})`} stroke={dark} strokeWidth={0.4} />
      <path
        d={`M0 0 L0 ${-rand(rng, 24, 34)}`}
        stroke={dark}
        strokeWidth={0.7}
        opacity={0.5}
        fill="none"
      />
    </motion.svg>
  );
}
