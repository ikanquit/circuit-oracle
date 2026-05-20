import type { JSX } from "react";

export default function Loading(): JSX.Element {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="relative min-h-screen flex items-center justify-center px-6 py-16"
      style={{
        background: "var(--co-bg)",
        color: "var(--co-text)",
        fontFamily: "var(--co-font-body)",
      }}
    >
      <style>{`
        @keyframes co-load-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.25; }
        }
        @keyframes co-load-bar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(220%); }
        }
        .co-load-blink {
          animation: co-load-blink 1.1s ease-in-out infinite;
        }
        .co-load-bar {
          animation: co-load-bar 1.8s cubic-bezier(0.65, 0.05, 0.36, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .co-load-blink, .co-load-bar {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="relative w-full max-w-md text-center"
        style={{
          background: "var(--co-surface)",
          border: "1px solid var(--co-border-strong)",
          padding: "32px 28px",
        }}
      >
        <div
          className="co-mono co-label"
          style={{
            color: "var(--co-muted)",
            marginBottom: 12,
          }}
        >
          [ SYSTEM BOOT ]
        </div>

        <div
          className="co-display"
          style={{
            fontSize: "clamp(28px, 5vw, 40px)",
            lineHeight: 1,
            color: "var(--co-phosphor)",
            textShadow:
              "0 0 10px rgba(198, 255, 77, 0.4), 0 0 22px rgba(198, 255, 77, 0.15)",
            letterSpacing: "-0.01em",
          }}
        >
          LOADING<span className="co-load-blink" aria-hidden="true">_</span>
        </div>

        <div
          className="relative mt-6"
          aria-hidden="true"
          style={{
            width: "100%",
            height: 4,
            background: "var(--co-surface-3)",
            border: "1px solid rgba(0, 0, 0, 0.4)",
            overflow: "hidden",
          }}
        >
          <div
            className="co-load-bar"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "30%",
              background:
                "linear-gradient(90deg, transparent 0%, var(--co-phosphor) 50%, transparent 100%)",
              boxShadow: "0 0 10px rgba(198, 255, 77, 0.55)",
            }}
          />
        </div>

        <div
          className="co-mono"
          style={{
            marginTop: 16,
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "var(--co-text-dim)",
            textTransform: "uppercase",
          }}
        >
          ACQUIRING SIGNAL
        </div>
      </div>
    </main>
  );
}
