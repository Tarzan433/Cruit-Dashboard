import type { Company } from "../../models/company";

export type NotificationType = "batched_application" | "status_change" | "new_message";

export type NotificationAudience = "jobseeker" | "recruiter";

export type BaseNotification = {
  id: string;
  read: boolean;
  createdAt: Date;
  audience: NotificationAudience;
};

export type MockApplicant = {
  name: string;
  initial: string;
  avatarColor: string;
  headline?: string;
  location?: string;
  email?: string;
  phoneNumber?: string;
  about?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
};

export type BatchedApplicationNotification = BaseNotification & {
  type: "batched_application";
  applicants: MockApplicant[];
  jobTitle: string;
  /** Stable mock resource ID — replace with real Firestore jobId in production. */
  jobId: string;
};

export type StatusChangeNotification = BaseNotification & {
  type: "status_change";
  companyName: string;
  companyId?: string;
  companyData?: Company;
  status: "Shortlisted" | "Hired" | "Rejected";
  jobTitle: string;
  /** Stable mock resource ID — replace with real Firestore applicationId in production. */
  applicationId: string;
};

export type NewMessageNotification = BaseNotification & {
  type: "new_message";
  senderName: string;
  senderInitial: string;
  avatarColor: string;
  /** Stable mock resource ID — replace with real Firestore conversationId in production. */
  conversationId: string;
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
    jobId: "mock-job-001",
    applicants: [
      {
        name: "Amara Okafor",
        initial: "A",
        avatarColor: "#7C3AED",
        headline: "Senior Product Designer · 6 yrs exp",
        location: "London, UK",
        email: "amara.okafor@example.com",
        phoneNumber: "+44 20 7946 0912",
        skills: ["Figma", "Design Systems", "User Research", "Prototyping", "UI/UX Strategy"],
        about: "Passionate product designer with 6+ years of experience crafting intuitive digital experiences for fintech and consumer platforms.",
        experience: "Lead Product Designer at FinTech Global (2021 - Present)\nSenior UI/UX Designer at Creative Studio (2018 - 2021)",
        education: "BA (Hons) in Interaction Design, University of the Arts London",
        linkedin: "https://linkedin.com/in/amara-okafor",
        portfolio: "https://amaraokafor.design",
      },
      {
        name: "James Chen",
        initial: "J",
        avatarColor: "#2563EB",
        headline: "Lead UI/UX Designer · Design Systems Specialist",
        location: "San Francisco, CA",
        email: "james.chen@example.com",
        phoneNumber: "+1 (415) 555-0142",
        skills: ["Design Systems", "Figma", "Interaction Design", "Typography", "HTML/CSS"],
        about: "Specialized in creating scalable multi-brand design systems and high-fidelity interaction prototypes for high-growth tech companies.",
        experience: "Senior UI Designer at Nova Labs (2020 - Present)\nUI/UX Designer at Stripe (2017 - 2020)",
        education: "BS in Human-Computer Interaction, UC Berkeley",
        linkedin: "https://linkedin.com/in/james-chen-design",
      },
      {
        name: "Sofia Martinez",
        initial: "S",
        avatarColor: "#DB2777",
        headline: "Product Designer & UX Strategist",
        location: "Barcelona, Spain",
        email: "sofia.martinez@example.com",
        phoneNumber: "+34 91 123 4567",
        skills: ["UX Strategy", "User Journey", "Wireframing", "Figma", "Usability Testing"],
        about: "Bridging the gap between user needs and business objectives through research-driven product design and iterative prototyping.",
        experience: "Product Designer at Veloce Digital (2019 - Present)",
        education: "Master in Digital Experience Design, Elisava",
      },
      {
        name: "Leo Nakamura",
        initial: "L",
        avatarColor: "#0891B2",
        headline: "Senior UX/UI Designer · Mobile & Web",
        location: "Tokyo, Japan",
        email: "leo.nakamura@example.com",
        phoneNumber: "+81 3 5555 0199",
        skills: ["Mobile UX", "iOS/Android Design", "Figma", "Micro-interactions", "Design Ops"],
        about: "Obsessed with micro-interactions, accessibility, and delightful mobile interfaces for consumer apps with millions of active users.",
        experience: "Senior UX Designer at Rakuten (2018 - Present)",
        education: "B.A. in Media Studies, Keio University",
      },
      {
        name: "Priya Sharma",
        initial: "P",
        avatarColor: "#EA580C",
        headline: "Staff Product Designer",
        location: "Bengaluru, India",
        email: "priya.sharma@example.com",
        phoneNumber: "+91 80 2345 6789",
        skills: ["Product Strategy", "Figma", "Data-driven Design", "Accessibility", "Design Systems"],
        about: "10+ years shaping high-growth B2B and consumer web platforms. Focused on high-conversion workflows and cohesive user journeys.",
        experience: "Staff Designer at Razorpay (2020 - Present)",
        education: "B.Des in Product Design, National Institute of Design",
      },
    ],
  },
  {
    id: "rec-notif-2",
    audience: "recruiter",
    type: "batched_application",
    read: true,
    createdAt: atTime(yesterday, 14, 10),
    jobTitle: "Frontend Developer",
    jobId: "mock-job-002",
    applicants: [
      {
        name: "Daniel Okoye",
        initial: "D",
        avatarColor: "#0D9488",
        headline: "Senior Frontend Engineer · React & TypeScript",
        location: "Lagos, Nigeria",
        email: "daniel.okoye@example.com",
        phoneNumber: "+234 1 234 5678",
        skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
        about: "Frontend engineer building performant, accessible web apps with modern React and TypeScript ecosystems.",
        experience: "Senior Frontend Engineer at Flutterwave (2021 - Present)",
        education: "B.Sc in Computer Science, University of Lagos",
        github: "https://github.com/daniel-okoye",
      },
      {
        name: "Rachel Kim",
        initial: "R",
        avatarColor: "#9333EA",
        headline: "Frontend Developer · UI Engineer",
        location: "Seoul, South Korea",
        email: "rachel.kim@example.com",
        phoneNumber: "+82 2 555 0123",
        skills: ["JavaScript", "React", "CSS3/Animations", "Vite", "Performance"],
        about: "Passionate about web performance, animations, and clean reusable UI component architectures.",
        experience: "Frontend Developer at Line Corp (2020 - Present)",
        education: "B.S. in Software Engineering, KAIST",
      },
      {
        name: "Tomás Rivera",
        initial: "T",
        avatarColor: "#DC2626",
        headline: "Full Stack / Frontend Specialist",
        location: "Buenos Aires, Argentina",
        email: "tomas.rivera@example.com",
        phoneNumber: "+54 11 4321 8765",
        skills: ["TypeScript", "React", "Node.js", "Tailwind", "REST APIs"],
        about: "Crafting end-to-end user experiences with a strong emphasis on frontend architecture and component design.",
        experience: "Frontend Engineer at Mercado Libre (2019 - Present)",
        education: "Computer Engineering, Universidad de Buenos Aires",
      },
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
    companyId: "mock-company-northwind",
    companyData: {
      name: "Northwind Labs",
      industry: "Software & Technology",
      size: "51-200 employees",
      headquarters: "San Francisco, CA",
      foundedYear: 2018,
      email: "contact@northwindlabs.com",
      phone: "+1 (415) 555-0199",
      website: "https://northwindlabs.com",
      description: "Northwind Labs is a next-generation software development studio building AI-assisted developer tools and high-scale cloud platforms.",
      createdBy: "mock-recruiter-1",
      createdAt: new Date(),
    },
    status: "Shortlisted",
    jobTitle: "Frontend Engineer",
    applicationId: "mock-application-001",
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
    conversationId: "mock-conversation-001",
  },
  {
    id: "seek-notif-3",
    audience: "jobseeker",
    type: "status_change",
    read: true,
    createdAt: atTime(today, 8, 5),
    companyName: "Brightpath Health",
    companyId: "mock-company-brightpath",
    companyData: {
      name: "Brightpath Health",
      industry: "Healthcare & Biotech",
      size: "201-500 employees",
      headquarters: "Boston, MA",
      foundedYear: 2015,
      email: "careers@brightpathhealth.com",
      phone: "+1 (617) 555-0143",
      website: "https://brightpathhealth.com",
      description: "Brightpath Health develops innovative digital healthcare solutions and data analytics platforms to improve patient care outcomes worldwide.",
      createdBy: "mock-recruiter-2",
      createdAt: new Date(),
    },
    status: "Rejected",
    jobTitle: "Data Analyst",
    applicationId: "mock-application-002",
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
    conversationId: "mock-conversation-002",
  },
  {
    id: "seek-notif-5",
    audience: "jobseeker",
    type: "status_change",
    read: true,
    createdAt: atTime(yesterday, 10, 20),
    companyName: "Summit Retail Group",
    companyId: "mock-company-summit",
    companyData: {
      name: "Summit Retail Group",
      industry: "Retail & E-Commerce",
      size: "500+ employees",
      headquarters: "Chicago, IL",
      foundedYear: 2010,
      email: "info@summitretail.com",
      phone: "+1 (312) 555-0182",
      website: "https://summitretail.com",
      description: "Summit Retail Group operates omni-channel retail operations and advanced logistics infrastructure across North America.",
      createdBy: "mock-recruiter-3",
      createdAt: new Date(),
    },
    status: "Hired",
    jobTitle: "Store Operations Manager",
    applicationId: "mock-application-003",
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
    conversationId: "mock-conversation-003",
  },
];
