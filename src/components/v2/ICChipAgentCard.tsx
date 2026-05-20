"use client";

import type { CSSProperties, JSX } from "react";

export type ChipStatus = "pending" | "running" | "done" | "error";

interface ICChipAgentCardProps {
  label: string;
  partNumber: string;
  status: ChipStatus;
  description?: string;
  durationMs?: number;
}

const PIN_COUNT_PER_SIDE = 4;

function statusWord(status: ChipStatus): string {
  switch (status) {
    case "pending":
      return "WAITING";
    case "running":
      return "RUNNING";
    case "done":
      return "DONE";
    case "error":
      return "ERROR";
  }
}

function statusColor(status: ChipStatus): string {
  switch (status) {
    case "pending":
      return "var(--co-muted)";
    case "running":
      return "var(--co-amber)";
    case "done":
      return "var(--co-phosphor)";
    case "error":
      return "var(--co-danger)";
  }
}

function bodyShadow(status: ChipStatus): string {
  switch (status) {
    case "running":
      return "0 0 0 1px rgba(255, 181, 71, 0.18), 0 0 24px -4px rgba(255, 181, 71, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.04)";
    case "done":
      return "0 0 0 1px rgba(198, 255, 77, 0.18), 0 0 26px -4px rgba(198, 255, 77, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.04)";
    case "error":
      return "0 0 0 1px rgba(255, 84, 84, 0.22), 0 0 26px -4px rgba(255, 84, 84, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.04)";
    case "pending":
    default:
      return "inset 0 1px 0 rgba(255, 255, 255, 0.03)";
  }
}

function labelColor(status: ChipStatus): string {
  switch (status) {
    case "pending":
      return "var(--co-text-dim)";
    case "running":
      return "var(--co-text)";
    case "done":
      return "var(--co-phosphor)";
    case "error":
      return "var(--co-danger)";
  }
}

export default function ICChipAgentCard({
  label,
  partNumber,
  status,
  description,
  durationMs,
}: ICChipAgentCardProps): JSX.Element {
  const pinIndices = Array.from({ length: PIN_COUNT_PER_SIDE }, (_, i) => i);

  const chipStyle: CSSProperties = {
    position: "relative",
    backgroundColor: "var(--co-surface-2)",
    border: "1px solid var(--co-border-strong)",
    borderRadius: 0,
    minHeight: 140,
    padding: "16px 20px",
    color: "var(--co-text)",
    boxShadow: bodyShadow(status),
    transition:
      "box-shadow 300ms ease, border-color 300ms ease, background-color 300ms ease",
    opacity: status === "pending" ? 0.78 : 1,
    backgroundImage:
      "radial-gradient(circle at 0% 0%, rgba(255,255,255,0.025), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.015) 0%, transparent 60%)",
  };

  const notchStyle: CSSProperties = {
    position: "absolute",
    top: -1,
    left: "50%",
    transform: "translateX(-50%)",
    width: 18,
    height: 9,
    background: "var(--co-bg)",
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    border: "1px solid var(--co-border-strong)",
    borderTop: "none",
    zIndex: 2,
  };

  const pinDotStyle: CSSProperties = {
    position: "absolute",
    top: 10,
    left: 12,
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "var(--co-phosphor)",
    opacity: 0.6,
    boxShadow: "0 0 6px rgba(198, 255, 77, 0.5)",
  };

  const pinBase: CSSProperties = {
    position: "absolute",
    width: 8,
    height: 14,
    background:
      "linear-gradient(180deg, #6b6e75 0%, #2a2c30 100%)",
    borderRadius: 1,
    boxShadow:
      "inset 0 1px 0 rgba(255, 255, 255, 0.18), inset 0 -1px 0 rgba(0, 0, 0, 0.5)",
  };

  // Distribute pins vertically with padding from the notch zone
  const renderPin = (side: "left" | "right", i: number) => {
    const topPercent = ((i + 1) / (PIN_COUNT_PER_SIDE + 1)) * 100;
    const style: CSSProperties = {
      ...pinBase,
      top: `${topPercent}%`,
      transform: "translateY(-50%)",
      ...(side === "left" ? { left: -6 } : { right: -6 }),
    };
    return <div key={`${side}-${i}`} aria-hidden="true" style={style} />;
  };

  const showFill = status === "done" || status === "error";
  const fillColor =
    status === "done"
      ? "var(--co-phosphor)"
      : status === "error"
      ? "var(--co-danger)"
      : "transparent";

  const meterReadout =
    durationMs !== undefined ? `${durationMs}ms` : statusWord(status);

  return (
    <div className="co-ic-chip-wrap" style={chipStyle}>
      <style>{`
        @keyframes co-ic-sweep {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(233%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes co-ic-flicker {
          0%, 100% { opacity: 1; }
          12%      { opacity: 0.35; }
          14%      { opacity: 1; }
          42%      { opacity: 0.6; }
          44%      { opacity: 1; }
          70%      { opacity: 0.85; }
          72%      { opacity: 0.4; }
          74%      { opacity: 1; }
        }
        @keyframes co-ic-pulse-dot {
          0%, 100% { opacity: 0.55; box-shadow: 0 0 4px rgba(255, 181, 71, 0.5); }
          50%      { opacity: 1;    box-shadow: 0 0 10px rgba(255, 181, 71, 0.85); }
        }
        @keyframes co-ic-pin1 {
          0%, 100% { opacity: 0.6; }
          50%      { opacity: 0.95; }
        }
        .co-ic-sweep {
          animation: co-ic-sweep 1.6s cubic-bezier(0.65, 0.05, 0.36, 1) infinite;
        }
        .co-ic-flicker {
          animation: co-ic-flicker 1.4s steps(1, end) infinite;
        }
        .co-ic-pulse-dot {
          animation: co-ic-pulse-dot 1.2s ease-in-out infinite;
        }
        .co-ic-pin1-active {
          animation: co-ic-pin1 2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .co-ic-sweep,
          .co-ic-flicker,
          .co-ic-pulse-dot,
          .co-ic-pin1-active {
            animation: none !important;
          }
        }
      `}</style>

      {/* Notch */}
      <div aria-hidden="true" style={notchStyle} />

      {/* Pin-1 dot */}
      <div
        aria-hidden="true"
        className={status === "running" ? "co-ic-pin1-active" : undefined}
        style={pinDotStyle}
      />

      {/* Pins */}
      {pinIndices.map((i) => renderPin("left", i))}
      {pinIndices.map((i) => renderPin("right", i))}

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 108,
        }}
      >
        {/* Row 1: PART № */}
        <div
          className="co-mono co-label"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "var(--co-muted)",
            paddingLeft: 12,
          }}
        >
          <span>
            <span style={{ opacity: 0.6 }}>PART </span>
            <span style={{ opacity: 0.6 }}>&#8470;</span>
            <span
              style={{
                marginLeft: 6,
                color: "var(--co-text-dim)",
                letterSpacing: "0.18em",
              }}
            >
              {partNumber}
            </span>
          </span>
          <span
            aria-hidden="true"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              opacity: status === "pending" ? 0.5 : 1,
            }}
          >
            <span
              className={status === "running" ? "co-ic-pulse-dot" : undefined}
              style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background:
                  status === "pending"
                    ? "var(--co-muted)"
                    : statusColor(status),
                boxShadow:
                  status === "done"
                    ? "0 0 8px rgba(198, 255, 77, 0.7)"
                    : status === "error"
                    ? "0 0 8px rgba(255, 84, 84, 0.7)"
                    : status === "running"
                    ? "0 0 6px rgba(255, 181, 71, 0.6)"
                    : "none",
              }}
            />
            <span
              style={{
                fontSize: 9,
                letterSpacing: "0.22em",
                color: statusColor(status),
                fontFamily: "var(--co-font-mono)",
              }}
            >
              {statusWord(status)}
            </span>
          </span>
        </div>

        {/* Row 2: Display label */}
        <div
          style={{
            marginTop: 10,
            paddingLeft: 12,
            fontFamily: "var(--co-font-display)",
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 0.9,
            letterSpacing: "-0.01em",
            fontSize: "clamp(22px, 3.2vw, 28px)",
            color: labelColor(status),
            textShadow:
              status === "done"
                ? "0 0 8px rgba(198, 255, 77, 0.35), 0 0 18px rgba(198, 255, 77, 0.15)"
                : status === "error"
                ? "0 0 8px rgba(255, 84, 84, 0.35)"
                : "none",
            transition: "color 300ms ease, text-shadow 300ms ease",
          }}
          className={status === "error" ? "co-ic-flicker" : undefined}
        >
          {label.toUpperCase()}
        </div>

        {/* Row 3: Description */}
        {description ? (
          <div
            style={{
              marginTop: 6,
              paddingLeft: 12,
              fontFamily: "var(--co-font-mono)",
              fontSize: 11,
              color: "var(--co-muted)",
              letterSpacing: "0.04em",
              textTransform: "none",
            }}
          >
            {description}
          </div>
        ) : null}

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: 12 }} />

        {/* Row 4: Activity strip */}
        <div
          style={{
            position: "relative",
            paddingLeft: 12,
            paddingRight: 2,
            marginTop: 12,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "relative",
              width: "100%",
              height: 4,
              background: "var(--co-surface-3)",
              overflow: "hidden",
              border: "1px solid rgba(0, 0, 0, 0.4)",
            }}
          >
            {status === "running" ? (
              <div
                className="co-ic-sweep"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "30%",
                  background:
                    "linear-gradient(90deg, transparent 0%, var(--co-amber) 50%, transparent 100%)",
                  boxShadow: "0 0 10px rgba(255, 181, 71, 0.6)",
                }}
              />
            ) : null}
            {showFill ? (
              <div
                className={status === "error" ? "co-ic-flicker" : undefined}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                  background: fillColor,
                  boxShadow:
                    status === "done"
                      ? "0 0 10px rgba(198, 255, 77, 0.55)"
                      : "0 0 10px rgba(255, 84, 84, 0.6)",
                }}
              />
            ) : null}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 6,
              fontFamily: "var(--co-font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            <span style={{ color: "var(--co-muted)", opacity: 0.7 }}>
              CH.01
            </span>
            <span
              style={{
                color:
                  status === "pending"
                    ? "var(--co-muted)"
                    : statusColor(status),
              }}
            >
              {meterReadout}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
