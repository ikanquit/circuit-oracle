"use client";

import { useEffect, useRef, type JSX } from "react";

interface ScanlineOverlayProps {
  intensity?: "subtle" | "medium" | "strong";
}

const SCANLINE_ALPHA: Record<NonNullable<ScanlineOverlayProps["intensity"]>, number> = {
  subtle: 0.04,
  medium: 0.08,
  strong: 0.12,
};

const GRAIN_OPACITY: Record<NonNullable<ScanlineOverlayProps["intensity"]>, number> = {
  subtle: 0.05,
  medium: 0.09,
  strong: 0.14,
};

const VIGNETTE_OPACITY: Record<NonNullable<ScanlineOverlayProps["intensity"]>, number> = {
  subtle: 0.5,
  medium: 0.6,
  strong: 0.72,
};

export default function ScanlineOverlay({
  intensity = "subtle",
}: ScanlineOverlayProps): JSX.Element {
  const turbulenceRef = useRef<SVGFETurbulenceElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const turbulence = turbulenceRef.current;
    if (!turbulence) return;

    // Respect prefers-reduced-motion — skip the rAF grain animation
    // entirely. The static grain texture still renders, just doesn't
    // shimmer.
    const mql =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    if (mql && mql.matches) {
      return;
    }

    let last = 0;
    // Throttle to ~12fps for a "film grain" feel without burning the GPU.
    const FRAME_MS = 1000 / 12;

    const tick = (now: number) => {
      if (now - last >= FRAME_MS) {
        last = now;
        // Vary baseFrequency in a tiny range so the noise pattern shifts every frame.
        const f = 0.85 + Math.random() * 0.15;
        turbulence.setAttribute("baseFrequency", f.toFixed(3));
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const scanlineAlpha = SCANLINE_ALPHA[intensity];
  const grainOpacity = GRAIN_OPACITY[intensity];
  const vignetteOpacity = VIGNETTE_OPACITY[intensity];
  const showBeam = intensity !== "subtle";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[60]"
      style={{ contain: "strict" }}
    >
      {/* Layer 1: horizontal scanlines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(198,255,77,${scanlineAlpha}) 2px, rgba(198,255,77,${scanlineAlpha}) 3px)`,
          mixBlendMode: "screen",
        }}
      />

      {/* Layer 2: animated film grain (SVG turbulence) */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: grainOpacity,
          mixBlendMode: "overlay",
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="co-grain-filter">
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves={2}
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 1 0"
          />
        </filter>
        <rect width="100%" height="100%" fill="white" filter="url(#co-grain-filter)" />
      </svg>

      {/* Layer 3: vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${vignetteOpacity}) 100%)`,
        }}
      />

      {/* Layer 4: optional moving scanline beam (medium/strong only) */}
      {showBeam && (
        <div
          data-co-scanline-beam
          className="absolute left-0 right-0"
          style={{
            top: 0,
            height: "2px",
            background:
              "linear-gradient(to bottom, transparent 0%, var(--co-phosphor, #c6ff4d) 50%, transparent 100%)",
            opacity: 0.06,
            willChange: "transform",
            animation: "co-scanline-beam 9s linear infinite",
          }}
        />
      )}

      <style>{`
        @keyframes co-scanline-beam {
          0%   { transform: translateY(-4px); }
          100% { transform: translateY(100vh); }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-co-scanline-beam] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
