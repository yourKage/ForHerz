"use client";

import { motion } from "framer-motion";
import FlowerHead from "./art/FlowerHead";
import type { FlowerSpecies } from "./art/FlowerHead";

interface BouquetProps {
  reduced?: boolean;
}

interface Bloom {
  s: FlowerSpecies;
  size: number;
  left: string;
  top: string;
  fromX: number;
  fromY: number;
  fromR: number;
}

// final cluster positions + where each flower flies in from
const BLOOMS: Bloom[] = [
  { s: "peony", size: 78, left: "34%", top: "2%", fromX: -220, fromY: -140, fromR: -70 },
  { s: "rose", size: 62, left: "10%", top: "14%", fromX: -280, fromY: 40, fromR: 55 },
  { s: "dahlia", size: 66, left: "60%", top: "12%", fromX: 250, fromY: -100, fromR: 75 },
  { s: "lily", size: 60, left: "30%", top: "26%", fromX: 0, fromY: -240, fromR: -30 },
  { s: "hydrangea", size: 58, left: "4%", top: "38%", fromX: -300, fromY: 180, fromR: -45 },
  { s: "cosmos", size: 54, left: "68%", top: "36%", fromX: 300, fromY: 130, fromR: 60 },
  { s: "anemone", size: 50, left: "48%", top: "40%", fromX: 190, fromY: 240, fromR: 45 },
  { s: "iris", size: 54, left: "20%", top: "46%", fromX: -170, fromY: 240, fromR: -55 },
  { s: "zinnia", size: 48, left: "56%", top: "52%", fromX: 210, fromY: -210, fromR: 35 },
];

const parent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

export default function Bouquet({ reduced = false }: BouquetProps) {
  const bloom = (b: Bloom) => ({
    hidden: reduced
      ? { opacity: 0 }
      : { opacity: 0, x: b.fromX, y: b.fromY, rotate: b.fromR, scale: 0.5 },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: { type: "spring" as const, stiffness: 90, damping: 14 },
    },
  });

  return (
    <motion.div
      variants={parent}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      className="relative mx-auto h-[440px] w-[300px]"
    >
      {/* wrapping-paper cone + tie, drawn behind the flowers */}
      <motion.div
        className="absolute inset-x-0 bottom-0 flex justify-center"
        variants={{
          hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.9 },
          show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, delay: 0.5 } },
        }}
      >
        <svg width={260} height={300} viewBox="0 0 260 300" aria-hidden>
          {/* stems converging to the tie */}
          <g stroke="#5f7d33" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.85">
            <path d="M96,40 C110,120 120,150 130,210" />
            <path d="M130,30 C130,120 130,150 130,210" />
            <path d="M164,40 C150,120 140,150 130,210" />
            <path d="M116,60 C122,130 126,160 130,210" />
            <path d="M148,60 C138,130 134,160 130,210" />
          </g>
          {/* kraft wrapping cone */}
          <path d="M130,205 L214,300 L46,300 Z" fill="#d8c39a" stroke="#b79a63" strokeWidth="1.5" />
          <path d="M130,205 L214,300 L130,300 Z" fill="#c9b184" opacity="0.7" />
          <path d="M130,205 L92,300 M130,205 L130,300 M130,205 L170,300" stroke="#b79a63" strokeWidth="1" opacity="0.6" fill="none" />
          {/* the tie */}
          <rect x="112" y="198" width="36" height="16" rx="6" fill="#7a3450" />
          {/* bow */}
          <g fill="#5d263b">
            <path d="M130,206 C112,190 96,192 100,206 C96,220 116,220 130,208 Z" />
            <path d="M130,206 C148,190 164,192 160,206 C164,220 144,220 130,208 Z" />
            <circle cx="130" cy="206" r="6" fill="#7a3450" />
            <path d="M126,212 C120,232 116,244 108,256" stroke="#5d263b" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M134,212 C140,232 146,244 152,256" stroke="#5d263b" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        </svg>
      </motion.div>

      {/* the flowers, gathering into the bouquet */}
      <div className="absolute inset-x-0 top-0 h-[260px]">
        {BLOOMS.map((b, i) => (
          <motion.div
            key={i}
            className="absolute -translate-x-1/2"
            style={{ left: b.left, top: b.top, filter: "drop-shadow(0 6px 10px rgba(90,64,51,0.25))" }}
            variants={bloom(b)}
          >
            <FlowerHead species={b.s} seed={i * 5 + 2} size={b.size} painterly />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
