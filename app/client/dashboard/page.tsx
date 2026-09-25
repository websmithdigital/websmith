"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Bell, CalendarClock, CreditCard, FolderKanban, LifeBuoy, TrendingUp, CheckCircle } from "lucide-react";
import Card from "../../../components/ui/Card";
import API from "../../../core/services/apiService";

type ActivityItem = {
  id: string;
  type: string;
  title: string;
  timestamp: string;
};

type DeadlineProject = {
  _id: string;
  name: string;
  expectedCompletionDate: string;
  status: string;
  progress: number;
};

type DashboardStats = {
  projects: number;
  activeProjects: number;
  completedTasks: number;
  revenue: number;
  unreadNotifications: number;
  openQueries: number;
  recentActivity: ActivityItem[];
  upcomingDeadlines: DeadlineProject[];
  overdueProjects: DeadlineProject[];
};

const defaultStats: DashboardStats = {
  projects: 0,
  activeProjects: 0,
  completedTasks: 0,
  revenue: 0,
  unreadNotifications: 0,
  openQueries: 0,
  recentActivity: [],
  upcomingDeadlines: [],
  overdueProjects: [],
};

export default function ClientDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await API.get("/stats");
        setStats({ ...defaultStats, ...(response.data.data || {}) });
      } catch (err: any) {
        console.error("Client dashboard error:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const cards = useMemo(
    () => [
      { label: "Assigned Projects", value: stats.projects, icon: FolderKanban, color: "#007AFF", bg: "rgba(0, 122, 255, 0.16)" },
      { label: "Active Projects", value: stats.activeProjects, icon: TrendingUp, color: "#0F9D7A", bg: "rgba(15, 157, 122, 0.16)" },
      { label: "Open Queries", value: stats.openQueries, icon: LifeBuoy, color: "#F59E0B", bg: "rgba(245, 158, 11, 0.16)" },
      { label: "Unread Alerts", value: stats.unreadNotifications, icon: Bell, color: "#8B5CF6", bg: "rgba(139, 92, 246, 0.16)" },
      { label: "Completed Payments", value: `$${Number(stats.revenue || 0).toLocaleString()}`, icon: CreditCard, color: "#10B981", bg: "rgba(16, 185, 129, 0.16)" },
      { label: "Completed Tasks", value: stats.completedTasks, icon: CalendarClock, color: "#EF4444", bg: "rgba(239, 68, 68, 0.16)" },
    ],
    [stats]
  );

  if (loading) {
    return (
      <div style={styles.stateContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.state}>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.stateContainer}>
        <AlertCircle size={28} color="#EF4444" />
        <p style={{ ...styles.state, color: "#EF4444" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="wsd-page admin-panel-scope client-dashboard-page">
      {/* Header Section */}
      <div style={styles.header} className="client-dash-header">
        <div>
          <h1 style={styles.title} className="client-dash-title">Dashboard</h1>
          <p style={styles.subtitle} className="client-dash-subtitle">A live snapshot of your project health, deadlines, and communication.</p>
        </div>
        <div style={styles.liveBadge} className="client-live-badge">
          <span style={styles.livePulse} />
          <span>Real-time Sync</span>
        </div>
      </div>

      {/* Top Metric Tiles Grid - 3 cards in one row on mobile */}
      <div style={styles.cardGrid} className="client-stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="zoom-card client-stat-zoom-card">
            <Card className="client-dashboard-card wsd-unified-card">
              <div style={styles.metricCard} className="client-metric-card">
                <div style={{ ...styles.metricIcon, backgroundColor: card.bg }} className="client-metric-icon">
                  <card.icon size={20} color={card.color} />
                </div>
                <div style={styles.metricMeta} className="client-metric-meta">
                  <p style={styles.metricLabel} className="client-metric-label">{card.label}</p>
                  <p style={styles.metricValue} className="client-metric-value">{card.value}</p>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* 2 Cards in One Row: Recent Activity & Upcoming Deadlines */}
      <div style={styles.contentGrid} className="client-content-grid">
        {/* Recent Activity */}
        <div className="zoom-card client-content-zoom-card">
          <Card className="wsd-unified-card client-panel-card">
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle} className="client-section-title">Recent Activity</h2>
            </div>
            {stats.recentActivity.length === 0 ? (
              <div style={styles.emptyCardBox} className="emptyCardBox">
                <p style={styles.emptyText}>No recent activity yet.</p>
              </div>
            ) : (
              <div style={styles.timeline} className="client-timeline-list">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} style={styles.timelineItem}>
                    <div style={styles.timelineDot} className="client-timeline-dot" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={styles.timelineTitle} className="client-timeline-title">{activity.title}</p>
                      <p style={styles.timelineTime} className="client-timeline-time">{new Date(activity.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Upcoming Deadlines */}
        <div className="zoom-card client-content-zoom-card">
          <Card className="wsd-unified-card client-panel-card">
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle} className="client-section-title">Upcoming Deadlines</h2>
            </div>
            {stats.upcomingDeadlines.length === 0 ? (
              <div style={styles.emptyCardBox} className="emptyCardBox">
                <CheckCircle size={20} color="#10B981" />
                <p style={styles.emptyText}>Nothing due in 7 days.</p>
              </div>
            ) : (
              <div style={styles.alertList} className="client-alert-list">
                {stats.upcomingDeadlines.map((project) => (
                  <div key={project._id} style={styles.alertCard} className="client-alert-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={styles.alertTitle} className="client-alert-title">{project.name}</p>
                      <p style={styles.alertMeta} className="client-alert-meta">Due {new Date(project.expectedCompletionDate).toLocaleDateString()}</p>
                    </div>
                    <span style={styles.progressPill} className="client-progress-pill">{project.progress || 0}%</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Overdue Alerts Section */}
      <div className="zoom-card">
        <Card className="wsd-unified-card client-panel-card">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle} className="client-section-title">Overdue Alerts</h2>
          </div>
          {stats.overdueProjects.length === 0 ? (
            <div style={styles.cleanStatusBox}>
              <CheckCircle size={20} color="#10B981" />
              <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "13.5px" }}>
                No overdue projects right now. All milestones are on track.
              </p>
            </div>
          ) : (
            <div style={styles.overdueList}>
              {stats.overdueProjects.map((project) => (
                <div key={project._id} style={styles.overdueCard} className="client-overdue-row">
                  <AlertCircle size={18} color="#DC2626" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={styles.alertTitle} className="client-alert-title">{project.name}</p>
                    <p style={styles.alertMeta} className="client-alert-meta">
                      Missed {new Date(project.expectedCompletionDate).toLocaleDateString()} with status {project.status.replace("-", " ")}
                    </p>
                  </div>
                  <span style={{ ...styles.progressPill, backgroundColor: "rgba(220, 38, 38, 0.16)", color: "#DC2626" }} className="client-progress-pill">
                    {project.progress || 0}%
                  </span>
                </div>
              ))}
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

        @media (max-width: 768px) {
          .client-dash-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 10px !important;
          }
          .client-dash-title {
            font-size: 22px !important;
          }
          .client-dash-subtitle {
            font-size: 12px !important;
          }
          .client-live-badge {
            align-self: flex-start !important;
            padding: 3px 8px !important;
            font-size: 10.5px !important;
          }

          /* 1. THREE STAT CARDS IN ONE ROW IN MOBILE VIEW */
          .client-stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 6px !important;
          }
          .client-stat-zoom-card {
            min-width: 0 !important;
          }
          .client-dashboard-card {
            padding: 8px 4px !important;
            border-radius: 12px !important;
            min-height: 72px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04) !important;
          }
          .client-metric-card {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 3px !important;
            width: 100% !important;
          }
          .client-metric-icon {
            width: 26px !important;
            height: 26px !important;
            border-radius: 7px !important;
          }
          .client-metric-icon svg {
            width: 13px !important;
            height: 13px !important;
          }
          .client-metric-meta {
            text-align: center !important;
            width: 100% !important;
          }
          .client-metric-label {
            font-size: 9.5px !important;
            line-height: 1.15 !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
            text-align: center !important;
          }
          .client-metric-value {
            font-size: 14px !important;
            margin: 1px 0 0 0 !important;
            text-align: center !important;
            letter-spacing: -0.01em !important;
          }

          /* 2. RECENT ACTIVITY & UPCOMING DEADLINES IN ONE ROW IN MOBILE VIEW */
          .client-content-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .client-content-zoom-card {
            min-width: 0 !important;
          }
          .client-panel-card {
            padding: 10px 8px !important;
            border-radius: 14px !important;
          }
          .client-section-title {
            font-size: 12.5px !important;
            margin-bottom: 6px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .client-timeline-list {
            gap: 8px !important;
          }
          .client-timeline-dot {
            width: 6px !important;
            height: 6px !important;
            margin-top: 4px !important;
          }
          .client-timeline-title {
            font-size: 11px !important;
            line-height: 1.25 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .client-timeline-time {
            font-size: 9px !important;
          }
          .client-alert-list {
            gap: 6px !important;
          }
          .client-alert-row {
            padding: 6px 6px !important;
            gap: 4px !important;
            border-radius: 8px !important;
          }
          .client-alert-title {
            font-size: 11px !important;
            line-height: 1.2 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .client-alert-meta {
            font-size: 9px !important;
          }
          .client-progress-pill {
            padding: 2px 4px !important;
            font-size: 9px !important;
            border-radius: 5px !important;
          }
          .emptyCardBox {
            padding: 12px 4px !important;
            font-size: 10.5px !important;
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
    width: "100%",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 700,
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "var(--text-secondary)",
    fontSize: "14.5px",
  },
  liveBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 12px",
    borderRadius: "999px",
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    color: "#059669",
    fontSize: "12px",
    fontWeight: 600,
    border: "1px solid rgba(16, 185, 129, 0.2)",
  },
  livePulse: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#10B981",
    animation: "pulseDot 2s infinite ease-in-out",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: "16px",
  },
  metricCard: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  metricMeta: {
    minWidth: 0,
    flex: 1,
  },
  metricIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "13px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  metricLabel: {
    margin: 0,
    fontSize: "12.5px",
    color: "var(--text-secondary)",
    fontWeight: 500,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  metricValue: {
    margin: "3px 0 0",
    fontSize: "22px",
    fontWeight: 700,
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },
  sectionHeader: {
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "17px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  timelineItem: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
  },
  timelineDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#007AFF",
    marginTop: "6px",
    flexShrink: 0,
  },
  timelineTitle: {
    margin: 0,
    color: "var(--text-primary)",
    fontWeight: 600,
    fontSize: "14px",
  },
  timelineTime: {
    margin: "3px 0 0",
    color: "var(--text-secondary)",
    fontSize: "12px",
  },
  emptyCardBox: {
    padding: "32px 16px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  emptyText: {
    margin: 0,
    color: "var(--text-secondary)",
    fontSize: "13.5px",
  },
  alertList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  alertCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    backgroundColor: "var(--bg-secondary)",
  },
  overdueList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  overdueCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    border: "1px solid rgba(220, 38, 38, 0.25)",
    borderRadius: "12px",
    backgroundColor: "rgba(220, 38, 38, 0.06)",
  },
  cleanStatusBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    borderRadius: "12px",
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    border: "1px solid rgba(16, 185, 129, 0.2)",
  },
  alertTitle: {
    margin: 0,
    color: "var(--text-primary)",
    fontWeight: 600,
    fontSize: "14px",
  },
  alertMeta: {
    margin: "3px 0 0",
    color: "var(--text-secondary)",
    fontSize: "12.5px",
  },
  progressPill: {
    padding: "4px 9px",
    borderRadius: "999px",
    backgroundColor: "rgba(0, 122, 255, 0.14)",
    color: "#007AFF",
    fontSize: "12px",
    fontWeight: 700,
    flexShrink: 0,
  },
  stateContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    gap: "14px",
  },
  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid var(--border-color)",
    borderTopColor: "#007AFF",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  state: {
    color: "var(--text-secondary)",
    fontSize: "14px",
  },
};
