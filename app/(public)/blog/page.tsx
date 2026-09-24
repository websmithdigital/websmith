import React from "react";
import type { Metadata } from "next";
import { getPortalDb } from "@/lib/server/db";
import { DEFAULT_BLOGS, type BlogPost } from "@/lib/blog-data";
import BlogCatalogClient from "./BlogCatalogClient";

export const metadata: Metadata = {
  title: "Engineering Blog & Technical Blueprints | WebSmith Digital",
  description:
    "Deep dives into full-stack Next.js architecture, enterprise ERP workflows, autonomous AI systems, and cloud resilience from our engineering team.",
  openGraph: {
    title: "Engineering Blog | WebSmith Digital",
    description:
      "Deep dives into full-stack Next.js architecture, enterprise ERP workflows, autonomous AI systems, and cloud resilience.",
  },
};

export default async function BlogPage() {
  let posts: BlogPost[] = [];

  try {
    const db = getPortalDb();
    const collection = db.collection("blogs");
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(DEFAULT_BLOGS);
    }
    const dbPosts = (await collection
      .find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .toArray()) as BlogPost[];

    if (dbPosts && dbPosts.length > 0) {
      posts = dbPosts;
    } else {
      posts = DEFAULT_BLOGS;
    }
  } catch (err) {
    console.error("Database blog fetch error in /blog page:", err);
    posts = DEFAULT_BLOGS;
  }

  return <BlogCatalogClient initialPosts={posts} />;
}
