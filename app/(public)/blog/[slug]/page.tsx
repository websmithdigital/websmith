import React from "react";
import { notFound } from "next/navigation";
import { blogPosts } from "../../../../core/config/publicSite";
import BlogPostClient from "./BlogPostClient";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) notFound();

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug);

  return <BlogPostClient post={post} relatedPosts={relatedPosts} />;
}
