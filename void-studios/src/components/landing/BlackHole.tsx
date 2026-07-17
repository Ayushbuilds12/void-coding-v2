"use client";
import * as React from "react";

/**
 * Animated black hole: a dark core with rotating energy rings, a red accretion
 * glow and orbiting particles. Pure CSS/SVG for smooth, dependency-light motion.
 */
export function BlackHole() {
  const particles = React.useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        angle: (360 / 18) * i,
        delay: (i % 6) * 0.4,
        radius: 120 + (i % 4) * 22,
        size: 2 + (i % 3),
      })),
    []
  );

  return (
    <div className="relative flex h-[420px] w-[420px] max-w-full items-center justify-center">
      {/* Outer red glow */}
      <div className="absolute h-[360px] w-[360px] rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
      <div className="absolute h-[260px] w-[260px] rounded-full bg-primary/30 blur-2xl animate-pulse-glow" />

      {/* Rotating energy rings */}
      <div className="absolute h-[320px] w-[320px] rounded-full border border-primary/40 animate-spin-slow" style={{ borderTopColor: "rgba(220,38,38,0.9)" }} />
      <div className="absolute h-[250px] w-[250px] rounded-full border border-primary/30 animate-spin-slower" style={{ borderBottomColor: "rgba(248,113,113,0.8)" }} />
      <div className="absolute h-[190px] w-[190px] rounded-full border border-white/10 animate-spin-slow" style={{ borderLeftColor: "rgba(255,255,255,0.5)" }} />

      {/* Accretion disk */}
      <div
        className="absolute h-[300px] w-[300px] rounded-full animate-spin-slower"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(220,38,38,0.5) 60deg, transparent 120deg, rgba(248,113,113,0.35) 200deg, transparent 300deg)",
          maskImage: "radial-gradient(circle, transparent 42%, black 46%, black 58%, transparent 62%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 42%, black 46%, black 58%, transparent 62%)",
        }}
      />

      {/* Event horizon (core) */}
      <div className="relative h-[150px] w-[150px] rounded-full bg-black shadow-[0_0_60px_20px_rgba(220,38,38,0.35)]">
        <div className="absolute inset-0 rounded-full ring-2 ring-primary/60" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-black to-[#0a0000]" />
      </div>

      {/* Orbiting particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 animate-spin-slow"
          style={{
            animationDuration: `${8 + (i % 5) * 3}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <span
            className="block rounded-full bg-primary"
            style={{
              width: p.size,
              height: p.size,
              transform: `translate(${p.radius}px, 0)`,
              boxShadow: "0 0 8px 2px rgba(220,38,38,0.8)",
              opacity: 0.8,
            }}
          />
        </div>
      ))}
    </div>
  );
}
