"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { experienceContent } from "@/lib/content";
import { useViewportWidth } from "@/lib/hooks";
import VintagePaperBg from "./VintagePaperBg";

interface VintageEnvelopeProps {
  reduced?: boolean;
  onSfx?: (kind: "wax" | "paper" | "petal" | "chime") => void;
  onOpened: () => void;
}

const W = 360;
const H = 250;
const FLAP_H = 150;

/** A delicate, symmetric wildflower sprig — bluebells, fern & tiny blossoms. */
function Sprig() {
  return (
    <g transform={`translate(${W / 2}, 150)`}>
      {/* fern frond (right) */}
      <path d="M2 -6 C 12 -26 12 -50 8 -74" fill="none" stroke="#8ba173" strokeWidth={2} strokeLinecap="round" />
      {Array.from({ length: 6 }).map((_, i) => {
        const t = i / 5;
        const x = 2 + 10 * Math.sin(t * 1.4) + 4;
        const y = -10 - t * 62;
        return <ellipse key={i} cx={x} cy={y} rx={5.5} ry={2.3} fill="#9db884" transform={`rotate(${-52 + i * 6} ${x} ${y})`} />;
      })}
      {/* bluebell stalk (left) */}
      <path d="M-2 -6 C -12 -24 -8 -48 -14 -70" fill="none" stroke="#8ba173" strokeWidth={2} strokeLinecap="round" />
      {[[-13, -66], [-11, -55], [-15, -44], [-9, -33], [-13, -22]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          <path d="M0 0 Q 4 3 3.2 8 Q 0 11 -3.2 8 Q -4 3 0 0 Z" fill="#b18ad6" stroke="#7d56ad" strokeWidth={0.5} />
        </g>
      ))}
      {/* tiny pink blossoms (centre) */}
      {[[0, -60], [5, -48], [-4, -40]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx={0} cy={-3.2} rx={1.7} ry={2.6} fill="#e39ab0" transform={`rotate(${a})`} />
          ))}
          <circle r={1.1} fill="#e3c04a" />
        </g>
      ))}
    </g>
  );
}

export default function VintageEnvelope({ reduced = false, onSfx, onOpened }: VintageEnvelopeProps) {
  const [open, setOpen] = useState(false);
  const vw = useViewportWidth();
  const scale = Math.min(1, (vw * 0.9) / W);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    onSfx?.("wax");
    setTimeout(() => onSfx?.("paper"), 500);
    setTimeout(onOpened, 1800);
  };

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <VintagePaperBg newspaper={false} tone="cream" />

      <div style={{ transform: `scale(${scale})`, transformOrigin: "center" }}>
      <motion.button
        type="button"
        onClick={handleOpen}
        aria-label={experienceContent.envelopePrompt}
        className="relative"
        style={{ width: W, height: H, perspective: 1600 }}
        animate={reduced || open ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* soft ground shadow */}
        <div
          className="absolute left-1/2 -z-10"
          style={{
            bottom: -6, width: W * 0.8, height: 30, transform: "translateX(-50%)",
            background: "radial-gradient(ellipse, rgba(90,64,51,0.22), transparent 70%)",
            filter: "blur(6px)",
          }}
        />

        {/* rising letter */}
        <motion.div
          className="absolute left-1/2 rounded-md bg-cream-50 paper-texture shadow-paper"
          style={{ width: W * 0.82, height: H * 1.05, x: "-50%", bottom: 14, zIndex: 2 }}
          initial={{ y: 24, opacity: 0 }}
          animate={open ? { y: -H * 0.62, opacity: 1 } : { y: 24, opacity: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex h-full flex-col items-center justify-center gap-2 p-5">
            <p className="font-script text-2xl text-rose-500">{experienceContent.smallLetterGreeting}</p>
            <div className="h-px w-14 bg-gold-300/70" />
            <p className="px-2 text-center font-body text-xs italic text-ink-400">opening…</p>
          </div>
        </motion.div>

        {/* SOLID envelope body (no gaps) with soft watercolour shading */}
        <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ zIndex: 3 }}>
          <defs>
            <linearGradient id="envBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ecd6aa" />
              <stop offset="100%" stopColor="#d7bd85" />
            </linearGradient>
            <radialGradient id="envBlot" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#e2c795" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#e2c795" stopOpacity={0} />
            </radialGradient>
            <clipPath id="envClip">
              <rect x={8} y={30} width={W - 16} height={H - 40} rx={16} />
            </clipPath>
          </defs>

          <g clipPath="url(#envClip)">
            <rect x={8} y={30} width={W - 16} height={H - 40} fill="url(#envBody)" />
            {/* watercolour mottling */}
            <ellipse cx={110} cy={90} rx={90} ry={60} fill="url(#envBlot)" />
            <ellipse cx={270} cy={170} rx={100} ry={70} fill="url(#envBlot)" />
            {/* pocket folds: side + bottom triangles for depth */}
            <path d={`M8 30 L${W / 2} 150 L8 ${H - 10} Z`} fill="#000" opacity={0.05} />
            <path d={`M${W - 8} 30 L${W / 2} 150 L${W - 8} ${H - 10} Z`} fill="#000" opacity={0.08} />
            <path d={`M8 ${H - 10} L${W / 2} 150 L${W - 8} ${H - 10} Z`} fill="#fff" opacity={0.12} />
          </g>
          <rect x={8} y={30} width={W - 16} height={H - 40} rx={16} fill="none" stroke="#b99a63" strokeWidth={1.4} />
        </svg>
        <div className="paper-texture pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply" style={{ zIndex: 4 }} />

        {/* the flap (with sprig + seal) lifts open */}
        <motion.div
          className="absolute left-0 top-0"
          style={{ width: W, height: FLAP_H, transformOrigin: "top center", transformStyle: "preserve-3d", zIndex: open ? 1 : 6 }}
          initial={{ rotateX: 0 }}
          animate={{ rotateX: open ? -164 : 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
        >
          <svg width={W} height={FLAP_H} viewBox={`0 0 ${W} ${FLAP_H}`} style={{ overflow: "visible" }}>
            <defs>
              <linearGradient id="envFlap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f0dcb0" />
                <stop offset="100%" stopColor="#e2ca92" />
              </linearGradient>
            </defs>
            {/* flap triangle with a softly rounded tip, base spans rounded top */}
            <path
              d={`M8 38 Q8 30 20 30 L${W - 20} 30 Q${W - 8} 30 ${W - 8} 38 L${W / 2 + 8} ${FLAP_H - 4} Q${W / 2} ${FLAP_H + 2} ${W / 2 - 8} ${FLAP_H - 4} Z`}
              fill="url(#envFlap)"
              stroke="#b99a63"
              strokeWidth={1.4}
            />
            {!open && <Sprig />}
          </svg>
          {/* lavender wax seal at the flap tip */}
          {!open && (
            <div className="absolute left-1/2 -translate-x-1/2" style={{ top: FLAP_H - 16 }}>
              <svg width={38} height={38} viewBox="-19 -19 38 38">
                <defs>
                  <radialGradient id="seal" cx="40%" cy="35%" r="70%">
                    <stop offset="0%" stopColor="#cbaee0" />
                    <stop offset="60%" stopColor="#a77fce" />
                    <stop offset="100%" stopColor="#7d56ad" />
                  </radialGradient>
                </defs>
                <circle r={15} fill="url(#seal)" stroke="#6a4a94" strokeWidth={1} />
                <ellipse cx={-4} cy={-5} rx={4} ry={2.6} fill="#fff" opacity={0.4} />
                <circle r={4} fill="#c9a8e0" opacity={0.7} />
              </svg>
            </div>
          )}
        </motion.div>
      </motion.button>
      </div>

      {!open && (
        <motion.p
          className="mt-14 font-script text-3xl text-rose-500"
          animate={reduced ? undefined : { opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.6, repeat: Infinity }}
        >
          {experienceContent.envelopePrompt}
        </motion.p>
      )}
    </motion.div>
  );
}
