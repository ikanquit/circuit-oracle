"use client";

import type { JSX, CSSProperties } from "react";

const TICKER_PHRASES: ReadonlyArray<string> = [
  "FOUR-AGENT PARALLEL PIPELINE",
  "SSE STREAMING SYNTHESIS",
  "10MB IMAGE LIMIT",
  "RATE LIMITED 10/MIN/IP",
  "MODEL · CLAUDE-SONNET-4-6",
  "BUILD · 2026.05",
  "POWERED BY ANTHROPIC API",
  "NO IMAGE LOGGING · EVER",
  "OP-AMP · BJT · MOSFET · 555 · RC · LC · RLC",
  "SCHEMATIC ANALYSIS AT ENGINEERING DEPTH",
];

type MetadataCell = {
  label: string;
  value: string;
};

const METADATA: ReadonlyArray<MetadataCell> = [
  {
    label: "PIPELINE",
    value: "4 AGENTS · COMPONENT ▸ TOPOLOGY ▸ DOMAIN ▸ SYNTHESIS",
  },
  {
    label: "PROTOCOL",
    value: "SSE · POST /api/analyze · application/x-ndjson",
  },
  {
    label: "RUNTIME",
    value: "NODE · max-duration 60s · maxFileSize 10MB",
  },
  {
    label: "DEPLOY",
    value: "vercel edge · region auto · build 2026.05",
  },
];

function TickerRun({ ariaHidden }: { ariaHidden?: boolean }): JSX.Element {
  return (
    <span
      aria-hidden={ariaHidden ? true : undefined}
      style={{
        display: "inline-flex",
        alignItems: "center",
        flex: "0 0 50%",
        whiteSpace: "nowrap",
      }}
    >
      {TICKER_PHRASES.map((phrase, idx) => {
        const isPhosphor = idx % 2 === 1;
        return (
          <span
            key={`${phrase}-${idx}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "18px",
              paddingInline: "18px",
            }}
          >
            <span
              className="co-mono"
              style={{
                fontSize: "13px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: isPhosphor
                  ? "var(--co-phosphor)"
                  : "var(--co-text-dim)",
              }}
            >
              {phrase}
            </span>
            <span
              aria-hidden
              style={{
                color: "var(--co-amber)",
                fontSize: "11px",
                lineHeight: 1,
                transform: "translateY(-1px)",
              }}
            >
              ◆
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function TickerFooter(): JSX.Element {
  const tickerKeyframes = `@keyframes co-ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  [data-co-ticker-track] {
    animation: none !important;
  }
}`;

  const tickerTrackStyle: CSSProperties = {
    display: "inline-flex",
    width: "max-content",
    // Bumped from 40s -> 48s to compensate for the larger 13px text (~8% wider
    // content), so per-character scroll velocity stays roughly the same.
    animation: "co-ticker 48s linear infinite",
    willChange: "transform",
  };

  return (
    <footer
      data-co-footer="ticker"
      style={{
        position: "relative",
        width: "100%",
        minHeight: "340px",
        backgroundColor: "var(--co-surface)",
        borderTop: "1px solid var(--co-border-strong)",
        color: "var(--co-text)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{tickerKeyframes}</style>

      {/* 1. Ticker row */}
      <div
        style={{
          // Bumped 36 -> 40 to give the 13px ticker text comfortable vertical room.
          height: "40px",
          width: "100%",
          borderBottom: "1px solid var(--co-border)",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "var(--co-surface-2)",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div data-co-ticker-track style={tickerTrackStyle}>
          <TickerRun />
          <TickerRun ariaHidden />
        </div>
      </div>

      {/* 2. Metadata grid */}
      <div
        style={{
          padding: "48px 32px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(var(--co-footer-cols, 4), minmax(0, 1fr))",
          gap: "32px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {METADATA.map((cell) => (
          <div
            key={cell.label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              minWidth: 0,
            }}
          >
            <span
              className="co-label"
              style={{
                color: "var(--co-muted)",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {cell.label}
            </span>
            <span
              className="co-mono"
              style={{
                color: "var(--co-text)",
                fontSize: "14px",
                lineHeight: 1.5,
                wordBreak: "break-word",
              }}
            >
              {cell.value}
            </span>
          </div>
        ))}
      </div>

      {/* 3. Wordmark — dim base text with a phosphor "/" overlaid at higher opacity */}
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-start",
          padding: "0 32px",
          marginBottom: "-32px",
          overflow: "hidden",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h2
          className="co-display"
          aria-label="Circuit Oracle"
          style={{
            position: "relative",
            margin: 0,
            fontFamily: "var(--co-font-display)",
            fontWeight: 900,
            fontSize: "clamp(64px, 12vw, 192px)",
            lineHeight: 0.85,
            letterSpacing: "-0.03em",
            whiteSpace: "nowrap",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {/* Dim base: full wordmark */}
          <span
            aria-hidden
            style={{
              color: "var(--co-text)",
              opacity: 0.08,
            }}
          >
            CIRCUIT/ORACLE
          </span>
          {/* Phosphor "/" overlay — same layout, transparent CIRCUIT + ORACLE, visible slash */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              color: "transparent",
              pointerEvents: "none",
            }}
          >
            <span style={{ color: "transparent" }}>CIRCUIT</span>
            <span style={{ color: "var(--co-phosphor)", opacity: 0.18 }}>
              /
            </span>
            <span style={{ color: "transparent" }}>ORACLE</span>
          </span>
        </h2>
      </div>

      {/* 4. Signature line */}
      <div
        style={{
          borderTop: "1px solid var(--co-border)",
          padding: "14px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          fontSize: "12px",
          backgroundColor: "var(--co-surface)",
          position: "relative",
          zIndex: 3,
          flexWrap: "wrap",
        }}
      >
        <span
          className="co-mono"
          style={{
            color: "var(--co-muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          © 2026 · CIRCUIT/ORACLE · ALL ENGINEERING DEPTH
        </span>

        <span
          className="co-mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--co-text-dim)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: "6px",
              height: "6px",
              backgroundColor: "var(--co-phosphor)",
              boxShadow: "0 0 6px var(--co-phosphor)",
            }}
          />
          SYSTEM NOMINAL
        </span>

        <span
          className="co-mono"
          style={{
            color: "var(--co-muted)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            textAlign: "right",
          }}
        >
          REV 02 · BUILT WITH NEXT.JS · DEPLOYED ON VERCEL
        </span>
      </div>

      {/* Responsive: collapse grid to 2 cols and bump min-height on mobile */}
      <style>{`
        @media (max-width: 768px) {
          footer[data-co-footer="ticker"] { min-height: 480px; }
        }
      `}</style>

      {/* Anchor for the media-query selector above + responsive grid var */}
      <style>{`
        footer { --co-footer-cols: 4; }
        @media (max-width: 768px) {
          footer { --co-footer-cols: 2; }
        }
      `}</style>
    </footer>
  );
}
