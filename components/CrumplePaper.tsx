"use client";

import type { CSSProperties, ReactNode } from "react";

interface CrumplePaperProps {
  children?: ReactNode;
  className?: string;
  seed?: number;
  tone?: "cream" | "aged";
  rounded?: string;
  style?: CSSProperties;
}

/**
 * A surface that actually looks like a crumpled sheet of paper.
 * feTurbulence generates a noise field; feDiffuseLighting turns it into a lit,
 * bumpy surface (the crumples). We blend that over warm paper with soft-light,
 * and lay a few sharp fold creases on top.
 */
export default function CrumplePaper({
  children,
  className = "",
  seed = 1,
  tone = "cream",
  rounded = "rounded-[8px]",
  style,
}: CrumplePaperProps) {
  const id = `crumple-${seed}`;
  const base =
    tone === "aged"
      ? "linear-gradient(150deg,#f3e7c9 0%,#e9d9b4 55%,#ddc999 100%)"
      : "linear-gradient(150deg,#fbf6ea 0%,#f4ead2 55%,#ece0c4 100%)";

  return (
    <div
      className={`relative overflow-hidden ${rounded} ${className}`}
      style={{ background: base, ...style }}
    >
      {/* crumple shading */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" aria-hidden>
        <defs>
          <filter id={id} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.016" numOctaves={5} seed={seed} result="noise" />
            <feDiffuseLighting in="noise" lightingColor="#fffaf0" surfaceScale={2.6} diffuseConstant={1.05} result="light">
              <feDistantLight azimuth={235} elevation={58} />
            </feDiffuseLighting>
            <feColorMatrix in="light" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.9 0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter={`url(#${id})`} style={{ mixBlendMode: "soft-light" }} />
        <rect width="100%" height="100%" filter={`url(#${id})`} style={{ mixBlendMode: "multiply", opacity: 0.28 }} />
      </svg>

      {/* a couple of sharp fold creases */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, transparent 32%, rgba(90,64,51,0.10) 33%, transparent 34%), linear-gradient(200deg, transparent 58%, rgba(255,255,255,0.35) 59%, transparent 60%)",
          mixBlendMode: "overlay",
        }}
      />

      {/* soft edge darkening like a real sheet */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 40px rgba(90,64,51,0.14)" }}
      />

      <div className="relative">{children}</div>
    </div>
  );
}
