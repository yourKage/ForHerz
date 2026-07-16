interface PetalProps {
  size?: number;
  color?: string;
  edge?: string;
  className?: string;
}

/** A single soft petal used by drift/dissolve particle systems. */
export default function Petal({
  size = 24,
  color = "#f3cfcb",
  edge = "#e9aaa3",
  className,
}: PetalProps) {
  return (
    <svg
      viewBox="-12 -16 24 32"
      width={size}
      height={size * 1.15}
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="pt" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.75} />
          <stop offset="45%" stopColor={color} />
          <stop offset="100%" stopColor={edge} />
        </radialGradient>
      </defs>
      <path
        d="M0 14 C -11 6, -9 -12, 0 -15 C 9 -12, 11 6, 0 14 Z"
        fill="url(#pt)"
        stroke={edge}
        strokeWidth={0.4}
      />
      <path
        d="M0 12 L0 -12"
        stroke={edge}
        strokeWidth={0.4}
        opacity={0.4}
        fill="none"
      />
    </svg>
  );
}
