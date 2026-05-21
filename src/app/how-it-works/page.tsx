import type { Metadata, Route } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import CircuitBackground from "@/components/v2/CircuitBackground";
import ScanlineOverlay from "@/components/v2/ScanlineOverlay";
import PipelineDiagram from "@/components/marketing/PipelineDiagram";

export const metadata: Metadata = {
  title: "How it works — CircuitOracle",
  description:
    "Four Claude agents, three running in parallel, one writing the synthesis — streamed token-by-token over SSE. The technical breakdown of CircuitOracle's pipeline.",
};

const AGENT_SPECS: ReadonlyArray<{
  pn: string;
  name: string;
  reads: string;
  writes: string;
  charge: string;
}> = [
  {
    pn: "CO-7401N",
    name: "COMPONENT",
    reads: "raw image",
    writes: "JSON catalog of every R, C, U, Q, D",
    charge:
      "Goes part-by-part. Designator, type, value if printed, and what role the part plays (bypass, feedback, bias, pull-up). Does not guess values that aren't on the page.",
  },
  {
    pn: "CO-7402T",
    name: "TOPOLOGY",
    reads: "raw image",
    writes: "stages, feedback paths, key nodes",
    charge:
      "Names the topology — Sallen-Key, Colpitts, buck converter, common-emitter, whatever it is. Maps the stages and feedback loops, marks Vin / Vout / virtual-ground nodes. The structural pass.",
  },
  {
    pn: "CO-7403D",
    name: "DOMAIN",
    reads: "raw image",
    writes: "domain · application · frequency · industry",
    charge:
      "Decides what the circuit is for in the real world: audio, RF, power electronics, instrumentation, motor control. Pins down frequency range and likely industry context. The 'so what' pass.",
  },
  {
    pn: "CO-7499S",
    name: "SYNTHESIS",
    reads: "image + all three JSON outputs",
    writes: "engineering-depth analysis · streamed",
    charge:
      "Reads the other three agents' work, then writes the senior-engineer review: operating principle, derived parameters, design rationale, failure modes, suggested improvements. Streams its tokens to the browser as it thinks.",
  },
];

const WHY_BULLETS: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "Why three specialists instead of one big prompt?",
    a: "A single 2000-token system prompt covering components, topology, AND domain dilutes attention. Three focused prompts each get 100% of a Claude call. The synthesis agent then has structured JSON to argue against — not a wall of unstructured prose.",
  },
  {
    q: "Why Promise.allSettled, not Promise.all?",
    a: "If the topology agent times out, we still want the component catalog and the domain classification. Partial results beat a 500. The synthesis agent is built to degrade gracefully when one of the three inputs is missing.",
  },
  {
    q: "Why stream the synthesis?",
    a: "The synthesis pass takes 30–45s. Waiting that long with a spinner is rude. Streaming lets you start reading the operating principle while the failure-modes section is still being written. SSE, not WebSockets — simpler, plays nice with HTTP/2, and POST bodies via ReadableStream reader.",
  },
  {
    q: "Why JSON in the agents but prose in synthesis?",
    a: "The three specialist outputs need to be machine-readable so the synthesizer can cite them precisely. The final synthesis is for humans, so it gets the rich prose treatment with quantitative parameters in a structured table.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen">
      <CircuitBackground />
      <ScanlineOverlay intensity="subtle" />

      <main
        className="relative z-10"
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "96px 24px 64px",
        }}
      >
        {/* Top nav strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "56px",
          }}
        >
          <Link
            href="/"
            className="co-mono"
            style={{
              color: "var(--co-text-dim)",
              fontSize: "13px",
              letterSpacing: "0.16em",
              textDecoration: "none",
            }}
          >
            ← BACK TO ANALYZE
          </Link>
          <span
            className="co-mono"
            style={{
              color: "var(--co-muted)",
              fontSize: "12px",
              letterSpacing: "0.18em",
            }}
          >
            DOC · ARCHITECTURE · REV 02
          </span>
        </div>

        {/* Eyebrow */}
        <div
          className="co-label"
          style={{
            color: "var(--co-phosphor)",
            marginBottom: "20px",
            opacity: 0.9,
          }}
        >
          [ ARCHITECTURE · UNDER THE HOOD ]
        </div>

        <h1
          className="co-display"
          style={{
            fontSize: "clamp(40px, 7vw, 76px)",
            lineHeight: 0.95,
            margin: "0 0 24px",
            color: "var(--co-text)",
          }}
        >
          Four agents. Three in{" "}
          <span style={{ color: "var(--co-phosphor)" }}>parallel</span>. One that{" "}
          <span style={{ color: "var(--co-amber)" }}>streams</span>.
        </h1>

        <p
          style={{
            fontFamily: "var(--co-font-body)",
            fontSize: "21px",
            lineHeight: 1.6,
            color: "var(--co-text-dim)",
            margin: "0 0 48px",
            maxWidth: "62ch",
          }}
        >
          When you upload a schematic, three specialist Claude agents read the
          image simultaneously. Each writes structured JSON. A fourth agent —
          the synthesizer — takes the image plus all three JSON outputs and
          writes the engineer-depth analysis, streaming its tokens to your
          browser as it composes. Total wall-clock: 40–60 seconds. Reading it
          in real time: way more fun than a spinner.
        </p>

        {/* Pipeline diagram */}
        <div style={{ marginBottom: "64px" }}>
          <PipelineDiagram />
        </div>

        {/* Agent rolodex */}
        <section
          aria-labelledby="agents-heading"
          style={{ marginBottom: "64px" }}
        >
          <h2
            id="agents-heading"
            className="co-display"
            style={{
              fontSize: "32px",
              lineHeight: 1.05,
              margin: "0 0 24px",
              color: "var(--co-text)",
            }}
          >
            The four agents
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "1px",
              backgroundColor: "var(--co-border-strong)",
              border: "1px solid var(--co-border-strong)",
            }}
          >
            {AGENT_SPECS.map((spec) => (
              <div
                key={spec.pn}
                style={{
                  backgroundColor: "var(--co-surface)",
                  padding: "24px 28px",
                  display: "grid",
                  gridTemplateColumns: "minmax(140px, 200px) 1fr",
                  gap: "32px",
                  alignItems: "start",
                }}
              >
                {/* Left side — IC label */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    minWidth: 0,
                  }}
                >
                  <span
                    className="co-mono"
                    style={{
                      color:
                        spec.name === "SYNTHESIS"
                          ? "var(--co-amber)"
                          : "var(--co-phosphor)",
                      fontSize: "17px",
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                    }}
                  >
                    {spec.name}
                  </span>
                  <span
                    className="co-mono"
                    style={{
                      color: "var(--co-muted)",
                      fontSize: "12px",
                      letterSpacing: "0.18em",
                    }}
                  >
                    {spec.pn}
                  </span>
                  <div
                    style={{
                      marginTop: "10px",
                      fontFamily: "var(--co-font-mono)",
                      fontSize: "12px",
                      letterSpacing: "0.04em",
                      lineHeight: 1.65,
                      color: "var(--co-text-dim)",
                    }}
                  >
                    <div>
                      <span style={{ color: "var(--co-muted)" }}>READS </span>
                      {spec.reads}
                    </div>
                    <div>
                      <span style={{ color: "var(--co-muted)" }}>WRITES </span>
                      {spec.writes}
                    </div>
                  </div>
                </div>

                {/* Right side — charge */}
                <p
                  style={{
                    fontFamily: "var(--co-font-body)",
                    fontSize: "17px",
                    lineHeight: 1.65,
                    color: "var(--co-text)",
                    margin: 0,
                    maxWidth: "58ch",
                  }}
                >
                  {spec.charge}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why-it's-built-this-way Q&A */}
        <section
          aria-labelledby="why-heading"
          style={{ marginBottom: "64px" }}
        >
          <h2
            id="why-heading"
            className="co-display"
            style={{
              fontSize: "32px",
              lineHeight: 1.05,
              margin: "0 0 24px",
              color: "var(--co-text)",
            }}
          >
            Design notes
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            {WHY_BULLETS.map((item, idx) => (
              <div
                key={item.q}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1fr",
                  gap: "20px",
                  alignItems: "start",
                }}
              >
                <span
                  className="co-mono"
                  style={{
                    color: "var(--co-amber)",
                    fontSize: "12px",
                    letterSpacing: "0.18em",
                    paddingTop: "6px",
                  }}
                >
                  Q.{String(idx + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--co-font-display)",
                      fontWeight: 700,
                      fontSize: "22px",
                      lineHeight: 1.2,
                      margin: "0 0 10px",
                      color: "var(--co-text)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.q}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--co-font-body)",
                      fontSize: "17px",
                      lineHeight: 1.65,
                      color: "var(--co-text-dim)",
                      margin: 0,
                      maxWidth: "62ch",
                    }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Spec card */}
        <section style={{ marginBottom: "48px" }}>
          <h2
            className="co-display"
            style={{
              fontSize: "32px",
              lineHeight: 1.05,
              margin: "0 0 20px",
              color: "var(--co-text)",
            }}
          >
            Spec sheet
          </h2>
          <div
            style={{
              border: "1px solid var(--co-border-strong)",
              backgroundColor: "var(--co-surface)",
              padding: "24px 28px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "20px 32px",
            }}
          >
            {[
              ["MODEL", "claude-sonnet-4-6"],
              ["TRANSPORT", "SSE · text/event-stream"],
              ["RUNTIME", "Node.js · maxDuration 60s"],
              ["RATE LIMIT", "10 req / 60s / IP"],
              ["MAX IMAGE", "10 MB · image/* only"],
              ["IMAGE STORAGE", "none · base64 in-memory only"],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span
                  className="co-label"
                  style={{
                    color: "var(--co-muted)",
                    fontSize: "12px",
                    letterSpacing: "0.18em",
                  }}
                >
                  {label}
                </span>
                <span
                  className="co-mono"
                  style={{
                    color: "var(--co-text)",
                    fontSize: "14px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <Link
            href={"/" as Route}
            className="co-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 22px",
              backgroundColor: "var(--co-phosphor)",
              color: "var(--co-bg)",
              fontSize: "13px",
              letterSpacing: "0.16em",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            TRY IT NOW <span aria-hidden>→</span>
          </Link>
          <Link
            href={"/about" as Route}
            className="co-mono"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 22px",
              border: "1px solid var(--co-border-strong)",
              color: "var(--co-text)",
              fontSize: "13px",
              letterSpacing: "0.16em",
              textDecoration: "none",
            }}
          >
            WHY WE BUILT IT
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
