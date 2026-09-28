"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, LifeBuoy } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected client runtime errors to server/console
    console.error("WebSmith Global Error Boundary Caught:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        background: "radial-gradient(ellipse at top, rgba(30, 41, 59, 0.4) 0%, rgba(10, 15, 30, 0.95) 100%)",
        color: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          width: "100%",
          padding: "40px 32px",
          borderRadius: "20px",
          backgroundColor: "rgba(15, 23, 42, 0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(239, 68, 68, 0.12)",
          textAlign: "center",
        }}
      >
        {/* Glow Warning Icon */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            color: "#f87171",
          }}
        >
          <AlertTriangle size={32} />
        </div>

        <div
          style={{
            display: "inline-block",
            padding: "4px 12px",
            borderRadius: "999px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            fontSize: "12px",
            fontWeight: 600,
            color: "#fca5a5",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: "12px",
          }}
        >
          Application Error
        </div>

        <h1
          style={{
            fontSize: "clamp(24px, 4vw, 30px)",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            marginBottom: "10px",
            color: "#ffffff",
          }}
        >
          Something went wrong
        </h1>

        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
            color: "rgba(226, 232, 240, 0.8)",
            marginBottom: "28px",
          }}
        >
          An unexpected runtime condition occurred. Our telemetry logs have captured this incident. You can safely retry or return to the main portal.
        </p>

        {error?.digest && (
          <div
            style={{
              padding: "8px 12px",
              backgroundColor: "rgba(0, 0, 0, 0.35)",
              borderRadius: "8px",
              fontSize: "11px",
              fontFamily: "monospace",
              color: "rgba(148, 163, 184, 0.8)",
              marginBottom: "24px",
              wordBreak: "break-all",
              border: "1px solid rgba(255, 255, 255, 0.05)",
            }}
          >
            Incident Reference: {error.digest}
          </div>
        )}

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            onClick={() => reset()}
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
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
              transition: "transform 0.15s ease, background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1d4ed8")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
          >
            <RotateCcw size={16} />
            Try Again
          </button>

          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.07)",
              color: "#f8fafc",
              fontSize: "14px",
              fontWeight: 500,
              border: "1px solid rgba(255, 255, 255, 0.12)",
              textDecoration: "none",
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.07)")}
          >
            <Home size={16} />
            Back to Home
          </Link>

          <Link
            href="/support"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              borderRadius: "12px",
              backgroundColor: "transparent",
              color: "rgba(148, 163, 184, 0.9)",
              fontSize: "14px",
              fontWeight: 500,
              textDecoration: "none",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(148, 163, 184, 0.9)")}
          >
            <LifeBuoy size={16} />
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
