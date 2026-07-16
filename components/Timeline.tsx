"use client";

import { motion } from "framer-motion";
import { storyChapters, storyTitle, storySubtitle } from "@/lib/story";
import { useViewportWidth } from "@/lib/hooks";
import CrumplePaper from "./CrumplePaper";
import FlowerHead from "./art/FlowerHead";

interface TimelineProps {
  reduced?: boolean;
}

const card = {
  hidden: { opacity: 0, y: 26, filter: "blur(5px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/**
 * "Our Story" — a vertical timeline of chapters, drawn from the real writing.
 * A vine-like thread runs down the middle (left rail on mobile); each chapter
 * is a flower node with a crumpled-paper card, alternating sides on desktop.
 */
export default function Timeline({ reduced = false }: TimelineProps) {
  const vw = useViewportWidth();
  const isMobile = vw < 768;

  return (
    <section className="relative py-16">
      {/* intro */}
      <div className="mb-14 text-center">
        <motion.h2
          variants={card}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="font-script text-6xl text-wine-500 sm:text-7xl"
        >
          {storyTitle}
        </motion.h2>
        <motion.p
          variants={card}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto mt-3 max-w-md font-serif text-base italic text-forest-500/80"
        >
          {storySubtitle}
        </motion.p>
      </div>

      <div className="relative">
        {/* the thread */}
        <div
          className={`absolute top-0 bottom-0 w-[2px] ${isMobile ? "left-[26px]" : "left-1/2 -translate-x-1/2"}`}
          aria-hidden
        >
          <motion.div
            className="h-full w-full origin-top"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(111,133,91,0.55) 6%, rgba(111,133,91,0.55) 94%, transparent 100%)",
            }}
            initial={reduced ? undefined : { scaleY: 0 }}
            whileInView={reduced ? undefined : { scaleY: 1 }}
            viewport={{ once: true, amount: 0.05 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        </div>

        <ol className="relative space-y-14 sm:space-y-20">
          {storyChapters.map((ch, i) => {
            const left = !isMobile && i % 2 === 0;
            return (
              <li
                key={ch.kicker}
                className={`relative flex ${
                  isMobile
                    ? "pl-16"
                    : left
                    ? "justify-start pr-[52%]"
                    : "justify-end pl-[52%]"
                }`}
              >
                {/* flower node on the thread */}
                <motion.div
                  className={`absolute z-10 ${isMobile ? "left-[26px]" : "left-1/2"} top-2 -translate-x-1/2`}
                  initial={reduced ? undefined : { scale: 0, rotate: -30 }}
                  whileInView={reduced ? undefined : { scale: 1, rotate: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
                >
                  <div
                    className="rounded-full"
                    style={{ filter: "drop-shadow(0 4px 8px rgba(90,64,51,0.28))" }}
                  >
                    <FlowerHead species={ch.flower} seed={i * 7 + 3} size={ch.coming ? 46 : 40} painterly />
                  </div>
                </motion.div>

                {/* the chapter card */}
                <motion.div
                  variants={card}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="w-full max-w-[440px]"
                  style={{ filter: "drop-shadow(0 16px 30px rgba(90,64,51,0.24))" }}
                >
                  <CrumplePaper
                    seed={i + 40}
                    tone={ch.coming ? "aged" : "cream"}
                    rounded="rounded-[10px]"
                  >
                    <div className="px-7 py-8">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-body text-[0.7rem] uppercase tracking-[0.32em] text-forest-500/70">
                          {ch.kicker}
                        </span>
                        <span className="font-serif text-sm italic text-wine-400/80">{ch.period}</span>
                      </div>
                      <h3 className="mt-2 font-script text-3xl text-wine-500">{ch.title}</h3>
                      <div className="mt-3 h-px w-14 bg-forest-500/40" />
                      <p className="mt-4 font-body text-[1.02rem] leading-relaxed text-forest-700/90">
                        {ch.body}
                      </p>
                      {ch.coming && (
                        <motion.p
                          className="mt-5 font-serif text-sm italic text-forest-500/70"
                          animate={reduced ? undefined : { opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                        >
                          to be continued…
                        </motion.p>
                      )}
                    </div>
                  </CrumplePaper>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
