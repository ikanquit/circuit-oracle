"use client";

import type { CSSProperties, JSX, ReactNode } from "react";
import Link from "next/link";
import type { Sample } from "@/lib/samples";
import {
  isAgentError,
  type ComponentAgentResult,
  type TopologyAgentResult,
  type DomainAgentResult,
  type SynthesisResult,
} from "@/lib/agents/types";
import SampleSchematic from "./SampleSchematic";

const ACCENT_VAR: Record<Sample["accent"], string> = {
  phosphor: "var(--co-phosphor)",
  amber: "var(--co-amber)",
  copper: "var(--co-copper)",
  blueprint: "var(--co-blueprint)",
};

const ACCENT_RGB: Record<Sample["accent"], string> = {
  phosphor: "198, 255, 77",
  amber: "255, 181, 71",
  copper: "217, 119, 66",
  blueprint: "79, 158, 255",
};

interface SampleAnalysisViewProps {
  sample: Sample;
  /** When true, render as a shareable "permalink" view (slightly different header). */
  variant?: "detail" | "share";
}

/* ------------------------------------------------------------------ */
/* Sub-blocks                                                          */
/* ------------------------------------------------------------------ */

function BlueprintPanel({
  title,
  badge,
  accent,
  children,
}: {
  title: string;
  badge?: string;
  accent: string;
  children: ReactNode;
}): JSX.Element {
  const panelStyle: CSSProperties = {
    position: "relative",
    backgroundColor: "var(--co-surface)",
    border: "1px solid var(--co-border-strong)",
    borderRadius: 0,
  };

  const headerStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    backgroundColor: "var(--co-surface-2)",
    borderBottom: "1px solid var(--co-border)",
    fontFamily: "var(--co-font-mono)",
    fontSize: 10,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "var(--co-text)",
  };

  return (
    <section style={panelStyle}>
      {/* L-corners */}
      {[
        { top: -1, left: -1, brT: 1.2, brL: 1.2 },
        { top: -1, right: -1, brT: 1.2, brR: 1.2 },
        { bottom: -1, left: -1, brB: 1.2, brL: 1.2 },
        { bottom: -1, right: -1, brB: 1.2, brR: 1.2 },
      ].map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 8,
            height: 8,
            top: p.top,
            left: p.left,
            right: p.right,
            bottom: p.bottom,
            borderTop: p.brT ? `1.5px solid ${accent}` : undefined,
            borderLeft: p.brL ? `1.5px solid ${accent}` : undefined,
            borderRight: p.brR ? `1.5px solid ${accent}` : undefined,
            borderBottom: p.brB ? `1.5px solid ${accent}` : undefined,
            pointerEvents: "none",
          }}
        />
      ))}
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            aria-hidden="true"
            style={{
              width: 5,
              height: 5,
              backgroundColor: accent,
              boxShadow: `0 0 6px ${accent}`,
            }}
          />
          <span>{title}</span>
        </div>
        {badge && (
          <span style={{ color: accent, opacity: 0.85 }}>{badge}</span>
        )}
      </header>
      <div style={{ padding: "18px 18px" }}>{children}</div>
    </section>
  );
}

function ComponentsBlock({ data, accent }: { data: ComponentAgentResult; accent: string }): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--co-text-dim)" }}>
        {data.summary}
      </p>
      <div
        style={{
          border: "1px solid var(--co-border)",
          backgroundColor: "var(--co-surface)",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "var(--co-surface-2)" }}>
              {["REF", "TYPE", "VALUE", "ROLE"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    fontFamily: "var(--co-font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    color: "var(--co-muted)",
                    fontWeight: 600,
                    borderBottom: "1px solid var(--co-border)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.components.map((comp, i) => (
              <tr
                key={i}
                style={{
                  borderTop: i === 0 ? "none" : "1px solid var(--co-border)",
                  backgroundColor: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                }}
              >
                <td
                  style={{
                    padding: "8px 12px",
                    fontFamily: "var(--co-font-mono)",
                    color: accent,
                    fontSize: 12,
                    whiteSpace: "nowrap",
                    verticalAlign: "top",
                  }}
                >
                  {comp.designator ?? "—"}
                </td>
                <td style={{ padding: "8px 12px", color: "var(--co-text)", verticalAlign: "top" }}>
                  {comp.type}
                </td>
                <td
                  style={{
                    padding: "8px 12px",
                    fontFamily: "var(--co-font-mono)",
                    color: "var(--co-text)",
                    fontSize: 12,
                    whiteSpace: "nowrap",
                    verticalAlign: "top",
                  }}
                >
                  {comp.value ?? comp.partNumber ?? "—"}
                </td>
                <td style={{ padding: "8px 12px", color: "var(--co-text-dim)", verticalAlign: "top" }}>
                  {comp.functionalRole}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p
        style={{
          fontFamily: "var(--co-font-mono)",
          fontSize: 10,
          letterSpacing: "0.18em",
          color: "var(--co-muted)",
        }}
      >
        {data.totalCount} COMPONENT{data.totalCount !== 1 ? "S" : ""} IDENTIFIED
      </p>
    </div>
  );
}

function TopologyBlock({ data, accent }: { data: TopologyAgentResult; accent: string }): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          padding: "10px 14px",
          backgroundColor: `rgba(${
            accent.includes("phosphor") ? "198,255,77" : "79,158,255"
          },0.08)`,
          border: `1px solid ${accent}40`,
          fontFamily: "var(--co-font-mono)",
          fontSize: 13,
          color: accent,
          letterSpacing: "0.02em",
        }}
      >
        {data.topologyName}
      </div>

      {data.stages.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <p
            style={{
              fontFamily: "var(--co-font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              color: "var(--co-muted)",
            }}
          >
            STAGES · {data.stages.length}
          </p>
          {data.stages.map((s, i) => (
            <div
              key={i}
              style={{
                padding: "10px 12px",
                backgroundColor: "var(--co-surface-2)",
                border: "1px solid var(--co-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontFamily: "var(--co-font-mono)",
                    fontSize: 10,
                    color: "var(--co-muted)",
                    letterSpacing: "0.18em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--co-text)" }}>
                  {s.name}
                </p>
              </div>
              <p style={{ fontSize: 12, lineHeight: 1.55, color: "var(--co-text-dim)", marginTop: 4 }}>
                {s.description}
              </p>
              {s.components && s.components.length > 0 && (
                <p
                  style={{
                    fontFamily: "var(--co-font-mono)",
                    fontSize: 11,
                    color: accent,
                    marginTop: 6,
                    opacity: 0.85,
                  }}
                >
                  → {s.components.join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {data.feedbackPaths.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <p
            style={{
              fontFamily: "var(--co-font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              color: "var(--co-muted)",
            }}
          >
            FEEDBACK PATHS
          </p>
          {data.feedbackPaths.map((fb, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span
                style={{
                  fontFamily: "var(--co-font-mono)",
                  fontSize: 9,
                  padding: "2px 8px",
                  letterSpacing: "0.18em",
                  backgroundColor:
                    fb.type === "negative"
                      ? "rgba(255,84,84,0.12)"
                      : fb.type === "positive"
                      ? "rgba(198,255,77,0.12)"
                      : "rgba(255,255,255,0.06)",
                  color:
                    fb.type === "negative"
                      ? "var(--co-danger)"
                      : fb.type === "positive"
                      ? "var(--co-phosphor)"
                      : "var(--co-muted)",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {fb.type.toUpperCase()}
              </span>
              <p style={{ fontSize: 12, lineHeight: 1.55, color: "var(--co-text-dim)" }}>
                {fb.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {data.keyNodes.length > 0 && (
        <div>
          <p
            style={{
              fontFamily: "var(--co-font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              color: "var(--co-muted)",
              marginBottom: 6,
            }}
          >
            KEY NODES
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {data.keyNodes.map((n, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--co-font-mono)",
                  fontSize: 11,
                  padding: "3px 8px",
                  backgroundColor: "var(--co-surface-2)",
                  border: "1px solid var(--co-border)",
                  color: "var(--co-text)",
                }}
              >
                {n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DomainInfo({
  label,
  value,
  accent,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  accent: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        padding: "10px 12px",
        backgroundColor: highlight ? `${accent}11` : "var(--co-surface-2)",
        border: `1px solid ${highlight ? `${accent}40` : "var(--co-border)"}`,
      }}
    >
      <p
        style={{
          fontFamily: "var(--co-font-mono)",
          fontSize: 9,
          letterSpacing: "0.2em",
          color: "var(--co-muted)",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: highlight ? accent : "var(--co-text)",
          marginTop: 2,
          fontFamily: mono ? "var(--co-font-mono)" : "inherit",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function DomainBlock({ data, accent }: { data: DomainAgentResult; accent: string }): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 8,
        }}
      >
        <DomainInfo label="DOMAIN" value={data.primaryDomain} accent={accent} highlight />
        <DomainInfo label="INDUSTRY" value={data.industryContext} accent={accent} />
        {data.frequencyRange && (
          <DomainInfo label="FREQUENCY" value={data.frequencyRange} accent={accent} mono />
        )}
        {data.impedance && (
          <DomainInfo label="IMPEDANCE" value={data.impedance} accent={accent} mono />
        )}
      </div>

      <div
        style={{
          padding: "12px 14px",
          backgroundColor: "var(--co-surface-2)",
          border: "1px solid var(--co-border)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--co-font-mono)",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "var(--co-muted)",
            marginBottom: 6,
          }}
        >
          APPLICATION
        </p>
        <p style={{ fontSize: 13, lineHeight: 1.55, color: "var(--co-text)" }}>
          {data.specificApplication}
        </p>
      </div>
    </div>
  );
}

function SynthesisBlock({ data, accent }: { data: SynthesisResult; accent: string }): JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div>
        <p
          style={{
            fontFamily: "var(--co-font-mono)",
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "var(--co-muted)",
            marginBottom: 6,
          }}
        >
          OPERATING PRINCIPLE
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--co-text)" }}>
          {data.operatingPrinciple}
        </p>
      </div>

      {data.keyParameters?.length > 0 && (
        <div>
          <p
            style={{
              fontFamily: "var(--co-font-mono)",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "var(--co-muted)",
              marginBottom: 8,
            }}
          >
            KEY PARAMETERS
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 8,
            }}
          >
            {data.keyParameters.map((p, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 12px",
                  backgroundColor: "var(--co-surface-2)",
                  border: "1px solid var(--co-border)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--co-font-mono)",
                    fontSize: 9,
                    letterSpacing: "0.18em",
                    color: "var(--co-muted)",
                  }}
                >
                  {p.name}
                </p>
                <p
                  style={{
                    fontFamily: "var(--co-font-mono)",
                    fontSize: 16,
                    color: accent,
                    fontWeight: 700,
                    marginTop: 4,
                  }}
                >
                  {p.value}
                  {p.unit ? <span style={{ fontSize: 12, opacity: 0.75, marginLeft: 4 }}>{p.unit}</span> : null}
                </p>
                {p.notes && (
                  <p style={{ fontSize: 11, color: "var(--co-muted)", marginTop: 4, lineHeight: 1.4 }}>
                    {p.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.designDecisions && (
        <div>
          <p
            style={{
              fontFamily: "var(--co-font-mono)",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "var(--co-muted)",
              marginBottom: 6,
            }}
          >
            DESIGN DECISIONS
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--co-text)" }}>
            {data.designDecisions}
          </p>
        </div>
      )}

      {data.failureModes?.length > 0 && (
        <div>
          <p
            style={{
              fontFamily: "var(--co-font-mono)",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "var(--co-muted)",
              marginBottom: 8,
            }}
          >
            FAILURE MODES · {data.failureModes.length}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.failureModes.map((fm, i) => {
              const sevBg =
                fm.severity === "high"
                  ? "rgba(255,84,84,0.06)"
                  : fm.severity === "medium"
                  ? "rgba(255,181,71,0.06)"
                  : "rgba(255,255,255,0.03)";
              const sevBorder =
                fm.severity === "high"
                  ? "rgba(255,84,84,0.30)"
                  : fm.severity === "medium"
                  ? "rgba(255,181,71,0.30)"
                  : "var(--co-border)";
              const sevColor =
                fm.severity === "high"
                  ? "var(--co-danger)"
                  : fm.severity === "medium"
                  ? "var(--co-amber)"
                  : "var(--co-muted)";
              return (
                <div
                  key={i}
                  style={{
                    padding: "10px 12px",
                    backgroundColor: sevBg,
                    border: `1px solid ${sevBorder}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span
                      style={{
                        fontFamily: "var(--co-font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.18em",
                        padding: "2px 8px",
                        backgroundColor: sevColor === "var(--co-muted)" ? "var(--co-surface-3)" : `${sevColor}1f`,
                        color: sevColor,
                      }}
                    >
                      {fm.severity.toUpperCase()}
                    </span>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--co-text)" }}>
                      {fm.scenario}
                    </p>
                  </div>
                  <p style={{ fontSize: 12, lineHeight: 1.55, color: "var(--co-text-dim)" }}>
                    {fm.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data.improvements?.length > 0 && (
        <div>
          <p
            style={{
              fontFamily: "var(--co-font-mono)",
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "var(--co-muted)",
              marginBottom: 8,
            }}
          >
            IMPROVEMENT SUGGESTIONS
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.improvements.map((imp, i) => (
              <div
                key={i}
                style={{
                  padding: "10px 12px",
                  backgroundColor: `${accent}0d`,
                  border: `1px solid ${accent}33`,
                }}
              >
                <p style={{ fontSize: 12, fontWeight: 700, color: accent, marginBottom: 4 }}>
                  ◇ {imp.area}
                </p>
                <p style={{ fontSize: 13, color: "var(--co-text)", lineHeight: 1.5 }}>
                  {imp.suggestion}
                </p>
                <p style={{ fontSize: 12, color: "var(--co-text-dim)", marginTop: 4, lineHeight: 1.5 }}>
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

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

export default function SampleAnalysisView({
  sample,
  variant = "detail",
}: SampleAnalysisViewProps): JSX.Element {
  const accent = ACCENT_VAR[sample.accent];
  const accentRgb = ACCENT_RGB[sample.accent];
  const { analysis } = sample;
  const isShare = variant === "share";

  return (
    <div
      style={{
        maxWidth: 1080,
        margin: "0 auto",
        padding: "32px 16px 80px",
      }}
    >
      {/* breadcrumb */}
      <nav
        style={{
          fontFamily: "var(--co-font-mono)",
          fontSize: 10,
          letterSpacing: "0.18em",
          color: "var(--co-muted)",
          marginBottom: 16,
          display: "flex",
          gap: 8,
          alignItems: "center",
        }}
      >
        <Link href="/" style={{ color: "var(--co-muted)", textDecoration: "none" }}>
          CIRCUIT/ORACLE
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/samples" style={{ color: "var(--co-muted)", textDecoration: "none" }}>
          SAMPLES
        </Link>
        <span aria-hidden="true">/</span>
        <span style={{ color: "var(--co-text)" }}>{sample.archiveId}</span>
      </nav>

      {/* Hero header */}
      <header
        style={{
          border: "1px solid var(--co-border-strong)",
          backgroundColor: "var(--co-surface)",
          padding: 0,
          marginBottom: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top strip */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            backgroundColor: `rgba(${accentRgb}, 0.14)`,
            borderBottom: `1px solid rgba(${accentRgb}, 0.3)`,
            fontFamily: "var(--co-font-mono)",
            fontSize: 10,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          <span>{isShare ? "SHARED ANALYSIS" : "ARCHIVE ENTRY"} · {sample.archiveId}</span>
          <span>{sample.era}</span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: 24,
            padding: "28px 28px 24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span
              style={{
                fontFamily: "var(--co-font-mono)",
                fontSize: 11,
                letterSpacing: "0.18em",
                color: "var(--co-text-dim)",
              }}
            >
              {sample.subtitle}
            </span>
            <h1
              style={{
                fontFamily: "var(--co-font-display)",
                fontWeight: 900,
                fontSize: "clamp(40px, 7vw, 76px)",
                lineHeight: 0.92,
                letterSpacing: "-0.02em",
                textTransform: "uppercase",
                color: "var(--co-text)",
                margin: 0,
              }}
            >
              {sample.title}
            </h1>
            <p
              style={{
                fontFamily: "var(--co-font-body)",
                fontSize: 16,
                lineHeight: 1.5,
                color: "var(--co-text-dim)",
                marginTop: 8,
                maxWidth: 640,
              }}
            >
              {sample.teaser}
            </p>
          </div>

          {/* Hero schematic */}
          <div
            style={{
              border: "1px solid var(--co-border)",
              backgroundColor: "var(--co-surface-3)",
              padding: "20px 28px",
              minHeight: 220,
              backgroundImage: `radial-gradient(circle, rgba(${accentRgb}, 0.06) 1px, transparent 1px)`,
              backgroundSize: "16px 16px",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", inset: 14 }}>
              <SampleSchematic schematic={sample.slug} color={accent} size="full" />
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            borderTop: "1px solid var(--co-border)",
            padding: "10px 20px",
            backgroundColor: "var(--co-surface-2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            fontFamily: "var(--co-font-mono)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--co-muted)",
          }}
        >
          <span>● ANALYSIS COMPLETE · 04 AGENTS</span>
          <Link
            href="/#upload-section"
            style={{
              color: accent,
              textDecoration: "none",
              padding: "4px 10px",
              border: `1px solid ${accent}66`,
            }}
          >
            ▸ ANALYZE YOUR OWN
          </Link>
        </div>
      </header>

      {/* Analysis panels */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {!isAgentError(analysis.components) && (
          <BlueprintPanel
            title="COMPONENT CATALOG"
            badge="[ AGENT 01 · COMPONENT ]"
            accent={accent}
          >
            <ComponentsBlock data={analysis.components} accent={accent} />
          </BlueprintPanel>
        )}

        {!isAgentError(analysis.topology) && (
          <BlueprintPanel
            title="CIRCUIT TOPOLOGY"
            badge="[ AGENT 02 · TOPOLOGY ]"
            accent={accent}
          >
            <TopologyBlock data={analysis.topology} accent={accent} />
          </BlueprintPanel>
        )}

        {!isAgentError(analysis.domain) && (
          <BlueprintPanel
            title="APPLICATION DOMAIN"
            badge="[ AGENT 03 · DOMAIN ]"
            accent={accent}
          >
            <DomainBlock data={analysis.domain} accent={accent} />
          </BlueprintPanel>
        )}

        <BlueprintPanel
          title="ENGINEERING SYNTHESIS"
          badge="[ AGENT 04 · SYNTHESIS ]"
          accent={accent}
        >
          <SynthesisBlock data={analysis.synthesis} accent={accent} />
        </BlueprintPanel>
      </div>

      {/* Footer CTA */}
      <div
        style={{
          marginTop: 32,
          padding: "24px 24px",
          backgroundColor: "var(--co-surface-2)",
          border: "1px solid var(--co-border-strong)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--co-font-mono)",
            fontSize: 10,
            letterSpacing: "0.22em",
            color: "var(--co-muted)",
          }}
        >
          [ END OF ANALYSIS ]
        </p>
        <p
          style={{
            fontFamily: "var(--co-font-display)",
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: "-0.01em",
            color: "var(--co-text)",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          Got a schematic of your own?
        </p>
        <p style={{ fontSize: 14, color: "var(--co-text-dim)", maxWidth: 540 }}>
          CircuitOracle dispatches four specialized agents in parallel to give you the same depth of analysis on any image you upload.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <Link
            href="/#upload-section"
            style={{
              padding: "10px 18px",
              backgroundColor: accent,
              color: "var(--co-bg)",
              fontFamily: "var(--co-font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
              textDecoration: "none",
              border: `1px solid ${accent}`,
            }}
          >
            ▸ UPLOAD SCHEMATIC
          </Link>
          <Link
            href="/samples"
            style={{
              padding: "10px 18px",
              backgroundColor: "transparent",
              color: "var(--co-text)",
              fontFamily: "var(--co-font-mono)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
              textDecoration: "none",
              border: "1px solid var(--co-border-strong)",
            }}
          >
            ◂ BACK TO ARCHIVE
          </Link>
        </div>
      </div>
    </div>
  );
}
