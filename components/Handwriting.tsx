"use client";

import { motion } from "framer-motion";

interface HandwritingProps {
  lines: readonly string[];
  reduced?: boolean;
  className?: string;
  lineClassName?: string;
  /** stagger between words, in seconds */
  speed?: number;
}

/**
 * Ink-writes-itself effect done reliably: each line reveals word-by-word,
 * left to right, when it scrolls into view. It only animates opacity + a tiny
 * settle, so the text can never get stuck hidden (unlike a clip-path wipe).
 */
export default function Handwriting({
  lines,
  reduced = false,
  className = "",
  lineClassName = "",
  speed = 0.045,
}: HandwritingProps) {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduced ? 0 : speed } },
  };
  const word = {
    hidden: reduced ? { opacity: 0 } : { opacity: 0, y: "0.2em", filter: "blur(2px)" },
    show: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: reduced ? 0.3 : 0.34, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
  };

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <motion.p
          key={i}
          className={lineClassName}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {line.split(" ").map((w, wi) => (
            <motion.span key={wi} variants={word} className="inline-block whitespace-pre">
              {w + " "}
            </motion.span>
          ))}
        </motion.p>
      ))}
    </div>
  );
}
