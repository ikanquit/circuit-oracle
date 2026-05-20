"use client";

import type { CSSProperties, JSX, ReactNode } from "react";

interface BlueprintResultsProps {
  title?: string;
  jobId?: string;
  stage?: "idle" | "parallel" | "synthesis" | "done";
  children: ReactNode;
}

type StageConfig = {
  label: string;
  color: string;
  shadow: string;
  pulse: boolean;
};

const STAGE_CONFIG: Record<NonNullable<BlueprintResultsProps["stage"]>, StageConfig> = {
  idle: {
    label: "—",
    color: "var(--co-muted)",
    shadow: "none",
    pulse: false,
  },
  parallel: {
    label: "● PARALLEL",
    color: "var(--co-amber)",
    shadow: "0 0 10px rgba(255, 181, 71, 0.55)",
    pulse: true,
  },
  synthesis: {
    label: "● SYNTHESIS",
    color: "var(--co-phosphor)",
    shadow: "0 0 10px rgba(198, 255, 77, 0.55)",
    pulse: true,
  },
  done: {
    label: "● COMPLETE",
    color: "var(--co-phosphor)",
    shadow: "0 0 10px rgba(198, 255, 77, 0.55)",
    pulse: false,
  },
};

export default function BlueprintResults({
  title = "ANALYSIS OUTPUT",
  jobId,
  stage = "idle",
  children,
}: BlueprintResultsProps): JSX.Element {
  const cfg = STAGE_CONFIG[stage];

  const cornerBase: CSSProperties = {
    position: "absolute",
    width: 12,
    height: 12,
    pointerEvents: "none",
    color: "var(--co-phosphor)",
  };

  const badgeStyle: CSSProperties = {
    color: cfg.color,
    textShadow: cfg.shadow,
    transition:
      "color 300ms ease, text-shadow 300ms ease",
    animation: cfg.pulse ? "co-blueprint-pulse 1.5s ease infinite" : undefined,
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
  };

  return (
    <div
      className="relative"
      style={{
        background: "var(--co-surface)",
        border: "1px solid var(--co-border-strong)",
        borderRadius: 0,
        minHeight: 280,
        color: "var(--co-text)",
      }}
      aria-label={title}
    >
      <style>{`
        @keyframes co-blueprint-pulse {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          [data-co-stage-badge] {
            animation: none !important;
          }
        }
      `}</style>

      {/* Corner brackets — L-shaped, outset by 1px */}
      <span
        aria-hidden="true"
        style={{
          ...cornerBase,
          top: -1,
          left: -1,
          borderTop: "1.5px solid currentColor",
          borderLeft: "1.5px solid currentColor",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          ...cornerBase,
          top: -1,
          right: -1,
          borderTop: "1.5px solid currentColor",
          borderRight: "1.5px solid currentColor",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          ...cornerBase,
          bottom: -1,
          left: -1,
          borderBottom: "1.5px solid currentColor",
          borderLeft: "1.5px solid currentColor",
        }}
      />
      <span
        aria-hidden="true"
        style={{
          ...cornerBase,
          bottom: -1,
          right: -1,
          borderBottom: "1.5px solid currentColor",
          borderRight: "1.5px solid currentColor",
        }}
      />

      {/* Header strip */}
      <header
        className="flex items-center justify-between gap-4"
        style={{
          borderBottom: "1px solid var(--co-border)",
          padding: "10px 16px",
          background: "var(--co-surface-2)",
        }}
      >
        {/* Left: dot + title */}
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden="true"
            style={{
              width: 4,
              height: 4,
              background: "var(--co-phosphor)",
              boxShadow: "0 0 6px var(--co-phosphor)",
              flexShrink: 0,
            }}
          />
          <span
            className="co-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              color: "var(--co-text)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {title}
          </span>
        </div>

        {/* Center: jobId */}
        <div
          className="co-mono hidden sm:block"
          style={{
            fontSize: 10,
            letterSpacing: "0.15em",
            color: "var(--co-muted)",
            textAlign: "center",
            flex: 1,
          }}
        >
          {jobId ? `[${jobId}]` : "[—]"}
        </div>

        {/* Right: stage badge */}
        <div
          data-co-stage-badge
          className="co-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            flexShrink: 0,
            ...badgeStyle,
          }}
          aria-live="polite"
        >
          <span>{cfg.label}</span>
        </div>
      </header>

      {/* Content area — blueprint dot grid */}
      <div
        style={{
          padding: "28px 24px",
          background:
            "radial-gradient(circle, rgba(79, 158, 255, 0.05) 1px, transparent 1px)",
          backgroundColor: "var(--co-surface)",
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0",
          position: "relative",
        }}
      >
        {children}
      </div>

      {/* Footer strip */}
      <footer
        className="flex items-center justify-between gap-4"
        style={{
          borderTop: "1px solid var(--co-border)",
          padding: "8px 16px",
          background: "var(--co-surface-2)",
        }}
      >
        <span
          className="co-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            color: "var(--co-muted)",
          }}
        >
          REV 01 &middot; CIRCUIT/ORACLE
        </span>
        <span
          className="co-mono hidden md:inline"
          style={{
            fontSize: 10,
            letterSpacing: "0.4em",
            color: "var(--co-muted)",
            opacity: 0.5,
          }}
          aria-hidden="true"
        >
          &mdash;&mdash;&mdash;&mdash;
        </span>
        <span
          className="co-mono"
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            color: "var(--co-muted)",
          }}
        >
          CLASSIFIED &middot; INTERNAL USE
        </span>
      </footer>
    </div>
  );
}
