"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Briefcase, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import { getPublishedProjects, Project } from "../projects/services/projectService";
import { usePublicTheme } from "../providers/PublicThemeProvider";
import { useLeadFunnel } from "../providers/LeadFunnelProvider";

export default function PortfolioPage() {
  const { publicTheme } = usePublicTheme();
  const isDark = publicTheme === "dark";
  const { openLeadServicesModal } = useLeadFunnel();

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileLayout, setMobileLayout] = useState<"compact-grid" | "compact-list">("compact-grid");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    async function loadProjects() {
      try {
        setLoading(true);
        const data = await getPublishedProjects();
        if (!isCancelled) {
          setProjects(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch published projects:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }
    loadProjects();
    return () => {
      isCancelled = true;
    };
  }, []);

  // Dynamically derive category pills from database projects
  const uniqueCategories = Array.from(
    new Set(projects.map((p) => p.category?.trim()).filter(Boolean))
  ) as string[];

  const categories = ["All", ...uniqueCategories];

  const filteredProjects = projects.filter((project) => {
    const projectCat = project.category || "General";
    const matchesCategory = activeCategory === "All" || projectCat.toLowerCase() === activeCategory.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      query === "" ||
      project.name.toLowerCase().includes(query) ||
      (project.description && project.description.toLowerCase().includes(query)) ||
      (project.clientCompany && project.clientCompany.toLowerCase().includes(query)) ||
      (project.client && project.client.toLowerCase().includes(query)) ||
      (project.techStack && project.techStack.some((t) => t.toLowerCase().includes(query)));
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      className="wsd-portfolio-page"
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        color: isDark ? "#f8fafc" : "#0f172a",
        paddingTop: "24px",
        paddingBottom: "50px",
      }}
    >
      {/* Hero Header */}
      <div className="portfolio-hero-wrap" style={{ width: "100%", maxWidth: "100%", margin: "0 auto", padding: "0 clamp(16px, 3.5vw, 48px)", textAlign: "center" }}>
        <h1
          className="portfolio-hero-title"
          style={{
            fontSize: "clamp(26px, 3.8vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "10px",
          }}
        >
          Engineered for Scale &amp;{" "}
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
            Measurable Impact
          </span>
        </h1>

        <p
          className="portfolio-hero-desc"
          style={{
            fontSize: "clamp(13.5px, 1.4vw, 15px)",
            color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(100, 116, 139, 0.9)",
            maxWidth: "680px",
            margin: "0 auto 20px",
            lineHeight: 1.55,
          }}
        >
          Explore selected client launches, enterprise ERP systems, and cloud architectures built with precision, speed, and rock-solid reliability.
        </p>

        {/* Filter Bar & Search */}
        <div
          className="portfolio-filter-bar"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            padding: "10px 16px",
            borderRadius: "14px",
            backgroundColor: isDark ? "rgba(255, 255, 255, 0.03)" : "#ffffff",
            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
            boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(0, 0, 0, 0.04)",
            marginBottom: "28px",
            width: "100%",
          }}
        >
          {/* Category Tabs */}
          <div className="portfolio-category-tabs" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            {categories.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className="portfolio-category-btn"
                  style={{
                    padding: "7px 16px",
                    borderRadius: "9999px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: isActive
                      ? "#2563eb"
                      : isDark
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(0, 0, 0, 0.04)",
                    color: isActive
                      ? "#ffffff"
                      : isDark
                      ? "rgba(255, 255, 255, 0.7)"
                      : "rgba(15, 23, 42, 0.7)",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box & Mobile View Mode Toggle */}
          <div className="portfolio-search-and-toggle" style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "260px" }}>
            <div className="portfolio-search-box" style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <Search
                size={14}
                style={{
                  position: "absolute",
                  left: "11px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(100, 116, 139, 0.7)",
                }}
              />
              <input
                type="text"
                placeholder="Search technologies, clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="portfolio-search-input"
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 32px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#f1f5f9",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #cbd5e1",
                  color: isDark ? "#ffffff" : "#0f172a",
                  outline: "none",
                }}
              />
            </div>

            {/* Mobile Layout Mode Switcher (2-Column Grid vs Compact List) */}
            <div className="portfolio-layout-toggle" style={{ display: "flex", alignItems: "center", gap: "2px", backgroundColor: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9", padding: "2px", borderRadius: "8px", border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0" }}>
              <button
                type="button"
                onClick={() => setMobileLayout("compact-grid")}
                aria-label="2-Column Compact Grid View"
                title="2-Column Compact Grid"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: mobileLayout === "compact-grid" ? "#2563eb" : "transparent",
                  color: mobileLayout === "compact-grid" ? "#ffffff" : isDark ? "rgba(255,255,255,0.6)" : "#64748b",
                  transition: "all 0.15s ease",
                }}
              >
                <LayoutGrid size={14} />
              </button>
              <button
                type="button"
                onClick={() => setMobileLayout("compact-list")}
                aria-label="Compact List View"
                title="Compact List"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "28px",
                  height: "28px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: mobileLayout === "compact-list" ? "#2563eb" : "transparent",
                  color: mobileLayout === "compact-list" ? "#ffffff" : isDark ? "rgba(255,255,255,0.6)" : "#64748b",
                  transition: "all 0.15s ease",
                }}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="portfolio-grid-wrap" style={{ width: "100%", maxWidth: "100%", margin: "0 auto", padding: "0 clamp(20px, 4vw, 64px)" }}>
        {loading ? (
          <div
            className={`portfolio-grid ${mobileLayout === "compact-grid" ? "mobile-layout-grid" : "mobile-layout-list"}`}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "28px",
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                style={{
                  height: "480px",
                  borderRadius: "22px",
                  backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#e2e8f0",
                }}
              />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              borderRadius: "20px",
              border: isDark ? "1px dashed rgba(255, 255, 255, 0.15)" : "1px dashed #cbd5e1",
            }}
          >
            <Briefcase size={36} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <h3 style={{ fontSize: "18px", fontWeight: 700 }}>No projects found</h3>
            <p style={{ fontSize: "14px", color: isDark ? "rgba(255, 255, 255, 0.5)" : "#64748b" }}>
              Try selecting another category or clearing your search term.
            </p>
          </div>
        ) : (
          <div
            className={`portfolio-grid ${mobileLayout === "compact-grid" ? "mobile-layout-grid" : "mobile-layout-list"}`}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
              gap: "28px",
            }}
          >
            {filteredProjects.map((project) => (
              <div
                key={project._id || project.name}
                style={{
                  borderRadius: "22px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "520px",
                }}
                className="wsd-portfolio-card wsd-unified-card portfolio-card"
              >
                {/* Visual Banner */}
                <div
                  className="portfolio-card-banner"
                  style={{
                    position: "relative",
                    height: "235px",
                    width: "100%",
                    backgroundColor: isDark ? "#0f172a" : "#e2e8f0",
                    overflow: "hidden",
                    borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                  }}
                >
                  <Image
                    src={project.previewImage && (project.previewImage.startsWith("/") || project.previewImage.startsWith("http")) ? project.previewImage : "/images/websmith_original.jpg"}
                    alt={project.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                    style={{ objectFit: "cover" }}
                  />
                  {project.category && (
                    <div
                      className="portfolio-card-tag"
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        padding: "4px 10px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.03em",
                        backgroundColor: isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.9)",
                        backdropFilter: "blur(8px)",
                        color: "#3b82f6",
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #cbd5e1",
                      }}
                    >
                      {project.category}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="portfolio-card-content" style={{ padding: "24px 24px 22px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div
                      className="portfolio-card-client"
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: isDark ? "rgba(255, 255, 255, 0.45)" : "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        marginBottom: "8px",
                      }}
                    >
                      {project.clientCompany || project.client || "Client Project"}
                    </div>

                    <h3
                      className="portfolio-card-title"
                      style={{
                        fontSize: "19px",
                        fontWeight: 700,
                        lineHeight: 1.35,
                        marginBottom: "10px",
                        color: isDark ? "#ffffff" : "#0f172a",
                      }}
                    >
                      {project.name}
                    </h3>

                    <p
                      className="portfolio-card-desc"
                      style={{
                        fontSize: "14px",
                        lineHeight: 1.55,
                        color: isDark ? "rgba(255, 255, 255, 0.65)" : "#475569",
                        marginBottom: "18px",
                      }}
                    >
                      {project.description}
                    </p>
                  </div>

                  {/* Measurable ROI Metric */}
                  {project.metrics && (
                    <div
                      className="portfolio-card-metrics"
                      style={{
                        padding: "8px 12px",
                        borderRadius: "10px",
                        backgroundColor: isDark ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.06)",
                        border: isDark ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(16, 185, 129, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#10b981",
                        marginBottom: "16px",
                      }}
                    >
                      <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
                      <span>{project.metrics}</span>
                    </div>
                  )}

                  {/* Tech Stack Chips */}
                  {Array.isArray(project.techStack) && project.techStack.length > 0 && (
                    <div
                      className="portfolio-tech-stack"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "6px",
                        marginBottom: "20px",
                      }}
                    >
                      {project.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="portfolio-tech-chip"
                          style={{
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "11px",
                            fontWeight: 500,
                            backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#f1f5f9",
                            color: isDark ? "rgba(255, 255, 255, 0.75)" : "#334155",
                            border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div
                    className="portfolio-actions"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: "12px",
                      borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid #f1f5f9",
                    }}
                  >
                    {project.publicUrl ? (
                      <a
                        href={project.publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="wsd-visit-project-link portfolio-visit-link"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12.5px",
                          fontWeight: 600,
                          color: "#3b82f6",
                          textDecoration: "none",
                        }}
                      >
                        Visit Project <ExternalLink size={13} />
                      </a>
                    ) : (
                      <span
                        style={{
                          fontSize: "12px",
                          color: isDark ? "rgba(255, 255, 255, 0.4)" : "#94a3b8",
                        }}
                      >
                        Private Enterprise Delivery
                      </span>
                    )}

                    <button
                      type="button"
                      className="wsd-build-similar-btn portfolio-build-btn"
                      onClick={() =>
                        openLeadServicesModal({
                          service: {
                            id: project._id || project.name.toLowerCase().replace(/\s+/g, "-"),
                            name: `${project.name} (Build Similar)`,
                          },
                          initialStep: "details",
                        })
                      }
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        padding: "7px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                    >
                      Build Similar <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Call to Action Card */}
        <div
          className="portfolio-cta-banner"
          style={{
            marginTop: "40px",
            padding: "32px clamp(20px, 4vw, 44px)",
            borderRadius: "20px",
            textAlign: "center",
            background: isDark
              ? "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(13, 19, 34, 0.8) 100%)"
              : "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, #ffffff 100%)",
            border: isDark ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(37, 99, 235, 0.15)",
            boxShadow: isDark
              ? "0 20px 48px -15px rgba(0, 0, 0, 0.6)"
              : "0 14px 36px -12px rgba(37, 99, 235, 0.12)",
          }}
        >
          <h2
            className="portfolio-cta-title"
            style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "8px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Have a custom software or ERP project in mind?
          </h2>
          <p
            className="portfolio-cta-desc"
            style={{
              fontSize: "13.5px",
              color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
              maxWidth: "560px",
              margin: "0 auto 18px",
              lineHeight: 1.55,
            }}
          >
            Schedule a technical architecture consultation to discuss timelines, tech stack, and deliverable specifications.
          </p>

          <button
            type="button"
            className="portfolio-cta-btn"
            onClick={() => openLeadServicesModal()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "9px 24px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#ffffff",
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 6px 18px -3px rgba(37, 99, 235, 0.4)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .wsd-portfolio-card:hover {
          transform: translateY(-4px);
          border-color: rgba(37, 99, 235, 0.35) !important;
        }

        /* Build Similar Button: Crisp, High-Contrast & Zero Color Mixing */
        .wsd-build-similar-btn {
          background-color: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          border: 1px solid rgba(37, 99, 235, 0.25);
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        .dark-theme .wsd-build-similar-btn {
          background-color: rgba(37, 99, 235, 0.18);
          color: #60a5fa;
          border: 1px solid rgba(37, 99, 235, 0.35);
        }
        .wsd-build-similar-btn:hover {
          background-color: #2563eb !important;
          color: #ffffff !important;
          border-color: #2563eb !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }
        .wsd-build-similar-btn:hover svg {
          color: #ffffff !important;
          stroke: #ffffff !important;
        }

        /* When the parent portfolio card is hovered, the button turns solid white with crisp dark text */
        .wsd-portfolio-card:hover .wsd-build-similar-btn {
          background-color: #ffffff !important;
          color: #0f172a !important;
          border-color: rgba(255, 255, 255, 0.95) !important;
          font-weight: 700 !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.22) !important;
        }
        .wsd-portfolio-card:hover .wsd-build-similar-btn svg {
          color: #0f172a !important;
          stroke: #0f172a !important;
        }

        /* When user directly hovers on the Build Similar button on a hovered card */
        .wsd-portfolio-card:hover .wsd-build-similar-btn:hover {
          background-color: #0f172a !important;
          color: #ffffff !important;
          border-color: #0f172a !important;
          transform: translateY(-2px) scale(1.04) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
        }
        .wsd-portfolio-card:hover .wsd-build-similar-btn:hover svg {
          color: #ffffff !important;
          stroke: #ffffff !important;
        }

        /* High contrast for Visit Project link on card hover */
        .wsd-visit-project-link {
          transition: color 0.2s ease;
        }
        .wsd-portfolio-card:hover .wsd-visit-project-link {
          color: #04274F !important;
          font-weight: 700 !important;
        }
        .wsd-portfolio-card:hover .wsd-visit-project-link svg {
          color: #04274F !important;
          stroke: #04274F !important;
        }
        .wsd-portfolio-card:hover .wsd-visit-project-link:hover {
          text-decoration: underline !important;
        }

        @media (min-width: 769px) {
          .portfolio-layout-toggle {
            display: none !important;
          }
        }

        /* ============================================================
           MOBILE VIEW: ULTRA-COMPACT & STREAMLINED (<= 768px)
           ============================================================ */
        @media (max-width: 768px) {
          /* Fixed mobile navbar clearance */
          .wsd-portfolio-page {
            padding-top: 70px !important;
            padding-bottom: 24px !important;
          }

          .portfolio-hero-wrap, .portfolio-grid-wrap {
            padding: 0 8px !important;
          }

          /* Hero header compact */
          .portfolio-hero-title {
            font-size: 18px !important;
            line-height: 1.15 !important;
            margin-bottom: 4px !important;
          }

          .portfolio-hero-desc {
            font-size: 10px !important;
            line-height: 1.3 !important;
            margin-bottom: 8px !important;
          }

          /* Filter bar compact with all-in-screen category pills like services */
          .portfolio-filter-bar {
            padding: 4px 6px !important;
            border-radius: 10px !important;
            gap: 5px !important;
            margin-bottom: 10px !important;
          }

          .portfolio-category-tabs {
            width: 100% !important;
            overflow-x: visible !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 4px !important;
            padding-bottom: 0 !important;
          }
          .portfolio-category-tabs::-webkit-scrollbar {
            display: none !important;
          }

          .portfolio-category-btn {
            padding: 3.5px 8px !important;
            font-size: 9.5px !important;
            font-weight: 600 !important;
            border-radius: 6px !important;
            white-space: normal !important;
            flex-shrink: 0 !important;
            text-align: center !important;
          }

          .portfolio-search-and-toggle {
            display: flex !important;
            align-items: center !important;
            gap: 6px !important;
            width: 100% !important;
          }

          .portfolio-search-box {
            flex: 1 !important;
            min-width: 0 !important;
            width: auto !important;
          }

          .portfolio-search-input {
            height: 29px !important;
            padding: 4px 8px 4px 26px !important;
            font-size: 11px !important;
            border-radius: 6px !important;
          }

          .portfolio-layout-toggle {
            display: inline-flex !important;
            flex-shrink: 0 !important;
            padding: 2px !important;
            border-radius: 7px !important;
          }

          .portfolio-layout-toggle button {
            width: 25px !important;
            height: 25px !important;
          }

          /* ------------------------------------------------------------
             MODE 1: 2-COLUMN COMPACT GRID (DEFAULT ON MOBILE)
             ------------------------------------------------------------ */
          .portfolio-grid.mobile-layout-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 8px !important;
          }

          .portfolio-grid.mobile-layout-grid .portfolio-card {
            border-radius: 14px !important;
            min-height: 370px !important;
            display: flex !important;
            flex-direction: column !important;
          }

          .portfolio-grid.mobile-layout-grid .portfolio-card-banner {
            height: 145px !important;
          }

          .portfolio-grid.mobile-layout-grid .portfolio-card-tag {
            top: 8px !important;
            left: 8px !important;
            padding: 2.5px 7px !important;
            font-size: 9px !important;
            border-radius: 5px !important;
          }

          .portfolio-grid.mobile-layout-grid .portfolio-card-content {
            padding: 10px 10px 12px !important;
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }

          .portfolio-grid.mobile-layout-grid .portfolio-card-client {
            font-size: 8.5px !important;
            margin-bottom: 3px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          .portfolio-grid.mobile-layout-grid .portfolio-card-title {
            font-size: 12px !important;
            line-height: 1.3 !important;
            margin-bottom: 5px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            white-space: normal !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          .portfolio-grid.mobile-layout-grid .portfolio-card-desc {
            font-size: 10px !important;
            line-height: 1.4 !important;
            margin-bottom: 8px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 3 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }

          .portfolio-grid.mobile-layout-grid .portfolio-card-metrics {
            padding: 4px 7px !important;
            font-size: 9px !important;
            border-radius: 6px !important;
            margin-bottom: 8px !important;
            gap: 4px !important;
            white-space: normal !important;
            line-height: 1.3 !important;
          }

          .portfolio-grid.mobile-layout-grid .portfolio-tech-stack {
            display: none !important;
          }

          .portfolio-grid.mobile-layout-grid .portfolio-actions {
            padding-top: 8px !important;
            flex-direction: column !important;
            gap: 5px !important;
            align-items: stretch !important;
          }

          .portfolio-grid.mobile-layout-grid .portfolio-visit-link {
            font-size: 9.5px !important;
            justify-content: center !important;
            margin-bottom: 2px !important;
          }

          .portfolio-grid.mobile-layout-grid .portfolio-build-btn {
            padding: 5px 10px !important;
            font-size: 9.5px !important;
            justify-content: center !important;
            width: 100% !important;
            text-align: center !important;
            border-radius: 6px !important;
          }

          /* ------------------------------------------------------------
             MODE 2: COMPACT HORIZONTAL LIST VIEW (ROW CARDS)
             ------------------------------------------------------------ */
          .portfolio-grid.mobile-layout-list {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }

          .portfolio-grid.mobile-layout-list .portfolio-card {
            flex-direction: row !important;
            border-radius: 10px !important;
            min-height: 95px !important;
          }

          .portfolio-grid.mobile-layout-list .portfolio-card-banner {
            width: 100px !important;
            min-width: 100px !important;
            height: auto !important;
            min-height: 100% !important;
            flex-shrink: 0 !important;
          }

          .portfolio-grid.mobile-layout-list .portfolio-card-tag {
            top: 4px !important;
            left: 4px !important;
            padding: 1.5px 5px !important;
            font-size: 7.5px !important;
            border-radius: 4px !important;
          }

          .portfolio-grid.mobile-layout-list .portfolio-card-content {
            padding: 7px 9px !important;
            flex: 1 !important;
            justify-content: center !important;
            min-width: 0 !important;
          }

          .portfolio-grid.mobile-layout-list .portfolio-card-client {
            font-size: 8px !important;
            margin-bottom: 1px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          .portfolio-grid.mobile-layout-list .portfolio-card-title {
            font-size: 12px !important;
            line-height: 1.2 !important;
            margin-bottom: 3px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          .portfolio-grid.mobile-layout-list .portfolio-card-desc {
            font-size: 9.5px !important;
            line-height: 1.25 !important;
            margin-bottom: 4px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }

          .portfolio-grid.mobile-layout-list .portfolio-card-metrics {
            padding: 2px 5px !important;
            font-size: 8.5px !important;
            border-radius: 4px !important;
            margin-bottom: 4px !important;
            gap: 3px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }

          .portfolio-grid.mobile-layout-list .portfolio-tech-stack {
            display: none !important;
          }

          .portfolio-grid.mobile-layout-list .portfolio-actions {
            padding-top: 4px !important;
            gap: 6px !important;
          }

          .portfolio-grid.mobile-layout-list .portfolio-visit-link {
            font-size: 9.5px !important;
          }

          .portfolio-grid.mobile-layout-list .portfolio-build-btn {
            padding: 3px 7px !important;
            font-size: 9px !important;
            border-radius: 4px !important;
          }

          /* Bottom CTA compact */
          .portfolio-cta-banner {
            margin-top: 14px !important;
            padding: 12px 10px !important;
            border-radius: 10px !important;
          }

          .portfolio-cta-title {
            font-size: 13.5px !important;
            line-height: 1.2 !important;
            margin-bottom: 2px !important;
          }

          .portfolio-cta-desc {
            font-size: 10px !important;
            line-height: 1.3 !important;
            margin-bottom: 8px !important;
          }

          .portfolio-cta-btn {
            padding: 5px 14px !important;
            font-size: 10.5px !important;
          }
        }
      `}</style>
    </div>
  );
}
