"use client";

import { motion } from "framer-motion";

interface VineProps {
  /** SVG path data for the vine spine */
  d: string;
  color?: string;
  width?: number;
  delay?: number;
  duration?: number;
  animate?: boolean;
  className?: string;
}

/** A vine spine that draws itself on via pathLength (organic growth). */
export default function Vine({
  d,
  color = "#6f855b",
  width = 1.6,
  delay = 0,
  duration = 2.6,
  animate = true,
  className,
}: VineProps) {
  return (
    <motion.path
      d={d}
      className={className}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      initial={animate ? { pathLength: 0, opacity: 0 } : false}
      animate={{ pathLength: 1, opacity: 0.85 }}
      transition={{
        pathLength: { duration, ease: [0.33, 1, 0.68, 1], delay },
        opacity: { duration: 0.4, delay },
      }}
    />
  );
}
