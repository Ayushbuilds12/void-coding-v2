"use client";
import * as React from "react";

/**
 * Japanese blossom tree with falling petals and a soft depth effect.
 * The tree is drawn with SVG; petals are CSS-animated for a cinematic feel.
 */
export function BlossomTree() {
  const petals = React.useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        left: Math.round((i * 37) % 100),
        delay: (i % 10) * 0.9,
        duration: 7 + (i % 6),
        size: 6 + (i % 4) * 2,
        drift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 5) * 6),
      })),
    []
  );

  return (
    <div className="pointer-events-none relative h-[420px] w-[420px] max-w-full">
      {/* Depth glow */}
      <div className="absolute right-6 top-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

      {/* Tree */}
      <svg viewBox="0 0 400 420" className="absolute inset-0 h-full w-full drop-shadow-[0_0_25px_rgba(220,38,38,0.15)]">
        <defs>
          <linearGradient id="trunk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2020" />
            <stop offset="100%" stopColor="#0a0808" />
          </linearGradient>
          <radialGradient id="bloom" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#fca5a5" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.55" />
          </radialGradient>
        </defs>

        {/* Trunk & branches */}
        <path
          d="M200 420 L200 250 M200 260 C160 230 140 210 120 170 M200 250 C240 220 270 205 300 165 M200 300 C170 280 150 265 130 235 M200 290 C235 270 260 255 285 225"
          stroke="url(#trunk)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        {/* Blossom canopy */}
        <g>
          <circle cx="120" cy="160" r="70" fill="url(#bloom)" opacity="0.9" />
          <circle cx="210" cy="120" r="85" fill="url(#bloom)" opacity="0.9" />
          <circle cx="300" cy="155" r="72" fill="url(#bloom)" opacity="0.9" />
          <circle cx="170" cy="90" r="55" fill="url(#bloom)" opacity="0.85" />
          <circle cx="260" cy="90" r="55" fill="url(#bloom)" opacity="0.85" />
        </g>
      </svg>

      {/* Falling petals */}
      <div className="absolute inset-0 overflow-hidden">
        {petals.map((p, i) => (
          <span
            key={i}
            className="absolute top-0 block rounded-[50%_0_50%_0] bg-gradient-to-br from-rose-300 to-primary"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              opacity: 0.85,
              animation: `fall ${p.duration}s linear ${p.delay}s infinite`,
              // @ts-expect-error custom property for keyframe drift
              "--drift": `${p.drift}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
