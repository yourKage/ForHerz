"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { experienceContent } from "@/lib/content";
import { mulberry32, rand } from "@/lib/random";
import FlowerHead from "./art/FlowerHead";
import type { FlowerSpecies } from "./art/FlowerHead";

interface FinalQuestionProps {
  reduced?: boolean;
  onSfx?: (kind: "wax" | "paper" | "petal" | "chime") => void;
}

const BURST_FLOWERS: FlowerSpecies[] = ["rose", "peony", "cosmos", "dahlia", "hydrangea", "anemone", "lily", "iris"];

interface Petal {
  id: number;
  x: number;
  delay: number;
  dur: number;
  size: number;
  drift: number;
  species: FlowerSpecies;
  rotate: number;
}

function makePetals(n: number): Petal[] {
  const rng = mulberry32(7788);
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: rand(rng, 0, 100),
    delay: rand(rng, 0, 1.6),
    dur: rand(rng, 3.5, 6),
    size: rand(rng, 18, 40),
    drift: rand(rng, -60, 60),
    species: BURST_FLOWERS[i % BURST_FLOWERS.length],
    rotate: rand(rng, -40, 40),
  }));
}

export default function FinalQuestion({ reduced = false, onSfx }: FinalQuestionProps) {
  const { finalQuestion } = experienceContent;
  const [said, setSaid] = useState(false);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [dodges, setDodges] = useState(0);
  const petals = useRef(makePetals(reduced ? 0 : 28));

  const dodge = () => {
    // teleport the No button somewhere nearby but out of reach — clamped to the
    // viewport so it never flies off a small phone screen.
    const vw = typeof window !== "undefined" ? window.innerWidth : 400;
    const rangeX = Math.min(130, vw * 0.26);
    const x = (Math.random() - 0.5) * 2 * rangeX;
    const y = (Math.random() - 0.5) * 130;
    setNoPos({ x, y });
    setDodges((d) => d + 1);
  };

  const sayYes = () => {
    onSfx?.("petal");
    setSaid(true);
  };

  const noLabels = [finalQuestion.no, "wait—", "nope 😅", "can't catch me", "try again", "no?"];

  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden py-20 text-center">
      {/* petal burst on yes */}
      <AnimatePresence>
        {said && !reduced && (
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
            {petals.current.map((p) => (
              <motion.div
                key={p.id}
                className="absolute top-[-8%]"
                style={{ left: `${p.x}%` }}
                initial={{ y: -40, opacity: 0, rotate: p.rotate }}
                animate={{ y: "110vh", x: p.drift, opacity: [0, 1, 1, 0.7], rotate: p.rotate + 180 }}
                transition={{ duration: p.dur, delay: p.delay, ease: "easeIn", repeat: Infinity }}
              >
                <FlowerHead species={p.species} seed={p.id + 2} size={p.size} painterly />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-[620px]">
        <AnimatePresence mode="wait">
          {!said ? (
            <motion.div
              key="asking"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.9 }}
            >
              <div className="mb-6 flex justify-center">
                <FlowerHead species="peony" seed={21} size={72} painterly />
              </div>
              <p className="font-serif text-lg italic text-forest-500/80">{finalQuestion.prompt}</p>
              <h2 className="mx-auto mt-2 max-w-lg font-script text-5xl leading-tight text-wine-500 sm:text-6xl">
                {finalQuestion.question}
              </h2>

              <div className="relative mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <motion.button
                  type="button"
                  onClick={sayYes}
                  whileHover={reduced ? undefined : { scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="rounded-full px-10 py-4 font-body text-lg tracking-wide text-cream-50 shadow-glass"
                  style={{ background: "linear-gradient(135deg,#7a3450,#5d263b)" }}
                >
                  {finalQuestion.yes}
                </motion.button>

                <motion.button
                  type="button"
                  onMouseEnter={reduced ? undefined : dodge}
                  onClick={reduced ? sayYes : dodge}
                  animate={{ x: noPos.x, y: noPos.y }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className="rounded-full border border-forest-500/40 px-7 py-4 font-body text-lg text-forest-500"
                  style={{ background: "rgba(255,255,255,0.4)" }}
                  aria-label="No"
                >
                  {noLabels[Math.min(dodges, noLabels.length - 1)]}
                </motion.button>
              </div>

              {dodges >= 2 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 font-serif text-sm italic text-forest-500/70"
                >
                  (the “no” button is a little shy… just say yes 🤍)
                </motion.p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="answered"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-6 flex justify-center gap-2">
                <FlowerHead species="rose" seed={3} size={58} painterly />
                <FlowerHead species="dahlia" seed={9} size={64} painterly />
                <FlowerHead species="cosmos" seed={14} size={54} painterly />
              </div>
              <h2 className="font-script text-6xl text-wine-500 sm:text-7xl">yes.</h2>
              <p className="mx-auto mt-5 max-w-md font-body text-xl leading-relaxed text-forest-700/90">
                {finalQuestion.celebrate}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
