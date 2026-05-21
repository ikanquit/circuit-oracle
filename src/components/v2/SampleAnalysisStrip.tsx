"use client";

import Link from "next/link";
import type { CSSProperties, JSX, ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

type AccentKey = "phosphor" | "amber" | "copper" | "blueprint";

interface Sample {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tag: string;
  accent: AccentKey;
  specs: Array<[string, string]>;
}

const SAMPLES: Sample[] = [
  {
    id: "S-001",
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
    id: "S-002",
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
    id: "S-003",
    slug: "common-emitter",
    title: "COMMON-EMITTER",
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
    id: "S-004",
    slug: "rc-low-pass",
    title: "RC LOW-PASS",
    subtitle: "1st ORDER · PASSIVE",
    tag: "FILTER",
    accent: "blueprint",
    specs: [
      ["fc", "160Hz"],
      ["R", "10k"],
      ["C", "100nF"],
    ],
  },
  {
    id: "S-005",
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
/* SVG fragments — one per sample                                      */
/* ------------------------------------------------------------------ */

interface FragmentProps {
  color: string;
}

function FragmentInvertingAmp({ color }: FragmentProps): JSX.Element {
  // Op-amp triangle with feedback resistor + input resistor
  return (
    <svg
      viewBox="0 0 100 80"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      opacity={0.7}
      aria-hidden="true"
    >
      {/* Input wire + Rin (zigzag) */}
      <path d="M4 44 H18" />
      <path d="M18 44 L20 40 L24 48 L28 40 L32 48 L36 40 L40 44" />
      <path d="M40 44 H46" />
      {/* Op-amp triangle (inverting input at top) */}
      <path d="M46 32 L46 56 L70 44 Z" />
      <text
        x={49}
        y={38}
        fill={color}
        stroke="none"
        fontSize={6}
        fontFamily="monospace"
      >
        −
      </text>
      <text
        x={49}
        y={54}
        fill={color}
        stroke="none"
        fontSize={6}
        fontFamily="monospace"
      >
        +
      </text>
      {/* Non-inverting to ground */}
      <path d="M46 52 H42 V64" />
      <path d="M38 64 H46" />
      <path d="M40 67 H44" />
      <path d="M41.5 70 H42.5" />
      {/* Output */}
      <path d="M70 44 H92" />
      {/* Feedback path (Rf) */}
      <path d="M46 22 H58" />
      <path d="M58 22 L60 18 L64 26 L68 18 L72 26 L76 18 L78 22" />
      <path d="M78 22 H84 V44" />
      <path d="M46 22 V32" />
    </svg>
  );
}

function FragmentSquareWave({ color }: FragmentProps): JSX.Element {
  // 555 astable output — square wave
  return (
    <svg
      viewBox="0 0 100 80"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      opacity={0.7}
      aria-hidden="true"
    >
      {/* axes */}
      <path d="M6 64 H94" strokeDasharray="2 3" opacity={0.5} />
      <path d="M10 14 V70" strokeDasharray="2 3" opacity={0.5} />
      {/* square wave */}
      <path d="M10 56 H22 V24 H40 V56 H58 V24 H76 V56 H90" />
      {/* tick marks */}
      <path d="M22 64 V67" opacity={0.6} />
      <path d="M40 64 V67" opacity={0.6} />
      <path d="M58 64 V67" opacity={0.6} />
      <path d="M76 64 V67" opacity={0.6} />
      {/* small period bracket */}
      <path d="M22 18 H40" />
      <path d="M22 16 V20" />
      <path d="M40 16 V20" />
    </svg>
  );
}

function FragmentCommonEmitter({ color }: FragmentProps): JSX.Element {
  // BJT NPN amplifier with collector & emitter resistors
  return (
    <svg
      viewBox="0 0 100 80"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      opacity={0.7}
      aria-hidden="true"
    >
      {/* Vcc rail */}
      <path d="M10 8 H90" />
      {/* Rc (collector resistor) */}
      <path d="M58 8 V14" />
      <path d="M58 14 L54 16 L62 20 L54 24 L62 28 L54 32 L58 34" />
      <path d="M58 34 V42" />
      {/* Transistor circle */}
      <circle cx={58} cy={50} r={8} />
      {/* Base line */}
      <path d="M52 50 H56" />
      {/* Collector line into circle */}
      <path d="M58 42 V46 L56 50" />
      {/* Emitter line + arrow */}
      <path d="M56 50 L62 56 V62" />
      <path d="M61 53 L63 56 L60 56 Z" fill={color} stroke="none" />
      {/* Re (emitter resistor) */}
      <path d="M58 62 L54 64 L62 68 L58 70" />
      {/* GND */}
      <path d="M54 72 H62" />
      <path d="M56 74 H60" />
      {/* Input coupling cap + signal */}
      <path d="M14 50 H30" />
      <path d="M30 44 V56" />
      <path d="M34 44 V56" />
      <path d="M34 50 H52" />
      {/* Base bias resistor to GND */}
      <path d="M48 50 V58" />
      <path d="M48 58 L46 60 L50 64 L46 68 L50 72" />
      <path d="M46 74 H50" />
      {/* Output node */}
      <path d="M58 38 H86" />
      <path d="M86 38 V46" />
    </svg>
  );
}

function FragmentRCLowPass({ color }: FragmentProps): JSX.Element {
  // Bode plot corner + RC schematic hybrid: schematic at top, frequency response below
  return (
    <svg
      viewBox="0 0 100 80"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      opacity={0.7}
      aria-hidden="true"
    >
      {/* Schematic: Vin — R — Vout, C to GND */}
      <path d="M6 16 H18" />
      {/* Resistor zigzag */}
      <path d="M18 16 L20 12 L24 20 L28 12 L32 20 L36 12 L38 16" />
      <path d="M38 16 H58" />
      <path d="M58 16 V24" />
      {/* Capacitor plates */}
      <path d="M52 24 H64" />
      <path d="M52 28 H64" />
      <path d="M58 28 V34" />
      {/* GND */}
      <path d="M54 34 H62" />
      <path d="M55 36 H61" />
      <path d="M57 38 H59" />
      {/* Output */}
      <path d="M58 16 H92" />
      <text
        x={92}
        y={14}
        fill={color}
        stroke="none"
        fontSize={5}
        fontFamily="monospace"
        textAnchor="end"
      >
        Vout
      </text>

      {/* Bode magnitude curve below */}
      <path d="M6 70 H94" strokeDasharray="2 3" opacity={0.5} />
      <path d="M10 48 V72" strokeDasharray="2 3" opacity={0.5} />
      {/* Flat then roll-off */}
      <path d="M10 52 H46 Q56 52 60 58 L88 72" />
      {/* fc marker */}
      <path d="M46 70 V73" />
      <text
        x={46}
        y={79}
        fill={color}
        stroke="none"
        fontSize={5}
        fontFamily="monospace"
        textAnchor="middle"
      >
        fc
      </text>
    </svg>
  );
}

function FragmentBuckConverter({ color }: FragmentProps): JSX.Element {
  // SMPS topology: switch, inductor, diode, output cap + ripple waveform
  return (
    <svg
      viewBox="0 0 100 80"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      opacity={0.7}
      aria-hidden="true"
    >
      {/* Vin rail */}
      <path d="M6 14 H22" />
      {/* Switch (drawn as MOSFET-like break) */}
      <path d="M22 14 L30 10" />
      <circle cx={22} cy={14} r={1.4} fill={color} stroke="none" />
      <circle cx={30} cy={10} r={1.4} fill={color} stroke="none" />
      <path d="M30 14 H38" />
      {/* Inductor (loops) */}
      <path d="M38 14 Q42 8 46 14 Q50 8 54 14 Q58 8 62 14 Q66 8 70 14" />
      {/* Output node */}
      <path d="M70 14 H92" />
      <text
        x={92}
        y={11}
        fill={color}
        stroke="none"
        fontSize={5}
        fontFamily="monospace"
        textAnchor="end"
      >
        Vout
      </text>
      {/* Diode to GND from switch node */}
      <path d="M38 14 V24" />
      <path d="M34 24 L42 24 L38 30 Z" />
      <path d="M34 30 H42" />
      <path d="M38 30 V36" />
      {/* GND symbol 1 */}
      <path d="M34 36 H42" />
      <path d="M35 38 H41" />
      <path d="M37 40 H39" />
      {/* Output cap */}
      <path d="M82 14 V24" />
      <path d="M76 24 H88" />
      <path d="M76 28 H88" />
      <path d="M82 28 V36" />
      <path d="M78 36 H86" />
      <path d="M79 38 H85" />
      <path d="M81 40 H83" />

      {/* Ripple waveform below */}
      <path d="M6 60 H94" strokeDasharray="2 3" opacity={0.4} />
      <path d="M10 56 L18 64 L26 56 L34 64 L42 56 L50 64 L58 56 L66 64 L74 56 L82 64 L90 56" />
    </svg>
  );
}

const FRAGMENTS: Record<string, (props: FragmentProps) => JSX.Element> = {
  "S-001": FragmentInvertingAmp,
  "S-002": FragmentSquareWave,
  "S-003": FragmentCommonEmitter,
  "S-004": FragmentRCLowPass,
  "S-005": FragmentBuckConverter,
};

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

function SampleCard({ sample }: { sample: Sample }): JSX.Element {
  const accentVar = ACCENT_VAR[sample.accent];
  const accentRgb = ACCENT_RGB[sample.accent];
  const Fragment = FRAGMENTS[sample.id];

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

        {/* Schematic fragment */}
        <div style={schematicStyle}>
          <div
            style={{
              width: "100%",
              height: "100%",
              maxWidth: 220,
              maxHeight: 100,
            }}
          >
            <Fragment color={accentVar} />
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
            {"[ SAMPLE ARCHIVE · 05/127 ]"}
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
