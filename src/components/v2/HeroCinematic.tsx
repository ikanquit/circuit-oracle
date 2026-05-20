"use client";

import type { JSX } from "react";

interface HeroCinematicProps {
  onCtaClick?: () => void;
}

export default function HeroCinematic({ onCtaClick }: HeroCinematicProps): JSX.Element {
  const rise = (delayMs: number): React.CSSProperties => ({
    animation: "co-hero-rise 800ms cubic-bezier(0.22, 1, 0.36, 1) both",
    animationDelay: `${delayMs}ms`,
  });

  return (
    <section
      className="relative w-full min-h-[85vh] px-6 sm:px-12 py-20 overflow-hidden"
      style={{ color: "var(--co-text)" }}
      aria-label="Circuit Oracle hero"
    >
      <style>{`
        @keyframes co-hero-rise {
          0% {
            opacity: 0;
            transform: translateY(12px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes co-hero-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .co-hero-rise {
          opacity: 0;
          will-change: opacity, transform;
        }
        .co-hero-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.25rem;
          border: 1px solid var(--co-phosphor);
          color: var(--co-phosphor);
          background: transparent;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.78rem;
          transition: background-color 180ms ease, color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
          cursor: pointer;
        }
        .co-hero-cta:hover {
          background: var(--co-phosphor);
          color: var(--co-bg);
          box-shadow: 0 0 32px -6px var(--co-phosphor);
        }
        .co-hero-cta:active {
          transform: translateY(1px);
        }
        .co-hero-cta-arrow {
          transition: transform 200ms ease;
          display: inline-block;
        }
        .co-hero-cta:hover .co-hero-cta-arrow {
          transform: translateX(4px);
        }
        .co-hero-link {
          position: relative;
          color: var(--co-text-dim, rgba(230, 230, 230, 0.6));
          letter-spacing: 0.05em;
          transition: color 180ms ease;
        }
        .co-hero-link:hover {
          color: var(--co-text);
        }
        .co-hero-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 1px;
          background: currentColor;
          transform: scaleX(0.4);
          transform-origin: left;
          transition: transform 240ms ease;
        }
        .co-hero-link:hover::after {
          transform: scaleX(1);
        }
        .co-hero-headline {
          font-family: var(--co-font-display);
          line-height: 0.85;
          letter-spacing: -0.04em;
          font-weight: 700;
          font-size: clamp(72px, 16vw, 220px);
          margin: 0;
        }
        .co-hero-outline {
          color: transparent;
          -webkit-text-stroke: 1px var(--co-text-dim, rgba(230, 230, 230, 0.45));
        }
        .co-hero-dot {
          display: inline-block;
          width: 0.45rem;
          height: 0.45rem;
          border-radius: 9999px;
          background: var(--co-phosphor);
          margin-right: 0.5rem;
          vertical-align: middle;
          animation: co-hero-pulse 2.2s ease-in-out infinite;
          box-shadow: 0 0 10px var(--co-phosphor);
        }
        .co-hero-marker {
          color: var(--co-amber);
        }
        .co-hero-marker-blue {
          color: var(--co-blueprint);
        }
        .co-hero-subdeck {
          max-width: 36rem;
          font-size: clamp(15px, 1.15vw, 18px);
          line-height: 1.55;
          color: var(--co-text-dim, rgba(230, 230, 230, 0.78));
        }
        .co-hero-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.3rem 0.55rem;
          border: 1px solid var(--co-text-dim, rgba(230, 230, 230, 0.18));
          color: var(--co-text-dim, rgba(230, 230, 230, 0.7));
        }
        .co-hero-bracket {
          color: var(--co-phosphor);
        }
        .co-hero-hud {
          border-top: 1px solid var(--co-text-dim, rgba(230, 230, 230, 0.12));
        }
        @media (prefers-reduced-motion: reduce) {
          .co-hero-rise {
            opacity: 1 !important;
            animation: none !important;
            transform: none !important;
          }
          .co-hero-dot {
            animation: none !important;
          }
        }
      `}</style>

      {/* Top row: badge + coordinate */}
      <div
        className="co-hero-rise co-mono co-label flex items-center justify-between text-[10px] sm:text-[11px]"
        style={rise(0)}
      >
        <span className="tracking-[0.18em]">
          <span className="co-hero-bracket">[</span>
          <span className="px-2">CIRCUIT/ORACLE &middot; v2.6</span>
          <span className="co-hero-bracket">]</span>
        </span>
        <span className="tracking-[0.18em] flex items-center gap-3 sm:gap-5">
          <span className="hidden sm:inline co-hero-marker-blue">47&deg;36&prime;35&Prime;N</span>
          <span className="hidden md:inline opacity-50">/</span>
          <span className="hidden md:inline">122&deg;19&prime;59&Prime;W</span>
          <span className="opacity-50">/</span>
          <span className="co-hero-marker">T+00:00:14</span>
        </span>
      </div>

      {/* Main content */}
      <div className="relative mt-16 sm:mt-24 grid grid-cols-12 gap-6">
        {/* Left rail: small meta column */}
        <aside
          className="co-hero-rise co-mono co-label hidden lg:flex col-span-1 flex-col gap-3 pt-4 text-[10px] tracking-[0.2em]"
          style={rise(80)}
        >
          <span className="co-hero-marker">001</span>
          <span className="h-12 w-px bg-current opacity-30" />
          <span className="opacity-60 [writing-mode:vertical-rl] rotate-180">FIELD MANUAL / I</span>
        </aside>

        {/* Headline stack */}
        <div className="col-span-12 lg:col-span-11">
          <h1 className="co-display co-hero-headline select-none">
            <span className="co-hero-rise block" style={rise(120)}>
              READ ANY
            </span>
            <span className="co-hero-rise block" style={rise(220)}>
              <span style={{ color: "var(--co-phosphor)" }}>C</span>IRCUIT
            </span>
            <span className="co-hero-rise co-hero-outline block" style={rise(320)}>
              INSTANTLY.
            </span>
          </h1>

          {/* Sub-deck + action row */}
          <div className="mt-10 sm:mt-14 flex flex-col gap-8">
            <p
              className="co-hero-rise co-hero-subdeck"
              style={rise(440)}
            >
              Four specialized AI agents reverse-engineer your schematic in
              parallel &mdash; components, topology, application domain &mdash;
              then synthesize an engineering-grade brief.
            </p>

            <div
              className="co-hero-rise flex flex-wrap items-center gap-6"
              style={rise(540)}
            >
              <button
                type="button"
                onClick={onCtaClick}
                className="co-mono co-hero-cta"
              >
                <span>[ UPLOAD SCHEMATIC</span>
                <span className="co-hero-cta-arrow" aria-hidden="true">
                  &rarr;
                </span>
                <span>]</span>
              </button>

              <a
                href="#sample"
                className="co-mono co-label text-[11px] co-hero-link"
              >
                view sample analysis
              </a>

              <span className="co-mono co-hero-chip text-[10px] tracking-[0.18em]">
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{ background: "var(--co-amber)" }}
                  aria-hidden="true"
                />
                NO ACCOUNT REQUIRED
              </span>
            </div>

            {/* Status line */}
            <div
              className="co-hero-rise co-mono co-label flex items-center gap-3 text-[10px] sm:text-[11px] tracking-[0.2em]"
              style={rise(640)}
            >
              <span className="co-hero-dot" aria-hidden="true" />
              <span>SYSTEM ONLINE</span>
              <span className="opacity-40">&middot;</span>
              <span>4 AGENTS</span>
              <span className="opacity-40">&middot;</span>
              <span>v2.6</span>
              <span className="opacity-40">&middot;</span>
              <span className="co-hero-marker">BUILD 0928</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom HUD strip */}
      <div
        className="co-hero-rise co-mono co-hero-hud absolute left-0 right-0 bottom-0 px-6 sm:px-12 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-6 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase"
        style={rise(740)}
      >
        <span className="opacity-80">
          <span className="opacity-50">PIPELINE &middot;</span>{" "}
          COMPONENT <span style={{ color: "var(--co-phosphor)" }}>&#9656;</span>{" "}
          TOPOLOGY <span style={{ color: "var(--co-phosphor)" }}>&#9656;</span>{" "}
          DOMAIN <span style={{ color: "var(--co-phosphor)" }}>&#9656;</span>{" "}
          SYNTHESIS
        </span>
        <span className="flex items-center gap-2">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{
              background: "var(--co-phosphor)",
              boxShadow: "0 0 8px var(--co-phosphor)",
            }}
            aria-hidden="true"
          />
          <span>STREAMING SSE</span>
        </span>
        <span className="opacity-80">
          <span className="opacity-50">MODEL:</span>{" "}
          <span style={{ color: "var(--co-text)" }}>claude-sonnet-4-6</span>
        </span>
      </div>
    </section>
  );
}
