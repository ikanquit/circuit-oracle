import Link from "next/link";
import type { JSX } from "react";

export const metadata = {
  title: "404 — Signal Lost · CircuitOracle",
};

export default function NotFound(): JSX.Element {
  return (
    <main
      className="relative min-h-screen flex items-center justify-center px-6 py-16"
      style={{
        background: "var(--co-bg)",
        color: "var(--co-text)",
        fontFamily: "var(--co-font-body)",
      }}
    >
      <style>{`
        @keyframes co-404-flicker {
          0%, 100% { opacity: 1; }
          12%      { opacity: 0.4; }
          14%      { opacity: 1; }
          42%      { opacity: 0.7; }
          44%      { opacity: 1; }
          70%      { opacity: 0.85; }
          72%      { opacity: 0.45; }
          74%      { opacity: 1; }
        }
        @keyframes co-404-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
        .co-404-flicker {
          animation: co-404-flicker 3.6s steps(1, end) infinite;
        }
        .co-404-pulse-dot {
          animation: co-404-pulse 1.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .co-404-flicker, .co-404-pulse-dot {
            animation: none !important;
          }
        }
        .co-404-grid {
          background-image:
            linear-gradient(var(--co-grid) 1px, transparent 1px),
            linear-gradient(90deg, var(--co-grid) 1px, transparent 1px);
          background-size: 32px 32px;
          mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
        }
      `}</style>

      {/* Faint blueprint grid backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 co-404-grid pointer-events-none"
      />

      <article
        className="relative w-full max-w-2xl"
        style={{
          background: "var(--co-surface)",
          border: "1px solid var(--co-border-strong)",
          padding: "40px 36px",
        }}
      >
        {/* Corner brackets */}
        {(["tl", "tr", "bl", "br"] as const).map((corner) => (
          <span
            key={corner}
            aria-hidden="true"
            style={{
              position: "absolute",
              width: 12,
              height: 12,
              color: "var(--co-amber)",
              borderTop:
                corner === "tl" || corner === "tr"
                  ? "1.5px solid currentColor"
                  : undefined,
              borderBottom:
                corner === "bl" || corner === "br"
                  ? "1.5px solid currentColor"
                  : undefined,
              borderLeft:
                corner === "tl" || corner === "bl"
                  ? "1.5px solid currentColor"
                  : undefined,
              borderRight:
                corner === "tr" || corner === "br"
                  ? "1.5px solid currentColor"
                  : undefined,
              top: corner === "tl" || corner === "tr" ? -1 : "auto",
              bottom: corner === "bl" || corner === "br" ? -1 : "auto",
              left: corner === "tl" || corner === "bl" ? -1 : "auto",
              right: corner === "tr" || corner === "br" ? -1 : "auto",
            }}
          />
        ))}

        {/* Header strip */}
        <header
          className="flex items-center justify-between mb-8"
          style={{ fontFamily: "var(--co-font-mono)" }}
        >
          <span
            className="co-label"
            style={{ color: "var(--co-muted)" }}
          >
            [ ERROR · 404 ]
          </span>
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="co-404-pulse-dot"
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                background: "var(--co-amber)",
                boxShadow: "0 0 6px var(--co-amber)",
              }}
            />
            <span
              className="co-label"
              style={{ color: "var(--co-amber)" }}
            >
              SIGNAL LOST
            </span>
          </span>
        </header>

        {/* Display number */}
        <div
          className="co-display co-404-flicker"
          style={{
            fontSize: "clamp(96px, 18vw, 192px)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            color: "var(--co-amber)",
            textShadow:
              "0 0 12px rgba(255, 181, 71, 0.45), 0 0 32px rgba(255, 181, 71, 0.2)",
          }}
        >
          404
        </div>

        {/* Subhead */}
        <h1
          className="co-display"
          style={{
            fontSize: "clamp(20px, 3vw, 28px)",
            lineHeight: 1,
            marginTop: 20,
            letterSpacing: "-0.01em",
            color: "var(--co-text)",
          }}
        >
          NO TRACE ON THIS NET.
        </h1>

        {/* Body */}
        <p
          style={{
            marginTop: 14,
            color: "var(--co-text-dim)",
            fontSize: 15,
            lineHeight: 1.55,
            maxWidth: "44ch",
          }}
        >
          The route you requested isn&rsquo;t routed on this board. The page may
          have been re&middot;spun, the signal cut, or the URL miswired.
        </p>

        {/* Action */}
        <div className="mt-10 flex flex-wrap items-center gap-5">
          <Link
            href="/"
            className="co-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.875rem 1.25rem",
              border: "1px solid var(--co-phosphor)",
              color: "var(--co-phosphor)",
              background: "transparent",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontSize: 12,
              transition:
                "background 180ms ease, color 180ms ease, box-shadow 180ms ease",
            }}
          >
            <span aria-hidden="true">&larr;</span>
            <span>RETURN TO HOME</span>
          </Link>

          <span
            className="co-mono"
            style={{
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "var(--co-muted)",
            }}
          >
            HTTP/1.1 · 404 NOT FOUND
          </span>
        </div>

        {/* Footer signature */}
        <footer
          className="mt-12 flex items-center justify-between"
          style={{
            paddingTop: 14,
            borderTop: "1px solid var(--co-border)",
            fontFamily: "var(--co-font-mono)",
            fontSize: 10,
            letterSpacing: "0.18em",
            color: "var(--co-muted)",
          }}
        >
          <span>REV 01 &middot; CIRCUIT/ORACLE</span>
          <span>FAULT CODE · E-404</span>
        </footer>
      </article>
    </main>
  );
}
