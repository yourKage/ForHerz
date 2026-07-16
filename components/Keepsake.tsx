"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { experienceContent } from "@/lib/content";
import CrumplePaper from "./CrumplePaper";
import FlowerHead from "./art/FlowerHead";

interface KeepsakeProps {
  reduced?: boolean;
  onSfx?: (kind: "wax" | "paper" | "petal" | "chime") => void;
}

export default function Keepsake({ reduced = false, onSfx }: KeepsakeProps) {
  const { keepsake } = experienceContent;
  const [saved, setSaved] = useState(false);
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const save = () => {
    onSfx?.("chime");
    setSaved(true);
  };

  const send = async () => {
    if (!text.trim()) return;
    onSfx?.("chime");
    // If an email is configured, open the mail composer; otherwise copy it.
    if (keepsake.replyTo) {
      const subject = encodeURIComponent("a reply, from me to you 🤍");
      const body = encodeURIComponent(text);
      window.location.href = `mailto:${keepsake.replyTo}?subject=${subject}&body=${body}`;
    } else {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        /* clipboard optional */
      }
    }
    setSent(true);
  };

  return (
    <section className="flex flex-col items-center py-14">
      <motion.div
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="w-[min(92vw,480px)]"
        style={{ filter: "drop-shadow(0 20px 40px rgba(90,64,51,0.26))" }}
      >
        <CrumplePaper seed={95} tone="cream" rounded="rounded-[14px]">
          <div className="px-8 py-10 text-center">
            <div className="mb-4 flex justify-center">
              <FlowerHead species="hydrangea" seed={7} size={54} painterly />
            </div>
            <h2 className="font-script text-4xl text-wine-500">{keepsake.title}</h2>
            <div className="mx-auto mt-3 h-px w-14 bg-forest-500/40" />

            <AnimatePresence mode="wait">
              {!replying ? (
                <motion.div
                  key="actions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-7 flex flex-col items-center gap-3"
                >
                  {/* save forever */}
                  {saved ? (
                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-body text-base leading-relaxed text-forest-700/90"
                    >
                      {keepsake.savedNote}
                    </motion.p>
                  ) : (
                    <button
                      type="button"
                      onClick={save}
                      className="w-full rounded-full px-8 py-3 font-body text-base tracking-wide text-cream-50 shadow-glass transition hover:scale-[1.02]"
                      style={{ background: "linear-gradient(135deg,#2f6b3e,#163D22)" }}
                    >
                      {keepsake.saveLabel}
                    </button>
                  )}

                  {/* open reply composer */}
                  <button
                    type="button"
                    onClick={() => setReplying(true)}
                    className="w-full rounded-full border border-wine-500/40 px-8 py-3 font-body text-base text-wine-500 transition hover:bg-wine-500/5"
                  >
                    {keepsake.replyLabel}
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="composer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-6"
                >
                  {sent ? (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-6 font-script text-2xl text-wine-500"
                    >
                      {keepsake.thanks}
                    </motion.p>
                  ) : (
                    <>
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={keepsake.replyPlaceholder}
                        rows={4}
                        className="w-full resize-none rounded-[10px] border border-forest-500/25 bg-cream-50/70 p-4 font-body text-base text-forest-700 placeholder:text-forest-500/40 focus:border-forest-500/50 focus:outline-none"
                      />
                      <div className="mt-3 flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => setReplying(false)}
                          className="rounded-full px-5 py-2 font-serif text-sm italic text-forest-500/70 transition hover:text-forest-600"
                        >
                          never mind
                        </button>
                        <button
                          type="button"
                          onClick={send}
                          disabled={!text.trim()}
                          className="rounded-full px-7 py-2 font-body text-sm text-cream-50 transition enabled:hover:scale-[1.03] disabled:opacity-40"
                          style={{ background: "linear-gradient(135deg,#7a3450,#5d263b)" }}
                        >
                          {keepsake.replyButton}
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CrumplePaper>
      </motion.div>
    </section>
  );
}
