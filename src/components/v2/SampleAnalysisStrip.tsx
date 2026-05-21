"use client";

import Link from "next/link";
import type { CSSProperties, JSX, ReactNode } from "react";
import SampleSchematic from "@/components/samples/SampleSchematic";
import type { SchematicKey } from "@/lib/samples";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type AccentKey = "phosphor" | "amber" | "copper" | "blueprint";

interface Sample {
  id: string;
  slug: SchematicKey;
  title: string;
  subtitle: string;
  tag: string;
  accent: AccentKey;
  specs: Array<[string, string]>;
}

const SAMPLES: Sample[] = [
  {
    id: "S-003",
    slug: "inverting-amp",
    title: "INVERTING AMPLIFIER",
    subtitle: "TL072 · OP-AMP",
    tag: "ANALOG",
    accent: "phosphor",
    specs: [
      ["GAIN", "−10×"],
      ["BW", "1MHz"],
      ["Vcc", "±15V"],
    ],
  },
  {
    id: "S-005",
    slug: "555-astable",
    title: "555 ASTABLE",
    subtitle: "NE555 · TIMER",
    tag: "TIMING",
    accent: "amber",
    specs: [
      ["FREQ", "1kHz"],
      ["DUTY", "50%"],
      ["Vcc", "+5V"],
    ],
  },
  {
    id: "S-004",
    slug: "common-emitter",
    title: "COMMON-EMITTER AMP",
    subtitle: "2N3904 · BJT",
    tag: "AMP",
    accent: "copper",
    specs: [
      ["GAIN", "−45×"],
      ["Ic", "1mA"],
      ["Vcc", "+12V"],
    ],
  },
  {
    id: "S-002",
    slug: "rc-low-pass",
    title: "RC LOW-PASS FILTER",
    subtitle: "1ST-ORDER · PASSIVE",
    tag: "FILTER",
    accent: "blueprint",
    specs: [
      ["fc", "160Hz"],
      ["R", "10k"],
      ["C", "100nF"],
    ],
  },
  {
    id: "S-008",
    slug: "buck-converter",
    title: "BUCK CONVERTER",
    subtitle: "LM2596 · SMPS",
    tag: "POWER",
    accent: "phosphor",
    specs: [
      ["Vin", "12V"],
      ["Vout", "5V"],
      ["Iout", "3A"],
    ],
  },
];

const ACCENT_VAR: Record<AccentKey, string> = {
  phosphor: "var(--co-phosphor)",
  amber: "var(--co-amber)",
  copper: "var(--co-copper)",
  blueprint: "var(--co-blueprint)",
};

// rgba versions for low-opacity backgrounds & shadows (CSS vars can't be mixed easily)
const ACCENT_RGB: Record<AccentKey, string> = {
  phosphor: "198, 255, 77",
  amber: "255, 181, 71",
  copper: "217, 119, 66",
  blueprint: "79, 158, 255",
};

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

function SampleCard({ sample }: { sample: Sample }): JSX.Element {
  const accentVar = ACCENT_VAR[sample.accent];
  const accentRgb = ACCENT_RGB[sample.accent];

  const cardStyle: CSSProperties = {
    flex: "none",
    width: 288,
    height: 376,
    scrollSnapAlign: "start",
    backgroundColor: "var(--co-surface-2)",
    border: "1px solid var(--co-border-strong)",
    borderRadius: 0,
    padding: 0,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    color: "var(--co-text)",
    transition:
      "border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
    cursor: "pointer",
    // CSS variable consumed by hover rules
    ["--co-card-accent" as string]: accentVar,
    ["--co-card-accent-rgb" as string]: accentRgb,
  };

  const topStripStyle: CSSProperties = {
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 12px",
    backgroundColor: `rgba(${accentRgb}, 0.2)`,
    color: accentVar,
    fontFamily: "var(--co-font-mono)",
    fontSize: 12,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    borderBottom: "1px solid var(--co-border)",
  };

  const middleStyle: CSSProperties = {
    flex: 1,
    padding: "16px 14px",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    minHeight: 0,
  };

  const partLabelStyle: CSSProperties = {
    fontFamily: "var(--co-font-mono)",
    fontSize: 11,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "var(--co-muted)",
    fontWeight: 500,
  };

  const subtitleStyle: CSSProperties = {
    fontFamily: "var(--co-font-mono)",
    fontSize: 13,
    color: "var(--co-text-dim)",
    letterSpacing: "0.06em",
    marginTop: 2,
  };

  const titleStyle: CSSProperties = {
    fontFamily: "var(--co-font-display)",
    fontWeight: 900,
    fontSize: 28,
    lineHeight: 0.95,
    letterSpacing: "-0.01em",
    color: "var(--co-text)",
    textTransform: "uppercase",
    marginTop: 10,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical" as CSSProperties["WebkitBoxOrient"],
  };

  const schematicStyle: CSSProperties = {
    height: 120,
    backgroundColor: "var(--co-surface-3)",
    borderTop: "1px solid var(--co-border)",
    borderBottom: "1px solid var(--co-border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 16px",
    position: "relative",
    overflow: "hidden",
  };

  const specsStyle: CSSProperties = {
    padding: "8px 14px 0 14px",
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    columnGap: 12,
    rowGap: 4,
    fontFamily: "var(--co-font-mono)",
  };

  const bottomStripStyle: CSSProperties = {
    height: 32,
    borderTop: "1px solid var(--co-border)",
    padding: "0 12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontFamily: "var(--co-font-mono)",
    fontSize: 12,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    fontWeight: 500,
  };

  const specsRows: ReactNode = sample.specs.map(([label, value]) => (
    <div key={label} style={{ display: "contents" }}>
      <span
        style={{
          fontSize: 11,
          color: "var(--co-muted)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          alignSelf: "baseline",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 13,
          color: "var(--co-text)",
          letterSpacing: "0.04em",
          textAlign: "right",
          alignSelf: "baseline",
        }}
      >
        {value}
      </span>
    </div>
  ));

  return (
    <Link
      href={`/samples/${sample.slug}`}
      className="co-sample-card-link"
      style={{ textDecoration: "none", color: "inherit", display: "block" }}
      aria-label={`Read analysis of ${sample.title}`}
    >
      <article className="co-sample-card" style={cardStyle}>
        {/* Top strip */}
        <div style={topStripStyle}>
          <span>{sample.id}</span>
          <span>{sample.tag}</span>
        </div>

        {/* Middle text area */}
        <div style={middleStyle}>
          <span style={partLabelStyle}>PART</span>
          <span style={subtitleStyle}>{sample.subtitle}</span>
          <h3 style={titleStyle}>{sample.title}</h3>
        </div>

        {/* Schematic — same renderer the detail page uses */}
        <div style={schematicStyle}>
          <div
            style={{
              width: "100%",
              height: "100%",
              maxWidth: 220,
              maxHeight: 100,
            }}
          >
            <SampleSchematic schematic={sample.slug} color={accentVar} />
          </div>
        </div>

        {/* Specs */}
        <div style={specsStyle}>{specsRows}</div>

        {/* Spacer to push bottom strip down */}
        <div style={{ flex: 1, minHeight: 4 }} />

        {/* Bottom strip */}
        <div style={bottomStripStyle}>
          <span style={{ color: "var(--co-muted)" }}>ANALYSIS COMPLETE</span>
          <span className="co-sample-card-view" style={{ color: accentVar }}>
            {"▸ VIEW"}
          </span>
        </div>
      </article>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Strip                                                               */
/* ------------------------------------------------------------------ */

export default function SampleAnalysisStrip(): JSX.Element {
  const headerStyle: CSSProperties = {
    padding: "16px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  };

  const headerLeftStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
  };

  const phosphorSquareStyle: CSSProperties = {
    width: 8,
    height: 8,
    backgroundColor: "var(--co-phosphor)",
    boxShadow: "0 0 6px rgba(198, 255, 77, 0.55)",
  };

  const headerRightStyle: CSSProperties = {
    fontFamily: "var(--co-font-mono)",
    fontSize: 12,
    letterSpacing: "0.22em",
    textTransform: "uppercase",
    color: "var(--co-muted)",
  };

  const scrollStyle: CSSProperties = {
    scrollPaddingLeft: 32,
  };

  return (
    <section aria-label="Sample analysis archive">
      <style jsx global>{`
        .co-sample-strip {
          scrollbar-width: thin;
          scrollbar-color: var(--co-border-strong) transparent;
        }
        .co-sample-strip::-webkit-scrollbar {
          height: 6px;
        }
        .co-sample-strip::-webkit-scrollbar-track {
          background: transparent;
        }
        .co-sample-strip::-webkit-scrollbar-thumb {
          background: var(--co-border-strong);
          border-radius: 0;
        }
        .co-sample-strip::-webkit-scrollbar-thumb:hover {
          background: var(--co-muted);
        }
        .co-sample-strip::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }
        .co-sample-card:hover {
          border-color: var(--co-card-accent) !important;
          box-shadow: 0 8px 24px -8px rgba(var(--co-card-accent-rgb), 0.35),
            0 0 0 1px rgba(var(--co-card-accent-rgb), 0.18);
          transform: translateY(-2px);
        }
        .co-sample-card:hover .co-sample-card-view {
          transform: translateX(4px);
        }
        .co-sample-card-view {
          transition: transform 200ms ease;
          display: inline-block;
        }
      `}</style>

      {/* Section header */}
      <div style={headerStyle}>
        <div style={headerLeftStyle}>
          <span aria-hidden="true" style={phosphorSquareStyle} />
          <span className="co-label">
            {"[ SAMPLE ARCHIVE · 05/09 ]"}
          </span>
        </div>
        <span style={headerRightStyle}>{"← SCROLL →"}</span>
      </div>

      {/* Scroll strip */}
      <div
        className="co-sample-strip flex gap-4 px-8 pb-6 overflow-x-auto snap-x snap-mandatory"
        style={scrollStyle}
      >
        {SAMPLES.map((sample) => (
          <SampleCard key={sample.id} sample={sample} />
        ))}
      </div>
    </section>
  );
}
