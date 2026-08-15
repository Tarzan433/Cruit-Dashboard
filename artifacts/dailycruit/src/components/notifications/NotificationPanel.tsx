import { useEffect, useMemo, useState } from "react";
import NotificationCard from "./NotificationCard";
import { mockNotifications, type AppNotification } from "./mockNotifications";

type FilterTab = "all" | "applications" | "messages";

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "applications", label: "Applications" },
  { id: "messages", label: "Messages" },
];

function BellOutlineIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function matchesFilter(notification: AppNotification, tab: FilterTab): boolean {
  if (tab === "all") return true;
  if (tab === "applications") {
    return notification.type === "batched_application" || notification.type === "status_change";
  }
  return notification.type === "new_message";
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getDayLabel(date: Date, now: Date): string {
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(date, now)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function formatNotificationTime(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (isSameDay(date, now) && diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function groupNotifications(notifications: AppNotification[], now: Date) {
  const groups = new Map<string, AppNotification[]>();

  for (const notification of notifications) {
    const label = getDayLabel(notification.createdAt, now);
    const existing = groups.get(label) ?? [];
    existing.push(notification);
    groups.set(label, existing);
  }

  return Array.from(groups.entries());
}

function getEmptyStateCopy(tab: FilterTab): { title: string; subtitle: string } {
  if (tab === "applications") {
    return {
      title: "No application updates yet",
      subtitle: "New applicants and status changes will show up here.",
    };
  }
  if (tab === "messages") {
    return {
      title: "No messages yet",
      subtitle: "When someone sends you a message, it will appear here.",
    };
  }
  return {
    title: "No notifications yet",
    subtitle: "Messages, application status and account updates will appear here.",
  };
}

type NotificationPanelProps = {
  onClose: () => void;
};

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    [...mockNotifications].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    ),
  );
  const [listVisible, setListVisible] = useState(true);

  const now = useMemo(() => new Date(), []);

  const hasUnread = notifications.some((n) => !n.read);

  const filteredNotifications = useMemo(
    () => notifications.filter((n) => matchesFilter(n, activeTab)),
    [notifications, activeTab],
  );

  const groupedNotifications = useMemo(
    () => groupNotifications(filteredNotifications, now),
    [filteredNotifications, now],
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleMarkAllRead = () => {
    if (!hasUnread) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleTabChange = (tab: FilterTab) => {
    if (tab === activeTab) return;
    setListVisible(false);
    setActiveTab(tab);
    requestAnimationFrame(() => setListVisible(true));
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const emptyCopy = getEmptyStateCopy(activeTab);

  return (
    <div className="notif-overlay" onClick={onClose}>
      <div
        className="notif-modal notification-panel"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-panel-title"
      >
        <header className="notification-panel-header">
          <h2 id="notification-panel-title" className="notification-panel-title">
            Notifications
          </h2>
          <div className="notification-panel-header-actions">
            <button
              type="button"
              className={`notification-mark-all${hasUnread ? "" : " notification-mark-all-disabled"}`}
              onClick={handleMarkAllRead}
              disabled={!hasUnread}
            >
              Mark all read
            </button>
            <button
              type="button"
              className="notif-close"
              onClick={onClose}
              title="Close"
              aria-label="Close notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        <div className="notification-panel-filters">
          <div className="filter-tags-row">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`filter-tag${activeTab === tab.id ? " filter-tag-active" : ""}`}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className={`notification-panel-body${listVisible ? " notification-panel-body-visible" : ""}`}
        >
          {filteredNotifications.length === 0 ? (
            <div className="empty-state search-empty notification-empty">
              <div className="empty-icon-badge">
                <BellOutlineIcon />
              </div>
              <h3 className="empty-title">{emptyCopy.title}</h3>
              <p className="empty-subtitle">{emptyCopy.subtitle}</p>
            </div>
          ) : (
            groupedNotifications.map(([dayLabel, items]) => (
              <section key={dayLabel} className="notification-day-group">
                <h3 className="notification-day-label">{dayLabel}</h3>
                <div className="notification-card-list">
                  {items.map((notification) => (
                    <NotificationCard
                      key={notification.id}
                      notification={notification}
                      formattedTime={formatNotificationTime(notification.createdAt, now)}
                      onAction={() => handleMarkRead(notification.id)}
                    />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
