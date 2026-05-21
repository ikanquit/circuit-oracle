import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, JSX } from "react";
import CircuitBackground from "@/components/v2/CircuitBackground";
import ScanlineOverlay from "@/components/v2/ScanlineOverlay";
import TickerFooter from "@/components/v2/TickerFooter";
import SampleCard from "@/components/samples/SampleCard";
import { listSamples } from "@/lib/samples";

export const metadata: Metadata = {
  title: "Sample Archive — CircuitOracle",
  description:
    "A curated archive of famous circuit topologies — 555 timer, op-amp inverting amp, common-emitter BJT, H-bridge, buck converter — each with a full multi-agent engineering analysis. Browse before you upload.",
  openGraph: {
    title: "Sample Archive · CircuitOracle",
    description:
      "Famous circuits, pre-analyzed by four parallel AI agents. From voltage dividers to H-bridges.",
    type: "website",
  },
};

export default function SamplesPage(): JSX.Element {
  const samples = listSamples();

  // group by difficulty for the section header (gallery itself is one grid)
  const counts = samples.reduce(
    (acc, s) => {
      acc[s.difficulty]++;
      return acc;
    },
    { BEGINNER: 0, INTERMEDIATE: 0, ADVANCED: 0 } as Record<string, number>
  );

  const headerStyle: CSSProperties = {
    padding: "64px 16px 32px",
    maxWidth: 1200,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  };

  return (
    <div className="relative min-h-screen">
      <CircuitBackground />
      <ScanlineOverlay intensity="subtle" />

      <main className="relative z-10">
        {/* Breadcrumb / nav */}
        <nav
          style={{
            padding: "18px 24px",
            fontFamily: "var(--co-font-mono)",
            fontSize: 12,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--co-muted)",
            borderBottom: "1px solid var(--co-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link href="/" style={{ color: "var(--co-text)", textDecoration: "none" }}>
            ◂ CIRCUIT/ORACLE
          </Link>
          <span>SAMPLE ARCHIVE · {String(samples.length).padStart(3, "0")} ENTRIES</span>
        </nav>

        {/* Hero header */}
        <section style={headerStyle}>
          {/* Top label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                backgroundColor: "var(--co-phosphor)",
                boxShadow: "0 0 8px var(--co-phosphor)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--co-font-mono)",
                fontSize: 12,
                letterSpacing: "0.22em",
                color: "var(--co-muted)",
              }}
            >
              [ SAMPLE ARCHIVE · CURATED ]
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--co-font-display)",
              fontWeight: 900,
              fontSize: "clamp(48px, 9vw, 110px)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: "var(--co-text)",
              margin: 0,
              maxWidth: 1100,
            }}
          >
            Famous circuits,
            <br />
            <span style={{ color: "var(--co-phosphor)" }}>pre-analyzed.</span>
          </h1>

          <p
            style={{
              fontFamily: "var(--co-font-body)",
              fontSize: 18,
              lineHeight: 1.6,
              color: "var(--co-text-dim)",
              maxWidth: 720,
              marginTop: 4,
            }}
          >
            Don&rsquo;t have a schematic to upload? Every circuit in this archive has already been run through CircuitOracle&rsquo;s four-agent pipeline. Read the breakdowns to see what the system can do — then drop your own image in.
          </p>

          {/* Stats strip */}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              flexWrap: "wrap",
              gap: 24,
              fontFamily: "var(--co-font-mono)",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--co-text-dim)",
              borderTop: "1px solid var(--co-border)",
              paddingTop: 18,
            }}
          >
            <div>
              <span style={{ color: "var(--co-phosphor)", marginRight: 8 }}>
                {samples.length.toString().padStart(2, "0")}
              </span>
              ENTRIES
            </div>
            <div>
              <span style={{ color: "var(--co-blueprint)", marginRight: 8 }}>
                {counts.BEGINNER.toString().padStart(2, "0")}
              </span>
              BEGINNER
            </div>
            <div>
              <span style={{ color: "var(--co-amber)", marginRight: 8 }}>
                {counts.INTERMEDIATE.toString().padStart(2, "0")}
              </span>
              INTERMEDIATE
            </div>
            <div>
              <span style={{ color: "var(--co-copper)", marginRight: 8 }}>
                {counts.ADVANCED.toString().padStart(2, "0")}
              </span>
              ADVANCED
            </div>
            <div style={{ marginLeft: "auto", color: "var(--co-muted)" }}>
              ▸ HAND-AUTHORED BY ENGINEERS
            </div>
          </div>
        </section>

        {/* Gallery grid */}
        <section
          style={{
            padding: "16px 16px 80px",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <style>{`
            .co-sample-card-link {
              outline: none;
            }
            .co-sample-card-link:focus-visible .co-sample-card-v2 {
              border-color: var(--co-card-accent) !important;
              box-shadow:
                0 0 0 2px rgba(var(--co-card-accent-rgb), 0.35),
                0 6px 24px -10px rgba(var(--co-card-accent-rgb), 0.5);
            }
            .co-sample-card-link:hover .co-sample-card-v2 {
              border-color: var(--co-card-accent) !important;
              box-shadow:
                0 8px 28px -10px rgba(var(--co-card-accent-rgb), 0.45),
                0 0 0 1px rgba(var(--co-card-accent-rgb), 0.22);
              transform: translateY(-3px);
            }
            .co-sample-card-link:hover .co-sample-card-view-v2 {
              transform: translateX(4px);
            }
            .co-sample-card-view-v2 {
              transition: transform 200ms ease;
              display: inline-block;
            }
          `}</style>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {samples.map((s) => (
              <SampleCard key={s.slug} sample={s} />
            ))}
          </div>
        </section>

        <TickerFooter />
      </main>
    </div>
  );
}
