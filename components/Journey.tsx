"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { mulberry32, rand } from "@/lib/random";
import { useViewportWidth } from "@/lib/hooks";
import { experienceContent } from "@/lib/content";
import { galleryItems, letterNotes } from "@/lib/gallery";
import ScratchCard from "./ScratchCard";
import CrumpledLetter from "./CrumpledLetter";
import CrumplePaper from "./CrumplePaper";
import VoiceNote from "./VoiceNote";
import SketchbookBg from "./SketchbookBg";
import FloatingDecorations from "./FloatingDecorations";
import Timeline from "./Timeline";
import OpenWhenEnvelopes from "./OpenWhenEnvelopes";
import ReasonsDeck from "./ReasonsDeck";
import FinalQuestion from "./FinalQuestion";
import Countdown from "./Countdown";
import MemoryMap from "./MemoryMap";
import Handwriting from "./Handwriting";
import Bouquet from "./Bouquet";
import Keepsake from "./Keepsake";
import { Sparkle } from "./art/Ornaments";
import FlowerHead from "./art/FlowerHead";

const ink = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

interface JourneyProps {
  reduced?: boolean;
  onReachFinale?: () => void;
  density?: number;
  onSfx?: (kind: "wax" | "paper" | "petal" | "chime") => void;
  onVoiceActiveChange?: (active: boolean) => void;
}

// One messy scrapbook item: a photo pinned at an angle, or a crumpled note.
type Piece =
  | { kind: "photo"; idx: number; width: number; rotate: number; mt: number; tx: number; z: number; tape: boolean; tapeRot: number }
  | { kind: "note"; text: string; rotate: number };

function buildPieces(count: number, notes: string[]): Piece[] {
  const rng = mulberry32(9145);
  const widths = [46, 40, 52, 44, 48, 42];
  const pieces: Piece[] = [];
  let ni = 0;
  for (let i = 0; i < count; i++) {
    pieces.push({
      kind: "photo",
      idx: i,
      width: widths[i % widths.length] + rand(rng, -2, 2),
      rotate: rand(rng, -8, 8),
      mt: rand(rng, -18, 6),
      tx: rand(rng, -20, 20),
      z: 5 + i,
      tape: rng() > 0.4,
      tapeRot: rand(rng, -16, 16),
    });
    // tuck a crumpled note in every so often
    if ((i + 1) % 5 === 0 && ni < notes.length) {
      pieces.push({ kind: "note", text: notes[ni % notes.length], rotate: ni % 2 ? 3 : -3 });
      ni++;
    }
  }
  return pieces;
}

export default function Journey({ reduced = false, onReachFinale, density = 1, onSfx, onVoiceActiveChange }: JourneyProps) {
  const {
    giftFrom, giftTo,
    smallLetterGreeting, smallLetterBody,
    galleryIntro, gallerySubtitle,
    bigLetterTitle, bigLetterGreeting, bigLetterParagraphs, bigLetterSignoff, bigLetterSignature,
    outroTitle, outroLine,
  } = experienceContent;

  const pieces = useMemo(() => buildPieces(galleryItems.length, letterNotes), []);
  const vw = useViewportWidth();
  const isMobile = vw < 640;

  return (
    <motion.div
      className="fancy-scroll absolute inset-0 z-30 overflow-y-auto overflow-x-hidden"
      style={{ background: "#f5eeda" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="fixed inset-0 -z-10">
        <SketchbookBg />
      </div>
      <FloatingDecorations reduced={reduced} density={density * 0.35} />

      <div className="relative mx-auto max-w-3xl pb-40 pl-12 pr-5 sm:pl-16 sm:pr-6">
        {/* ---- header ---- */}
        <section className="flex min-h-[78vh] flex-col items-center justify-center text-center">
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="font-body text-xs uppercase tracking-[0.4em] text-forest-500/70">
            a little gift
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.6, delay: 0.2 }} className="mt-2 font-script text-[clamp(3rem,15vw,4.5rem)] leading-tight text-wine-500 sm:text-8xl">
            For {giftTo}
          </motion.h1>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, delay: 0.6 }} className="mt-6">
            <FlowerHead species="peony" seed={8} size={78} painterly alive={!reduced} />
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, delay: 0.9 }} className="mt-5 font-script text-2xl text-forest-500">
            from {giftFrom}
          </motion.p>
          <motion.div className="mt-14 flex flex-col items-center gap-1 text-forest-500/70" animate={reduced ? undefined : { y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <span className="font-serif text-sm italic">turn the page</span>
            <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M12 5 v14 M6 13 l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </section>

        {/* ---- little opening note on crumpled paper ---- */}
        <section className="flex flex-col items-center pb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -1.6 }}
            whileInView={{ opacity: 1, y: 0, rotate: -1.2 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[520px]"
            style={{ filter: "drop-shadow(0 18px 34px rgba(90,64,51,0.28))" }}
          >
            <CrumplePaper seed={2} tone="cream" rounded="rounded-[10px]">
              <div className="px-9 py-12">
                <p className="font-script text-4xl text-wine-500">{smallLetterGreeting}</p>
                <div className="mx-auto mt-4 h-px w-16 bg-forest-500/40" />
                <div className="mt-5 space-y-4">
                  {smallLetterBody.map((line, i) => (
                    <p key={i} className="font-body text-lg leading-relaxed text-forest-700/85">{line}</p>
                  ))}
                </div>
              </div>
            </CrumplePaper>
          </motion.div>
        </section>

        {/* ---- countdown ---- */}
        <Countdown reduced={reduced} />

        {/* ---- Our Story timeline ---- */}
        <Timeline reduced={reduced} />

        {/* ---- memory map ---- */}
        <MemoryMap reduced={reduced} onSfx={onSfx} />

        {/* ---- gallery intro ---- */}
        <section className="py-10 text-center">
          <motion.h2 variants={ink} initial="hidden" whileInView="show" viewport={{ once: true }} className="font-script text-5xl text-wine-500">{galleryIntro}</motion.h2>
          <motion.p variants={ink} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-2 font-serif text-base italic text-forest-500/80">{gallerySubtitle}</motion.p>
        </section>

        {/* ---- photo scrapbook: clean stack on phones, messy scatter on desktop ---- */}
        {isMobile ? (
          <section className="flex flex-col items-center gap-10">
            {pieces.map((p, i) => {
              if (p.kind === "note") {
                return (
                  <div key={`n${i}`} className="w-[86%]">
                    <CrumpledLetter text={p.text} seed={i + 30} rotate={p.rotate} reduced={reduced} compact />
                  </div>
                );
              }
              const item = galleryItems[p.idx];
              const tilt = ((p.idx % 2 === 0 ? 1 : -1) * (2 + (p.idx % 3))) * 0.8;
              return (
                <div key={item.src} className="relative w-[78%]" style={{ transform: `rotate(${tilt}deg)` }}>
                  {p.tape && (
                    <div
                      className="absolute left-1/2 top-[-9px] z-10 h-4 w-14 -translate-x-1/2"
                      style={{ transform: `translateX(-50%) rotate(${p.tapeRot}deg)`, background: "linear-gradient(180deg, rgba(233,220,180,0.6), rgba(210,190,140,0.5))", boxShadow: "0 1px 3px rgba(90,64,51,0.2)", opacity: 0.85 }}
                    />
                  )}
                  <ScratchCard item={item} index={p.idx} reduced={reduced} onSfx={onSfx} />
                </div>
              );
            })}
          </section>
        ) : (
          <section className="flex flex-wrap items-start justify-center gap-x-3 gap-y-3">
            {pieces.map((p, i) => {
              if (p.kind === "note") {
                return (
                  <div key={`n${i}`} className="my-6 w-full">
                    <div className="mx-auto w-full max-w-[380px]">
                      <CrumpledLetter text={p.text} seed={i + 30} rotate={p.rotate} reduced={reduced} compact />
                    </div>
                  </div>
                );
              }
              const item = galleryItems[p.idx];
              return (
                <div
                  key={item.src}
                  className="relative"
                  style={{ width: `${p.width}%`, marginTop: p.mt, transform: `translateX(${p.tx}px) rotate(${p.rotate}deg)`, zIndex: p.z }}
                >
                  {p.tape && (
                    <div
                      className="absolute left-1/2 top-[-10px] z-10 h-5 w-16 -translate-x-1/2"
                      style={{ transform: `translateX(-50%) rotate(${p.tapeRot}deg)`, background: "linear-gradient(180deg, rgba(233,220,180,0.6), rgba(210,190,140,0.5))", boxShadow: "0 1px 3px rgba(90,64,51,0.2)", opacity: 0.85 }}
                    />
                  )}
                  <ScratchCard item={item} index={p.idx} reduced={reduced} onSfx={onSfx} />
                </div>
              );
            })}
          </section>
        )}

        {/* ---- "open when…" envelopes ---- */}
        <OpenWhenEnvelopes reduced={reduced} onSfx={onSfx} />

        {/* ---- reasons I love you deck ---- */}
        <ReasonsDeck reduced={reduced} onSfx={onSfx} />

        {/* ---- the big letter on crumpled paper ---- */}
        <motion.section className="mt-28 flex justify-center" onViewportEnter={() => onReachFinale?.()} viewport={{ once: true, amount: 0.15 }}>
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 1 }}
            className="w-full max-w-[720px]"
            style={{ filter: "drop-shadow(0 26px 50px rgba(90,64,51,0.3))" }}
          >
            <CrumplePaper seed={17} tone="cream" rounded="rounded-[14px]">
              <div className="px-7 py-12 sm:px-16 sm:py-20">
                <div className="mb-6 flex justify-center gap-2">
                  <FlowerHead species="rose" seed={31} size={54} painterly alive={!reduced} />
                  <FlowerHead species="hydrangea" seed={5} size={48} painterly alive={!reduced} />
                  <FlowerHead species="daisy" seed={4} size={44} painterly alive={!reduced} />
                </div>
                <motion.p variants={ink} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center font-body text-xs uppercase tracking-[0.3em] text-forest-500/60">
                  {bigLetterTitle}
                </motion.p>
                <motion.p variants={ink} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-9 mt-3 text-center font-script text-5xl text-wine-500 sm:text-6xl">
                  {bigLetterGreeting}
                </motion.p>
                <Handwriting
                  lines={bigLetterParagraphs}
                  reduced={reduced}
                  className="space-y-7"
                  lineClassName="font-body text-[1.2rem] leading-[1.9] text-forest-700/90 sm:text-[1.35rem]"
                />
                <motion.div variants={ink} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-12 text-right">
                  <p className="font-body text-lg italic text-forest-500/80">{bigLetterSignoff}</p>
                  <p className="mt-1 font-script text-4xl text-wine-500">{bigLetterSignature}</p>
                </motion.div>
              </div>
            </CrumplePaper>
          </motion.div>
        </motion.section>

        {/* ---- voice note ---- */}
        <section className="mt-16 flex justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-full max-w-[460px]">
            <VoiceNote reduced={reduced} onActiveChange={onVoiceActiveChange} />
          </motion.div>
        </section>

        {/* ---- the final question ---- */}
        <FinalQuestion reduced={reduced} onSfx={onSfx} />

        {/* ---- keepsake (save / reply) ---- */}
        <Keepsake reduced={reduced} onSfx={onSfx} />

        {/* ---- outro ---- */}
        <section className="mt-28 flex min-h-[70vh] flex-col items-center justify-center text-center">
          {!reduced &&
            Array.from({ length: 10 }).map((_, i) => (
              <motion.div key={i} className="absolute" style={{ left: `${8 + i * 9}%` }} initial={{ opacity: 0 }} whileInView={{ opacity: [0, 1, 0], y: [20, -30], scale: [0.4, 1, 0.5] }} viewport={{ once: false }} transition={{ duration: 4 + i * 0.3, repeat: Infinity, delay: i * 0.25 }}>
                <Sparkle size={14} color="#6f855b" />
              </motion.div>
            ))}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.4 }}>
            <div className="mb-4 flex justify-center">
              <Bouquet reduced={reduced} />
            </div>
            <h2 className="font-script text-5xl text-wine-500 sm:text-6xl">{outroTitle}</h2>
            <p className="mt-4 font-serif text-xl italic text-forest-500/80">{outroLine}</p>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
}
