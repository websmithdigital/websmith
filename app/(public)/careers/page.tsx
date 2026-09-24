"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  Laptop, 
  HeartHandshake, 
  GraduationCap, 
  Send,
  X,
  DollarSign,
  Check,
  AlertCircle
} from "lucide-react";
import API from "../../../core/services/apiService";
import { usePublicTheme } from "../../providers/PublicThemeProvider";
import { useLeadFunnel } from "../../providers/LeadFunnelProvider";
import { DEFAULT_JOB_ROLES, type JobRole, type Department } from "@/lib/careers-data";

const PERKS = [
  {
    icon: Laptop,
    title: "Remote-First Flexibility",
    description: "Work from wherever you are most productive. We focus on results, autonomy, and high-impact deliverables rather than micromanaged hours.",
  },
  {
    icon: Zap,
    title: "High-Scale Modern Stack",
    description: "Build with modern Next.js 16, TypeScript, Neon Serverless DB, Redis queues, and AI-assisted engineering workflows.",
  },
  {
    icon: HeartHandshake,
    title: "Competitive Compensation & Bonuses",
    description: "Above-market salary tiers, performance-based delivery bonuses, and transparent milestone appraisals.",
  },
  {
    icon: GraduationCap,
    title: "Continuous Learning & Subsidies",
    description: "Annual stipend for developer certifications, design courses, software tools, and technical conferences.",
  },
];

const HIRING_STEPS = [
  {
    number: "01",
    title: "Application Review",
    desc: "We review your resume, GitHub repositories, and past project architecture samples within 48 business hours.",
  },
  {
    number: "02",
    title: "Technical Conversation",
    desc: "A 45-minute discussion with a lead engineer on system design, problem solving, and architecture decisions.",
  },
  {
    number: "03",
    title: "Practical Trial Sprint",
    desc: "A paid, focused take-home challenge or collaborative pair programming session reflecting real client work.",
  },
  {
    number: "04",
    title: "Fast Offer & Onboarding",
    desc: "Transparent salary offer and onboarding package with hardware allowances to get you coding without delays.",
  },
];

export default function CareersPage() {
  const { publicTheme } = usePublicTheme();
  const isDark = publicTheme === "dark";
  const { openLeadServicesModal } = useLeadFunnel();

  const [roles, setRoles] = useState<JobRole[]>(DEFAULT_JOB_ROLES);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobRole | null>(null);
  const [activeDepartment, setActiveDepartment] = useState<string>("All");
  const [contactInfo, setContactInfo] = useState({
    email: "careers@websmithdigital.com",
    support_email: "support@websmithdigital.com",
    sales_email: "sales@websmithdigital.com",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get("/settings/public/contact_info");
        if (res.data && res.data.success && res.data.data) {
          setContactInfo({
            email: res.data.data.hr_email || "careers@websmithdigital.com",
            support_email: res.data.data.email || "support@websmithdigital.com",
            sales_email: res.data.data.sales_email || "sales@websmithdigital.com",
          });
        }
      } catch {
        // Fallback to default
      }
    };

    const fetchCareers = async () => {
      try {
        setIsLoading(true);
        const res = await API.get("/careers");
        if (res.data?.data && Array.isArray(res.data.data)) {
          setRoles(res.data.data);
        }
      } catch (err) {
        console.warn("Failed to fetch careers from API, using default roles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
    fetchCareers();
  }, []);

  const departments: string[] = ["All", ...Array.from(new Set(roles.map((r) => r.department).filter(Boolean)))];

  const filteredRoles = activeDepartment === "All"
    ? roles
    : roles.filter((r) => r.department === activeDepartment);

  return (
    <div
      className="wsd-careers-page"
      style={{
        minHeight: "100vh",
        backgroundColor: "transparent",
        color: isDark ? "#f8fafc" : "#0f172a",
        paddingTop: "28px",
        paddingBottom: "50px",
      }}
    >
      {/* Hero Header */}
      <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto", padding: "0 clamp(16px, 4vw, 64px)", textAlign: "center" }}>
        <h1
          className="wsd-careers-hero-title"
          style={{
            fontSize: "clamp(26px, 3.8vw, 42px)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            marginBottom: "10px",
          }}
        >
          Build Exceptional Software With{" "}
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
            Senior Engineers
          </span>
        </h1>

        <p
          className="wsd-careers-hero-desc"
          style={{
            fontSize: "clamp(13.5px, 1.4vw, 15px)",
            color: isDark ? "rgba(255, 255, 255, 0.65)" : "rgba(100, 116, 139, 0.9)",
            maxWidth: "680px",
            margin: "0 auto 20px",
            lineHeight: 1.55,
          }}
        >
          Join WebSmith Digital in architecting enterprise digital ecosystems, complex ERP platforms, and universal software licensing engines for ambitious brands worldwide.
        </p>

        {/* Action Button */}
        <div className="wsd-careers-hero-btns" style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "36px" }}>
          <a
            href={`mailto:${contactInfo.email}?subject=Application for Engineering Role at WebSmith Digital`}
            className="wsd-careers-btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              borderRadius: "9999px",
              fontSize: "13.5px",
              fontWeight: 700,
              color: "#ffffff",
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
              textDecoration: "none",
              boxShadow: "0 6px 20px -4px rgba(37, 99, 235, 0.4)",
            }}
          >
            Send Your Resume <Send size={14} />
          </a>

          <Link
            href="/portfolio"
            className="wsd-careers-btn-secondary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "9999px",
              fontSize: "13.5px",
              fontWeight: 600,
              color: isDark ? "#ffffff" : "#0f172a",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#ffffff",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #cbd5e1",
              textDecoration: "none",
            }}
          >
            Explore What We Build
          </Link>
        </div>
      </div>

      {/* Perks & Benefits Section */}
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
            Why Engineers &amp; Designers Join Us
          </h2>
          <p className="wsd-section-subtext" style={{ fontSize: "13.5px", color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b" }}>
            A culture founded on craft, high-ownership autonomy, and zero bureaucracy.
          </p>
        </div>

        <div
          className="wsd-perks-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "14px",
          }}
        >
          {PERKS.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div
                key={idx}
                className="wsd-perk-card"
                style={{
                  padding: "20px 18px",
                  borderRadius: "16px",
                  backgroundColor: isDark ? "rgba(13, 19, 34, 0.7)" : "#ffffff",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                  boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(15, 23, 42, 0.04)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  className="wsd-perk-icon-box"
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isDark ? "rgba(37, 99, 235, 0.15)" : "rgba(37, 99, 235, 0.08)",
                    color: "#3b82f6",
                    marginBottom: "12px",
                  }}
                >
                  <Icon size={18} />
                </div>
                <h3 className="wsd-perk-title" style={{ fontSize: "15px", fontWeight: 700, marginBottom: "6px", color: isDark ? "#ffffff" : "#0f172a" }}>
                  {perk.title}
                </h3>
                <p className="wsd-perk-desc" style={{ fontSize: "12.5px", lineHeight: 1.5, color: isDark ? "rgba(255, 255, 255, 0.65)" : "#475569", margin: 0 }}>
                  {perk.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Open Roles Section */}
      <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto 40px", padding: "0 clamp(16px, 4vw, 64px)" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
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
            Current Openings
          </h2>
          <p className="wsd-section-subtext" style={{ fontSize: "13.5px", color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b" }}>
            Explore opportunities across our engineering, design, and operations teams.
          </p>
        </div>

        {/* Filter Tabs - Capsule Container */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
          <div
            className="wsd-dept-tabs"
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
            {departments.map((dept) => {
              const isActive = activeDepartment === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setActiveDepartment(dept)}
                  className="wsd-dept-tab-btn"
                  style={{
                    padding: "6px 16px",
                    borderRadius: "9999px",
                    fontSize: "12.5px",
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
                  {dept}
                </button>
              );
            })}
          </div>
        </div>

        {/* Job Cards or Empty State */}
        {filteredRoles.length === 0 ? (
          <div
            style={{
              padding: "48px 24px",
              textAlign: "center",
              borderRadius: "20px",
              backgroundColor: isDark ? "rgba(13, 19, 34, 0.7)" : "#ffffff",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
              boxShadow: isDark ? "none" : "0 4px 20px -2px rgba(15, 23, 42, 0.04)",
              maxWidth: "680px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "18px",
                backgroundColor: isDark ? "rgba(37, 99, 235, 0.15)" : "rgba(37, 99, 235, 0.08)",
                color: "#3b82f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Briefcase size={28} />
            </div>

            <h3
              style={{
                fontSize: "20px",
                fontWeight: 800,
                color: isDark ? "#ffffff" : "#0f172a",
                marginBottom: "8px",
              }}
            >
              No Open Roles Currently
            </h3>

            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.6,
                color: isDark ? "rgba(255, 255, 255, 0.65)" : "#64748b",
                marginBottom: "24px",
              }}
            >
              We are not actively hiring for this category right now, but we are always eager to discover exceptional software engineers, distributed systems architects, and product designers.
            </p>

            <a
              href={`mailto:${contactInfo.email}?subject=General Application / Resume for WebSmith Digital`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 24px",
                borderRadius: "9999px",
                fontSize: "13.5px",
                fontWeight: 700,
                color: "#ffffff",
                background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                textDecoration: "none",
                boxShadow: "0 6px 20px -4px rgba(37, 99, 235, 0.4)",
              }}
            >
              Submit Open Application <Send size={14} />
            </a>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {filteredRoles.map((role) => (
              <div
                key={role.id}
                onClick={() => setSelectedJob(role)}
                style={{
                  borderRadius: "16px",
                  padding: "20px clamp(16px, 2.5vw, 28px)",
                  backgroundColor: isDark ? "rgba(13, 19, 34, 0.8)" : "#ffffff",
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                  boxShadow: isDark ? "none" : "0 4px 16px -2px rgba(15, 23, 42, 0.04)",
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "18px",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                }}
                className="wsd-job-card"
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: isDark ? "rgba(37, 99, 235, 0.15)" : "rgba(37, 99, 235, 0.08)",
                        color: "#3b82f6",
                      }}
                    >
                      {role.department}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11.5px", color: isDark ? "rgba(255, 255, 255, 0.5)" : "#64748b" }}>
                      <MapPin size={12} /> {role.location}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11.5px", color: isDark ? "rgba(255, 255, 255, 0.5)" : "#64748b" }}>
                      <Clock size={12} /> {role.type} • {role.experience}
                    </div>
                    {role.salary && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11.5px", color: isDark ? "#34d399" : "#059669", fontWeight: 600 }}>
                        <DollarSign size={12} /> {role.salary}
                      </div>
                    )}
                  </div>

                  <h3 className="wsd-role-title" style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px", color: isDark ? "#ffffff" : "#0f172a" }}>
                    {role.title}
                  </h3>

                  <p className="wsd-role-desc" style={{ fontSize: "12.5px", lineHeight: 1.5, color: isDark ? "rgba(255, 255, 255, 0.65)" : "#475569", marginBottom: "12px" }}>
                    {role.description}
                  </p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {role.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="wsd-role-tag"
                        style={{
                          padding: "2px 8px",
                          borderRadius: "5px",
                          fontSize: "10.5px",
                          fontWeight: 500,
                          backgroundColor: isDark ? "rgba(255, 255, 255, 0.04)" : "#f1f5f9",
                          color: isDark ? "#94a3b8" : "#334155",
                          border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="wsd-role-action" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedJob(role);
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: isDark ? "#ffffff" : "#0f172a",
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#f1f5f9",
                      border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #cbd5e1",
                      cursor: "pointer",
                    }}
                  >
                    View Details
                  </button>

                  <a
                    href={`mailto:${role.applyEmail || contactInfo.email}?subject=Application for ${role.title}`}
                    onClick={(e) => e.stopPropagation()}
                    className="wsd-role-apply-btn"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "9px 18px",
                      borderRadius: "10px",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "#ffffff",
                      backgroundColor: "#2563eb",
                      textDecoration: "none",
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    Apply Now <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Role Details Modal */}
      {selectedJob && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setSelectedJob(null)}
        >
          <div
            style={{
              backgroundColor: isDark ? "#0f172a" : "#ffffff",
              color: isDark ? "#ffffff" : "#0f172a",
              borderRadius: "20px",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #e2e8f0",
              width: "100%",
              maxWidth: "720px",
              maxHeight: "88vh",
              overflowY: "auto",
              padding: "32px",
              boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.4)",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: 700,
                      backgroundColor: isDark ? "rgba(37, 99, 235, 0.2)" : "rgba(37, 99, 235, 0.08)",
                      color: "#3b82f6",
                    }}
                  >
                    {selectedJob.department}
                  </span>
                  <span style={{ fontSize: "12.5px", color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={13} /> {selectedJob.location}
                  </span>
                  <span style={{ fontSize: "12.5px", color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={13} /> {selectedJob.type} • {selectedJob.experience}
                  </span>
                  {selectedJob.salary && (
                    <span style={{ fontSize: "12.5px", color: isDark ? "#34d399" : "#059669", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "2px" }}>
                      <DollarSign size={13} /> {selectedJob.salary}
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: "22px", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
                  {selectedJob.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                style={{
                  border: "none",
                  background: isDark ? "rgba(255, 255, 255, 0.08)" : "#f1f5f9",
                  color: isDark ? "#ffffff" : "#0f172a",
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Overview */}
            <div style={{ marginBottom: "22px" }}>
              <h4 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#3b82f6", margin: "0 0 6px 0", fontWeight: 700 }}>
                Role Overview
              </h4>
              <p style={{ fontSize: "14px", lineHeight: 1.6, color: isDark ? "rgba(255, 255, 255, 0.75)" : "#475569", margin: 0 }}>
                {selectedJob.description}
              </p>
            </div>

            {/* Responsibilities */}
            {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
              <div style={{ marginBottom: "22px" }}>
                <h4 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#3b82f6", margin: "0 0 10px 0", fontWeight: 700 }}>
                  Key Responsibilities
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedJob.responsibilities.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(52, 199, 89, 0.12)",
                          color: "#34C759",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      >
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: "13.5px", lineHeight: 1.5, color: isDark ? "rgba(255, 255, 255, 0.85)" : "#334155" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {selectedJob.requirements && selectedJob.requirements.length > 0 && (
              <div style={{ marginBottom: "22px" }}>
                <h4 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#3b82f6", margin: "0 0 10px 0", fontWeight: 700 }}>
                  Requirements &amp; Qualifications
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {selectedJob.requirements.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div
                        style={{
                          width: "18px",
                          height: "18px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(59, 130, 246, 0.12)",
                          color: "#3b82f6",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: "2px",
                        }}
                      >
                        <Check size={11} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: "13.5px", lineHeight: 1.5, color: isDark ? "rgba(255, 255, 255, 0.85)" : "#334155" }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedJob.tags && selectedJob.tags.length > 0 && (
              <div style={{ marginBottom: "26px" }}>
                <h4 style={{ fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#3b82f6", margin: "0 0 8px 0", fontWeight: 700 }}>
                  Tech Stack &amp; Skills
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {selectedJob.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#f1f5f9",
                        color: isDark ? "#cbd5e1" : "#334155",
                        border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                paddingTop: "18px",
                borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #e2e8f0",
              }}
            >
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                style={{
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 600,
                  border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid #cbd5e1",
                  backgroundColor: "transparent",
                  color: isDark ? "#ffffff" : "#0f172a",
                  cursor: "pointer",
                }}
              >
                Close
              </button>

              <a
                href={`mailto:${selectedJob.applyEmail || contactInfo.email}?subject=Application for ${selectedJob.title}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "11px 24px",
                  borderRadius: "10px",
                  fontSize: "13.5px",
                  fontWeight: 700,
                  color: "#ffffff",
                  background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                  textDecoration: "none",
                  boxShadow: "0 6px 20px -4px rgba(37, 99, 235, 0.4)",
                }}
              >
                Apply for this Role <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hiring Process */}
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
            Our Hiring Process
          </h2>
          <p className="wsd-section-subtext" style={{ fontSize: "13.5px", color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b" }}>
            Fast, transparent, and respectful of your time. No multi-month interview loops.
          </p>
        </div>

        <div
          className="wsd-steps-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          {HIRING_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="wsd-step-card"
              style={{
                borderRadius: "16px",
                padding: "16px 14px",
                backgroundColor: isDark ? "rgba(13, 19, 34, 0.6)" : "#ffffff",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
              }}
            >
              <div
                className="wsd-step-number"
                style={{
                  fontSize: "22px",
                  fontWeight: 900,
                  color: isDark ? "rgba(37, 99, 235, 0.4)" : "rgba(37, 99, 235, 0.25)",
                  lineHeight: 1,
                  marginBottom: "6px",
                }}
              >
                {step.number}
              </div>
              <h3 className="wsd-step-title" style={{ fontSize: "14px", fontWeight: 700, marginBottom: "4px", color: isDark ? "#ffffff" : "#0f172a" }}>
                {step.title}
              </h3>
              <p className="wsd-step-desc" style={{ fontSize: "12px", lineHeight: 1.45, color: isDark ? "rgba(255, 255, 255, 0.6)" : "#64748b", margin: 0 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Card */}
      <div style={{ width: "100%", maxWidth: "100%", margin: "40px auto 0", padding: "0 clamp(16px, 4vw, 64px)" }}>
        <div
          className="wsd-careers-cta"
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
            className="wsd-careers-cta-title"
            style={{
              fontSize: "clamp(20px, 2.5vw, 28px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              marginBottom: "10px",
              color: isDark ? "#ffffff" : "#0f172a",
            }}
          >
            Don&apos;t see your specific role listed?
          </h2>
          <p
            className="wsd-careers-cta-desc"
            style={{
              fontSize: "14px",
              color: isDark ? "rgba(255, 255, 255, 0.7)" : "#475569",
              maxWidth: "600px",
              margin: "0 auto 20px",
              lineHeight: 1.55,
            }}
          >
            We are always interested in connecting with world-class engineers, architects, and designers. Send an open application directly to our talent team.
          </p>

          <a
            href={`mailto:${contactInfo.email}?subject=General Application / Portfolio Submission`}
            className="wsd-careers-cta-btn"
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
              textDecoration: "none",
              boxShadow: "0 6px 20px -4px rgba(37, 99, 235, 0.4)",
            }}
          >
            Send General Application <Send size={15} />
          </a>
        </div>
      </div>

      <style>{`
        .wsd-job-card:hover {
          border-color: rgba(37, 99, 235, 0.35) !important;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .wsd-careers-page {
            padding-top: 70px !important;
            padding-bottom: 24px !important;
          }
          .wsd-careers-hero-title {
            font-size: 18px !important;
            line-height: 1.18 !important;
            margin-bottom: 4px !important;
          }
          .wsd-careers-hero-desc {
            font-size: 10px !important;
            line-height: 1.3 !important;
            margin-bottom: 10px !important;
          }
          .wsd-careers-hero-btns {
            gap: 6px !important;
            margin-bottom: 16px !important;
          }
          .wsd-careers-btn-primary, .wsd-careers-btn-secondary {
            padding: 7px 14px !important;
            font-size: 10.5px !important;
          }
          .wsd-section-heading {
            font-size: 15px !important;
            margin-bottom: 2px !important;
          }
          .wsd-section-subtext {
            font-size: 10px !important;
            margin-bottom: 10px !important;
          }
          .wsd-perks-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
            margin-bottom: 18px !important;
          }
          .wsd-perk-card {
            padding: 8px 6px !important;
            border-radius: 10px !important;
          }
          .wsd-perk-icon-box {
            width: 24px !important;
            height: 24px !important;
            margin-bottom: 4px !important;
          }
          .wsd-perk-title {
            font-size: 11px !important;
            margin-bottom: 3px !important;
          }
          .wsd-perk-desc {
            font-size: 9px !important;
            line-height: 1.25 !important;
          }
          .wsd-dept-tabs {
            flex-wrap: wrap !important;
            overflow-x: visible !important;
            justify-content: center !important;
            width: 100% !important;
            gap: 4px !important;
            margin-bottom: 12px !important;
          }
          .wsd-dept-tab-btn {
            padding: 4px 10px !important;
            font-size: 10.5px !important;
          }
          .wsd-job-card {
            grid-template-columns: 1fr !important;
            padding: 10px 8px !important;
            gap: 8px !important;
            border-radius: 10px !important;
          }
          .wsd-role-title {
            font-size: 12.5px !important;
            margin-bottom: 3px !important;
          }
          .wsd-role-desc {
            font-size: 9.5px !important;
            line-height: 1.3 !important;
            margin-bottom: 6px !important;
          }
          .wsd-role-tag {
            font-size: 9px !important;
            padding: 2px 5px !important;
          }
          .wsd-role-action {
            justify-content: stretch !important;
          }
          .wsd-role-apply-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 7px 12px !important;
            font-size: 10.5px !important;
          }
          .wsd-steps-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 6px !important;
            margin-bottom: 18px !important;
          }
          .wsd-step-card {
            padding: 8px 6px !important;
            border-radius: 10px !important;
          }
          .wsd-step-number {
            font-size: 16px !important;
            margin-bottom: 2px !important;
          }
          .wsd-step-title {
            font-size: 11px !important;
            margin-bottom: 2px !important;
          }
          .wsd-step-desc {
            font-size: 9px !important;
            line-height: 1.25 !important;
          }
          .wsd-careers-cta {
            margin-top: 14px !important;
            padding: 14px 10px !important;
            border-radius: 12px !important;
          }
          .wsd-careers-cta-title {
            font-size: 15px !important;
            margin-bottom: 4px !important;
          }
          .wsd-careers-cta-desc {
            font-size: 10px !important;
            margin-bottom: 10px !important;
          }
          .wsd-careers-cta-btn {
            padding: 8px 16px !important;
            font-size: 11px !important;
          }
        }
      `}</style>
    </div>
  );
}
