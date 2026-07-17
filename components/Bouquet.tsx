"use client";

import { motion } from "framer-motion";
import FlowerHead from "./art/FlowerHead";
import type { FlowerSpecies } from "./art/FlowerHead";
import Leaf from "./art/Leaf";

interface BouquetProps {
  reduced?: boolean;
}

interface Bloom {
  s: FlowerSpecies;
  size: number;
  x: number; // centre, px in the 300-wide stage
  y: number;
  z: number;
  fromX: number;
  fromY: number;
  fromR: number;
  alive?: boolean;
}

// A tight dome of warm autumn blooms — back row first, big faces in front,
// the lowest ones tucked into the paper cone (which is drawn on top).
const BLOOMS: Bloom[] = [
  // back row, peeking out
  { s: "zinnia", size: 64, x: 56, y: 104, z: 1, fromX: -240, fromY: -120, fromR: -60 },
  { s: "dahlia", size: 74, x: 150, y: 62, z: 1, fromX: 0, fromY: -260, fromR: 40 },
  { s: "cosmos", size: 66, x: 242, y: 106, z: 1, fromX: 250, fromY: -130, fromR: 70 },
  { s: "cosmos", size: 60, x: 32, y: 166, z: 1, fromX: -290, fromY: 60, fromR: -50 },
  { s: "zinnia", size: 60, x: 268, y: 170, z: 1, fromX: 290, fromY: 80, fromR: 55 },
  // middle row
  { s: "rose", size: 72, x: 98, y: 94, z: 2, fromX: -180, fromY: -200, fromR: -45 },
  { s: "peony", size: 72, x: 202, y: 96, z: 2, fromX: 190, fromY: -210, fromR: 50 },
  // the big front faces
  { s: "peony", size: 98, x: 150, y: 122, z: 3, fromX: 0, fromY: -170, fromR: -25, alive: true },
  { s: "dahlia", size: 90, x: 102, y: 164, z: 3, fromX: -220, fromY: 160, fromR: -65, alive: true },
  { s: "rose", size: 86, x: 198, y: 166, z: 3, fromX: 230, fromY: 150, fromR: 60, alive: true },
  // lowest blooms, tucked into the wrap
  { s: "peony", size: 66, x: 66, y: 212, z: 4, fromX: -160, fromY: 240, fromR: -40 },
  { s: "cosmos", size: 70, x: 150, y: 218, z: 4, fromX: 0, fromY: 260, fromR: 30 },
  { s: "dahlia", size: 66, x: 232, y: 212, z: 4, fromX: 170, fromY: 240, fromR: 45 },
];

// greenery fanning out behind the dome: [x, y, rotate, size]
const LEAVES: [number, number, number, number][] = [
  [150, 130, 0, 100],
  [96, 140, -34, 96],
  [204, 140, 34, 96],
  [52, 160, -62, 88],
  [248, 160, 62, 88],
  [24, 190, -84, 78],
  [276, 190, 84, 78],
  [120, 120, -14, 92],
  [180, 120, 14, 92],
];

const parent = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

export default function Bouquet({ reduced = false }: BouquetProps) {
  const bloomVariant = (b: Bloom) => ({
    hidden: reduced
      ? { opacity: 0 }
      : { opacity: 0, x: b.fromX, y: b.fromY, rotate: b.fromR, scale: 0.4 },
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
      className="relative mx-auto h-[430px] w-[300px]"
    >
      {/* the whole bouquet breathes very gently */}
      <motion.div
        className="absolute inset-0"
        animate={reduced ? undefined : { rotate: [-0.8, 0.8, -0.8] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50% 82%" }}
      >
        {/* greenery behind the dome */}
        <motion.div
          className="absolute inset-0"
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.5 } } }}
          style={{ zIndex: 0 }}
        >
          {LEAVES.map(([x, y, rot, size], i) => (
            <div
              key={i}
              className="absolute"
              style={{ left: x, top: y, transform: `translate(-50%,-100%) rotate(${rot}deg)`, transformOrigin: "50% 100%" }}
            >
              <Leaf seed={i * 9 + 4} size={size} animate={!reduced} delay={0.15 + i * 0.05} />
            </div>
          ))}
        </motion.div>

        {/* a few stems in the gap between blooms and paper */}
        <svg className="absolute" style={{ left: 0, top: 0, zIndex: 1 }} width={300} height={430} aria-hidden>
          <g stroke="#5f7d33" strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.85}>
            <path d="M118,205 C124,235 130,255 138,280" />
            <path d="M150,210 C150,238 150,258 150,282" />
            <path d="M184,205 C176,235 170,255 162,280" />
            <path d="M96,215 C110,245 122,262 132,284" />
            <path d="M208,214 C194,244 180,262 168,284" />
          </g>
        </svg>

        {/* the flowers, gathering into a dome */}
        {BLOOMS.map((b, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: b.x,
              top: b.y,
              zIndex: b.z,
              marginLeft: -b.size / 2,
              marginTop: -b.size / 2,
              filter: "drop-shadow(0 5px 8px rgba(90,64,51,0.28))",
            }}
            variants={bloomVariant(b)}
          >
            <FlowerHead species={b.s} seed={i * 5 + 2} size={b.size} alive={!reduced && !!b.alive} />
          </motion.div>
        ))}

        {/* kraft paper cone wrapped OVER the lowest blooms, tied with ribbon */}
        <motion.div
          className="absolute inset-0"
          style={{ zIndex: 10 }}
          variants={{
            hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 36, scale: 0.92 },
            show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] } },
          }}
        >
          <svg width={300} height={430} viewBox="0 0 300 430" aria-hidden style={{ filter: "drop-shadow(0 10px 18px rgba(90,64,51,0.25))" }}>
            <defs>
              <linearGradient id="bq-kraft" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e0cba4" />
                <stop offset="100%" stopColor="#c6ab7c" />
              </linearGradient>
              <linearGradient id="bq-kraft-side" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#000" stopOpacity={0} />
                <stop offset="100%" stopColor="#7a5c34" stopOpacity={0.28} />
              </linearGradient>
            </defs>
            {/* cone: wide mouth → waist at the tie → small flared foot */}
            <path
              d="M54 236 Q150 260 246 236 L173 352 L201 424 L99 424 L127 352 Z"
              fill="url(#bq-kraft)"
              stroke="#b3945e"
              strokeWidth={1.6}
              strokeLinejoin="round"
            />
            {/* right-side shading for roundness */}
            <path d="M150 251 Q198 249 246 236 L173 352 L201 424 L150 424 L150 352 Z" fill="url(#bq-kraft-side)" />
            {/* paper creases */}
            <g stroke="#a8894f" strokeWidth={1} opacity={0.55} fill="none">
              <path d="M104 246 L136 350" />
              <path d="M196 246 L164 350" />
              <path d="M150 254 L150 348" />
              <path d="M127 352 L137 422" />
              <path d="M173 352 L163 422" />
            </g>
            {/* inner shadow at the mouth (paper folds behind the blooms) */}
            <path d="M54 236 Q150 260 246 236 Q150 276 54 236 Z" fill="#8a6b3c" opacity={0.28} />

            {/* sage ribbon band + bow at the waist */}
            <path d="M121 344 L179 344 L174 364 L126 364 Z" fill="#5f7d5a" stroke="#46603f" strokeWidth={1} />
            <g>
              <path d="M150 353 C 118 334, 100 342, 108 357 C 100 372, 126 376, 150 358 Z" fill="#6b8f66" stroke="#46603f" strokeWidth={1.2} strokeLinejoin="round" />
              <path d="M150 353 C 182 334, 200 342, 192 357 C 200 372, 174 376, 150 358 Z" fill="#6b8f66" stroke="#46603f" strokeWidth={1.2} strokeLinejoin="round" />
              <path d="M143 360 C 136 382, 132 396, 122 410" stroke="#5f7d5a" strokeWidth={5} fill="none" strokeLinecap="round" />
              <path d="M157 360 C 164 382, 170 396, 178 410" stroke="#5f7d5a" strokeWidth={5} fill="none" strokeLinecap="round" />
              <circle cx={150} cy={356} r={7} fill="#7ba076" stroke="#46603f" strokeWidth={1.2} />
            </g>
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
