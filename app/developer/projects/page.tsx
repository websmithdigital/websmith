// PATH: C:\websmith\app\developer\projects\page.tsx
"use client";

import { useEffect, useState } from "react";
import { Project, getProjects, updateProjectStatus } from "../../projects/services/projectService";
import { 
  Folder, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  LayoutGrid, 
  List, 
  Kanban,
  Search,
  Eye,
  Calendar,
  ExternalLink,
  X
} from "lucide-react";
import API from "../../../core/services/apiService";
import Card from "../../../components/ui/Card";
import KanbanBoard from "../../../components/ui/KanbanBoard";

type ViewMode = "grid" | "list" | "kanban";

export default function DeveloperProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data || []);
    } catch (error) {
      console.error("Developer projects error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateProjectStatus(id, { status, note: `Developer updated status to ${status}` });
      await loadProjects();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleProjectDrop = async (projectId: string, fromStatus: string, toStatus: string) => {
    try {
      await API.put(`/projects/${projectId}/status`, {
        status: toStatus,
        note: `Status updated from ${fromStatus} to ${toStatus} via Kanban`
      });
      await loadProjects();
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  const kanbanColumns = [
    { id: "pending", title: "Pending", status: "pending", color: "#8E8E93" },
    { id: "in-progress", title: "In Progress", status: "in-progress", color: "#007AFF" },
    { id: "completed", title: "Completed", status: "completed", color: "#34C759" },
    { id: "on-hold", title: "On Hold", status: "on-hold", color: "#FF9500" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 size={18} color="#34C759" />;
      case 'in-progress': return <Clock size={18} color="#007AFF" />;
      case 'on-hold': return <AlertCircle size={18} color="#FF9500" />;
      default: return <Clock size={18} color="var(--text-secondary)" />;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'completed': return { bg: 'rgba(52, 199, 89, 0.12)', color: '#34C759', text: 'Completed' };
      case 'in-progress': return { bg: 'rgba(0, 122, 255, 0.12)', color: '#007AFF', text: 'In Progress' };
      case 'on-hold': return { bg: 'rgba(255, 149, 0, 0.12)', color: '#FF9500', text: 'On Hold' };
      default: return { bg: 'rgba(142, 142, 147, 0.12)', color: '#8E8E93', text: 'Pending' };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredProjects = projects.filter((p) =>
    (p.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: 'var(--text-secondary)' }}>Syncing your workspace...</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="wsd-page admin-panel-scope dev-projects-page">
      {/* Header */}
      <div style={styles.header} className="dev-projects-header">
        <div style={styles.headerTitleBlock} className="dev-projects-title-block">
          <h1 style={styles.title} className="dev-projects-title">Projects</h1>
          <p style={styles.subtitle} className="dev-projects-subtitle">Track, build, and deliver your assigned engineering deliverables</p>
        </div>

        {/* Search */}
        <div style={styles.middleSearchWrap} className="dev-projects-middle-search">
          <div style={styles.searchBox} className="admin-search-box wsd-search-box dev-projects-search-box">
            <Search size={18} color="var(--text-secondary)" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search assigned projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
              className="admin-search-input"
            />
          </div>
        </div>

        {/* View Toggle */}
        <div style={styles.headerActions} className="dev-projects-actions">
          <div style={styles.viewToggle} className="dev-projects-view-toggle">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              style={{ ...styles.toggleBtn, ...(viewMode === "grid" ? styles.toggleActive : {}) }}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              style={{ ...styles.toggleBtn, ...(viewMode === "list" ? styles.toggleActive : {}) }}
              title="List View"
            >
              <List size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              style={{ ...styles.toggleBtn, ...(viewMode === "kanban" ? styles.toggleActive : {}) }}
              title="Kanban Board"
            >
              <Kanban size={16} />
            </button>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}><Folder size={48} color="var(--border-color)" /></div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No assignments found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>
            {searchTerm ? 'No projects match your search query.' : 'Your assigned projects will appear here once an administrator assigns them.'}
          </p>
        </div>
      ) : viewMode === "kanban" ? (
        <div className="dev-kanban-wrapper">
          <KanbanBoard
            columns={kanbanColumns}
            cards={filteredProjects.map((p) => ({
              ...p,
              _id: p._id || '',
              title: p.name,
              subtitle: `Progress: ${p.progress || 0}%`,
              status: p.status,
              priority: p.priority || 'medium',
            }))}
            onCardDrop={handleProjectDrop}
          />
        </div>
      ) : viewMode === "grid" ? (
        <div style={styles.grid} className="dev-projects-grid">
          {filteredProjects.map((project) => {
            const statusStyle = getStatusBadgeStyle(project.status);
            return (
              <div key={project._id} style={styles.card} className="developer-project-card wsd-unified-card">
                <div style={styles.cardHeader}>
                  <div style={styles.iconWrapper}>
                    <Folder size={22} color="#007AFF" />
                  </div>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.color
                  }}>
                    {statusStyle.text}
                  </span>
                </div>
                
                <h3 style={styles.cardTitle} className="dev-project-card-title">{project.name}</h3>
                <p style={styles.cardText} className="dev-project-card-text">
                  {project.description || "No description provided for this project."}
                </p>
                
                <div style={styles.detailsBox} className="dev-project-details-box">
                  <div style={styles.row}>
                    <span style={styles.label}>Progress</span>
                    <span style={styles.value}>{project.progress || 0}%</span>
                  </div>
                  {/* Progress bar */}
                  <div style={styles.progressBarBg}>
                    <div style={{
                      ...styles.progressBarFill,
                      width: `${Math.min(100, Math.max(0, project.progress || 0))}%`
                    }} />
                  </div>
                  <div style={{ ...styles.row, marginTop: '8px', marginBottom: 0 }}>
                    <span style={styles.label}>Due Date</span>
                    <span style={styles.value}>{formatDate(project.expectedCompletionDate)}</span>
                  </div>
                </div>

                <div style={styles.actionSection}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <select 
                        value={project.status} 
                        onChange={(e) => handleStatusChange(project._id!, e.target.value)} 
                        style={styles.select}
                        className="dev-status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="on-hold">On Hold</option>
                      </select>
                      <ChevronRight size={14} style={styles.selectIcon} />
                    </div>
                    <button 
                      onClick={() => setSelectedProject(project)} 
                      style={styles.viewDetailBtn}
                      title="View Details"
                      className="dev-view-btn"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.list} className="dev-projects-list">
          {filteredProjects.map((project) => {
            const statusStyle = getStatusBadgeStyle(project.status);
            return (
              <div key={project._id} style={styles.listRow} className="dev-projects-list-row">
                <div style={styles.listInfo}>
                  <strong style={styles.listProjectName}>{project.name}</strong>
                  <p style={styles.listMeta}>
                    {project.description ? `${project.description.substring(0, 70)}...` : "No description"}
                  </p>
                </div>
                <div style={styles.listStatusWrap}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.color
                  }}>
                    {statusStyle.text}
                  </span>
                </div>
                <div style={styles.listProgressWrap}>
                  <span style={styles.listProgress}>{project.progress || 0}%</span>
                </div>
                <div style={styles.listDateWrap}>
                  <span style={styles.listDate}>{formatDate(project.expectedCompletionDate)}</span>
                </div>
                <div style={styles.listActionWrap}>
                  <button 
                    onClick={() => setSelectedProject(project)} 
                    style={styles.listDetailBtn}
                    className="dev-list-btn"
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div style={styles.modalOverlay} onClick={() => setSelectedProject(null)}>
          <div style={styles.modalContent} className="modal-content-responsive" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>{selectedProject.name}</h2>
                <span style={{
                  ...styles.statusBadge,
                  backgroundColor: getStatusBadgeStyle(selectedProject.status).bg,
                  color: getStatusBadgeStyle(selectedProject.status).color,
                  marginTop: '4px',
                  display: 'inline-block'
                }}>
                  {getStatusBadgeStyle(selectedProject.status).text}
                </span>
              </div>
              <button onClick={() => setSelectedProject(null)} style={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.detailSection}>
                <span style={styles.detailLabel}>Description</span>
                <p style={styles.detailParagraph}>
                  {selectedProject.description || "No project description provided."}
                </p>
              </div>

              <div style={styles.modalGrid}>
                <div>
                  <span style={styles.detailLabel}>Client</span>
                  <p style={styles.detailValue}>{selectedProject.client || selectedProject.clientCompany || 'Internal'}</p>
                </div>
                <div>
                  <span style={styles.detailLabel}>Priority</span>
                  <p style={{ ...styles.detailValue, textTransform: 'capitalize' }}>{selectedProject.priority || 'Medium'}</p>
                </div>
                <div>
                  <span style={styles.detailLabel}>Start Date</span>
                  <p style={styles.detailValue}>{formatDate(selectedProject.startDate)}</p>
                </div>
                <div>
                  <span style={styles.detailLabel}>Expected Completion</span>
                  <p style={styles.detailValue}>{formatDate(selectedProject.expectedCompletionDate)}</p>
                </div>
              </div>

              {selectedProject.publicUrl && (
                <div style={{ marginTop: '12px' }}>
                  <a 
                    href={selectedProject.publicUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={styles.liveLink}
                  >
                    <ExternalLink size={14} />
                    <span>Visit Live URL</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .developer-project-card {
          transition: all 0.25s ease;
        }
        .developer-project-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.08) !important;
          border-color: #007AFF55 !important;
        }
        .dev-view-btn:hover, .dev-list-btn:hover {
          background: #007AFF !important;
          color: #fff !important;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .dev-projects-header {
            display: grid !important;
            grid-template-columns: 1fr auto !important;
            gap: 12px 8px !important;
            align-items: center !important;
            width: 100% !important;
          }
          .dev-projects-title-block {
            grid-column: 1 / -1 !important;
            width: 100% !important;
          }
          .dev-projects-middle-search {
            grid-column: 1 !important;
            width: 100% !important;
            min-width: 0 !important;
          }
          .dev-projects-search-box {
            width: 100% !important;
            padding: 8px 12px !important;
          }
          .dev-projects-actions {
            grid-column: 2 !important;
            width: auto !important;
            flex-shrink: 0 !important;
            display: flex !important;
            justify-content: flex-end !important;
          }
        }

        @media (max-width: 768px) {
          .dev-projects-title {
            font-size: 24px !important;
            margin-bottom: 2px !important;
          }
          .dev-projects-subtitle {
            font-size: 13px !important;
          }
          .dev-projects-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .developer-project-card {
            padding: 16px !important;
            border-radius: 16px !important;
          }
          .dev-project-card-title {
            font-size: 17px !important;
          }
          .dev-project-card-text {
            font-size: 13px !important;
            margin-bottom: 12px !important;
          }
          .dev-project-details-box {
            padding: 12px !important;
            margin-bottom: 14px !important;
          }
          .dev-status-select {
            padding: 10px 14px !important;
            font-size: 13px !important;
          }
          .dev-projects-list-row {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
            padding: 14px !important;
          }
          .modal-content-responsive {
            width: 95% !important;
            max-height: 90vh !important;
            margin: 10px !important;
          }
          .dev-kanban-wrapper {
            display: flex !important;
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch !important;
            gap: 14px !important;
            padding-bottom: 12px !important;
          }
          .dev-kanban-wrapper > div {
            min-width: 260px !important;
            flex-shrink: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: any = {
  container: { 
    padding: 0,
    backgroundColor: 'transparent',
    minHeight: '100vh',
    color: 'var(--text-primary)'
  },
  header: { 
    marginBottom: "28px", 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    gap: "16px",
    flexWrap: "wrap"
  },
  headerTitleBlock: {
    flexShrink: 0,
  },
  title: { 
    fontSize: "32px", 
    fontWeight: 800, 
    color: "var(--text-primary)", 
    margin: 0, 
    marginBottom: "6px", 
    letterSpacing: "-1px" 
  },
  subtitle: { fontSize: "15px", color: "var(--text-secondary)", margin: 0 },
  middleSearchWrap: {
    flex: 1,
    maxWidth: "400px",
    minWidth: "200px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 16px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    color: "var(--text-primary)",
    fontSize: "14px",
    width: "100%",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  viewToggle: {
    display: "flex",
    background: "var(--bg-secondary)",
    borderRadius: "12px",
    padding: "4px",
    border: "1px solid var(--border-color)",
  },
  toggleBtn: {
    border: "none",
    background: "transparent",
    padding: "8px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "var(--text-secondary)",
  },
  toggleActive: {
    background: "var(--bg-primary)",
    color: "var(--text-primary)",
    boxShadow: "0 2px 8px color-mix(in srgb, var(--text-primary) 8%, transparent)",
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", 
    gap: "20px" 
  },
  card: { 
    backgroundColor: "var(--bg-secondary)", 
    borderRadius: "20px", 
    border: "1px solid var(--border-color)", 
    padding: "24px",
    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  iconWrapper: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  cardTitle: { 
    fontSize: "18px", 
    fontWeight: 700, 
    color: "var(--text-primary)", 
    margin: 0, 
    marginBottom: "8px",
    letterSpacing: "-0.3px",
  },
  cardText: { 
    fontSize: "13.5px", 
    color: "var(--text-secondary)", 
    margin: "0 0 16px 0", 
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden"
  },
  detailsBox: {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '14px',
    padding: '14px',
    marginBottom: '16px',
    border: '1px solid var(--border-color)'
  },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" },
  label: { fontSize: "12.5px", fontWeight: 600, color: "var(--text-secondary)" },
  value: { fontSize: "12.5px", fontWeight: 700, color: "var(--text-primary)" },
  progressBarBg: {
    width: "100%",
    height: "6px",
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "999px",
    overflow: "hidden",
    margin: "4px 0 6px 0",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: "999px",
    transition: "width 0.3s ease",
  },
  actionSection: {
    marginTop: 'auto'
  },
  select: { 
    width: "100%", 
    padding: "11px 14px", 
    border: "1px solid var(--border-color)", 
    borderRadius: "12px", 
    fontSize: "13px", 
    fontWeight: 600,
    backgroundColor: "var(--bg-primary)",
    color: 'var(--text-primary)',
    appearance: 'none',
    outline: 'none',
    cursor: 'pointer',
  },
  selectIcon: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%) rotate(90deg)',
    color: 'var(--text-secondary)',
    pointerEvents: 'none'
  },
  viewDetailBtn: {
    padding: "11px 13px",
    borderRadius: "12px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
  },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  listRow: { 
    display: "grid", 
    gridTemplateColumns: "1.5fr auto auto auto auto", 
    alignItems: "center", 
    gap: "14px", 
    background: "var(--bg-secondary)", 
    border: "1px solid var(--border-color)", 
    borderRadius: "14px", 
    padding: "14px 18px" 
  },
  listInfo: { display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 },
  listProjectName: { fontSize: "15px", color: "var(--text-primary)", fontWeight: 700 },
  listMeta: { margin: 0, fontSize: "12.5px", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  listProgressWrap: {},
  listProgress: { fontSize: "13px", fontWeight: 700, color: "#007AFF" },
  listDateWrap: {},
  listDate: { fontSize: "12.5px", color: "var(--text-secondary)" },
  listActionWrap: {},
  listDetailBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s ease",
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    background: 'var(--bg-secondary)',
    borderRadius: '24px',
    border: '1.5px dashed var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '18px',
    backgroundColor: 'var(--bg-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(8px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },
  modalContent: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "24px",
    padding: "28px",
    width: "90%",
    maxWidth: "580px",
    maxHeight: "85vh",
    overflowY: "auto",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
    border: "1px solid var(--border-color)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  modalTitle: {
    fontSize: "22px",
    fontWeight: 800,
    color: "var(--text-primary)",
    margin: 0,
  },
  closeBtn: {
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    cursor: "pointer",
    padding: "6px",
    display: "flex",
    alignItems: "center",
    color: "var(--text-secondary)",
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  detailSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  detailLabel: {
    fontSize: "11.5px",
    fontWeight: 700,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  detailParagraph: {
    fontSize: "14px",
    color: "var(--text-primary)",
    margin: 0,
    lineHeight: 1.5,
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    padding: "16px",
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "14px",
  },
  detailValue: {
    fontSize: "13.5px",
    fontWeight: 600,
    color: "var(--text-primary)",
    margin: "3px 0 0 0",
  },
  liveLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    backgroundColor: "#007AFF",
    color: "#fff",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 600,
    textDecoration: "none",
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '100px',
    gap: '16px'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '3px solid var(--border-color)',
    borderTopColor: '#007AFF',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
};
