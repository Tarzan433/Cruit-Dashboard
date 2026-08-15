export type NotificationType = "batched_application" | "status_change" | "new_message";

export type NotificationAudience = "jobseeker" | "recruiter";

export type BaseNotification = {
  id: string;
  read: boolean;
  createdAt: Date;
  audience: NotificationAudience;
};

export type BatchedApplicationNotification = BaseNotification & {
  type: "batched_application";
  applicants: { name: string; initial: string; avatarColor: string }[];
  jobTitle: string;
};

export type StatusChangeNotification = BaseNotification & {
  type: "status_change";
  companyName: string;
  status: "Shortlisted" | "Hired" | "Rejected";
  jobTitle: string;
};

export type NewMessageNotification = BaseNotification & {
  type: "new_message";
  senderName: string;
  senderInitial: string;
  avatarColor: string;
};

export type AppNotification =
  | BatchedApplicationNotification
  | StatusChangeNotification
  | NewMessageNotification;

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

function atTime(base: Date, hours: number, minutes = 0): Date {
  const d = new Date(base);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

export const mockNotifications: AppNotification[] = [
  // ── Recruiter notifications (batched_application only) ──
  {
    id: "rec-notif-1",
    audience: "recruiter",
    type: "batched_application",
    read: false,
    createdAt: atTime(today, 9, 42),
    jobTitle: "Senior Product Designer",
    applicants: [
      { name: "Amara Okafor", initial: "A", avatarColor: "#7C3AED" },
      { name: "James Chen", initial: "J", avatarColor: "#2563EB" },
      { name: "Sofia Martinez", initial: "S", avatarColor: "#DB2777" },
      { name: "Leo Nakamura", initial: "L", avatarColor: "#0891B2" },
      { name: "Priya Sharma", initial: "P", avatarColor: "#EA580C" },
    ],
  },
  {
    id: "rec-notif-2",
    audience: "recruiter",
    type: "batched_application",
    read: true,
    createdAt: atTime(yesterday, 14, 10),
    jobTitle: "Frontend Developer",
    applicants: [
      { name: "Daniel Okoye", initial: "D", avatarColor: "#0D9488" },
      { name: "Rachel Kim", initial: "R", avatarColor: "#9333EA" },
      { name: "Tomás Rivera", initial: "T", avatarColor: "#DC2626" },
    ],
  },

  // ── Job seeker notifications (status_change + new_message only) ──
  {
    id: "seek-notif-1",
    audience: "jobseeker",
    type: "status_change",
    read: false,
    createdAt: atTime(today, 11, 15),
    companyName: "Northwind Labs",
    status: "Shortlisted",
    jobTitle: "Frontend Engineer",
  },
  {
    id: "seek-notif-2",
    audience: "jobseeker",
    type: "new_message",
    read: false,
    createdAt: atTime(today, 14, 30),
    senderName: "Elena Vasquez",
    senderInitial: "E",
    avatarColor: "#059669",
  },
  {
    id: "seek-notif-3",
    audience: "jobseeker",
    type: "status_change",
    read: true,
    createdAt: atTime(today, 8, 5),
    companyName: "Brightpath Health",
    status: "Rejected",
    jobTitle: "Data Analyst",
  },
  {
    id: "seek-notif-4",
    audience: "jobseeker",
    type: "new_message",
    read: true,
    createdAt: atTime(yesterday, 16, 48),
    senderName: "Marcus Webb",
    senderInitial: "M",
    avatarColor: "#4F46E5",
  },
  {
    id: "seek-notif-5",
    audience: "jobseeker",
    type: "status_change",
    read: true,
    createdAt: atTime(yesterday, 10, 20),
    companyName: "Summit Retail Group",
    status: "Hired",
    jobTitle: "Store Operations Manager",
  },
  {
    id: "seek-notif-6",
    audience: "jobseeker",
    type: "new_message",
    read: false,
    createdAt: atTime(yesterday, 19, 12),
    senderName: "Hannah Okonkwo",
    senderInitial: "H",
    avatarColor: "#BE185D",
  },
];
