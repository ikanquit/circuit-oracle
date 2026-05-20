"use client";

import { useState } from "react";
import {
  AnalysisResult as AnalysisResultType,
  ComponentAgentResult,
  TopologyAgentResult,
  DomainAgentResult,
  SynthesisResult,
  isAgentError,
} from "@/lib/agents/types";

interface AnalysisResultProps {
  result: AnalysisResultType | null;
  synthStreaming: string;
  isStreaming: boolean;
}

function Section({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--surface2)" }}
    >
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left transition-colors"
        style={{ color: "var(--text)" }}
        onClick={() => setOpen(!open)}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "color-mix(in srgb, var(--accent) 5%, transparent)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
        }}
      >
        <div className="flex items-center gap-2">
          <span>{icon}</span>
          <span className="text-sm font-semibold">{title}</span>
        </div>
        <span
          className="text-xs transition-transform duration-200"
          style={{
            color: "var(--muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          className="px-4 pb-4 pt-1 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

function ComponentsTable({ data }: { data: ComponentAgentResult }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        {data.summary}
      </p>
      <div
        className="rounded-lg overflow-hidden border"
        style={{ borderColor: "var(--border)" }}
      >
        <table className="w-full text-xs">
          <thead>
            <tr style={{ backgroundColor: "var(--surface)" }}>
              <th
                className="px-3 py-2 text-left font-semibold"
                style={{ color: "var(--muted)" }}
              >
                Ref
              </th>
              <th
                className="px-3 py-2 text-left font-semibold"
                style={{ color: "var(--muted)" }}
              >
                Type
              </th>
              <th
                className="px-3 py-2 text-left font-semibold"
                style={{ color: "var(--muted)" }}
              >
                Value
              </th>
              <th
                className="px-3 py-2 text-left font-semibold"
                style={{ color: "var(--muted)" }}
              >
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {data.components.map((comp, i) => (
              <tr
                key={i}
                style={{
                  borderTop: `1px solid var(--border)`,
                  backgroundColor:
                    i % 2 === 0 ? "transparent" : "color-mix(in srgb, white 2%, transparent)",
                }}
              >
                <td
                  className="px-3 py-2 font-mono"
                  style={{ color: "var(--accent)" }}
                >
                  {comp.designator ?? "—"}
                </td>
                <td className="px-3 py-2" style={{ color: "var(--text)" }}>
                  {comp.type}
                </td>
                <td
                  className="px-3 py-2 font-mono"
                  style={{ color: "var(--text)" }}
                >
                  {comp.value ?? comp.partNumber ?? "—"}
                </td>
                <td className="px-3 py-2" style={{ color: "var(--muted)" }}>
                  {comp.functionalRole}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs" style={{ color: "var(--muted)" }}>
        {data.totalCount} component{data.totalCount !== 1 ? "s" : ""} identified
      </p>
    </div>
  );
}

function TopologyView({ data }: { data: TopologyAgentResult }) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className="px-3 py-2 rounded-lg font-mono text-sm"
        style={{
          backgroundColor: "color-mix(in srgb, var(--accent) 10%, var(--surface))",
          color: "var(--accent)",
          border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)",
        }}
      >
        {data.topologyName}
      </div>

      {data.stages.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
            STAGES
          </p>
          {data.stages.map((stage, i) => (
            <div
              key={i}
              className="px-3 py-2 rounded-lg"
              style={{
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                {stage.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
                {stage.description}
              </p>
              {stage.components && stage.components.length > 0 && (
                <p
                  className="text-xs font-mono mt-1"
                  style={{ color: "var(--accent)", opacity: 0.8 }}
                >
                  {stage.components.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {data.feedbackPaths.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
            FEEDBACK PATHS
          </p>
          {data.feedbackPaths.map((fb, i) => (
            <div key={i} className="flex items-start gap-2">
              <span
                className="text-xs px-1.5 py-0.5 rounded font-mono shrink-0"
                style={{
                  backgroundColor:
                    fb.type === "negative"
                      ? "color-mix(in srgb, var(--error) 15%, transparent)"
                      : fb.type === "positive"
                      ? "color-mix(in srgb, var(--success) 15%, transparent)"
                      : "color-mix(in srgb, var(--muted) 15%, transparent)",
                  color:
                    fb.type === "negative"
                      ? "var(--error)"
                      : fb.type === "positive"
                      ? "var(--success)"
                      : "var(--muted)",
                }}
              >
                {fb.type}
              </span>
              <p className="text-xs" style={{ color: "var(--muted)" }}>
                {fb.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {data.keyNodes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {data.keyNodes.map((node, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded font-mono"
              style={{
                backgroundColor: "var(--surface)",
                color: "var(--text)",
                border: "1px solid var(--border)",
              }}
            >
              {node}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function DomainView({ data }: { data: DomainAgentResult }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <InfoCard label="Domain" value={data.primaryDomain} highlight />
        <InfoCard label="Industry" value={data.industryContext} />
        {data.frequencyRange && (
          <InfoCard label="Frequency Range" value={data.frequencyRange} mono />
        )}
        {data.impedance && (
          <InfoCard label="Impedance" value={data.impedance} mono />
        )}
      </div>
      <div
        className="px-3 py-2.5 rounded-lg text-xs"
        style={{
          backgroundColor: "var(--surface)",
          color: "var(--text)",
          border: "1px solid var(--border)",
        }}
      >
        <p className="font-semibold mb-1" style={{ color: "var(--muted)" }}>
          APPLICATION
        </p>
        <p>{data.specificApplication}</p>
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div
      className="px-3 py-2 rounded-lg"
      style={{
        backgroundColor: highlight
          ? "color-mix(in srgb, var(--accent) 8%, var(--surface))"
          : "var(--surface)",
        border: `1px solid ${
          highlight
            ? "color-mix(in srgb, var(--accent) 25%, transparent)"
            : "var(--border)"
        }`,
      }}
    >
      <p className="text-[10px] uppercase tracking-widest" style={{ color: "var(--muted)" }}>
        {label}
      </p>
      <p
        className={`text-xs font-semibold mt-0.5 ${mono ? "font-mono" : ""}`}
        style={{ color: highlight ? "var(--accent)" : "var(--text)" }}
      >
        {value}
      </p>
    </div>
  );
}

function SynthesisView({
  data,
  streaming,
  isStreaming,
}: {
  data: SynthesisResult | null;
  streaming: string;
  isStreaming: boolean;
}) {
  if (isStreaming && !data) {
    return (
      <div className="flex flex-col gap-3">
        <div
          className="text-xs font-mono whitespace-pre-wrap leading-relaxed"
          style={{ color: "var(--text)" }}
        >
          {streaming}
          <span
            className="inline-block w-1.5 h-3 ml-0.5 animate-pulse"
            style={{ backgroundColor: "var(--accent)" }}
          />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Operating Principle */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>
          OPERATING PRINCIPLE
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
          {data.operatingPrinciple}
        </p>
      </div>

      {/* Key Parameters */}
      {data.keyParameters && data.keyParameters.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>
            KEY PARAMETERS
          </p>
          <div className="grid grid-cols-2 gap-2">
            {data.keyParameters.map((param, i) => (
              <div
                key={i}
                className="px-3 py-2 rounded-lg"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {param.name}
                </p>
                <p
                  className="text-sm font-mono font-semibold"
                  style={{ color: "var(--accent)" }}
                >
                  {param.value}
                  {param.unit ? ` ${param.unit}` : ""}
                </p>
                {param.notes && (
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>
                    {param.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Design Decisions */}
      {data.designDecisions && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>
            DESIGN DECISIONS
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text)" }}>
            {data.designDecisions}
          </p>
        </div>
      )}

      {/* Failure Modes */}
      {data.failureModes && data.failureModes.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>
            FAILURE MODES
          </p>
          <div className="flex flex-col gap-2">
            {data.failureModes.map((fm, i) => (
              <div
                key={i}
                className="px-3 py-2.5 rounded-lg"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--error) 6%, var(--surface))",
                  border: "1px solid color-mix(in srgb, var(--error) 20%, transparent)",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase"
                    style={{
                      backgroundColor:
                        fm.severity === "high"
                          ? "color-mix(in srgb, var(--error) 20%, transparent)"
                          : fm.severity === "medium"
                          ? "color-mix(in srgb, var(--warning) 20%, transparent)"
                          : "color-mix(in srgb, var(--muted) 20%, transparent)",
                      color:
                        fm.severity === "high"
                          ? "var(--error)"
                          : fm.severity === "medium"
                          ? "var(--warning)"
                          : "var(--muted)",
                    }}
                  >
                    {fm.severity}
                  </span>
                  <p className="text-xs font-semibold" style={{ color: "var(--text)" }}>
                    {fm.scenario}
                  </p>
                </div>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  {fm.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Improvements */}
      {data.improvements && data.improvements.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--muted)" }}>
            IMPROVEMENT SUGGESTIONS
          </p>
          <div className="flex flex-col gap-2">
            {data.improvements.map((imp, i) => (
              <div
                key={i}
                className="px-3 py-2.5 rounded-lg"
                style={{
                  backgroundColor: "color-mix(in srgb, var(--success) 5%, var(--surface))",
                  border: "1px solid color-mix(in srgb, var(--success) 20%, transparent)",
                }}
              >
                <p
                  className="text-xs font-semibold mb-1"
                  style={{ color: "var(--success)" }}
                >
                  {imp.area}
                </p>
                <p className="text-xs" style={{ color: "var(--text)" }}>
                  {imp.suggestion}
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  {imp.rationale}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AnalysisResult({
  result,
  synthStreaming,
  isStreaming,
}: AnalysisResultProps) {
  if (!result && !synthStreaming) return null;

  const components = result?.components;
  const topology = result?.topology;
  const domain = result?.domain;
  const synthesis = result?.synthesis;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
        Analysis Results
      </h2>

      {/* Component Agent */}
      {components && (
        <Section title="Component Catalog" icon="⚡">
          {isAgentError(components) ? (
            <p className="text-xs" style={{ color: "var(--error)" }}>
              Agent error: {components.message}
            </p>
          ) : (
            <ComponentsTable data={components} />
          )}
        </Section>
      )}

      {/* Topology Agent */}
      {topology && (
        <Section title="Circuit Topology" icon="🔗">
          {isAgentError(topology) ? (
            <p className="text-xs" style={{ color: "var(--error)" }}>
              Agent error: {topology.message}
            </p>
          ) : (
            <TopologyView data={topology} />
          )}
        </Section>
      )}

      {/* Domain Agent */}
      {domain && (
        <Section title="Application Domain" icon="🎯">
          {isAgentError(domain) ? (
            <p className="text-xs" style={{ color: "var(--error)" }}>
              Agent error: {domain.message}
            </p>
          ) : (
            <DomainView data={domain} />
          )}
        </Section>
      )}

      {/* Synthesis */}
      {(synthStreaming || synthesis) && (
        <Section title="Engineering Analysis" icon="🧠">
          <SynthesisView
            data={
              synthesis && !isAgentError(synthesis)
                ? (synthesis as unknown as SynthesisResult)
                : null
            }
            streaming={synthStreaming}
            isStreaming={isStreaming}
          />
        </Section>
      )}
    </div>
  );
}
