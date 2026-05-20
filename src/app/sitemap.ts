import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

/**
 * Sitemap. We list the planned top-level routes — including pages other
 * worktrees are building in parallel — so the sitemap is correct once their
 * routes land. If a route is still 404 at indexing time, search engines will
 * simply skip it, but the sitemap doesn't have to be regenerated.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  return [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/samples`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/how-it-works`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
