/**
 * Sample analyses — pre-baked AnalysisResult blobs for famous circuits.
 *
 * These are hand-authored to match the shape produced by the synthesis agent
 * (see src/lib/agents/types.ts). They power:
 *   - the /samples gallery (browse without uploading)
 *   - the /samples/[slug] detail page
 *   - the /share/[id] share page (same shape, looked up by id)
 *
 * The id and slug are intentionally identical for samples — a sample at
 * /samples/555-astable is the same payload as /share/555-astable.
 */
import type { AnalysisResult } from "@/lib/agents/types";

import inverting from "@/data/samples/inverting-amp.json";
import astable555 from "@/data/samples/555-astable.json";
import commonEmitter from "@/data/samples/common-emitter.json";
import rcLowPass from "@/data/samples/rc-low-pass.json";
import voltageDivider from "@/data/samples/voltage-divider.json";
import hBridge from "@/data/samples/h-bridge.json";
import multivibrator from "@/data/samples/multivibrator.json";
import buck from "@/data/samples/buck-converter.json";
import wienBridge from "@/data/samples/wien-bridge.json";

export type SchematicKey =
  | "inverting-amp"
  | "555-astable"
  | "common-emitter"
  | "rc-low-pass"
  | "voltage-divider"
  | "h-bridge"
  | "multivibrator"
  | "buck-converter"
  | "wien-bridge";

export type SampleDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
export type SampleAccent = "phosphor" | "amber" | "copper" | "blueprint";

export interface SampleMeta {
  slug: SchematicKey;
  /** Short stencil-style ID rendered on cards (e.g. "S-001") */
  archiveId: string;
  /** Title shown on the card (UPPERCASE display font) */
  title: string;
  /** Part number / chip subtitle (mono small text) */
  subtitle: string;
  /** Category badge — short label */
  tag: string;
  /** Beginner / intermediate / advanced */
  difficulty: SampleDifficulty;
  /** One-line teaser — what's interesting */
  teaser: string;
  /** Color accent token */
  accent: SampleAccent;
  /** Era / vintage reference (e.g. "1972 · SIGNETICS") for archive flavor */
  era: string;
}

export interface Sample extends SampleMeta {
  analysis: AnalysisResult;
}

/**
 * Ordered list — gallery renders in this order.
 * Try to flow from beginner → intermediate so first-time visitors get an
 * approachable on-ramp.
 */
const META: SampleMeta[] = [
  {
    slug: "voltage-divider",
    archiveId: "S-001",
    title: "VOLTAGE DIVIDER",
    subtitle: "2× RESISTOR · PASSIVE",
    tag: "FUNDAMENTAL",
    difficulty: "BEGINNER",
    teaser:
      "The first circuit every engineer learns — and it's still inside everything from ADCs to bandgap references.",
    accent: "blueprint",
    era: "CIRCA 1827 · OHM'S LAW",
  },
  {
    slug: "rc-low-pass",
    archiveId: "S-002",
    title: "RC LOW-PASS FILTER",
    subtitle: "1ST-ORDER · PASSIVE",
    tag: "FILTER",
    difficulty: "BEGINNER",
    teaser:
      "A resistor and a capacitor. That's the entire anti-aliasing front end of half the audio gear on Earth.",
    accent: "blueprint",
    era: "CLASSIC PASSIVE TOPOLOGY",
  },
  {
    slug: "inverting-amp",
    archiveId: "S-003",
    title: "INVERTING AMPLIFIER",
    subtitle: "TL072 · OP-AMP",
    tag: "ANALOG",
    difficulty: "BEGINNER",
    teaser:
      "Two resistors set the gain, the virtual ground does the work. The textbook op-amp configuration.",
    accent: "phosphor",
    era: "CANONICAL OP-AMP TOPOLOGY",
  },
  {
    slug: "common-emitter",
    archiveId: "S-004",
    title: "COMMON-EMITTER AMP",
    subtitle: "2N3904 · BJT",
    tag: "AMP",
    difficulty: "INTERMEDIATE",
    teaser:
      "The granddaddy of voltage gain. Bias it wrong and the transistor either saturates or just sits there.",
    accent: "copper",
    era: "DISCRETE-ERA WORKHORSE",
  },
  {
    slug: "555-astable",
    archiveId: "S-005",
    title: "555 ASTABLE",
    subtitle: "NE555 · TIMER",
    tag: "TIMING",
    difficulty: "INTERMEDIATE",
    teaser:
      "Hans Camenzind's 1972 timer chip — still shipping a billion units a year, still teaching freshmen RC time constants.",
    accent: "amber",
    era: "1972 · SIGNETICS",
  },
  {
    slug: "multivibrator",
    archiveId: "S-006",
    title: "ASTABLE MULTIVIBRATOR",
    subtitle: "2× 2N3904 · DISCRETE",
    tag: "OSCILLATOR",
    difficulty: "INTERMEDIATE",
    teaser:
      "Two transistors cross-coupled through capacitors. Watch them fight forever — it's the simplest oscillator that ever worked.",
    accent: "copper",
    era: "ABRAHAM-BLOCH · 1918",
  },
  {
    slug: "h-bridge",
    archiveId: "S-007",
    title: "H-BRIDGE DRIVER",
    subtitle: "4× MOSFET · MOTOR",
    tag: "POWER",
    difficulty: "ADVANCED",
    teaser:
      "Four switches arranged in an H. The reason your DC motor knows which way to spin — and the reason shoot-through kills FETs.",
    accent: "phosphor",
    era: "BRIDGE TOPOLOGY · 1960s",
  },
  {
    slug: "buck-converter",
    archiveId: "S-008",
    title: "BUCK CONVERTER",
    subtitle: "LM2596 · SMPS",
    tag: "POWER",
    difficulty: "ADVANCED",
    teaser:
      "Step 12V down to 5V at 90%+ efficiency. The reason your laptop charger doesn't weigh five pounds.",
    accent: "phosphor",
    era: "MODERN SWITCHING SUPPLY",
  },
  {
    slug: "wien-bridge",
    archiveId: "S-009",
    title: "WIEN-BRIDGE OSCILLATOR",
    subtitle: "TL072 + LAMP AGC",
    tag: "OSCILLATOR",
    difficulty: "ADVANCED",
    teaser:
      "Bill Hewlett's master's thesis. A pure sine wave from five parts — and a literal light bulb does the precision work.",
    accent: "amber",
    era: "1939 · HP MODEL 200A",
  },
];

const ANALYSIS_BY_SLUG: Record<SchematicKey, AnalysisResult> = {
  "voltage-divider": voltageDivider as AnalysisResult,
  "rc-low-pass": rcLowPass as AnalysisResult,
  "inverting-amp": inverting as AnalysisResult,
  "common-emitter": commonEmitter as AnalysisResult,
  "555-astable": astable555 as AnalysisResult,
  multivibrator: multivibrator as AnalysisResult,
  "h-bridge": hBridge as AnalysisResult,
  "buck-converter": buck as AnalysisResult,
  "wien-bridge": wienBridge as AnalysisResult,
};

export const SAMPLE_META: SampleMeta[] = META;

export function listSamples(): Sample[] {
  return META.map((m) => ({ ...m, analysis: ANALYSIS_BY_SLUG[m.slug] }));
}

export function getSample(slug: string): Sample | null {
  const meta = META.find((m) => m.slug === slug);
  if (!meta) return null;
  return { ...meta, analysis: ANALYSIS_BY_SLUG[meta.slug] };
}

export function getSampleSlugs(): SchematicKey[] {
  return META.map((m) => m.slug);
}

/**
 * Lookup for /share/[id]. Today shares = samples. In the future, runtime
 * shares would live in a different store and be checked here first.
 */
export function getShareableAnalysis(id: string): Sample | null {
  return getSample(id);
}
