"use client";

import type { JSX } from "react";
import HeroSpecimen from "@/components/v2/HeroSpecimen";

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
      className="relative w-full min-h-[92vh] px-6 sm:px-12 pt-10 sm:pt-14 pb-28 overflow-hidden"
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
        @keyframes co-hero-flicker {
          0%, 92%, 100%   { opacity: 1; }
          93%             { opacity: 0.55; }
          94%             { opacity: 1; }
          96%             { opacity: 0.7; }
          97%             { opacity: 1; }
        }
        @keyframes co-hero-caret {
          0%, 49%   { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes co-hero-meter {
          0%   { transform: scaleX(0); }
          70%  { transform: scaleX(1); }
          100% { transform: scaleX(1); }
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
          padding: 0.95rem 1.35rem;
          border: 1px solid var(--co-phosphor);
          color: var(--co-phosphor);
          background: transparent;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.82rem;
          font-weight: 500;
          transition: background-color 180ms ease, color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
          cursor: pointer;
          box-shadow: 0 0 0 0 var(--co-phosphor), inset 0 0 0 1px rgba(198,255,77,0.0);
        }
        .co-hero-cta::before {
          content: "";
          position: absolute;
          inset: -1px;
          border: 1px solid var(--co-phosphor);
          opacity: 0.25;
          transform: translate(3px, 3px);
          pointer-events: none;
          transition: transform 180ms ease, opacity 180ms ease;
        }
        .co-hero-cta:hover {
          background: var(--co-phosphor);
          color: var(--co-bg);
          box-shadow: 0 0 32px -6px var(--co-phosphor);
        }
        .co-hero-cta:hover::before {
          transform: translate(5px, 5px);
          opacity: 0.5;
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
          color: var(--co-text-dim, rgba(230, 230, 230, 0.65));
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
          line-height: 0.86;
          letter-spacing: -0.035em;
          font-weight: 900;
          font-size: clamp(44px, 10vw, 116px);
          margin: 0;
        }
        @media (min-width: 1024px) {
          /* At lg the headline shares row with the specimen (7 of 12 cols) */
          .co-hero-headline {
            font-size: clamp(72px, 7vw, 116px);
          }
        }
        .co-hero-outline {
          color: transparent;
          -webkit-text-stroke: 1px var(--co-text-dim, rgba(230, 230, 230, 0.45));
        }
        .co-hero-glow {
          color: var(--co-phosphor);
          text-shadow:
            0 0 8px rgba(198, 255, 77, 0.55),
            0 0 24px rgba(198, 255, 77, 0.28),
            0 0 60px rgba(198, 255, 77, 0.14);
          animation: co-hero-flicker 7s ease-in-out infinite;
        }
        .co-hero-caret {
          display: inline-block;
          width: 0.6ch;
          height: 0.78em;
          background: var(--co-phosphor);
          margin-left: 0.12em;
          vertical-align: -0.08em;
          animation: co-hero-caret 1.05s steps(1, end) infinite;
          box-shadow: 0 0 8px var(--co-phosphor);
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
          max-width: 38rem;
          font-size: clamp(15px, 1.15vw, 18px);
          line-height: 1.55;
          color: var(--co-text-dim, rgba(230, 230, 230, 0.82));
        }
        .co-hero-subdeck strong {
          color: var(--co-text);
          font-weight: 500;
        }
        .co-hero-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.32rem 0.6rem;
          border: 1px solid var(--co-text-dim, rgba(230, 230, 230, 0.18));
          color: var(--co-text-dim, rgba(230, 230, 230, 0.75));
        }
        .co-hero-bracket {
          color: var(--co-phosphor);
        }
        .co-hero-hud {
          border-top: 1px solid var(--co-text-dim, rgba(230, 230, 230, 0.12));
        }
        .co-hero-proof {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 0;
          border: 1px solid var(--co-border-strong, rgba(255,255,255,0.12));
          background: color-mix(in srgb, var(--co-surface) 70%, transparent);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }
        .co-hero-proof-cell {
          padding: 0.85rem 1rem;
          border-right: 1px solid var(--co-border-strong, rgba(255,255,255,0.08));
          min-width: 0;
        }
        .co-hero-proof-cell:last-child {
          border-right: none;
        }
        .co-hero-proof-num {
          font-family: var(--co-font-display);
          font-weight: 900;
          font-size: clamp(28px, 3.4vw, 44px);
          line-height: 1;
          letter-spacing: -0.02em;
          color: var(--co-text);
        }
        .co-hero-proof-num .unit {
          font-family: var(--co-font-mono);
          font-size: 0.4em;
          font-weight: 500;
          letter-spacing: 0.08em;
          color: var(--co-phosphor);
          margin-left: 0.35em;
          vertical-align: 0.6em;
        }
        .co-hero-proof-meter {
          margin-top: 0.55rem;
          height: 2px;
          background: rgba(255,255,255,0.06);
          position: relative;
          overflow: hidden;
        }
        .co-hero-proof-meter::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, var(--co-phosphor), color-mix(in srgb, var(--co-phosphor) 30%, transparent));
          transform-origin: left;
          animation: co-hero-meter 1400ms cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: var(--meter-delay, 900ms);
        }
        .co-hero-proof-label {
          margin-top: 0.6rem;
          font-family: var(--co-font-mono);
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--co-muted);
        }
        @media (max-width: 640px) {
          .co-hero-proof {
            grid-template-columns: 1fr;
          }
          .co-hero-proof-cell {
            border-right: none;
            border-bottom: 1px solid var(--co-border-strong, rgba(255,255,255,0.08));
          }
          .co-hero-proof-cell:last-child {
            border-bottom: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .co-hero-rise {
            opacity: 1 !important;
            animation: none !important;
            transform: none !important;
          }
          .co-hero-dot,
          .co-hero-glow,
          .co-hero-caret {
            animation: none !important;
          }
          .co-hero-proof-meter::after {
            animation: none !important;
            transform: scaleX(1) !important;
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
          <span className="hidden md:inline co-hero-marker-blue">
            CLAUDE SONNET 4.6
          </span>
          <span className="hidden md:inline opacity-50">/</span>
          <span className="hidden sm:inline">4 AGENTS &middot; PARALLEL</span>
          <span className="opacity-50">/</span>
          <span className="co-hero-marker">T+00:00:14</span>
        </span>
      </div>

      {/* Main content */}
      <div className="relative mt-10 sm:mt-14 grid grid-cols-12 gap-6 lg:gap-8">
        {/* Left rail: small meta column */}
        <aside
          className="co-hero-rise co-mono co-label hidden lg:flex col-span-1 flex-col gap-3 pt-4 text-[10px] tracking-[0.2em]"
          style={rise(80)}
        >
          <span className="co-hero-marker">001</span>
          <span className="h-12 w-px bg-current opacity-30" />
          <span className="opacity-60 [writing-mode:vertical-rl] rotate-180">
            FIELD MANUAL / I
          </span>
        </aside>

        {/* Headline + copy */}
        <div className="col-span-12 lg:col-span-7">
          <h1 className="co-display co-hero-headline select-none">
            <span className="co-hero-rise block" style={rise(120)}>
              ANY SCHEMATIC.
            </span>
            <span className="co-hero-rise block" style={rise(220)}>
              <span className="co-hero-outline">EXPLAINED LIKE A</span>
            </span>
            <span className="co-hero-rise block" style={rise(320)}>
              <span className="co-hero-glow">SENIOR</span> ENGINEER
              <span className="co-hero-caret" aria-hidden="true" />
            </span>
          </h1>

          {/* Sub-deck + action row */}
          <div className="mt-9 sm:mt-12 flex flex-col gap-7">
            <p className="co-hero-rise co-hero-subdeck" style={rise(440)}>
              Paste a photo, screenshot, or PNG of any analog or mixed-signal
              schematic. <strong>Three Claude agents</strong> dissect
              components, topology, and intended use in parallel &mdash; a
              fourth synthesizes them into the brief you&rsquo;d hand a
              junior engineer before a design review.
            </p>

            <div
              className="co-hero-rise flex flex-wrap items-center gap-5 sm:gap-6"
              style={rise(540)}
            >
              <button
                type="button"
                onClick={onCtaClick}
                aria-label="Upload schematic"
                className="co-mono co-hero-cta"
              >
                <span>[ DROP A SCHEMATIC</span>
                <span className="co-hero-cta-arrow" aria-hidden="true">
                  &rarr;
                </span>
                <span>]</span>
              </button>

              <a
                href="#sample-archive"
                className="co-mono co-label text-[11px] co-hero-link"
              >
                or see one we already read
              </a>
            </div>

            {/* Proof row */}
            <div
              className="co-hero-rise co-hero-proof"
              style={rise(700)}
              aria-label="Proof metrics"
            >
              <div className="co-hero-proof-cell">
                <div className="co-hero-proof-num">
                  ~45<span className="unit">s</span>
                </div>
                <div
                  className="co-hero-proof-meter"
                  aria-hidden="true"
                  style={{ ["--meter-delay" as string]: "900ms" }}
                />
                <div className="co-hero-proof-label">end-to-end brief</div>
              </div>
              <div className="co-hero-proof-cell">
                <div className="co-hero-proof-num">
                  3<span className="unit">// parallel</span>
                </div>
                <div
                  className="co-hero-proof-meter"
                  aria-hidden="true"
                  style={{ ["--meter-delay" as string]: "1100ms" }}
                />
                <div className="co-hero-proof-label">specialist agents</div>
              </div>
              <div className="co-hero-proof-cell">
                <div className="co-hero-proof-num">
                  0<span className="unit">// signup</span>
                </div>
                <div
                  className="co-hero-proof-meter"
                  aria-hidden="true"
                  style={{ ["--meter-delay" as string]: "1300ms" }}
                />
                <div className="co-hero-proof-label">just paste an image</div>
              </div>
            </div>

            {/* Status line */}
            <div
              className="co-hero-rise co-mono co-label flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] sm:text-[11px] tracking-[0.2em]"
              style={rise(820)}
            >
              <span className="co-hero-dot" aria-hidden="true" />
              <span>SYSTEM ONLINE</span>
              <span className="opacity-40">&middot;</span>
              <span>STREAMING SSE</span>
              <span className="opacity-40">&middot;</span>
              <span>NO ACCOUNT REQUIRED</span>
              <span className="opacity-40 hidden sm:inline">&middot;</span>
              <span className="co-hero-marker hidden sm:inline">BUILD 0928</span>
            </div>
          </div>
        </div>

        {/* Specimen visual */}
        <div
          className="co-hero-rise col-span-12 lg:col-span-4 lg:col-start-9 flex items-start lg:justify-end"
          style={rise(380)}
        >
          <HeroSpecimen />
        </div>
      </div>

      {/* Bottom HUD strip */}
      <div
        className="co-hero-rise co-mono co-hero-hud absolute left-0 right-0 bottom-0 px-6 sm:px-12 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-6 text-[9px] sm:text-[10px] tracking-[0.22em] uppercase"
        style={rise(920)}
      >
        <span className="opacity-80">
          <span className="opacity-50">PIPELINE &middot;</span>{" "}
          COMPONENT{" "}
          <span style={{ color: "var(--co-phosphor)" }}>&#9656;</span>{" "}
          TOPOLOGY{" "}
          <span style={{ color: "var(--co-phosphor)" }}>&#9656;</span>{" "}
          DOMAIN{" "}
          <span style={{ color: "var(--co-phosphor)" }}>&#9656;</span>{" "}
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
          <span>TOKEN-STREAMED OUTPUT</span>
        </span>
        <span className="opacity-80">
          <span className="opacity-50">MODEL:</span>{" "}
          <span style={{ color: "var(--co-text)" }}>claude-sonnet-4-6</span>
        </span>
      </div>
    </section>
  );
}
