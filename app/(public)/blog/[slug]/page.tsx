import React from "react";
import { notFound } from "next/navigation";
import { getPortalDb } from "@/lib/server/db";
import { DEFAULT_BLOGS, type BlogPost } from "@/lib/blog-data";
import BlogPostClient from "./BlogPostClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const db = getPortalDb();
    const post = (await db.collection("blogs").findOne({ slug, isPublished: true })) as BlogPost | null;
    if (!post) {
      const fallback = DEFAULT_BLOGS.find((b) => b.slug === slug);
      if (fallback) {
        return {
          title: `${fallback.title} | WebSmith Digital Blog`,
          description: fallback.excerpt,
        };
      }
      return { title: "Article Not Found | WebSmith Digital" };
    }
    return {
      title: `${post.title} | WebSmith Digital Blog`,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: post.coverImage ? [post.coverImage] : [],
      },
    };
  } catch {
    return { title: "Engineering Blog | WebSmith Digital" };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const db = getPortalDb();
  const collection = db.collection("blogs");

  let post: BlogPost | null = null;
  let allPublished: BlogPost[] = [];

  try {
    // Ensure table and defaults
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(DEFAULT_BLOGS);
    }

    post = (await collection.findOne({ slug })) as BlogPost | null;
    allPublished = (await collection
      .find({ isPublished: true })
      .sort({ publishedAt: -1 })
      .limit(6)
      .toArray()) as BlogPost[];
  } catch (err) {
    console.error("Database blog fetch error:", err);
    post = DEFAULT_BLOGS.find((b) => b.slug === slug) || null;
    allPublished = DEFAULT_BLOGS;
  }

  if (!post || post.isPublished === false) {
    // Check fallback
    post = DEFAULT_BLOGS.find((b) => b.slug === slug) || null;
    if (!post) notFound();
  }

  const relatedPosts = allPublished.filter((p) => p.slug !== slug).slice(0, 3);

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
}
