"use client";

import { useEffect, useState } from "react";
import { FolderOpen, CheckCircle2, Clock3, AlertTriangle, TrendingUp, Activity, Calendar, CheckCircle } from "lucide-react";
import Card from "../../../components/ui/Card";
import API from "../../../core/services/apiService";

export default function DeveloperDashboardPage() {
  const [stats, setStats] = useState<any>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    tasksByStatus: { pending: 0, inProgress: 0, review: 0, completed: 0 },
    tasksByPriority: { high: 0, medium: 0, low: 0 },
    upcomingDeadlines: 0,
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<any[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setStatsError(null);
      try {
        const statsResponse = await API.get("/stats/developer");
        const developerStats = statsResponse.data.data;
        
        setStats(developerStats || {});
        setRecentActivity(developerStats?.recentActivity || []);
        setUpcomingDeadlines(developerStats?.upcomingDeadlineTasks || []);
        setOverdueTasks(developerStats?.overdueTaskList || []);
      } catch (error: any) {
        console.error("Developer dashboard error:", error);
        const msg =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Could not load dashboard statistics.";
        setStatsError(typeof msg === "string" ? msg : "Could not load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cards = [
    { label: "Assigned Projects", value: stats.totalProjects || 0, icon: FolderOpen, color: "#007AFF", bg: "rgba(0, 122, 255, 0.14)" },
    { label: "Active Projects", value: stats.activeProjects || 0, icon: Activity, color: "#FF9500", bg: "rgba(255, 149, 0, 0.14)" },
    { label: "Total Tasks", value: stats.totalTasks || 0, icon: CheckCircle2, color: "#34C759", bg: "rgba(52, 199, 89, 0.14)" },
    { label: "In Progress", value: stats.tasksByStatus?.inProgress || 0, icon: Clock3, color: "#8E8E93", bg: "rgba(142, 142, 147, 0.16)" },
  ];

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: "var(--text-secondary)" }}>Loading developer stats...</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="wsd-page admin-panel-scope dev-dashboard-page">
      {/* Header Section */}
      <div style={styles.header} className="dev-dash-header">
        <div>
          <h1 style={styles.title} className="dev-dash-title">Developer Dashboard</h1>
          <p style={styles.subtitle} className="dev-dash-subtitle">Manage delivery timelines, task sprints, and project progress</p>
        </div>
        <div style={styles.liveBadge} className="dev-live-badge">
          <span style={styles.livePulse} />
          <span>Real-time Sync</span>
        </div>
      </div>

      {statsError && (
        <div style={styles.errorBanner} role="alert">
          <p style={styles.errorBannerText}>{statsError}</p>
        </div>
      )}

      {/* Top Metric Tiles Grid - 4 cards compact in one row / grid on mobile */}
      <div style={styles.grid} className="dev-stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="zoom-card dev-stat-zoom-card">
            <Card className="dev-dashboard-card wsd-unified-card">
              <div style={styles.cardContent} className="dev-metric-card">
                <div style={{ ...styles.iconWrap, backgroundColor: card.bg }} className="dev-metric-icon">
                  <card.icon size={20} color={card.color} />
                </div>
                <div style={styles.metricMeta} className="dev-metric-meta">
                  <p style={styles.cardLabel} className="dev-metric-label">{card.label}</p>
                  <p style={styles.cardValue} className="dev-metric-value">{card.value}</p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* 2 Cards in One Row: Recent Activity & Task Priorities */}
      <div style={styles.mainGrid} className="dev-content-grid">
        {/* Recent Activity */}
        <div className="zoom-card dev-content-zoom-card">
          <Card className="wsd-unified-card dev-panel-card">
            <div style={styles.sectionHeader}>
              <div>
                <h3 style={styles.sectionTitle} className="dev-section-title">Recent Activity</h3>
                <p style={styles.sectionSubtitle} className="dev-section-subtitle">Latest task and project updates</p>
              </div>
              <Activity size={18} color="#007AFF" />
            </div>
            <div style={styles.activityList} className="dev-timeline-list">
              {recentActivity.slice(0, 5).map((activity, index) => (
                <div key={activity.id || index} style={styles.activityItem}>
                  <div style={{ 
                    ...styles.activityDot, 
                    backgroundColor: activity.type === "task" ? "#007AFF" : "#34C759"
                  }} className="dev-timeline-dot"></div>
                  <div style={styles.activityContent}>
                    <p style={styles.activityText} className="dev-timeline-title">{activity.title}</p>
                    <p style={styles.activityTime} className="dev-timeline-time">
                      {activity.timestamp
                        ? new Date(activity.timestamp).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : '—'}
                    </p>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div style={styles.emptyCardBox}>
                  <p style={styles.emptyText}>No recent activity yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Task Priority Distribution */}
        <div className="zoom-card dev-content-zoom-card">
          <Card className="wsd-unified-card dev-panel-card">
            <div style={styles.sectionHeader}>
              <div>
                <h3 style={styles.sectionTitle} className="dev-section-title">Task Priorities</h3>
                <p style={styles.sectionSubtitle} className="dev-section-subtitle">Workload distribution by priority</p>
              </div>
              <AlertTriangle size={18} color="#FF9500" />
            </div>
            <div style={styles.priorityList} className="dev-priority-list">
              {[
                { label: 'High Priority', count: stats.tasksByPriority?.high || 0, color: '#FF3B30', bg: 'rgba(255, 59, 48, 0.12)' },
                { label: 'Medium Priority', count: stats.tasksByPriority?.medium || 0, color: '#007AFF', bg: 'rgba(0, 122, 255, 0.12)' },
                { label: 'Low Priority', count: stats.tasksByPriority?.low || 0, color: '#8E8E93', bg: 'rgba(142, 142, 147, 0.12)' },
              ].map((priority) => (
                <div key={priority.label} style={styles.priorityItem} className="dev-priority-row">
                  <div style={{
                    ...styles.priorityDot,
                    backgroundColor: priority.color
                  }}></div>
                  <div style={styles.priorityInfo}>
                    <p style={styles.priorityLabel} className="dev-priority-label">{priority.label}</p>
                    <p style={styles.priorityCount} className="dev-priority-count">{priority.count} tasks</p>
                  </div>
                </div>
              ))}
              {stats.totalTasks === 0 && (
                <div style={styles.emptyCardBox}>
                  <p style={styles.emptyText}>No tasks assigned yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Upcoming Deadlines & Overdue Tasks */}
      <div style={styles.deadlinesSection}>
        <Card className="wsd-unified-card dev-panel-card">
          <div style={styles.sectionHeader}>
            <div>
              <h3 style={styles.sectionTitle} className="dev-section-title">Upcoming Deadlines & Milestones</h3>
              <p style={styles.sectionSubtitle} className="dev-section-subtitle">Deliverables due within the next 7 days</p>
            </div>
            <Calendar size={18} color="#FF9500" />
          </div>

          {upcomingDeadlines.length === 0 ? (
            <div style={styles.cleanStatusBox}>
              <CheckCircle size={18} color="#34C759" />
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "13.5px" }}>
                All clear! No impending deadlines for the next 7 days.
              </p>
            </div>
          ) : (
            <div style={styles.deadlinesGrid} className="dev-deadlines-grid">
              {upcomingDeadlines.map((task) => {
                const daysLeft = Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysLeft <= 2;
                return (
                  <div key={task._id} style={{
                    ...styles.deadlineCard,
                    borderLeft: `4px solid ${isUrgent ? '#FF3B30' : '#FF9500'}`
                  }} className="dev-deadline-card">
                    <div style={styles.deadlineHeader}>
                      <strong style={styles.deadlineName} className="dev-deadline-name">{task.title}</strong>
                      {isUrgent && (
                        <span style={styles.urgentBadge} className="dev-urgent-badge">
                          <AlertTriangle size={11} />
                          <span>Urgent</span>
                        </span>
                      )}
                    </div>
                    <div style={styles.deadlineFooter}>
                      <Clock3 size={13} color="var(--text-secondary)" />
                      <span style={styles.deadlineDate} className="dev-deadline-date">
                        {daysLeft <= 0 ? 'Due today' : daysLeft === 1 ? 'Due tomorrow' : `Due in ${daysLeft} days`}
                      </span>
                      <span style={styles.deadlineDateText} className="dev-deadline-subtext">
                        {new Date(task.dueDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <style>{`
        @keyframes pulseDot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .zoom-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .zoom-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        }

        @media (max-width: 768px) {
          .dev-dash-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          .dev-dash-title {
            font-size: 22px !important;
          }
          .dev-dash-subtitle {
            font-size: 12px !important;
          }
          .dev-live-badge {
            align-self: flex-start !important;
            padding: 3px 8px !important;
            font-size: 10.5px !important;
          }

          /* 1. TOP STAT CARDS IN COMPACT 4-IN-ONE-ROW / 2x2 ON MOBILE */
          .dev-stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 6px !important;
          }
          .dev-stat-zoom-card {
            min-width: 0 !important;
          }
          .dev-dashboard-card {
            padding: 8px 4px !important;
            border-radius: 12px !important;
            min-height: 72px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
          }
          .dev-metric-card {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 3px !important;
            width: 100% !important;
          }
          .dev-metric-icon {
            width: 26px !important;
            height: 26px !important;
            border-radius: 7px !important;
          }
          .dev-metric-icon svg {
            width: 13px !important;
            height: 13px !important;
          }
          .dev-metric-meta {
            text-align: center !important;
            width: 100% !important;
          }
          .dev-metric-label {
            font-size: 9.5px !important;
            line-height: 1.15 !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            text-align: center !important;
          }
          .dev-metric-value {
            font-size: 14px !important;
            margin: 1px 0 0 0 !important;
            text-align: center !important;
            letter-spacing: -0.01em !important;
          }

          /* 2. RECENT ACTIVITY & PRIORITIES IN ONE ROW IN MOBILE VIEW */
          .dev-content-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .dev-content-zoom-card {
            min-width: 0 !important;
          }
          .dev-panel-card {
            padding: 10px 8px !important;
            border-radius: 14px !important;
          }
          .dev-section-title {
            font-size: 12.5px !important;
            margin-bottom: 2px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .dev-section-subtitle {
            display: none !important;
          }
          .dev-timeline-list {
            gap: 8px !important;
          }
          .dev-timeline-dot {
            width: 6px !important;
            height: 6px !important;
            margin-top: 4px !important;
          }
          .dev-timeline-title {
            font-size: 11px !important;
            line-height: 1.25 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .dev-timeline-time {
            font-size: 9px !important;
          }

          /* Priorities */
          .dev-priority-list {
            gap: 6px !important;
          }
          .dev-priority-row {
            padding: 6px 8px !important;
            gap: 6px !important;
            border-radius: 8px !important;
          }
          .dev-priority-label {
            font-size: 11px !important;
            line-height: 1.2 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .dev-priority-count {
            font-size: 9.5px !important;
          }

          /* Deadlines */
          .dev-deadlines-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          .dev-deadline-card {
            padding: 10px 12px !important;
          }
          .dev-deadline-name {
            font-size: 12px !important;
          }
          .dev-deadline-date {
            font-size: 11px !important;
          }
          .dev-deadline-subtext {
            font-size: 10px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, any> = {
  container: { 
    padding: 0, 
    display: "flex", 
    flexDirection: "column", 
    gap: "24px",
    backgroundColor: "transparent",
    minHeight: "100vh"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
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
  liveBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 14px",
    borderRadius: "999px",
    backgroundColor: "rgba(52, 199, 89, 0.12)",
    border: "1px solid rgba(52, 199, 89, 0.28)",
    color: "#34C759",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.2px",
    flexShrink: 0,
  },
  livePulse: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#34C759",
    animation: "pulseDot 1.8s ease-in-out infinite",
  },
  grid: { 
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
    gap: "16px" 
  },
  cardContent: { display: "flex", gap: "16px", alignItems: "center" },
  iconWrap: { 
    width: "48px", 
    height: "48px", 
    borderRadius: "14px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    flexShrink: 0,
  },
  metricMeta: {
    flex: 1,
    minWidth: 0,
  },
  cardLabel: { margin: 0, fontSize: "13px", color: "var(--text-secondary)", fontWeight: 600 },
  cardValue: { 
    margin: "4px 0 0 0", 
    fontSize: "26px", 
    fontWeight: 800, 
    color: "var(--text-primary)",
    letterSpacing: "-0.5px"
  },
  mainGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "20px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" },
  sectionTitle: { fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", margin: 0 },
  sectionSubtitle: { fontSize: "13px", color: "var(--text-secondary)", margin: "4px 0 0 0" },
  activityList: { display: "flex", flexDirection: "column" as const, gap: "14px" },
  activityItem: { display: "flex", gap: "12px", alignItems: "flex-start" },
  activityDot: { width: "8px", height: "8px", borderRadius: "50%", marginTop: "6px", flexShrink: 0 },
  activityContent: { flex: 1, minWidth: 0 },
  activityText: { fontSize: "14px", color: "var(--text-primary)", margin: 0, marginBottom: "3px", lineHeight: 1.4, fontWeight: 500 },
  activityTime: { fontSize: "12px", color: "var(--text-secondary)", margin: 0 },
  priorityList: { display: "flex", flexDirection: "column" as const, gap: "10px" },
  priorityItem: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px", backgroundColor: "var(--bg-secondary)", borderRadius: "12px" },
  priorityDot: { width: "10px", height: "10px", borderRadius: "50%", flexShrink: 0 },
  priorityInfo: { flex: 1, minWidth: 0 },
  priorityLabel: { fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 },
  priorityCount: { fontSize: "12px", color: "var(--text-secondary)", margin: "2px 0 0 0" },
  deadlinesSection: {
    marginTop: "4px",
  },
  deadlinesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" },
  deadlineCard: { padding: "14px 16px", backgroundColor: "var(--bg-secondary)", borderRadius: "12px" },
  deadlineHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", gap: "8px" },
  deadlineName: { fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", flex: 1 },
  urgentBadge: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "3px 7px",
    backgroundColor: "rgba(255, 59, 48, 0.16)",
    color: "#FF3B30",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 700,
    flexShrink: 0,
  },
  deadlineFooter: { display: "flex", alignItems: "center", gap: "8px" },
  deadlineDate: { fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", flex: 1 },
  deadlineDateText: { fontSize: "12px", color: "var(--text-secondary)" },
  cleanStatusBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    borderRadius: "12px",
    backgroundColor: "rgba(52, 199, 89, 0.08)",
    border: "1px solid rgba(52, 199, 89, 0.2)",
  },
  emptyCardBox: {
    padding: "24px 12px",
    textAlign: "center" as const,
  },
  emptyText: { fontSize: "13.5px", color: "var(--text-secondary)", margin: 0 },
  errorBanner: {
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255, 59, 48, 0.2)",
    backgroundColor: "rgba(255, 59, 48, 0.08)",
    color: "#FF3B30",
  },
  errorBannerText: { margin: 0, fontSize: "14px", fontWeight: 600 },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    gap: "16px",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid var(--border-color)",
    borderTopColor: "#007AFF",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};
