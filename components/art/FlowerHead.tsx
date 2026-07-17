import { mulberry32, rand, type Rng } from "@/lib/random";

export type FlowerSpecies =
  | "cosmos"
  | "daisy"
  | "lily"
  | "hydrangea"
  | "sunflower"
  | "dahlia"
  | "peony"
  | "bluebell"
  | "rose"
  | "anemone"
  | "iris"
  | "zinnia"
  | "lotus"
  | "magnolia";

// Species used in the big flower burst (bluebell stays for the envelope sprig).
export const BOUQUET_SPECIES: FlowerSpecies[] = [
  "cosmos", "daisy", "lily", "hydrangea", "sunflower", "dahlia",
  "peony", "rose", "anemone", "iris", "zinnia", "lotus", "magnolia",
];

interface FlowerHeadProps {
  species: FlowerSpecies;
  seed?: number;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  /** hand-painted oil look (wobbly edges + canvas texture). Use sparingly. */
  painterly?: boolean;
  /** the flower gently breathes & sways from within (CSS, transform-only) */
  alive?: boolean;
}

interface ColorSet {
  light: string;
  mid: string;
  deep: string;
  center: string;
  centerDeep: string;
}

const COLORS: Record<FlowerSpecies, ColorSet> = {
  cosmos: { light: "#f4b3a6", mid: "#e07d6d", deep: "#c0503f", center: "#f0c27a", centerDeep: "#c98a3a" },
  daisy: { light: "#ffffff", mid: "#fbf4e6", deep: "#e9dcc0", center: "#f6c443", centerDeep: "#c98a2a" },
  lily: { light: "#fbe0c2", mid: "#f3b985", deep: "#e08a4e", center: "#e8c07a", centerDeep: "#9e5a2a" },
  hydrangea: { light: "#c9d2ec", mid: "#93a3d6", deep: "#6d7cc0", center: "#eef2fb", centerDeep: "#b7a7d8" },
  sunflower: { light: "#f6d873", mid: "#e9ad3c", deep: "#c9781f", center: "#7a4a22", centerDeep: "#4a2c14" },
  dahlia: { light: "#d6564f", mid: "#b23a3c", deep: "#8a2530", center: "#e0a24e", centerDeep: "#a05a1f" },
  peony: { light: "#f2a898", mid: "#e07d6a", deep: "#bd5647", center: "#f0bc86", centerDeep: "#c07a3a" },
  bluebell: { light: "#c7a8e0", mid: "#a17dc9", deep: "#7d56ad", center: "#e8ddf3", centerDeep: "#6a4a94" },
  rose: { light: "#e88f7e", mid: "#d16552", deep: "#a83f34", center: "#c9553f", centerDeep: "#8a2f28" },
  anemone: { light: "#f8ecec", mid: "#eecdd0", deep: "#d99fa6", center: "#2a2140", centerDeep: "#0e0a1c" },
  iris: { light: "#a98fd6", mid: "#7d5cc0", deep: "#5a3a9e", center: "#e3c04a", centerDeep: "#b8862a" },
  zinnia: { light: "#f0a95c", mid: "#e0812f", deep: "#b85f1c", center: "#7a4a22", centerDeep: "#4a2c14" },
  lotus: { light: "#fbeede", mid: "#f3d9c8", deep: "#e6b9a0", center: "#9bbf5a", centerDeep: "#5f7d33" },
  magnolia: { light: "#fbf3e9", mid: "#f2e2cf", deep: "#e6cdb0", center: "#d9a24e", centerDeep: "#a86a2a" },
};

// round to 2 decimals — identical string on server & client (no hydration drift)
const r2 = (n: number) => Math.round(n * 100) / 100;

function petal(len: number, width: number, tip: "round" | "point" | "notch"): string {
  const l = r2(len), w = r2(width);
  if (tip === "point") {
    return `M0 0 C ${w} ${r2(-l * 0.4)}, ${r2(w * 0.5)} ${-l}, 0 ${-l} C ${r2(-w * 0.5)} ${-l}, ${-w} ${r2(-l * 0.4)}, 0 0 Z`;
  }
  if (tip === "notch") {
    return `M0 0 C ${w} ${r2(-l * 0.35)}, ${w} ${r2(-l * 0.85)}, ${r2(w * 0.35)} ${-l} C ${r2(w * 0.14)} ${r2(-l * 1.05)}, 0 ${r2(-l * 0.9)}, 0 ${r2(-l * 0.92)} C 0 ${r2(-l * 0.9)}, ${r2(-w * 0.14)} ${r2(-l * 1.05)}, ${r2(-w * 0.35)} ${-l} C ${-w} ${r2(-l * 0.85)}, ${-w} ${r2(-l * 0.35)}, 0 0 Z`;
  }
  return `M0 0 C ${w} ${r2(-l * 0.35)}, ${r2(w * 0.7)} ${-l}, 0 ${-l} C ${r2(-w * 0.7)} ${-l}, ${-w} ${r2(-l * 0.35)}, 0 0 Z`;
}

function ringPetals(
  count: number, len: number, width: number, tip: "round" | "point" | "notch",
  fill: string, stroke: string, scale: number, offset: number, rng: Rng, keyPrefix: string,
  veins?: { hi: string; lo: string },
) {
  return Array.from({ length: count }).map((_, i) => {
    const angle = r2((i / count) * 360 + offset);
    const jl = len * rand(rng, 0.92, 1.08);
    const jw = width * rand(rng, 0.9, 1.1);
    return (
      <g key={`${keyPrefix}-${i}`} transform={`rotate(${angle}) scale(${r2(scale)})`}>
        <path d={petal(jl, jw, tip)} fill={fill} stroke={stroke} strokeWidth={0.5} />
        {veins && (
          <>
            {/* central highlight vein */}
            <path
              d={`M0 ${r2(-jl * 0.1)} C ${r2(jw * 0.08)} ${r2(-jl * 0.38)}, ${r2(-jw * 0.06)} ${r2(-jl * 0.62)}, 0 ${r2(-jl * 0.85)}`}
              fill="none" stroke={veins.hi} strokeWidth={0.9} strokeLinecap="round" opacity={0.4}
            />
            {/* soft side veins on wide petals */}
            {jw > 8 && (
              <>
                <path
                  d={`M0 ${r2(-jl * 0.16)} C ${r2(jw * 0.3)} ${r2(-jl * 0.38)}, ${r2(jw * 0.34)} ${r2(-jl * 0.6)}, ${r2(jw * 0.22)} ${r2(-jl * 0.74)}`}
                  fill="none" stroke={veins.lo} strokeWidth={0.5} strokeLinecap="round" opacity={0.26}
                />
                <path
                  d={`M0 ${r2(-jl * 0.16)} C ${r2(-jw * 0.3)} ${r2(-jl * 0.38)}, ${r2(-jw * 0.34)} ${r2(-jl * 0.6)}, ${r2(-jw * 0.22)} ${r2(-jl * 0.74)}`}
                  fill="none" stroke={veins.lo} strokeWidth={0.5} strokeLinecap="round" opacity={0.26}
                />
              </>
            )}
          </>
        )}
      </g>
    );
  });
}

export default function FlowerHead({ species, seed = 1, size = 90, className, style, painterly = false, alive = false }: FlowerHeadProps) {
  const rng = mulberry32(seed * 2654435761);
  const c = COLORS[species];
  const uid = `${species}-${seed}`;
  const spin = r2(rand(rng, 0, 360));
  const gradId = `grad-${uid}`, ctrId = `ctr-${uid}`, softId = `soft-${uid}`, hiId = `hi-${uid}`;
  const paintId = `paint-${uid}`, texId = `tex-${uid}`;
  const veins = { hi: "#ffffff", lo: c.deep };

  // gentle life: rings breathe, the whole head sways — transform-only CSS,
  // desynchronised per flower & per ring via seeded negative delays.
  // Ring breathing is skipped for painterly flowers: animating inside an
  // feTurbulence filter would re-run the filter every frame (very slow).
  const aliveStyle = (i: number, kind: "breathe" | "sway"): React.CSSProperties | undefined =>
    alive && !(painterly && kind === "breathe")
      ? {
          animation: `bloom-${kind} ${r2(kind === "sway" ? 4.6 + ((seed * 3) % 8) * 0.45 : 3.3 + ((seed * 13) % 9) * 0.28)}s ease-in-out infinite`,
          animationDelay: `${r2(-(((seed * 7 + i * 5) % 24) * 0.37))}s`,
          transformBox: "view-box",
          transformOrigin: "50% 50%",
        }
      : undefined;

  // whole-head sway lives on the root <svg> (an HTML-level box) so the
  // browser composites it on the GPU instead of repainting the SVG
  const swayStyle: React.CSSProperties | undefined = alive
    ? {
        animation: `bloom-sway ${r2(4.6 + ((seed * 3) % 8) * 0.45)}s ease-in-out infinite`,
        animationDelay: `${r2(-(((seed * 7) % 24) * 0.37))}s`,
        willChange: "transform",
      }
    : undefined;

  const defs = (
    <defs>
      <radialGradient id={gradId} cx="50%" cy="72%" r="70%">
        <stop offset="0%" stopColor={c.light} />
        <stop offset="55%" stopColor={c.mid} />
        <stop offset="100%" stopColor={c.deep} />
      </radialGradient>
      <radialGradient id={ctrId} cx="45%" cy="40%" r="65%">
        <stop offset="0%" stopColor={c.center} />
        <stop offset="100%" stopColor={c.centerDeep} />
      </radialGradient>
      <radialGradient id={softId} cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor={c.mid} stopOpacity={0.55} />
        <stop offset="100%" stopColor={c.mid} stopOpacity={0} />
      </radialGradient>
      <radialGradient id={hiId} cx="42%" cy="30%" r="55%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
        <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
      </radialGradient>
      {painterly && (
        <>
          <filter id={paintId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={2} seed={seed} result="t" />
            <feDisplacementMap in="SourceGraphic" in2="t" scale={4.2} xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation={0.4} />
          </filter>
          <filter id={texId} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seed + 4} result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.28 0 0 0 0 0.2 0 0 0 0 0.12 0 0 0 0.5 0" />
          </filter>
        </>
      )}
    </defs>
  );

  let content: React.ReactNode = null;

  if (species === "hydrangea") {
    const rngc = mulberry32(seed * 40503 + 7);
    content = (
      <g style={aliveStyle(1, "breathe")}>
        {Array.from({ length: 11 }).map((_, i) => {
          const a = rand(rngc, 0, Math.PI * 2);
          const rad = i === 0 ? 0 : rand(rngc, 10, 32);
          const fx = r2(Math.cos(a) * rad), fy = r2(Math.sin(a) * rad * 0.8 - 4);
          const s = r2(rand(rngc, 0.75, 1.05));
          return (
            <g key={i} transform={`translate(${fx} ${fy}) scale(${s})`}>
              {[0, 90, 180, 270].map((d) => (
                <ellipse key={d} cx={0} cy={-8} rx={6} ry={9} fill={`url(#${gradId})`} stroke={c.deep} strokeWidth={0.4} transform={`rotate(${r2(d + rand(rngc, -8, 8))})`} />
              ))}
              <circle r={2.2} fill={c.centerDeep} />
            </g>
          );
        })}
      </g>
    );
  } else if (species === "bluebell") {
    const rngb = mulberry32(seed * 911 + 3);
    content = (
      <g>
        <path d="M0 20 C -4 0 4 -20 0 -38" stroke="#6f855b" strokeWidth={1.4} fill="none" />
        {Array.from({ length: 5 }).map((_, i) => {
          const y = r2(-30 + i * 14 + rand(rngb, -2, 2));
          const x = r2((i % 2 === 0 ? -1 : 1) * rand(rngb, 6, 16));
          return (
            <g key={i} transform={`translate(${x} ${y})`}>
              <path d="M0 0 Q 6 4 5 12 Q 0 16 -5 12 Q -6 4 0 0 Z" fill={`url(#${gradId})`} stroke={c.deep} strokeWidth={0.4} />
            </g>
          );
        })}
      </g>
    );
  } else if (species === "rose") {
    // concentric curled petals spiralling toward the centre
    const rings = [
      { n: 9, len: 40, w: 17, s: 1 },
      { n: 8, len: 31, w: 15, s: 1 },
      { n: 7, len: 23, w: 13, s: 1 },
      { n: 5, len: 15, w: 11, s: 1 },
    ];
    content = (
      <g>
        {/* darker back petals peeking out for depth */}
        <g opacity={0.5}>
          {ringPetals(9, 45, 18, "round", c.deep, c.deep, 1, 30, rng, "roseback")}
        </g>
        {rings.map((ring, ri) => (
          <g key={ri} style={aliveStyle(ri + 1, "breathe")}>
            {ringPetals(ring.n, ring.len, ring.w, "round", `url(#${gradId})`, c.deep, ring.s, ri * 22 + 10, rng, `rose${ri}`, veins)}
          </g>
        ))}
        {/* spiral bud */}
        <path d="M0 -8 C 6 -8 7 0 0 2 C -6 2 -6 -6 0 -6" fill="none" stroke={c.deep} strokeWidth={1} opacity={0.7} />
        <circle r={4} fill={c.centerDeep} opacity={0.5} />
      </g>
    );
  } else if (species === "iris") {
    // 3 upright standards + 3 drooping falls with a golden beard
    const falls = [90, 210, 330];
    const stands = [30, 150, 270];
    content = (
      <g>
        <g style={aliveStyle(1, "breathe")}>
          {falls.map((a, i) => (
            <path key={`f${i}`} d={petal(44, 20, "round")} fill={`url(#${gradId})`} stroke={c.deep} strokeWidth={0.5} transform={`rotate(${a}) scale(1)`} style={{ transformOrigin: "0 0" }} />
          ))}
        </g>
        <g style={aliveStyle(2, "breathe")}>
          {stands.map((a, i) => (
            <path key={`s${i}`} d={petal(34, 15, "point")} fill={c.mid} stroke={c.deep} strokeWidth={0.5} transform={`rotate(${a}) scale(0.9)`} style={{ transformOrigin: "0 0" }} opacity={0.92} />
          ))}
        </g>
        {falls.map((a, i) => (
          <line key={`b${i}`} x1={0} y1={0} x2={r2(Math.cos(((a - 90) * Math.PI) / 180) * 22)} y2={r2(Math.sin(((a - 90) * Math.PI) / 180) * 22)} stroke={c.center} strokeWidth={3} strokeLinecap="round" opacity={0.85} />
        ))}
        <circle r={4} fill={c.center} />
      </g>
    );
  } else {
    const config: Record<
      Exclude<FlowerSpecies, "hydrangea" | "bluebell" | "rose" | "iris">,
      { rings: { n: number; len: number; w: number; tip: "round" | "point" | "notch" }[]; ctr: number; ctrDots?: number }
    > = {
      cosmos: { rings: [{ n: 8, len: 40, w: 15, tip: "notch" }], ctr: 9, ctrDots: 10 },
      daisy: { rings: [{ n: 18, len: 40, w: 6, tip: "round" }, { n: 18, len: 34, w: 6, tip: "round" }], ctr: 12, ctrDots: 22 },
      lily: { rings: [{ n: 6, len: 42, w: 12, tip: "point" }], ctr: 4, ctrDots: 6 },
      sunflower: { rings: [{ n: 20, len: 40, w: 8, tip: "point" }, { n: 20, len: 32, w: 8, tip: "point" }], ctr: 18, ctrDots: 40 },
      dahlia: { rings: [{ n: 12, len: 40, w: 9, tip: "point" }, { n: 12, len: 30, w: 8, tip: "point" }, { n: 8, len: 20, w: 7, tip: "point" }], ctr: 6 },
      peony: { rings: [{ n: 9, len: 38, w: 16, tip: "round" }, { n: 9, len: 30, w: 14, tip: "round" }, { n: 8, len: 22, w: 12, tip: "round" }, { n: 6, len: 14, w: 10, tip: "round" }], ctr: 7 },
      anemone: { rings: [{ n: 8, len: 42, w: 16, tip: "round" }], ctr: 12, ctrDots: 34 },
      zinnia: { rings: [{ n: 14, len: 38, w: 8, tip: "round" }, { n: 12, len: 28, w: 8, tip: "round" }, { n: 8, len: 18, w: 7, tip: "round" }], ctr: 7, ctrDots: 12 },
      lotus: { rings: [{ n: 8, len: 44, w: 14, tip: "point" }, { n: 8, len: 34, w: 12, tip: "point" }], ctr: 10, ctrDots: 14 },
      magnolia: { rings: [{ n: 6, len: 44, w: 20, tip: "round" }, { n: 6, len: 34, w: 18, tip: "round" }], ctr: 6, ctrDots: 8 },
    };
    const cfg = config[species as keyof typeof config];
    const back = cfg.rings[0];
    content = (
      <g>
        {/* darker back petals peeking out between the front ones — depth */}
        <g opacity={0.45}>
          {ringPetals(back.n, back.len * 1.12, back.w * 1.05, back.tip, c.deep, c.deep, 1, 8 + 180 / back.n, rng, "back")}
        </g>
        {cfg.rings.map((ring, ri) => (
          <g key={ri} style={aliveStyle(ri + 1, "breathe")}>
            {ringPetals(ring.n, ring.len, ring.w, ring.tip, `url(#${gradId})`, c.deep, 1, ri * (180 / (ring.n || 1)) + 8, rng, `r${ri}`, veins)}
          </g>
        ))}
        <circle r={cfg.ctr} fill={`url(#${ctrId})`} stroke={c.centerDeep} strokeWidth={0.5} />
        {cfg.ctrDots
          ? Array.from({ length: cfg.ctrDots }).map((_, i, a) => {
              const ang = (i / a.length) * Math.PI * 2;
              const rr = rand(rng, 1.5, cfg.ctr * 0.75);
              return <circle key={i} cx={r2(Math.cos(ang) * rr)} cy={r2(Math.sin(ang) * rr)} r={r2(rand(rng, 0.8, 1.6))} fill={c.centerDeep} opacity={0.85} />;
            })
          : null}
        {/* real lily stamens — curved filaments with dark anthers */}
        {species === "lily" && (
          <g style={aliveStyle(4, "breathe")}>
            {[15, 75, 135, 195, 255, 315].map((a) => {
              const rad = (a * Math.PI) / 180;
              const fx = r2(Math.cos(rad) * 21), fy = r2(Math.sin(rad) * 21);
              const mx = r2(Math.cos(rad) * 10 + Math.sin(rad) * 3.5);
              const my = r2(Math.sin(rad) * 10 - Math.cos(rad) * 3.5);
              return (
                <g key={a}>
                  <path d={`M0 0 Q ${mx} ${my} ${fx} ${fy}`} fill="none" stroke="#e6d3a0" strokeWidth={1.1} strokeLinecap="round" />
                  <ellipse cx={fx} cy={fy} rx={3.4} ry={1.5} fill="#6d3420" transform={`rotate(${a} ${fx} ${fy})`} />
                </g>
              );
            })}
          </g>
        )}
      </g>
    );
  }

  return (
    <svg viewBox="-52 -52 104 104" width={size} height={size} className={className} style={{ overflow: "visible", ...swayStyle, ...style }}>
      {defs}
      <circle r={46} fill={`url(#${softId})`} />
      <g transform={`rotate(${spin})`} filter={painterly ? `url(#${paintId})` : undefined}>{content}</g>
      {/* soft top-left highlight for a rounded, 3D feel */}
      <ellipse cx={-10} cy={-14} rx={30} ry={22} fill={`url(#${hiId})`} />
      {painterly && (
        <circle r={48} filter={`url(#${texId})`} style={{ mixBlendMode: "soft-light" }} opacity={0.35} />
      )}
    </svg>
  );
}
