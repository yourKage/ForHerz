"use client";

import { motion } from "framer-motion";
import CrumplePaper from "./CrumplePaper";
import FlowerHead from "./art/FlowerHead";

interface CrumpledLetterProps {
  text: string;
  seed?: number;
  rotate?: number;
  reduced?: boolean;
  compact?: boolean;
}

/** A short handwritten line on a genuinely crumpled sheet of paper. */
export default function CrumpledLetter({
  text,
  seed = 1,
  rotate = -2,
  reduced = false,
  compact = false,
}: CrumpledLetterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: rotate * 2, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotate, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? undefined : { rotate: rotate * 0.4, scale: 1.02 }}
      className="mx-auto w-full max-w-[420px]"
      style={{ filter: "drop-shadow(0 16px 30px rgba(90,64,51,0.3))" }}
    >
      <CrumplePaper seed={seed} tone="cream" rounded="rounded-[6px]">
        <div className={`flex flex-col items-center text-center ${compact ? "px-6 py-8" : "px-9 py-12"}`}>
          <div className="mb-4 opacity-95">
            <FlowerHead species="cosmos" seed={seed + 3} size={compact ? 40 : 52} painterly />
          </div>
          <p className={`font-script leading-snug text-wine-500 ${compact ? "text-2xl" : "text-3xl"}`}>
            {text}
          </p>
          <div className="mt-4 h-px w-12 bg-forest-500/40" />
        </div>
      </CrumplePaper>
    </motion.div>
  );
}
