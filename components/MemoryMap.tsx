"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { experienceContent } from "@/lib/content";
import CrumplePaper from "./CrumplePaper";

interface MemoryMapProps {
  reduced?: boolean;
  onSfx?: (kind: "wax" | "paper" | "petal" | "chime") => void;
}

const ink = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/**
 * A soft hand-drawn "map" (parchment + stylised coastline, rivers and a dotted
 * route) with tappable pins. Tapping a pin opens a little photo + caption.
 */
export default function MemoryMap({ reduced = false, onSfx }: MemoryMapProps) {
  const { memoryMapIntro, memoryMapSubtitle, memoryPlaces } = experienceContent;
  const [active, setActive] = useState<number | null>(null);

  const open = (i: number) => {
    onSfx?.("paper");
    setActive(i);
  };

  return (
    <section className="py-14">
      <div className="mb-8 text-center">
        <motion.h2 variants={ink} initial="hidden" whileInView="show" viewport={{ once: true }} className="font-script text-5xl text-wine-500 sm:text-6xl">
          {memoryMapIntro}
        </motion.h2>
        <motion.p variants={ink} initial="hidden" whileInView="show" viewport={{ once: true }} className="mx-auto mt-2 max-w-md font-serif text-base italic text-forest-500/80">
          {memoryMapSubtitle}
        </motion.p>
      </div>

      <motion.div
        variants={ink}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto w-[min(94vw,720px)]"
        style={{ filter: "drop-shadow(0 20px 40px rgba(90,64,51,0.26))" }}
      >
        <CrumplePaper seed={55} tone="aged" rounded="rounded-[14px]">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[14px]">
            {/* the drawn map */}
            <svg viewBox="0 0 320 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
              {/* sea wash */}
              <rect width="320" height="200" fill="#ece0c4" />
              {/* landmass blobs */}
              <path d="M-10,70 C40,50 70,58 95,44 C120,30 160,36 190,28 C230,18 280,30 330,20 L340,220 L-20,220 Z" fill="#dfd0aa" stroke="#b79a63" strokeWidth="1.1" />
              <path d="M120,150 C150,140 180,150 210,142 C250,132 290,146 340,138 L340,220 L110,220 Z" fill="#d6c69c" stroke="#b79a63" strokeWidth="1" opacity="0.9" />
              {/* rivers */}
              <path d="M60,60 C80,90 70,120 100,150 C120,170 140,180 150,200" fill="none" stroke="#9db3c9" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
              <path d="M250,40 C240,80 260,110 250,150" fill="none" stroke="#9db3c9" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
              {/* dotted route between the two of us */}
              {memoryPlaces.length >= 2 && (
                <path
                  d={`M${(memoryPlaces[1].x / 100) * 320},${(memoryPlaces[1].y / 100) * 200} Q160,${((memoryPlaces[1].y + memoryPlaces[2 % memoryPlaces.length].y) / 200) * 200} ${(memoryPlaces[2 % memoryPlaces.length].x / 100) * 320},${(memoryPlaces[2 % memoryPlaces.length].y / 100) * 200}`}
                  fill="none"
                  stroke="#5d263b"
                  strokeWidth="1.4"
                  strokeDasharray="2 5"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              )}
              {/* compass rose */}
              <g transform="translate(288,168)" opacity="0.6">
                <circle r="11" fill="none" stroke="#8a6a3a" strokeWidth="0.8" />
                <path d="M0,-11 L2.4,0 L0,11 L-2.4,0 Z" fill="#8a6a3a" />
                <text x="0" y="-13.5" textAnchor="middle" fontSize="6" fill="#8a6a3a" fontFamily="Georgia, serif">N</text>
              </g>
              {/* tiny scattered doodles */}
              <g stroke="#8a6a3a" strokeWidth="0.7" fill="none" opacity="0.4">
                <path d="M40,120 l3,-4 l3,4 M46,120 l3,-4 l3,4" />
                <path d="M200,170 l3,-4 l3,4 M206,170 l3,-4 l3,4" />
              </g>
            </svg>

            {/* pins */}
            {memoryPlaces.map((p, i) => (
              <motion.button
                key={p.name}
                type="button"
                onClick={() => open(i)}
                className="absolute -translate-x-1/2 -translate-y-full focus-visible:outline-none"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                initial={reduced ? undefined : { opacity: 0, y: -8, scale: 0 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.2 + i * 0.15 }}
                whileHover={{ scale: 1.15, y: -2 }}
                aria-label={`Open memory: ${p.name}`}
              >
                <svg width={26} height={34} viewBox="0 0 26 34" style={{ filter: "drop-shadow(0 3px 4px rgba(90,64,51,0.4))" }}>
                  <path d="M13 33 C13 33 24 19 24 12 A11 11 0 1 0 2 12 C2 19 13 33 13 33 Z" fill="#5d263b" stroke="#faf3e6" strokeWidth="1.5" />
                  <circle cx="13" cy="12" r="4" fill="#f2ead9" />
                </svg>
                {!reduced && (
                  <motion.span
                    className="absolute left-1/2 top-0 -z-10 h-5 w-5 -translate-x-1/2 rounded-full"
                    style={{ background: "rgba(93,38,59,0.35)" }}
                    animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  />
                )}
                <span className="mt-0.5 block whitespace-nowrap font-script text-base leading-none text-wine-500">
                  {p.name}
                </span>
              </motion.button>
            ))}
          </div>
        </CrumplePaper>
      </motion.div>

      {/* pin detail overlay */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-center justify-center p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <div className="absolute inset-0 bg-ink-600/45 backdrop-blur-sm" />
            <motion.div
              key={active}
              className="relative w-[min(90vw,400px)]"
              initial={{ opacity: 0, y: 40, scale: 0.9, rotate: 2 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 1.5 }}
              exit={{ opacity: 0, y: 30, scale: 0.92 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ filter: "drop-shadow(0 26px 50px rgba(90,64,51,0.4))" }}
            >
              <div className="rounded-[4px] bg-[#fbf7ec] p-3 pb-5" style={{ border: "1px solid rgba(180,165,138,0.5)" }}>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={memoryPlaces[active].photo}
                    alt={memoryPlaces[active].name}
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ filter: "sepia(0.16) saturate(1.04)" }}
                  />
                </div>
                <p className="mt-3 text-center font-script text-2xl text-wine-500">{memoryPlaces[active].name}</p>
                <p className="mt-1 px-2 text-center font-body text-sm leading-relaxed text-forest-700/85">
                  {memoryPlaces[active].caption}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
