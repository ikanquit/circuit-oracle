"use client";

import Link from "next/link";
import { useEffect, type JSX } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps): JSX.Element {
  useEffect(() => {
    // Surface error to console so devs can inspect. Never log image payloads,
    // but a generic error message + stack is fine here.
    console.error("[CircuitOracle] route error:", error);
  }, [error]);

  const digest = error.digest;

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
        @keyframes co-err-flicker {
          0%, 100% { opacity: 1; }
          12%      { opacity: 0.45; }
          14%      { opacity: 1; }
          42%      { opacity: 0.7; }
          44%      { opacity: 1; }
          70%      { opacity: 0.85; }
          72%      { opacity: 0.4; }
          74%      { opacity: 1; }
        }
        @keyframes co-err-pulse {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 1; }
        }
        .co-err-flicker {
          animation: co-err-flicker 3s steps(1, end) infinite;
        }
        .co-err-pulse-dot {
          animation: co-err-pulse 1.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .co-err-flicker, .co-err-pulse-dot {
            animation: none !important;
          }
        }
      `}</style>

      <article
        className="relative w-full max-w-2xl"
        style={{
          background: "var(--co-surface)",
          border: "1px solid var(--co-border-strong)",
          padding: "40px 36px",
          boxShadow:
            "0 0 0 1px rgba(255, 84, 84, 0.15), 0 0 36px -8px rgba(255, 84, 84, 0.45)",
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
              color: "var(--co-danger)",
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

        <header
          className="flex items-center justify-between mb-8"
          style={{ fontFamily: "var(--co-font-mono)" }}
        >
          <span
            className="co-label"
            style={{ color: "var(--co-muted)" }}
          >
            [ FAULT · 500 ]
          </span>
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="co-err-pulse-dot"
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                background: "var(--co-danger)",
                boxShadow: "0 0 6px var(--co-danger)",
              }}
            />
            <span
              className="co-label"
              style={{ color: "var(--co-danger)" }}
            >
              UNHANDLED EXCEPTION
            </span>
          </span>
        </header>

        <div
          className="co-display co-err-flicker"
          style={{
            fontSize: "clamp(72px, 14vw, 144px)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            color: "var(--co-danger)",
            textShadow:
              "0 0 12px rgba(255, 84, 84, 0.45), 0 0 32px rgba(255, 84, 84, 0.22)",
          }}
        >
          FAULT
        </div>

        <h1
          className="co-display"
          style={{
            fontSize: "clamp(20px, 3vw, 28px)",
            lineHeight: 1,
            marginTop: 18,
            letterSpacing: "-0.01em",
            color: "var(--co-text)",
          }}
        >
          UNEXPECTED ERROR IN CIRCUIT.
        </h1>

        <p
          style={{
            marginTop: 12,
            color: "var(--co-text-dim)",
            fontSize: 15,
            lineHeight: 1.55,
            maxWidth: "48ch",
          }}
        >
          Something tripped the breaker. Try again &mdash; if it keeps faulting,
          give it a minute and reload.
        </p>

        {digest ? (
          <div
            className="co-mono"
            style={{
              marginTop: 18,
              padding: "10px 12px",
              background: "var(--co-surface-2)",
              border: "1px solid var(--co-border)",
              fontSize: 11,
              letterSpacing: "0.12em",
              color: "var(--co-text-dim)",
              wordBreak: "break-all",
            }}
          >
            <span style={{ color: "var(--co-muted)" }}>TRACE&nbsp;ID&nbsp;·&nbsp;</span>
            {digest}
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-5">
          <button
            type="button"
            onClick={() => reset()}
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
              cursor: "pointer",
              transition:
                "background 180ms ease, color 180ms ease, box-shadow 180ms ease",
            }}
          >
            <span aria-hidden="true">&#x21bb;</span>
            <span>RETRY</span>
          </button>

          <Link
            href="/"
            className="co-mono"
            style={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--co-text-dim)",
              textDecoration: "underline",
              textDecorationColor: "var(--co-border-strong)",
              textUnderlineOffset: 4,
            }}
          >
            back to home
          </Link>
        </div>

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
          <span>FAULT CODE · E-500</span>
        </footer>
      </article>
    </main>
  );
}
