import { apiHandler, json, jsonBody, unauthorized, badRequest } from "@/lib/server/api";
import { DEFAULT_BLOGS, type BlogPost } from "@/lib/blog-data";
import { randomUUID } from "crypto";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function calculateReadTime(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export const GET = apiHandler(async ({ db, request, user }) => {
  try {
    const url = new URL(request.url);
    const showAll = url.searchParams.get("all") === "true";
    const category = url.searchParams.get("category");
    const search = url.searchParams.get("search");
    const collection = db.collection("blogs");

    // Seed defaults if empty
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(DEFAULT_BLOGS);
    }

    const filter: any = {};
    // Public visitors only see published posts
    if (!showAll && (!user || user.role !== "admin")) {
      filter.isPublished = true;
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const posts = await collection
      .find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .toArray();

    let result = posts.map((p: any) => ({
      id: String(p.id || p._id),
      slug: String(p.slug || generateSlug(p.title || "post")),
      title: String(p.title || ""),
      excerpt: String(p.excerpt || ""),
      content: String(p.content || ""),
      coverImage: String(p.coverImage || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80"),
      category: String(p.category || "General"),
      tags: Array.isArray(p.tags) ? p.tags.map(String) : [],
      author: {
        name: String(p.author?.name || "WebSmith Team"),
        role: String(p.author?.role || "Engineering"),
        avatar: p.author?.avatar ? String(p.author.avatar) : undefined,
      },
      readTime: String(p.readTime || calculateReadTime(p.content || "")),
      isPublished: p.isPublished !== false,
      publishedAt: p.publishedAt || p.createdAt || new Date().toISOString(),
      createdAt: p.createdAt || new Date().toISOString(),
      updatedAt: p.updatedAt || new Date().toISOString(),
    }));

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p: BlogPost) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return json({ data: result, count: result.length });
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    return json({ data: DEFAULT_BLOGS, count: DEFAULT_BLOGS.length });
  }
});

export const POST = apiHandler(
  async ({ db, request, user }) => {
    if (!user || user.role !== "admin") {
      throw unauthorized("Insufficient permissions to publish blogs");
    }

    const body = await jsonBody(request);
    if (!body || !body.title) {
      throw badRequest("Blog title is required");
    }

    const collection = db.collection("blogs");
    const now = new Date().toISOString();
    const id = body.id && String(body.id).trim() ? String(body.id).trim() : `blog-${Date.now()}-${randomUUID().slice(0, 4)}`;
    const baseSlug = body.slug && String(body.slug).trim() ? generateSlug(String(body.slug)) : generateSlug(String(body.title));

    // Ensure unique slug
    let slug = baseSlug;
    const existing = await collection.findOne({ slug });
    if (existing) {
      slug = `${baseSlug}-${randomUUID().slice(0, 4)}`;
    }

    const content = String(body.content || "");
    const readTime = body.readTime || calculateReadTime(content);

    const newPost: BlogPost = {
      id,
      slug,
      title: String(body.title).trim(),
      excerpt: String(body.excerpt || "").trim(),
      content,
      coverImage: String(
        body.coverImage ||
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80"
      ).trim(),
      category: String(body.category || "General").trim(),
      tags: Array.isArray(body.tags)
        ? body.tags.map(String).map((s) => s.trim()).filter(Boolean)
        : typeof body.tags === "string"
        ? body.tags.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      author: {
        name: String(body.author?.name || user.name || "WebSmith Team").trim(),
        role: String(body.author?.role || "Engineering").trim(),
        avatar: body.author?.avatar ? String(body.author.avatar).trim() : undefined,
      },
      readTime,
      isPublished: Boolean(body.isPublished),
      publishedAt: body.isPublished ? (body.publishedAt || now) : now,
      createdAt: now,
      updatedAt: now,
    };

    await collection.insertOne({ ...newPost });

    return json({ data: newPost, message: "Blog post created successfully" }, { status: 201 });
  },
  { auth: "required" }
);
