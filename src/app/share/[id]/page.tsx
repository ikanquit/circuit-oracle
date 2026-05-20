import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import CircuitBackground from "@/components/v2/CircuitBackground";
import ScanlineOverlay from "@/components/v2/ScanlineOverlay";
import TickerFooter from "@/components/v2/TickerFooter";
import SampleAnalysisView from "@/components/samples/SampleAnalysisView";
import { getShareableAnalysis, getSampleSlugs } from "@/lib/samples";

/**
 * /share/[id] — read-only "permalink" view of an analysis.
 *
 * Today, share IDs are the same as sample slugs (so /share/555-astable
 * works). In the future, runtime-generated analyses would store a JSON blob
 * keyed by a hash and getShareableAnalysis() would check that store first.
 *
 * Importantly, this route does NOT invoke /api/analyze — it's a static read
 * of a pre-baked JSON file.
 */

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams(): Array<{ id: string }> {
  return getSampleSlugs().map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const sample = getShareableAnalysis(id);
  if (!sample) {
    return { title: "Analysis not found — CircuitOracle" };
  }
  return {
    title: `${sample.title} — Shared Analysis · CircuitOracle`,
    description: `${sample.teaser} Multi-agent engineering breakdown shared from CircuitOracle.`,
    openGraph: {
      title: `${sample.title} · CircuitOracle`,
      description: sample.teaser,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${sample.title} · CircuitOracle`,
      description: sample.teaser,
    },
  };
}

export default async function SharePage({ params }: PageProps): Promise<JSX.Element> {
  const { id } = await params;
  const sample = getShareableAnalysis(id);
  if (!sample) notFound();

  return (
    <div className="relative min-h-screen">
      <CircuitBackground />
      <ScanlineOverlay intensity="subtle" />
      <main className="relative z-10">
        <SampleAnalysisView sample={sample} variant="share" />
        <TickerFooter />
      </main>
    </div>
  );
}
