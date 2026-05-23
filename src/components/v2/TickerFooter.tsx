"use client";

import type { JSX, CSSProperties } from "react";

const TICKER_PHRASES: ReadonlyArray<string> = [
  "FOUR-AGENT PARALLEL PIPELINE",
  "SSE STREAMING SYNTHESIS",
  "10MB IMAGE LIMIT",
  "RATE LIMITED 10/MIN/IP",
  "MODEL · GEMINI-2.5-FLASH",
  "BUILD · 2026.05",
  "POWERED BY GOOGLE AI",
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
          display: "flex",
          flexDirection: "column",
          gap: "32px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {METADATA.map((cell) => (
          <div
            key={cell.label}
            style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: 0 }}
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
              style={{ color: "var(--co-text)", fontSize: "14px", lineHeight: 1.5, wordBreak: "break-word" }}
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

        <a
          href="https://github.com/ikanquit/circuit-oracle"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View source code on GitHub"
          className="co-footer-github"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            textDecoration: "none",
            color: "var(--co-muted)",
            opacity: 0.5,
            transition: "opacity 150ms ease",
          }}
        >
          <svg
            aria-hidden
            width="14"
            height="14"
            viewBox="0 0 98 96"
            fill="currentColor"
          >
            <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
          </svg>
          <span
            className="co-mono"
            style={{ fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}
          >
            SOURCE CODE
          </span>
        </a>

      </div>

      {/* Responsive */}
      <style>{`
        .co-footer-github:hover { opacity: 0.85 !important; }
        @media (max-width: 768px) {
          footer[data-co-footer="ticker"] { min-height: 480px; }
        }
      `}</style>

    </footer>
  );
}
