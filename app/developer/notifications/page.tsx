"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  Folder, 
  TrendingUp, 
  MailOpen, 
  Filter, 
  LifeBuoy, 
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import API from "../../../core/services/apiService";
import Card from "../../../components/ui/Card";

interface Notification {
  _id: string;
  type: string;
  message: string;
  title?: string;
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}

export default function DeveloperNotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "project" | "task" | "general">("all");
  const [markingAll, setMarkingAll] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchNotifications();
  }, [router]);

  const fetchNotifications = async () => {
    try {
      const response = await API.get("/users/notifications");
      const list = response.data.data || response.data.notifications || [];
      setNotifications(list);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Support both PATCH and POST as per routes
      try {
        await API.patch(`/users/notifications/${notificationId}/read`);
      } catch {
        await API.post(`/users/notifications/${notificationId}/read`);
      }
      setNotifications((current) =>
        current.map((item) => (item._id === notificationId ? { ...item, isRead: true } : item))
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setMarkingAll(true);
    try {
      try {
        await API.post("/users/notifications/mark-all-read");
      } catch {
        const unread = notifications.filter((item) => !item.isRead);
        await Promise.all(
          unread.map((item) => API.patch(`/users/notifications/${item._id}/read`).catch(() => {}))
        );
      }
      setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const getNotificationCategory = (n: Notification): "project" | "task" | "general" => {
    const typeStr = (n.type || "").toLowerCase();
    const msgStr = (n.message || "").toLowerCase();
    const titleStr = (n.title || "").toLowerCase();

    if (typeStr.includes("project") || msgStr.includes("project") || titleStr.includes("project")) {
      return "project";
    }
    if (typeStr.includes("task") || msgStr.includes("task") || titleStr.includes("task") || msgStr.includes("sprint")) {
      return "task";
    }
    return "general";
  };

  const getNotificationIcon = (n: Notification) => {
    const cat = getNotificationCategory(n);
    switch (cat) {
      case "project":
        return { icon: Folder, color: "#007AFF", bg: "rgba(0, 122, 255, 0.12)" };
      case "task":
        return { icon: TrendingUp, color: "#34C759", bg: "rgba(52, 199, 89, 0.12)" };
      default:
        return { icon: Bell, color: "#FF9500", bg: "rgba(255, 149, 0, 0.12)" };
    }
  };

  const filteredNotifications = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((n) => getNotificationCategory(n) === filter);
  }, [notifications, filter]);

  const counts = useMemo(() => {
    const unread = notifications.filter((n) => !n.isRead).length;
    const project = notifications.filter((n) => getNotificationCategory(n) === "project").length;
    const task = notifications.filter((n) => getNotificationCategory(n) === "task").length;
    const general = notifications.filter((n) => getNotificationCategory(n) === "general").length;
    return { unread, project, task, general, total: notifications.length };
  }, [notifications]);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: "var(--text-secondary)" }}>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div style={styles.container} className="wsd-page admin-panel-scope dev-notifications-page">
      {/* Header */}
      <div style={styles.header} className="dev-notifications-header">
        <div style={styles.headerTitleBlock} className="dev-notifications-title-block">
          <div className="dev-notifications-title-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h1 style={styles.title} className="dev-notifications-title">Notifications</h1>
            {counts.unread > 0 && (
              <span style={styles.unreadBadge} className="dev-notif-unread-badge">
                {counts.unread} unread
              </span>
            )}
          </div>
          <p style={styles.subtitle} className="dev-notifications-subtitle">
            Stay updated on assigned projects, sprint tasks, and system activity
          </p>
        </div>

        <div style={styles.headerActions} className="dev-notifications-actions">
          {counts.unread > 0 && (
            <button
              onClick={markAllAsRead}
              disabled={markingAll}
              style={styles.markAllBtn}
              className="dev-notif-mark-all-btn"
            >
              <MailOpen size={15} />
              <span className="mark-all-text-desktop">Mark all as read</span>
              <span className="mark-all-text-mobile">Mark all read</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterTabs} className="dev-notifications-filter-tabs">
        <button
          onClick={() => setFilter("all")}
          style={{ ...styles.filterBtn, ...(filter === "all" ? styles.filterActive : {}) }}
          className={`dev-notif-filter-btn ${filter === "all" ? "dev-notif-filter-active" : ""}`}
        >
          <Bell size={14} />
          <span>All</span>
          <span style={styles.tabBadge} className="dev-notif-tab-badge">{counts.total}</span>
        </button>
        <button
          onClick={() => setFilter("project")}
          style={{ ...styles.filterBtn, ...(filter === "project" ? styles.filterActive : {}) }}
          className={`dev-notif-filter-btn ${filter === "project" ? "dev-notif-filter-active" : ""}`}
        >
          <Folder size={14} />
          <span>Projects</span>
          <span style={styles.tabBadge} className="dev-notif-tab-badge">{counts.project}</span>
        </button>
        <button
          onClick={() => setFilter("task")}
          style={{ ...styles.filterBtn, ...(filter === "task" ? styles.filterActive : {}) }}
          className={`dev-notif-filter-btn ${filter === "task" ? "dev-notif-filter-active" : ""}`}
        >
          <TrendingUp size={14} />
          <span>Tasks</span>
          <span style={styles.tabBadge} className="dev-notif-tab-badge">{counts.task}</span>
        </button>
        <button
          onClick={() => setFilter("general")}
          style={{ ...styles.filterBtn, ...(filter === "general" ? styles.filterActive : {}) }}
          className={`dev-notif-filter-btn ${filter === "general" ? "dev-notif-filter-active" : ""}`}
        >
          <AlertCircle size={14} />
          <span>General</span>
          <span style={styles.tabBadge} className="dev-notif-tab-badge">{counts.general}</span>
        </button>
      </div>

      {/* Notifications List */}
      <div style={styles.notificationsList} className="dev-notifications-list">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => {
            const iconConfig = getNotificationIcon(notification);
            const IconComponent = iconConfig.icon;

            return (
              <div
                key={notification._id}
                style={{
                  ...styles.notificationItem,
                  backgroundColor: notification.isRead ? "var(--bg-secondary)" : "rgba(0, 122, 255, 0.05)",
                  borderColor: notification.isRead ? "var(--border-color)" : "rgba(0, 122, 255, 0.3)",
                }}
                className={`dev-notification-card ${!notification.isRead ? "dev-notif-unread" : ""}`}
              >
                <div style={{ ...styles.notificationIconWrap, backgroundColor: iconConfig.bg }} className="dev-notif-icon-wrap">
                  <IconComponent size={18} color={iconConfig.color} />
                </div>

                <div style={styles.notificationContent} className="dev-notif-content">
                  <div style={styles.notificationHeaderRow} className="dev-notif-header-row">
                    <h4 style={styles.notificationTitle} className="dev-notif-title">
                      {notification.title || "Developer Notification"}
                    </h4>
                    {!notification.isRead && (
                      <span style={styles.newDot} title="Unread" />
                    )}
                  </div>
                  <p style={styles.notificationMessage} className="dev-notif-message">
                    {notification.message}
                  </p>
                  <div style={styles.notificationMeta} className="dev-notif-meta">
                    <Clock size={12} />
                    <span>{new Date(notification.createdAt).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}</span>
                  </div>
                </div>

                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    style={styles.markReadBtn}
                    className="dev-notif-mark-item-btn"
                    title="Mark this notification as read"
                  >
                    <CheckCheck size={14} />
                    <span>Mark read</span>
                  </button>
                )}
              </div>
            );
          })
        ) : (
          <div style={styles.emptyContainer} className="dev-notifications-empty">
            <Bell size={44} color="var(--border-color)" />
            <h3 style={styles.emptyTitle}>No notifications</h3>
            <p style={styles.emptyText}>
              {filter === "all"
                ? "You have no notifications yet. When projects or tasks are assigned, they'll appear here."
                : `No notifications found under "${filter}".`}
            </p>
          </div>
        )}
      </div>

      <style>{`
        .mark-all-text-mobile { display: none; }
        .mark-all-text-desktop { display: inline; }

        @media (max-width: 768px) {
          .dev-notifications-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
            margin-bottom: 16px !important;
          }
          .dev-notifications-title {
            font-size: 20px !important;
            margin-bottom: 2px !important;
          }
          .dev-notifications-subtitle {
            font-size: 11.5px !important;
            line-height: 1.3 !important;
          }
          .dev-notif-unread-badge {
            font-size: 10px !important;
            padding: 2px 6px !important;
          }
          .dev-notifications-actions {
            width: 100% !important;
          }
          .dev-notif-mark-all-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 6px 10px !important;
            font-size: 11.5px !important;
            border-radius: 8px !important;
          }
          .mark-all-text-desktop { display: none !important; }
          .mark-all-text-mobile { display: inline !important; }
          .dev-notifications-filter-tabs {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 2px !important;
            padding: 2.5px !important;
            background: var(--bg-secondary) !important;
            border: 1px solid var(--border-color) !important;
            border-radius: 9px !important;
            margin-bottom: 12px !important;
            width: 100% !important;
            overflow: visible !important;
          }
          .dev-notif-filter-btn {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 5px 2px !important;
            font-size: 10.5px !important;
            border-radius: 6px !important;
            border: none !important;
            gap: 2px !important;
            min-width: 0 !important;
            width: 100% !important;
            background: transparent !important;
            color: var(--text-secondary) !important;
          }
          .dev-notif-filter-btn svg {
            width: 11px !important;
            height: 11px !important;
            flex-shrink: 0 !important;
          }
          .dev-notif-filter-btn span {
            font-size: 10.5px !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .dev-notifications-filter-tabs button[style*="#007AFF"],
          .dev-notifications-filter-tabs button:has(span[style*="#fff"]),
          .dev-notif-filter-active {
            background: var(--bg-primary) !important;
            color: #007AFF !important;
            box-shadow: 0 1px 4px rgba(0,0,0,0.08) !important;
          }
          .dev-notif-tab-badge {
            padding: 1px 3.5px !important;
            font-size: 9px !important;
            border-radius: 999px !important;
            margin-left: 1px !important;
            flex-shrink: 0 !important;
            background: rgba(0,0,0,0.08) !important;
          }
          .dev-notification-card {
            padding: 9px 10px !important;
            gap: 8px !important;
            border-radius: 11px !important;
          }
          .dev-notif-icon-wrap {
            width: 26px !important;
            height: 26px !important;
            border-radius: 6px !important;
          }
          .dev-notif-icon-wrap svg {
            width: 12px !important;
            height: 12px !important;
          }
          .dev-notif-title {
            font-size: 13px !important;
          }
          .dev-notif-message {
            font-size: 11.5px !important;
            line-height: 1.35 !important;
            margin-bottom: 4px !important;
          }
          .dev-notif-meta {
            font-size: 10px !important;
          }
          .dev-notif-mark-item-btn {
            padding: 3px 7px !important;
            font-size: 10.5px !important;
            border-radius: 6px !important;
            align-self: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, any> = {
  container: { padding: 0, backgroundColor: "transparent", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "24px" },
  headerTitleBlock: { flex: 1 },
  title: { margin: 0, fontSize: "32px", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" },
  subtitle: { margin: "6px 0 0", fontSize: "14.5px", color: "var(--text-secondary)" },
  unreadBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 8px",
    borderRadius: "999px",
    backgroundColor: "rgba(0, 122, 255, 0.12)",
    color: "#007AFF",
    fontSize: "12px",
    fontWeight: 700,
  },
  headerActions: { display: "flex", alignItems: "center", gap: "10px" },
  markAllBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "9px 16px",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    fontSize: "13.5px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  filterTabs: { display: "flex", gap: "10px", marginBottom: "20px" },
  filterBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "9px 16px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    color: "var(--text-secondary)",
    transition: "all 0.2s ease",
  },
  filterActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
    color: "#fff",
  },
  tabBadge: {
    padding: "1px 6px",
    borderRadius: "999px",
    backgroundColor: "rgba(0,0,0,0.08)",
    fontSize: "11px",
    fontWeight: 700,
  },
  notificationsList: { display: "flex", flexDirection: "column", gap: "10px" },
  notificationItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    padding: "16px 20px",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
    transition: "all 0.2s ease",
  },
  notificationIconWrap: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "2px",
  },
  notificationContent: { flex: 1, minWidth: 0 },
  notificationHeaderRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" },
  notificationTitle: { margin: 0, fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" },
  newDot: { width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#007AFF", flexShrink: 0 },
  notificationMessage: { margin: "0 0 8px 0", fontSize: "13.5px", color: "var(--text-secondary)", lineHeight: 1.45 },
  notificationMeta: { display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--text-secondary)" },
  markReadBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "7px 12px",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
    alignSelf: "center",
  },
  loadingContainer: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px", gap: "16px" },
  spinner: { width: "36px", height: "36px", border: "3px solid var(--border-color)", borderTopColor: "#007AFF", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  emptyContainer: { textAlign: "center", padding: "60px 20px" },
  emptyTitle: { fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", marginTop: "16px", marginBottom: "6px" },
  emptyText: { fontSize: "13.5px", color: "var(--text-secondary)" },
};
