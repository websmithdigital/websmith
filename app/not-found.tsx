import Link from "next/link";
import { ArrowLeft, Home, Briefcase, ShoppingBag, LifeBuoy, Layers } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
        background: "radial-gradient(ellipse at top, rgba(30, 41, 59, 0.4) 0%, rgba(10, 15, 30, 0.98) 100%)",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "48px 36px",
          borderRadius: "24px",
          backgroundColor: "rgba(15, 23, 42, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 50px rgba(59, 130, 246, 0.12)",
          textAlign: "center",
        }}
      >
        {/* Glow Status Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "999px",
            backgroundColor: "rgba(59, 130, 246, 0.12)",
            border: "1px solid rgba(59, 130, 246, 0.25)",
            fontSize: "12px",
            fontWeight: 700,
            color: "#60a5fa",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "16px",
          }}
        >
          404 — Route Not Found
        </div>

        {/* 404 Large Numeric Headline */}
        <div
          style={{
            fontSize: "clamp(64px, 10vw, 96px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            marginBottom: "12px",
            background: "linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </div>

        <h1
          style={{
            fontSize: "clamp(20px, 3.5vw, 26px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "12px",
            color: "#ffffff",
          }}
        >
          The page you requested does not exist
        </h1>

        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
            color: "rgba(203, 213, 225, 0.8)",
            marginBottom: "32px",
          }}
        >
          The destination URL may have been relocated, renamed, or is temporarily unavailable. Explore our primary platform destinations below:
        </p>

        {/* Direct Navigation Links Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "10px",
            marginBottom: "32px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              padding: "14px 10px",
              borderRadius: "14px",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#f8fafc",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 500,
              transition: "background-color 0.15s ease, border-color 0.15s ease",
            }}
          >
            <Home size={18} color="#38bdf8" />
            Home
          </Link>

          <Link
            href="/services"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              padding: "14px 10px",
              borderRadius: "14px",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#f8fafc",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 500,
              transition: "background-color 0.15s ease, border-color 0.15s ease",
            }}
          >
            <Layers size={18} color="#818cf8" />
            Services
          </Link>

          <Link
            href="/portfolio"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              padding: "14px 10px",
              borderRadius: "14px",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#f8fafc",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 500,
              transition: "background-color 0.15s ease, border-color 0.15s ease",
            }}
          >
            <Briefcase size={18} color="#34d399" />
            Portfolio
          </Link>

          <Link
            href="/software-store"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              padding: "14px 10px",
              borderRadius: "14px",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "#f8fafc",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 500,
              transition: "background-color 0.15s ease, border-color 0.15s ease",
            }}
          >
            <ShoppingBag size={18} color="#fbbf24" />
            Store
          </Link>
        </div>

        {/* Primary CTA */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 24px",
              borderRadius: "12px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
              transition: "background-color 0.15s ease",
            }}
          >
            <ArrowLeft size={16} />
            Return to Main Website
          </Link>

          <Link
            href="/support"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              color: "rgba(226, 232, 240, 0.9)",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "background-color 0.15s ease",
            }}
          >
            <LifeBuoy size={16} />
            Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}
