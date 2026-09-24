import { apiHandler, json, jsonBody, unauthorized, notFound, badRequest } from "@/lib/server/api";
import { type BlogPost } from "@/lib/blog-data";

export const GET = apiHandler(async ({ db, params, user }) => {
  const identifier = params?.id;
  if (!identifier) throw notFound("Blog identifier is required");

  const collection = db.collection("blogs");
  // Find by slug or id
  const post = await collection.findOne({
    $or: [{ id: identifier }, { slug: identifier }, { _id: identifier }],
  });

  if (!post) {
    throw notFound("Blog post not found");
  }

  // If draft and not admin
  if (post.isPublished === false && (!user || user.role !== "admin")) {
    throw notFound("Blog post not found or unpublished");
  }

  return json({ data: post });
});

export const PUT = apiHandler(
  async ({ db, params, request, user }) => {
    if (!user || user.role !== "admin") {
      throw unauthorized("Insufficient permissions to update blog");
    }

    const identifier = params?.id;
    if (!identifier) throw badRequest("Blog identifier is required");

    const body = await jsonBody(request);
    if (!body) throw badRequest("Update payload is required");

    const collection = db.collection("blogs");
    const existing = await collection.findOne({
      $or: [{ id: identifier }, { slug: identifier }, { _id: identifier }],
    });

    if (!existing) {
      throw notFound("Blog post not found");
    }

    const now = new Date().toISOString();
    const updateData: Partial<BlogPost> = {
      ...body,
      updatedAt: now,
    };

    // If publishing for the first time
    if (body.isPublished === true && !existing.isPublished) {
      updateData.publishedAt = existing.publishedAt || now;
    }

    delete (updateData as any)._id;
    delete (updateData as any).id; // keep original id

    await collection.updateOne(
      { $or: [{ id: identifier }, { slug: identifier }, { _id: identifier }] },
      { $set: updateData }
    );

    const updated = await collection.findOne({
      $or: [{ id: identifier }, { slug: identifier }, { _id: identifier }],
    });

    return json({ data: updated, message: "Blog post updated successfully" });
  },
  { auth: "required" }
);

export const DELETE = apiHandler(
  async ({ db, params, user }) => {
    if (!user || user.role !== "admin") {
      throw unauthorized("Insufficient permissions to delete blog");
    }

    const identifier = params?.id;
    if (!identifier) throw badRequest("Blog identifier is required");

    const collection = db.collection("blogs");
    const existing = await collection.findOne({
      $or: [{ id: identifier }, { slug: identifier }, { _id: identifier }],
    });

    if (!existing) {
      throw notFound("Blog post not found");
    }

    await collection.deleteOne({
      $or: [{ id: identifier }, { slug: identifier }, { _id: identifier }],
    });

    return json({ success: true, message: `Blog post "${existing.title}" deleted` });
  },
  { auth: "required" }
);
