import { useState, useEffect } from "react";

type NavPage = "home" | "search" | "applications";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg className="empty-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="26" r="10" stroke="#D1D5DB" strokeWidth="3" />
      <circle cx="54" cy="22" r="8" stroke="#D1D5DB" strokeWidth="3" />
      <path d="M6 60c0-12.15 10.745-22 24-22s24 9.85 24 22" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
      <path d="M54 38c8.284 0 15 6.268 15 14" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SearchBigIcon() {
  return (
    <svg className="empty-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="34" r="18" stroke="#D1D5DB" strokeWidth="3" />
      <path d="M48 47L62 61" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function LogoIcon() {
  return (
    <div className="logo-icon">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8.5L6.5 12L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function SearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="17" />
      <line x1="9" y1="14.5" x2="15" y2="14.5" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

// ─── Notifications Modal ──────────────────────────────────────────────────────

function NotificationsModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="notif-overlay" onClick={onClose}>
      <div className="notif-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="notif-header">
          <div className="notif-header-left">
            <span className="notif-header-bell">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </span>
            <div className="notif-header-text">
              <h3>Notifications</h3>
              <span>0 unread</span>
            </div>
          </div>
          <button className="notif-close" onClick={onClose} title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="notif-body">
          <span className="notif-bell-emoji">🔔</span>
          <h4>No notifications yet</h4>
          <p>Messages, application status and account updates will appear here.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Generic Modal ────────────────────────────────────────────────────────────

function Modal({ title, message, onClose }: { title: string; message: string; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
        <h2>{title}</h2>
        <p>{message}</p>
        <button className="modal-close" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}

// ─── Mock job data ─────────────────────────────────────────────────────────────

const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Stripe",
    logo: "S",
    logoColor: "#6366F1",
    location: "Remote",
    type: "Full-time",
    posted: "2 days ago",
    salary: "$140k–$180k",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Notion",
    logo: "N",
    logoColor: "#111827",
    location: "San Francisco, CA",
    type: "Full-time",
    posted: "1 day ago",
    salary: "$120k–$150k",
  },
  {
    id: 3,
    title: "Backend Engineer (Node.js)",
    company: "Linear",
    logo: "L",
    logoColor: "#5B6AD0",
    location: "Hybrid",
    type: "Full-time",
    posted: "3 days ago",
    salary: "$130k–$165k",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Figma",
    logo: "F",
    logoColor: "#F24E1E",
    location: "Remote",
    type: "Part-time",
    posted: "Today",
    salary: "$80k–$100k",
  },
];

// ─── Search Jobs Page ─────────────────────────────────────────────────────────

type FilterTag = {
  id: string;
  label: string;
  icon: string;
};

const FILTER_TAGS: FilterTag[] = [
  { id: "all", label: "All", icon: "" },
  { id: "new", label: "New", icon: "↗" },
  { id: "expiring", label: "Expiring", icon: "⏱" },
  { id: "remote", label: "Remote", icon: "" },
  { id: "onsite", label: "On-site", icon: "" },
  { id: "hybrid", label: "Hybrid", icon: "" },
  { id: "fulltime", label: "Full-time", icon: "" },
  { id: "parttime", label: "Part-time", icon: "" },
  { id: "gig", label: "Gig", icon: "" },
];

function JobCard({ job }: { job: typeof MOCK_JOBS[0] }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-logo" style={{ background: job.logoColor }}>
          {job.logo}
        </div>
        <div className="job-info">
          <h3 className="job-title">{job.title}</h3>
          <span className="job-company">{job.company}</span>
        </div>
        <button className="job-save-btn" title="Save job">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
      <div className="job-tags">
        <span className="job-tag">
          <MapPinIcon /> {job.location}
        </span>
        <span className="job-tag">
          <BriefcaseIcon style={{ width: 13, height: 13 }} /> {job.type}
        </span>
        <span className="job-tag salary">
          {job.salary}
        </span>
      </div>
      <div className="job-footer">
        <span className="job-posted">
          <ClockIcon /> {job.posted}
        </span>
        <button className="apply-btn">Apply now</button>
      </div>
    </div>
  );
}

function SearchJobsPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const isSearching = query.trim().length >= 2;

  const filteredJobs = MOCK_JOBS.filter((job) => {
    const q = query.toLowerCase();
    const matchesQuery =
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q);

    if (activeFilter === "all") return matchesQuery;
    if (activeFilter === "remote") return matchesQuery && job.location === "Remote";
    if (activeFilter === "onsite") return matchesQuery && job.location !== "Remote" && job.location !== "Hybrid";
    if (activeFilter === "hybrid") return matchesQuery && job.location === "Hybrid";
    if (activeFilter === "fulltime") return matchesQuery && job.type === "Full-time";
    if (activeFilter === "parttime") return matchesQuery && job.type === "Part-time";
    return matchesQuery;
  });

  return (
    <div className="search-page">
      {/* Search bar */}
      <div className="search-bar-wrapper">
        <div className="search-bar">
          <span className="search-bar-icon">
            <SearchIcon size={18} />
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by role, company or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <button
          className="filter-icon-btn"
          title="Advanced filters"
          onClick={() => setShowFilterModal(true)}
        >
          <FilterIcon />
        </button>
      </div>

      {/* Filter tags */}
      <div className="filter-tags-row">
        {FILTER_TAGS.map((tag) => (
          <button
            key={tag.id}
            className={`filter-tag${activeFilter === tag.id ? " filter-tag-active" : ""}`}
            onClick={() => setActiveFilter(tag.id)}
          >
            {tag.icon && <span className="tag-icon">{tag.icon}</span>}
            {tag.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {!isSearching ? (
        <div className="empty-state search-empty">
          <SearchBigIcon />
          <h2 className="empty-title">Start searching</h2>
          <p className="empty-subtitle">Type at least 2 characters to find jobs</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state search-empty">
          <SearchBigIcon />
          <h2 className="empty-title">No results found</h2>
          <p className="empty-subtitle">Try a different keyword or adjust your filters</p>
        </div>
      ) : (
        <div className="job-list">
          <p className="results-count">{filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found</p>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {showFilterModal && (
        <Modal
          title="Advanced filters coming soon!"
          message="We're building more powerful filtering options. Check back soon to narrow down your perfect role."
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage({ onCreateJob }: { onCreateJob: () => void }) {
  return (
    <main className="main-content">
      <button className="create-btn-top" onClick={onCreateJob}>
        <PlusIcon size={15} />
        Create job post
      </button>
      <div className="empty-state">
        <PeopleIcon />
        <h1 className="empty-title">No job posts yet</h1>
        <p className="empty-subtitle">
          Create your first job post and start finding candidates.
        </p>
        <button className="create-btn-empty" onClick={onCreateJob}>
          <PlusIcon size={16} />
          Create a job post
        </button>
      </div>
    </main>
  );
}

// ─── Applications Page ────────────────────────────────────────────────────────

function ApplicationsPage({ onExplore }: { onExplore: () => void }) {
  return (
    <main className="main-content">
      <div className="empty-state">
        <svg
          className="empty-icon apps-icon"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="8" y="4" width="36" height="48" rx="4" stroke="#D1D5DB" strokeWidth="2.5" />
          <line x1="16" y1="18" x2="36" y2="18" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="27" x2="36" y2="27" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="36" x2="28" y2="36" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <h1 className="empty-title">No applications yet</h1>
        <p className="empty-subtitle">
          Start exploring opportunities and send your first application.
        </p>
        <button className="explore-btn" onClick={onExplore}>
          Explore jobs →
        </button>
      </div>
    </main>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState<NavPage>("home");
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navItems: { id: NavPage; icon: string; label: string }[] = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "search", icon: "📄", label: "Search jobs" },
    { id: "applications", icon: "📋", label: "My Applications" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <a className="navbar-logo" href="#" onClick={(e) => e.preventDefault()}>
          <LogoIcon />
          <span className="logo-text">DAILYCRUIT</span>
        </a>

        <div className="nav-pill">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link${activePage === item.id ? " active" : ""}`}
              data-page={item.id}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="navbar-right">
          <button className="icon-btn" title="Messages"><ChatIcon /></button>
          <button className="icon-btn" title="Notifications" onClick={() => setShowNotifications((v) => !v)}><BellIcon /></button>
          <div className="avatar-wrapper" title="Profile">
            <div className="avatar">T</div>
            <span className="online-dot" />
          </div>
        </div>
      </nav>

      {/* Pages */}
      {activePage === "home" && (
        <HomePage onCreateJob={() => setShowModal(true)} />
      )}
      {activePage === "search" && (
        <main className="main-content search-main">
          <SearchJobsPage />
        </main>
      )}
      {activePage === "applications" && (
        <ApplicationsPage onExplore={() => setActivePage("search")} />
      )}

      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}

      {showModal && (
        <Modal
          title="Job post form coming soon!"
          message="We're working on the job posting feature. Check back soon to start finding your ideal candidates."
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
