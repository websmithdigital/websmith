"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Tag,
  CheckCircle,
  XCircle,
  Eye,
  Columns,
  Code,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  Image as ImageIcon,
  Smile,
  Minus,
  Sparkles,
  Clock,
  Layers,
  Check,
  X,
  Calendar,
  User,
  Share2,
} from "lucide-react";
import API from "@/core/services/apiService";
import { BLOG_CATEGORIES, type BlogPost } from "@/lib/blog-data";
import MarkdownRenderer from "../blog/MarkdownRenderer";
import { usePersistedTab } from "@/hooks/usePersistedTab";

const POPULAR_EMOJIS = [
  "🚀", "💡", "✨", "🔥", "⚡", "🎯", "📈", "🤖", "🛡️", "🌐",
  "📝", "❤️", "👏", "👥", "📌", "🌟", "💎", "🎉", "📦", "⚙️",
  "🔍", "💬", "🏆", "🛠️", "🎨", "📊", "⏳", "🔑", "💻", "☁️",
  "✅", "⚠️", "🚨", "🔒", "🧪", "🌍", "📱", "💼", "🧠", "🔮"
];

const PRESET_COVERS = [
  { label: "AI & Neural", url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80" },
  { label: "Code & Web", url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80" },
  { label: "Cloud & Cyber", url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80" },
  { label: "Architecture", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80" },
];

export default function BlogManageSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = usePersistedTab<"All" | "Published" | "Draft">("All", {
    paramName: "blog_status",
    allowedTabs: ["All", "Published", "Draft"],
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Editor View Mode: "edit" | "preview" | "split"
  const [editorMode, setEditorMode] = useState<"edit" | "preview" | "split">("split");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageInputUrl, setImageInputUrl] = useState("");
  const [imageInputAlt, setImageInputAlt] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: PRESET_COVERS[0].url,
    category: "AI & Automation",
    tags: "",
    authorName: "WebSmith Team",
    authorRole: "Technical Architect",
    authorAvatar: "",
    isPublished: true,
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await API.get("/blogs?all=true");
      if (res.data?.data) {
        setBlogs(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load blogs", err);
      showToast("error", "Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (type: "success" | "error", text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: `# New Article Title 🚀\n\nStart writing your article here with rich text, code snippets, photos, and bullet lists...\n\n## Section 1: Overview\n\n- Key engineering milestone\n- Scalable architecture\n\n> "Add inspirational quotes or critical takeaways here."`,
      coverImage: PRESET_COVERS[0].url,
      category: "AI & Automation",
      tags: "Engineering, Digital, Innovation",
      authorName: "WebSmith Team",
      authorRole: "Technical Architect",
      authorAvatar: "",
      isPublished: true,
    });
    setEditorMode("split");
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (blog: BlogPost) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      coverImage: blog.coverImage,
      category: blog.category,
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      authorName: blog.author?.name || "WebSmith Team",
      authorRole: blog.author?.role || "Engineering",
      authorAvatar: blog.author?.avatar || "",
      isPublished: blog.isPublished,
    });
    setEditorMode("split");
    setFormError(null);
    setIsModalOpen(true);
  };

  // Helper to insert markdown tokens at cursor
  const insertTextAtCursor = (prefix: string, suffix: string = "", placeholder: string = "") => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end);
    const replacement = selected ? `${prefix}${selected}${suffix}` : `${prefix}${placeholder}${suffix}`;

    const newContent = el.value.substring(0, start) + replacement + el.value.substring(end);
    setFormData((prev) => ({ ...prev, content: newContent }));

    setTimeout(() => {
      el.focus();
      const newCursor = start + prefix.length + (selected ? selected.length : placeholder.length);
      el.setSelectionRange(newCursor, newCursor);
    }, 10);
  };

  const insertEmoji = (emoji: string) => {
    insertTextAtCursor(emoji);
    setShowEmojiPicker(false);
  };

  const insertImage = () => {
    if (!imageInputUrl.trim()) return;
    const alt = imageInputAlt.trim() || "Image description";
    insertTextAtCursor(`\n![${alt}](${imageInputUrl.trim()})\n`);
    setImageInputUrl("");
    setImageInputAlt("");
    setShowImageDialog(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError("Title is required");
      return;
    }

    if (!formData.content.trim()) {
      setFormError("Blog content cannot be empty");
      return;
    }

    setIsSaving(true);

    const payload = {
      title: formData.title.trim(),
      slug: formData.slug.trim() || undefined,
      excerpt: formData.excerpt.trim(),
      content: formData.content,
      coverImage: formData.coverImage.trim(),
      category: formData.category,
      tags: formData.tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      author: {
        name: formData.authorName.trim(),
        role: formData.authorRole.trim(),
        avatar: formData.authorAvatar.trim() || undefined,
      },
      isPublished: formData.isPublished,
    };

    try {
      if (editingBlog) {
        await API.put(`/blogs/${editingBlog.id}`, payload);
        showToast("success", `Updated "${payload.title}" successfully`);
      } else {
        await API.post("/blogs", payload);
        showToast("success", `Published "${payload.title}" successfully`);
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (err: any) {
      console.error("Save error:", err);
      setFormError(err.response?.data?.error || "Failed to save blog post");
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (blog: BlogPost) => {
    const nextState = !blog.isPublished;
    try {
      await API.put(`/blogs/${blog.id}`, { isPublished: nextState });
      setBlogs((prev) =>
        prev.map((b) => (b.id === blog.id ? { ...b, isPublished: nextState } : b))
      );
      showToast("success", `${blog.title} is now ${nextState ? "Published" : "Draft"}`);
    } catch (err) {
      console.error("Status toggle error:", err);
      showToast("error", "Failed to update publication status");
    }
  };

  const handleDelete = async (blog: BlogPost) => {
    if (!confirm(`Are you sure you want to delete "${blog.title}"? This cannot be undone.`)) {
      return;
    }
    try {
      await API.delete(`/blogs/${blog.id}`);
      setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
      showToast("success", `Deleted "${blog.title}"`);
    } catch (err) {
      console.error("Delete error:", err);
      showToast("error", "Failed to delete blog post");
    }
  };

  // Filter calculations
  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)))];

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || blog.category === selectedCategory;
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Published" && blog.isPublished) ||
      (selectedStatus === "Draft" && !blog.isPublished);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const publishedCount = blogs.filter((b) => b.isPublished).length;

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
                <BookOpen size={20} color="#007AFF" />
              </div>
              <h2 style={styles.cardTitle}>Blog &amp; Knowledge Base</h2>
            </div>
            <p style={styles.cardSubtitle}>
              Write, edit, and publish rich technical articles accessible by public visitors at <code>/blog</code>.
            </p>
          </div>

          {/* Right: Stats Strip (4 boxes) + Action Buttons (2 buttons) */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            {/* Stats Strip */}
            <div style={styles.statsStrip}>
              <div style={styles.statBox}>
                <span style={styles.statNumber}>{blogs.length}</span>
                <span style={styles.statLabel}>Total Articles</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statBox}>
                <span style={{ ...styles.statNumber, color: "#34C759" }}>{publishedCount}</span>
                <span style={styles.statLabel}>Published</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statBox}>
                <span style={{ ...styles.statNumber, color: "#8E8E93" }}>{blogs.length - publishedCount}</span>
                <span style={styles.statLabel}>Drafts</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statBox}>
                <span style={styles.statNumber}>{categories.length - 1}</span>
                <span style={styles.statLabel}>Categories</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Link href="/blog" target="_blank" style={styles.previewBtn}>
                <ExternalLink size={14} />
                View Public Blog
              </Link>

              <button type="button" onClick={openCreateModal} style={styles.primaryBtn}>
                <Plus size={16} />
                New Blog Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={16} color="var(--text-secondary)" style={{ marginLeft: "12px" }} />
          <input
            type="text"
            placeholder="Search articles by title, tag, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={styles.selectFilter}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Categories" : c}
              </option>
            ))}
          </select>

          {/* Status Tabs */}
          <div style={styles.statusTabGroup}>
            {(["All", "Published", "Draft"] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                style={{
                  ...styles.statusTabBtn,
                  backgroundColor: selectedStatus === status ? "#007AFF" : "transparent",
                  color: selectedStatus === status ? "#ffffff" : "var(--text-secondary)",
                }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blogs Grid */}
      {isLoading ? (
        <div style={styles.loadingBox}>
          <div className="admin-spinner" style={styles.spinner} />
          <p>Loading articles from database...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div style={styles.emptyState}>
          <BookOpen size={48} color="var(--text-secondary)" style={{ opacity: 0.5, marginBottom: "12px" }} />
          <h3 style={styles.emptyTitle}>No Articles Found</h3>
          <p style={styles.emptyText}>
            {searchTerm || selectedCategory !== "All" || selectedStatus !== "All"
              ? "No articles match your active filter criteria."
              : "No blog posts published yet. Create your first engineering article!"}
          </p>
          <button type="button" onClick={openCreateModal} style={styles.primaryBtn}>
            <Plus size={16} />
            Create First Article
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredBlogs.map((blog) => (
            <div key={blog.id} style={styles.blogCard} className="admin-job-card">
              {/* Cover Image */}
              <div style={styles.cardCoverWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={blog.coverImage} alt={blog.title} style={styles.cardCover} />
                <div style={styles.coverBadgeRow}>
                  <span style={styles.categoryBadge}>{blog.category}</span>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: blog.isPublished ? "rgba(52, 199, 89, 0.9)" : "rgba(142, 142, 147, 0.9)",
                    }}
                  >
                    {blog.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={styles.cardBody}>
                <div style={styles.metaRow}>
                  <span style={styles.metaItem}>
                    <Clock size={12} />
                    {blog.readTime}
                  </span>
                  <span style={styles.metaItem}>
                    <Calendar size={12} />
                    {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h3 style={styles.blogTitle}>{blog.title}</h3>
                <p style={styles.blogExcerpt}>{blog.excerpt}</p>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                  <div style={styles.tagsRow}>
                    {blog.tags.slice(0, 3).map((t, idx) => (
                      <span key={idx} style={styles.tagPill}>
                        #{t}
                      </span>
                    ))}
                    {blog.tags.length > 3 && (
                      <span style={styles.tagPill}>+{blog.tags.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Author & Actions Bar */}
                <div style={styles.cardFooter}>
                  <div style={styles.authorBox}>
                    <div style={styles.authorAvatar}>
                      {blog.author?.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={blog.author.avatar} alt={blog.author.name} style={styles.authorAvatarImg} />
                      ) : (
                        <User size={14} color="#007AFF" />
                      )}
                    </div>
                    <div>
                      <div style={styles.authorName}>{blog.author?.name}</div>
                      <div style={styles.authorRole}>{blog.author?.role}</div>
                    </div>
                  </div>

                  <div style={styles.actionBtnGroup}>
                    {/* Toggle publish button */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(blog)}
                      title={blog.isPublished ? "Set to Draft" : "Publish Live"}
                      style={{
                        ...styles.actionBtn,
                        color: blog.isPublished ? "#34C759" : "#8E8E93",
                      }}
                    >
                      {blog.isPublished ? <CheckCircle size={16} /> : <XCircle size={16} />}
                    </button>

                    {/* Preview Live */}
                    <Link
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      title="View Article"
                      style={styles.actionBtn}
                    >
                      <ExternalLink size={15} />
                    </Link>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => openEditModal(blog)}
                      title="Edit Article"
                      style={styles.actionBtn}
                    >
                      <Edit2 size={15} />
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(blog)}
                      title="Delete"
                      style={{ ...styles.actionBtn, color: "#FF3B30" }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rich Editor Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h3 style={styles.modalTitle}>
                  {editingBlog ? "Edit Blog Post" : "Compose New Blog Post"}
                </h3>
                <p style={styles.modalSubtitle}>
                  Rich markdown editor with live preview, emojis, photos, bullet lists, and code blocks.
                </p>
              </div>

              {/* View Mode Switcher */}
              <div style={styles.viewModeTabs}>
                <button
                  type="button"
                  onClick={() => setEditorMode("edit")}
                  style={{
                    ...styles.viewModeBtn,
                    backgroundColor: editorMode === "edit" ? "#007AFF" : "transparent",
                    color: editorMode === "edit" ? "#ffffff" : "var(--text-secondary)",
                  }}
                >
                  <Code size={14} />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode("split")}
                  style={{
                    ...styles.viewModeBtn,
                    backgroundColor: editorMode === "split" ? "#007AFF" : "transparent",
                    color: editorMode === "split" ? "#ffffff" : "var(--text-secondary)",
                  }}
                >
                  <Columns size={14} />
                  Split View
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode("preview")}
                  style={{
                    ...styles.viewModeBtn,
                    backgroundColor: editorMode === "preview" ? "#007AFF" : "transparent",
                    color: editorMode === "preview" ? "#ffffff" : "var(--text-secondary)",
                  }}
                >
                  <Eye size={14} />
                  Live Preview
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={styles.modalCloseBtn}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {formError && <div style={styles.formErrorBanner}>{formError}</div>}

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Metadata Row */}
              <div style={styles.formRow3}>
                <div style={styles.formField}>
                  <label style={styles.label}>Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Architecting Distributed AI Agents"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formField}>
                  <label style={styles.label}>Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={styles.select}
                  >
                    {BLOG_CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.formField}>
                  <label style={styles.label}>Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="AI, Cloud, Python, DevOps"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Cover Image & Author Row */}
              <div style={styles.formRow3}>
                <div style={styles.formField}>
                  <label style={styles.label}>Cover Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formField}>
                  <label style={styles.label}>Author Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Vance"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    style={styles.input}
                  />
                </div>

                <div style={styles.formField}>
                  <label style={styles.label}>Author Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Systems Architect"
                    value={formData.authorRole}
                    onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Quick Cover Presets */}
              <div style={styles.presetRow}>
                <span style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 600 }}>Quick Presets:</span>
                {PRESET_COVERS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, coverImage: preset.url })}
                    style={{
                      ...styles.presetChip,
                      borderColor: formData.coverImage === preset.url ? "#007AFF" : "var(--border-color)",
                      color: formData.coverImage === preset.url ? "#007AFF" : "var(--text-secondary)",
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Short Excerpt */}
              <div style={styles.formField}>
                <label style={styles.label}>Summary / Excerpt (displayed on cards &amp; SEO)</label>
                <textarea
                  rows={2}
                  placeholder="Concise 1–2 sentence summary explaining the key technical takeaways..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  style={{ ...styles.textarea, minHeight: "56px" }}
                />
              </div>

              {/* Markdown Rich Editor Toolbar */}
              <div style={styles.editorToolbar}>
                <div style={styles.toolbarGroup}>
                  <button
                    type="button"
                    title="Bold (**text**)"
                    onClick={() => insertTextAtCursor("**", "**", "bold text")}
                    style={styles.toolBtn}
                  >
                    <Bold size={15} />
                  </button>
                  <button
                    type="button"
                    title="Italic (*text*)"
                    onClick={() => insertTextAtCursor("*", "*", "italic text")}
                    style={styles.toolBtn}
                  >
                    <Italic size={15} />
                  </button>
                  <button
                    type="button"
                    title="Strikethrough (~~text~~)"
                    onClick={() => insertTextAtCursor("~~", "~~", "strikethrough")}
                    style={styles.toolBtn}
                  >
                    <Strikethrough size={15} />
                  </button>
                </div>

                <div style={styles.toolDivider} />

                <div style={styles.toolbarGroup}>
                  <button
                    type="button"
                    title="Heading 1 (# Heading)"
                    onClick={() => insertTextAtCursor("# ", "", "Main Heading")}
                    style={styles.toolBtn}
                  >
                    <Heading1 size={15} />
                  </button>
                  <button
                    type="button"
                    title="Heading 2 (## Subheading)"
                    onClick={() => insertTextAtCursor("## ", "", "Subheading")}
                    style={styles.toolBtn}
                  >
                    <Heading2 size={15} />
                  </button>
                  <button
                    type="button"
                    title="Heading 3 (### Section)"
                    onClick={() => insertTextAtCursor("### ", "", "Section")}
                    style={styles.toolBtn}
                  >
                    <Heading3 size={15} />
                  </button>
                </div>

                <div style={styles.toolDivider} />

                <div style={styles.toolbarGroup}>
                  <button
                    type="button"
                    title="Bullet List (- item)"
                    onClick={() => insertTextAtCursor("- ", "", "Bullet item")}
                    style={styles.toolBtn}
                  >
                    <List size={15} />
                  </button>
                  <button
                    type="button"
                    title="Numbered List (1. item)"
                    onClick={() => insertTextAtCursor("1. ", "", "Numbered item")}
                    style={styles.toolBtn}
                  >
                    <ListOrdered size={15} />
                  </button>
                  <button
                    type="button"
                    title="Blockquote (> quote)"
                    onClick={() => insertTextAtCursor("> ", "", "Important quote")}
                    style={styles.toolBtn}
                  >
                    <Quote size={15} />
                  </button>
                  <button
                    type="button"
                    title="Code Snippet"
                    onClick={() => insertTextAtCursor("```typescript\n", "\n```", "// write code here")}
                    style={styles.toolBtn}
                  >
                    <Code size={15} />
                  </button>
                  <button
                    type="button"
                    title="Divider line"
                    onClick={() => insertTextAtCursor("\n---\n")}
                    style={styles.toolBtn}
                  >
                    <Minus size={15} />
                  </button>
                </div>

                <div style={styles.toolDivider} />

                {/* Media & Emojis */}
                <div style={styles.toolbarGroup}>
                  {/* Photo Inserter */}
                  <button
                    type="button"
                    title="Insert Photo"
                    onClick={() => setShowImageDialog(true)}
                    style={{ ...styles.toolBtn, color: "#007AFF" }}
                  >
                    <ImageIcon size={15} />
                    <span style={{ fontSize: "11px", fontWeight: 600 }}>Photo</span>
                  </button>

                  {/* Emoji Picker Button */}
                  <div style={{ position: "relative" }}>
                    <button
                      type="button"
                      title="Insert Emoji"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      style={{ ...styles.toolBtn, color: "#FF9500" }}
                    >
                      <Smile size={15} />
                      <span style={{ fontSize: "11px", fontWeight: 600 }}>Emoji</span>
                    </button>

                    {/* Emoji Dropdown Tray */}
                    {showEmojiPicker && (
                      <div style={styles.emojiTray}>
                        <div style={styles.emojiTrayHeader}>
                          <span>Select an Emoji</span>
                          <button
                            type="button"
                            onClick={() => setShowEmojiPicker(false)}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
                          >
                            ✕
                          </button>
                        </div>
                        <div style={styles.emojiGrid}>
                          {POPULAR_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => insertEmoji(emoji)}
                              style={styles.emojiBtn}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo Inserter Dialog Modal */}
              {showImageDialog && (
                <div style={styles.photoDialog}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                      Insert Photo into Article
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowImageDialog(false)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <input
                      type="url"
                      placeholder="Photo URL (e.g. https://images.unsplash.com/...)"
                      value={imageInputUrl}
                      onChange={(e) => setImageInputUrl(e.target.value)}
                      style={styles.input}
                    />
                    <input
                      type="text"
                      placeholder="Caption / Alt text (optional)"
                      value={imageInputAlt}
                      onChange={(e) => setImageInputAlt(e.target.value)}
                      style={styles.input}
                    />
                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                      <button
                        type="button"
                        onClick={() => setShowImageDialog(false)}
                        style={styles.secondaryBtn}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={insertImage}
                        style={styles.primaryBtn}
                      >
                        Insert Photo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Editor & Live Preview Canvas */}
              <div style={styles.editorCanvas}>
                {/* Editor Textarea */}
                {(editorMode === "edit" || editorMode === "split") && (
                  <div style={{ ...styles.canvasPane, flex: 1 }}>
                    <textarea
                      ref={textareaRef}
                      rows={18}
                      placeholder="Write your article in Markdown..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      style={styles.editorTextarea}
                    />
                  </div>
                )}

                {/* Live Preview Pane */}
                {(editorMode === "preview" || editorMode === "split") && (
                  <div style={{ ...styles.canvasPane, ...styles.previewPane, flex: 1 }}>
                    <div style={styles.previewHeaderLabel}>
                      <span>Live Reader Preview</span>
                      <span style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                        {formData.title || "Untitled Article"}
                      </span>
                    </div>
                    <div style={styles.previewBody}>
                      <MarkdownRenderer content={formData.content} />
                    </div>
                  </div>
                )}
              </div>

              {/* Publishing Bar & Footer */}
              <div style={styles.modalFooter}>
                <label style={styles.publishToggleLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                  <span>
                    <strong>Publish immediately to /blog</strong>
                    <small style={{ display: "block", color: "var(--text-secondary)", fontSize: "11px" }}>
                      Uncheck to save as Draft (visible to admin only)
                    </small>
                  </span>
                </label>

                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    style={styles.secondaryBtn}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={styles.primaryBtn}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : editingBlog ? "Update Article" : "Publish Article"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
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
  secondaryBtn: {
    padding: "9px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-primary)",
    backgroundColor: "transparent",
    border: "1px solid var(--border-color)",
    cursor: "pointer",
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
    marginBottom: "24px",
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
    outline: "none",
    cursor: "pointer",
  },
  statusTabGroup: {
    display: "flex",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    padding: "3px",
  },
  statusTabBtn: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    fontSize: "12.5px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
  },
  blogCard: {
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "14px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  cardCoverWrapper: {
    position: "relative",
    width: "100%",
    height: "170px",
    overflow: "hidden",
    backgroundColor: "#1A202C",
  },
  cardCover: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  },
  coverBadgeRow: {
    position: "absolute",
    top: "10px",
    left: "10px",
    right: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryBadge: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#ffffff",
    backgroundColor: "rgba(0, 122, 255, 0.9)",
    backdropFilter: "blur(4px)",
    padding: "3px 8px",
    borderRadius: "6px",
  },
  statusBadge: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#ffffff",
    backdropFilter: "blur(4px)",
    padding: "3px 8px",
    borderRadius: "6px",
  },
  cardBody: {
    padding: "18px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    fontSize: "12px",
    color: "var(--text-secondary)",
    marginBottom: "8px",
  },
  metaItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
  },
  blogTitle: {
    margin: "0 0 8px 0",
    fontSize: "16px",
    fontWeight: 700,
    color: "var(--text-primary)",
    lineHeight: 1.4,
  },
  blogExcerpt: {
    margin: "0 0 14px 0",
    fontSize: "13px",
    color: "var(--text-secondary)",
    lineHeight: 1.5,
    flex: 1,
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  tagsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "16px",
  },
  tagPill: {
    fontSize: "11px",
    padding: "2px 7px",
    borderRadius: "4px",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-secondary)",
    border: "1px solid var(--border-color)",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "1px solid var(--border-color)",
  },
  authorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  authorAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    backgroundColor: "var(--bg-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  authorAvatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  authorName: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  authorRole: {
    fontSize: "10.5px",
    color: "var(--text-secondary)",
  },
  actionBtnGroup: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  actionBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "30px",
    height: "30px",
    borderRadius: "6px",
    border: "1px solid var(--border-color)",
    backgroundColor: "transparent",
    color: "var(--text-secondary)",
    cursor: "pointer",
    textDecoration: "none",
  },
  loadingBox: {
    padding: "60px 0",
    textAlign: "center",
    color: "var(--text-secondary)",
  },
  spinner: {
    width: "32px",
    height: "32px",
    margin: "0 auto 12px auto",
    border: "3px solid var(--border-color)",
    borderTopColor: "#007AFF",
    borderRadius: "50%",
  },
  emptyState: {
    padding: "60px 20px",
    textAlign: "center",
    backgroundColor: "var(--bg-primary)",
    borderRadius: "12px",
    border: "1px dashed var(--border-color)",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "var(--text-primary)",
    margin: "0 0 6px 0",
  },
  emptyText: {
    fontSize: "13.5px",
    color: "var(--text-secondary)",
    maxWidth: "400px",
    margin: "0 auto 18px auto",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(6px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },
  modalContent: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "18px",
    border: "1px solid var(--border-color)",
    width: "100%",
    maxWidth: "1050px",
    maxHeight: "92vh",
    overflowY: "auto",
    padding: "28px",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid var(--border-color)",
    paddingBottom: "16px",
    marginBottom: "18px",
    flexWrap: "wrap",
    gap: "12px",
  },
  modalTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  modalSubtitle: {
    margin: "4px 0 0 0",
    fontSize: "12.5px",
    color: "var(--text-secondary)",
  },
  modalCloseBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-secondary)",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
  },
  viewModeTabs: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "var(--bg-secondary)",
    padding: "3px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
  },
  viewModeBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  formErrorBanner: {
    padding: "10px 14px",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    border: "1px solid #FF3B30",
    color: "#FF3B30",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "14px",
  },
  formRow3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "14px",
  },
  formField: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12.5px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  input: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    fontSize: "13px",
    outline: "none",
  },
  select: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  },
  textarea: {
    padding: "9px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    fontSize: "13px",
    outline: "none",
    fontFamily: "inherit",
    resize: "vertical",
  },
  presetRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  presetChip: {
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 600,
    backgroundColor: "transparent",
    border: "1px solid",
    cursor: "pointer",
  },
  editorToolbar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    flexWrap: "wrap",
  },
  toolbarGroup: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  toolDivider: {
    width: "1px",
    height: "20px",
    backgroundColor: "var(--border-color)",
  },
  toolBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "6px 8px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "transparent",
    color: "var(--text-secondary)",
    fontSize: "12px",
    cursor: "pointer",
  },
  emojiTray: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: "0",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    padding: "12px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
    zIndex: 99,
    width: "280px",
  },
  emojiTrayHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "8px",
  },
  emojiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(8, 1fr)",
    gap: "6px",
    maxHeight: "160px",
    overflowY: "auto",
  },
  emojiBtn: {
    background: "none",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "6px",
  },
  photoDialog: {
    padding: "14px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    marginBottom: "10px",
  },
  editorCanvas: {
    display: "flex",
    gap: "16px",
    minHeight: "350px",
  },
  canvasPane: {
    borderRadius: "10px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
    overflow: "hidden",
  },
  editorTextarea: {
    width: "100%",
    height: "100%",
    minHeight: "360px",
    padding: "16px",
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    color: "var(--text-primary)",
    fontSize: "14px",
    lineHeight: "1.6",
    fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
    resize: "vertical",
    boxSizing: "border-box",
  },
  previewPane: {
    backgroundColor: "var(--bg-primary)",
    display: "flex",
    flexDirection: "column",
  },
  previewHeaderLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 16px",
    borderBottom: "1px solid var(--border-color)",
    fontSize: "12px",
    fontWeight: 600,
    color: "#007AFF",
    backgroundColor: "var(--bg-secondary)",
  },
  previewBody: {
    padding: "20px",
    overflowY: "auto",
    maxHeight: "450px",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid var(--border-color)",
    paddingTop: "18px",
    marginTop: "10px",
    flexWrap: "wrap",
    gap: "12px",
  },
  publishToggleLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    fontSize: "13px",
    color: "var(--text-primary)",
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
};
