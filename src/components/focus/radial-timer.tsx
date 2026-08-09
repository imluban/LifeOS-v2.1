"use client";

interface RadialTimerProps {
  secondsLeft: number;
  totalSeconds: number;
  size?: number;
  accent?: string;
}

export default function RadialTimer({
  secondsLeft,
  totalSeconds,
  size = 320,
  accent = "var(--accent-amber)",
}: RadialTimerProps) {
  const radius = size / 2 - 12;
  const circumference = 2 * Math.PI * radius;

  const progress =
    totalSeconds === 0 ? 0 : (totalSeconds - secondsLeft) / totalSeconds;

  const offset = circumference * (1 - progress);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={2}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={accent}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1s linear",
            filter: `drop-shadow(0 0 6px ${accent})`,
          }}
        />

        {/* Minute tick marks — a mission-control instrument detail. */}
        {Array.from({ length: 60 }).map((_, i) => {
          const isMajor = i % 5 === 0;
          const angle = (i / 60) * 2 * Math.PI;
          const innerR = radius - (isMajor ? 10 : 5);
          const outerR = radius - 2;

          const x1 = size / 2 + innerR * Math.cos(angle);
          const y1 = size / 2 + innerR * Math.sin(angle);
          const x2 = size / 2 + outerR * Math.cos(angle);
          const y2 = size / 2 + outerR * Math.sin(angle);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={isMajor ? 1.5 : 1}
            />
          );
        })}
      </svg>

      <div className="absolute flex flex-col items-center">
        <span className="font-mono text-6xl font-semibold tabular-nums tracking-tight md:text-7xl">
          {String(minutes).padStart(2, "0")}
          <span className="text-white/30">:</span>
          {String(seconds).padStart(2, "0")}
        </span>

        <span className="mt-2 text-xs uppercase tracking-[0.3em] text-white/40">
          {progress >= 1 ? "Complete" : "Remaining"}
        </span>
      </div>
    </div>
  );
}
