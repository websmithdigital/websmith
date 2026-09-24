"use client";

import React from "react";
import BlogManageSection from "@/components/admin/BlogManageSection";

export default function AdminBlogsPage() {
  return (
    <div className="wsd-page admin-panel-scope">
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Blog Management</h1>
          <p style={styles.subtitle}>
            Compose, edit, and publish rich articles, architectural blueprints, and engineering updates.
          </p>
        </div>
      </header>

      <BlogManageSection />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: "28px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 800,
    color: "var(--text-primary)",
    margin: 0,
    marginBottom: "8px",
    letterSpacing: "-1px",
  },
  subtitle: {
    fontSize: "15px",
    color: "var(--text-secondary)",
    margin: 0,
  },
};
