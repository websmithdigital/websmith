"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  CheckSquare, 
  LayoutGrid, 
  List, 
  Kanban, 
  PlayCircle,
  Search,
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Folder,
  AlertCircle
} from "lucide-react";
import API from "../../../core/services/apiService";
import Card from "../../../components/ui/Card";
import KanbanBoard from "../../../components/ui/KanbanBoard";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  project?: string;
  projectId?: { _id: string; name: string; status: string };
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  completionNote?: string;
}

type ViewMode = "grid" | "list" | "kanban";

export default function DeveloperTasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [completeNote, setCompleteNote] = useState("");
  const [savingTask, setSavingTask] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await API.get("/users/me");
        
        if (userResponse.data.user.role !== "developer") {
          router.push("/");
          return;
        }

        const tasksResponse = await API.get("/tasks");
        setTasks(tasksResponse.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/login");
      }
    };

    fetchData();
  }, [router]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "#8E8E93",
      "in-progress": "#007AFF",
      review: "#FF9500",
      completed: "#34C759",
    };
    return colors[status] || "#8E8E93";
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: "#8E8E93",
      medium: "#007AFF",
      high: "#FF9500",
      urgent: "#FF3B30",
    };
    return colors[priority] || "#8E8E93";
  };

  /** Developers may only set these statuses (see server updateTask / bulk rules). */
  const DEV_ALLOWED_STATUSES = ["pending", "in-progress", "completed"] as const;

  const handleCardDrop = async (cardId: string, fromStatus: string, toStatus: string) => {
    if (!DEV_ALLOWED_STATUSES.includes(toStatus as (typeof DEV_ALLOWED_STATUSES)[number])) {
      return;
    }
    try {
      await API.put(`/tasks/${cardId}/status`, { status: toStatus });
      const tasksResponse = await API.get("/tasks");
      setTasks(tasksResponse.data.data || []);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
    setCompleteNote(task.completionNote || "");
  };

  const refreshTasks = async () => {
    const tasksResponse = await API.get("/tasks");
    const list = tasksResponse.data.data || [];
    setTasks(list);
    return list;
  };

  const updateTaskFields = async (taskId: string, body: Record<string, unknown>) => {
    setSavingTask(true);
    try {
      await API.put(`/tasks/${taskId}`, body);
      const list = await refreshTasks();
      const updated = list.find((t: Task) => t._id === taskId);
      if (updated) setSelectedTask(updated);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setSavingTask(false);
    }
  };

  const handleStartTask = () => {
    if (!selectedTask || selectedTask.status !== "pending") return;
    updateTaskFields(selectedTask._id, { status: "in-progress" });
  };

  const handleMarkComplete = () => {
    if (!selectedTask || selectedTask.status === "completed") return;
    updateTaskFields(selectedTask._id, {
      status: "completed",
      completionNote: completeNote.trim(),
    });
  };

  const kanbanColumns = [
    { id: "pending", title: "To Do", status: "pending", color: "#8E8E93" },
    { id: "in-progress", title: "In Progress", status: "in-progress", color: "#007AFF" },
    { id: "review", title: "Review", status: "review", color: "#FF9500" },
    { id: "completed", title: "Done", status: "completed", color: "#34C759" },
  ];

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    review: tasks.filter((t) => t.status === "review").length,
    done: tasks.filter((t) => t.status === "completed").length,
  };

  const filteredTasks = useMemo(() => {
    if (!searchTerm.trim()) return tasks;
    const q = searchTerm.toLowerCase();
    return tasks.filter((t) =>
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (typeof t.projectId === "object" && t.projectId?.name && t.projectId.name.toLowerCase().includes(q))
    );
  }, [tasks, searchTerm]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: "var(--text-secondary)" }}>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="wsd-page admin-panel-scope dev-tasks-page">
      {/* Header */}
      <div style={styles.header} className="dev-tasks-header">
        <div style={styles.headerTitleBlock} className="dev-tasks-title-block">
          <h1 style={styles.title} className="dev-tasks-title">My Tasks</h1>
          <p style={styles.subtitle} className="dev-tasks-subtitle">
            Work on tasks assigned to you — update status, add remarks, and mark complete
          </p>
        </div>

        {/* Search Bar in Middle */}
        <div style={styles.middleSearchWrap} className="dev-tasks-search-wrap">
          <div style={styles.searchBox} className="dev-tasks-search-box">
            <Search size={16} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search tasks or projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, display: "flex", color: "var(--text-secondary)" }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div style={styles.headerRight} className="dev-tasks-header-actions">
          <div style={styles.viewToggle} className="dev-tasks-view-toggle">
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

      {/* Stats - 4 cards compact on mobile */}
      <div style={styles.statsGrid} className="dev-tasks-stats-grid">
        <div style={styles.statCard} className="wsd-unified-card dev-task-stat-card">
          <div style={{ ...styles.iconBox, backgroundColor: "rgba(0, 122, 255, 0.12)" }} className="dev-task-stat-icon">
            <CheckSquare size={18} color="#007AFF" />
          </div>
          <div className="dev-task-stat-meta">
            <p style={styles.statValue} className="dev-task-stat-value">{stats.total}</p>
            <p style={styles.statLabel} className="dev-task-stat-label">Total</p>
          </div>
        </div>
        <div style={styles.statCard} className="wsd-unified-card dev-task-stat-card">
          <div style={{ ...styles.iconBox, backgroundColor: "rgba(142, 142, 147, 0.12)" }} className="dev-task-stat-icon">
            <Clock size={18} color="#8E8E93" />
          </div>
          <div className="dev-task-stat-meta">
            <p style={styles.statValue} className="dev-task-stat-value">{stats.todo}</p>
            <p style={styles.statLabel} className="dev-task-stat-label">To Do</p>
          </div>
        </div>
        <div style={styles.statCard} className="wsd-unified-card dev-task-stat-card">
          <div style={{ ...styles.iconBox, backgroundColor: "rgba(0, 122, 255, 0.12)" }} className="dev-task-stat-icon">
            <CheckCircle2 size={18} color="#007AFF" />
          </div>
          <div className="dev-task-stat-meta">
            <p style={styles.statValue} className="dev-task-stat-value">{stats.inProgress}</p>
            <p style={styles.statLabel} className="dev-task-stat-label">In Progress</p>
          </div>
        </div>
        <div style={styles.statCard} className="wsd-unified-card dev-task-stat-card">
          <div style={{ ...styles.iconBox, backgroundColor: "rgba(52, 199, 89, 0.12)" }} className="dev-task-stat-icon">
            <CheckSquare size={18} color="#34C759" />
          </div>
          <div className="dev-task-stat-meta">
            <p style={styles.statValue} className="dev-task-stat-value">{stats.done}</p>
            <p style={styles.statLabel} className="dev-task-stat-label">Done</p>
          </div>
        </div>
      </div>

      {/* Tasks Display */}
      {viewMode === "kanban" ? (
        <div className="dev-kanban-wrapper">
          <KanbanBoard
            columns={kanbanColumns}
            cards={filteredTasks.map((t) => ({
              ...t,
              title: t.title,
              subtitle: `Priority: ${t.priority}`,
              priority: t.priority,
            }))}
            onCardDrop={handleCardDrop}
          />
        </div>
      ) : viewMode === "grid" ? (
        <div style={styles.grid} className="dev-tasks-grid">
          {filteredTasks.map((task) => (
            <Card key={task._id} className="dev-task-grid-card">
              <div style={styles.taskCard} onClick={() => handleViewTask(task)} className="clickable-card dev-task-card-inner">
                <div style={styles.taskHeader}>
                  <h3 style={styles.taskTitle} className="dev-task-title">{task.title}</h3>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: `${getStatusColor(task.status)}20`,
                      color: getStatusColor(task.status),
                    }}
                    className="dev-task-badge"
                  >
                    {task.status.replace("-", " ")}
                  </span>
                </div>
                <p style={styles.taskDesc} className="dev-task-desc">{task.description}</p>
                <div style={styles.taskMeta} className="dev-task-meta">
                  <span
                    style={{
                      ...styles.priorityBadge,
                      backgroundColor: `${getPriorityColor(task.priority)}20`,
                      color: getPriorityColor(task.priority),
                    }}
                  >
                    {task.priority}
                  </span>
                  {task.projectId && (
                    <span style={styles.projectTag} className="dev-task-project-tag">
                      <Folder size={12} />
                      {typeof task.projectId === "object" ? task.projectId.name : String(task.projectId)}
                    </span>
                  )}
                  {task.dueDate && (
                    <span style={styles.dueDateTag}>
                      <Calendar size={12} />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div style={styles.list} className="dev-tasks-list">
          {filteredTasks.map((task) => (
            <div 
              key={task._id} 
              style={styles.listRow} 
              onClick={() => handleViewTask(task)} 
              className="clickable-row dev-tasks-list-row"
            >
              <div style={styles.listInfo} className="dev-task-list-info">
                <strong style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "15px" }}>{task.title}</strong>
                <p style={styles.listMeta}>
                  {(task.description || "").length > 80
                    ? `${(task.description || "").slice(0, 80)}…`
                    : task.description || "—"}
                </p>
                {task.projectId && (
                  <span style={styles.projectTag} className="dev-task-project-tag">
                    <Folder size={12} />
                    {typeof task.projectId === "object" ? task.projectId.name : String(task.projectId)}
                  </span>
                )}
              </div>
              <div className="dev-task-list-badges">
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: `${getStatusColor(task.status)}20`,
                    color: getStatusColor(task.status),
                  }}
                >
                  {task.status.replace("-", " ")}
                </span>
                <span
                  style={{
                    ...styles.priorityBadge,
                    backgroundColor: `${getPriorityColor(task.priority)}20`,
                    color: getPriorityColor(task.priority),
                  }}
                >
                  {task.priority}
                </span>
                <span style={styles.listDate}>
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredTasks.length === 0 && (
        <div style={styles.emptyContainer} className="dev-tasks-empty">
          <CheckSquare size={44} color="var(--border-color)" />
          <h3 style={styles.emptyTitle}>
            {searchTerm ? "No tasks matching your search" : "No assigned tasks"}
          </h3>
          <p style={styles.emptyText}>
            {searchTerm ? "Try searching with a different term or clear the filter." : "When tasks are assigned to you, they will appear here."}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              style={styles.clearBtn}
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <div style={styles.modalOverlay} onClick={() => setShowTaskDetail(false)}>
          <div style={styles.taskDetailModal} onClick={(e) => e.stopPropagation()} className="modal-content-responsive">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{selectedTask.title}</h2>
              <button onClick={() => setShowTaskDetail(false)} style={styles.closeBtn}>×</button>
            </div>

            <div style={styles.modalBody}>
              {/* Task Status & Priority Badges */}
              <div style={styles.modalBadgeRow}>
                <div style={styles.taskInfoSection}>
                  <p style={styles.taskInfoLabel}>Status</p>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: `${getStatusColor(selectedTask.status)}20`,
                    color: getStatusColor(selectedTask.status),
                    display: "inline-block",
                  }}>
                    {selectedTask.status.replace("-", " ")}
                  </span>
                </div>

                <div style={styles.taskInfoSection}>
                  <p style={styles.taskInfoLabel}>Priority</p>
                  <span style={{
                    ...styles.priorityBadge,
                    backgroundColor: `${getPriorityColor(selectedTask.priority)}20`,
                    color: getPriorityColor(selectedTask.priority),
                    display: "inline-block",
                  }}>
                    {selectedTask.priority}
                  </span>
                </div>
              </div>

              {selectedTask.dueDate && (
                <div style={styles.taskInfoSection}>
                  <p style={styles.taskInfoLabel}>Due Date</p>
                  <p style={styles.taskInfoValue}>📅 {new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                </div>
              )}

              {selectedTask.projectId && (
                <div style={styles.taskInfoSection}>
                  <p style={styles.taskInfoLabel}>Project</p>
                  <p style={styles.taskInfoValue}>
                    {typeof selectedTask.projectId === "object" && selectedTask.projectId
                      ? selectedTask.projectId.name
                      : String(selectedTask.projectId)}
                  </p>
                </div>
              )}

              <div style={styles.taskInfoSection}>
                <p style={styles.taskInfoLabel}>Description</p>
                <p style={styles.taskInfoValue}>{selectedTask.description || "No description provided."}</p>
              </div>

              {selectedTask.completionNote && (
                <div style={styles.taskInfoSection}>
                  <p style={styles.taskInfoLabel}>Completion remarks</p>
                  <p style={styles.taskInfoValue}>{selectedTask.completionNote}</p>
                </div>
              )}

              {selectedTask.status !== "completed" && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Your actions</h3>
                  <p style={styles.helpText}>
                    Move the task forward or mark it done. Add optional remarks when completing.
                  </p>
                  <div style={styles.actionRow}>
                    {selectedTask.status === "pending" && (
                      <button
                        type="button"
                        onClick={handleStartTask}
                        disabled={savingTask}
                        style={styles.actionBtnSecondary}
                      >
                        <PlayCircle size={16} />
                        Start work
                      </button>
                    )}
                  </div>
                  <label style={styles.label}>Remarks on completion (optional)</label>
                  <textarea
                    value={completeNote}
                    onChange={(e) => setCompleteNote(e.target.value)}
                    placeholder="e.g. what you shipped, PR link, handoff notes…"
                    style={styles.textarea}
                    rows={3}
                  />
                  <button
                    type="button"
                    onClick={handleMarkComplete}
                    disabled={savingTask}
                    style={styles.actionBtnPrimary}
                  >
                    Mark as completed
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .clickable-card, .clickable-row { cursor: pointer; transition: all 0.2s ease; }
        .clickable-card:hover, .clickable-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px color-mix(in srgb, var(--text-primary) 10%, transparent);
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 900px) {
          .dev-tasks-header {
            display: grid !important;
            grid-template-columns: 1fr auto !important;
            grid-template-areas:
              "title actions"
              "search search" !important;
            gap: 12px !important;
            align-items: center !important;
          }
          .dev-tasks-title-block {
            grid-area: title !important;
          }
          .dev-tasks-search-wrap {
            grid-area: search !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          .dev-tasks-header-actions {
            grid-area: actions !important;
            display: flex !important;
            justify-content: flex-end !important;
          }
        }

        @media (max-width: 768px) {
          .dev-tasks-title {
            font-size: 24px !important;
            margin-bottom: 2px !important;
          }
          .dev-tasks-subtitle {
            font-size: 13px !important;
          }
          .dev-tasks-stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 6px !important;
            margin-bottom: 16px !important;
          }
          .dev-task-stat-card {
            padding: 8px 6px !important;
            gap: 6px !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            border-radius: 12px !important;
          }
          .dev-task-stat-icon {
            width: 28px !important;
            height: 28px !important;
            border-radius: 8px !important;
          }
          .dev-task-stat-icon svg {
            width: 14px !important;
            height: 14px !important;
          }
          .dev-task-stat-value {
            font-size: 16px !important;
            line-height: 1.1 !important;
          }
          .dev-task-stat-label {
            font-size: 9.5px !important;
            margin-top: 2px !important;
            white-space: nowrap !important;
          }
          .dev-tasks-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .dev-task-card-inner {
            padding: 14px !important;
          }
          .dev-task-title {
            font-size: 16px !important;
          }
          .dev-task-desc {
            font-size: 13px !important;
            -webkit-line-clamp: 2 !important;
            display: -webkit-box !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }
          .dev-tasks-list-row {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
            padding: 14px !important;
            border-radius: 14px !important;
          }
          .dev-task-list-badges {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important;
            align-items: center !important;
          }
          .modal-content-responsive {
            width: 95% !important;
            max-height: 90vh !important;
            padding: 16px !important;
            border-radius: 16px !important;
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

const styles: Record<string, any> = {
  container: { padding: 0, backgroundColor: "transparent", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" },
  headerTitleBlock: { flexShrink: 0 },
  title: { margin: 0, fontSize: "32px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" },
  subtitle: { margin: "6px 0 0", fontSize: "14.5px", color: "var(--text-secondary)" },
  middleSearchWrap: { flex: 1, maxWidth: "380px", minWidth: "200px" },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 14px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    color: "var(--text-primary)",
    fontSize: "13.5px",
    width: "100%",
  },
  headerRight: { display: "flex", gap: "12px", alignItems: "center" },
  viewToggle: { display: "flex", background: "var(--bg-secondary)", borderRadius: "12px", padding: "4px", border: "1px solid var(--border-color)" },
  toggleBtn: { border: "none", background: "transparent", padding: "8px 10px", borderRadius: "8px", cursor: "pointer", color: "var(--text-secondary)" },
  toggleActive: { background: "var(--bg-primary)", color: "var(--text-primary)", boxShadow: "0 2px 8px color-mix(in srgb, var(--text-primary) 8%, transparent)" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  statCard: { display: "flex", alignItems: "center", gap: "14px", borderRadius: "16px", padding: "16px 20px" },
  iconBox: { width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  statValue: { margin: 0, fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" },
  statLabel: { margin: "3px 0 0", fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "18px" },
  taskCard: { display: "flex", flexDirection: "column", gap: "12px" },
  taskHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" },
  taskTitle: { margin: 0, fontSize: "17px", fontWeight: 600, color: "var(--text-primary)" },
  statusBadge: { padding: "4px 9px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, textTransform: "capitalize" },
  taskDesc: { margin: 0, fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.5 },
  taskMeta: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", fontSize: "12px", color: "var(--text-secondary)" },
  priorityBadge: { padding: "3px 7px", borderRadius: "6px", fontSize: "11px", fontWeight: 700, textTransform: "capitalize" },
  projectTag: { display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--text-secondary)", backgroundColor: "var(--bg-secondary)", padding: "3px 8px", borderRadius: "6px" },
  dueDateTag: { display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--text-secondary)" },
  list: { display: "flex", flexDirection: "column", gap: "10px" },
  listRow: { display: "grid", gridTemplateColumns: "1.5fr auto", alignItems: "center", gap: "16px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "14px 18px" },
  listInfo: { display: "flex", flexDirection: "column", gap: "4px" },
  listMeta: { margin: 0, fontSize: "13px", color: "var(--text-secondary)" },
  listDate: { fontSize: "12px", color: "var(--text-secondary)" },
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px", gap: "16px" },
  spinner: { width: "36px", height: "36px", border: "3px solid var(--border-color)", borderTopColor: "#007AFF", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  emptyContainer: { textAlign: "center", padding: "60px 20px" },
  emptyTitle: { fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", marginTop: "16px", marginBottom: "6px" },
  emptyText: { fontSize: "13.5px", color: "var(--text-secondary)", marginBottom: "16px" },
  clearBtn: { padding: "8px 16px", backgroundColor: "#007AFF", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "16px" },
  modalTitle: { margin: 0, fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" },
  label: { display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" },
  textarea: { width: "100%", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: "10px", fontSize: "14px", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box", backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" },
  taskDetailModal: { background: "var(--bg-primary)", color: "var(--text-primary)", border: "1px solid var(--border-color)", borderRadius: "20px", width: "90%", maxWidth: "600px", maxHeight: "90vh", overflowY: "auto", padding: "24px", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "14px", borderBottom: "1px solid var(--border-color)" },
  closeBtn: { background: "none", border: "none", fontSize: "28px", cursor: "pointer", color: "var(--text-secondary)", lineHeight: 1, padding: "0 4px" },
  modalBody: { display: "flex", flexDirection: "column", gap: "14px" },
  modalBadgeRow: { display: "flex", gap: "16px" },
  taskInfoSection: { display: "flex", flexDirection: "column", gap: "4px" },
  taskInfoLabel: { fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", margin: 0, letterSpacing: "0.5px" },
  taskInfoValue: { fontSize: "13.5px", color: "var(--text-primary)", margin: 0, lineHeight: 1.5 },
  section: { display: "flex", flexDirection: "column", gap: "10px", marginTop: "4px", paddingTop: "14px", borderTop: "1px solid var(--border-color)" },
  sectionTitle: { fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", margin: 0 },
  helpText: { fontSize: "12.5px", color: "var(--text-secondary)", margin: "0 0 8px 0", lineHeight: 1.4 },
  actionRow: { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "8px" },
  actionBtnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "11px 18px",
    backgroundColor: "#34C759",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    width: "100%",
    marginTop: "6px",
  },
  actionBtnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "9px 14px",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: 600,
    cursor: "pointer",
  },
};
