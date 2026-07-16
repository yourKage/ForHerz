interface PearlProps {
  size?: number;
  className?: string;
}

/** An iridescent pearl with a soft specular highlight. */
export function Pearl({ size = 18, className }: PearlProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      width={size}
      height={size}
      className={className}
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id="pearl" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor="#fbeef0" />
          <stop offset="70%" stopColor="#f3d9e0" />
          <stop offset="100%" stopColor="#d9b7c6" />
        </radialGradient>
      </defs>
      <circle cx={20} cy={20} r={18} fill="url(#pearl)" />
      <ellipse cx={14} cy={12} rx={5} ry={3.4} fill="#ffffff" opacity={0.85} />
      <circle
        cx={20}
        cy={20}
        r={18}
        fill="none"
        stroke="#e7c9d4"
        strokeWidth={0.6}
        opacity={0.6}
      />
    </svg>
  );
}

interface SparkleProps {
  size?: number;
  color?: string;
  className?: string;
}

/** A four-point twinkle star. */
export function Sparkle({ size = 16, color = "#efdcae", className }: SparkleProps) {
  return (
    <svg
      viewBox="-16 -16 32 32"
      width={size}
      height={size}
      className={className}
      style={{ overflow: "visible" }}
    >
      <path
        d="M0 -14 C 1.6 -4, 4 -1.6, 14 0 C 4 1.6, 1.6 4, 0 14 C -1.6 4, -4 1.6, -14 0 C -4 -1.6, -1.6 -4, 0 -14 Z"
        fill={color}
      />
      <circle cx={0} cy={0} r={2} fill="#fff" />
    </svg>
  );
}
