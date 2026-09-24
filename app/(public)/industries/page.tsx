"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Layers,
  Sparkles,
} from "lucide-react";
import { usePublicTheme } from "@/app/providers/PublicThemeProvider";
import { useLeadFunnel } from "@/app/providers/LeadFunnelProvider";
import { getPublicIndustries } from "@/lib/cms/cmsService";
import type { CmsIndustry } from "@/lib/cms/types";
import LucideIcon from "@/components/shared/LucideIcon";

function IndustriesContent() {
  const { publicTheme } = usePublicTheme();
  const isDark = publicTheme === "dark";
  const { openLeadServicesModal } = useLeadFunnel();
  const searchParams = useSearchParams();

  const [industries, setIndustries] = useState<CmsIndustry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlug, setActiveSlug] = useState<string>("");

  const sectorParam = searchParams.get("sector")?.toLowerCase();

  useEffect(() => {
    let isCancelled = false;
    async function loadIndustries() {
      try {
        setLoading(true);
        const data = await getPublicIndustries();
        if (!isCancelled) {
          const list = Array.isArray(data) ? data : [];
          setIndustries(list);
          if (list.length > 0) {
            if (sectorParam && list.some((ind) => ind.slug === sectorParam)) {
              setActiveSlug(sectorParam);
            } else {
              setActiveSlug(list[0].slug);
            }
          }
        }
      } catch (err) {
        console.error("Error loading industries:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    loadIndustries();
    return () => {
      isCancelled = true;
    };
  }, [sectorParam]);

  const current = industries.find((i) => i.slug === activeSlug) || industries[0];

  return (
    <div
      className="wsd-industries-page"
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        color: isDark ? "#f8fafc" : "#0f172a",
        paddingTop: "36px",
        paddingBottom: "50px",
      }}
    >
      {/* Hero Header */}
      <div
        className="industries-hero-wrap"
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0 clamp(16px, 3.5vw, 48px)",
          textAlign: "center",
        }}
      >

        <h1
          className="industries-hero-title"
          style={{
            fontSize: "clamp(26px, 3.8vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "12px",
          }}
        >
          Engineered for{" "}
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
            Mission-Critical
          </span>{" "}
          Industries
        </h1>

        <p
          className="industries-hero-desc"
          style={{
            fontSize: "clamp(13.5px, 1.4vw, 15px)",
            color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
            maxWidth: "680px",
            margin: "0 auto 20px",
            lineHeight: 1.55,
          }}
        >
          From high-frequency financial ledgers and HIPAA-compliant telemedicine to multi-tenant SaaS and automated supply chains, explore how WebSmith architects domain-specific software platforms.
        </p>

        {/* Sector Navigation Tabs - Styled unified pill capsule like Services */}
        {loading ? (
          <div
            className="industries-tabs-wrap"
            style={{
              display: "inline-flex",
              justifyContent: "center",
              gap: "6px",
              padding: "5px 6px",
              borderRadius: "9999px",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#ffffff",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
              boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(0, 0, 0, 0.04)",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                style={{
                  width: "110px",
                  height: "32px",
                  borderRadius: "9999px",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#e2e8f0",
                  animation: "pulse 1.5s infinite",
                }}
              />
            ))}
          </div>
        ) : (
          <div
            className="industries-tabs-wrap"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "6px",
              padding: "5px 6px",
              borderRadius: "9999px",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#ffffff",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
              boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(0, 0, 0, 0.04)",
              marginBottom: "24px",
            }}
          >
            {industries.map((item) => {
              const isSelected = activeSlug === item.slug;
              return (
                <button
                  key={item._id || item.slug}
                  onClick={() => setActiveSlug(item.slug)}
                  type="button"
                  className="industries-tab-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "7px 16px",
                    borderRadius: "9999px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    backgroundColor: isSelected ? "#2563eb" : "transparent",
                    color: isSelected
                      ? "#ffffff"
                      : isDark
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(15, 23, 42, 0.7)",
                  }}
                >
                  <LucideIcon
                    name={item.icon || "Building2"}
                    size={15}
                    color={isSelected ? "#ffffff" : isDark ? "rgba(255, 255, 255, 0.7)" : "currentColor"}
                  />
                  {item.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Sector Spotlight */}
      {current && (
        <div
          className="industries-spotlight-wrap"
          style={{
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto 36px",
            padding: "0 clamp(16px, 3.5vw, 48px)",
          }}
        >
          <div
            className="industries-spotlight-card"
            style={{
              padding: "clamp(20px, 3vw, 36px)",
              borderRadius: "22px",
              backgroundColor: isDark ? "rgba(13, 19, 34, 0.85)" : "#ffffff",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
              boxShadow: isDark
                ? "0 20px 50px -12px rgba(0, 0, 0, 0.7)"
                : "0 14px 34px -8px rgba(0, 0, 0, 0.06)",
            }}
          >
            {/* Header Row */}
            <div
              className="industries-spotlight-header"
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                marginBottom: "20px",
                paddingBottom: "18px",
                borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #f1f5f9",
              }}
            >
              <div className="industries-spotlight-header-left" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  className="industries-spotlight-icon"
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    flexShrink: 0,
                    boxShadow: "0 6px 16px -3px rgba(37, 99, 235, 0.4)",
                  }}
                >
                  <LucideIcon name={current.icon || "Building2"} size={22} color="#ffffff" />
                </div>
                <div>
                  {current.badge && (
                    <span
                      className="industries-spotlight-badge"
                      style={{
                        display: "inline-block",
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: isDark ? "rgba(37, 99, 235, 0.2)" : "rgba(37, 99, 235, 0.1)",
                        color: "#3b82f6",
                        marginBottom: "4px",
                      }}
                    >
                      {current.badge}
                    </span>
                  )}
                  <h2
                    className="industries-spotlight-headline"
                    style={{
                      fontSize: "clamp(18px, 2.5vw, 26px)",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      margin: 0,
                      color: isDark ? "#ffffff" : "#0f172a",
                    }}
                  >
                    {current.headline || current.name}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                className="industries-spotlight-cta-btn"
                onClick={() =>
                  openLeadServicesModal({
                    service: {
                      id: current.slug || current.name.toLowerCase().replace(/\s+/g, "-"),
                      name: `${current.name} Industry Architecture`,
                    },
                    initialStep: "details",
                  })
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "7px",
                  padding: "9px 20px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ffffff",
                  background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                  border: "none",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px -2px rgba(37, 99, 235, 0.35)",
                }}
              >
                Consult Industry Lead <ArrowRight size={14} />
              </button>
            </div>

            <p
              className="industries-spotlight-desc"
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: isDark ? "rgba(255, 255, 255, 0.75)" : "#475569",
                maxWidth: "960px",
                marginBottom: "24px",
              }}
            >
              {current.description || current.shortDescription}
            </p>

            {/* Performance Stats Cards */}
            {Array.isArray(current.stats) && current.stats.length > 0 && (
              <div
                className="industries-stats-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "12px",
                  marginBottom: "28px",
                }}
              >
                {current.stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="industries-stat-card"
                    style={{
                      padding: "14px 12px",
                      borderRadius: "12px",
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#f8fafc",
                      border: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid #e2e8f0",
                      textAlign: "center",
                    }}
                  >
                    <div
                      className="industries-stat-value"
                      style={{
                        fontSize: "22px",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        color: isDark ? "#ffffff" : "#0f172a",
                        marginBottom: "3px",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="industries-stat-label"
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 500,
                        color: isDark ? "rgba(255, 255, 255, 0.5)" : "#64748b",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Two-Column Detail Grid: Architecture & Challenges */}
            <div
              className="industries-details-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
                marginBottom: "28px",
              }}
            >
              {/* Architecture Highlights */}
              {Array.isArray(current.architecture) && current.architecture.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <Layers size={18} color="#3b82f6" />
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        margin: 0,
                        color: isDark ? "#ffffff" : "#0f172a",
                      }}
                    >
                      Platform Architecture
                    </h3>
                  </div>
                  <div className="industries-arch-list" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {current.architecture.map((item, idx) => (
                      <div
                        key={idx}
                        className="industries-arch-item"
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                          padding: "10px 12px",
                          borderRadius: "10px",
                          backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#f8fafc",
                          border: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid #e2e8f0",
                        }}
                      >
                        <CheckCircle2 size={16} color="#10b981" style={{ marginTop: "2px", flexShrink: 0 }} />
                        <span
                          style={{
                            fontSize: "12.5px",
                            lineHeight: 1.45,
                            color: isDark ? "rgba(255, 255, 255, 0.75)" : "#334155",
                          }}
                        >
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Core Challenges Solved */}
              {Array.isArray(current.challenges) && current.challenges.length > 0 && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <ShieldCheck size={18} color="#3b82f6" />
                    <h3
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        margin: 0,
                        color: isDark ? "#ffffff" : "#0f172a",
                      }}
                    >
                      Domain Challenges Solved
                    </h3>
                  </div>
                  <div className="industries-challenge-list" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {current.challenges.map((c, idx) => (
                      <div
                        key={idx}
                        className="industries-challenge-item"
                        style={{
                          padding: "10px 12px",
                          borderRadius: "10px",
                          backgroundColor: isDark ? "rgba(255, 255, 255, 0.02)" : "#f8fafc",
                          border: isDark ? "1px solid rgba(255, 255, 255, 0.05)" : "1px solid #e2e8f0",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: "#ef4444",
                            marginBottom: "3px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.04em", opacity: 0.8 }}>Challenge:</span>
                          {c.problem}
                        </div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
                            lineHeight: 1.4,
                          }}
                        >
                          <strong style={{ color: "#10b981", fontWeight: 600 }}>Engineered Resolution: </strong>
                          {c.solution}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Case Study & Tech Stack Strip */}
            {(current.caseStudy || (Array.isArray(current.techStack) && current.techStack.length > 0)) && (
              <div
                className="industries-strip-wrap"
                style={{
                  padding: "16px 18px",
                  borderRadius: "14px",
                  backgroundColor: isDark ? "rgba(37, 99, 235, 0.08)" : "rgba(37, 99, 235, 0.04)",
                  border: isDark ? "1px solid rgba(37, 99, 235, 0.2)" : "1px solid rgba(37, 99, 235, 0.15)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "18px",
                  alignItems: "center",
                }}
              >
                {current.caseStudy && (
                  <div className="industries-case-study">
                    <div
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: "#3b82f6",
                        marginBottom: "3px",
                      }}
                    >
                      Production Case Study
                    </div>
                    <div
                      style={{
                        fontSize: "14.5px",
                        fontWeight: 700,
                        color: isDark ? "#ffffff" : "#0f172a",
                        marginBottom: "3px",
                      }}
                    >
                      {current.caseStudy.client}
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
                        lineHeight: 1.45,
                        marginBottom: "6px",
                      }}
                    >
                      {current.caseStudy.summary}
                    </div>
                    <div
                      style={{
                        fontSize: "11.5px",
                        fontWeight: 600,
                        color: "#10b981",
                      }}
                    >
                      Result: {current.caseStudy.metrics}
                    </div>
                  </div>
                )}

                {Array.isArray(current.techStack) && current.techStack.length > 0 && (
                  <div className="industries-tech-stack">
                    <div
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: isDark ? "rgba(255, 255, 255, 0.5)" : "#64748b",
                        marginBottom: "8px",
                      }}
                    >
                      Primary Technology Stack
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {current.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="industries-tech-chip"
                          style={{
                            padding: "3px 10px",
                            borderRadius: "9999px",
                            fontSize: "11.5px",
                            fontWeight: 600,
                            backgroundColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#ffffff",
                            border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #cbd5e1",
                            color: isDark ? "#f8fafc" : "#1e293b",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Global Consultation CTA Banner */}
      <div
        className="industries-cta-wrap"
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0 clamp(16px, 3.5vw, 48px)",
        }}
      >
        <div
          className="industries-cta-banner"
          style={{
            padding: "32px clamp(20px, 4vw, 44px)",
            borderRadius: "20px",
            textAlign: "center",
            background: isDark
              ? "linear-gradient(135deg, rgba(37, 99, 235, 0.2) 0%, rgba(13, 19, 34, 0.85) 100%)"
              : "linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, #ffffff 100%)",
            border: isDark ? "1px solid rgba(37, 99, 235, 0.35)" : "1px solid rgba(37, 99, 235, 0.2)",
          }}
        >
          <h2
            className="industries-cta-title"
            style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "10px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Have a specialized industry challenge?
          </h2>
          <p
            className="industries-cta-desc"
            style={{
              fontSize: "13.5px",
              color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
              maxWidth: "560px",
              margin: "0 auto 20px",
              lineHeight: 1.55,
            }}
          >
            Book a direct consultation with our principal domain architects to evaluate your architecture, compliance requirements, and delivery milestones.
          </p>
          <div
            className="industries-cta-actions"
            style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}
          >
            <button
              type="button"
              className="industries-cta-primary-btn"
              onClick={() => openLeadServicesModal()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "9px 22px",
                borderRadius: "9999px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#ffffff",
                background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 6px 18px -3px rgba(37, 99, 235, 0.4)",
              }}
            >
              Start Architecture Consultation <ArrowRight size={14} />
            </button>
            <Link
              href="/portfolio"
              className="industries-cta-secondary-btn"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                padding: "9px 20px",
                borderRadius: "9999px",
                fontSize: "13px",
                fontWeight: 600,
                color: isDark ? "#ffffff" : "#0f172a",
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#ffffff",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #cbd5e1",
                textDecoration: "none",
              }}
            >
              Browse Case Studies
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        /* ============================================================
           MOBILE VIEW: ULTRA-COMPACT & STREAMLINED (<= 768px)
           ============================================================ */
        @media (max-width: 768px) {
          /* Fixed mobile navbar clearance */
          .wsd-industries-page {
            padding-top: 70px !important;
            padding-bottom: 20px !important;
          }

          .industries-hero-wrap,
          .industries-spotlight-wrap,
          .industries-cta-wrap {
            padding: 0 8px !important;
          }

          /* Hero header compact */
          .industries-hero-title {
            font-size: 17px !important;
            line-height: 1.18 !important;
            margin-bottom: 4px !important;
          }

          .industries-hero-desc {
            font-size: 10px !important;
            line-height: 1.3 !important;
            margin-bottom: 8px !important;
          }

          /* TABS WRAP: All in screen without overflow or horizontal scroll like services */
          .industries-tabs-wrap {
            width: 100% !important;
            overflow-x: visible !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            padding: 4px 6px !important;
            margin-bottom: 12px !important;
            gap: 4px !important;
            border-radius: 12px !important;
          }

          .industries-tabs-wrap::-webkit-scrollbar {
            display: none !important;
          }

          .industries-tab-btn {
            padding: 3.5px 8px !important;
            font-size: 9.5px !important;
            font-weight: 600 !important;
            border-radius: 6px !important;
            white-space: normal !important;
            flex-shrink: 0 !important;
            text-align: center !important;
            gap: 4px !important;
          }

          .industries-tab-btn svg {
            width: 11px !important;
            height: 11px !important;
          }

          /* Main Sector Spotlight Card */
          .industries-spotlight-wrap {
            margin-bottom: 14px !important;
          }

          .industries-spotlight-card {
            padding: 10px 8px !important;
            border-radius: 12px !important;
          }

          .industries-spotlight-header {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 6px !important;
            margin-bottom: 8px !important;
            padding-bottom: 8px !important;
          }

          .industries-spotlight-header-left {
            gap: 8px !important;
          }

          .industries-spotlight-icon {
            width: 30px !important;
            height: 30px !important;
            border-radius: 7px !important;
          }

          .industries-spotlight-icon svg {
            width: 15px !important;
            height: 15px !important;
          }

          .industries-spotlight-badge {
            font-size: 8.5px !important;
            padding: 1px 5px !important;
            margin-bottom: 2px !important;
          }

          .industries-spotlight-headline {
            font-size: 13.5px !important;
            font-weight: 700 !important;
            line-height: 1.25 !important;
          }

          .industries-spotlight-cta-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 5px 10px !important;
            font-size: 11px !important;
            border-radius: 7px !important;
            gap: 4px !important;
          }

          .industries-spotlight-cta-btn svg {
            width: 12px !important;
            height: 12px !important;
          }

          .industries-spotlight-desc {
            font-size: 10.5px !important;
            line-height: 1.35 !important;
            margin-bottom: 8px !important;
          }

          /* All 4 stats in one neat row */
          .industries-stats-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
            gap: 4px !important;
            margin-bottom: 10px !important;
          }

          .industries-stat-card {
            padding: 5px 2px !important;
            border-radius: 6px !important;
          }

          .industries-stat-value {
            font-size: 12px !important;
            font-weight: 800 !important;
            margin-bottom: 0px !important;
            line-height: 1.2 !important;
          }

          .industries-stat-label {
            font-size: 8.5px !important;
            line-height: 1.15 !important;
          }

          /* Two-column detail grids collapse compactly */
          .industries-details-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
            margin-bottom: 10px !important;
          }

          .industries-details-grid h3 {
            font-size: 11.5px !important;
            margin-bottom: 5px !important;
          }

          .industries-details-grid svg {
            width: 14px !important;
            height: 14px !important;
          }

          /* Platform Architecture in 2x2 compact grid on mobile */
          .industries-arch-list {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 4px !important;
          }

          .industries-arch-item {
            padding: 5px 6px !important;
            border-radius: 6px !important;
            gap: 5px !important;
            align-items: center !important;
          }

          .industries-arch-item svg {
            width: 12px !important;
            height: 12px !important;
            flex-shrink: 0 !important;
            margin-top: 0 !important;
          }

          .industries-arch-item span {
            font-size: 9.5px !important;
            line-height: 1.25 !important;
          }

          /* Domain Challenges list compact */
          .industries-challenge-list {
            display: flex !important;
            flex-direction: column !important;
            gap: 4px !important;
          }

          .industries-challenge-item {
            padding: 5px 7px !important;
            border-radius: 6px !important;
          }

          .industries-challenge-item div {
            font-size: 9.5px !important;
            line-height: 1.25 !important;
          }

          .industries-challenge-item span {
            font-size: 8.5px !important;
          }

          /* Case Study & Tech Stack Strip */
          .industries-strip-wrap {
            padding: 7px 8px !important;
            border-radius: 8px !important;
            gap: 6px !important;
            grid-template-columns: 1fr !important;
          }

          .industries-case-study div {
            font-size: 9.5px !important;
            line-height: 1.25 !important;
          }

          .industries-case-study div:first-child {
            font-size: 8.5px !important;
            margin-bottom: 1px !important;
          }

          .industries-case-study div:nth-child(2) {
            font-size: 11px !important;
            margin-bottom: 2px !important;
          }

          .industries-tech-stack div:first-child {
            font-size: 8.5px !important;
            margin-bottom: 4px !important;
          }

          .industries-tech-chip {
            padding: 1px 6px !important;
            font-size: 9px !important;
            border-radius: 4px !important;
          }

          /* Global Consultation CTA Banner */
          .industries-cta-banner {
            padding: 12px 10px !important;
            border-radius: 10px !important;
          }

          .industries-cta-title {
            font-size: 13.5px !important;
            margin-bottom: 2px !important;
          }

          .industries-cta-desc {
            font-size: 10px !important;
            line-height: 1.3 !important;
            margin-bottom: 8px !important;
          }

          .industries-cta-actions {
            flex-direction: row !important;
            gap: 6px !important;
          }

          .industries-cta-primary-btn,
          .industries-cta-secondary-btn {
            flex: 1 !important;
            justify-content: center !important;
            padding: 5px 8px !important;
            font-size: 10px !important;
            border-radius: 6px !important;
            white-space: nowrap !important;
          }

          .industries-cta-actions svg {
            width: 12px !important;
            height: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function IndustriesPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ color: "#3b82f6", fontWeight: 600 }}>Loading Industries...</div>
        </div>
      }
    >
      <IndustriesContent />
    </Suspense>
  );
}
