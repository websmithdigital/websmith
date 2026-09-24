export type Department =
  | "All"
  | "Engineering"
  | "Design"
  | "Product & Operations"
  | "Marketing"
  | "Sales"
  | string;

export interface JobRole {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary?: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  tags: string[];
  isActive: boolean;
  applyEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_JOB_ROLES: JobRole[] = [
  {
    id: "fe-lead",
    title: "Senior Full-Stack Engineer (Next.js & TypeScript)",
    department: "Engineering",
    location: "Remote / Hybrid (Kolkata HQ)",
    type: "Full-Time",
    experience: "4+ Years",
    salary: "$65,000 - $95,000 / Competitive",
    description:
      "Architect and deliver high-scale digital platforms, serverless APIs, and interactive client portals using Next.js 16, TypeScript, and Neon PostgreSQL.",
    responsibilities: [
      "Design and maintain scalable full-stack web applications using Next.js App Router and TypeScript.",
      "Architect high-throughput database schemas and background queue processing with Neon PostgreSQL and Redis.",
      "Collaborate closely with UI/UX product designers to engineer pixel-perfect, accessible, and high-performance interfaces.",
      "Mentor mid-level engineers and conduct comprehensive pull request code reviews."
    ],
    requirements: [
      "4+ years of professional full-stack development experience with modern React, Next.js, and TypeScript.",
      "Strong proficiency with relational databases (PostgreSQL/MySQL) and ORM/query tooling.",
      "Experience deploying and monitoring production workloads on cloud infrastructures (AWS/Vercel/Docker).",
      "Exceptional communication skills and autonomous problem-solving mindset."
    ],
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Node.js", "Tailwind CSS"],
    isActive: true,
    applyEmail: "careers@websmithdigital.com"
  },
  {
    id: "erp-arch",
    title: "Enterprise ERP & Systems Architect",
    department: "Engineering",
    location: "Remote",
    type: "Full-Time",
    experience: "5+ Years",
    salary: "$80,000 - $120,000 / Competitive",
    description:
      "Design custom resource planning engines, real-time inventory synchronization systems, and high-throughput background queues for global retail brands.",
    responsibilities: [
      "Lead enterprise ERP system design, multi-tenant database partitions, and transactional consistency models.",
      "Build fault-tolerant event bridges, webhook distributors, and async background workers.",
      "Evaluate third-party integrations, security auditing, and compliance protocols across enterprise accounts."
    ],
    requirements: [
      "5+ years architecting enterprise distributed backends and mission-critical data pipelines.",
      "Deep expertise in Go or Node.js, Redis queues, and distributed database locking mechanisms.",
      "Demonstrated track record of delivering resilient multi-region architectures."
    ],
    tags: ["Distributed Systems", "Redis", "Docker", "Database Optimization", "Go/Node"],
    isActive: true,
    applyEmail: "careers@websmithdigital.com"
  },
  {
    id: "uiux-sr",
    title: "Lead UI/UX Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-Time",
    experience: "3+ Years",
    salary: "$50,000 - $75,000 / Competitive",
    description:
      "Create state-of-the-art interactive web applications, design systems, and mobile interfaces. Turn complex enterprise workflows into intuitive, breathtaking UIs.",
    responsibilities: [
      "Create high-fidelity design systems, interactive prototypes, and component libraries in Figma.",
      "Conduct user research, journey mapping, and usability validations with enterprise stakeholders.",
      "Partner with frontend engineers to ensure design integrity and smooth micro-animations."
    ],
    requirements: [
      "3+ years product design experience crafting enterprise web dashboards and digital platforms.",
      "Expert knowledge of Figma design tokens, responsive auto-layout, and prototyping.",
      "Portfolio showcasing clean typography, modern glassmorphism/dark aesthetic, and complex user flows."
    ],
    tags: ["Figma", "Design Systems", "Prototyping", "Design Ops", "Micro-interactions"],
    isActive: true,
    applyEmail: "careers@websmithdigital.com"
  },
  {
    id: "devops-eng",
    title: "Cloud Infrastructure & DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-Time",
    experience: "3+ Years",
    salary: "$60,000 - $85,000 / Competitive",
    description:
      "Maintain zero-downtime deployment pipelines, edge CDN caching, Kubernetes clusters, and automated security penetration scanning.",
    responsibilities: [
      "Manage cloud infrastructure on AWS/GCP using Terraform and infrastructure-as-code.",
      "Implement automated CI/CD pipelines with comprehensive unit, integration, and security scans.",
      "Monitor application performance, error rates, and cluster health with Prometheus and Grafana."
    ],
    requirements: [
      "3+ years hands-on experience in cloud infrastructure, container orchestration (Docker/K8s), and CI/CD.",
      "Solid scripting proficiency in Bash, Python, or Go.",
      "In-depth understanding of networking, DNS, SSL certificates, and security compliance."
    ],
    tags: ["AWS / GCP", "CI/CD", "Docker", "Kubernetes", "Terraform", "Security"],
    isActive: true,
    applyEmail: "careers@websmithdigital.com"
  },
  {
    id: "prod-coord",
    title: "Technical Project Manager / Client Partner",
    department: "Product & Operations",
    location: "Remote / Hybrid",
    type: "Full-Time",
    experience: "3+ Years",
    salary: "$50,000 - $70,000 / Competitive",
    description:
      "Drive agile sprint cadences, client milestone roadmaps, deliverable tracking, and quality assurance alongside senior engineering leads.",
    responsibilities: [
      "Facilitate sprint planning, daily standups, milestone retrospectives, and client status demos.",
      "Translate business objectives into granular technical task breakdowns and acceptance criteria.",
      "Coordinate client feedback loops and manage project scope and timelines proactively."
    ],
    requirements: [
      "3+ years managing software development projects in an agile or agency environment.",
      "Strong technical comprehension of web development workflows, Git, and issue tracking.",
      "Outstanding client-facing presentation and relationship management skills."
    ],
    tags: ["Agile/Scrum", "Client Success", "Technical Specs", "Sprint Planning"],
    isActive: true,
    applyEmail: "careers@websmithdigital.com"
  }
];
