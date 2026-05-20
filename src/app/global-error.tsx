"use client";

import { useEffect, type JSX } from "react";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

// global-error replaces the root layout when something throws above it.
// It MUST include its own <html> and <body>.
export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps): JSX.Element {
  useEffect(() => {
    console.error("[CircuitOracle] global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "var(--co-bg, #050608)",
          color: "var(--co-text, #f0eee6)",
          fontFamily:
            "'Inter Tight', system-ui, -apple-system, 'Segoe UI', sans-serif",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 24px",
          }}
        >
          <article
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 640,
              background: "var(--co-surface, #0c0e12)",
              border: "1px solid var(--co-border-strong, rgba(255,255,255,0.12))",
              padding: "40px 36px",
              boxShadow:
                "0 0 0 1px rgba(255, 84, 84, 0.18), 0 0 36px -8px rgba(255, 84, 84, 0.5)",
            }}
          >
            <div
              style={{
                fontFamily:
                  "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--co-danger, #ff5454)",
                marginBottom: 24,
              }}
            >
              [ CRITICAL FAULT · 500 ]
            </div>

            <h1
              style={{
                fontFamily:
                  "'Big Shoulders Display', Impact, system-ui, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(56px, 12vw, 120px)",
                lineHeight: 0.85,
                letterSpacing: "-0.04em",
                color: "var(--co-danger, #ff5454)",
                margin: 0,
                textShadow:
                  "0 0 14px rgba(255, 84, 84, 0.4), 0 0 32px rgba(255, 84, 84, 0.2)",
              }}
            >
              CIRCUIT FAULT
            </h1>

            <p
              style={{
                marginTop: 16,
                color: "var(--co-text-dim, #b8b6ad)",
                fontSize: 15,
                lineHeight: 1.55,
                maxWidth: "48ch",
              }}
            >
              The application root threw an unhandled error. Reload to recover.
            </p>

            {error.digest ? (
              <div
                style={{
                  marginTop: 18,
                  padding: "10px 12px",
                  background: "var(--co-surface-2, #14171c)",
                  border:
                    "1px solid var(--co-border, rgba(255,255,255,0.06))",
                  fontFamily:
                    "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: "var(--co-text-dim, #b8b6ad)",
                  wordBreak: "break-all",
                }}
              >
                TRACE&nbsp;ID&nbsp;&middot;&nbsp;{error.digest}
              </div>
            ) : null}

            <div
              style={{
                marginTop: 32,
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={() => reset()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 1.25rem",
                  border: "1px solid var(--co-phosphor, #c6ff4d)",
                  color: "var(--co-phosphor, #c6ff4d)",
                  background: "transparent",
                  fontFamily:
                    "'JetBrains Mono', 'SF Mono', Menlo, Consolas, monospace",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                <span aria-hidden="true">&#x21bb;</span>
                <span>RELOAD</span>
              </button>
            </div>
          </article>
        </main>
      </body>
    </html>
  );
}
