"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Check,
  ChevronRight,
  Layers,
  Sparkles,
  Zap,
  Shield,
  Code2,
  Cpu,
} from "lucide-react";
import { usePublicTheme } from "../providers/PublicThemeProvider";
import { useLeadFunnel } from "../providers/LeadFunnelProvider";
import { getPublicServiceCategories } from "@/lib/cms/cmsService";
import { SEED_SERVICE_CATEGORIES, type CmsServiceCategory, type CmsServiceItem } from "@/lib/cms/types";
import LucideIcon from "@/components/shared/LucideIcon";
import { usePersistedTab } from "@/hooks/usePersistedTab";

function ServicesContent() {
  const { publicTheme } = usePublicTheme();
  const isDark = publicTheme === "dark";
  const { openLeadServicesModal } = useLeadFunnel();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<CmsServiceCategory[]>(SEED_SERVICE_CATEGORIES);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = usePersistedTab<string>("all", {
    paramName: "tab",
  });
  const [highlightedSlug, setHighlightedSlug] = useState<string>("");

  useEffect(() => {
    let isCancelled = false;
    async function loadServices() {
      try {
        setLoading(true);
        const data = await getPublicServiceCategories();
        if (!isCancelled && Array.isArray(data) && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Failed to load CMS service categories:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    loadServices();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Handle anchor targeting and smooth scrolling when arriving from Navbar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleHash = () => {
        const hash = window.location.hash.replace("#", "");
        if (hash) {
          setHighlightedSlug(hash);
          setTimeout(() => {
            const el = document.getElementById(hash);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 350);
        }
      };

      handleHash();
      window.addEventListener("hashchange", handleHash);
      return () => window.removeEventListener("hashchange", handleHash);
    }
  }, [activeTab]);

  const filteredCategories = useMemo(() => {
    if (activeTab === "all") return categories;
    const match = categories.filter((c) => c.slug === activeTab);
    return match.length > 0 ? match : categories;
  }, [categories, activeTab]);

  const activeCategory = useMemo(() => {
    if (activeTab === "all") return null;
    return categories.find((c) => c.slug === activeTab) || null;
  }, [categories, activeTab]);

  const processSteps = [
    {
      number: "01",
      title: "Discovery & Architecture Blueprint",
      description: "We analyze your exact business model, data flows, and technical constraints to draft a comprehensive architecture blueprint and project roadmap.",
    },
    {
      number: "02",
      title: "Milestone-Based Agile Sprints",
      description: "We work in transparent two-week sprints with staging demo builds, giving you complete visibility into progress, code quality, and deliverables.",
    },
    {
      number: "03",
      title: "Automated QA & Security Hardening",
      description: "Every codebase undergoes rigorous automated unit tests, end-to-end integration tests, and security penetration checks before release.",
    },
    {
      number: "04",
      title: "Turnkey Deployment & SLA Operations",
      description: "Zero-downtime production deployment, telemetry observability, and 24/7 technical monitoring backed by formal enterprise uptime SLAs.",
    },
  ];

  return (
    <div
      className="wsd-services-page"
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        color: isDark ? "#f8fafc" : "#0f172a",
        paddingTop: "24px",
        paddingBottom: "60px",
      }}
    >
      {/* Hero Header */}
      <div
        className="services-hero-wrap"
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0 clamp(20px, 4vw, 64px)",
          textAlign: "center",
        }}
      >
        <h1
          className="services-hero-title"
          style={{
            fontSize: "clamp(26px, 3.8vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "10px",
          }}
        >
          {activeCategory ? (
            <>
              {activeCategory.name}{" "}
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
                Capabilities
              </span>
            </>
          ) : (
            <>
              High-Velocity Software{" "}
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
                Capabilities
              </span>
            </>
          )}
        </h1>

        <p
          className="services-hero-desc"
          style={{
            fontSize: "clamp(13px, 1.35vw, 15px)",
            color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
            maxWidth: "1100px",
            margin: "0 auto 16px",
            lineHeight: 1.45,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            transition: "all 0.2s ease",
          }}
        >
          {activeCategory
            ? activeCategory.description
            : "Enterprise ERP platforms, universal licensing SDKs, and cloud systems engineered to scale."}
        </p>

        {/* Filter Tabs */}
        <div
          className="services-filter-tabs-wrap"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "5px 6px",
            borderRadius: "9999px",
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#ffffff",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
            boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(0, 0, 0, 0.04)",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >
          <button
            type="button"
            className="services-filter-btn"
            onClick={() => setActiveTab("all")}
            style={{
              padding: "8px 18px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              backgroundColor: activeTab === "all" ? "#2563eb" : "transparent",
              color: activeTab === "all"
                ? "#ffffff"
                : isDark
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(15, 23, 42, 0.7)",
              transition: "all 0.15s ease",
            }}
          >
            All Capabilities
          </button>
          {categories.map((cat) => {
            const isActive = activeTab === cat.slug;
            return (
              <button
                key={cat._id || cat.slug}
                type="button"
                className="services-filter-btn"
                onClick={() => setActiveTab(cat.slug)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: isActive ? "#2563eb" : "transparent",
                  color: isActive
                    ? "#ffffff"
                    : isDark
                    ? "rgba(255, 255, 255, 0.7)"
                    : "rgba(15, 23, 42, 0.7)",
                  transition: "all 0.15s ease",
                }}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Categories & Solutions Display */}
      <div
        className="services-content-wrap"
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto 80px",
          padding: "0 clamp(20px, 4vw, 64px)",
          display: "flex",
          flexDirection: "column",
          gap: "54px",
        }}
      >
        {activeTab === "all" ? (
          /* ONLY SHOW THE 5 CATEGORY CARDS IN ALL CAPABILITIES */
          <div
            className="services-categories-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "24px",
            }}
          >
            {categories.map((category) => {
              const subServices = category.services || [];
              const allTech = Array.from(
                new Set(subServices.flatMap((s) => s.techStack || []))
              ).slice(0, 6);

              return (
                <div
                  key={category._id || category.slug}
                  id={category.slug}
                  style={{
                    borderRadius: "20px",
                    padding: "24px",
                    backgroundColor: isDark ? "rgba(13, 19, 34, 0.8)" : "#ffffff",
                    border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                    boxShadow: isDark ? "none" : "0 4px 20px -2px rgba(0, 0, 0, 0.04)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all 0.25s ease",
                    cursor: "pointer",
                  }}
                  className="wsd-category-pillar-card"
                  onClick={() => setActiveTab(category.slug)}
                >
                  <div>
                    {/* Header: Icon + Badge + Count */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                      <div
                        className="wsd-card-icon-box"
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isDark ? "rgba(37, 99, 235, 0.18)" : "rgba(37, 99, 235, 0.1)",
                          color: "#3b82f6",
                        }}
                      >
                        <LucideIcon name={category.icon || "Code2"} size={22} color="#3b82f6" />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {category.badge && (
                          <span
                            className="wsd-badge-pill"
                            style={{
                              padding: "3px 10px",
                              borderRadius: "9999px",
                              fontSize: "11px",
                              fontWeight: 700,
                              backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#f1f5f9",
                              color: isDark ? "rgba(255, 255, 255, 0.85)" : "#334155",
                            }}
                          >
                            {category.badge}
                          </span>
                        )}
                        <span
                          className="wsd-count-text"
                          style={{
                            fontSize: "11.5px",
                            fontWeight: 600,
                            color: isDark ? "rgba(255, 255, 255, 0.45)" : "#64748b",
                          }}
                        >
                          {subServices.length} Solutions
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2
                      className="wsd-card-main-title"
                      style={{
                        fontSize: "19px",
                        fontWeight: 800,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.25,
                        margin: "0 0 8px",
                        color: isDark ? "#ffffff" : "#0f172a",
                      }}
                    >
                      {category.name}
                    </h2>

                    {/* Description */}
                    <p
                      className="wsd-card-main-desc"
                      style={{
                        fontSize: "13px",
                        lineHeight: 1.55,
                        color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
                        margin: "0 0 16px",
                      }}
                    >
                      {category.description}
                    </p>

                    {/* Specialized Solutions Pills */}
                    {subServices.length > 0 && (
                      <div className="wsd-solutions-preview" style={{ marginBottom: "14px" }}>
                        <div
                          className="wsd-section-lbl"
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            color: isDark ? "rgba(255, 255, 255, 0.45)" : "#64748b",
                            marginBottom: "8px",
                          }}
                        >
                          Specialized Solutions
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                          {subServices.slice(0, 4).map((sub, sIdx) => (
                            <span
                              key={sIdx}
                              className="wsd-preview-tag"
                              style={{
                                padding: "2.5px 8px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: 600,
                                backgroundColor: isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.06)",
                                color: "#3b82f6",
                                border: isDark ? "1px solid rgba(37, 99, 235, 0.25)" : "1px solid rgba(37, 99, 235, 0.15)",
                              }}
                            >
                              {sub.name}
                            </span>
                          ))}
                          {subServices.length > 4 && (
                            <span
                              className="wsd-preview-more"
                              style={{
                                padding: "2.5px 7px",
                                borderRadius: "6px",
                                fontSize: "11px",
                                fontWeight: 600,
                                color: isDark ? "rgba(255, 255, 255, 0.5)" : "#64748b",
                              }}
                            >
                              +{subServices.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tech Stack Pills */}
                    {allTech.length > 0 && (
                      <div className="wsd-tech-pills" style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "16px" }}>
                        {allTech.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            style={{
                              fontSize: "10.5px",
                              padding: "2px 7px",
                              borderRadius: "5px",
                              backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#f1f5f9",
                              color: isDark ? "#94a3b8" : "#475569",
                              border: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid #e2e8f0",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Button: Explore Category */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab(category.slug);
                    }}
                    style={{
                      width: "100%",
                      padding: "9px 14px",
                      borderRadius: "10px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "#ffffff",
                      backgroundColor: "#2563eb",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      boxShadow: "0 4px 14px -2px rgba(37, 99, 235, 0.3)",
                      transition: "all 0.15s ease",
                    }}
                    className="wsd-category-explore-btn"
                  >
                    <span className="wsd-cat-desktop">View {category.name} ({subServices.length} Solutions)</span>
                    <span className="wsd-cat-mobile">View Solutions</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          filteredCategories.map((category) => {
            const subServices = category.services || [];
            const allTech: string[] = Array.from(
              new Set(subServices.flatMap((s) => s.techStack || []))
            ).slice(0, 10);

            return (
              <section
                key={category._id || category.slug}
                id={category.slug}
                style={{
                  scrollMarginTop: "120px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                {/* Category Overview Card / Banner */}
                <div
                  className="wsd-category-banner"
                  style={{
                    padding: "24px 28px",
                    borderRadius: "20px",
                    backgroundColor: isDark ? "rgba(13, 19, 34, 0.85)" : "#ffffff",
                    border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                    boxShadow: isDark ? "none" : "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "20px",
                  }}
                >
                  <div style={{ maxWidth: "780px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                      <div
                        className="wsd-cat-icon-lg"
                        style={{
                          width: "42px",
                          height: "42px",
                          borderRadius: "12px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: isDark ? "rgba(37, 99, 235, 0.2)" : "rgba(37, 99, 235, 0.1)",
                          color: "#3b82f6",
                        }}
                      >
                        <LucideIcon name={category.icon || "Code2"} size={22} color="#3b82f6" />
                      </div>

                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <h2
                            style={{
                              fontSize: "clamp(20px, 2.5vw, 26px)",
                              fontWeight: 800,
                              letterSpacing: "-0.02em",
                              margin: 0,
                              color: isDark ? "#ffffff" : "#0f172a",
                            }}
                          >
                            {category.name}
                          </h2>
                          {category.badge && (
                            <span
                              style={{
                                padding: "3px 10px",
                                borderRadius: "9999px",
                                fontSize: "11px",
                                fontWeight: 700,
                                backgroundColor: isDark ? "rgba(37, 99, 235, 0.25)" : "rgba(37, 99, 235, 0.12)",
                                color: "#3b82f6",
                              }}
                            >
                              {category.badge}
                            </span>
                          )}
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: isDark ? "rgba(255, 255, 255, 0.45)" : "#64748b",
                            }}
                          >
                            ({subServices.length} Specialized Solutions)
                          </span>
                        </div>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.55,
                        color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
                        margin: "0 0 12px",
                      }}
                    >
                      {category.description}
                    </p>

                    {allTech.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {allTech.map((tech, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: "11px",
                              fontWeight: 500,
                              padding: "2px 8px",
                              borderRadius: "6px",
                              backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#f1f5f9",
                              color: isDark ? "#94a3b8" : "#475569",
                              border: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid #e2e8f0",
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openLeadServicesModal({
                        service: {
                          id: category._id || category.slug || category.name,
                          name: category.name,
                        },
                        initialStep: "details",
                      })
                    }
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 22px",
                      borderRadius: "9999px",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#ffffff",
                      backgroundColor: "#2563eb",
                      border: "none",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      boxShadow: "0 4px 14px -2px rgba(37, 99, 235, 0.35)",
                      transition: "transform 0.15s ease",
                    }}
                    className="wsd-consult-btn"
                  >
                    Consult on {category.name} <ArrowRight size={14} />
                  </button>
                </div>

                {/* Grid of ALL Specialized Solutions (Cards matching Navbar) */}
                <div
                  className="wsd-solutions-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                    gap: "20px",
                  }}
                >
                  {subServices.map((service, sIdx) => {
                    const isHighlighted = highlightedSlug === service.slug;

                    return (
                      <div
                        key={service._id || service.slug || sIdx}
                        id={service.slug}
                        style={{
                          scrollMarginTop: "140px",
                          borderRadius: "18px",
                          padding: "22px",
                          backgroundColor: isDark ? "rgba(13, 19, 34, 0.75)" : "#ffffff",
                          border: isHighlighted
                            ? "2px solid #3b82f6"
                            : isDark
                            ? "1px solid rgba(255, 255, 255, 0.08)"
                            : "1px solid #e2e8f0",
                          boxShadow: isHighlighted
                            ? "0 0 24px rgba(37, 99, 235, 0.35)"
                            : isDark
                            ? "none"
                            : "0 4px 16px -2px rgba(0, 0, 0, 0.04)",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          transition: "all 0.25s ease",
                        }}
                        className={`wsd-solution-card ${isHighlighted ? "highlighted-card" : ""}`}
                      >
                        <div>
                          {/* Header: Icon + Title + Short Tagline */}
                          <div className="wsd-solution-header" style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
                            <div
                              className="wsd-solution-icon"
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: isDark ? "rgba(37, 99, 235, 0.15)" : "rgba(37, 99, 235, 0.08)",
                                color: "#3b82f6",
                                flexShrink: 0,
                              }}
                            >
                              <LucideIcon name={service.icon || "Code2"} size={20} color="#3b82f6" />
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <h3
                                className="wsd-solution-title"
                                style={{
                                  fontSize: "17px",
                                  fontWeight: 700,
                                  lineHeight: 1.3,
                                  margin: "0 0 4px",
                                  color: isDark ? "#ffffff" : "#0f172a",
                                }}
                              >
                                {service.name}
                              </h3>
                              {service.shortDescription && (
                                <div
                                  className="wsd-solution-tagline"
                                  style={{
                                    fontSize: "12.5px",
                                    fontWeight: 600,
                                    color: "#3b82f6",
                                    lineHeight: 1.35,
                                  }}
                                >
                                  {service.shortDescription}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Detailed Description */}
                          <p
                            className="wsd-solution-desc"
                            style={{
                              fontSize: "13px",
                              lineHeight: 1.55,
                              color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
                              margin: "0 0 16px",
                            }}
                          >
                            {service.description}
                          </p>

                          {/* Key Architecture & Deliverables Checklist */}
                          {service.deliverables && service.deliverables.length > 0 && (
                            <div
                              className="wsd-deliverables-box"
                              style={{
                                padding: "12px 14px",
                                borderRadius: "12px",
                                backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#f8fafc",
                                border: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid #f1f5f9",
                                marginBottom: "14px",
                              }}
                            >
                              <div
                                className="wsd-deliverables-title"
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.04em",
                                  color: isDark ? "rgba(255, 255, 255, 0.45)" : "#64748b",
                                  marginBottom: "8px",
                                }}
                              >
                                Deliverables &amp; Architecture
                              </div>

                              <div className="wsd-deliverables-list" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {service.deliverables.map((del, dIdx) => (
                                  <div key={dIdx} className={`wsd-del-item ${dIdx >= 2 ? "wsd-del-extra" : ""}`} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                                    <CheckCircle2 size={13} style={{ color: "#10b981", flexShrink: 0, marginTop: "2px" }} />
                                    <span
                                      className="wsd-del-text"
                                      style={{
                                        fontSize: "12px",
                                        color: isDark ? "rgba(255, 255, 255, 0.85)" : "#334155",
                                        lineHeight: 1.4,
                                      }}
                                    >
                                      {del}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tech Stack Pills */}
                          {service.techStack && service.techStack.length > 0 && (
                            <div className="wsd-solution-tech" style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "16px" }}>
                              {service.techStack.map((tech, tIdx) => (
                                <span
                                  key={tIdx}
                                  style={{
                                    fontSize: "10.5px",
                                    fontWeight: 500,
                                    padding: "2px 7px",
                                    borderRadius: "5px",
                                    backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#f1f5f9",
                                    color: isDark ? "#94a3b8" : "#475569",
                                    border: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid #e2e8f0",
                                  }}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Card Action Button */}
                        <button
                          type="button"
                          onClick={() =>
                            openLeadServicesModal({
                              service: {
                                id: service._id || service.slug || service.name,
                                name: `${category.name} - ${service.name}`,
                              },
                              initialStep: "details",
                            })
                          }
                          style={{
                            width: "100%",
                            padding: "10px 16px",
                            borderRadius: "10px",
                            fontSize: "13px",
                            fontWeight: 600,
                            color: "#ffffff",
                            backgroundColor: "#2563eb",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                            marginTop: "auto",
                            boxShadow: "0 4px 12px -2px rgba(37, 99, 235, 0.25)",
                            transition: "all 0.15s ease",
                          }}
                          className="wsd-solution-cta"
                        >
                          <span className="wsd-cta-desktop">Request Scope for {service.name}</span>
                          <span className="wsd-cta-mobile">Request Scope</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })
        )}
      </div>

      {/* Engineering Delivery Process Section */}
      <div className="services-methodology-wrap" style={{ width: "100%", maxWidth: "100%", margin: "0 auto 80px", padding: "0 clamp(20px, 4vw, 64px)" }}>
        <div className="services-methodology-header" style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            className="services-methodology-title"
            style={{
              fontSize: "clamp(26px, 4vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "12px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Our Engineering Methodology
          </h2>
          <p className="services-methodology-desc" style={{ fontSize: "15px", color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b", maxWidth: "600px", margin: "0 auto" }}>
            A disciplined, transparent delivery framework from technical discovery through continuous cloud operations.
          </p>
        </div>

        <div
          className="services-methodology-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
          }}
        >
          {processSteps.map((step, sIdx) => (
            <div
              key={sIdx}
              className="services-methodology-card"
              style={{
                borderRadius: "20px",
                padding: "24px 20px",
                backgroundColor: isDark ? "rgba(13, 19, 34, 0.6)" : "#ffffff",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                position: "relative",
              }}
            >
              <div
                className="services-methodology-number"
                style={{
                  fontSize: "32px",
                  fontWeight: 900,
                  color: isDark ? "rgba(37, 99, 235, 0.3)" : "rgba(37, 99, 235, 0.2)",
                  lineHeight: 1,
                  marginBottom: "12px",
                }}
              >
                {step.number}
              </div>
              <h3 className="services-methodology-step-title" style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px", color: isDark ? "#ffffff" : "#0f172a" }}>
                {step.title}
              </h3>
              <p className="services-methodology-step-desc" style={{ fontSize: "13px", lineHeight: 1.55, color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b" }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Banner */}
      <div className="services-cta-wrap" style={{ width: "100%", maxWidth: "100%", margin: "0 auto", padding: "0 clamp(20px, 4vw, 64px)" }}>
        <div
          className="services-cta-banner"
          style={{
            padding: "56px clamp(24px, 5vw, 64px)",
            borderRadius: "28px",
            textAlign: "center",
            background: isDark
              ? "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(13, 19, 34, 0.8) 100%)"
              : "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, #ffffff 100%)",
            border: isDark ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(37, 99, 235, 0.15)",
          }}
        >
          <h2
            className="services-cta-title"
            style={{
              fontSize: "clamp(24px, 3.5vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "14px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Ready to build your next digital platform?
          </h2>
          <p
            className="services-cta-desc"
            style={{
              fontSize: "15px",
              color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
              maxWidth: "600px",
              margin: "0 auto 28px",
              lineHeight: 1.6,
            }}
          >
            Tell us about your requirements and our senior engineering team will provide a tailored scope and architecture plan.
          </p>

          <div
            className="services-bottom-cta-actions"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              className="services-cta-btn"
              onClick={() =>
                openLeadServicesModal(
                  activeCategory
                    ? {
                        service: {
                          id: activeCategory._id || activeCategory.slug || activeCategory.name,
                          name: activeCategory.name,
                        },
                        initialStep: "details",
                      }
                    : undefined
                )
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 32px",
                borderRadius: "9999px",
                fontSize: "14.5px",
                fontWeight: 700,
                color: "#ffffff",
                background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 8px 24px -4px rgba(37, 99, 235, 0.4)",
                transition: "all 0.15s ease",
              }}
            >
              {activeCategory
                ? `Request Scope for ${activeCategory.name}`
                : "Request Architecture Scope"}{" "}
              <ArrowRight size={16} />
            </button>

            <Link
              href="/portfolio"
              className="services-cta-secondary-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "13px 26px",
                borderRadius: "9999px",
                fontSize: "14.5px",
                fontWeight: 600,
                color: isDark ? "#ffffff" : "#0f172a",
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#ffffff",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #cbd5e1",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              Explore Case Studies
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .wsd-cta-mobile,
        .wsd-cat-mobile {
          display: none;
        }
        .wsd-cta-desktop,
        .wsd-cat-desktop {
          display: inline;
        }

        .wsd-solution-card:hover {
          border-color: rgba(37, 99, 235, 0.45) !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -6px rgba(37, 99, 235, 0.15) !important;
        }

        .highlighted-card {
          animation: pulseBorder 2s infinite ease-in-out;
        }

        @keyframes pulseBorder {
          0%, 100% {
            border-color: #3b82f6;
            box-shadow: 0 0 16px rgba(59, 130, 246, 0.4);
          }
          50% {
            border-color: #06b6d4;
            box-shadow: 0 0 26px rgba(6, 182, 212, 0.5);
          }
        }

        .wsd-consult-btn:hover,
        .wsd-solution-cta:hover {
          background-color: #1d4ed8 !important;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .wsd-cta-mobile,
          .wsd-cat-mobile {
            display: inline !important;
          }
          .wsd-cta-desktop,
          .wsd-cat-desktop {
            display: none !important;
          }

          .wsd-services-page {
            padding-top: 72px !important;
            padding-bottom: 24px !important;
          }

          .services-hero-wrap,
          .services-content-wrap,
          .services-methodology-wrap,
          .services-cta-wrap {
            padding: 0 10px !important;
          }

          .services-hero-title {
            font-size: 20px !important;
            line-height: 1.15 !important;
            margin-bottom: 6px !important;
          }

          .services-hero-desc {
            font-size: 11px !important;
            line-height: 1.35 !important;
            margin-bottom: 12px !important;
          }

          .services-hero-actions {
            gap: 6px !important;
            margin-bottom: 14px !important;
          }

          .services-hero-primary-btn,
          .services-hero-secondary-btn {
            padding: 7px 16px !important;
            font-size: 11.5px !important;
          }

          .services-filter-tabs-wrap {
            gap: 4px !important;
            margin-bottom: 18px !important;
          }

          .services-filter-btn {
            padding: 5px 10px !important;
            font-size: 11px !important;
          }

          .wsd-category-banner {
            padding: 14px 12px !important;
            border-radius: 14px !important;
            gap: 10px !important;
          }

          /* 2 Cards per Row in Mobile View */
          .services-categories-grid,
          .wsd-solutions-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px !important;
          }

          .wsd-category-pillar-card,
          .wsd-solution-card {
            padding: 12px 10px !important;
            border-radius: 14px !important;
          }

          .wsd-card-icon-box,
          .wsd-solution-icon {
            width: 32px !important;
            height: 32px !important;
            border-radius: 8px !important;
          }

          .wsd-card-icon-box svg,
          .wsd-solution-icon svg {
            width: 16px !important;
            height: 16px !important;
          }

          .wsd-solution-header {
            gap: 8px !important;
            margin-bottom: 8px !important;
          }

          .wsd-card-main-title,
          .wsd-solution-title {
            font-size: 13px !important;
            line-height: 1.25 !important;
            margin-bottom: 2px !important;
          }

          .wsd-solution-tagline {
            font-size: 10px !important;
            line-height: 1.25 !important;
          }

          .wsd-card-main-desc,
          .wsd-solution-desc {
            font-size: 10px !important;
            line-height: 1.35 !important;
            margin: 0 0 8px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }

          .wsd-deliverables-box {
            padding: 7px 8px !important;
            border-radius: 8px !important;
            margin-bottom: 8px !important;
          }

          .wsd-deliverables-title,
          .wsd-section-lbl {
            font-size: 9px !important;
            margin-bottom: 4px !important;
          }

          .wsd-del-item {
            gap: 5px !important;
          }

          .wsd-del-text {
            font-size: 9px !important;
            line-height: 1.25 !important;
          }

          .wsd-del-extra {
            display: none !important;
          }

          .wsd-preview-tag {
            font-size: 9px !important;
            padding: 1.5px 5px !important;
          }

          .wsd-preview-more {
            font-size: 9px !important;
          }

          .wsd-solution-tech,
          .wsd-tech-pills {
            gap: 3px !important;
            margin-bottom: 8px !important;
          }

          .wsd-solution-tech span,
          .wsd-tech-pills span {
            font-size: 8px !important;
            padding: 1px 4px !important;
          }

          .wsd-category-explore-btn,
          .wsd-solution-cta {
            padding: 7px 8px !important;
            font-size: 10px !important;
            border-radius: 8px !important;
            gap: 4px !important;
          }

          .services-methodology-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px !important;
          }

          .services-methodology-card {
            padding: 12px 10px !important;
            border-radius: 12px !important;
          }

          .services-methodology-number {
            font-size: 20px !important;
            margin-bottom: 6px !important;
          }

          .services-methodology-step-title {
            font-size: 12px !important;
            margin-bottom: 4px !important;
          }

          .services-methodology-step-desc {
            font-size: 9.5px !important;
            line-height: 1.35 !important;
          }

          .services-cta-banner {
            padding: 24px 16px !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#3b82f6", fontWeight: 600 }}>Loading Services...</div>
        </div>
      }
    >
      <ServicesContent />
    </Suspense>
  );
}
