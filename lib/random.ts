// Deterministic, seedable pseudo-random generator.
// Using a seed keeps SSR and client renders identical (no hydration mismatch)
// while still giving every flower/petal its own "organic" variation.

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = () => number;

export function rand(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min);
}

export function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rand(rng, min, max + 1));
}

export function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

// Evenly distribute n items around a circle with slight jitter.
export function ring(
  rng: Rng,
  count: number,
  radius: number,
  jitter = 0,
): { x: number; y: number; angle: number }[] {
  const out = [];
  for (let i = 0; i < count; i++) {
    const base = (i / count) * Math.PI * 2 - Math.PI / 2;
    const a = base + rand(rng, -jitter, jitter);
    const r = radius + rand(rng, -jitter * radius, jitter * radius);
    out.push({ x: Math.cos(a) * r, y: Math.sin(a) * r, angle: a });
  }
  return out;
}
