import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type HomeJob = {
  id: number;
  title: string;
  tags: string[];
  description: string;
  location: string;
  date: string;
  salary: string;
  views: number;
  bullets: string[];
};

// ─── Data ────────────────────────────────────────────────────────────────────

export const HOME_JOBS: HomeJob[] = [
  {
    id: 1,
    title: "🚀 Work From Home Opportunity for Students & Freshers IN",
    tags: ["Full time", "Remote"],
    description:
      "Join a fast-growing startup and build real-world skills from home. Perfect for recent graduates and students looking for flexible remote work.",
    location: "Remote",
    date: "07 Jun 2026",
    salary: "40$/monthly",
    views: 21,
    bullets: [
      "Work flexible hours from the comfort of your home",
      "Gain hands-on experience with real client projects",
      "Mentorship and guidance from senior team members",
      "Weekly pay with performance bonuses",
      "Open to students and freshers with 0–1 year of experience",
    ],
  },
  {
    id: 2,
    title: "💼 Junior React Developer — Remote First Team",
    tags: ["Full time", "Remote"],
    description:
      "We're looking for an entry-level React developer to join our distributed team. Strong JavaScript fundamentals required.",
    location: "Remote",
    date: "10 Jun 2026",
    salary: "120$/monthly",
    views: 43,
    bullets: [
      "Build reusable UI components with React and TypeScript",
      "Collaborate daily with designers and backend engineers",
      "Async-first culture with flexible working hours",
      "Equipment stipend provided on joining",
      "Fast-track growth with quarterly reviews",
    ],
  },
  {
    id: 3,
    title: "📊 Data Entry Specialist — Part Time",
    tags: ["Part time", "Remote"],
    description:
      "Handle structured data entry tasks accurately and efficiently. Great for students who need a steady part-time income.",
    location: "Remote",
    date: "12 Jun 2026",
    salary: "25$/monthly",
    views: 67,
    bullets: [
      "Accurate data entry into spreadsheets and internal tools",
      "2–4 hours per day, Monday to Friday",
      "Training provided — no prior experience needed",
      "Paid weekly via bank transfer or PayPal",
      "Opportunity to grow into a full-time analyst role",
    ],
  },
];

// ─── Icon (local copy — only PlusIcon is needed here) ────────────────────────

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

// ─── Job Detail Sidebar ───────────────────────────────────────────────────────

function JobDetailSidebar({ job, onClose }: { job: HomeJob; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} />
      <aside className="job-sidebar">
        <div className="job-sidebar-header">
          <h3 className="job-sidebar-title">{job.title}</h3>
          <button className="job-sidebar-close" onClick={onClose} title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="job-sidebar-stats">
          <span className="sidebar-stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {job.location}
          </span>
          <span className="sidebar-stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            {job.views} views
          </span>
        </div>

        <div className="job-sidebar-meta">
          <div className="meta-block">
            <span className="meta-label">Salary</span>
            <span className="meta-value salary-value">{job.salary}</span>
          </div>
          <div className="meta-block">
            <span className="meta-label">Posted</span>
            <span className="meta-value">{job.date}</span>
          </div>
        </div>

        <div className="job-sidebar-tags">
          {job.tags.map((t) => (
            <span key={t} className="home-tag">{t}</span>
          ))}
        </div>

        <div className="job-sidebar-section">
          <h4 className="sidebar-section-title">DESCRIPTION</h4>
          <ul className="sidebar-bullets">
            {job.bullets.map((b, i) => (
              <li key={i}>✅ {b}</li>
            ))}
          </ul>
        </div>

        <button className="sidebar-apply-btn">Apply Now →</button>
      </aside>
    </>
  );
}

// ─── Home Job Card ────────────────────────────────────────────────────────────

function HomeJobCard({ job, onClick }: { job: HomeJob; onClick: () => void }) {
  return (
    <div className="home-job-card" onClick={onClick}>
      <div className="home-job-card-inner">
        <div className="home-job-top">
          <h3 className="home-job-title">{job.title}</h3>
          <div className="home-job-tags">
            {job.tags.map((t) => (
              <span key={t} className="home-tag">{t}</span>
            ))}
          </div>
        </div>
        <p className="home-job-desc">{job.description}</p>
        <div className="home-job-meta">
          <span className="home-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {job.location}
          </span>
          <span className="home-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {job.date}
          </span>
          <span className="home-meta-salary">{job.salary}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

type HomeFilter = "new" | "expiring" | "nearme";

export default function HomePage({ onCreateJob }: { onCreateJob: () => void }) {
  const [activeFilter, setActiveFilter] = useState<HomeFilter>("new");
  const [selectedJob, setSelectedJob] = useState<HomeJob | null>(null);

  const filters: { id: HomeFilter; label: string }[] = [
    { id: "new", label: "New" },
    { id: "expiring", label: "Expiring" },
    { id: "nearme", label: "Near me" },
  ];

  return (
    <>
      <main className="main-content home-main">
        <div className="home-welcome">
          <div>
            <h1 className="home-heading">Welcome, Tarzan 👋</h1>
            <p className="home-subheading">Find your next opportunity</p>
          </div>
          <button className="create-btn-top" style={{ position: "static", marginLeft: "auto" }} onClick={onCreateJob}>
            <PlusIcon size={15} />
            Create job post
          </button>
        </div>

        <div className="home-filter-row">
          {filters.map((f) => (
            <button
              key={f.id}
              className={`home-filter-btn${activeFilter === f.id ? " home-filter-active" : ""}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="home-job-list">
          {HOME_JOBS.map((job) => (
            <HomeJobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
          ))}
        </div>
      </main>

      {selectedJob && (
        <JobDetailSidebar job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </>
  );
}
