"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  ChevronRight,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { type BlogPost } from "../../../../core/config/publicSite";
import { usePublicTheme } from "../../../providers/PublicThemeProvider";
import { useLeadFunnel } from "../../../providers/LeadFunnelProvider";

interface BlogPostClientProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function BlogPostClient({ post, relatedPosts }: BlogPostClientProps) {
  const { publicTheme } = usePublicTheme();
  const isDark = publicTheme === "dark";
  const { openLeadServicesModal } = useLeadFunnel();

  return (
    <div
      className="wsd-blog-post-page"
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        color: isDark ? "#f8fafc" : "#0f172a",
        paddingTop: "28px",
        paddingBottom: "50px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 64px)",
        }}
      >
        {/* Breadcrumb Navigation */}
        <div
          className="wsd-post-breadcrumb"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12.5px",
            color: isDark ? "rgba(255, 255, 255, 0.5)" : "#64748b",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/blog"
            style={{
              color: "#3b82f6",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={13} /> Engineering Blog
          </Link>
          <ChevronRight size={12} style={{ opacity: 0.4 }} />
          <span>{post.category}</span>
          <ChevronRight size={12} style={{ opacity: 0.4 }} />
          <span
            style={{
              color: isDark ? "rgba(255, 255, 255, 0.85)" : "#334155",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "600px",
            }}
          >
            {post.title}
          </span>
        </div>

        {/* Article Header */}
        <div className="wsd-post-header" style={{ marginBottom: "24px" }}>
          <div
            className="wsd-post-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              padding: "3px 10px",
              borderRadius: "9999px",
              fontSize: "11px",
              fontWeight: 700,
              backgroundColor: isDark ? "rgba(37, 99, 235, 0.2)" : "rgba(37, 99, 235, 0.1)",
              border: isDark ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(37, 99, 235, 0.2)",
              color: "#3b82f6",
              marginBottom: "10px",
            }}
          >
            <Tag size={11} /> {post.category}
          </div>

          <h1
            className="wsd-post-main-title"
            style={{
              fontSize: "clamp(24px, 3.5vw, 36px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.2,
              marginBottom: "10px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            {post.title}
          </h1>

          <p
            className="wsd-post-main-excerpt"
            style={{
              fontSize: "clamp(13.5px, 1.4vw, 15px)",
              lineHeight: 1.55,
              color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
              marginBottom: "16px",
            }}
          >
            {post.excerpt}
          </p>

          {/* Metadata Row */}
          <div
            className="wsd-post-meta-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: "14px",
              backgroundColor: isDark ? "rgba(13, 19, 34, 0.75)" : "#ffffff",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
              boxShadow: isDark ? "none" : "0 2px 8px rgba(0, 0, 0, 0.04)",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                className="wsd-post-avatar"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                WS
              </div>
              <div>
                <div className="wsd-post-author-name" style={{ fontSize: "13px", fontWeight: 600, color: isDark ? "#ffffff" : "#0f172a" }}>
                  WebSmith Architecture Team
                </div>
                <div className="wsd-post-author-sub" style={{ fontSize: "11px", color: isDark ? "rgba(255, 255, 255, 0.45)" : "#94a3b8" }}>
                  Engineering &amp; System Design
                </div>
              </div>
            </div>

            <div
              className="wsd-post-meta-timing"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                fontSize: "12px",
                color: isDark ? "rgba(255, 255, 255, 0.5)" : "#64748b",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Calendar size={13} />
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Clock size={13} /> {post.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* Article Body Sections */}
        <div className="wsd-post-body" style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "36px" }}>
          {post.content.map((section, idx) => (
            <div
              key={idx}
              className="wsd-post-section-card"
              style={{
                padding: "24px clamp(16px, 2.5vw, 28px)",
                borderRadius: "16px",
                backgroundColor: isDark ? "rgba(13, 19, 34, 0.75)" : "#ffffff",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(0, 0, 0, 0.04)",
              }}
            >
              <h2
                className="wsd-section-heading"
                style={{
                  fontSize: "clamp(16px, 2vw, 19px)",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  marginBottom: "12px",
                  color: isDark ? "#ffffff" : "#0f172a",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    width: "5px",
                    height: "16px",
                    borderRadius: "3px",
                    backgroundColor: "#3b82f6",
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                {section.heading}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {section.body.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className="wsd-section-paragraph"
                    style={{
                      fontSize: "13.5px",
                      lineHeight: 1.65,
                      color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
                      margin: 0,
                    }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Consultation Callout */}
        <div
          className="wsd-post-cta"
          style={{
            padding: "32px clamp(20px, 4vw, 44px)",
            borderRadius: "20px",
            background: isDark
              ? "linear-gradient(135deg, rgba(37, 99, 235, 0.15) 0%, rgba(13, 19, 34, 0.8) 100%)"
              : "linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, #ffffff 100%)",
            border: isDark ? "1px solid rgba(37, 99, 235, 0.3)" : "1px solid rgba(37, 99, 235, 0.15)",
            textAlign: "center",
            marginBottom: "36px",
          }}
        >
          <h3
            className="wsd-post-cta-title"
            style={{
              fontSize: "clamp(19px, 2.5vw, 26px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: isDark ? "#ffffff" : "#0f172a",
              marginBottom: "10px",
            }}
          >
            Need help implementing scalable digital architectures?
          </h3>
          <p
            className="wsd-post-cta-desc"
            style={{
              fontSize: "14px",
              color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
              maxWidth: "680px",
              margin: "0 auto 20px",
              lineHeight: 1.55,
            }}
          >
            From custom Next.js web applications to enterprise ERP systems and license management, let&apos;s discuss your project.
          </p>
          <button
            type="button"
            className="wsd-post-cta-btn"
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

        {/* Related Articles */}
        <div className="wsd-post-related-section">
          <h3
            className="wsd-post-related-heading"
            style={{
              fontSize: "clamp(17px, 2.2vw, 22px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: isDark ? "#ffffff" : "#0f172a",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BookOpen size={16} color="#3b82f6" /> More from WebSmith Engineering
          </h3>

          <div
            className="wsd-post-related-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "14px",
            }}
          >
            {relatedPosts.map((rel) => (
              <div
                key={rel.slug}
                className="wsd-post-related-card"
                style={{
                  padding: "18px 16px",
                  borderRadius: "14px",
                  backgroundColor: isDark ? "rgba(13, 19, 34, 0.75)" : "#ffffff",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: isDark ? "none" : "0 2px 8px rgba(0, 0, 0, 0.03)",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <span
                      className="wsd-rel-badge"
                      style={{
                        padding: "2px 8px",
                        borderRadius: "9999px",
                        fontSize: "10.5px",
                        fontWeight: 700,
                        backgroundColor: isDark ? "rgba(37, 99, 235, 0.15)" : "rgba(37, 99, 235, 0.08)",
                        color: "#3b82f6",
                      }}
                    >
                      {rel.category}
                    </span>
                    <span className="wsd-rel-readtime" style={{ fontSize: "11px", color: isDark ? "rgba(255, 255, 255, 0.45)" : "#94a3b8" }}>
                      {rel.readTime}
                    </span>
                  </div>
                  <h4
                    className="wsd-rel-title"
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      lineHeight: 1.35,
                      marginBottom: "6px",
                      color: isDark ? "#ffffff" : "#0f172a",
                    }}
                  >
                    <Link
                      href={`/blog/${rel.slug}`}
                      style={{ color: "inherit", textDecoration: "none" }}
                    >
                      {rel.title}
                    </Link>
                  </h4>
                  <p
                    className="wsd-rel-excerpt"
                    style={{
                      fontSize: "12px",
                      color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b",
                      lineHeight: 1.45,
                      marginBottom: "12px",
                    }}
                  >
                    {rel.excerpt.slice(0, 95)}...
                  </p>
                </div>

                <Link
                  href={`/blog/${rel.slug}`}
                  className="wsd-rel-link"
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#3b82f6",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    textDecoration: "none",
                  }}
                >
                  Read Article <ChevronRight size={13} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .wsd-post-related-card:hover {
          border-color: rgba(37, 99, 235, 0.4) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .wsd-blog-post-page {
            padding-top: 70px !important;
            padding-bottom: 24px !important;
          }
          .wsd-post-breadcrumb {
            font-size: 10px !important;
            margin-bottom: 10px !important;
            gap: 4px !important;
          }
          .wsd-post-badge {
            font-size: 9px !important;
            padding: 2px 6px !important;
            margin-bottom: 6px !important;
          }
          .wsd-post-main-title {
            font-size: 18px !important;
            line-height: 1.2 !important;
            margin-bottom: 6px !important;
          }
          .wsd-post-main-excerpt {
            font-size: 10.5px !important;
            line-height: 1.35 !important;
            margin-bottom: 10px !important;
          }
          .wsd-post-meta-row {
            padding: 8px 10px !important;
            border-radius: 10px !important;
            gap: 8px !important;
          }
          .wsd-post-avatar {
            width: 26px !important;
            height: 26px !important;
            font-size: 10px !important;
          }
          .wsd-post-author-name {
            font-size: 11px !important;
          }
          .wsd-post-author-sub {
            font-size: 9px !important;
          }
          .wsd-post-meta-timing {
            font-size: 9.5px !important;
            gap: 8px !important;
          }
          .wsd-post-body {
            gap: 8px !important;
            margin-bottom: 16px !important;
          }
          .wsd-post-section-card {
            padding: 12px 10px !important;
            border-radius: 12px !important;
          }
          .wsd-section-heading {
            font-size: 13.5px !important;
            margin-bottom: 6px !important;
          }
          .wsd-section-paragraph {
            font-size: 10.5px !important;
            line-height: 1.4 !important;
          }
          .wsd-post-cta {
            padding: 14px 10px !important;
            border-radius: 12px !important;
            margin-bottom: 18px !important;
          }
          .wsd-post-cta-title {
            font-size: 15px !important;
            margin-bottom: 4px !important;
          }
          .wsd-post-cta-desc {
            font-size: 10px !important;
            margin-bottom: 10px !important;
          }
          .wsd-post-cta-btn {
            padding: 8px 16px !important;
            font-size: 11px !important;
          }
          .wsd-post-related-heading {
            font-size: 14px !important;
            margin-bottom: 10px !important;
          }
          .wsd-post-related-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
          }
          .wsd-post-related-card {
            padding: 8px 6px !important;
            border-radius: 10px !important;
          }
          .wsd-rel-badge {
            font-size: 8.5px !important;
            padding: 2px 5px !important;
          }
          .wsd-rel-readtime {
            font-size: 8.5px !important;
          }
          .wsd-rel-title {
            font-size: 11px !important;
            line-height: 1.25 !important;
            margin-bottom: 3px !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .wsd-rel-excerpt {
            font-size: 9px !important;
            line-height: 1.25 !important;
            margin-bottom: 6px !important;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .wsd-rel-link {
            font-size: 9px !important;
          }
        }
      `}</style>
    </div>
  );
}
