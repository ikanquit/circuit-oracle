"use client";

import Link from "next/link";
import type { CSSProperties, JSX } from "react";
import type { SampleMeta } from "@/lib/samples";
import SampleSchematic from "./SampleSchematic";

const ACCENT_VAR: Record<SampleMeta["accent"], string> = {
  phosphor: "var(--co-phosphor)",
  amber: "var(--co-amber)",
  copper: "var(--co-copper)",
  blueprint: "var(--co-blueprint)",
};

const ACCENT_RGB: Record<SampleMeta["accent"], string> = {
  phosphor: "198, 255, 77",
  amber: "255, 181, 71",
  copper: "217, 119, 66",
  blueprint: "79, 158, 255",
};

const DIFFICULTY_LABEL: Record<SampleMeta["difficulty"], string> = {
  BEGINNER: "L1 · BEGINNER",
  INTERMEDIATE: "L2 · INTERMEDIATE",
  ADVANCED: "L3 · ADVANCED",
};

interface SampleCardProps {
  sample: SampleMeta;
}

export default function SampleCard({ sample }: SampleCardProps): JSX.Element {
  const accent = ACCENT_VAR[sample.accent];
  const accentRgb = ACCENT_RGB[sample.accent];

  const cardStyle: CSSProperties = {
    backgroundColor: "var(--co-surface-2)",
    border: "1px solid var(--co-border-strong)",
    borderRadius: 0,
    overflow: "hidden",
    color: "var(--co-text)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    transition:
      "border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease",
    ["--co-card-accent" as string]: accent,
    ["--co-card-accent-rgb" as string]: accentRgb,
  };

  return (
    <Link
      href={`/samples/${sample.slug}`}
      className="co-sample-card-link group"
      style={{ textDecoration: "none", display: "block", height: "100%" }}
      aria-label={`View analysis of ${sample.title}`}
    >
      <article style={cardStyle} className="co-sample-card-v2">
        {/* Top strip: archive ID + tag */}
        <div
          style={{
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 12px",
            backgroundColor: `rgba(${accentRgb}, 0.16)`,
            color: accent,
            fontFamily: "var(--co-font-mono)",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            borderBottom: "1px solid var(--co-border)",
          }}
        >
          <span>{sample.archiveId}</span>
          <span>{sample.tag}</span>
        </div>

        {/* Schematic preview */}
        <div
          style={{
            height: 168,
            backgroundColor: "var(--co-surface-3)",
            borderBottom: "1px solid var(--co-border)",
            position: "relative",
            overflow: "hidden",
            backgroundImage: `radial-gradient(circle, rgba(${accentRgb}, 0.05) 1px, transparent 1px)`,
            backgroundSize: "12px 12px",
          }}
        >
          {/* corner brackets */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              width: 8,
              height: 8,
              borderTop: `1px solid ${accent}`,
              borderLeft: `1px solid ${accent}`,
              opacity: 0.7,
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 8,
              height: 8,
              borderTop: `1px solid ${accent}`,
              borderRight: `1px solid ${accent}`,
              opacity: 0.7,
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 6,
              left: 6,
              width: 8,
              height: 8,
              borderBottom: `1px solid ${accent}`,
              borderLeft: `1px solid ${accent}`,
              opacity: 0.7,
            }}
          />
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 6,
              right: 6,
              width: 8,
              height: 8,
              borderBottom: `1px solid ${accent}`,
              borderRight: `1px solid ${accent}`,
              opacity: 0.7,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 14,
            }}
          >
            <SampleSchematic schematic={sample.slug} color={accent} />
          </div>
        </div>

        {/* Middle: title + subtitle + teaser */}
        <div
          style={{
            padding: "16px 16px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            flex: 1,
          }}
        >
          <span
            style={{
              fontFamily: "var(--co-font-mono)",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--co-text-dim)",
            }}
          >
            {sample.subtitle}
          </span>
          <h3
            style={{
              fontFamily: "var(--co-font-display)",
              fontWeight: 900,
              fontSize: 24,
              lineHeight: 0.95,
              letterSpacing: "-0.01em",
              color: "var(--co-text)",
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            {sample.title}
          </h3>
          <p
            style={{
              fontFamily: "var(--co-font-body)",
              fontSize: 13,
              lineHeight: 1.5,
              color: "var(--co-text-dim)",
              marginTop: 4,
            }}
          >
            {sample.teaser}
          </p>
        </div>

        {/* Bottom strip: difficulty + CTA */}
        <div
          style={{
            height: 32,
            borderTop: "1px solid var(--co-border)",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: "var(--co-font-mono)",
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ color: "var(--co-muted)" }}>
            {DIFFICULTY_LABEL[sample.difficulty]}
          </span>
          <span className="co-sample-card-view-v2" style={{ color: accent }}>
            VIEW ▸
          </span>
        </div>
      </article>
    </Link>
  );
}
