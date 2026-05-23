import type { Metadata, Viewport } from "next";
import { SITE, siteUrl, absoluteUrl } from "@/lib/seo";
import "./globals.css";

const SITE_URL = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE.defaultTitle,
    template: SITE.titleTemplate,
  },
  description: SITE.description,
  applicationName: SITE.name,
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  keywords: [
    "circuit analysis",
    "schematic analyzer",
    "AI electronics",
    "Gemini AI",
    "multi-agent AI",
    "op-amp analysis",
    "component identification",
    "PCB analysis",
    "electronic circuit reader",
    "schematic OCR",
    "EE tools",
    "electrical engineering AI",
  ],
  authors: [{ name: "CircuitOracle" }],
  creator: "CircuitOracle",
  publisher: "CircuitOracle",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: SITE.defaultTitle,
    description: SITE.description,
    url: absoluteUrl("/"),
    locale: SITE.locale,
    // Images are picked up automatically from src/app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.defaultTitle,
    description: SITE.description,
    creator: SITE.twitterHandle,
    site: SITE.twitterHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Icons are auto-discovered from src/app/icon.tsx + apple-icon.tsx
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050608" },
    { media: "(prefers-color-scheme: light)", color: "#050608" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Structured data: describe the site as a SoftwareApplication so Google can
// surface a rich result. Keep this minimal + truthful — no fake ratings.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE.name,
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Engineering",
  operatingSystem: "Web",
  url: absoluteUrl("/"),
  description: SITE.description,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: SITE.name,
    url: absoluteUrl("/"),
  },
  featureList: [
    "Component identification",
    "Circuit topology analysis",
    "Application domain inference",
    "Multi-agent synthesis",
    "Real-time streaming analysis",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
