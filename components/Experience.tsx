"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { getAudioEngine } from "@/lib/audio";
import { usePrefersReducedMotion, useMounted } from "@/lib/hooks";
import type { ExperiencePhase } from "@/lib/content";
import LockScreen from "./LockScreen";
import PortalBloom from "./PortalBloom";
import VintageEnvelope from "./VintageEnvelope";
import Journey from "./Journey";
import MusicPlayer from "./MusicPlayer";
import PetalCursor from "./PetalCursor";

export default function Experience() {
  const reduced = usePrefersReducedMotion();
  const mounted = useMounted();
  const [phase, setPhase] = useState<ExperiencePhase>("lock");
  const [muted, setMuted] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [voicePlaying, setVoicePlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    document.body.classList.add("experience-locked");
    return () => document.body.classList.remove("experience-locked");
  }, []);

  const initAudio = useCallback(async () => {
    const engine = getAudioEngine();
    await engine.init();
    engine.startAmbience();
  }, []);

  const sfx = useCallback((kind: "wax" | "paper" | "petal" | "chime") => {
    const engine = getAudioEngine();
    if (kind === "wax") engine.wax();
    else if (kind === "paper") engine.paper();
    else if (kind === "petal") engine.petal();
    else if (kind === "chime") engine.chime();
  }, []);

  // start the song once the journey begins; fade the wind/birds out under it
  useEffect(() => {
    if (phase === "journey") {
      setMusicOn(true);
      getAudioEngine().stopAmbience();
    }
  }, [phase]);

  const toggleMute = useCallback(() => {
    const engine = getAudioEngine();
    setMuted((m) => {
      engine.muteAll(!m);
      return !m;
    });
  }, []);

  const density = isMobile ? 0.55 : 1;

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-cream-100 font-body text-ink-500">
      {/* sound control (hidden on the lock screen) */}
      {phase !== "lock" && (
        <div
          className="absolute z-[80] flex gap-2"
          style={{
            top: "calc(env(safe-area-inset-top, 0px) + 0.875rem)",
            right: "calc(env(safe-area-inset-right, 0px) + 0.875rem)",
          }}
        >
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/30 text-ink-500 shadow-glass backdrop-blur-md transition hover:scale-105"
          >
            {muted ? (
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3z" />
                <path d="M16 8l5 8M21 8l-5 8" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3z" />
                <path d="M16 8a5 5 0 010 8M18.5 6a8 8 0 010 12" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {phase === "lock" && (
          <LockScreen
            key="lock"
            reduced={reduced}
            onInteract={initAudio}
            onUnlock={() => setPhase("portal")}
          />
        )}

        {phase === "portal" && (
          <PortalBloom
            key="portal"
            reduced={reduced}
            onSfx={sfx}
            onFinished={() => setPhase("envelope")}
          />
        )}

        {phase === "envelope" && (
          <VintageEnvelope
            key="envelope"
            reduced={reduced}
            onSfx={sfx}
            onOpened={() => setPhase("journey")}
          />
        )}

        {phase === "journey" && mounted && (
          <Journey
            key="journey"
            reduced={reduced}
            density={density}
            onSfx={sfx}
            onVoiceActiveChange={setVoicePlaying}
            onReachFinale={() => setMusicOn(true)}
          />
        )}
      </AnimatePresence>

      {/* floating music player during the journey */}
      <AnimatePresence>
        {musicOn && phase === "journey" && (
          <motion.div
            key="music"
            className="pointer-events-none fixed left-1/2 z-[75] -translate-x-1/2 sm:left-auto sm:right-5 sm:translate-x-0"
            style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1.25rem)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <MusicPlayer reduced={reduced} autoStart muted={muted} paused={voicePlaying} />
          </motion.div>
        )}
      </AnimatePresence>
      {/* desktop petal cursor trail during the journey */}
      {phase === "journey" && !muted && <PetalCursor reduced={reduced} />}
    </main>
  );
}
