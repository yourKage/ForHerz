"use client";

import dynamic from "next/dynamic";

const Experience = dynamic(() => import("./Experience"), {
  ssr: false,
  loading: () => (
    <div
      className="flex h-[100dvh] w-full items-center justify-center"
      style={{ background: "radial-gradient(120% 100% at 50% 40%, #fbf3e2 0%, #f2e6cf 100%)" }}
    >
      <span className="font-script text-3xl text-rose-500/70">a moment…</span>
    </div>
  ),
});

export default function ClientExperience() {
  return <Experience />;
}
