import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import CircuitBackground from "@/components/v2/CircuitBackground";
import ScanlineOverlay from "@/components/v2/ScanlineOverlay";
import TickerFooter from "@/components/v2/TickerFooter";
import SampleAnalysisView from "@/components/samples/SampleAnalysisView";
import { getSample, getSampleSlugs } from "@/lib/samples";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
  return getSampleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const sample = getSample(slug);
  if (!sample) {
    return { title: "Sample not found — CircuitOracle" };
  }
  return {
    title: `${sample.title.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())} — Sample Analysis · CircuitOracle`,
    description: `${sample.teaser} See the full multi-agent engineering breakdown.`,
    openGraph: {
      title: `${sample.title} · CircuitOracle`,
      description: sample.teaser,
      type: "article",
    },
  };
}

export default async function SampleDetailPage({
  params,
}: PageProps): Promise<JSX.Element> {
  const { slug } = await params;
  const sample = getSample(slug);
  if (!sample) notFound();

  return (
    <div className="relative min-h-screen">
      <CircuitBackground />
      <ScanlineOverlay intensity="subtle" />
      <main className="relative z-10">
        <SampleAnalysisView sample={sample} variant="detail" />
        <TickerFooter />
      </main>
    </div>
  );
}
