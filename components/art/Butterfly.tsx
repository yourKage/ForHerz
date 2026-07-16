"use client";

import { motion } from "framer-motion";
import { mulberry32 } from "@/lib/random";

interface ButterflyProps {
  seed?: number;
  size?: number;
  color?: string;
  accent?: string;
  className?: string;
  /** disable wing flap (reduced motion) */
  still?: boolean;
}

/** A delicate butterfly whose wings flap via scaleX, viewed slightly top-down. */
export default function Butterfly({
  seed = 1,
  size = 44,
  color = "#dd857c",
  accent = "#e3c583",
  className,
  still = false,
}: ButterflyProps) {
  const rng = mulberry32(seed * 13 + 5);
  const flapDur = 0.28 + rng() * 0.18;

  const Wing = ({ mirror }: { mirror: boolean }) => (
    <g transform={mirror ? "scale(-1,1)" : undefined}>
      {/* upper wing */}
      <path
        d="M0 0 C 6 -14, 20 -18, 22 -8 C 23 -1, 12 2, 0 0 Z"
        fill={color}
        stroke="#9e4356"
        strokeWidth={0.4}
      />
      {/* lower wing */}
      <path
        d="M0 0 C 5 6, 15 10, 15 3 C 15 -2, 8 -1, 0 0 Z"
        fill={accent}
        stroke="#9e4356"
        strokeWidth={0.4}
      />
      <circle cx={14} cy={-8} r={2.2} fill="#fff" opacity={0.5} />
    </g>
  );

  return (
    <svg
      viewBox="-26 -22 52 40"
      width={size}
      height={size}
      className={className}
      style={{ overflow: "visible" }}
    >
      <motion.g
        style={{ transformOrigin: "0px 0px" }}
        animate={still ? undefined : { scaleX: [1, 0.32, 1] }}
        transition={
          still
            ? undefined
            : { duration: flapDur, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <Wing mirror={false} />
      </motion.g>
      <motion.g
        style={{ transformOrigin: "0px 0px" }}
        animate={still ? undefined : { scaleX: [1, 0.32, 1] }}
        transition={
          still
            ? undefined
            : { duration: flapDur, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <Wing mirror={true} />
      </motion.g>
      {/* body */}
      <ellipse cx={0} cy={-2} rx={1.5} ry={9} fill="#5a4033" />
      <circle cx={0} cy={-11} r={2} fill="#3f2c22" />
      <path d="M0 -12 C -3 -18, -5 -19, -6 -20" stroke="#3f2c22" strokeWidth={0.6} fill="none" />
      <path d="M0 -12 C 3 -18, 5 -19, 6 -20" stroke="#3f2c22" strokeWidth={0.6} fill="none" />
    </svg>
  );
}
