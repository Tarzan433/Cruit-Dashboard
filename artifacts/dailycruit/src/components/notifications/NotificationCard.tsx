import type { KeyboardEvent } from "react";
import type {
  AppNotification,
  BatchedApplicationNotification,
} from "./mockNotifications";

type NotificationCardProps = {
  notification: AppNotification;
  formattedTime: string;
  onAction?: () => void;
};

function AvatarCircle({
  initial,
  color,
  className = "",
}: {
  initial: string;
  color: string;
  className?: string;
}) {
  return (
    <span
      className={`notification-avatar ${className}`.trim()}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

function StackedAvatars({
  applicants,
}: {
  applicants: BatchedApplicationNotification["applicants"];
}) {
  const visible = applicants.slice(0, 3);
  const overflow = applicants.length - visible.length;

  return (
    <div className="notification-avatar-stack" aria-hidden="true">
      {visible.map((applicant, index) => (
        <AvatarCircle
          key={`${applicant.name}-${index}`}
          initial={applicant.initial}
          color={applicant.avatarColor}
          className="notification-avatar-stacked"
        />
      ))}
      {overflow > 0 && (
        <span className="notification-avatar notification-avatar-stacked notification-avatar-overflow">
          +{overflow}
        </span>
      )}
    </div>
  );
}

function StatusWord({ status }: { status: "Shortlisted" | "Hired" | "Rejected" }) {
  const className =
    status === "Rejected"
      ? "notification-status notification-status-rejected"
      : "notification-status notification-status-positive";

  return <span className={className}>{status.toLowerCase()}</span>;
}

function renderAvatar(notification: AppNotification) {
  if (notification.type === "batched_application") {
    return <StackedAvatars applicants={notification.applicants} />;
  }

  if (notification.type === "status_change") {
    return (
      <AvatarCircle
        initial={notification.companyName.charAt(0).toUpperCase()}
        color="#16A34A"
      />
    );
  }

  return (
    <AvatarCircle
      initial={notification.senderInitial}
      color={notification.avatarColor}
    />
  );
}

function renderText(notification: AppNotification) {
  if (notification.type === "batched_application") {
    const count = notification.applicants.length;
    return (
      <p className="notification-card-text">
        <strong>{count} people</strong> applied to{" "}
        <strong>{notification.jobTitle}</strong>
      </p>
    );
  }

  if (notification.type === "status_change") {
    return (
      <p className="notification-card-text">
        <strong>{notification.companyName}</strong>{" "}
        <StatusWord status={notification.status} /> you for{" "}
        <strong>{notification.jobTitle}</strong>
      </p>
    );
  }

  return (
    <p className="notification-card-text">
      <strong>{notification.senderName}</strong> sent you a message
    </p>
  );
}

function renderActionButton(
  notification: AppNotification,
  onAction?: () => void,
) {
  if (notification.type === "batched_application") {
    return (
      <button type="button" className="notification-action-btn" onClick={onAction}>
        Review applicants
      </button>
    );
  }

  if (notification.type === "status_change") {
    return (
      <button type="button" className="notification-action-btn" onClick={onAction}>
        View company
      </button>
    );
  }

  return null;
}

export default function NotificationCard({
  notification,
  formattedTime,
  onAction,
}: NotificationCardProps) {
  const isMessage = notification.type === "new_message";
  const unreadClass = notification.read ? "" : " notification-card-unread";
  const readClass = notification.read ? " notification-card-read" : "";

  const handleClick = () => {
    if (!isMessage) return;
    onAction?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!isMessage) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  const cardProps = isMessage
    ? {
        role: "button" as const,
        tabIndex: 0,
        onClick: handleClick,
        onKeyDown: handleKeyDown,
      }
    : {};

  return (
    <article
      className={`notification-card${unreadClass}${readClass}${isMessage ? " notification-card-clickable" : ""}`}
      {...cardProps}
    >
      {!notification.read && (
        <span className="notification-unread-dot" aria-hidden="true" />
      )}

      <div className="notification-card-inner">
        <div className="notification-card-row">
          <div className="notification-card-media">{renderAvatar(notification)}</div>
          <div className="notification-card-content">
            {renderText(notification)}
            <time
              className="notification-card-time"
              dateTime={notification.createdAt.toISOString()}
            >
              {formattedTime}
            </time>
            {renderActionButton(notification, onAction)}
          </div>
        </div>
      </div>
    </article>
  );
}
