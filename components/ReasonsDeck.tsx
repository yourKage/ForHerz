"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { experienceContent } from "@/lib/content";
import CrumplePaper from "./CrumplePaper";
import FlowerHead from "./art/FlowerHead";
import type { FlowerSpecies } from "./art/FlowerHead";

interface ReasonsDeckProps {
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

const DECK_FLOWERS: FlowerSpecies[] = ["rose", "peony", "hydrangea", "lily", "dahlia", "anemone", "iris", "cosmos"];

/**
 * "Reasons I love you" — a stack of cards. Tap the top card to advance;
 * the cards behind peek out, so it always looks like a real deck.
 */
export default function ReasonsDeck({ reduced = false, onSfx }: ReasonsDeckProps) {
  const { reasonsIntro, reasonsSubtitle, reasons } = experienceContent;
  const [index, setIndex] = useState(0);
  const total = reasons.length;

  const next = () => {
    onSfx?.("paper");
    setIndex((i) => (i + 1) % total);
  };

  return (
    <section className="py-14">
      <div className="mb-10 text-center">
        <motion.h2
          variants={ink}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="font-script text-5xl text-wine-500 sm:text-6xl"
        >
          {reasonsIntro}
        </motion.h2>
        <motion.p
          variants={ink}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto mt-2 max-w-md font-serif text-base italic text-forest-500/80"
        >
          {reasonsSubtitle}
        </motion.p>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative h-[340px] w-full max-w-[380px] sm:h-[300px]">
          {/* static cards peeking behind the deck */}
          {[2, 1].map((offset) => (
            <div
              key={offset}
              className="absolute inset-0"
              style={{
                transform: `translateY(${offset * 8}px) scale(${1 - offset * 0.04}) rotate(${offset % 2 ? 2 : -2}deg)`,
                zIndex: 1,
                filter: "drop-shadow(0 12px 22px rgba(90,64,51,0.18))",
                opacity: 0.9,
              }}
              aria-hidden
            >
              <CrumplePaper seed={offset + 70} tone="cream" rounded="rounded-[14px]">
                <div className="h-full min-h-[300px]" />
              </CrumplePaper>
            </div>
          ))}

          {/* the active, tappable card */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.button
              type="button"
              key={index}
              onClick={next}
              initial={{ opacity: 0, y: -30, rotate: -6, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, rotate: -1, scale: 1 }}
              exit={{ opacity: 0, x: 80, rotate: 10, transition: { duration: 0.35 } }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 z-10 block text-left focus-visible:outline-none"
              style={{ filter: "drop-shadow(0 18px 34px rgba(90,64,51,0.3))" }}
              aria-label={`Reason ${index + 1} of ${total}. Tap for the next.`}
            >
              <CrumplePaper seed={index + 80} tone="cream" rounded="rounded-[14px]">
                <div className="flex h-full min-h-[340px] flex-col justify-between px-6 py-7 sm:min-h-[300px] sm:px-8">
                  <div className="flex items-center justify-between">
                    <span className="font-body text-[0.7rem] uppercase tracking-[0.28em] text-forest-500/60">
                      reason № {index + 1}
                    </span>
                    <FlowerHead
                      species={DECK_FLOWERS[index % DECK_FLOWERS.length]}
                      seed={index + 5}
                      size={40}
                      painterly
                    />
                  </div>
                  <p className="font-script text-[1.55rem] leading-snug text-wine-500 sm:text-[1.9rem]">
                    {reasons[index]}
                  </p>
                  <span className="font-serif text-xs italic text-forest-500/60">
                    tap for the next one →
                  </span>
                </div>
              </CrumplePaper>
            </motion.button>
          </AnimatePresence>
        </div>

        {/* progress dots */}
        <div className="mt-6 flex max-w-[320px] flex-wrap justify-center gap-1.5">
          {reasons.map((_, i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full transition-colors"
              style={{ background: i === index ? "#5d263b" : "rgba(111,133,91,0.35)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
