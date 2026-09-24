export interface WhoWeServeItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  benefits: string[];
}

export interface AboutPageContent {
  story_badge: string;
  story_title: string;
  story_lead: string;
  story_body: string;
  story_quote: string;
  story_quote_author: string;
  who_we_serve_title: string;
  who_we_serve_subtitle: string;
  who_we_serve_items: WhoWeServeItem[];
}

export const DEFAULT_ABOUT_CONTENT: AboutPageContent = {
  story_badge: "Origin & Company Thesis",
  story_title: "Why WebSmith Digital Was Founded",
  story_lead: "Too many organizations are held back by brittle agency code, disposable themes, and vendor lock-in.",
  story_body: "WebSmith Digital was founded on a simple principle: build resilient software as engineered systems, not marketing disposable assets. We combined enterprise systems engineering with modern design agility to deliver robust digital ecosystems that scale autonomously.",
  story_quote: "We don't build projects to hand off and disappear. We architect long-term infrastructure with guaranteed uptime and cryptographic rigor.",
  story_quote_author: "WebSmith Engineering Leadership",
  who_we_serve_title: "Who We Serve & Problems We Solve",
  who_we_serve_subtitle: "Purpose-built engineering partnerships designed for organizations demanding production-grade reliability.",
  who_we_serve_items: [
    {
      id: "saas",
      tag: "High-Growth & Venture",
      title: "SaaS Platforms & Scale-Ups",
      description: "Eliminating architectural tech debt, building high-throughput event queues, and scaling multi-tenant databases.",
      benefits: ["Distributed State & Cache Sync", "Zero-Downtime CI/CD Pipelines", "Automated Load Balancing"],
    },
    {
      id: "enterprise",
      tag: "Logistics & Operations",
      title: "Enterprise ERP & High-Volume Operations",
      description: "Custom ERP systems, real-time inventory synchronization, and automated financial billing engines.",
      benefits: ["High-Volume Ledger Auditing", "Multi-Warehouse Data Flow", "Role-Based Security & Permissions"],
    },
    {
      id: "global",
      tag: "Global Platforms",
      title: "Software Vendors & Regulated Platforms",
      description: "Hardware node-locked licensing SDKs across 13 languages, 418-timezone scheduling, and cryptographic vaulting.",
      benefits: ["Hardware Node-Lock Licensing (ULP)", "AES-256 / HMAC Cryptography", "Global Dual-Timezone Scheduling"],
    },
  ],
};
