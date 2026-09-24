import { apiHandler, json, jsonBody, unauthorized, badRequest } from "@/lib/server/api";
import { DEFAULT_JOB_ROLES, type JobRole } from "@/lib/careers-data";
import { randomUUID } from "crypto";

export const GET = apiHandler(async ({ db, request, user }) => {
  try {
    const url = new URL(request.url);
    const showAll = url.searchParams.get("all") === "true";
    const collection = db.collection("careers");

    // Seed defaults if empty
    const count = await collection.countDocuments();
    if (count === 0) {
      const now = new Date().toISOString();
      const seeded = DEFAULT_JOB_ROLES.map((role) => ({
        ...role,
        createdAt: now,
        updatedAt: now,
      }));
      await collection.insertMany(seeded);
    }

    const filter: any = {};
    // If not asking for all, only show active openings to public visitors
    if (!showAll && (!user || user.role !== "admin")) {
      filter.isActive = { $ne: false };
    }

    const jobs = await collection
      .find(filter)
      .sort({ createdAt: -1 })
      .toArray();

    // Map clean IDs
    const sanitized = jobs.map((job: any) => ({
      id: String(job.id || job._id),
      title: String(job.title || ""),
      department: String(job.department || "Engineering"),
      location: String(job.location || "Remote"),
      type: String(job.type || "Full-Time"),
      experience: String(job.experience || "Entry"),
      salary: job.salary ? String(job.salary) : undefined,
      description: String(job.description || ""),
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.map(String) : [],
      requirements: Array.isArray(job.requirements) ? job.requirements.map(String) : [],
      tags: Array.isArray(job.tags) ? job.tags.map(String) : [],
      isActive: job.isActive !== false,
      applyEmail: job.applyEmail ? String(job.applyEmail) : undefined,
      createdAt: job.createdAt || new Date().toISOString(),
      updatedAt: job.updatedAt || new Date().toISOString(),
    }));

    return json({ data: sanitized, count: sanitized.length });
  } catch (error) {
    console.error("Failed to fetch careers:", error);
    return json({ data: DEFAULT_JOB_ROLES, count: DEFAULT_JOB_ROLES.length });
  }
});

export const POST = apiHandler(
  async ({ db, request, user }) => {
    if (!user || user.role !== "admin") {
      throw unauthorized("Insufficient permissions to create job openings");
    }

    const body = await jsonBody(request);
    if (!body || !body.title) {
      throw badRequest("Job title is required");
    }

    const collection = db.collection("careers");
    const now = new Date().toISOString();
    const id = body.id && String(body.id).trim() ? String(body.id).trim() : `role-${Date.now()}-${randomUUID().slice(0, 4)}`;

    const newJob: JobRole = {
      id,
      title: String(body.title).trim(),
      department: String(body.department || "Engineering").trim(),
      location: String(body.location || "Remote").trim(),
      type: String(body.type || "Full-Time").trim(),
      experience: String(body.experience || "3+ Years").trim(),
      salary: body.salary ? String(body.salary).trim() : undefined,
      description: String(body.description || "").trim(),
      responsibilities: Array.isArray(body.responsibilities)
        ? body.responsibilities.map(String).map((s) => s.trim()).filter(Boolean)
        : typeof body.responsibilities === "string"
        ? body.responsibilities.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      requirements: Array.isArray(body.requirements)
        ? body.requirements.map(String).map((s) => s.trim()).filter(Boolean)
        : typeof body.requirements === "string"
        ? body.requirements.split("\n").map((s) => s.trim()).filter(Boolean)
        : [],
      tags: Array.isArray(body.tags)
        ? body.tags.map(String).map((s) => s.trim()).filter(Boolean)
        : typeof body.tags === "string"
        ? body.tags.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      isActive: body.isActive !== false,
      applyEmail: body.applyEmail ? String(body.applyEmail).trim() : undefined,
      createdAt: now,
      updatedAt: now,
    };

    await collection.insertOne({ ...newJob });

    return json({ data: newJob, message: "Job opening created successfully" }, { status: 201 });
  },
  { auth: "required" }
);
