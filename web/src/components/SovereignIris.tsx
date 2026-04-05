"use client";

interface SovereignIrisProps {
  size?: number;
  className?: string;
}

export default function SovereignIris({ size = 480, className = "" }: SovereignIrisProps) {
  const c = size / 2;
  const r1 = size * 0.46;
  const r2 = size * 0.36;
  const r3 = size * 0.26;
  const r4 = size * 0.16;
  const r5 = size * 0.07;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="iris-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#00D4FF" stopOpacity="0.18" />
          <stop offset="40%"  stopColor="#0060FF" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#000820" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="iris-center" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#00D4FF" stopOpacity="0.7" />
          <stop offset="60%"  stopColor="#0080CC" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#003060" stopOpacity="0.1" />
        </radialGradient>
        <filter id="iris-blur">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="center-glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background ambient glow */}
      <circle cx={c} cy={c} r={r1 * 1.1} fill="url(#iris-glow)" />

      {/* Outer ring — static structural ring */}
      <circle cx={c} cy={c} r={r1} stroke="rgba(200,220,255,0.12)" strokeWidth="1" />
      <circle cx={c} cy={c} r={r1 - 4} stroke="rgba(0,212,255,0.08)" strokeWidth="0.5" />

      {/* Outer rotating layer — 12 blades */}
      <g
        style={{ transformOrigin: `${c}px ${c}px`, animation: "iris-rotate 80s linear infinite" }}
      >
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = c + r2 * 0.3 * Math.cos(angle);
          const y1 = c + r2 * 0.3 * Math.sin(angle);
          const x2 = c + r1 * 0.92 * Math.cos(angle - 0.18);
          const y2 = c + r1 * 0.92 * Math.sin(angle - 0.18);
          const x3 = c + r1 * 0.92 * Math.cos(angle + 0.05);
          const y3 = c + r1 * 0.92 * Math.sin(angle + 0.05);
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`}
              fill="rgba(180,210,255,0.06)"
              stroke="rgba(0,212,255,0.15)"
              strokeWidth="0.5"
            />
          );
        })}
        {/* Tick marks on outer ring */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const isMain = i % 3 === 0;
          const rIn = isMain ? r1 - 10 : r1 - 6;
          return (
            <line
              key={i}
              x1={c + (r1 - 2) * Math.cos(angle)}
              y1={c + (r1 - 2) * Math.sin(angle)}
              x2={c + rIn * Math.cos(angle)}
              y2={c + rIn * Math.sin(angle)}
              stroke={isMain ? "rgba(0,212,255,0.35)" : "rgba(200,220,255,0.12)"}
              strokeWidth={isMain ? 1 : 0.5}
            />
          );
        })}
      </g>

      {/* Mid ring */}
      <circle cx={c} cy={c} r={r2} stroke="rgba(0,212,255,0.18)" strokeWidth="1" strokeDasharray="4 8" />

      {/* Mid counter-rotating layer — 8 blades */}
      <g
        style={{ transformOrigin: `${c}px ${c}px`, animation: "iris-counter 55s linear infinite" }}
      >
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x1 = c + r3 * 0.4 * Math.cos(angle);
          const y1 = c + r3 * 0.4 * Math.sin(angle);
          const x2 = c + r2 * 0.95 * Math.cos(angle - 0.22);
          const y2 = c + r2 * 0.95 * Math.sin(angle - 0.22);
          const x3 = c + r2 * 0.95 * Math.cos(angle + 0.08);
          const y3 = c + r2 * 0.95 * Math.sin(angle + 0.08);
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`}
              fill="rgba(0,212,255,0.07)"
              stroke="rgba(0,212,255,0.25)"
              strokeWidth="0.5"
            />
          );
        })}
        {/* Dashed detail ring */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          return (
            <circle
              key={i}
              cx={c + (r2 - 14) * Math.cos(angle)}
              cy={c + (r2 - 14) * Math.sin(angle)}
              r={1.5}
              fill="rgba(0,212,255,0.2)"
            />
          );
        })}
      </g>

      {/* Inner ring */}
      <circle cx={c} cy={c} r={r3} stroke="rgba(200,220,255,0.2)" strokeWidth="1" />

      {/* Inner rotating layer — 6 aperture blades */}
      <g
        style={{ transformOrigin: `${c}px ${c}px`, animation: "iris-rotate 35s linear infinite" }}
      >
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 60 * Math.PI) / 180;
          const x1 = c + r4 * 0.5 * Math.cos(angle);
          const y1 = c + r4 * 0.5 * Math.sin(angle);
          const x2 = c + r3 * 0.9 * Math.cos(angle - 0.3);
          const y2 = c + r3 * 0.9 * Math.sin(angle - 0.3);
          const x3 = c + r3 * 0.9 * Math.cos(angle + 0.15);
          const y3 = c + r3 * 0.9 * Math.sin(angle + 0.15);
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} Z`}
              fill="rgba(0,212,255,0.1)"
              stroke="rgba(0,212,255,0.4)"
              strokeWidth="0.75"
            />
          );
        })}
      </g>

      {/* Center core ring */}
      <circle cx={c} cy={c} r={r4} stroke="rgba(0,212,255,0.35)" strokeWidth="1.5" />
      <circle cx={c} cy={c} r={r4 - 6} stroke="rgba(0,212,255,0.15)" strokeWidth="0.5" />

      {/* Center glow */}
      <circle cx={c} cy={c} r={r5 * 1.5} fill="url(#iris-center)" filter="url(#center-glow)" />
      <circle cx={c} cy={c} r={r5} fill="rgba(0,212,255,0.6)" />
      <circle cx={c} cy={c} r={r5 * 0.5} fill="rgba(255,255,255,0.9)" />

      {/* Cross-hair lines */}
      <line x1={c} y1={c - r1 * 0.9} x2={c} y2={c - r1 * 1.05} stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
      <line x1={c} y1={c + r1 * 0.9} x2={c} y2={c + r1 * 1.05} stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
      <line x1={c - r1 * 0.9} y1={c} x2={c - r1 * 1.05} y2={c} stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
      <line x1={c + r1 * 0.9} y1={c} x2={c + r1 * 1.05} y2={c} stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
    </svg>
  );
}
