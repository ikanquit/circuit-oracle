"use client";

import type { JSX } from "react";

type Trace = {
  d: string;
  pulse?: boolean;
  delay?: number;
  duration?: number;
  dashLength?: number;
  startPad?: { x: number; y: number };
  endPad?: { x: number; y: number };
};

type Node = {
  cx: number;
  cy: number;
  delay: number;
};

type Chip = {
  x: number;
  y: number;
  w: number;
  h: number;
  pinsPerSide: number;
};

const TRACES: Trace[] = [
  {
    d: "M -20 120 L 240 120 L 240 260 L 520 260",
    pulse: true,
    delay: 0,
    duration: 7,
    dashLength: 140,
    startPad: { x: -20, y: 120 },
    endPad: { x: 520, y: 260 },
  },
  {
    d: "M 1620 80 L 1320 80 L 1320 220 L 1080 220 L 1080 360",
    pulse: true,
    delay: 2.4,
    duration: 9,
    dashLength: 180,
    startPad: { x: 1620, y: 80 },
    endPad: { x: 1080, y: 360 },
  },
  {
    d: "M 60 720 L 60 540 L 380 540 L 380 660 L 700 660",
    pulse: true,
    delay: 4.1,
    duration: 8,
    dashLength: 160,
    startPad: { x: 60, y: 720 },
    endPad: { x: 700, y: 660 },
  },
  {
    d: "M 800 920 L 800 780 L 1100 780 L 1100 640",
    pulse: false,
    endPad: { x: 1100, y: 640 },
  },
  {
    d: "M 1500 920 L 1500 760 L 1280 760 L 1280 580",
    pulse: true,
    delay: 1.2,
    duration: 10,
    dashLength: 200,
    endPad: { x: 1280, y: 580 },
  },
  {
    d: "M -20 420 L 180 420 L 180 320 L 360 320",
    pulse: false,
    startPad: { x: -20, y: 420 },
    endPad: { x: 360, y: 320 },
  },
  {
    d: "M 1620 480 L 1420 480 L 1420 600 L 1180 600",
    pulse: false,
    startPad: { x: 1620, y: 480 },
    endPad: { x: 1180, y: 600 },
  },
  {
    d: "M 460 -20 L 460 160 L 620 160 L 620 280",
    pulse: false,
    endPad: { x: 620, y: 280 },
  },
  {
    d: "M 940 -20 L 940 100 L 760 100 L 760 240",
    pulse: true,
    delay: 5.5,
    duration: 11,
    dashLength: 150,
    endPad: { x: 760, y: 240 },
  },
  {
    d: "M 1180 -20 L 1180 140 L 1340 140 L 1340 340",
    pulse: false,
    endPad: { x: 1340, y: 340 },
  },
  {
    d: "M 220 920 L 220 800 L 420 800 L 420 720",
    pulse: false,
    endPad: { x: 420, y: 720 },
  },
  {
    d: "M 1080 480 L 880 480 L 880 380 L 700 380",
    pulse: true,
    delay: 3.3,
    duration: 8.5,
    dashLength: 170,
    startPad: { x: 1080, y: 480 },
    endPad: { x: 700, y: 380 },
  },
];

const NODES: Node[] = [
  { cx: 240, cy: 260, delay: 0 },
  { cx: 520, cy: 260, delay: 0.6 },
  { cx: 1320, cy: 220, delay: 1.1 },
  { cx: 1080, cy: 360, delay: 1.7 },
  { cx: 380, cy: 540, delay: 2.3 },
  { cx: 700, cy: 660, delay: 2.9 },
  { cx: 1100, cy: 780, delay: 3.4 },
  { cx: 1280, cy: 580, delay: 0.9 },
  { cx: 620, cy: 280, delay: 4.2 },
  { cx: 1340, cy: 340, delay: 3.8 },
];

const CHIPS: Chip[] = [
  { x: 180, y: 200, w: 260, h: 160, pinsPerSide: 8 },
  { x: 1100, y: 560, w: 320, h: 200, pinsPerSide: 10 },
  { x: 760, y: 80, w: 180, h: 120, pinsPerSide: 6 },
];

function chipPins(chip: Chip): JSX.Element[] {
  const pins: JSX.Element[] = [];
  const { x, y, w, h, pinsPerSide } = chip;
  const tickLen = 6;

  for (let i = 1; i <= pinsPerSide; i++) {
    const px = x + (w * i) / (pinsPerSide + 1);
    pins.push(
      <line
        key={`t-${chip.x}-${chip.y}-${i}`}
        x1={px}
        y1={y}
        x2={px}
        y2={y - tickLen}
      />,
    );
    pins.push(
      <line
        key={`b-${chip.x}-${chip.y}-${i}`}
        x1={px}
        y1={y + h}
        x2={px}
        y2={y + h + tickLen}
      />,
    );
  }
  for (let i = 1; i <= pinsPerSide; i++) {
    const py = y + (h * i) / (pinsPerSide + 1);
    pins.push(
      <line
        key={`l-${chip.x}-${chip.y}-${i}`}
        x1={x}
        y1={py}
        x2={x - tickLen}
        y2={py}
      />,
    );
    pins.push(
      <line
        key={`r-${chip.x}-${chip.y}-${i}`}
        x1={x + w}
        y1={py}
        x2={x + w + tickLen}
        y2={py}
      />,
    );
  }
  return pins;
}

export default function CircuitBackground(): JSX.Element {
  return (
    <div
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{ backgroundColor: "var(--co-bg)" }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100vw", height: "100vh", display: "block" }}
      >
        <defs>
          <pattern
            id="co-grid-pattern"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="0.5" cy="0.5" r="0.9" fill="var(--co-grid)" />
          </pattern>

          <pattern
            id="co-grid-major"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="0"
              x2="160"
              y2="0"
              stroke="var(--co-grid)"
              strokeWidth="0.35"
              opacity="0.6"
            />
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="160"
              stroke="var(--co-grid)"
              strokeWidth="0.35"
              opacity="0.6"
            />
          </pattern>

          <radialGradient id="co-vignette" cx="50%" cy="50%" r="70%">
            <stop offset="55%" stopColor="var(--co-bg)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--co-bg)" stopOpacity="0.85" />
          </radialGradient>
        </defs>

        <style>{`
          @keyframes co-node-pulse {
            0%, 100% { opacity: 0.2; }
            50%      { opacity: 0.6; }
          }
          @keyframes co-signal-pulse {
            0%   { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -2400; }
          }
          @keyframes co-chip-breathe {
            0%, 100% { opacity: 0.22; }
            50%      { opacity: 0.35; }
          }
          @keyframes co-grid-drift {
            0%   { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-32px, -32px, 0); }
          }
          .co-grid-layer {
            animation: co-grid-drift 60s linear infinite;
            transform-origin: 0 0;
          }
          .co-node {
            animation: co-node-pulse 8s ease-in-out infinite;
            transform-origin: center;
          }
          .co-trace-pulse {
            animation: co-signal-pulse linear infinite;
          }
          .co-chip {
            animation: co-chip-breathe 14s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .co-grid-layer,
            .co-node,
            .co-trace-pulse,
            .co-chip {
              animation: none;
            }
          }
        `}</style>

        {/* Layer 1 — schematic grid (dot grid + faint major lines, slow drift) */}
        <g className="co-grid-layer">
          <rect
            x="-64"
            y="-64"
            width="1728"
            height="1028"
            fill="url(#co-grid-pattern)"
            opacity="0.5"
          />
          <rect
            x="-64"
            y="-64"
            width="1728"
            height="1028"
            fill="url(#co-grid-major)"
          />
        </g>

        {/* Layer 4 — IC silhouettes (drawn before traces so traces can run "over" them visually) */}
        <g
          stroke="var(--co-border-strong)"
          strokeWidth="0.9"
          fill="none"
          opacity="0.28"
        >
          {CHIPS.map((chip, i) => (
            <g key={`chip-${i}`} className="co-chip" style={{ animationDelay: `${i * 2.1}s` }}>
              <rect
                x={chip.x}
                y={chip.y}
                width={chip.w}
                height={chip.h}
                rx="3"
              />
              {/* notch indicator (pin 1 marker) */}
              <circle cx={chip.x + 14} cy={chip.y + 14} r="2.5" />
              {/* pins */}
              <g strokeWidth="0.8">{chipPins(chip)}</g>
              {/* faint inner outline for depth */}
              <rect
                x={chip.x + 8}
                y={chip.y + 8}
                width={chip.w - 16}
                height={chip.h - 16}
                rx="2"
                opacity="0.5"
              />
            </g>
          ))}
        </g>

        {/* Layer 2 — PCB traces (static) */}
        <g
          stroke="var(--co-phosphor)"
          strokeWidth="1"
          fill="none"
          opacity="0.15"
          strokeLinecap="square"
          strokeLinejoin="miter"
        >
          {TRACES.map((trace, i) => (
            <path key={`trace-${i}`} d={trace.d} />
          ))}
        </g>

        {/* Layer 2b — Trace pads at endpoints */}
        <g fill="var(--co-phosphor)" opacity="0.35">
          {TRACES.map((trace, i) => (
            <g key={`pads-${i}`}>
              {trace.startPad && (
                <circle cx={trace.startPad.x} cy={trace.startPad.y} r="2.5" />
              )}
              {trace.endPad && (
                <circle cx={trace.endPad.x} cy={trace.endPad.y} r="2.5" />
              )}
            </g>
          ))}
        </g>

        {/* Layer 2c — Signal pulse overlays (a few traces only) */}
        <g
          stroke="var(--co-phosphor)"
          strokeWidth="1.4"
          fill="none"
          opacity="0.55"
          strokeLinecap="round"
        >
          {TRACES.filter((t) => t.pulse).map((trace, i) => (
            <path
              key={`pulse-${i}`}
              d={trace.d}
              className="co-trace-pulse"
              style={{
                strokeDasharray: `${trace.dashLength ?? 140} 2400`,
                animationDuration: `${trace.duration ?? 8}s`,
                animationDelay: `${trace.delay ?? 0}s`,
              }}
            />
          ))}
        </g>

        {/* Layer 3 — Connection nodes (pulsing) */}
        <g fill="var(--co-blueprint)">
          {NODES.map((node, i) => (
            <circle
              key={`node-${i}`}
              cx={node.cx}
              cy={node.cy}
              r="3"
              className="co-node"
              style={{ animationDelay: `${node.delay}s` }}
            />
          ))}
        </g>

        {/* A few copper accent pads near the lower chip for warm color balance */}
        <g fill="var(--co-copper)" opacity="0.22">
          <circle cx="1140" cy="600" r="2" />
          <circle cx="1380" cy="600" r="2" />
          <circle cx="1260" cy="740" r="2" />
        </g>

        {/* Vignette to fade edges and keep foreground readable */}
        <rect width="1600" height="900" fill="url(#co-vignette)" />
      </svg>
    </div>
  );
}
