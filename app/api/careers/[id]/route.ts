import { apiHandler, json, jsonBody, unauthorized, notFound, badRequest, ObjectId } from "@/lib/server/api";

export const PUT = apiHandler(
  async ({ db, request, user, params }) => {
    if (!user || user.role !== "admin") {
      throw unauthorized("Insufficient permissions to update job openings");
    }

    const { id } = (await params) as { id: string };
    if (!id) throw badRequest("Missing job ID");

    const body = await jsonBody(request);
    const collection = db.collection("careers");

    // Match either by string id or ObjectId
    let filter: any = { id };
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ id }, { _id: new ObjectId(id) }] };
    }

    const existing = await collection.findOne(filter);
    if (!existing) {
      throw notFound("Job opening not found");
    }

    const update: any = {
      updatedAt: new Date().toISOString(),
    };

    if (body.title !== undefined) update.title = String(body.title).trim();
    if (body.department !== undefined) update.department = String(body.department).trim();
    if (body.location !== undefined) update.location = String(body.location).trim();
    if (body.type !== undefined) update.type = String(body.type).trim();
    if (body.experience !== undefined) update.experience = String(body.experience).trim();
    if (body.salary !== undefined) update.salary = body.salary ? String(body.salary).trim() : null;
    if (body.description !== undefined) update.description = String(body.description).trim();
    if (body.responsibilities !== undefined) {
      update.responsibilities = Array.isArray(body.responsibilities)
        ? body.responsibilities.map(String).map((s: string) => s.trim()).filter(Boolean)
        : typeof body.responsibilities === "string"
        ? body.responsibilities.split("\n").map((s: string) => s.trim()).filter(Boolean)
        : [];
    }
    if (body.requirements !== undefined) {
      update.requirements = Array.isArray(body.requirements)
        ? body.requirements.map(String).map((s: string) => s.trim()).filter(Boolean)
        : typeof body.requirements === "string"
        ? body.requirements.split("\n").map((s: string) => s.trim()).filter(Boolean)
        : [];
    }
    if (body.tags !== undefined) {
      update.tags = Array.isArray(body.tags)
        ? body.tags.map(String).map((s: string) => s.trim()).filter(Boolean)
        : typeof body.tags === "string"
        ? body.tags.split(",").map((s: string) => s.trim()).filter(Boolean)
        : [];
    }
    if (body.isActive !== undefined) update.isActive = Boolean(body.isActive);
    if (body.applyEmail !== undefined) update.applyEmail = body.applyEmail ? String(body.applyEmail).trim() : null;

    const result = await collection.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );

    return json({ data: result, message: "Job opening updated successfully" });
  },
  { auth: "required" }
);

export const DELETE = apiHandler(
  async ({ db, user, params }) => {
    if (!user || user.role !== "admin") {
      throw unauthorized("Insufficient permissions to delete job openings");
    }

    const { id } = (await params) as { id: string };
    if (!id) throw badRequest("Missing job ID");

    const collection = db.collection("careers");
    let filter: any = { id };
    if (ObjectId.isValid(id)) {
      filter = { $or: [{ id }, { _id: new ObjectId(id) }] };
    }

    const res = await collection.deleteOne(filter);
    if (res.deletedCount === 0) {
      throw notFound("Job opening not found");
    }

    return json({ success: true, message: "Job opening deleted successfully" });
  },
  { auth: "required" }
);
