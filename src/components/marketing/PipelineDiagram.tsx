import type { JSX } from "react";

/**
 * Static, server-rendered pipeline diagram for /how-it-works.
 *
 * Goal: an EE Twitter account would screenshot this and quote-tweet it.
 * Renders as inline SVG so it stays crisp at any zoom and has no JS cost.
 */

const AGENT_SLOTS: ReadonlyArray<{
  pn: string;
  label: string;
  role: string;
  x: number;
}> = [
  { pn: "CO-7401N", label: "COMPONENT", role: "counts parts", x: 110 },
  { pn: "CO-7402T", label: "TOPOLOGY", role: "traces nets", x: 320 },
  { pn: "CO-7403D", label: "DOMAIN", role: "names purpose", x: 530 },
];

export default function PipelineDiagram(): JSX.Element {
  return (
    <figure
      style={{
        margin: 0,
        padding: "28px 20px 20px",
        border: "1px solid var(--co-border-strong)",
        backgroundColor: "var(--co-surface)",
        position: "relative",
      }}
      aria-label="Diagram of CircuitOracle's four-agent pipeline"
    >
      <div
        className="co-label"
        style={{
          color: "var(--co-muted)",
          marginBottom: "16px",
          fontSize: "10px",
          letterSpacing: "0.18em",
        }}
      >
        [ FIG. 01 · ORCHESTRATION TOPOLOGY ]
      </div>

      <svg
        viewBox="0 0 740 360"
        width="100%"
        height="auto"
        role="img"
        aria-label="Schematic image fans into three parallel agents whose outputs converge into a synthesis agent that streams tokens to the browser"
        style={{ display: "block" }}
      >
        <defs>
          <marker
            id="co-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#c6ff4d" />
          </marker>
          <marker
            id="co-arrow-amber"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#ffb547" />
          </marker>
        </defs>

        {/* Background dot grid */}
        <pattern id="co-dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.6" fill="rgba(198,255,77,0.08)" />
        </pattern>
        <rect x="0" y="0" width="740" height="360" fill="url(#co-dots)" />

        {/* INPUT — schematic image */}
        <g>
          <rect
            x="20"
            y="150"
            width="80"
            height="60"
            fill="#0c0e12"
            stroke="#4f9eff"
            strokeWidth="1.5"
          />
          <text
            x="60"
            y="135"
            textAnchor="middle"
            fill="#4f9eff"
            fontFamily="JetBrains Mono, monospace"
            fontSize="10"
            letterSpacing="1.6"
          >
            INPUT
          </text>
          <text
            x="60"
            y="184"
            textAnchor="middle"
            fill="#f0eee6"
            fontFamily="JetBrains Mono, monospace"
            fontSize="11"
            letterSpacing="1"
          >
            IMG
          </text>
          <text
            x="60"
            y="200"
            textAnchor="middle"
            fill="#b8b6ad"
            fontFamily="JetBrains Mono, monospace"
            fontSize="8"
            letterSpacing="1.2"
          >
            PNG · 10MB
          </text>
        </g>

        {/* Fan-out lines from input to each agent */}
        {AGENT_SLOTS.map((slot) => (
          <line
            key={`in-${slot.pn}`}
            x1="100"
            y1="180"
            x2={slot.x - 60}
            y2={slot.x === 110 ? 90 : slot.x === 320 ? 180 : 270}
            stroke="#c6ff4d"
            strokeWidth="1.3"
            strokeDasharray="4 3"
            markerEnd="url(#co-arrow)"
            opacity="0.7"
          />
        ))}

        {/* Three parallel agents — stacked vertically at fixed x=240 */}
        {AGENT_SLOTS.map((slot, idx) => {
          const cy = idx === 0 ? 60 : idx === 1 ? 150 : 240;
          return (
            <g key={slot.pn}>
              <rect
                x={slot.x - 60}
                y={cy}
                width="160"
                height="60"
                fill="#14171c"
                stroke="#c6ff4d"
                strokeWidth="1.5"
              />
              {/* IC pins, left & right (small ticks) */}
              {[0, 1, 2].map((p) => (
                <g key={`pin-${slot.pn}-${p}`}>
                  <line
                    x1={slot.x - 66}
                    y1={cy + 14 + p * 16}
                    x2={slot.x - 60}
                    y2={cy + 14 + p * 16}
                    stroke="#c6ff4d"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={slot.x + 100}
                    y1={cy + 14 + p * 16}
                    x2={slot.x + 106}
                    y2={cy + 14 + p * 16}
                    stroke="#c6ff4d"
                    strokeWidth="1.5"
                  />
                </g>
              ))}
              <text
                x={slot.x + 20}
                y={cy + 24}
                textAnchor="middle"
                fill="#c6ff4d"
                fontFamily="JetBrains Mono, monospace"
                fontSize="13"
                fontWeight="700"
                letterSpacing="1.4"
              >
                {slot.label}
              </text>
              <text
                x={slot.x + 20}
                y={cy + 42}
                textAnchor="middle"
                fill="#b8b6ad"
                fontFamily="JetBrains Mono, monospace"
                fontSize="9"
                letterSpacing="0.8"
              >
                {slot.role}
              </text>
              <text
                x={slot.x + 20}
                y={cy + 55}
                textAnchor="middle"
                fill="#6a6c75"
                fontFamily="JetBrains Mono, monospace"
                fontSize="8"
                letterSpacing="1"
              >
                {slot.pn}
              </text>
            </g>
          );
        })}

        {/* Converging lines into synthesis */}
        {AGENT_SLOTS.map((slot, idx) => {
          const cyOut = idx === 0 ? 90 : idx === 1 ? 180 : 270;
          return (
            <line
              key={`out-${slot.pn}`}
              x1={slot.x + 106}
              y1={cyOut}
              x2="640"
              y2="180"
              stroke="#c6ff4d"
              strokeWidth="1.3"
              strokeDasharray="4 3"
              markerEnd="url(#co-arrow)"
              opacity="0.7"
            />
          );
        })}

        {/* SYNTHESIS agent */}
        <g>
          <rect
            x="640"
            y="150"
            width="80"
            height="60"
            fill="#14171c"
            stroke="#ffb547"
            strokeWidth="2"
          />
          <text
            x="680"
            y="135"
            textAnchor="middle"
            fill="#ffb547"
            fontFamily="JetBrains Mono, monospace"
            fontSize="10"
            letterSpacing="1.6"
          >
            SYNTHESIS
          </text>
          <text
            x="680"
            y="178"
            textAnchor="middle"
            fill="#f0eee6"
            fontFamily="JetBrains Mono, monospace"
            fontSize="11"
            letterSpacing="1"
          >
            CO-7499S
          </text>
          <text
            x="680"
            y="194"
            textAnchor="middle"
            fill="#b8b6ad"
            fontFamily="JetBrains Mono, monospace"
            fontSize="8"
            letterSpacing="1.2"
          >
            STREAMED
          </text>
        </g>

        {/* Output arrow + label */}
        <line
          x1="720"
          y1="180"
          x2="730"
          y2="180"
          stroke="#ffb547"
          strokeWidth="2"
          markerEnd="url(#co-arrow-amber)"
        />
        <text
          x="676"
          y="240"
          textAnchor="middle"
          fill="#ffb547"
          fontFamily="JetBrains Mono, monospace"
          fontSize="8"
          letterSpacing="1.4"
        >
          SSE → BROWSER
        </text>

        {/* Time axis tick */}
        <line
          x1="20"
          y1="320"
          x2="720"
          y2="320"
          stroke="#6a6c75"
          strokeWidth="0.5"
          strokeDasharray="2 4"
        />
        <text
          x="20"
          y="338"
          fill="#6a6c75"
          fontFamily="JetBrains Mono, monospace"
          fontSize="8"
          letterSpacing="1.4"
        >
          t = 0
        </text>
        <text
          x="350"
          y="338"
          textAnchor="middle"
          fill="#6a6c75"
          fontFamily="JetBrains Mono, monospace"
          fontSize="8"
          letterSpacing="1.4"
        >
          ~8–15s · PARALLEL × 3
        </text>
        <text
          x="680"
          y="338"
          textAnchor="middle"
          fill="#6a6c75"
          fontFamily="JetBrains Mono, monospace"
          fontSize="8"
          letterSpacing="1.4"
        >
          +30–45s · SYNTHESIS
        </text>
      </svg>

      <figcaption
        className="co-mono"
        style={{
          marginTop: "12px",
          color: "var(--co-muted)",
          fontSize: "10px",
          letterSpacing: "0.14em",
          textAlign: "right",
        }}
      >
        Promise.allSettled([component, topology, domain]) → synthesis
      </figcaption>
    </figure>
  );
}
