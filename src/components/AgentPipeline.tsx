"use client";

import { AgentName } from "@/lib/agents/types";

export type AgentStatus = "pending" | "running" | "done" | "error";

export interface AgentState {
  name: AgentName;
  status: AgentStatus;
  durationMs?: number;
}

interface AgentPipelineProps {
  agents: AgentState[];
  stage: "idle" | "parallel" | "synthesis" | "done";
}

const AGENT_META: Record<AgentName, { label: string; icon: string; description: string }> = {
  component: {
    label: "Component",
    icon: "⚡",
    description: "Cataloging components",
  },
  topology: {
    label: "Topology",
    icon: "🔗",
    description: "Mapping circuit topology",
  },
  domain: {
    label: "Domain",
    icon: "🎯",
    description: "Classifying application",
  },
  synthesis: {
    label: "Synthesis",
    icon: "🧠",
    description: "Engineering-depth analysis",
  },
};

function StatusIndicator({ status }: { status: AgentStatus }) {
  if (status === "pending") {
    return (
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: "var(--muted)", opacity: 0.4 }}
      />
    );
  }
  if (status === "running") {
    return (
      <div
        className="w-2.5 h-2.5 rounded-full animate-pulse"
        style={{ backgroundColor: "var(--warning)" }}
      />
    );
  }
  if (status === "done") {
    return (
      <div
        className="w-2.5 h-2.5 rounded-full flex items-center justify-center text-[8px] font-bold"
        style={{ backgroundColor: "var(--success)", color: "#000" }}
      >
        ✓
      </div>
    );
  }
  // error
  return (
    <div
      className="w-2.5 h-2.5 rounded-full"
      style={{ backgroundColor: "var(--error)" }}
    />
  );
}

export default function AgentPipeline({ agents, stage }: AgentPipelineProps) {
  if (stage === "idle") return null;

  return (
    <div
      className="rounded-xl p-4 border"
      style={{
        backgroundColor: "var(--surface2)",
        borderColor: "var(--border)",
      }}
    >
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-3"
        style={{ color: "var(--muted)" }}
      >
        Agent Pipeline
      </p>

      <div className="grid grid-cols-4 gap-2">
        {agents.map((agent, idx) => {
          const meta = AGENT_META[agent.name];
          const isActive = agent.status === "running";
          const isDone = agent.status === "done";
          const isError = agent.status === "error";

          return (
            <div key={agent.name} className="relative">
              {/* Connector line */}
              {idx < agents.length - 1 && (
                <div
                  className="absolute top-5 left-full w-2 h-px z-10"
                  style={{
                    backgroundColor: isDone ? "var(--success)" : "var(--border)",
                    opacity: 0.6,
                  }}
                />
              )}

              <div
                className="flex flex-col items-center gap-2 p-2 rounded-lg transition-all duration-300"
                style={{
                  backgroundColor: isActive
                    ? "color-mix(in srgb, var(--warning) 8%, var(--surface))"
                    : isDone
                    ? "color-mix(in srgb, var(--success) 6%, var(--surface))"
                    : isError
                    ? "color-mix(in srgb, var(--error) 6%, var(--surface))"
                    : "var(--surface)",
                  border: `1px solid ${
                    isActive
                      ? "color-mix(in srgb, var(--warning) 40%, transparent)"
                      : isDone
                      ? "color-mix(in srgb, var(--success) 30%, transparent)"
                      : isError
                      ? "color-mix(in srgb, var(--error) 30%, transparent)"
                      : "var(--border)"
                  }`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <StatusIndicator status={agent.status} />
                  <span
                    className="text-base leading-none"
                    title={meta.label}
                  >
                    {meta.icon}
                  </span>
                </div>

                <div className="text-center">
                  <p
                    className="text-[13px] font-medium leading-tight"
                    style={{
                      color: isActive
                        ? "var(--warning)"
                        : isDone
                        ? "var(--success)"
                        : isError
                        ? "var(--error)"
                        : "var(--text)",
                    }}
                  >
                    {meta.label}
                  </p>

                  {agent.durationMs !== undefined ? (
                    <p
                      className="text-[11px] font-mono mt-0.5"
                      style={{ color: "var(--muted)" }}
                    >
                      {agent.durationMs}ms
                    </p>
                  ) : (
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "var(--muted)", opacity: 0.65 }}
                    >
                      {agent.status === "running"
                        ? "running…"
                        : agent.status === "pending"
                        ? "waiting"
                        : ""}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {stage === "synthesis" && (
        <p className="text-[13px] mt-3 text-center" style={{ color: "var(--muted)" }}>
          Streaming synthesis from senior engineer agent…
        </p>
      )}
    </div>
  );
}
