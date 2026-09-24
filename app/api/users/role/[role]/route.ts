import { apiHandler, json, badRequest, serialize } from "@/lib/server/api";

const VALID_ROLES = ["admin", "client", "developer"];

const SEED_DEVELOPERS = [
  { name: "Alex Mercer", headline: "Principal Systems Architect", skills: ["High-Throughput APIs", "Distributed State", "Cloud Infrastructure"], experienceYears: 12, bio: "High-Throughput APIs, Distributed State & Cloud Infrastructure", email: "alex.mercer@websmithdigital.com" },
  { name: "Elena Rostova", headline: "VP of Engineering & Security", skills: ["HMAC-SHA256 Cryptography", "Node-Locking", "Compliance"], experienceYears: 10, bio: "HMAC-SHA256 Cryptography, Node-Locking & Compliance", email: "elena.rostova@websmithdigital.com" },
  { name: "Marcus Chen", headline: "Head of ERP & Enterprise Systems", skills: ["Multi-Tenant Partitioning", "Inventory Engines", "Financial Billing"], experienceYears: 11, bio: "Multi-Tenant Partitioning, Inventory Engines & Financial Billing", email: "marcus.chen@websmithdigital.com" },
  { name: "Sarah Al-Mansoor", headline: "Lead Frontend & Design Systems Architect", skills: ["Next.js App Router", "Micro-Interactions", "Design Systems"], experienceYears: 8, bio: "Next.js App Router, Micro-Interactions & Design Systems", email: "sarah.almansoor@websmithdigital.com" },
  { name: "Tariq Vance", headline: "Director of DevOps & SRE", skills: ["Automated CI/CD", "Kubernetes Orchestration", "Zero-Downtime"], experienceYears: 9, bio: "Automated CI/CD, Kubernetes Orchestration & Zero-Downtime Releases", email: "tariq.vance@websmithdigital.com" },
  { name: "Maya Lin", headline: "AI & Data Architecture Lead", skills: ["Autonomous Agent Pipelines", "Vector Embeddings", "Neural Search"], experienceYears: 7, bio: "Autonomous Agent Pipelines, Vector Embeddings & Neural Search", email: "maya.lin@websmithdigital.com" },
];

export const GET = apiHandler(async ({ db, params }) => {
  const role = params.role;
  if (!VALID_ROLES.includes(role)) throw badRequest("Invalid role");
  const collection = db.collection("users");
  let users = await collection
    .find({ role })
    .sort({ name: 1 })
    .toArray();

  if (role === "developer" && users.length === 0) {
    for (let i = 0; i < SEED_DEVELOPERS.length; i++) {
      const item = SEED_DEVELOPERS[i];
      const customId = `DEV-${String(i + 101).padStart(4, "0")}`;
      await collection.insertOne({
        ...item,
        role: "developer",
        status: "active",
        published: true,
        customId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    users = await collection.find({ role }).sort({ name: 1 }).toArray();
  }

  const data = users.map((u) => ({
    _id: u._id.toString(),
    name: u.name,
    email: u.email,
    role: u.role,
    adminLevel: u.adminLevel ?? null,
    phone: u.phone ?? "",
    company: u.company ?? "",
    customId: u.customId,
    published: u.published ?? false,
    headline: u.headline ?? "",
    bio: u.bio ?? "",
    skills: u.skills ?? [],
    status: u.status ?? "active",
    experienceYears: u.experienceYears ?? 0,
    joinedAt: u.joinedAt ?? null,
    avatar: u.avatar ?? "",
  }));
  return json({ data });
}, { auth: "required" });
