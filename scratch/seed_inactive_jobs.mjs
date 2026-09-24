import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

function getEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

async function main() {
  const env = getEnv();
  const databaseUrl = env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL not found in .env');
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();

  try {
    // Ensure portal_careers exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS portal_careers (
        _id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_portal_careers_data ON portal_careers USING GIN (data);
    `);

    // Clean existing careers
    await client.query(`DELETE FROM portal_careers;`);

    const now = new Date().toISOString();

    const jobs = [
      {
        id: "ai-systems-eng",
        _id: "ai-systems-eng",
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
          "Collaborate with systems engineers to integrate generative intelligence directly into client admin dashboards."
        ],
        requirements: [
          "4+ years of professional backend software engineering with strong Python or TypeScript foundation.",
          "Hands-on experience deploying open-weight and closed-weight LLM models to production.",
          "Understanding of vector databases (Pinecone/Milvus/pgvector) and semantic search architectures."
        ],
        tags: ["AI Agents", "Python", "TypeScript", "LangChain", "pgvector"],
        isActive: false,
        applyEmail: "careers@websmithdigital.com",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "growth-mktg-lead",
        _id: "growth-mktg-lead",
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
          "Coordinate global product launches, feature updates, and developer documentation marketing."
        ],
        requirements: [
          "3+ years product marketing experience in high-growth B2B SaaS or technical software agencies.",
          "Exceptional written storytelling skills translating deep architectural concepts into clear value propositions.",
          "Analytical rigor with proven experience in conversion rate optimization and attribution modeling."
        ],
        tags: ["B2B SaaS", "Product Growth", "Technical Writing", "Analytics", "SEO"],
        isActive: false,
        applyEmail: "careers@websmithdigital.com",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "soc2-compliance-arch",
        _id: "soc2-compliance-arch",
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
          "Lead annual SOC2 Type II, ISO27001, and GDPR technical compliance certifications."
        ],
        requirements: [
          "5+ years architecting cloud security and enterprise compliance for SaaS platforms.",
          "Strong familiarity with AWS/GCP security frameworks, Docker container hardening, and secret management.",
          "Certifications such as CISSP, CISA, or AWS Certified Security Specialty preferred."
        ],
        tags: ["Cybersecurity", "SOC2", "Cloud Security", "Compliance", "Zero Trust"],
        isActive: false,
        applyEmail: "careers@websmithdigital.com",
        createdAt: now,
        updatedAt: now
      }
    ];

    for (const job of jobs) {
      await client.query(
        `INSERT INTO portal_careers (_id, data, created_at, updated_at)
         VALUES ($1, $2, NOW(), NOW())
         ON CONFLICT (_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
        [job._id, JSON.stringify(job)]
      );
      console.log(`Successfully seeded inactive job: ${job.title} (isActive: ${job.isActive})`);
    }

    const res = await client.query(`SELECT COUNT(*) as count FROM portal_careers;`);
    console.log(`Total careers in portal_careers: ${res.rows[0].count}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error("Error seeding inactive jobs:", err);
  process.exit(1);
});
