"use client";

import type { CSSProperties, JSX } from "react";
import type { VerifierResult } from "@/lib/agents/types";
import { isAgentError, type AgentResult } from "@/lib/agents/types";

interface VerificationReportProps {
  result: AgentResult<VerifierResult>;
  durationMs?: number;
}

const VERDICT_CONFIG: Record<
  VerifierResult["verdict"],
  { label: string; color: string; rgb: string }
> = {
  confirmed: {
    label: "CONFIRMED",
    color: "var(--co-phosphor)",
    rgb: "198, 255, 77",
  },
  likely: {
    label: "LIKELY",
    color: "var(--co-phosphor)",
    rgb: "198, 255, 77",
  },
  uncertain: {
    label: "UNCERTAIN",
    color: "var(--co-amber)",
    rgb: "255, 181, 71",
  },
  mismatch: {
    label: "MISMATCH",
    color: "var(--co-danger)",
    rgb: "255, 80, 80",
  },
};

export default function VerificationReport({
  result,
  durationMs,
}: VerificationReportProps): JSX.Element {
  if (isAgentError(result)) {
    return (
      <div
        className="border px-4 py-3 co-mono"
        style={{
          borderColor: "color-mix(in srgb, var(--co-danger) 35%, transparent)",
          backgroundColor:
            "color-mix(in srgb, var(--co-danger) 8%, var(--co-surface))",
          color: "var(--co-danger)",
          fontSize: "12px",
          letterSpacing: "0.12em",
        }}
      >
        VERIFIER ERROR · {result.message}
      </div>
    );
  }

  const cfg = VERDICT_CONFIG[result.verdict];
  const pct = Math.round(result.confidence);

  const containerStyle: CSSProperties = {
    border: "1px solid var(--co-border-strong)",
    backgroundColor: "var(--co-surface-2)",
    overflow: "hidden",
  };

  const headerStyle: CSSProperties = {
    height: 32,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    backgroundColor: `rgba(${cfg.rgb}, 0.12)`,
    borderBottom: "1px solid var(--co-border)",
    fontFamily: "var(--co-font-mono)",
    fontSize: 11,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  };

  const barTrackStyle: CSSProperties = {
    height: 3,
    backgroundColor: "var(--co-border)",
    position: "relative",
    overflow: "hidden",
  };

  const barFillStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: `${pct}%`,
    backgroundColor: cfg.color,
    boxShadow: `0 0 6px rgba(${cfg.rgb}, 0.6)`,
    transition: "width 600ms cubic-bezier(0.22, 1, 0.36, 1)",
  };

  return (
    <div style={containerStyle}>
      {/* Header strip */}
      <div style={headerStyle}>
        <span style={{ color: "var(--co-muted)" }}>VERIFIER REPORT</span>
        <span style={{ color: cfg.color }}>{cfg.label}</span>
      </div>

      {/* Confidence bar */}
      <div style={barTrackStyle}>
        <div style={barFillStyle} />
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8 }}>
        {/* Confidence + matched circuit row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            fontFamily: "var(--co-font-mono)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span
              style={{
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--co-muted)",
              }}
            >
              CONFIDENCE
            </span>
            <span style={{ fontSize: 20, fontWeight: 700, color: cfg.color, lineHeight: 1 }}>
              {pct}
              <span style={{ fontSize: 12, color: "var(--co-text-dim)" }}>%</span>
            </span>
          </div>
          {result.matchedCircuit && (
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--co-muted)",
                }}
              >
                MATCHED
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: "var(--co-text-dim)",
                  lineHeight: 1.3,
                  fontFamily: "var(--co-font-mono)",
                }}
              >
                {result.matchedCircuit}
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        <p
          style={{
            margin: 0,
            fontSize: 12,
            lineHeight: 1.55,
            color: "var(--co-text-dim)",
            fontFamily: "var(--co-font-mono)",
            letterSpacing: "0.03em",
          }}
        >
          {result.notes}
        </p>

        {/* Duration */}
        {durationMs !== undefined && (
          <span
            style={{
              fontSize: 10,
              color: "var(--co-muted)",
              fontFamily: "var(--co-font-mono)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              alignSelf: "flex-end",
            }}
          >
            {(durationMs / 1000).toFixed(1)}s
          </span>
        )}
      </div>
    </div>
  );
}
