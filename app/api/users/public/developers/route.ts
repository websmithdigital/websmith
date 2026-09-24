// FILE: app/api/users/public/developers/route.ts
// PURPOSE: Public API for published developers with automatic initial database seeding

import { apiHandler, json, serialize } from "@/lib/server/api";

const SEED_DEVELOPERS = [
  { name: "Alex Mercer", headline: "Principal Systems Architect", skills: ["High-Throughput APIs", "Distributed State", "Cloud Infrastructure"], experienceYears: 12, bio: "High-Throughput APIs, Distributed State & Cloud Infrastructure", email: "alex.mercer@websmithdigital.com" },
  { name: "Elena Rostova", headline: "VP of Engineering & Security", skills: ["HMAC-SHA256 Cryptography", "Node-Locking", "Compliance"], experienceYears: 10, bio: "HMAC-SHA256 Cryptography, Node-Locking & Compliance", email: "elena.rostova@websmithdigital.com" },
  { name: "Marcus Chen", headline: "Head of ERP & Enterprise Systems", skills: ["Multi-Tenant Partitioning", "Inventory Engines", "Financial Billing"], experienceYears: 11, bio: "Multi-Tenant Partitioning, Inventory Engines & Financial Billing", email: "marcus.chen@websmithdigital.com" },
  { name: "Sarah Al-Mansoor", headline: "Lead Frontend & Design Systems Architect", skills: ["Next.js App Router", "Micro-Interactions", "Design Systems"], experienceYears: 8, bio: "Next.js App Router, Micro-Interactions & Design Systems", email: "sarah.almansoor@websmithdigital.com" },
  { name: "Tariq Vance", headline: "Director of DevOps & SRE", skills: ["Automated CI/CD", "Kubernetes Orchestration", "Zero-Downtime"], experienceYears: 9, bio: "Automated CI/CD, Kubernetes Orchestration & Zero-Downtime Releases", email: "tariq.vance@websmithdigital.com" },
  { name: "Maya Lin", headline: "AI & Data Architecture Lead", skills: ["Autonomous Agent Pipelines", "Vector Embeddings", "Neural Search"], experienceYears: 7, bio: "Autonomous Agent Pipelines, Vector Embeddings & Neural Search", email: "maya.lin@websmithdigital.com" },
];

export const GET = apiHandler(async ({ db }) => {
  try {
    const collection = db.collection("users");
    let developers = await collection
      .find({ role: "developer", published: true })
      .sort({ name: 1 })
      .toArray();

    if (developers.length === 0) {
      for (const item of SEED_DEVELOPERS) {
        await collection.insertOne({
          ...item,
          role: "developer",
          status: "active",
          published: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      developers = await collection
        .find({ role: "developer", published: true })
        .sort({ name: 1 })
        .toArray();
    }

    const data = developers.map((u) => ({
      _id: u._id.toString(),
      name: u.name,
      email: u.email,
      phone: u.phone ?? "",
      company: u.company ?? "Websmith Digital",
      headline: u.headline ?? "",
      bio: u.bio ?? "",
      skills: u.skills ?? [],
      experienceYears: u.experienceYears ?? 0,
      status: u.status ?? "active",
      joinedAt: u.joinedAt ?? null,
      avatar: u.avatar ?? "",
      published: u.published ?? true,
    }));
    return json({ data });
  } catch (error) {
    console.warn("Public developers read warning (returning empty list):", error instanceof Error ? error.message : error);
    return json({ data: [] });
  }
});
