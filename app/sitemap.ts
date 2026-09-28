import type { MetadataRoute } from "next";
import { DEFAULT_BLOGS } from "../lib/blog-data";
import { getSiteUrl } from "../core/config/site";
import { getPortalDb } from "@/lib/server/db";

// Automatically revalidate and regenerate sitemap every 1 week (604,800 seconds)
// so that any new dynamic blogs or products are automatically refreshed on a weekly schedule.
export const revalidate = 604800; // 7 days (7 * 24 * 60 * 60 seconds)

const staticRoutes = [
  "",
  "/services",
  "/portfolio",
  "/software-store",
  "/industries",
  "/about",
  "/careers",
  "/blog",
  "/contact",
  "/lead-form",
  "/documentation",
  "/support",
  "/privacy",
  "/terms",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  // 1. Static Showcase and Core Pages
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : route === "/blog" || route === "/portfolio" ? "daily" : "monthly",
    priority: route === "" ? 1 : route === "/services" || route === "/portfolio" || route === "/software-store" ? 0.9 : 0.8,
  }));

  // 2. Dynamic Blog Articles (Fetched from database with fallback to DEFAULT_BLOGS)
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    const db = getPortalDb();
    const dbBlogs = await db.collection("blogs")
      .find({ isPublished: true })
      .toArray();

    const blogMap = new Map<string, { slug: string; lastModified: Date }>();

    // Seed defaults into map
    for (const post of DEFAULT_BLOGS) {
      if (post.slug) {
        blogMap.set(post.slug, {
          slug: post.slug,
          lastModified: new Date(post.publishedAt || now),
        });
      }
    }

    // Merge database blogs (overwriting defaults if customized)
    if (Array.isArray(dbBlogs) && dbBlogs.length > 0) {
      for (const b of dbBlogs) {
        if (b.slug) {
          blogMap.set(b.slug, {
            slug: b.slug,
            lastModified: new Date(b.updatedAt || b.publishedAt || b.createdAt || now),
          });
        }
      }
    }

    blogEntries = Array.from(blogMap.values()).map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    // Graceful fallback to static defaults if DB is temporarily unreachable during build
    blogEntries = DEFAULT_BLOGS.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt || now),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  }

  // 3. Dynamic Software Store Products (if created/published)
  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const db = getPortalDb();
    const products = await db.collection("products")
      .find({ is_active: true })
      .toArray();

    if (Array.isArray(products) && products.length > 0) {
      productEntries = products.map((prod: any) => ({
        url: `${siteUrl}/software-store/product/${encodeURIComponent(prod.id || prod._id)}`,
        lastModified: new Date(prod.updated_at || prod.created_at || now),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
    }
  } catch {
    // Ignore product fetch failure during static pre-rendering
  }

  return [...staticEntries, ...blogEntries, ...productEntries];
}
