import { apiHandler, jsonBody, json, forbidden, badRequest } from "@/lib/server/api";

export const GET = apiHandler(async ({ db, user }) => {
  const filter: any = {};
  if (user.role === "client") {
    filter.clientId = user._id.toString();
  } else if (user.role === "developer") {
    filter.assignedDevId = user._id.toString();
  }
  const projects = await db.collection("projects").find(filter).sort({ createdAt: -1 }).toArray();
  return json({ data: projects.map((p) => ({ ...p, _id: p._id.toString() })) });
}, { auth: "required" });

export const POST = apiHandler(async ({ db, request, user }) => {
  if (user.role !== "admin") throw forbidden();
  const body = await jsonBody(request);
  const name = String(body.name ?? "").trim();
  if (!name) throw badRequest("Project name is required");
  const now = new Date();
  const rawTech = body.techStack;
  const techStack = Array.isArray(rawTech)
    ? rawTech.map(String).map(t => t.trim()).filter(Boolean)
    : typeof rawTech === "string" && rawTech.trim()
    ? rawTech.split(",").map(t => t.trim()).filter(Boolean)
    : [];

  const rawFeatures = body.features;
  const features = Array.isArray(rawFeatures)
    ? rawFeatures.map(String).map(f => f.trim()).filter(Boolean)
    : typeof rawFeatures === "string" && rawFeatures.trim()
    ? rawFeatures.split("\n").map(f => f.trim()).filter(Boolean)
    : [];

  const doc: any = {
    name,
    slug: body.slug ? String(body.slug).trim() : name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    category: body.category ? String(body.category).trim() : "Startups & SMBs",
    description: String(body.description ?? "").trim(),
    client: String(body.client ?? "").trim(),
    clientEmail: String(body.clientEmail ?? "").trim(),
    clientPhone: String(body.clientPhone ?? "").trim(),
    clientCompany: String(body.clientCompany ?? "").trim(),
    publicUrl: body.publicUrl ? String(body.publicUrl).trim() : "",
    previewImage:
      body.previewImage && String(body.previewImage).trim()
        ? String(body.previewImage).trim()
        : body.publicUrl && /^https?:\/\//i.test(String(body.publicUrl).trim())
        ? `https://s0.wp.com/mshots/v1/${encodeURIComponent(String(body.publicUrl).trim())}?w=1280&h=800`
        : "",
    metrics: body.metrics ? String(body.metrics).trim() : "",
    techStack,
    challenge: body.challenge ? String(body.challenge).trim() : "",
    solution: body.solution ? String(body.solution) : "",
    features,
    isFeatured: body.isFeatured === true,
    clientId: body.clientId ? String(body.clientId) : null,
    assignedDevId: body.assignedDevId ? String(body.assignedDevId) : null,
    assignedDeveloperName: String(body.assignedDeveloperName ?? ""),
    status: ["pending", "in-progress", "completed", "on-hold"].includes(body.status) ? body.status : "pending",
    priority: ["low", "medium", "high"].includes(body.priority) ? body.priority : "medium",
    startDate: body.startDate || now.toISOString(),
    endDate: body.endDate || null,
    expectedCompletionDate: body.expectedCompletionDate || null,
    budget: body.budget == null ? null : Number(body.budget),
    customClientId: body.customClientId ? String(body.customClientId) : "",
    progress: body.progress == null ? 0 : Math.min(100, Math.max(0, Number(body.progress))),
    published: body.published === true,
    sharedFiles: Array.isArray(body.sharedFiles) ? body.sharedFiles : [],
    tasks: Array.isArray(body.tasks) ? body.tasks : [],
    statusUpdates: Array.isArray(body.statusUpdates) ? body.statusUpdates : [],
    feedback: Array.isArray(body.feedback) ? body.feedback : [],
    messages: [],
    customization: body.customization ?? null,
    createdAt: now,
    updatedAt: now,
  };
  const result = await db.collection("projects").insertOne(doc);
  return json({ data: { ...doc, _id: result.insertedId.toString() } }, { status: 201 });
}, { auth: "required" });
