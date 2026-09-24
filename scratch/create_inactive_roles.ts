import { getPortalDb } from "../lib/server/db";

async function main() {
  const db = getPortalDb();
  const collection = db.collection("careers");

  // Remove existing
  await collection.deleteMany({});

  const now = new Date().toISOString();

  const jobs = [
    {
      id: "ai-systems-eng",
      title: "Senior AI Systems & Agentic Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-Time",
      experience: "4+ Years",
      salary: "$90,000 - $125,000 / Year",
      description:
        "Architect and deploy autonomous agentic workflows, multi-modal LLM reasoning pipelines, and real-time streaming APIs for enterprise digital systems.",
      responsibilities: [
        "Build fault-tolerant multi-agent pipelines with LangChain and custom event loops.",
        "Optimize vector search latencies, embedding caches, and retrieval precision across millions of enterprise documents.",
        "Collaborate with systems engineers to integrate generative intelligence directly into client admin dashboards.",
      ],
      requirements: [
        "4+ years of professional backend software engineering with strong Python or TypeScript foundation.",
        "Hands-on experience deploying open-weight and closed-weight LLM models to production.",
        "Understanding of vector databases (Pinecone/Milvus/pgvector) and semantic search architectures.",
      ],
      tags: ["AI Agents", "Python", "TypeScript", "LangChain", "pgvector"],
      isActive: false,
      applyEmail: "careers@websmithdigital.com",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "growth-mktg-lead",
      title: "Enterprise Growth & Product Marketing Lead",
      department: "Marketing",
      location: "Hybrid (Kolkata HQ)",
      type: "Full-Time",
      experience: "3+ Years",
      salary: "$55,000 - $75,000 / Year",
      description:
        "Drive product-led enterprise growth, developer community engagement, technical case studies, and digital acquisition channels for WebSmith Digital products.",
      responsibilities: [
        "Architect B2B enterprise acquisition funnels and track end-to-end client lifecycle analytics.",
        "Publish in-depth technical case studies highlighting enterprise software engineering impact.",
        "Coordinate global product launches, feature updates, and developer documentation marketing.",
      ],
      requirements: [
        "3+ years product marketing experience in high-growth B2B SaaS or technical software agencies.",
        "Exceptional written storytelling skills translating deep architectural concepts into clear value propositions.",
        "Analytical rigor with proven experience in conversion rate optimization and attribution modeling.",
      ],
      tags: ["B2B SaaS", "Product Growth", "Technical Writing", "Analytics", "SEO"],
      isActive: false,
      applyEmail: "careers@websmithdigital.com",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "soc2-compliance-arch",
      title: "Cloud Security & SOC2 Compliance Architect",
      department: "Product & Operations",
      location: "Remote",
      type: "Full-Time",
      experience: "5+ Years",
      salary: "$80,000 - $110,000 / Year",
      description:
        "Lead enterprise security posture, automated vulnerability scanning, zero-trust network policies, and continuous SOC2 Type II audit readiness.",
      responsibilities: [
        "Oversee zero-trust IAM architecture, least-privilege role policies, and API token rotations.",
        "Perform periodic threat modeling, vulnerability assessments, and automated CI/CD security gating.",
        "Lead annual SOC2 Type II, ISO27001, and GDPR technical compliance certifications.",
      ],
      requirements: [
        "5+ years architecting cloud security and enterprise compliance for SaaS platforms.",
        "Strong familiarity with AWS/GCP security frameworks, Docker container hardening, and secret management.",
        "Certifications such as CISSP, CISA, or AWS Certified Security Specialty preferred.",
      ],
      tags: ["Cybersecurity", "SOC2", "Cloud Security", "Compliance", "Zero Trust"],
      isActive: false,
      applyEmail: "careers@websmithdigital.com",
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const job of jobs) {
    await collection.insertOne(job);
    console.log(`Inserted inactive role: ${job.title} (isActive: ${job.isActive})`);
  }

  const all = await collection.find({}).toArray();
  console.log(`Total jobs in database: ${all.length}`);
}

main().catch(console.error);
