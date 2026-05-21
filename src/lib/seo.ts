/**
 * Shared SEO + metadata helpers for CircuitOracle.
 *
 * - `SITE` holds the canonical site facts (name, tagline, URLs).
 * - `siteUrl()` resolves the canonical origin from env at build time, with a
 *   sensible production fallback.
 * - `absoluteUrl()` builds canonical absolute URLs for OG/Twitter/sitemap use.
 * - `buildMetadata()` is the per-page metadata helper: pass a title fragment
 *   and optional description/path and get back a fully-populated `Metadata`
 *   object (OG + Twitter + canonical) that inherits the layout defaults.
 */
import type { Metadata } from "next";

export const SITE = {
  name: "CircuitOracle",
  shortName: "CircuitOracle",
  tagline: "AI-powered circuit schematic analysis",
  description:
    "Upload a circuit schematic and get an engineering-depth analysis powered by multi-agent AI. Identify components, reason about topology, infer the application domain, and synthesize expert design insights — in seconds.",
  // Title template: every page's `title` becomes "<page> — CircuitOracle"
  titleTemplate: "%s — CircuitOracle",
  defaultTitle: "CircuitOracle — AI-Powered Schematic Analysis",
  twitterHandle: "@circuitoracle",
  locale: "en_US",
  // OG image canonical dimensions (Twitter `summary_large_image`, FB OG).
  ogImage: {
    width: 1200,
    height: 630,
    alt: "CircuitOracle — AI-powered circuit schematic analysis",
  },
} as const;

/**
 * Resolve the canonical origin for absolute URLs.
 * Priority: NEXT_PUBLIC_SITE_URL → VERCEL_URL → production fallback.
 */
export function siteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return stripTrailingSlash(explicit);

  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${stripTrailingSlash(vercel)}`;

  return "http://localhost:3000";
}

function stripTrailingSlash(s: string): string {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

/** Build a fully-qualified absolute URL for a path like `/samples`. */
export function absoluteUrl(path = "/"): string {
  const base = siteUrl();
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}

interface BuildMetadataInput {
  /** Short page title — composed via the layout's titleTemplate. */
  title: string;
  /** Page-specific description; falls back to the site description. */
  description?: string;
  /** Path-only (e.g. `/samples`) — used for canonical + og:url. */
  path?: string;
  /** Optional override for the OG/Twitter image URL (absolute or root-relative). */
  image?: string;
  /** When true, instruct robots not to index this page. */
  noIndex?: boolean;
}

/**
 * Per-page metadata builder. Designed to layer on top of the root layout's
 * defaults: page titles flow through the `%s — CircuitOracle` template, the
 * OG/Twitter cards inherit the dynamic `/opengraph-image` by default, and
 * canonical URLs are derived from `path`.
 */
export function buildMetadata({
  title,
  description = SITE.description,
  path = "/",
  image,
  noIndex = false,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const ogImages = image
    ? [{ url: image, width: SITE.ogImage.width, height: SITE.ogImage.height, alt: SITE.ogImage.alt }]
    : undefined; // undefined → inherits dynamic /opengraph-image from layout

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE.name,
      locale: SITE.locale,
      type: "website",
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
