import type { MetadataRoute } from "next";
import { DEFAULT_BLOGS } from "../lib/blog-data";
import { getSiteUrl } from "../core/config/site";

const staticRoutes = [
  "",
  "/about",
  "/careers",
  "/blog",
  "/contact",
  "/documentation",
  "/privacy",
  "/services",
  "/support",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/services" ? 0.9 : 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = DEFAULT_BLOGS.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...blogEntries];
}
