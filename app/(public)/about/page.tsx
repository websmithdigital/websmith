"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Cpu, 
  Layers, 
  Users2, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Globe2, 
  Lock 
} from "lucide-react";
import { useLeadFunnel } from "../../providers/LeadFunnelProvider";
import { usePublicTheme } from "../../providers/PublicThemeProvider";
import { getPublishedDevelopers } from "../../../core/services/userService";
import HorizontalCardStrip from "@/components/ui/HorizontalCardStrip";

interface TeamMember {
  id?: string;
  name: string;
  role: string;
  specialty: string;
  exp: string;
  initials: string;
  avatar?: string;
  status?: string;
}

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Alex Mercer",
    role: "Principal Systems Architect",
    specialty: "High-Throughput APIs, Distributed State & Cloud Infrastructure",
    exp: "12+ yrs exp",
    initials: "AM",
  },
  {
    name: "Elena Rostova",
    role: "VP of Engineering & Security",
    specialty: "HMAC-SHA256 Cryptography, Node-Locking & Compliance",
    exp: "10+ yrs exp",
    initials: "ER",
  },
  {
    name: "Marcus Chen",
    role: "Head of ERP & Enterprise Systems",
    specialty: "Multi-Tenant Partitioning, Inventory Engines & Financial Billing",
    exp: "11+ yrs exp",
    initials: "MC",
  },
  {
    name: "Sarah Al-Mansoor",
    role: "Lead Frontend & Design Systems Architect",
    specialty: "Next.js App Router, Micro-Interactions & Design Systems",
    exp: "8+ yrs exp",
    initials: "SM",
  },
  {
    name: "Tariq Vance",
    role: "Director of DevOps & SRE",
    specialty: "Automated CI/CD, Kubernetes Orchestration & Zero-Downtime",
    exp: "9+ yrs exp",
    initials: "TV",
  },
  {
    name: "Maya Lin",
    role: "AI & Data Architecture Lead",
    specialty: "Autonomous Agent Pipelines, Vector Embeddings & Neural Search",
    exp: "7+ yrs exp",
    initials: "ML",
  },
];

export default function AboutPage() {
  const { publicTheme } = usePublicTheme();
  const isDark = publicTheme === "dark";
  const { openLeadServicesModal } = useLeadFunnel();

  const metrics = [
    { value: "100+", label: "Launches & Deployments", icon: Award },
    { value: "13", label: "Runtime SDKs Supported", icon: Cpu },
    { value: "99.99%", label: "Platform Uptime SLA", icon: ShieldCheck },
    { value: "418", label: "World Timezones Supported", icon: Globe2 },
  ];

  const corePillars = [
    {
      title: "Architecture Over Templates",
      desc: "We don't sell disposable cookie-cutter themes. Every digital ecosystem, ERP system, and API pipeline is purpose-built to scale with your business logic.",
      icon: Layers,
    },
    {
      title: "Cryptographic Security at Rest & In-Transit",
      desc: "From AES-256-GCM credential vaulting to HMAC-SHA256 signed API requests and node-locking, enterprise security is baked into our foundation.",
      icon: Lock,
    },
    {
      title: "Radical Operational Transparency",
      desc: "Our clients track real-time project milestones, task queues, shared deliverables, and invoices in a dedicated, unified Client Portal workspace.",
      icon: CheckCircle2,
    },
    {
      title: "Continuous Engineering & Partnership",
      desc: "The same senior engineers who architect your platform continue maintaining, securing, and scaling it post-launch with guaranteed SLAs.",
      icon: Users2,
    },
  ];

  const milestones = [
    {
      year: "Phase 1",
      title: "Foundations & High-Scale Web Architecture",
      description: "Established WebSmith Digital delivering custom enterprise web applications and complex interactive platforms using modern Next.js and TypeScript.",
    },
    {
      year: "Phase 2",
      title: "Enterprise ERP & Automation Systems",
      description: "Engineered bespoke business management tools, inventory synchronization, and automated billing engines for high-volume logistics and retail brands.",
    },
    {
      year: "Phase 3",
      title: "Universal License Platform (ULP)",
      description: "Pioneered proprietary licensing infrastructure with an automated compiler packaging production SDKs across 13 programming languages with hardware node-locking.",
    },
    {
      year: "Phase 4",
      title: "Global 418-Timezone Scheduler & AI Workflows",
      description: "Introduced synchronized dual-time consultation scheduling across all world timezones and integrated autonomous AI agent workflows for modern enterprises.",
    },
  ];

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(DEFAULT_TEAM_MEMBERS);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await getPublishedDevelopers();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: TeamMember[] = data.map((dev: any, idx: number) => {
            const initials = dev.name
              ? dev.name
                  .split(" ")
                  .filter(Boolean)
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "TM";
            return {
              id: dev._id || dev.id || `team-${idx}`,
              name: dev.name,
              role: dev.headline || dev.role || "Technical Architect",
              specialty:
                dev.bio ||
                (Array.isArray(dev.skills) && dev.skills.length
                  ? dev.skills.join(" • ")
                  : "High-Throughput APIs, Distributed State & Cloud Infrastructure"),
              exp: dev.experienceYears ? `${dev.experienceYears}+ yrs exp` : "5+ yrs exp",
              initials,
              avatar: dev.avatar || "",
              status: dev.status || "active",
            };
          });
          setTeamMembers(mapped);
        }
      } catch (err) {
        console.warn("Failed to fetch published team members:", err);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div
      className="wsd-about-page"
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        color: isDark ? "#f8fafc" : "#0f172a",
        paddingTop: "28px",
        paddingBottom: "50px",
      }}
    >
      {/* Hero Section */}
      <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto", padding: "0 clamp(16px, 4vw, 64px)", textAlign: "center" }}>
        <h1
          className="wsd-about-hero-title"
          style={{
            fontSize: "clamp(26px, 3.8vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "10px",
          }}
        >
          Engineering Practical{" "}
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
            Digital Ecosystems
          </span>
        </h1>

        <p
          className="wsd-about-hero-desc"
          style={{
            fontSize: "clamp(13.5px, 1.4vw, 15px)",
            color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
            maxWidth: "680px",
            margin: "0 auto 20px",
            lineHeight: 1.55,
          }}
        >
          At <strong>WebSmith Digital</strong>, we go beyond traditional software development. We architect resilient digital ecosystems, enterprise ERP platforms, and universal software licensing solutions that empower businesses to automate, scale, and outperform competition.
        </p>

        {/* Metrics Grid */}
        <div
          className="wsd-about-metrics-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginBottom: "36px",
          }}
        >
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className="wsd-about-metric-card wsd-unified-card"
                style={{
                  padding: "14px 12px",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <div
                  className="wsd-about-metric-icon-box"
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isDark ? "rgba(37, 99, 235, 0.15)" : "rgba(37, 99, 235, 0.08)",
                    color: "#3b82f6",
                    marginBottom: "8px",
                  }}
                >
                  <Icon size={18} />
                </div>
                <div
                  className="wsd-about-metric-val"
                  style={{
                    fontSize: "22px",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: isDark ? "#ffffff" : "#0f172a",
                    lineHeight: 1.1,
                    marginBottom: "4px",
                  }}
                >
                  {metric.value}
                </div>
                <div
                  className="wsd-about-metric-lbl"
                  style={{
                    fontSize: "12px",
                    fontWeight: 500,
                    color: isDark ? "rgba(255, 255, 255, 0.55)" : "#64748b",
                  }}
                >
                  {metric.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Core Engineering Philosophy */}
      <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto 40px", padding: "0 clamp(16px, 4vw, 64px)" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2
            className="wsd-section-heading"
            style={{
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "6px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Our Engineering Principles
          </h2>
          <p className="wsd-section-subtext" style={{ fontSize: "13.5px", color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b" }}>
            The standards that dictate how we architect, code, and support every platform.
          </p>
        </div>

        <div
          className="wsd-about-principles-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "14px",
          }}
        >
          {corePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="wsd-about-principle-card wsd-unified-card"
                style={{
                  padding: "18px 16px",
                  borderRadius: "16px",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  className="wsd-about-principle-icon-box"
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    backgroundColor: isDark ? "rgba(37, 99, 235, 0.15)" : "rgba(37, 99, 235, 0.08)",
                    color: "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "12px",
                  }}
                >
                  <Icon size={18} />
                </div>
                <h3
                  className="wsd-about-principle-title"
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    marginBottom: "6px",
                    color: isDark ? "#ffffff" : "#0f172a",
                  }}
                >
                  {pillar.title}
                </h3>
                <p
                  className="wsd-about-principle-desc"
                  style={{
                    fontSize: "12.5px",
                    lineHeight: 1.5,
                    color: isDark ? "rgba(255, 255, 255, 0.65)" : "#475569",
                    margin: 0,
                  }}
                >
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Evolution Timeline */}
      <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto 40px", padding: "0 clamp(16px, 4vw, 64px)" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2
            className="wsd-section-heading"
            style={{
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "6px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Evolution &amp; Technical Milestones
          </h2>
          <p className="wsd-section-subtext" style={{ fontSize: "13.5px", color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b" }}>
            How our engineering capabilities expanded into a full-scale digital ecosystem.
          </p>
        </div>

        <div className="wsd-about-milestones-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" }}>
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className="wsd-about-milestone-card"
              style={{
                padding: "16px 18px",
                borderRadius: "16px",
                backgroundColor: isDark ? "rgba(13, 19, 34, 0.6)" : "#ffffff",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <h3
                className="wsd-about-milestone-title"
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  marginBottom: "2px",
                  color: isDark ? "#ffffff" : "#0f172a",
                  lineHeight: 1.35,
                }}
              >
                {m.title}
              </h3>
              <p
                className="wsd-about-milestone-desc"
                style={{
                  fontSize: "12.5px",
                  lineHeight: 1.5,
                  color: isDark ? "rgba(255, 255, 255, 0.65)" : "#64748b",
                  margin: 0,
                }}
              >
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Engineering Team & Architects Section */}
      <div id="team" style={{ width: "100%", maxWidth: "100%", margin: "0 auto 40px", padding: "0 clamp(16px, 4vw, 64px)", scrollMarginTop: "90px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2
            className="wsd-section-heading"
            style={{
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "6px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Core Team &amp; Technical Architects
          </h2>
          <p className="wsd-section-subtext" style={{ fontSize: "13.5px", color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b", maxWidth: "640px", margin: "0 auto" }}>
            The senior systems engineers, security researchers, and product architects driving our platform ecosystems.
          </p>
        </div>

        <HorizontalCardStrip
          items={teamMembers}
          ariaLabel="Core team members"
          cardsPerView={4}
          mobileCardsPerView={1.2}
          gap={16}
          speed={0.8}
          autoLoopCount={1}
          direction="right-to-left"
          renderItem={(dev) => (
            <div
              className="wsd-team-card"
              style={{
                padding: "18px 16px",
                borderRadius: "16px",
                backgroundColor: isDark ? "rgba(13, 19, 34, 0.75)" : "#ffffff",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                height: "100%",
                minHeight: "175px",
                boxSizing: "border-box",
                transition: "transform 0.2s ease, border-color 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                {dev.avatar ? (
                  <img
                    src={dev.avatar}
                    alt={dev.name}
                    className="wsd-team-avatar-img"
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    className="wsd-team-avatar"
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "14px",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      flexShrink: 0,
                    }}
                  >
                    {dev.initials}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <h3
                    className="wsd-team-name"
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: isDark ? "#ffffff" : "#0f172a",
                      margin: 0,
                      lineHeight: 1.3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {dev.name}
                  </h3>
                  <div
                    className="wsd-team-role"
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#3b82f6",
                      marginTop: "1px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {dev.role}
                  </div>
                </div>
              </div>

              <div
                className="wsd-team-specialty"
                style={{
                  fontSize: "12.5px",
                  lineHeight: 1.45,
                  color: isDark ? "rgba(255, 255, 255, 0.65)" : "#475569",
                  flex: 1,
                }}
              >
                {dev.specialty}
              </div>

              <div
                className="wsd-team-footer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "10px",
                  borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid #f1f5f9",
                  fontSize: "11px",
                  color: isDark ? "rgba(255, 255, 255, 0.45)" : "#94a3b8",
                  fontWeight: 500,
                  marginTop: "auto",
                }}
              >
                <span>{dev.exp}</span>
                <span style={{ color: "#10b981", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#10b981" }} /> Active Architect
                </span>
              </div>
            </div>
          )}
        />
      </div>

      {/* Bottom CTA */}
      <div style={{ width: "100%", maxWidth: "100%", margin: "40px auto 0", padding: "0 clamp(16px, 4vw, 64px)" }}>
        <div
          className="wsd-about-cta"
          style={{
            padding: "32px clamp(20px, 4vw, 44px)",
            borderRadius: "20px",
            textAlign: "center",
            background: isDark
              ? "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(13, 19, 34, 0.8) 100%)"
              : "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, #ffffff 100%)",
            border: isDark ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(37, 99, 235, 0.15)",
          }}
        >
          <h2
            className="wsd-about-cta-title"
            style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "10px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Ready to partner with an engineering-first team?
          </h2>
          <p
            className="wsd-about-cta-desc"
            style={{
              fontSize: "14px",
              color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
              maxWidth: "600px",
              margin: "0 auto 20px",
              lineHeight: 1.55,
            }}
          >
            Let&apos;s discuss your upcoming software launch, ERP automation, or platform scaling requirements.
          </p>

          <button
            type="button"
            className="wsd-about-cta-btn"
            onClick={() => openLeadServicesModal()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "11px 26px",
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
            Get Started <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <style>{`
        .wsd-team-card:hover {
          border-color: rgba(37, 99, 235, 0.4) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .wsd-about-page {
            padding-top: 70px !important;
            padding-bottom: 24px !important;
          }
          .wsd-about-hero-title {
            font-size: 18px !important;
            line-height: 1.18 !important;
            margin-bottom: 4px !important;
          }
          .wsd-about-hero-desc {
            font-size: 10px !important;
            line-height: 1.3 !important;
            margin-bottom: 12px !important;
          }
          .wsd-about-metrics-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
            margin-bottom: 18px !important;
          }
          .wsd-about-metric-card {
            padding: 8px 6px !important;
            border-radius: 10px !important;
          }
          .wsd-about-metric-icon-box {
            width: 24px !important;
            height: 24px !important;
            margin-bottom: 3px !important;
          }
          .wsd-about-metric-val {
            font-size: 15px !important;
            margin-bottom: 1px !important;
          }
          .wsd-about-metric-lbl {
            font-size: 9px !important;
          }
          .wsd-section-heading {
            font-size: 15px !important;
            margin-bottom: 2px !important;
          }
          .wsd-section-subtext {
            font-size: 10px !important;
            margin-bottom: 10px !important;
          }
          .wsd-about-principles-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
            margin-bottom: 18px !important;
          }
          .wsd-about-principle-card {
            padding: 8px 6px !important;
            border-radius: 10px !important;
          }
          .wsd-about-principle-icon-box {
            width: 24px !important;
            height: 24px !important;
            margin-bottom: 6px !important;
          }
          .wsd-about-principle-title {
            font-size: 11px !important;
            margin-bottom: 3px !important;
          }
          .wsd-about-principle-desc {
            font-size: 9px !important;
            line-height: 1.25 !important;
          }
          .wsd-about-milestones-grid {
            grid-template-columns: 1fr !important;
            gap: 6px !important;
            margin-bottom: 18px !important;
          }
          .wsd-about-milestone-card {
            grid-template-columns: 55px 1fr !important;
            gap: 8px !important;
            padding: 8px 10px !important;
            border-radius: 10px !important;
          }
          .wsd-about-milestone-year {
            font-size: 10px !important;
          }
          .wsd-about-milestone-title {
            font-size: 11px !important;
            margin-bottom: 2px !important;
          }
          .wsd-about-milestone-desc {
            font-size: 9px !important;
            line-height: 1.25 !important;
          }
          .wsd-team-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
            margin-bottom: 18px !important;
          }
          .wsd-team-card {
            padding: 8px 6px !important;
            border-radius: 10px !important;
            gap: 6px !important;
          }
          .wsd-team-avatar {
            width: 28px !important;
            height: 28px !important;
            font-size: 11px !important;
            border-radius: 8px !important;
          }
          .wsd-team-avatar-img {
            width: 28px !important;
            height: 28px !important;
            border-radius: 8px !important;
          }
          .wsd-team-name {
            font-size: 11px !important;
            line-height: 1.2 !important;
          }
          .wsd-team-role {
            font-size: 9.5px !important;
            margin-top: 1px !important;
          }
          .wsd-team-specialty {
            font-size: 9px !important;
            line-height: 1.2 !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .wsd-team-footer {
            font-size: 8.5px !important;
            padding-top: 4px !important;
          }
          .wsd-about-cta {
            margin-top: 14px !important;
            padding: 14px 10px !important;
            border-radius: 12px !important;
          }
          .wsd-about-cta-title {
            font-size: 15px !important;
            margin-bottom: 4px !important;
          }
          .wsd-about-cta-desc {
            font-size: 10px !important;
            margin-bottom: 10px !important;
          }
          .wsd-about-cta-btn {
            padding: 8px 16px !important;
            font-size: 11px !important;
          }
        }
      `}</style>
    </div>
  );
}
