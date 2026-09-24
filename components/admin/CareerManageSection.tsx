"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  MapPin,
  Clock,
  DollarSign,
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Layers,
  Building,
} from "lucide-react";
import API from "@/core/services/apiService";
import type { JobRole } from "@/lib/careers-data";
import { usePersistedTab } from "@/hooks/usePersistedTab";

export default function CareerManageSection() {
  const [jobs, setJobs] = useState<JobRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStatus, setSelectedStatus] = usePersistedTab<"All" | "Active" | "Inactive">("All", {
    paramName: "status",
    allowedTabs: ["All", "Active", "Inactive"],
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobRole | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    department: "Engineering",
    location: "Remote",
    type: "Full-Time",
    experience: "3+ Years",
    salary: "",
    description: "",
    responsibilities: "",
    requirements: "",
    tags: "",
    isActive: true,
    applyEmail: "",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/careers?all=true");
      if (res.data?.data) {
        setJobs(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load jobs", err);
      showToast("error", "Failed to load job openings");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData({
      title: "",
      department: "Engineering",
      location: "Remote",
      type: "Full-Time",
      experience: "3+ Years",
      salary: "",
      description: "",
      responsibilities: "",
      requirements: "",
      tags: "",
      isActive: true,
      applyEmail: "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (job: JobRole) => {
    setEditingJob(job);
    setFormData({
      title: job.title || "",
      department: job.department || "Engineering",
      location: job.location || "Remote",
      type: job.type || "Full-Time",
      experience: job.experience || "3+ Years",
      salary: job.salary || "",
      description: job.description || "",
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join("\n") : "",
      requirements: Array.isArray(job.requirements) ? job.requirements.join("\n") : "",
      tags: Array.isArray(job.tags) ? job.tags.join(", ") : "",
      isActive: job.isActive !== false,
      applyEmail: job.applyEmail || "",
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Job title is required");
      return;
    }

    setIsSaving(true);
    setFormError(null);

    const payload = {
      title: formData.title.trim(),
      department: formData.department.trim(),
      location: formData.location.trim(),
      type: formData.type.trim(),
      experience: formData.experience.trim(),
      salary: formData.salary.trim() || undefined,
      description: formData.description.trim(),
      responsibilities: formData.responsibilities
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      requirements: formData.requirements
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      tags: formData.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      isActive: formData.isActive,
      applyEmail: formData.applyEmail.trim() || undefined,
    };

    try {
      if (editingJob) {
        await API.put(`/careers/${editingJob.id}`, payload);
        showToast("success", `Updated "${payload.title}" successfully`);
      } else {
        await API.post("/careers", payload);
        showToast("success", `Created "${payload.title}" successfully`);
      }
      setIsModalOpen(false);
      fetchJobs();
    } catch (err: any) {
      console.error("Save error:", err);
      setFormError(err.response?.data?.error || "Failed to save job opening");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (job: JobRole) => {
    const nextState = !job.isActive;
    try {
      await API.put(`/careers/${job.id}`, { isActive: nextState });
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, isActive: nextState } : j))
      );
      showToast("success", `${job.title} is now ${nextState ? "Active" : "Inactive"}`);
    } catch (err) {
      console.error("Status toggle error:", err);
      showToast("error", "Failed to update role status");
    }
  };

  const handleDelete = async (job: JobRole) => {
    if (!confirm(`Are you sure you want to delete "${job.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await API.delete(`/careers/${job.id}`);
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      showToast("success", `Deleted "${job.title}"`);
    } catch (err) {
      console.error("Delete error:", err);
      showToast("error", "Failed to delete opening");
    }
  };

  // Filter calculations
  const departments = ["All", ...Array.from(new Set(jobs.map((j) => j.department).filter(Boolean)))];

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDept = selectedDept === "All" || job.department === selectedDept;
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Active" && job.isActive !== false) ||
      (selectedStatus === "Inactive" && job.isActive === false);

    return matchesSearch && matchesDept && matchesStatus;
  });

  const activeCount = jobs.filter((j) => j.isActive !== false).length;

  return (
    <div style={styles.card} className="admin-card">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            ...styles.toast,
            backgroundColor: toastMessage.type === "success" ? "#34C759" : "#FF3B30",
          }}
        >
          {toastMessage.text}
        </div>
      )}

      {/* Header */}
      <div style={styles.cardHeader}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          {/* Left: Title & Subtitle */}
          <div style={{ flex: "1 1 300px", maxWidth: "520px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={styles.iconChip}>
                <Briefcase size={20} color="#007AFF" />
              </div>
              <h2 style={styles.cardTitle}>Career &amp; Job Openings</h2>
            </div>
            <p style={styles.cardSubtitle}>
              Manage open positions published on the public <code>/careers</code> page. Toggle roles active or inactive, or add comprehensive role requirements.
            </p>
          </div>

          {/* Right: Stats Strip (4 boxes) + Action Buttons (2 buttons) side by side */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            {/* Stats Strip */}
            <div style={styles.statsStrip}>
              <div style={styles.statBox}>
                <span style={styles.statNumber}>{jobs.length}</span>
                <span style={styles.statLabel}>Total Roles</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statBox}>
                <span style={{ ...styles.statNumber, color: "#34C759" }}>{activeCount}</span>
                <span style={styles.statLabel}>Active &amp; Hiring</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statBox}>
                <span style={{ ...styles.statNumber, color: "#8E8E93" }}>{jobs.length - activeCount}</span>
                <span style={styles.statLabel}>Inactive / Draft</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statBox}>
                <span style={styles.statNumber}>{departments.length - 1}</span>
                <span style={styles.statLabel}>Departments</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Link
                href="/careers"
                target="_blank"
                style={styles.previewBtn}
              >
                <ExternalLink size={14} />
                View Public Page
              </Link>

              <button
                type="button"
                onClick={openCreateModal}
                style={styles.primaryBtn}
              >
                <Plus size={16} />
                Add Job Opening
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={15} color="var(--text-secondary)" style={{ marginLeft: "12px" }} />
          <input
            type="text"
            placeholder="Search by title, skill tag, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            style={styles.selectFilter}
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === "All" ? "All Departments" : dept}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            style={styles.selectFilter}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Roles List */}
      {isLoading ? (
        <div style={styles.loadingBox}>Loading job openings...</div>
      ) : filteredJobs.length === 0 ? (
        <div style={styles.emptyBox}>
          <AlertCircle size={36} color="var(--text-secondary)" />
          <h4 style={{ margin: "10px 0 4px 0", fontSize: "16px", color: "var(--text-primary)" }}>
            No job openings match your filter
          </h4>
          <p style={{ margin: 0, fontSize: "13.5px", color: "var(--text-secondary)" }}>
            Try changing the search query or post a new job opening.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              style={{
                ...styles.jobRow,
                opacity: job.isActive !== false ? 1 : 0.65,
                borderColor: job.isActive !== false ? "var(--border-color)" : "rgba(142, 142, 147, 0.3)",
              }}
            >
              <div style={{ flex: 1, minWidth: "260px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: job.isActive !== false ? "rgba(52, 199, 89, 0.12)" : "rgba(142, 142, 147, 0.14)",
                      color: job.isActive !== false ? "#34C759" : "#8E8E93",
                    }}
                  >
                    {job.isActive !== false ? "Active" : "Inactive"}
                  </span>
                  <span style={styles.deptBadge}>{job.department}</span>
                  <span style={styles.metaChip}>
                    <MapPin size={11} /> {job.location}
                  </span>
                  <span style={styles.metaChip}>
                    <Clock size={11} /> {job.type} • {job.experience}
                  </span>
                  {job.salary && (
                    <span style={styles.metaChip}>
                      <DollarSign size={11} /> {job.salary}
                    </span>
                  )}
                </div>

                <h3 style={styles.jobTitle}>{job.title}</h3>
                <p style={styles.jobDesc}>{job.description}</p>

                {job.tags && job.tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}>
                    {job.tags.map((tag, idx) => (
                      <span key={idx} style={styles.tagPill}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={styles.jobActions}>
                <button
                  type="button"
                  onClick={() => handleToggleActive(job)}
                  style={{
                    ...styles.actionBtn,
                    color: job.isActive !== false ? "#FF9500" : "#34C759",
                    backgroundColor: "var(--bg-primary)",
                  }}
                  title={job.isActive !== false ? "Mark as Inactive" : "Publish Active"}
                >
                  {job.isActive !== false ? <XCircle size={15} /> : <CheckCircle size={15} />}
                  <span>{job.isActive !== false ? "Deactivate" : "Activate"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => openEditModal(job)}
                  style={{ ...styles.actionBtn, color: "#007AFF", backgroundColor: "var(--bg-primary)" }}
                  title="Edit Opening"
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(job)}
                  style={{ ...styles.actionBtn, color: "#FF3B30", backgroundColor: "var(--bg-primary)" }}
                  title="Delete Opening"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create / Edit */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingJob ? "Edit Job Opening" : "Create New Job Opening"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={styles.modalCloseBtn}
              >
                ✕
              </button>
            </div>

            {formError && (
              <div style={styles.formErrorBox}>
                <AlertCircle size={15} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={styles.formGrid}>
                <div style={styles.fieldCol}>
                  <label style={styles.label}>Job Title *</label>
                  <input
                    type="text"
                    required
                    style={styles.modalInput}
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Full-Stack Engineer"
                  />
                </div>

                <div style={styles.fieldCol}>
                  <label style={styles.label}>Department</label>
                  <input
                    type="text"
                    style={styles.modalInput}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Engineering, Design, Sales"
                  />
                </div>
              </div>

              <div style={styles.formGrid3}>
                <div style={styles.fieldCol}>
                  <label style={styles.label}>Location</label>
                  <input
                    type="text"
                    style={styles.modalInput}
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Remote, Hybrid, Kolkata HQ"
                  />
                </div>

                <div style={styles.fieldCol}>
                  <label style={styles.label}>Work Type</label>
                  <select
                    style={styles.modalInput}
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div style={styles.fieldCol}>
                  <label style={styles.label}>Experience Level</label>
                  <input
                    type="text"
                    style={styles.modalInput}
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g. 3+ Years, Senior"
                  />
                </div>
              </div>

              <div style={styles.formGrid}>
                <div style={styles.fieldCol}>
                  <label style={styles.label}>Salary / Compensation (Optional)</label>
                  <input
                    type="text"
                    style={styles.modalInput}
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g. $60,000 - $85,000 / Competitive"
                  />
                </div>

                <div style={styles.fieldCol}>
                  <label style={styles.label}>Application Email (Optional)</label>
                  <input
                    type="email"
                    style={styles.modalInput}
                    value={formData.applyEmail}
                    onChange={(e) => setFormData({ ...formData, applyEmail: e.target.value })}
                    placeholder="e.g. careers@websmithdigital.com"
                  />
                </div>
              </div>

              <div style={styles.fieldCol}>
                <label style={styles.label}>Short Role Overview</label>
                <textarea
                  style={{ ...styles.modalTextarea, minHeight: "75px" }}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Overview of the mission, day-to-day work, and impact of this role..."
                />
              </div>

              <div style={styles.fieldCol}>
                <label style={styles.label}>
                  Key Responsibilities <span style={styles.hint}>(1 per line)</span>
                </label>
                <textarea
                  style={{ ...styles.modalTextarea, minHeight: "80px" }}
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  placeholder="Design and maintain full-stack Next.js apps&#10;Lead sprint cadences and mentor developers&#10;Optimize database queries and background queues"
                />
              </div>

              <div style={styles.fieldCol}>
                <label style={styles.label}>
                  Requirements &amp; Qualifications <span style={styles.hint}>(1 per line)</span>
                </label>
                <textarea
                  style={{ ...styles.modalTextarea, minHeight: "80px" }}
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder="3+ years of TypeScript and React experience&#10;Solid understanding of relational databases&#10;Strong communication and problem solving"
                />
              </div>

              <div style={styles.fieldCol}>
                <label style={styles.label}>
                  Skill Tags <span style={styles.hint}>(comma separated)</span>
                </label>
                <input
                  type="text"
                  style={styles.modalInput}
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Next.js, TypeScript, PostgreSQL, Docker"
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={{ width: "18px", height: "18px", cursor: "pointer", accentColor: "#007AFF" }}
                />
                <label htmlFor="isActiveToggle" style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", cursor: "pointer" }}>
                  Publish as Active Opening (visible to candidates on /careers)
                </label>
              </div>

              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={styles.saveSubmitBtn}
                >
                  {isSaving ? "Saving..." : editingJob ? "Update Opening" : "Publish Opening"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: any = {
  card: {
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "32px",
    position: "relative",
  },
  cardHeader: {
    marginBottom: "24px",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "20px",
  },
  iconChip: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  cardSubtitle: {
    margin: "8px 0 0 0",
    fontSize: "14px",
    color: "var(--text-secondary)",
    lineHeight: 1.5,
  },
  previewBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "9px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-primary)",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    textDecoration: "none",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "9px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#ffffff",
    backgroundColor: "#007AFF",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 122, 255, 0.3)",
  },
  statsStrip: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "6px 14px",
    borderRadius: "10px",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
  },
  statBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1px",
    minWidth: "48px",
  },
  statNumber: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--text-primary)",
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: "10.5px",
    color: "var(--text-secondary)",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  statDivider: {
    width: "1px",
    height: "22px",
    backgroundColor: "var(--border-color)",
  },
  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-primary)",
    flex: "1 1 280px",
  },
  searchInput: {
    width: "100%",
    padding: "9px 12px",
    border: "none",
    background: "transparent",
    color: "var(--text-primary)",
    fontSize: "13.5px",
    outline: "none",
  },
  selectFilter: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontSize: "13px",
    fontWeight: 500,
    outline: "none",
    cursor: "pointer",
  },
  loadingBox: {
    padding: "40px 0",
    textAlign: "center",
    color: "var(--text-secondary)",
    fontSize: "14px",
  },
  emptyBox: {
    padding: "48px 24px",
    textAlign: "center",
    borderRadius: "12px",
    border: "1px dashed var(--border-color)",
    backgroundColor: "var(--bg-primary)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  jobRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    padding: "16px 20px",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-primary)",
    flexWrap: "wrap",
    transition: "all 0.15s ease",
  },
  statusBadge: {
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },
  deptBadge: {
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "11.5px",
    fontWeight: 600,
    backgroundColor: "rgba(0, 122, 255, 0.08)",
    color: "#007AFF",
  },
  metaChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  jobTitle: {
    margin: "4px 0 4px 0",
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  jobDesc: {
    margin: 0,
    fontSize: "13px",
    color: "var(--text-secondary)",
    lineHeight: 1.45,
  },
  tagPill: {
    padding: "2px 7px",
    borderRadius: "4px",
    fontSize: "11px",
    fontWeight: 500,
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-color)",
  },
  jobActions: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexShrink: 0,
  },
  actionBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "7px 12px",
    borderRadius: "7px",
    border: "1px solid var(--border-color)",
    fontSize: "12.5px",
    fontWeight: 600,
    cursor: "pointer",
  },
  toast: {
    position: "absolute",
    top: "16px",
    right: "20px",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 10,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
    width: "100%",
    maxWidth: "680px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "28px",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.25)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
    paddingBottom: "14px",
    borderBottom: "1px solid var(--border-color)",
  },
  modalTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  modalCloseBtn: {
    border: "none",
    background: "transparent",
    fontSize: "18px",
    cursor: "pointer",
    color: "var(--text-secondary)",
  },
  formErrorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 14px",
    borderRadius: "8px",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    color: "#FF3B30",
    fontSize: "13px",
    fontWeight: 500,
    marginBottom: "14px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "14px",
  },
  formGrid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  fieldCol: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  hint: {
    fontSize: "11.5px",
    color: "var(--text-secondary)",
    fontWeight: 400,
  },
  modalInput: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
  },
  modalTextarea: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    fontSize: "13.5px",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: 1.45,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid var(--border-color)",
  },
  cancelBtn: {
    padding: "9px 18px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    backgroundColor: "transparent",
    color: "var(--text-primary)",
    fontSize: "13.5px",
    fontWeight: 600,
    cursor: "pointer",
  },
  saveSubmitBtn: {
    padding: "9px 22px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#007AFF",
    color: "#ffffff",
    fontSize: "13.5px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 122, 255, 0.3)",
  },
};
