"use client";

import type { JSX } from "react";

/**
 * HeroSpecimen
 * ------------
 * A small, decorative "schematic-under-analysis" visual for the hero.
 * Renders a tiny stylized op-amp circuit being scanned by an animated
 * crosshair, with three agent callouts that light up in sequence.
 *
 * Pure SVG + CSS keyframes — no JS animation, no dependencies.
 * Hidden on small screens; lights up at lg.
 */
export default function HeroSpecimen(): JSX.Element {
  return (
    <div
      className="co-specimen"
      aria-hidden="true"
      role="presentation"
    >
      <style>{`
        .co-specimen {
          position: relative;
          width: 100%;
          max-width: 360px;
          aspect-ratio: 4 / 5;
          border: 1px solid var(--co-border-strong, rgba(255,255,255,0.18));
          background:
            linear-gradient(
              to bottom,
              color-mix(in srgb, var(--co-blueprint) 6%, var(--co-surface)) 0%,
              var(--co-surface) 100%
            );
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow: hidden;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.4),
            0 18px 60px -28px rgba(198,255,77,0.18),
            inset 0 1px 0 rgba(255,255,255,0.04);
        }
        .co-specimen::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(79,158,255,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(79,158,255,0.07) 1px, transparent 1px);
          background-size: 18px 18px;
          pointer-events: none;
        }
        .co-specimen-corner {
          position: absolute;
          width: 10px;
          height: 10px;
          border: 1px solid var(--co-phosphor);
        }
        .co-specimen-corner.tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
        .co-specimen-corner.tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
        .co-specimen-corner.bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
        .co-specimen-corner.br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

        .co-specimen-header {
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--co-font-mono);
          font-size: 9px;
          letter-spacing: 0.18em;
          color: var(--co-muted);
          text-transform: uppercase;
        }
        .co-specimen-header .specimen-id {
          color: var(--co-amber);
        }
        .co-specimen-stage {
          position: relative;
          flex: 1;
          min-height: 0;
        }
        .co-specimen-svg {
          width: 100%;
          height: 100%;
          display: block;
        }
        .co-specimen-trace {
          stroke: var(--co-blueprint);
          stroke-width: 1.2;
          fill: none;
          opacity: 0.85;
        }
        .co-specimen-trace.live {
          stroke: var(--co-phosphor);
          stroke-dasharray: 80;
          stroke-dashoffset: 80;
          animation: co-specimen-draw 3.4s ease-in-out infinite;
          filter: drop-shadow(0 0 4px rgba(198,255,77,0.55));
        }
        @keyframes co-specimen-draw {
          0%   { stroke-dashoffset: 80; opacity: 0.35; }
          25%  { stroke-dashoffset: 0;  opacity: 1; }
          70%  { stroke-dashoffset: 0;  opacity: 1; }
          100% { stroke-dashoffset: -80; opacity: 0.35; }
        }
        .co-specimen-part {
          stroke: var(--co-text-dim);
          stroke-width: 1;
          fill: none;
        }
        .co-specimen-part-fill {
          fill: var(--co-surface-2);
          stroke: var(--co-text-dim);
          stroke-width: 1;
        }
        .co-specimen-label {
          font-family: var(--co-font-mono);
          font-size: 8px;
          letter-spacing: 0.1em;
          fill: var(--co-text-dim);
          text-transform: uppercase;
        }
        .co-specimen-label.accent {
          fill: var(--co-phosphor);
        }
        .co-specimen-node {
          fill: var(--co-amber);
        }
        .co-specimen-node.live {
          fill: var(--co-phosphor);
          animation: co-specimen-pulse 1.6s ease-in-out infinite;
          filter: drop-shadow(0 0 3px var(--co-phosphor));
        }
        @keyframes co-specimen-pulse {
          0%, 100% { r: 2.2; opacity: 1; }
          50%      { r: 3.2; opacity: 0.55; }
        }

        /* scanning crosshair */
        .co-specimen-scanner {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .co-specimen-scan-h {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent 0%,
            var(--co-phosphor) 50%,
            transparent 100%
          );
          opacity: 0.55;
          box-shadow: 0 0 8px var(--co-phosphor);
          animation: co-specimen-scan-v 4.2s ease-in-out infinite alternate;
        }
        @keyframes co-specimen-scan-v {
          0%   { top: 8%; }
          100% { top: 92%; }
        }

        /* Agent callout tags */
        .co-specimen-callout {
          position: absolute;
          font-family: var(--co-font-mono);
          font-size: 8.5px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding: 3px 6px;
          border: 1px solid currentColor;
          background: color-mix(in srgb, var(--co-bg) 80%, transparent);
          backdrop-filter: blur(2px);
          animation: co-specimen-callout 6s ease-in-out infinite;
          opacity: 0;
          white-space: nowrap;
        }
        .co-specimen-callout::before {
          content: "";
          position: absolute;
          width: 14px;
          height: 1px;
          background: currentColor;
          top: 50%;
        }
        @keyframes co-specimen-callout {
          0%, 100% { opacity: 0; transform: translateY(2px); }
          10%, 30% { opacity: 1; transform: translateY(0); }
          40%      { opacity: 0; }
        }
        .co-specimen-callout.c1 {
          color: var(--co-phosphor);
          top: 18%;
          left: 8%;
          animation-delay: 0s;
        }
        .co-specimen-callout.c1::before {
          right: -16px;
          width: 14px;
        }
        .co-specimen-callout.c2 {
          color: var(--co-blueprint);
          top: 46%;
          right: 6%;
          animation-delay: 1.6s;
        }
        .co-specimen-callout.c2::before {
          left: -16px;
          width: 14px;
        }
        .co-specimen-callout.c3 {
          color: var(--co-amber);
          bottom: 14%;
          left: 14%;
          animation-delay: 3.2s;
        }
        .co-specimen-callout.c3::before {
          right: -16px;
          width: 14px;
        }

        /* footer status strip */
        .co-specimen-footer {
          position: relative;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 6px;
          padding-top: 8px;
          border-top: 1px solid var(--co-border, rgba(255,255,255,0.08));
          font-family: var(--co-font-mono);
          font-size: 9px;
          letter-spacing: 0.16em;
          color: var(--co-muted);
          text-transform: uppercase;
        }
        .co-specimen-footer .co-specimen-bar {
          position: relative;
          height: 2px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
        }
        .co-specimen-footer .co-specimen-bar::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            transparent,
            var(--co-phosphor),
            transparent
          );
          width: 30%;
          animation: co-specimen-bar 2.4s linear infinite;
        }
        @keyframes co-specimen-bar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .co-specimen-trace.live,
          .co-specimen-node.live,
          .co-specimen-scan-h,
          .co-specimen-callout,
          .co-specimen-footer .co-specimen-bar::after {
            animation: none !important;
          }
          .co-specimen-callout { opacity: 1; }
          .co-specimen-trace.live { stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>

      <span className="co-specimen-corner tl" />
      <span className="co-specimen-corner tr" />
      <span className="co-specimen-corner bl" />
      <span className="co-specimen-corner br" />

      <div className="co-specimen-header">
        <span>
          <span style={{ color: "var(--co-phosphor)" }}>&#9656;</span>{" "}
          SPECIMEN
        </span>
        <span className="specimen-id">S-001 / TL072</span>
      </div>

      <div className="co-specimen-stage">
        <svg
          className="co-specimen-svg"
          viewBox="0 0 200 220"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Power rail */}
          <line
            x1="10"
            y1="20"
            x2="190"
            y2="20"
            className="co-specimen-trace"
          />
          <text x="12" y="14" className="co-specimen-label">
            +Vcc
          </text>

          {/* Ground rail */}
          <line
            x1="10"
            y1="200"
            x2="190"
            y2="200"
            className="co-specimen-trace"
          />
          <text x="12" y="214" className="co-specimen-label">
            GND
          </text>

          {/* Input signal */}
          <line
            x1="10"
            y1="110"
            x2="55"
            y2="110"
            className="co-specimen-trace live"
          />
          <text x="12" y="104" className="co-specimen-label accent">
            Vin
          </text>

          {/* R1 input resistor */}
          <rect
            x="55"
            y="104"
            width="22"
            height="12"
            className="co-specimen-part-fill"
          />
          <text x="56" y="100" className="co-specimen-label">
            R1 10k
          </text>

          {/* Wire to op-amp − input */}
          <line
            x1="77"
            y1="110"
            x2="100"
            y2="110"
            className="co-specimen-trace"
          />

          {/* Feedback resistor path */}
          <line
            x1="90"
            y1="110"
            x2="90"
            y2="60"
            className="co-specimen-trace"
          />
          <line
            x1="90"
            y1="60"
            x2="150"
            y2="60"
            className="co-specimen-trace"
          />
          <rect
            x="118"
            y="54"
            width="22"
            height="12"
            className="co-specimen-part-fill"
          />
          <text x="116" y="50" className="co-specimen-label">
            Rf 100k
          </text>
          <line
            x1="150"
            y1="60"
            x2="150"
            y2="110"
            className="co-specimen-trace"
          />

          {/* Op-amp triangle */}
          <polygon
            points="100,90 100,140 140,115"
            className="co-specimen-part-fill"
          />
          <text x="104" y="105" className="co-specimen-label">
            −
          </text>
          <text x="104" y="135" className="co-specimen-label">
            +
          </text>
          <text x="104" y="155" className="co-specimen-label accent">
            U1 TL072
          </text>

          {/* + input to ground */}
          <line
            x1="100"
            y1="130"
            x2="80"
            y2="130"
            className="co-specimen-trace"
          />
          <line
            x1="80"
            y1="130"
            x2="80"
            y2="180"
            className="co-specimen-trace"
          />
          <line
            x1="60"
            y1="180"
            x2="100"
            y2="180"
            className="co-specimen-trace"
          />

          {/* Output */}
          <line
            x1="140"
            y1="115"
            x2="190"
            y2="115"
            className="co-specimen-trace live"
          />
          <text x="168" y="108" className="co-specimen-label accent">
            Vout
          </text>

          {/* Nodes */}
          <circle cx="55" cy="110" r="2.2" className="co-specimen-node" />
          <circle cx="90" cy="110" r="2.2" className="co-specimen-node live" />
          <circle cx="150" cy="60" r="2.2" className="co-specimen-node" />
          <circle cx="150" cy="115" r="2.2" className="co-specimen-node live" />
          <circle cx="80" cy="180" r="2.2" className="co-specimen-node" />
        </svg>

        {/* Scanning beam */}
        <div className="co-specimen-scanner">
          <div className="co-specimen-scan-h" />
        </div>

        {/* Agent callouts */}
        <span className="co-specimen-callout c1">
          &#9656; COMPONENT &middot; TL072 IDENTIFIED
        </span>
        <span className="co-specimen-callout c2">
          &#9656; TOPOLOGY &middot; INVERTING AMP, &minus;10&times;
        </span>
        <span className="co-specimen-callout c3">
          &#9656; DOMAIN &middot; AUDIO PREAMP
        </span>
      </div>

      <div className="co-specimen-footer">
        <div className="co-specimen-bar" aria-hidden="true" />
        <span style={{ color: "var(--co-phosphor)" }}>READING</span>
      </div>
    </div>
  );
}
