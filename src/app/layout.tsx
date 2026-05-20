import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CircuitOracle — AI-Powered Schematic Analysis",
  description:
    "Upload a circuit schematic and get an engineering-depth analysis powered by multi-agent AI. Identify components, topology, domain, and get expert design insights.",
  keywords: [
    "circuit analysis",
    "schematic analyzer",
    "AI electronics",
    "op-amp",
    "component identification",
    "PCB analysis",
  ],
  openGraph: {
    title: "CircuitOracle",
    description: "AI-powered schematic analysis with multi-agent orchestration",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
