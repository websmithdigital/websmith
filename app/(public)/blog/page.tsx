"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
  ChevronRight,
} from "lucide-react";
import { blogPosts } from "../../../core/config/publicSite";
import { usePublicTheme } from "../../providers/PublicThemeProvider";
import { useLeadFunnel } from "../../providers/LeadFunnelProvider";

export default function BlogPage() {
  const { publicTheme } = usePublicTheme();
  const isDark = publicTheme === "dark";
  const { openLeadServicesModal } = useLeadFunnel();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [posts, setPosts] = useState<any[]>(blogPosts);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/blogs")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.data && Array.isArray(data.data) && data.data.length > 0) {
          setPosts(data.data);
        }
      })
      .catch((err) => console.error("Error fetching live blogs", err));
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(posts.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(post.tags) && post.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [posts, searchQuery, selectedCategory]);

  const featuredPost = filteredPosts[0] || posts[0];

  return (
    <div
      className="wsd-blog-page"
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        color: isDark ? "#f8fafc" : "#0f172a",
        paddingTop: "28px",
        paddingBottom: "50px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 64px)",
          textAlign: "center",
        }}
      >
        <h1
          className="wsd-blog-hero-title"
          style={{
            fontSize: "clamp(26px, 3.8vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "10px",
          }}
        >
          The WebSmith{" "}
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
            Engineering Blog
          </span>
        </h1>

        <p
          className="wsd-blog-hero-desc"
          style={{
            fontSize: "clamp(13.5px, 1.4vw, 15px)",
            color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
            maxWidth: "680px",
            margin: "0 auto 20px",
            lineHeight: 1.55,
          }}
        >
          Deep dives into full-stack Next.js architecture, enterprise ERP workflows, software licensing, and real-world system resilience from our engineering team.
        </p>

        {/* Search & Category Filter Bar */}
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto 36px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            alignItems: "center",
          }}
        >
          {/* Search Input */}
          <div
            className="wsd-blog-search-box"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "460px",
            }}
          >
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
              placeholder="Search engineering articles, topics, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="wsd-blog-search-input"
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

          {/* Category Capsule Tabs */}
          <div
            className="wsd-blog-tabs"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px",
              borderRadius: "9999px",
              backgroundColor: isDark ? "rgba(13, 19, 34, 0.85)" : "#ffffff",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #e2e8f0",
              boxShadow: isDark ? "none" : "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className="wsd-blog-tab-btn"
                  style={{
                    padding: "6px 14px",
                    borderRadius: "9999px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    border: "none",
                    backgroundColor: isSelected ? "#2563eb" : "transparent",
                    color: isSelected ? "#ffffff" : isDark ? "rgba(255, 255, 255, 0.7)" : "#64748b",
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Post Hero */}
      {featuredPost && selectedCategory === "All" && !searchQuery && (
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            margin: "0 auto 36px",
            padding: "0 clamp(16px, 4vw, 64px)",
          }}
        >
          <div
            className="wsd-featured-box"
            style={{
              borderRadius: "20px",
              padding: "clamp(20px, 3vw, 32px)",
              background: isDark
                ? "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(13, 19, 34, 0.9) 100%)"
                : "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, #ffffff 100%)",
              border: isDark ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(37, 99, 235, 0.2)",
              boxShadow: isDark
                ? "0 16px 40px -10px rgba(0, 0, 0, 0.5)"
                : "0 10px 30px -6px rgba(0, 0, 0, 0.05)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 10px",
                  borderRadius: "9999px",
                  fontSize: "11px",
                  fontWeight: 700,
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  marginBottom: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                <Sparkles size={11} /> Featured Article
              </div>
              <h2
                className="wsd-featured-title"
                style={{
                  fontSize: "clamp(18px, 2.5vw, 26px)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.25,
                  marginBottom: "10px",
                  color: isDark ? "#ffffff" : "#0f172a",
                }}
              >
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  {featuredPost.title}
                </Link>
              </h2>
              <p
                className="wsd-featured-excerpt"
                style={{
                  fontSize: "13.5px",
                  lineHeight: 1.55,
                  color: isDark ? "rgba(255, 255, 255, 0.75)" : "#475569",
                  marginBottom: "16px",
                }}
              >
                {featuredPost.excerpt}
              </p>
              <div
                className="wsd-featured-meta"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  fontSize: "12px",
                  color: isDark ? "rgba(255, 255, 255, 0.5)" : "#64748b",
                  marginBottom: "18px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                  <Calendar size={13} />
                  {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                  <Clock size={13} /> {featuredPost.readTime}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                  <Tag size={13} color="#3b82f6" /> {featuredPost.category}
                </span>
              </div>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="wsd-featured-btn"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "9px 20px",
                  borderRadius: "9999px",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#ffffff",
                  background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                  textDecoration: "none",
                  boxShadow: "0 4px 14px -2px rgba(37, 99, 235, 0.4)",
                }}
              >
                Read Full Story <ArrowRight size={14} />
              </Link>
            </div>

            <div
              className="wsd-featured-highlights"
              style={{
                borderRadius: "16px",
                padding: "20px",
                backgroundColor: isDark ? "rgba(7, 11, 20, 0.8)" : "#f8fafc",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#3b82f6",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "10px",
                }}
              >
                Article Highlights
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {featuredPost.content.map((sec, i) => (
                  <div key={i} style={{ borderLeft: "2px solid #3b82f6", paddingLeft: "10px" }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: isDark ? "#ffffff" : "#0f172a",
                        marginBottom: "2px",
                      }}
                    >
                      {sec.heading}
                    </div>
                    <div
                      style={{
                        fontSize: "11.5px",
                        color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b",
                        lineHeight: 1.35,
                      }}
                    >
                      {sec.body[0].slice(0, 100)}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto 40px",
          padding: "0 clamp(16px, 4vw, 64px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <h2
            className="wsd-section-heading"
            style={{
              fontSize: "clamp(18px, 2.5vw, 24px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              margin: 0,
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            {selectedCategory === "All" ? "All Engineering Articles" : `${selectedCategory} Articles`}
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: isDark ? "rgba(255, 255, 255, 0.4)" : "#94a3b8",
                marginLeft: "8px",
              }}
            >
              ({filteredPosts.length})
            </span>
          </h2>
        </div>

        {filteredPosts.length === 0 ? (
          <div
            style={{
              padding: "48px 20px",
              textAlign: "center",
              borderRadius: "16px",
              backgroundColor: isDark ? "rgba(13, 19, 34, 0.6)" : "#ffffff",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
            }}
          >
            <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>No articles found</div>
            <p style={{ fontSize: "13px", color: isDark ? "rgba(255, 255, 255, 0.5)" : "#64748b" }}>
              Try searching for a different keyword or resetting the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              style={{
                marginTop: "12px",
                padding: "7px 16px",
                borderRadius: "9999px",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div
            className="wsd-blog-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            {filteredPosts.map((post) => (
              <article
                key={post.slug}
                style={{
                  borderRadius: "16px",
                  padding: "20px",
                  backgroundColor: isDark ? "rgba(13, 19, 34, 0.75)" : "#ffffff",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(0, 0, 0, 0.04)",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                }}
                className="wsd-blog-card"
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <span
                      className="wsd-post-cat-badge"
                      style={{
                        padding: "3px 8px",
                        borderRadius: "9999px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: isDark ? "rgba(37, 99, 235, 0.2)" : "rgba(37, 99, 235, 0.1)",
                        color: "#3b82f6",
                      }}
                    >
                      {post.category}
                    </span>
                    <span
                      className="wsd-post-readtime"
                      style={{
                        fontSize: "11.5px",
                        color: isDark ? "rgba(255, 255, 255, 0.45)" : "#94a3b8",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <Clock size={11} /> {post.readTime}
                    </span>
                  </div>

                  <h3
                    className="wsd-post-title"
                    style={{
                      fontSize: "16px",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.35,
                      marginBottom: "8px",
                      color: isDark ? "#ffffff" : "#0f172a",
                    }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p
                    className="wsd-post-excerpt"
                    style={{
                      fontSize: "12.5px",
                      lineHeight: 1.5,
                      color: isDark ? "rgba(255, 255, 255, 0.65)" : "#475569",
                      marginBottom: "14px",
                    }}
                  >
                    {post.excerpt}
                  </p>
                </div>

                <div
                  className="wsd-post-footer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: "12px",
                    borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid #f1f5f9",
                  }}
                >
                  <span
                    className="wsd-post-date"
                    style={{
                      fontSize: "11px",
                      color: isDark ? "rgba(255, 255, 255, 0.45)" : "#94a3b8",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Calendar size={12} />
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="wsd-post-link"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#3b82f6",
                      textDecoration: "none",
                    }}
                  >
                    Read Article <ChevronRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA Callout */}
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "40px auto 0",
          padding: "0 clamp(16px, 4vw, 64px)",
        }}
      >
        <div
          className="wsd-blog-cta"
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
            className="wsd-blog-cta-title"
            style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "10px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Want to build architectures like these?
          </h2>
          <p
            className="wsd-blog-cta-desc"
            style={{
              fontSize: "14px",
              color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
              maxWidth: "600px",
              margin: "0 auto 20px",
              lineHeight: 1.55,
            }}
          >
            Partner with WebSmith to build custom web applications, multi-tenant ERP platforms, or secure software licensing systems.
          </p>

          <button
            type="button"
            className="wsd-blog-cta-btn"
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
            Talk to an Architect <ArrowRight size={15} />
          </button>
        </div>
      </div>

      <style>{`
        .wsd-blog-card:hover {
          border-color: rgba(37, 99, 235, 0.4) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .wsd-blog-page {
            padding-top: 70px !important;
            padding-bottom: 24px !important;
          }
          .wsd-blog-hero-title {
            font-size: 18px !important;
            line-height: 1.18 !important;
            margin-bottom: 4px !important;
          }
          .wsd-blog-hero-desc {
            font-size: 10px !important;
            line-height: 1.3 !important;
            margin-bottom: 10px !important;
          }
          .wsd-blog-search-box {
            max-width: 100% !important;
          }
          .wsd-blog-search-input {
            padding: 8px 12px 8px 34px !important;
            font-size: 11px !important;
          }
          .wsd-blog-tabs {
            flex-wrap: wrap !important;
            overflow-x: visible !important;
            justify-content: center !important;
            width: 100% !important;
            gap: 4px !important;
            margin-bottom: 12px !important;
          }
          .wsd-blog-tab-btn {
            padding: 4px 10px !important;
            font-size: 10.5px !important;
          }
          .wsd-featured-box {
            grid-template-columns: 1fr !important;
            padding: 12px 10px !important;
            border-radius: 12px !important;
            gap: 10px !important;
            margin-bottom: 16px !important;
          }
          .wsd-featured-title {
            font-size: 13.5px !important;
            margin-bottom: 4px !important;
          }
          .wsd-featured-excerpt {
            font-size: 10px !important;
            line-height: 1.3 !important;
            margin-bottom: 8px !important;
          }
          .wsd-featured-meta {
            font-size: 9px !important;
            gap: 8px !important;
            margin-bottom: 10px !important;
          }
          .wsd-featured-btn {
            padding: 6px 14px !important;
            font-size: 10.5px !important;
          }
          .wsd-featured-highlights {
            padding: 8px !important;
            border-radius: 8px !important;
          }
          .wsd-section-heading {
            font-size: 14px !important;
          }
          .wsd-blog-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
            margin-bottom: 16px !important;
          }
          .wsd-blog-card {
            padding: 8px 6px !important;
            border-radius: 10px !important;
          }
          .wsd-post-cat-badge {
            font-size: 8.5px !important;
            padding: 2px 5px !important;
          }
          .wsd-post-readtime {
            font-size: 8.5px !important;
          }
          .wsd-post-title {
            font-size: 11px !important;
            line-height: 1.25 !important;
            margin-bottom: 3px !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .wsd-post-excerpt {
            font-size: 9px !important;
            line-height: 1.25 !important;
            margin-bottom: 6px !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .wsd-post-footer {
            padding-top: 4px !important;
          }
          .wsd-post-date {
            font-size: 8.5px !important;
          }
          .wsd-post-link {
            font-size: 9px !important;
          }
          .wsd-blog-cta {
            margin-top: 14px !important;
            padding: 14px 10px !important;
            border-radius: 12px !important;
          }
          .wsd-blog-cta-title {
            font-size: 15px !important;
            margin-bottom: 4px !important;
          }
          .wsd-blog-cta-desc {
            font-size: 10px !important;
            margin-bottom: 10px !important;
          }
          .wsd-blog-cta-btn {
            padding: 8px 16px !important;
            font-size: 11px !important;
          }
        }
      `}</style>
    </div>
  );
}
