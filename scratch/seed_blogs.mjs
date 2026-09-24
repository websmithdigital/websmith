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
  if (!databaseUrl) throw new Error('DATABASE_URL not found in .env');

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS portal_blogs (
        _id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_portal_blogs_data ON portal_blogs USING GIN (data);
    `);

    // Check count
    const res = await client.query(`SELECT COUNT(*) as count FROM portal_blogs;`);
    console.log(`Current blog count: ${res.rows[0].count}`);

    if (parseInt(res.rows[0].count, 10) === 0) {
      const now = new Date().toISOString();
      const posts = [
        {
          id: "blog-ai-multi-agent",
          _id: "blog-ai-multi-agent",
          slug: "building-multi-agent-ai-workflows-in-production",
          title: "Building Multi-Agent AI Workflows in Production: Architecture & Lessons",
          excerpt:
            "A comprehensive architectural breakdown of orchestrating autonomous LLM agents with deterministic state machines, vector retrieval, and human-in-the-loop safeguards.",
          coverImage:
            "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
          category: "AI & Automation",
          tags: ["AI Agents", "LLM", "Python", "Architecture", "LangChain"],
          author: {
            name: "Alex Vance",
            role: "Lead Systems Architect",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
          },
          readTime: "6 min read",
          isPublished: true,
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
          content: `# Building Multi-Agent AI Workflows in Production 🚀

Modern generative AI applications are rapidly moving beyond simple single-turn prompts into **autonomous multi-agent workflows**. Instead of relying on a single monolith model, resilient systems decompose complex objectives into collaborative, specialized agents.

---

## 1. Why Single Prompts Fail at Scale 💡

Single prompt chaining suffers from three critical failure modes:

- **Context Window Pollution**: Long reasoning trails degrade attention mechanisms over time.
- **Cascading Hallucinations**: An unverified assumption made at step 2 ruins all subsequent outputs.
- **Lack of Determinism**: Without state guards, agents frequently enter recursive loops or skip business logic.

> *"Agentic workflows succeed when LLMs are treated as probabilistic reasoning engines constrained inside deterministic state graphs."*

---

## 2. Core Architectural Pillars 🛡️

1. **Planner Agent**: Analyzes incoming tasks, generates a directed acyclic graph (DAG) of sub-tasks.
2. **Specialist Workers**: Domain-specific agents equipped with scoped tools.
3. **Critic & Verifier**: Reviews outputs against business rules and schema validators.
4. **Shared State Memory**: Redis or PostgreSQL-backed event logs tracking intermediate snapshots.

---

## 3. Implementation Blueprint 💻

\`\`\`typescript
interface AgentTask {
  id: string;
  objective: string;
  assignedTo: "planner" | "code-generator" | "reviewer";
  state: "pending" | "executing" | "verified" | "failed";
}
\`\`\`

Ready to scale your intelligent platform? [Consult our team](/contact) today!`
        },
        {
          id: "blog-nextjs-app-router",
          _id: "blog-nextjs-app-router",
          slug: "nextjs-app-router-performance-optimization",
          title: "Next.js App Router Architecture: Zero-Runtime CSS & Server Actions",
          excerpt:
            "Explore how modern React Server Components, streaming SSR, and edge caching achieve sub-100ms Largest Contentful Paint (LCP) in high-traffic web applications.",
          coverImage:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
          category: "Web Development",
          tags: ["Next.js", "React", "Performance", "Web Development", "TypeScript"],
          author: {
            name: "Marcus Chen",
            role: "Principal Frontend Engineer",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
          },
          readTime: "5 min read",
          isPublished: true,
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
          content: `# Next.js App Router Architecture: High-Performance Web Engineering ⚡

Delivering modern web experiences requires balancing interactive rich client interfaces with lightning-fast initial server rendering.

---

## 1. Zero-Runtime Client Footprint 🌐

- **0kB Client JavaScript**: Static layout headers and marketing copy ship as plain HTML.
- **Direct Database Access**: Fetch data directly inside server components with zero client REST waterfalls.
- **Enhanced Security**: API tokens and private keys never leak to the browser.`
        },
        {
          id: "blog-cloud-security",
          _id: "blog-cloud-security",
          slug: "cloud-security-soc2-compliance-playbook",
          title: "Enterprise SOC2 Type II Security in Cloud-Native Architectures",
          excerpt:
            "A pragmatic playbook for achieving zero-trust security posture, automated audit trails, and strict role-based access control across multi-tenant SaaS environments.",
          coverImage:
            "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
          category: "Cloud & DevOps",
          tags: ["Security", "SOC2", "Cloud", "DevOps", "Compliance"],
          author: {
            name: "Sarah Jenkins",
            role: "Director of Information Security",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
          },
          readTime: "7 min read",
          isPublished: true,
          publishedAt: now,
          createdAt: now,
          updatedAt: now,
          content: `# Enterprise SOC2 Type II Security in Cloud-Native Architectures 🛡️

In modern B2B SaaS, security is the foundation of enterprise trust.

---

## 1. Zero Trust: The Baseline Architecture 🔒

- **mTLS Encryption** across all microservices.
- **Ephemeral Credentials**: Secrets rotate automatically every few hours.
- **Least-Privilege RBAC**: Employees receive granular access scoped strictly to active operational tasks.`
        }
      ];

      for (const p of posts) {
        await client.query(
          `INSERT INTO portal_blogs (_id, data, created_at, updated_at)
           VALUES ($1, $2, NOW(), NOW())
           ON CONFLICT (_id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()`,
          [p._id, JSON.stringify(p)]
        );
        console.log(`Seeded blog: ${p.title}`);
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(console.error);
