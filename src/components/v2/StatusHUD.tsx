"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, JSX } from "react";

interface StatusHUDProps {
  pipelineStage?: "idle" | "parallel" | "synthesis" | "done";
  modelName?: string;
  rateLimit?: string;
}

interface PipelineDisplay {
  label: string;
  color: string;
  pulse: boolean;
}

function getPipelineDisplay(stage: StatusHUDProps["pipelineStage"]): PipelineDisplay {
  switch (stage) {
    case "parallel":
      return { label: "PARALLEL × 3", color: "var(--co-amber)", pulse: true };
    case "synthesis":
      return { label: "SYNTHESIS", color: "var(--co-phosphor)", pulse: true };
    case "done":
      return { label: "COMPLETE", color: "var(--co-phosphor)", pulse: false };
    case "idle":
    default:
      return { label: "STANDBY", color: "var(--co-muted)", pulse: false };
  }
}

function getLatencyColor(ms: number): string {
  if (ms < 50) return "var(--co-phosphor)";
  if (ms <= 80) return "var(--co-amber)";
  return "var(--co-danger)";
}

function formatUptime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatUTCClock(date: Date): string {
  const hh = String(date.getUTCHours()).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss} UTC`;
}

export default function StatusHUD({
  pipelineStage = "idle",
  modelName = "claude-sonnet-4-6",
  rateLimit = "10 RPM",
}: StatusHUDProps): JSX.Element {
  const [uptimeSeconds, setUptimeSeconds] = useState<number>(0);
  const [latencyMs, setLatencyMs] = useState<number>(42);
  const [clock, setClock] = useState<string>(() => formatUTCClock(new Date()));
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Uptime ticker: increments every second
  useEffect(() => {
    const interval = setInterval(() => {
      setUptimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // UTC clock: updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      setClock(formatUTCClock(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Latency mock: fluctuates every 800ms between 25 and 95
  useEffect(() => {
    const interval = setInterval(() => {
      const next = Math.floor(25 + Math.random() * 71); // 25..95
      setLatencyMs(next);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const pipeline = getPipelineDisplay(pipelineStage);
  const latencyColor = getLatencyColor(latencyMs);

  const barStyle: CSSProperties = {
    height: 28,
    background: "color-mix(in srgb, var(--co-bg) 70%, transparent)",
    backdropFilter: "blur(10px) saturate(140%)",
    WebkitBackdropFilter: "blur(10px) saturate(140%)",
    borderTop: "1px solid var(--co-border-strong)",
    color: "var(--co-text)",
    fontFamily: "var(--co-font-mono)",
    fontSize: 10,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "0 16px",
  };

  const dividerStyle: CSSProperties = {
    width: 1,
    height: "50%",
    background: "var(--co-border)",
    flexShrink: 0,
  };

  const labelStyle: CSSProperties = {
    color: "var(--co-muted)",
    fontWeight: 500,
  };

  const valueStyle = (color: string): CSSProperties => ({
    color,
    fontWeight: 500,
  });

  return (
    <div
      role="status"
      aria-label="System status bar"
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-4"
      style={barStyle}
    >
      <style>{`
        @keyframes co-hud-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        @keyframes co-hud-square-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 4px var(--co-phosphor), 0 0 8px rgba(198, 255, 77, 0.5); }
          50% { opacity: 0.55; box-shadow: 0 0 2px var(--co-phosphor), 0 0 4px rgba(198, 255, 77, 0.25); }
        }
        .co-hud-pulse {
          animation: co-hud-pulse 1.4s ease-in-out infinite;
        }
        .co-hud-square {
          animation: co-hud-square-pulse 1.6s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .co-hud-pulse, .co-hud-square {
            animation: none !important;
          }
        }
      `}</style>

      {/* 1. System status — always visible */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          aria-hidden="true"
          className="co-hud-square"
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            background: "var(--co-phosphor)",
          }}
        />
        <span style={valueStyle("var(--co-phosphor)")}>SYSTEM ONLINE</span>
      </div>

      <div aria-hidden="true" style={dividerStyle} />

      {/* 2. Uptime ticker — always visible */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span style={labelStyle}>UPTIME:</span>
        <span style={valueStyle("var(--co-text)")}>
          {mounted ? formatUptime(uptimeSeconds) : "00:00"}
        </span>
      </div>

      <div aria-hidden="true" style={dividerStyle} />

      {/* 3. Pipeline stage — always visible, aria-live */}
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 flex-shrink-0"
      >
        <span style={labelStyle}>PIPELINE:</span>
        <span
          className={pipeline.pulse ? "co-hud-pulse" : undefined}
          style={valueStyle(pipeline.color)}
        >
          {pipeline.label}
        </span>
      </div>

      <div aria-hidden="true" className="hidden md:block" style={dividerStyle} />

      {/* 4. Model — hidden below md */}
      <div className="hidden md:flex items-center gap-2 flex-shrink-0">
        <span style={labelStyle}>MODEL:</span>
        <span style={valueStyle("var(--co-blueprint)")}>{modelName}</span>
      </div>

      <div aria-hidden="true" className="hidden md:block" style={dividerStyle} />

      {/* 5. Rate limit — hidden below md */}
      <div className="hidden md:flex items-center gap-2 flex-shrink-0">
        <span style={labelStyle}>LIMIT:</span>
        <span style={valueStyle("var(--co-text-dim)")}>{rateLimit}</span>
      </div>

      {/* Spacer pushes right segments to the end */}
      <div className="flex-1" aria-hidden="true" />

      {/* 6. Latency mock — hidden below md (right-most before timestamp) */}
      <div
        className="hidden md:flex items-center gap-2 flex-shrink-0"
        aria-hidden="true"
      >
        <span style={labelStyle}>LAT:</span>
        <span style={valueStyle(latencyColor)}>
          {mounted ? `${latencyMs}ms` : "42ms"}
        </span>
      </div>

      <div aria-hidden="true" className="hidden md:block" style={dividerStyle} />

      {/* 7. Timestamp — always visible, far right */}
      <div
        className="flex items-center gap-2 flex-shrink-0"
        aria-hidden="true"
      >
        <span style={labelStyle}>UTC:</span>
        <span style={valueStyle("var(--co-text-dim)")}>{clock}</span>
      </div>
    </div>
  );
}
