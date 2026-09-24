"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Code2,
  Lock,
  Compass,
  Cpu,
  Server,
  Layers,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Terminal,
  HelpCircle,
  Mail,
  Headphones,
  ArrowRight,
  KeyRound,
  BookOpen,
} from "lucide-react";
import { usePublicTheme } from "../../providers/PublicThemeProvider";
import { useLeadFunnel } from "../../providers/LeadFunnelProvider";
import API from "../../../core/services/apiService";

interface DocArticle {
  id: string;
  category: string;
  title: string;
  summary: string;
  badge?: string;
  code?: {
    lang: string;
    snippet: string;
  };
  steps?: string[];
  notes?: string;
}

const DOC_CATEGORIES = [
  { id: "getting-started", label: "Getting Started & Delivery", icon: Compass },
  { id: "security", label: "Security & Cryptography", icon: Lock },
  { id: "licensing", label: "ULP Licensing SDKs & APIs", icon: KeyRound },
  { id: "portal", label: "Client Workspace & Invoicing", icon: Layers },
  { id: "troubleshooting", label: "Troubleshooting & SLAs", icon: HelpCircle },
];

const DOC_ARTICLES: Record<string, DocArticle[]> = {
  "getting-started": [
    {
      id: "engagement-lifecycle",
      category: "Getting Started & Delivery",
      title: "Project Engagement & Architecture Roadmap",
      summary: "How engagements transition from discovery consultation to milestone delivery, staging verification, and production handoff.",
      steps: [
        "Phase 1: Architecture Discovery & Technical Requirements Definition",
        "Phase 2: Milestone Agreement, Deliverables Scope & Signed SLA",
        "Phase 3: Real-Time Sprints in Dedicated Client Portal",
        "Phase 4: Staging Deployment & Automated Regression Verification",
        "Phase 5: Production Release, Zero-Downtime Migration & Handover",
      ],
      notes: "Every client is provisioned a dedicated Client Portal workspace with direct ticket channels to the engineering architects.",
    },
    {
      id: "environment-setup",
      category: "Getting Started & Delivery",
      title: "Repository Access & Staging Environments",
      summary: "How WebSmith coordinates version control, automated staging branches, and database sandbox credentials for client engineering leads.",
      code: {
        lang: "bash",
        snippet: `# Clone client private repository via SSH
git clone git@github.com:websmith-digital/client-workspace.git
cd client-workspace

# Install pinned dependencies
npm ci

# Configure environment secrets
cp .env.example .env.local
npm run dev`,
      },
    },
  ],
  security: [
    {
      id: "hmac-signing",
      category: "Security & Cryptography",
      title: "HMAC-SHA256 Request Authentication",
      badge: "Enterprise Standard",
      summary: "All high-throughput API endpoints and webhook dispatches require cryptographic HMAC-SHA256 request signing with timestamp replay protection.",
      code: {
        lang: "typescript",
        snippet: `import crypto from "crypto";

export function signPayload(body: string, secretKey: string): { timestamp: number; signature: string } {
  const timestamp = Date.now();
  const signaturePayload = \`\${timestamp}.\${body}\`;
  
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(signaturePayload)
    .digest("hex");
    
  return { timestamp, signature };
}`,
      },
      notes: "Signatures older than 300 seconds are rejected by API gateways to prevent replay vulnerabilities.",
    },
    {
      id: "envelope-encryption",
      category: "Security & Cryptography",
      title: "AES-256-GCM Credential Vaulting",
      summary: "Customer secrets, OAuth tokens, and payment credentials are encrypted using AES-256-GCM envelope encryption with distinct initialization vectors.",
      steps: [
        "Unique 96-bit Initialization Vector (IV) generated per record",
        "Encrypted with primary AES-256 vault key via hardware KMS",
        "128-bit authentication tag appended for cryptographic tamper detection",
        "Zero unencrypted credentials stored in database tables or logs",
      ],
    },
  ],
  licensing: [
    {
      id: "ulp-validation",
      category: "ULP Licensing SDKs & APIs",
      title: "Hardware Node-Locking & Offline Validation",
      badge: "13 SDK Languages",
      summary: "The Universal License Platform (ULP) binds commercial software licenses to physical hardware signatures with cryptographic offline grace allowances.",
      code: {
        lang: "python",
        snippet: `from websmith_ulp import LicenseClient

# Initialize client with public enterprise key
client = LicenseClient(
    public_key="pk_live_8f3a9e1c2b...",
    product_slug="enterprise-erp-core"
)

# Validate offline lease certificate with hardware fingerprint
status = client.verify_license(lease_grace_hours=72)
if status.is_valid:
    print(f"License Active for: {status.licensed_to}")
else:
    print(f"Validation Error: {status.error_code}")`,
      },
      notes: "Production compiler supports Python, Go, Node.js, C#, Rust, Java, PHP, Ruby, Swift, Kotlin, Dart, C++, and Lua.",
    },
    {
      id: "webhook-events",
      category: "ULP Licensing SDKs & APIs",
      title: "Webhook Real-Time Life-Cycle Events",
      summary: "Automate license provisioning upon Stripe or Razorpay checkout completions via WebSmith's signed webhook engine.",
      steps: [
        "Event 'license.created': Triggered immediately upon payment confirmation",
        "Event 'license.heartbeat': Sent every 24h to synchronize lease expiration",
        "Event 'license.revoked': Instant broadcast when administrative revocation occurs",
        "Automatic exponential backoff with 5 retry cycles on 5xx client receiver codes",
      ],
    },
  ],
  portal: [
    {
      id: "milestone-approvals",
      category: "Client Workspace & Invoicing",
      title: "Milestone Tracking & Deliverable Verification",
      summary: "Every sprint deliverable is staged, verified by automated end-to-end tests, and approved inside the unified Client Portal before payment capture.",
      steps: [
        "Step 1: Staging URL and test credentials posted to the milestone channel",
        "Step 2: Client QA conducts verification against agreed functional spec",
        "Step 3: One-click digital signoff releases the sprint milestone",
        "Step 4: Automated PDF tax invoice and receipt generated instantly",
      ],
      notes: "Milestone funds remain in escrow custody until client signs off on staging verification.",
    },
    {
      id: "timezone-scheduling",
      category: "Client Workspace & Invoicing",
      title: "Dual-Timezone Consultation Scheduling",
      summary: "Consultation calls seamlessly map across 418 IANA world timezones without daylight savings conversion errors or scheduling conflicts.",
      steps: [
        "Synchronous dual-time display showing both client local time and lead engineer time",
        "Automated Google Meet and calendar invitation dispatch with ICS attachments",
        "1-hour and 10-minute automated email reminders prior to meeting start",
      ],
    },
  ],
  troubleshooting: [
    {
      id: "sla-guarantees",
      category: "Troubleshooting & SLAs",
      title: "Service Level Agreement (SLA) & Incident Response",
      badge: "99.99% Uptime SLA",
      summary: "WebSmith Digital backs production systems with contractual SLA tiers, real-time APM telemetry, and dedicated emergency paging lines.",
      steps: [
        "Critical (P1): Core service outage — 15-minute engineer response, 2-hour target resolution",
        "Major (P2): Degraded feature performance — 1-hour response, 6-hour target resolution",
        "Minor (P3): Non-blocking defect or inquiry — 4-hour response during business days",
      ],
      notes: "Enterprise tier clients receive dedicated direct Slack / Teams shared channel access to lead engineers.",
    },
    {
      id: "rate-limiting",
      category: "Troubleshooting & SLAs",
      title: "API Rate Limiting & HTTP 429 Mitigations",
      summary: "All public and private API endpoints implement token-bucket rate limiting to guarantee equitable platform throughput.",
      code: {
        lang: "http",
        snippet: `HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1718901200
Retry-After: 45

{
  "success": false,
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Token bucket exhausted. Please wait 45 seconds before retrying."
}`,
      },
    },
  ],
};

export default function DocumentationPage() {
  const { publicTheme } = usePublicTheme();
  const isDark = publicTheme === "dark";
  const { openLeadServicesModal } = useLeadFunnel();

  const [activeCategory, setActiveCategory] = useState<string>("getting-started");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const [contactInfo, setContactInfo] = useState({
    email: "support@websmithdigital.com",
    sales_email: "sales@websmithdigital.com",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/settings/public/contact_info");
        if (res.data && res.data.success && res.data.data) {
          setContactInfo({
            email: res.data.data.email || "support@websmithdigital.com",
            sales_email: res.data.data.sales_email || "sales@websmithdigital.com",
          });
        }
      } catch {
        // Fallback to default
      }
    };
    fetchSettings();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const displayedArticles = React.useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const all: DocArticle[] = [];
      Object.values(DOC_ARTICLES).forEach((list) => {
        list.forEach((art) => {
          if (
            art.title.toLowerCase().includes(q) ||
            art.summary.toLowerCase().includes(q) ||
            art.category.toLowerCase().includes(q)
          ) {
            all.push(art);
          }
        });
      });
      return all;
    }
    return DOC_ARTICLES[activeCategory] || [];
  }, [activeCategory, searchQuery]);

  return (
    <div
      className="wsd-docs-page"
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        color: isDark ? "#f8fafc" : "#0f172a",
        paddingTop: "28px",
        paddingBottom: "50px",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto 32px",
          padding: "0 clamp(16px, 4vw, 64px)",
          textAlign: "center",
        }}
      >
        <h1
          className="wsd-docs-hero-title"
          style={{
            fontSize: "clamp(26px, 3.8vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "10px",
          }}
        >
          WebSmith{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              color: "transparent",
              textShadow: "none",
            }}
          >
            Documentation Center
          </span>
        </h1>

        <p
          className="wsd-docs-hero-desc"
          style={{
            fontSize: "clamp(13.5px, 1.4vw, 15px)",
            color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
            maxWidth: "680px",
            margin: "0 auto 20px",
            lineHeight: 1.55,
          }}
        >
          Comprehensive architectural specifications, HMAC security guides, Universal License Platform SDK integrations, and client workspace workflows.
        </p>

        {/* Live Search Input */}
        <div className="wsd-docs-search-box" style={{ maxWidth: "480px", margin: "0 auto", position: "relative" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: isDark ? "rgba(255, 255, 255, 0.4)" : "#94a3b8",
            }}
          />
          <input
            type="text"
            placeholder="Search guides, HMAC signing, SDK functions, or SLAs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="wsd-docs-search-input"
            style={{
              width: "100%",
              padding: "10px 16px 10px 40px",
              borderRadius: "9999px",
              backgroundColor: isDark ? "rgba(13, 19, 34, 0.85)" : "#ffffff",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #cbd5e1",
              color: isDark ? "#ffffff" : "#0f172a",
              fontSize: "13.5px",
              outline: "none",
              boxShadow: isDark ? "none" : "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          />
        </div>
      </div>

      {/* Main Documentation Layout */}
      <div
        className="wsd-docs-layout"
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 64px)",
          display: "grid",
          gridTemplateColumns: "250px 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* Left Navigation Sidebar */}
        <aside
          className="wsd-docs-sidebar"
          style={{
            position: "sticky",
            top: "90px",
            borderRadius: "16px",
            padding: "12px",
            backgroundColor: isDark ? "rgba(13, 19, 34, 0.8)" : "#ffffff",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
            boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(0, 0, 0, 0.04)",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <div
            className="wsd-docs-sidebar-header"
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: isDark ? "rgba(255, 255, 255, 0.4)" : "#94a3b8",
              padding: "6px 10px 4px",
            }}
          >
            Documentation Topics
          </div>

          {DOC_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = !searchQuery && activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory(cat.id);
                }}
                className="wsd-docs-nav-btn"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  border: "none",
                  backgroundColor: isSelected
                    ? isDark
                      ? "rgba(37, 99, 235, 0.25)"
                      : "rgba(37, 99, 235, 0.1)"
                    : "transparent",
                  color: isSelected ? "#3b82f6" : isDark ? "rgba(255, 255, 255, 0.75)" : "#475569",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={16} color={isSelected ? "#3b82f6" : "currentColor"} />
                <span style={{ flex: 1 }}>{cat.label}</span>
                {isSelected && <ChevronRight size={13} color="#3b82f6" />}
              </button>
            );
          })}

          <div
            className="wsd-docs-sidebar-support"
            style={{
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #f1f5f9",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: isDark ? "rgba(255, 255, 255, 0.5)" : "#64748b",
                marginBottom: "6px",
                padding: "0 8px",
              }}
            >
              Support Channels
            </div>
            <a
              href={`mailto:${contactInfo.email}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 8px",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#3b82f6",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              <Mail size={14} /> {contactInfo.email}
            </a>
          </div>
        </aside>

        {/* Right Content Area: Articles */}
        <div className="wsd-docs-articles" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {searchQuery && (
            <div style={{ fontSize: "13px", color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b" }}>
              Showing results for: <strong>"{searchQuery}"</strong> ({displayedArticles.length} articles)
            </div>
          )}

          {displayedArticles.length === 0 ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                borderRadius: "16px",
                backgroundColor: isDark ? "rgba(13, 19, 34, 0.6)" : "#ffffff",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
              }}
            >
              <HelpCircle size={28} color="#3b82f6" style={{ margin: "0 auto 10px" }} />
              <div style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>No matching documentation found</div>
              <p style={{ fontSize: "13px", color: isDark ? "rgba(255, 255, 255, 0.5)" : "#64748b", margin: 0 }}>
                Try searching for broader keywords like "security", "SDK", "HMAC", or "milestones".
              </p>
            </div>
          ) : (
            displayedArticles.map((art) => (
              <article
                key={art.id}
                id={art.id}
                className="wsd-doc-card"
                style={{
                  borderRadius: "18px",
                  padding: "24px clamp(16px, 3vw, 30px)",
                  backgroundColor: isDark ? "rgba(13, 19, 34, 0.8)" : "#ffffff",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                  boxShadow: isDark
                    ? "0 10px 30px -6px rgba(0, 0, 0, 0.4)"
                    : "0 4px 16px -2px rgba(0, 0, 0, 0.04)",
                }}
              >
                {/* Article Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                  <span
                    className="wsd-doc-category"
                    style={{
                      fontSize: "10.5px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      color: "#3b82f6",
                    }}
                  >
                    {art.category}
                  </span>
                  {art.badge && (
                    <span
                      className="wsd-doc-badge"
                      style={{
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        fontSize: "10.5px",
                        fontWeight: 700,
                        backgroundColor: isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.1)",
                        color: "#10b981",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                      }}
                    >
                      {art.badge}
                    </span>
                  )}
                </div>

                <h2
                  className="wsd-doc-title"
                  style={{
                    fontSize: "clamp(17px, 2.2vw, 22px)",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    marginBottom: "8px",
                    color: isDark ? "#ffffff" : "#0f172a",
                  }}
                >
                  {art.title}
                </h2>

                <p
                  className="wsd-doc-summary"
                  style={{
                    fontSize: "13.5px",
                    lineHeight: 1.55,
                    color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
                    marginBottom: "16px",
                  }}
                >
                  {art.summary}
                </p>

                {/* Steps Section */}
                {art.steps && (
                  <div className="wsd-doc-steps" style={{ marginBottom: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {art.steps.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className="wsd-doc-step-item"
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          padding: "10px 14px",
                          borderRadius: "10px",
                          backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#f8fafc",
                          border: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid #e2e8f0",
                        }}
                      >
                        <CheckCircle2 size={15} color="#3b82f6" style={{ marginTop: "2px", flexShrink: 0 }} />
                        <span style={{ fontSize: "12.5px", lineHeight: 1.45, color: isDark ? "#f8fafc" : "#1e293b" }}>
                          {step}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Code Block Snippet */}
                {art.code && (
                  <div
                    className="wsd-doc-code-block"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "#030712",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      overflow: "hidden",
                      marginBottom: "14px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "8px 14px",
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Terminal size={13} color="#3b82f6" />
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255, 255, 255, 0.6)", textTransform: "uppercase" }}>
                          {art.code.lang}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(art.code!.snippet, art.id)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "3px 8px",
                          borderRadius: "5px",
                          backgroundColor: "rgba(255, 255, 255, 0.08)",
                          border: "none",
                          color: "#ffffff",
                          fontSize: "11px",
                          cursor: "pointer",
                        }}
                      >
                        {copiedSnippet === art.id ? (
                          <>
                            <Check size={11} color="#10b981" /> Copied!
                          </>
                        ) : (
                          <>
                            <Copy size={11} /> Copy Code
                          </>
                        )}
                      </button>
                    </div>

                    <pre
                      style={{
                        margin: 0,
                        padding: "14px",
                        fontSize: "12px",
                        lineHeight: 1.55,
                        color: "#38bdf8",
                        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                        overflowX: "auto",
                      }}
                    >
                      <code>{art.code.snippet}</code>
                    </pre>
                  </div>
                )}

                {/* Important Notes */}
                {art.notes && (
                  <div
                    className="wsd-doc-note"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "8px",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      backgroundColor: isDark ? "rgba(37, 99, 235, 0.1)" : "rgba(37, 99, 235, 0.06)",
                      border: isDark ? "1px solid rgba(37, 99, 235, 0.25)" : "1px solid rgba(37, 99, 235, 0.15)",
                      fontSize: "12px",
                      color: isDark ? "rgba(255, 255, 255, 0.75)" : "#334155",
                      lineHeight: 1.45,
                    }}
                  >
                    <Sparkles size={14} color="#3b82f6" style={{ marginTop: "2px", flexShrink: 0 }} />
                    <div>
                      <strong style={{ color: "#3b82f6" }}>Architect Note: </strong>
                      {art.notes}
                    </div>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      </div>

      {/* Bottom Technical Support Callout */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "40px auto 0",
          padding: "0 clamp(16px, 4vw, 64px)",
        }}
      >
        <div
          className="wsd-docs-cta"
          style={{
            padding: "32px clamp(20px, 4vw, 44px)",
            borderRadius: "20px",
            textAlign: "center",
            background: isDark
              ? "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(13, 19, 34, 0.85) 100%)"
              : "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, #ffffff 100%)",
            border: isDark ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(37, 99, 235, 0.15)",
          }}
        >
          <h2
            className="wsd-docs-cta-title"
            style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "10px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Require direct architectural assistance or API onboarding?
          </h2>
          <p
            className="wsd-docs-cta-desc"
            style={{
              fontSize: "14px",
              color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
              maxWidth: "600px",
              margin: "0 auto 20px",
              lineHeight: 1.55,
            }}
          >
            Our principal engineers provide one-on-one integration reviews, compliance audits, and custom SDK deployment pipelines.
          </p>

          <div className="wsd-docs-cta-btns" style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="wsd-docs-cta-btn-primary"
              onClick={() => openLeadServicesModal()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "11px 24px",
                borderRadius: "9999px",
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#ffffff",
                background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 20px -4px rgba(37, 99, 235, 0.4)",
              }}
            >
              Request Integration Review <ArrowRight size={14} />
            </button>
            <Link
              href="/contact"
              className="wsd-docs-cta-btn-secondary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "11px 22px",
                borderRadius: "9999px",
                fontSize: "13.5px",
                fontWeight: 600,
                color: isDark ? "#ffffff" : "#0f172a",
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#ffffff",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #cbd5e1",
                textDecoration: "none",
              }}
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .wsd-docs-page {
            padding-top: 70px !important;
            padding-bottom: 24px !important;
          }
          .wsd-docs-hero-title {
            font-size: 18px !important;
            line-height: 1.18 !important;
            margin-bottom: 4px !important;
          }
          .wsd-docs-hero-desc {
            font-size: 10px !important;
            line-height: 1.3 !important;
            margin-bottom: 10px !important;
          }
          .wsd-docs-search-box {
            max-width: 100% !important;
            margin-bottom: 12px !important;
          }
          .wsd-docs-search-input {
            padding: 8px 12px 8px 34px !important;
            font-size: 11px !important;
          }
          .wsd-docs-layout {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }
          .wsd-docs-sidebar {
            position: static !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 4px !important;
            padding: 4px !important;
            border-radius: 9999px !important;
            margin-bottom: 8px !important;
          }
          .wsd-docs-sidebar-header {
            display: none !important;
          }
          .wsd-docs-sidebar-support {
            display: none !important;
          }
          .wsd-docs-nav-btn {
            padding: 4px 10px !important;
            font-size: 10.5px !important;
            border-radius: 9999px !important;
            gap: 4px !important;
          }
          .wsd-docs-nav-btn svg:last-child {
            display: none !important;
          }
          .wsd-doc-card {
            padding: 12px 10px !important;
            border-radius: 12px !important;
          }
          .wsd-doc-category {
            font-size: 9px !important;
          }
          .wsd-doc-badge {
            font-size: 9px !important;
            padding: 2px 5px !important;
          }
          .wsd-doc-title {
            font-size: 13.5px !important;
            margin-bottom: 4px !important;
          }
          .wsd-doc-summary {
            font-size: 10px !important;
            line-height: 1.35 !important;
            margin-bottom: 10px !important;
          }
          .wsd-doc-steps {
            gap: 4px !important;
            margin-bottom: 10px !important;
          }
          .wsd-doc-step-item {
            padding: 6px 8px !important;
            font-size: 9.5px !important;
            gap: 6px !important;
          }
          .wsd-doc-step-item span {
            font-size: 9.5px !important;
            line-height: 1.3 !important;
          }
          .wsd-doc-code-block {
            margin-bottom: 10px !important;
            border-radius: 8px !important;
          }
          .wsd-doc-code-block pre {
            padding: 10px !important;
            font-size: 9.5px !important;
            line-height: 1.35 !important;
          }
          .wsd-doc-note {
            padding: 8px 10px !important;
            font-size: 9.5px !important;
            border-radius: 8px !important;
          }
          .wsd-docs-cta {
            margin-top: 14px !important;
            padding: 14px 10px !important;
            border-radius: 12px !important;
          }
          .wsd-docs-cta-title {
            font-size: 15px !important;
            margin-bottom: 4px !important;
          }
          .wsd-docs-cta-desc {
            font-size: 10px !important;
            margin-bottom: 10px !important;
          }
          .wsd-docs-cta-btns {
            gap: 6px !important;
          }
          .wsd-docs-cta-btn-primary, .wsd-docs-cta-btn-secondary {
            padding: 7px 14px !important;
            font-size: 10.5px !important;
          }
        }
      `}</style>
    </div>
  );
}
