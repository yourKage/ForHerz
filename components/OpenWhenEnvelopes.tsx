"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { experienceContent } from "@/lib/content";
import CrumplePaper from "./CrumplePaper";
import FlowerHead from "./art/FlowerHead";

interface OpenWhenEnvelopesProps {
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

/** A tiny sealed kraft envelope card. */
function MiniEnvelope({
  label,
  index,
  opened,
  onClick,
  reduced,
}: {
  label: string;
  index: number;
  opened: boolean;
  onClick: () => void;
  reduced?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      variants={ink}
      whileHover={reduced ? undefined : { y: -6, rotate: index % 2 ? 1.5 : -1.5 }}
      whileTap={{ scale: 0.96 }}
      className="group relative flex aspect-[4/3] w-full flex-col items-center justify-center rounded-[8px] p-4 text-center focus-visible:outline-none"
      style={{ filter: "drop-shadow(0 10px 20px rgba(90,64,51,0.22))" }}
      aria-label={`Open when ${label}`}
    >
      {/* envelope body */}
      <span
        className="absolute inset-0 rounded-[8px]"
        style={{ background: "linear-gradient(160deg,#e9d7b3 0%,#dcc79a 60%,#cdb582 100%)" }}
      />
      {/* flap */}
      <span
        className="absolute inset-x-0 top-0 h-1/2 origin-top rounded-t-[8px]"
        style={{
          background: "linear-gradient(180deg,#efe0c1 0%,#e2cfa4 100%)",
          clipPath: "polygon(0 0, 100% 0, 50% 92%)",
          boxShadow: "inset 0 -2px 6px rgba(90,64,51,0.18)",
          opacity: opened ? 0 : 1,
          transition: "opacity .3s",
        }}
      />
      {/* wax seal */}
      <span
        className="absolute left-1/2 top-[46%] z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full text-[0.6rem] text-cream-100"
        style={{
          background: "radial-gradient(circle at 35% 30%, #7a3450, #5d263b 70%)",
          boxShadow: "0 2px 5px rgba(90,64,51,0.4)",
          opacity: opened ? 0 : 1,
          transition: "opacity .3s",
        }}
        aria-hidden
      >
        ♡
      </span>
      {/* label */}
      <span className="relative z-20 mt-6 font-body text-[0.68rem] uppercase tracking-[0.14em] text-ink-500/60">
        open when
      </span>
      <span className="relative z-20 font-script text-xl leading-tight text-wine-500">{label}</span>
      {opened && (
        <span className="relative z-20 mt-1 font-serif text-[0.7rem] italic text-forest-500/70">
          opened ✓
        </span>
      )}
    </motion.button>
  );
}

export default function OpenWhenEnvelopes({ reduced = false, onSfx }: OpenWhenEnvelopesProps) {
  const { openWhenIntro, openWhenSubtitle, openWhenNotes } = experienceContent;
  const [active, setActive] = useState<number | null>(null);
  const [opened, setOpened] = useState<Set<number>>(new Set());

  const open = (i: number) => {
    onSfx?.("wax");
    setActive(i);
    setOpened((prev) => new Set(prev).add(i));
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
          {openWhenIntro}
        </motion.h2>
        <motion.p
          variants={ink}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto mt-2 max-w-md font-serif text-base italic text-forest-500/80"
        >
          {openWhenSubtitle}
        </motion.p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        transition={{ staggerChildren: 0.08 }}
        className="mx-auto grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3"
      >
        {openWhenNotes.map((n, i) => (
          <MiniEnvelope
            key={n.label}
            label={n.label}
            index={i}
            opened={opened.has(i)}
            onClick={() => open(i)}
            reduced={reduced}
          />
        ))}
      </motion.div>

      {/* opened note overlay */}
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
              className="relative w-full max-w-[480px]"
              initial={{ opacity: 0, y: 40, scale: 0.9, rotate: -1.5 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: -1 }}
              exit={{ opacity: 0, y: 30, scale: 0.92 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: "drop-shadow(0 26px 50px rgba(90,64,51,0.4))" }}
              onClick={(e) => e.stopPropagation()}
            >
              <CrumplePaper seed={active + 60} tone="cream" rounded="rounded-[12px]">
                <div className="px-8 py-10 text-center">
                  <div className="mb-4 flex justify-center">
                    <FlowerHead species="cosmos" seed={active + 12} size={48} painterly />
                  </div>
                  <p className="font-body text-[0.7rem] uppercase tracking-[0.28em] text-forest-500/60">
                    open when
                  </p>
                  <p className="mb-5 mt-1 font-script text-3xl text-wine-500">
                    {openWhenNotes[active].label}
                  </p>
                  <p className="text-left font-body text-[1.08rem] leading-relaxed text-forest-700/90">
                    {openWhenNotes[active].note}
                  </p>
                  <button
                    type="button"
                    onClick={() => setActive(null)}
                    className="mt-7 rounded-full border border-forest-500/30 px-6 py-2 font-serif text-sm italic text-forest-500 transition hover:bg-forest-500/10"
                  >
                    seal it back
                  </button>
                </div>
              </CrumplePaper>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
