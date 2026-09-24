"use client";

import React from "react";
import CareerManageSection from "@/components/admin/CareerManageSection";

export default function AdminCareersPage() {
  return (
    <div className="wsd-page admin-panel-scope">
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Careers Management</h1>
          <p style={styles.subtitle}>
            Create, update, and manage job openings displayed on the public website.
          </p>
        </div>
      </header>

      <CareerManageSection />
    </div>
  );
}

const styles: any = {
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
