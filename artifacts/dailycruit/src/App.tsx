import { useState, useEffect, useRef, type FormEvent } from "react";
import { Building2 } from "lucide-react";
import HomePage from "./pages/HomePage";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import { subscribeToActiveJobs } from "./services/jobService";
import { RecruiterHomePage, JobPostsPage } from "./pages/RecruiterHomePage";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { profileImageService, validateImageFile, fileToDataUrl } from "./services/profileImageService";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ChatPage from "./pages/ChatPage";
import { auth } from "./firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getUserProfile, updateUserProfile, type ProfileData } from "./services/profile";
import {
  DEFAULT_ACHIEVEMENTS,
  getUserAchievements,
  updateUserAchievements,
  type AchievementState,
  type AchievementFlagKey,
} from "./services/achievementService";
import {
  applyToJob,
  getFriendlyErrorMessage,
  hasAppliedToJob,
  subscribeToMyApplications,
  type Application,
} from "./services/applicationService";
import type { SavedJob } from "./models/savedJob";
import {
  getFriendlySavedJobsError,
  subscribeToSavedJobs,
  toggleSavedJob,
} from "./services/savedJobService";
import { JobCard, type JobCardData } from "./components/JobCard";
import { JobDetailsDrawer } from "./components/JobDetailsDrawer";

type NavPage = "home" | "search" | "applications" | "saved" | "jobposts" | "companyprofile" | "chat" | "profile" | "settings";
type SavedJobTogglePayload = Parameters<typeof toggleSavedJob>[1];

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

function BriefcaseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="17" />
      <line x1="9" y1="14.5" x2="15" y2="14.5" />
    </svg>
  );
}

function MapPinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}


function ClockIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

// ─── Search Jobs Page ─────────────────────────────────────────────────────────

type FilterChip = {
  id: string;
  label: string;
  chip?: "trending" | "clock";
};

const FILTER_TAGS: FilterChip[] = [
  { id: "all", label: "All" },
  { id: "new", label: "New", chip: "trending" },
  { id: "expiring", label: "Expiring", chip: "clock" },
  { id: "remote", label: "Remote" },
  { id: "onsite", label: "On-site" },
  { id: "hybrid", label: "Hybrid" },
  { id: "fulltime", label: "Full-time" },
  { id: "parttime", label: "Part time" },
  { id: "gig", label: "Gig" },
];

type SearchJobCardData = {
  id: string;
  recruiterId?: string;
  title: string;
  company: string;
  logo: string;
  logoColor: string;
  location: string;
  type: string;
  posted: string;
  salary: string;
};

function SearchJobsPage({
  savedJobIds,
  onToggleSavedJob,
}: {
  savedJobIds: string[];
  onToggleSavedJob: (jobId: string, jobData?: SavedJobTogglePayload) => Promise<boolean>;
}) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [jobs, setJobs] = useState<SearchJobCardData[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [applyState, setApplyState] = useState<Record<string, { applied: boolean; applying: boolean }>>({});
  const [savingJobIds, setSavingJobIds] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToActiveJobs(
      (activeJobs) => {
        const mappedJobs = activeJobs.map((job) => ({
          id: job.id ?? "",
          recruiterId: job.recruiterId,
          title: job.title,
          company: job.company,
          logo: (job.company || "J").slice(0, 1).toUpperCase(),
          logoColor: ["#6366F1", "#111827", "#5B6AD0", "#F24E1E"][Math.abs((job.title?.length ?? 0) + (job.company?.length ?? 0)) % 4],
          location: job.location || "Remote",
          type: job.employmentType || job.commitment || "Full-time",
          posted: job.postedDate || "Just now",
          salary: job.salary || "$0",
        }));

        setJobs(mappedJobs);
        setIsLoading(false);
        setErrorMessage(null);
      },
      () => {
        setErrorMessage("We couldn't load jobs right now. Please try again.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!jobs.length) return;

    let cancelled = false;

    async function syncApplyStatus() {
      const nextState: Record<string, { applied: boolean; applying: boolean }> = {};

      for (const job of jobs) {
        try {
          const applied = await hasAppliedToJob(job.id);
          if (!cancelled) {
            nextState[job.id] = { applied, applying: false };
          }
        } catch {
          if (!cancelled) {
            nextState[job.id] = { applied: false, applying: false };
          }
        }
      }

      if (!cancelled) {
        setApplyState((prev) => ({ ...prev, ...nextState }));
      }
    }

    void syncApplyStatus();

    return () => {
      cancelled = true;
    };
  }, [jobs]);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const isSearching = query.trim().length >= 2;

  async function handleSaveJob(job: JobCardData) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setToastMessage("Please sign in before saving a job.");
      return;
    }

    setSavingJobIds((prev) => ({ ...prev, [job.id]: true }));

    try {
      const nextSaved = await onToggleSavedJob(job.id, {
        title: job.title,
        company: job.company ?? job.title,
        location: job.location,
        salary: job.salary,
        employmentType: job.tags.find((tag) => tag.toLowerCase().includes("full")) ?? "Full-time",
      });

      setToastMessage(nextSaved ? `Saved ${job.title}.` : `Removed ${job.title} from saved jobs.`);
    } catch (error) {
      setToastMessage(getFriendlySavedJobsError(error));
    } finally {
      setSavingJobIds((prev) => ({ ...prev, [job.id]: false }));
    }
  }

  async function handleApplyJob(job: JobCardData) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setToastMessage("Please sign in before applying to a job.");
      return;
    }

    setApplyState((prev) => ({ ...prev, [job.id]: { applied: prev[job.id]?.applied ?? false, applying: true } }));

    try {
      await applyToJob({
        jobId: job.id,
        recruiterId: job.recruiterId ?? "",
        applicantId: userId,
        jobTitle: job.title,
        company: job.company ?? job.title,
        location: job.location,
        salary: job.salary,
        employmentType: job.tags.find((tag) => tag.toLowerCase().includes("full")) ?? "Full-time",
        experience: "Not specified",
      });

      const current = await getUserAchievements(userId);
      const nextApplicationCount = current.applicationCount + 1;

      await updateUserAchievements(userId, {
        firstJobApplication: nextApplicationCount >= 1,
        applications10: nextApplicationCount >= 10,
        applications50: nextApplicationCount >= 50,
        applicationCount: nextApplicationCount,
      });

      setApplyState((prev) => ({ ...prev, [job.id]: { applied: true, applying: false } }));
      setToastMessage(`Application submitted for ${job.title}.`);
    } catch (error) {
      setApplyState((prev) => ({ ...prev, [job.id]: { applied: prev[job.id]?.applied ?? false, applying: false } }));
      setToastMessage(getFriendlyErrorMessage(error));
    }
  }

  const filteredJobs = jobs.filter((job) => {
    const q = query.toLowerCase();
    const matchesQuery =
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q);

    if (activeFilter === "all") return matchesQuery;
    if (activeFilter === "remote") return matchesQuery && job.location.toLowerCase() === "remote";
    if (activeFilter === "onsite") return matchesQuery && job.location.toLowerCase() !== "remote" && job.location.toLowerCase() !== "hybrid";
    if (activeFilter === "hybrid") return matchesQuery && job.location.toLowerCase() === "hybrid";
    if (activeFilter === "fulltime") return matchesQuery && job.type.toLowerCase() === "full-time";
    if (activeFilter === "parttime") return matchesQuery && job.type.toLowerCase().includes("part");
    return matchesQuery;
  });

  return (
    <div className="search-page">
      {/* Search bar */}
      <div className="search-input-container">
        <span className="search-icon-left">
          <SearchIcon size={18} />
        </span>
        <input
          type="text"
          className="search-input"
          placeholder="Search by role, company or location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="search-filter-btn"
          title="Advanced filters"
          onClick={() => setShowFilterModal(true)}
        >
          <FilterIcon />
        </button>
      </div>

      {/* Filter chips */}
      <div className="filter-tags-row">
        {FILTER_TAGS.map((tag) => (
          <button
            key={tag.id}
            className={`filter-tag${activeFilter === tag.id ? " filter-tag-active" : ""}`}
            onClick={() => setActiveFilter(tag.id)}
          >
            {tag.chip === "trending" && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            )}
            {tag.chip === "clock" && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            )}
            {tag.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {errorMessage && (
        <div style={{ marginBottom: 12, padding: "10px 12px", borderRadius: 10, background: "#fef2f2", color: "#b91c1c", fontSize: 13, border: "1px solid #fecaca" }}>
          {errorMessage}
        </div>
      )}
      {toastMessage && (
        <div style={{ marginBottom: 12, padding: "10px 12px", borderRadius: 10, background: toastMessage.includes("already") ? "#fef3c7" : "#f0fdf4", color: toastMessage.includes("already") ? "#92400e" : "#166534", fontSize: 13, border: `1px solid ${toastMessage.includes("already") ? "#fde68a" : "#bbf7d0"}` }}>
          {toastMessage}
        </div>
      )}
      {isLoading ? (
        <div className="empty-state search-empty">
          <SearchBigIcon />
          <h2 className="empty-title">Loading jobs…</h2>
          <p className="empty-subtitle">We’re fetching the latest opportunities.</p>
        </div>
      ) : !isSearching ? (
        <div className="empty-state search-empty">
          <SearchBigIcon />
          <h2 className="empty-title">Start searching</h2>
          <p className="empty-subtitle">
            <span className="empty-highlight">Type</span> at least 2 characters to find jobs
          </p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state search-empty">
          <SearchBigIcon />
          <h2 className="empty-title">No results found</h2>
          <p className="empty-subtitle">Try a different keyword or adjust your filters</p>
        </div>
      ) : (
        <>
          <div className="job-list">
            <p className="results-count">{filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found</p>
            {filteredJobs.map((job) => {
              const cardJob: JobCardData = {
                id: job.id,
                recruiterId: job.recruiterId,
                title: job.title,
                company: job.company,
                companyColor: job.logoColor,
                location: job.location,
                posted: job.posted,
                salary: job.salary,
                tags: [job.type],
                description: "",
              };

              return (
                <JobCard
                  key={job.id}
                  job={cardJob}
                  onClick={() => setSelectedJob(cardJob)}
                  onToggleSave={() => handleSaveJob(cardJob)}
                  onApply={() => handleApplyJob(cardJob)}
                  isApplied={applyState[job.id]?.applied ?? false}
                  isApplying={applyState[job.id]?.applying ?? false}
                  isSaved={savedJobIds.includes(job.id)}
                  isSaving={savingJobIds[job.id] ?? false}
                />
              );
            })}
          </div>
          {selectedJob && (
            <JobDetailsDrawer
              job={selectedJob}
              onClose={() => setSelectedJob(null)}
              onApply={() => handleApplyJob(selectedJob)}
              isApplied={applyState[selectedJob.id]?.applied ?? false}
              isApplying={applyState[selectedJob.id]?.applying ?? false}
              isSaved={savedJobIds.includes(selectedJob.id)}
              isSaving={savingJobIds[selectedJob.id] ?? false}
              onToggleSave={() => handleSaveJob(selectedJob)}
            />
          )}
        </>
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

// ─── Profile Dropdown ─────────────────────────────────────────────────────────

const DD_MENU_ITEMS = [
  { icon: "👤", label: "Profile", badge: null },
  { icon: "⚙️", label: "Settings", badge: null },
  { icon: "📖", label: "Instructions", badge: null },
  { icon: "🛍️", label: "Shop", badge: { text: "new", color: "green" } },
  { icon: "📝", label: "Dev Log", badge: { text: "v0.4.8", color: "gray" } },
  { icon: "📲", label: "Install App", badge: { text: "new", color: "green" } },
];

function ProfileDropdown({ accountType, onClose, onNavigate, onLogout }: { accountType: AccountType; onClose: () => void; onNavigate: (page: NavPage) => void; onLogout: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const menuItems =
    accountType === "recruiter"
      ? [
        DD_MENU_ITEMS[0],
        { icon: <Building2 size={16} />, label: "Company Profile", badge: null },
        ...DD_MENU_ITEMS.slice(1),
      ]
      : DD_MENU_ITEMS;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="profile-dropdown" ref={ref}>
      <div className="profile-dd-header">
        <div className="profile-dd-avatar">T</div>
        <div>
          <div className="profile-dd-name">Tarzan</div>
          <div className="profile-dd-email">tarzan@dailycruit.com</div>
        </div>
      </div>
      <div className="profile-dd-divider" />
      <ul className="profile-dd-list">
        {menuItems.map((item) => (
          <li
            key={item.label}
            className="profile-dd-item"
            onClick={() => {
              if (item.label === "Profile") { onNavigate("profile"); onClose(); }
              if (item.label === "Company Profile") { onNavigate("companyprofile"); onClose(); }
              if (item.label === "Settings") { onNavigate("settings"); onClose(); }
            }}
          >
            <span className="profile-dd-item-icon">{item.icon}</span>
            <span className="profile-dd-item-label">{item.label}</span>
            {item.badge && (
              <span className={`profile-dd-badge ${item.badge.color === "green" ? "badge-green" : "badge-gray"}`}>
                {item.badge.text}
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className="profile-dd-divider" />
      <button className="profile-dd-logout" onClick={onLogout}>
        <span>🚪</span> Log out
      </button>
    </div>
  );
}

// ─── Account Type Modal ───────────────────────────────────────────────────────

type AccountType = "jobseeker" | "recruiter" | "gigsman";

const ACCOUNT_TYPES: { id: AccountType; title: string; desc: string; icon: string }[] = [
  {
    id: "jobseeker",
    title: "Job Seeker",
    desc: "Find and apply to jobs perfectly matched for you",
    icon: "🧑‍💼",
  },
  {
    id: "recruiter",
    title: "Recruiter",
    desc: "Professional dashboard to post jobs & hire talent",
    icon: "🏢",
  },
  {
    id: "gigsman",
    title: "Gigsman",
    desc: "Search gigs & post flexible one-time work",
    icon: "⚡",
  },
];

function AccountTypeModal({
  current,
  onSelect,
  onClose,
  isFirstTime = false,
}: {
  current: AccountType;
  onSelect: (t: AccountType) => void;
  onClose: () => void;
  isFirstTime?: boolean;
}) {
  const [selected, setSelected] = useState<AccountType | null>(isFirstTime ? null : current);

  return (
    <div className="acct-modal-overlay" onMouseDown={isFirstTime ? undefined : onClose}>
      <div className="acct-modal-card" onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="acct-modal-header">
          <span className="acct-modal-title">Change account type</span>
          <span className="acct-modal-subtitle">Previous data is retained for 60 days after switching</span>
        </div>

        {/* Cards grid */}
        <div className="acct-cards-grid">
          {ACCOUNT_TYPES.map((t) => {
            const isActive = selected === t.id;
            return (
              <div
                key={t.id}
                className={`acct-type-card${isActive ? " acct-type-active" : ""}`}
                onClick={() => setSelected(t.id)}
              >
                {isActive && !isFirstTime && <span className="acct-current-badge">CURRENT</span>}
                <div className="acct-card-icon">{t.icon}</div>
                <span className={`acct-card-title${isActive ? " acct-card-title-active" : ""}`}>{t.title}</span>
                <span className="acct-card-desc">{t.desc}</span>
                <div className="acct-dot-row">
                  {isActive && <span className="acct-dot" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="acct-modal-footer">
          {!isFirstTime && (
            <button className="acct-cancel-btn" onClick={onClose}>Cancel</button>
          )}
          <button
            className="acct-confirm-btn"
            onClick={() => {
              if (!selected) return;
              onSelect(selected);
              setTimeout(onClose, 300);
            }}
            disabled={isFirstTime && !selected}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <div
      className={`toggle-switch${on ? " toggle-on" : ""}`}
      onClick={onChange}
      role="switch"
      aria-checked={on}
      tabIndex={0}
      onKeyDown={(e) => e.key === " " && onChange()}
    >
      <div className="toggle-track" />
      <div className="toggle-thumb" />
    </div>
  );
}

function SettingsPage({
  onBack,
  accountType,
  onAccountTypeChange,
}: {
  onBack: () => void;
  accountType: AccountType;
  onAccountTypeChange: (t: AccountType) => void;
}) {
  const [webNotif, setWebNotif] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [mobileNotif, setMobileNotif] = useState(false);
  const [hideSearch, setHideSearch] = useState(false);
  const [showAcctModal, setShowAcctModal] = useState(false);

  const acctLabel: Record<AccountType, string> = {
    jobseeker: "Job Seeker",
    recruiter: "Recruiter",
    gigsman: "Gigsman",
  };

  return (
    <main className="main-content settings-main">
      {/* Header row */}
      <div className="settings-header-row">
        <button className="settings-back-btn" onClick={onBack}>← Back</button>
        <div className="settings-title-group">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <h2 className="settings-title">Settings</h2>
        </div>
      </div>

      {/* Account */}
      <div className="settings-card">
        <div className="settings-section-header">Account</div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Account Type</span>
            <span className="settings-row-desc">Switch between Job Seeker, Recruiter, or Gigsman. Your previous data is retained for 60 days after switching.</span>
          </div>
          <div className="settings-row-control">
            <span className="account-type-badge">{acctLabel[accountType]}</span>
            <button className="settings-btn settings-btn-black" onClick={() => setShowAcctModal(true)}>Change</button>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="settings-card">
        <div className="settings-section-header">Language &amp; Region</div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Language</span>
            <span className="settings-row-desc">Interface display language</span>
          </div>
          <div className="settings-row-control">
            <select className="settings-select">
              <option>English</option>
              <option>French</option>
              <option>German</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Region</span>
            <span className="settings-row-desc">Affects job listings and local content</span>
          </div>
          <div className="settings-row-control">
            <select className="settings-select">
              <option>Europe</option>
              <option>North America</option>
              <option>Asia Pacific</option>
              <option>Middle East</option>
            </select>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Time Zone</span>
            <span className="settings-row-desc">Used for scheduling and deadlines</span>
          </div>
          <div className="settings-row-control">
            <select className="settings-select">
              <option value="">Select Time Zone</option>
              <option>UTC+0 London</option>
              <option>UTC+1 Paris</option>
              <option>UTC+2 Athens</option>
              <option>UTC+5:30 Mumbai</option>
              <option>UTC-5 New York</option>
              <option>UTC-8 Los Angeles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-card">
        <div className="settings-section-header">Notifications</div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Web Notifications</span>
            <span className="settings-row-desc">Receive alerts directly in your browser</span>
          </div>
          <div className="settings-row-control">
            <Toggle on={webNotif} onChange={() => setWebNotif((v) => !v)} />
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Email Notifications</span>
            <span className="settings-row-desc">Updates and activity sent to your email</span>
          </div>
          <div className="settings-row-control">
            <Toggle on={emailNotif} onChange={() => setEmailNotif((v) => !v)} />
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Mobile Notifications</span>
            <span className="settings-row-desc">Push notifications on your mobile device</span>
          </div>
          <div className="settings-row-control">
            <Toggle on={mobileNotif} onChange={() => setMobileNotif((v) => !v)} />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-card">
        <div className="settings-section-header danger-header">Danger Zone</div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Export my data</span>
            <span className="settings-row-desc">Download a copy of all your personal data, activity, and content stored on this platform.</span>
          </div>
          <div className="settings-row-control">
            <button className="settings-btn">Export</button>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Revoke all active sessions</span>
            <span className="settings-row-desc">Sign out from all devices immediately. You'll need to log in again everywhere.</span>
          </div>
          <div className="settings-row-control">
            <button className="settings-btn">Revoke</button>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Delete all personal data</span>
            <span className="settings-row-desc">Permanently remove your personal information while keeping your account active. This cannot be undone.</span>
          </div>
          <div className="settings-row-control">
            <button className="settings-btn settings-btn-red">Delete data</button>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Remove profile from search</span>
            <span className="settings-row-desc">Your profile won't appear in recruiter or employer searches. You can still use the platform normally.</span>
          </div>
          <div className="settings-row-control">
            <Toggle on={hideSearch} onChange={() => setHideSearch((v) => !v)} />
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Reset feed &amp; preferences</span>
            <span className="settings-row-desc">Clear your personalized feed, saved filters, and interest history. Your account and content won't be affected.</span>
          </div>
          <div className="settings-row-control">
            <button className="settings-btn">Reset</button>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Deactivate account</span>
            <span className="settings-row-desc">Temporarily hide your profile and pause all activity. Your data is preserved and you can reactivate at any time by logging back in.</span>
          </div>
          <div className="settings-row-control">
            <button className="settings-btn settings-btn-red">Deactivate</button>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Delete account</span>
            <span className="settings-row-desc">Permanently delete your account and all associated data. A 15-day grace period applies — you can cancel within that window.</span>
          </div>
          <div className="settings-row-control">
            <button className="settings-btn settings-btn-red-solid">Delete account</button>
          </div>
        </div>
      </div>
      {showAcctModal && (
        <AccountTypeModal
          current={accountType}
          onSelect={(t) => onAccountTypeChange(t)}
          onClose={() => setShowAcctModal(false)}
        />
      )}
    </main>
  );
}

// ─── Preferences Tab ──────────────────────────────────────────────────────────

function PreferencesTab({
  profileData,
  onProfileUpdated,
  onShowToast,
  onAchievementsUpdated,
}: {
  profileData: ProfileData | null;
  onProfileUpdated: (profile: ProfileData | null) => void;
  onShowToast: (toast: { type: "success" | "error"; message: string }) => void;
  onAchievementsUpdated?: (updates: Partial<AchievementState>) => void;
}) {
  const workModes = ["Remote", "Hybrid", "On-site"];
  const contractTypes = ["Full-time", "Part-time", "Gig", "Internship", "Contract"];

  const [selectedWorkModes, setSelectedWorkModes] = useState<Set<string>>(new Set());
  const [selectedContracts, setSelectedContracts] = useState<Set<string>>(new Set());
  const [targetRoles, setTargetRoles] = useState("");
  const [preferredLocations, setPreferredLocations] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [seniority, setSeniority] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const readArrayValue = (value: unknown) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }
    if (typeof value === "string") {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };

  useEffect(() => {
    const preferenceValues = (profileData as ProfileData & { preferences?: Record<string, unknown> } | null)?.preferences;

    setSelectedWorkModes(new Set(readArrayValue(profileData?.workModes ?? profileData?.workMode ?? preferenceValues?.workMode ?? preferenceValues?.workModes)));
    setSelectedContracts(new Set(readArrayValue(profileData?.contractTypes ?? profileData?.contractType ?? preferenceValues?.contractType ?? preferenceValues?.contractTypes)));
    setTargetRoles(String(profileData?.targetRoles ?? preferenceValues?.targetRoles ?? "").trim());
    setPreferredLocations(String(profileData?.preferredLocations ?? preferenceValues?.preferredLocations ?? "").trim());
    setSalaryRange(String(profileData?.salaryRange ?? preferenceValues?.salaryRange ?? "").trim());
    setSeniority(String(profileData?.seniority ?? preferenceValues?.seniority ?? "").trim());
  }, [profileData]);

  function toggle(set: Set<string>, setFn: (s: Set<string>) => void, val: string) {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setFn(next);
  }

  async function handleSave() {
    setSaving(true);

    try {
      const updates: Record<string, unknown> = {};
      const nextValues = {
        workModes: Array.from(selectedWorkModes),
        contractTypes: Array.from(selectedContracts),
        targetRoles: targetRoles.trim(),
        preferredLocations: preferredLocations.trim(),
        salaryRange: salaryRange.trim(),
        seniority: seniority.trim(),
      };

      const previousValues = {
        workModes: readArrayValue(profileData?.workModes ?? profileData?.workMode ?? (profileData as ProfileData & { preferences?: Record<string, unknown> } | null)?.preferences?.workMode ?? (profileData as ProfileData & { preferences?: Record<string, unknown> } | null)?.preferences?.workModes),
        contractTypes: readArrayValue(profileData?.contractTypes ?? profileData?.contractType ?? (profileData as ProfileData & { preferences?: Record<string, unknown> } | null)?.preferences?.contractType ?? (profileData as ProfileData & { preferences?: Record<string, unknown> } | null)?.preferences?.contractTypes),
        targetRoles: String(profileData?.targetRoles ?? (profileData as ProfileData & { preferences?: Record<string, unknown> } | null)?.preferences?.targetRoles ?? "").trim(),
        preferredLocations: String(profileData?.preferredLocations ?? (profileData as ProfileData & { preferences?: Record<string, unknown> } | null)?.preferences?.preferredLocations ?? "").trim(),
        salaryRange: String(profileData?.salaryRange ?? (profileData as ProfileData & { preferences?: Record<string, unknown> } | null)?.preferences?.salaryRange ?? "").trim(),
        seniority: String(profileData?.seniority ?? (profileData as ProfileData & { preferences?: Record<string, unknown> } | null)?.preferences?.seniority ?? "").trim(),
      };

      (Object.keys(nextValues) as Array<keyof typeof nextValues>).forEach((key) => {
        const nextValue = nextValues[key];
        const prevValue = previousValues[key];
        if (JSON.stringify(nextValue) !== JSON.stringify(prevValue)) {
          updates[key] = nextValue;
        }
      });

      if (Object.keys(updates).length === 0) {
        setSaved(true);
        onShowToast({ type: "success", message: "No preference changes to save." });
        window.setTimeout(() => setSaved(false), 2000);
        setSaving(false);
        return;
      }

      const userId = auth.currentUser?.uid;
      await updateUserProfile(userId, updates);
      const refreshedProfile = await getUserProfile(userId);
      onProfileUpdated(refreshedProfile);
      await updateUserAchievements(userId, { completedPreferences: true });
      onAchievementsUpdated?.({ completedPreferences: true });
      setSaved(true);
      onShowToast({ type: "success", message: "Preferences saved." });
      window.setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save preferences.";
      onShowToast({ type: "error", message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pref-card">
      {/* Work mode */}
      <div className="pref-section">
        <span className="pref-section-title">Work mode</span>
        <div className="pref-pills">
          {workModes.map((m) => (
            <button
              key={m}
              className={`pref-pill${selectedWorkModes.has(m) ? " pref-pill-active" : ""}`}
              onClick={() => toggle(selectedWorkModes, setSelectedWorkModes, m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="pref-divider" />

      {/* Contract type */}
      <div className="pref-section">
        <span className="pref-section-title">Contract type</span>
        <div className="pref-pills">
          {contractTypes.map((c) => (
            <button
              key={c}
              className={`pref-pill${selectedContracts.has(c) ? " pref-pill-active" : ""}`}
              onClick={() => toggle(selectedContracts, setSelectedContracts, c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="pref-divider" />

      {/* Row 1: Target roles + Preferred locations */}
      <div className="pref-section">
        <div className="pref-inputs-grid">
          <div className="pref-field">
            <label className="pref-label">Target roles</label>
            <input
              className="pref-input"
              type="text"
              placeholder="Full-stack, Backend, Tech lead"
              value={targetRoles}
              onChange={(e) => setTargetRoles(e.target.value)}
            />
            <span className="pref-sublabel">Comma separated</span>
          </div>
          <div className="pref-field">
            <label className="pref-label">Preferred locations</label>
            <input
              className="pref-input"
              type="text"
              placeholder="Remote EU, Italy"
              value={preferredLocations}
              onChange={(e) => setPreferredLocations(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="pref-divider" />

      {/* Row 2: Salary range + Seniority */}
      <div className="pref-section">
        <div className="pref-inputs-grid">
          <div className="pref-field">
            <label className="pref-label">Salary range</label>
            <input
              className="pref-input"
              type="text"
              placeholder="40k - 65k EUR"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
            />
          </div>
          <div className="pref-field">
            <label className="pref-label">Seniority</label>
            <input
              className="pref-input"
              type="text"
              placeholder="Mid / Senior"
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="pref-actions">
        <button className={`pref-save-btn${saved ? " pref-save-saved" : ""}`} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : saved ? "✓ Saved!" : "Save preferences"}
        </button>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

type ProfileTab = "general" | "preferences" | "achievements";

type ProfileFormState = {
  fullName: string;
  username: string;
  headline: string;
  about: string;
  phoneNumber: string;
  location: string;
  skills: string[];
  experience: string;
  education: string;
  linkedin: string;
  github: string;
  portfolio: string;
  jobType: string;
};

function createProfileFormState(profile: ProfileData | null): ProfileFormState {
  return {
    fullName: profile?.fullName?.toString() ?? "",
    username: profile?.username?.toString() ?? "",
    headline: profile?.headline?.toString() ?? "",
    about: profile?.about?.toString() ?? "",
    phoneNumber: profile?.phoneNumber?.toString() ?? "",
    location: profile?.location?.toString() ?? "",
    skills: Array.isArray(profile?.skills)
      ? profile.skills.map((skill) => String(skill).trim()).filter(Boolean)
      : [],
    experience: profile?.experience?.toString() ?? "",
    education: profile?.education?.toString() ?? "",
    linkedin: profile?.linkedin?.toString() ?? "",
    github: profile?.github?.toString() ?? "",
    portfolio: profile?.portfolio?.toString() ?? "",
    jobType: profile?.jobType?.toString() ?? "",
  };
}

function EditProfileModal({
  open,
  onClose,
  profile,
  onSaved,
  onShowToast,
  onAchievementsUpdated,
}: {
  open: boolean;
  onClose: () => void;
  profile: ProfileData | null;
  onSaved: (profile: ProfileData | null) => void;
  onShowToast: (toast: { type: "success" | "error"; message: string }) => void;
  onAchievementsUpdated?: (updates: Partial<AchievementState>) => void;
}) {
  const [form, setForm] = useState<ProfileFormState>(createProfileFormState(profile));
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; username?: string }>({});

  useEffect(() => {
    if (!open) return;
    setForm(createProfileFormState(profile));
    setSkillInput("");
    setErrors({});
  }, [open, profile]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const updateField = <K extends keyof ProfileFormState>(field: K, value: ProfileFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (!trimmedSkill) return;

    if (!form.skills.includes(trimmedSkill)) {
      setForm((prev) => ({ ...prev, skills: [...prev.skills, trimmedSkill] }));
    }

    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setForm((prev) => ({ ...prev, skills: prev.skills.filter((item) => item !== skill) }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: { fullName?: string; username?: string } = {};
    if (!form.fullName.trim()) nextErrors.fullName = "Full name is required.";
    if (!form.username.trim()) nextErrors.username = "Username is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSaving(true);

    try {
      const updates: Record<string, unknown> = {};
      const fields: Array<keyof ProfileFormState> = [
        "fullName",
        "username",
        "headline",
        "about",
        "phoneNumber",
        "location",
        "skills",
        "experience",
        "education",
        "linkedin",
        "github",
        "portfolio",
        "jobType",
      ];

      fields.forEach((field) => {
        const nextValue = field === "skills"
          ? form.skills.map((skill) => skill.trim()).filter(Boolean)
          : form[field];

        const previousValue = field === "skills"
          ? ((profile?.skills ?? []) as unknown[]).map((skill) => String(skill).trim()).filter(Boolean)
          : profile?.[field as keyof ProfileData];

        const normalizedNext = field === "skills"
          ? nextValue
          : typeof nextValue === "string"
            ? nextValue.trim()
            : nextValue;

        const normalizedPrevious = field === "skills"
          ? previousValue
          : typeof previousValue === "string"
            ? previousValue.trim()
            : previousValue;

        if (JSON.stringify(normalizedNext) !== JSON.stringify(normalizedPrevious)) {
          updates[field] = normalizedNext;
        }
      });

      if (Object.keys(updates).length === 0) {
        onShowToast({ type: "success", message: "No profile changes to save." });
        onClose();
        return;
      }

      const userId = auth.currentUser?.uid;
      await updateUserProfile(userId, updates);
      const refreshedProfile = await getUserProfile(userId);
      onSaved(refreshedProfile);
      await updateUserAchievements(userId, { profileEdited: true, profileCompleted: true });
      onAchievementsUpdated?.({ profileEdited: true, profileCompleted: true });
      onShowToast({ type: "success", message: "Profile updated successfully." });
      onClose();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to save your profile right now.";
      onShowToast({ type: "error", message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-edit-overlay" onClick={onClose}>
      <div className="profile-edit-modal" onClick={(event) => event.stopPropagation()}>
        <div className="profile-edit-header">
          <div>
            <h3 className="profile-edit-title">Edit profile</h3>
            <p className="profile-edit-subtitle">Update your public profile details</p>
          </div>
          <button className="profile-edit-close" type="button" onClick={onClose} aria-label="Close profile editor">
            ×
          </button>
        </div>

        <form className="profile-edit-form" onSubmit={handleSubmit}>
          <div className="profile-edit-section">
            <h4 className="profile-edit-section-title">General</h4>
            <div className="profile-edit-grid">
              <div className="profile-edit-field">
                <label className="profile-edit-label">Full name *</label>
                <input className="profile-edit-input" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} />
                {errors.fullName && <p className="profile-edit-error">{errors.fullName}</p>}
              </div>
              <div className="profile-edit-field">
                <label className="profile-edit-label">Username *</label>
                <input className="profile-edit-input" value={form.username} onChange={(event) => updateField("username", event.target.value)} />
                {errors.username && <p className="profile-edit-error">{errors.username}</p>}
              </div>
              <div className="profile-edit-field">
                <label className="profile-edit-label">Headline</label>
                <input className="profile-edit-input" value={form.headline} onChange={(event) => updateField("headline", event.target.value)} />
              </div>
              <div className="profile-edit-field">
                <label className="profile-edit-label">Phone number</label>
                <input className="profile-edit-input" value={form.phoneNumber} onChange={(event) => updateField("phoneNumber", event.target.value)} />
              </div>
              <div className="profile-edit-field">
                <label className="profile-edit-label">Location</label>
                <input className="profile-edit-input" value={form.location} onChange={(event) => updateField("location", event.target.value)} />
              </div>
              <div className="profile-edit-field profile-edit-field-full">
                <label className="profile-edit-label">About</label>
                <textarea className="profile-edit-textarea" rows={4} value={form.about} onChange={(event) => updateField("about", event.target.value)} />
              </div>
            </div>
          </div>

          <div className="profile-edit-section">
            <h4 className="profile-edit-section-title">Professional</h4>
            <div className="profile-edit-grid">
              <div className="profile-edit-field profile-edit-field-full">
                <label className="profile-edit-label">Skills</label>
                <div className="profile-edit-skill-row">
                  <input
                    className="profile-edit-input"
                    value={skillInput}
                    onChange={(event) => setSkillInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Add a skill"
                  />
                  <button className="profile-edit-inline-btn" type="button" onClick={handleAddSkill}>Add skill</button>
                </div>
                <div className="profile-edit-skill-list">
                  {form.skills.map((skill) => (
                    <span className="profile-edit-skill-chip" key={skill}>
                      {skill}
                      <button type="button" onClick={() => handleRemoveSkill(skill)} aria-label={`Remove ${skill}`}>
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="profile-edit-field profile-edit-field-full">
                <label className="profile-edit-label">Experience</label>
                <textarea className="profile-edit-textarea" rows={3} value={form.experience} onChange={(event) => updateField("experience", event.target.value)} />
              </div>
              <div className="profile-edit-field profile-edit-field-full">
                <label className="profile-edit-label">Education</label>
                <textarea className="profile-edit-textarea" rows={3} value={form.education} onChange={(event) => updateField("education", event.target.value)} />
              </div>
            </div>
          </div>

          <div className="profile-edit-section">
            <h4 className="profile-edit-section-title">Links</h4>
            <div className="profile-edit-grid">
              <div className="profile-edit-field">
                <label className="profile-edit-label">LinkedIn</label>
                <input className="profile-edit-input" value={form.linkedin} onChange={(event) => updateField("linkedin", event.target.value)} />
              </div>
              <div className="profile-edit-field">
                <label className="profile-edit-label">GitHub</label>
                <input className="profile-edit-input" value={form.github} onChange={(event) => updateField("github", event.target.value)} />
              </div>
              <div className="profile-edit-field">
                <label className="profile-edit-label">Portfolio</label>
                <input className="profile-edit-input" value={form.portfolio} onChange={(event) => updateField("portfolio", event.target.value)} />
              </div>
            </div>
          </div>

          <div className="profile-edit-section">
            <h4 className="profile-edit-section-title">Preferences</h4>
            <div className="profile-edit-field">
              <label className="profile-edit-label">Job type</label>
              <select className="profile-edit-input" value={form.jobType} onChange={(event) => updateField("jobType", event.target.value)}>
                <option value="">Select job type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="profile-edit-actions">
            <button className="profile-edit-cancel-btn" type="button" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="profile-edit-save-btn" type="submit" disabled={saving}>
              {saving ? <span className="profile-edit-spinner" /> : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function AchievementTab({
  achievements,
  loading,
  onRefresh,
}: {
  achievements: AchievementState;
  loading: boolean;
  onRefresh: () => void;
}) {
  const unlockedCount = Object.entries(achievements).filter(([key, value]) => {
    if (key === "applicationCount" || key === "savedJobCount") return false;
    return Boolean(value);
  }).length;

  const progressPercent = Math.round((unlockedCount / 10) * 100);

  const cards = [
    {
      key: "firstLogin" as AchievementFlagKey,
      title: "Welcome",
      description: "Unlock after your first successful login.",
      icon: "🎉",
      unlocked: achievements.firstLogin,
      color: "#22C55E",
    },
    {
      key: "profileCompleted" as AchievementFlagKey,
      title: "Complete Profile",
      description: "Unlock when your profile completion reaches 100%.",
      icon: "🧩",
      unlocked: achievements.profileCompleted,
      color: "#2563EB",
    },
    {
      key: "profilePhotoAdded" as AchievementFlagKey,
      title: "Profile Photo Added",
      description: "Unlock when you upload a profile photo.",
      icon: "📷",
      unlocked: achievements.profilePhotoAdded,
      color: "#7C3AED",
    },
    {
      key: "profileEdited" as AchievementFlagKey,
      title: "Profile Updated",
      description: "Unlock after saving your profile at least once.",
      icon: "✏️",
      unlocked: achievements.profileEdited,
      color: "#F59E0B",
    },
    {
      key: "completedPreferences" as AchievementFlagKey,
      title: "Preferences Completed",
      description: "Unlock when your preferences are saved.",
      icon: "⚙️",
      unlocked: achievements.completedPreferences,
      color: "#0EA5E9",
    },
    {
      key: "firstJobApplication" as AchievementFlagKey,
      title: "First Application",
      description: "Unlock after your first job application.",
      icon: "📝",
      unlocked: achievements.firstJobApplication,
      color: "#EC4899",
    },
    {
      key: "applications10" as AchievementFlagKey,
      title: "10 Applications",
      description: "Unlock after applying to 10 jobs.",
      icon: "📚",
      unlocked: achievements.applications10,
      color: "#14B8A6",
    },
    {
      key: "applications50" as AchievementFlagKey,
      title: "50 Applications",
      description: "Unlock after applying to 50 jobs.",
      icon: "🏆",
      unlocked: achievements.applications50,
      color: "#F97316",
    },
    {
      key: "savedFirstJob" as AchievementFlagKey,
      title: "Saved First Job",
      description: "Unlock after saving a job.",
      icon: "🔖",
      unlocked: achievements.savedFirstJob,
      color: "#EF4444",
    },
    {
      key: "accountVerified" as AchievementFlagKey,
      title: "Verified Account",
      description: "Unlock when your email is verified.",
      icon: "✅",
      unlocked: achievements.accountVerified,
      color: "#16A34A",
    },
  ];

  return (
    <div className="achievement-tab-card">
      <div className="achievement-summary">
        <div>
          <h3 className="achievement-title">Achievements</h3>
          <p className="achievement-subtitle">Track your milestones and profile progress.</p>
        </div>
        <button className="achievement-refresh-btn" type="button" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      <div className="achievement-progress">
        <div className="achievement-progress-text">
          <span>{unlockedCount} / 10 Achievements Unlocked</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="achievement-progress-track">
          <div className="achievement-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {loading ? (
        <div className="achievement-loading">Loading achievements…</div>
      ) : (
        <div className="achievement-grid">
          {cards.map((card) => (
            <div key={card.key} className={`achievement-card${card.unlocked ? " achievement-card-unlocked" : ""}`}>
              <div className="achievement-card-top">
                <div className="achievement-icon" style={{ background: `${card.color}15`, color: card.color }}>
                  {card.icon}
                </div>
                <span className={`achievement-badge${card.unlocked ? " achievement-badge-unlocked" : ""}`}>
                  {card.unlocked ? "Unlocked" : "Locked"}
                </span>
              </div>
              <h4 className="achievement-card-title">{card.title}</h4>
              <p className="achievement-card-description">{card.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProfilePage({ onBack, accountType, onPhotoSaved, onAccountTypeChange }: { onBack: () => void; accountType: AccountType; onPhotoSaved: (url: string) => void; onAccountTypeChange: (t: AccountType) => void }) {
  const acctLabel: Record<AccountType, string> = {
    jobseeker: "Job Seeker",
    recruiter: "Recruiter",
    gigsman: "Gigsman",
  };
  const [activeTab, setActiveTab] = useState<ProfileTab>("general");
  const [showBanner, setShowBanner] = useState(true);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileToast, setProfileToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<AchievementState>(DEFAULT_ACHIEVEMENTS);
  const [achievementLoading, setAchievementLoading] = useState(true);

  // ─── Profile photo state ─────────────────────────────────────────────────────
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewObjectUrl, setPreviewObjectUrl] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotoUrl(profileImageService.load());
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const nextUserId = user?.uid ?? null;
      setAuthUserId(nextUserId);

      if (!nextUserId) {
        setAchievements(DEFAULT_ACHIEVEMENTS);
        return;
      }

      try {
        const nextAchievements = await updateUserAchievements(nextUserId, {
          firstLogin: true,
          accountVerified: Boolean(user?.emailVerified),
        });
        setAchievements(nextAchievements);
      } catch (error) {
        const fallback = await getUserAchievements(nextUserId).catch(() => DEFAULT_ACHIEVEMENTS);
        setAchievements(fallback);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!authUserId) {
        if (!cancelled) {
          setProfileData(null);
          setProfileLoading(false);
        }
        return;
      }

      if (!cancelled) setProfileLoading(true);

      try {
        const data = await getUserProfile(authUserId);
        if (!cancelled) setProfileData(data);
      } catch (error) {
        if (!cancelled) setProfileData(null);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [authUserId]);

  useEffect(() => {
    if (!profileData?.activeMode) {
      return;
    }

    if (profileData.activeMode === "jobseeker" || profileData.activeMode === "recruiter" || profileData.activeMode === "gigsman") {
      onAccountTypeChange(profileData.activeMode);
    }
  }, [profileData, onAccountTypeChange]);

  useEffect(() => {
    let cancelled = false;

    async function loadAchievements() {
      if (!authUserId) {
        if (!cancelled) {
          setAchievements(DEFAULT_ACHIEVEMENTS);
          setAchievementLoading(false);
        }
        return;
      }

      if (!cancelled) setAchievementLoading(true);

      try {
        const result = await getUserAchievements(authUserId);
        if (!cancelled) setAchievements(result);
      } catch (error) {
        if (!cancelled) setAchievements(DEFAULT_ACHIEVEMENTS);
      } finally {
        if (!cancelled) setAchievementLoading(false);
      }
    }

    loadAchievements();

    return () => {
      cancelled = true;
    };
  }, [authUserId]);

  useEffect(() => {
    if (!profileToast) return;

    const timer = window.setTimeout(() => setProfileToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [profileToast]);

  useEffect(() => {
    return () => {
      if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
    };
  }, [previewObjectUrl]);

  useEffect(() => {
    if (!profileData || !authUserId) return;

    const filledFields = [
      profileData.fullName,
      profileData.username,
      profileData.headline,
      profileData.about,
      profileData.location,
      profileData.skills,
      profileData.experience,
      profileData.education,
      profileData.linkedin,
      profileData.github,
      profileData.portfolio,
      profileData.jobType,
    ].filter((value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "string") return value.trim().length > 0;
      return Boolean(value);
    }).length;

    const profileCompleted = filledFields >= 11;

    if (profileCompleted !== achievements.profileCompleted) {
      updateUserAchievements(authUserId, { profileCompleted }).catch(() => undefined);
      setAchievements((prev) => ({ ...prev, profileCompleted }));
    }
  }, [profileData, authUserId]);

  function handleFileSelected(file: File) {
    const result = validateImageFile(file);
    if (!result.valid) {
      setPhotoError(result.error ?? "Invalid file.");
      setShowPhotoMenu(false);
      return;
    }
    setPhotoError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreviewObjectUrl(objectUrl);
    setPendingFile(file);
    setShowPhotoMenu(false);
  }

  async function handleSavePhoto() {
    if (!pendingFile) return;
    setPhotoLoading(true);
    setPhotoError(null);
    try {
      const dataUrl = await fileToDataUrl(pendingFile);
      await profileImageService.save(dataUrl);
      setPhotoUrl(dataUrl);
      onPhotoSaved(dataUrl);
      await updateUserAchievements(auth.currentUser?.uid, { profilePhotoAdded: true });
      setAchievements((prev) => ({ ...prev, profilePhotoAdded: true }));
      if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
      setPreviewObjectUrl(null);
      setPendingFile(null);
    } catch (e) {
      setPhotoError(e instanceof Error ? e.message : "Failed to save image.");
    } finally {
      setPhotoLoading(false);
    }
  }

  function handleCancelPreview() {
    if (previewObjectUrl) URL.revokeObjectURL(previewObjectUrl);
    setPreviewObjectUrl(null);
    setPendingFile(null);
    setPhotoError(null);
  }

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "general", label: "General" },
    { id: "preferences", label: "Preferences" },
    { id: "achievements", label: "Achievements" },
  ];

  const profileDisplayName = profileData?.fullName?.toString().trim() || "Your name";
  const profileUsername = profileData?.username?.toString().trim() ? `@${profileData.username.toString().trim()}` : "@username";
  const profileHeadline = profileData?.headline?.toString().trim() || "Add a headline";
  const profileLocation = profileData?.location?.toString().trim() || "Add your location";
  const profileEmail = auth.currentUser?.email || profileData?.email?.toString() || "your@email.com";
  const profileAbout = profileData?.about?.toString().trim() || "Tell recruiters a bit about yourself.";
  const profileSkills = Array.isArray(profileData?.skills)
    ? profileData.skills.map((skill) => String(skill).trim()).filter(Boolean)
    : [];

  const stats = [
    { label: "Applied", value: 0 },
    { label: "Responses", value: 0 },
    { label: "Interviews", value: 0 },
    { label: "Offers", value: 0 },
  ];

  return (
    <main className="main-content profile-main">
      {profileToast && (
        <div className={`profile-toast ${profileToast.type === "success" ? "profile-toast-success" : "profile-toast-error"}`}>
          <span>{profileToast.type === "success" ? "✓" : "!"}</span>
          <span>{profileToast.message}</span>
        </div>
      )}

      {/* Back */}
      <button className="profile-back-btn" onClick={onBack}>
        ← Back
      </button>

      {/* Alert banner */}
      {showBanner && (
        <div className="profile-alert-banner">
          <div className="alert-text">
            <strong>Your profile is not complete</strong>
            <span>Complete your profile to improve visibility and get better matches.</span>
          </div>
          <button className="alert-complete-btn" onClick={() => setShowBanner(false)}>
            Complete now
          </button>
        </div>
      )}

      {/* Profile header card */}
      <div className="profile-header-card">
        <div className="profile-header-left">
          <div className="profile-photo-wrapper">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="profile-avatar-photo" />
            ) : (
              <div className="profile-avatar-lg">T</div>
            )}
            <button
              className="profile-photo-pencil"
              onClick={() => setShowPhotoMenu((v) => !v)}
              title="Change profile photo"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            </button>

            {showPhotoMenu && (
              <>
                <div className="profile-photo-menu-backdrop" onClick={() => setShowPhotoMenu(false)} />
                <div className="profile-photo-menu">
                  <button className="profile-photo-menu-item" onClick={() => uploadInputRef.current?.click()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    Upload from device
                  </button>
                  <button className="profile-photo-menu-item" onClick={() => cameraInputRef.current?.click()}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                    Take a photo
                  </button>
                </div>
              </>
            )}

            <input
              ref={uploadInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) handleFileSelected(e.target.files[0]); e.target.value = ""; }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) handleFileSelected(e.target.files[0]); e.target.value = ""; }}
            />
          </div>
          <div className="profile-info-block">
            <h2 className="profile-name">{profileLoading ? "Loading profile..." : profileDisplayName}</h2>
            <span className="profile-handle">{profileLoading ? "@loading" : profileUsername}</span>
            <button className="profile-add-headline">{profileHeadline}</button>
            <div className="profile-meta-line">
              <span>{profileLocation}</span>
              <span className="meta-dot">•</span>
              <span>{profileEmail}</span>
            </div>
            <span className="profile-seeker-badge">{acctLabel[accountType]}</span>
          </div>
        </div>

        <div className="profile-header-right">
          <div className="completion-label-row">
            <span className="completion-label">Profile completion</span>
            <span className="completion-pct">88%</span>
          </div>
          <div className="completion-bar-track">
            <div className="completion-bar-fill" style={{ width: "88%" }} />
          </div>
          <span className="completion-missing">⚠ Missing: Headline</span>
          <button className="profile-edit-btn" onClick={() => setEditProfileOpen(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit profile
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="profile-tab-nav">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`profile-tab-btn${activeTab === t.id ? " profile-tab-active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* General tab */}
      {activeTab === "general" && (
        <div className="profile-content-grid">
          {/* Left column */}
          <div className="profile-main-card">
            <section className="profile-section">
              <h4 className="section-title">About</h4>
              <p className="section-body">{profileAbout}</p>
            </section>
            <div className="section-divider" />
            <section className="profile-section">
              <h4 className="section-title">Skills</h4>
              <div className="skills-list">
                {profileSkills.length > 0 ? (
                  profileSkills.map((skill) => <span key={skill} className="skill-tag">{skill}</span>)
                ) : (
                  <span className="skill-tag">+ Add skill</span>
                )}
              </div>
            </section>
            <div className="section-divider" />
            <section className="profile-section">
  <h4 className="section-title">Contact</h4>

  <ul className="account-meta-list">
    <li>
      <span className="meta-key">Phone</span>
      <span className="meta-val">
        {profileData?.phoneNumber || "Not provided"}
      </span>
    </li>

    <li>
      <span className="meta-key">Email</span>
      <span className="meta-val">
        {profileData?.email || "Not provided"}
      </span>
    </li>
  </ul>
</section>

<div className="section-divider" />

<section className="profile-section">
  <h4 className="section-title">Experience</h4>
  <p className="section-body">
    {profileData?.experience || "No experience added yet."}
  </p>
</section>

<div className="section-divider" />

<section className="profile-section">
  <h4 className="section-title">Education</h4>
  <p className="section-body">
    {profileData?.education || "No education added yet."}
  </p>
</section>

<div className="section-divider" />
{(profileData?.github || profileData?.linkedin || profileData?.portfolio) && (
  <>
    <div className="section-divider" />

    <section className="profile-section">
      <h4 className="section-title">Links</h4>

      <ul className="account-meta-list">
        {profileData?.github && (
          <li>
            <span className="meta-key">GitHub</span>
            <a
              href={String(profileData.github)}
              target="_blank"
              rel="noopener noreferrer"
              className="meta-val"
            >
              View Profile
            </a>
          </li>
        )}

        {profileData?.linkedin && (
          <li>
            <span className="meta-key">LinkedIn</span>
            <a
              href={String(profileData.linkedin)}
              target="_blank"
              rel="noopener noreferrer"
              className="meta-val"
            >
              View Profile
            </a>
          </li>
        )}

        {profileData?.portfolio && (
          <li>
            <span className="meta-key">Portfolio</span>
            <a
              href={String(profileData.portfolio)}
              target="_blank"
              rel="noopener noreferrer"
              className="meta-val"
            >
              Visit Website
            </a>
          </li>
        )}
      </ul>
    </section>
  </>
)}

<section className="profile-section">
  <h4 className="section-title">Account Meta</h4>
  <ul className="account-meta-list">
    <li>
      <span className="meta-key">Account type</span>
      <span className="meta-val">{acctLabel[accountType]}</span>
    </li>
    <li>
      <span className="meta-key">Member since</span>
      <span className="meta-val">Mar 2026</span>
    </li>
    <li>
      <span className="meta-key">Reputation</span>
      <span className="meta-val">0</span>
    </li>
  </ul>
</section>

</div>

          {/* Right column: stats 2×2 */}
          <div className="profile-stats-col">
            <div className="stats-grid">
              {stats.map((s) => (
                <div key={s.label} className="stat-card">
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "preferences" && (
        <PreferencesTab
          profileData={profileData}
          onProfileUpdated={(nextProfile) => setProfileData(nextProfile)}
          onShowToast={(toast) => setProfileToast(toast)}
          onAchievementsUpdated={(updates) => setAchievements((prev) => ({ ...prev, ...updates }))}
        />
      )}
      {activeTab === "achievements" && (
        <AchievementTab
          achievements={achievements}
          loading={achievementLoading}
          onRefresh={() => {
            if (!authUserId) return;
            setAchievementLoading(true);
            getUserAchievements(authUserId)
              .then((next) => setAchievements(next))
              .catch(() => setAchievements({ ...DEFAULT_ACHIEVEMENTS }))
              .finally(() => setAchievementLoading(false));
          }}
        />
      )}

      {/* Inline validation error (shown when a file is rejected before preview) */}
      {photoError && !previewObjectUrl && (
        <div className="profile-photo-inline-error">{photoError}</div>
      )}

      {/* Photo preview modal */}
      {previewObjectUrl && (
        <div className="profile-photo-modal-backdrop">
          <div className="profile-photo-modal">
            <h3 className="profile-photo-modal-title">Preview photo</h3>
            <img src={previewObjectUrl} alt="Preview" className="profile-photo-preview-img" />
            {photoError && <p className="profile-photo-error">{photoError}</p>}
            <div className="profile-photo-modal-actions">
              <button className="profile-photo-cancel-btn" onClick={handleCancelPreview} disabled={photoLoading}>
                Cancel
              </button>
              <button className="profile-photo-save-btn" onClick={handleSavePhoto} disabled={photoLoading}>
                {photoLoading ? <span className="profile-photo-spinner" /> : "Save photo"}
              </button>
            </div>
          </div>
        </div>
      )}

      <EditProfileModal
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        profile={profileData}
        onSaved={(nextProfile) => setProfileData(nextProfile)}
        onShowToast={(toast) => setProfileToast(toast)}
        onAchievementsUpdated={(updates) => setAchievements((prev) => ({ ...prev, ...updates }))}
      />
    </main>
  );
}

// ─── Applications Page ────────────────────────────────────────────────────────

function ApplicationsPage({
  onExplore,
  savedJobIds,
  onToggleSavedJob,
}: {
  onExplore: () => void;
  savedJobIds: string[];
  onToggleSavedJob: (jobId: string, jobData?: SavedJobTogglePayload) => Promise<boolean>;
}) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savingJobIds, setSavingJobIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const unsubscribe = subscribeToMyApplications(
      (nextApplications) => {
        setApplications(nextApplications);
        setIsLoading(false);
        setErrorMessage(null);
      },
      () => {
        setErrorMessage("We couldn't load your applications right now. Please try again.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  function mapApplicationToCard(application: Application): JobCardData {
    const appliedDate = formatDisplayDate(application.appliedDate);

    return {
      id: application.jobId ?? application.applicationId ?? `${application.jobTitle}-${application.company}-${application.location}`,
      recruiterId: application.recruiterId,
      title: application.jobTitle,
      company: application.company,
      companyColor: ["#6366F1", "#111827", "#5B6AD0", "#F24E1E"][Math.abs((application.jobTitle?.length ?? 0) + (application.company?.length ?? 0)) % 4],
      location: application.location || "Remote",
      posted: appliedDate ? `Applied ${appliedDate}` : "Applied recently",
      salary: application.salary || "$0",
      tags: [application.employmentType || "Full-time"],
      description: `Status: ${application.status}`,
    };
  }

  async function handleSaveJob(job: JobCardData) {
    if (!job.id) return;

    setSavingJobIds((prev) => ({ ...prev, [job.id]: true }));

    try {
      const nextSaved = await onToggleSavedJob(job.id, {
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        employmentType: job.tags.find((tag) => tag.toLowerCase().includes("full")) ?? "Full-time",
      });

      setToastMessage(nextSaved ? `Saved ${job.title}.` : `Removed ${job.title} from saved jobs.`);
    } catch (error) {
      setToastMessage(getFriendlySavedJobsError(error));
    } finally {
      setSavingJobIds((prev) => ({ ...prev, [job.id]: false }));
    }
  }

  if (isLoading) {
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
          <h1 className="empty-title">Loading applications…</h1>
          <p className="empty-subtitle">Please wait while we fetch your latest updates.</p>
        </div>
      </main>
    );
  }

  if (errorMessage) {
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
          <h1 className="empty-title">Unable to load applications</h1>
          <p className="empty-subtitle">{errorMessage}</p>
        </div>
      </main>
    );
  }

  if (applications.length === 0) {
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

  return (
    <main className="main-content">
      {toastMessage && (
        <div style={{ marginBottom: 12, padding: "10px 12px", borderRadius: 10, background: toastMessage.includes("already") ? "#fef3c7" : "#f0fdf4", color: toastMessage.includes("already") ? "#92400e" : "#166534", fontSize: 13, border: `1px solid ${toastMessage.includes("already") ? "#fde68a" : "#bbf7d0"}` }}>
          {toastMessage}
        </div>
      )}

      <div className="job-list" style={{ gap: 12 }}>
        {applications.map((application) => {
          const cardJob = mapApplicationToCard(application);

          return (
            <JobCard
              key={cardJob.id}
              job={cardJob}
              onClick={() => setSelectedJob(cardJob)}
              onToggleSave={() => void handleSaveJob(cardJob)}
              onApply={() => {
                /* already applied */
              }}
              isSaved={savedJobIds.includes(cardJob.id)}
              isSaving={savingJobIds[cardJob.id] ?? false}
              isApplied={true}
              showApplyButton
            />
          );
        })}
      </div>

      {selectedJob && (
        <JobDetailsDrawer
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={() => undefined}
          isApplied={true}
          isApplying={false}
          isSaved={savedJobIds.includes(selectedJob.id)}
          isSaving={savingJobIds[selectedJob.id] ?? false}
          onToggleSave={() => void handleSaveJob(selectedJob)}
        />
      )}
    </main>
  );
}

function formatDisplayDate(value: unknown): string | null {
  if (!value) return null;

  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate?: () => Date }).toDate === "function") {
    try {
      return (value as { toDate: () => Date }).toDate().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return null;
    }
  }

  return null;
}

function SavedJobsPage({
  onExplore,
  savedJobIds,
  onToggleSavedJob,
}: {
  onExplore: () => void;
  savedJobIds: string[];
  onToggleSavedJob: (jobId: string, jobData?: SavedJobTogglePayload) => Promise<boolean>;
}) {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobCardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [applyState, setApplyState] = useState<Record<string, { applied: boolean; applying: boolean }>>({});
  const [savingJobIds, setSavingJobIds] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToSavedJobs(
      (nextSavedJobs) => {
        setSavedJobs(nextSavedJobs);
        setIsLoading(false);
        setErrorMessage(null);
      },
      () => {
        setErrorMessage("We couldn't load your saved jobs right now. Please try again.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  async function handleSaveJob(savedJob: JobCardData) {
    if (!savedJob.id) return;

    setSavingJobIds((prev) => ({ ...prev, [savedJob.id]: true }));

    try {
      const nextSaved = await onToggleSavedJob(savedJob.id, {
        title: savedJob.title,
        company: savedJob.company,
        location: savedJob.location,
        salary: savedJob.salary,
        employmentType: savedJob.tags.find((tag) => tag.toLowerCase().includes("full")) ?? "Full-time",
      });

      setToastMessage(nextSaved ? `Saved ${savedJob.title || "this job"}.` : `Removed ${savedJob.title || "this job"} from saved jobs.`);
    } catch (error) {
      setToastMessage(getFriendlySavedJobsError(error));
    } finally {
      setSavingJobIds((prev) => ({ ...prev, [savedJob.id]: false }));
    }
  }

  async function handleApplyJob(savedJob: JobCardData) {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setToastMessage("Please sign in before applying to a job.");
      return;
    }

    setApplyState((prev) => ({ ...prev, [savedJob.id]: { applied: prev[savedJob.id]?.applied ?? false, applying: true } }));

    try {
      await applyToJob({
        jobId: savedJob.id,
        recruiterId: savedJob.recruiterId ?? "",
        applicantId: userId,
        jobTitle: savedJob.title,
        company: savedJob.company ?? savedJob.title,
        location: savedJob.location,
        salary: savedJob.salary,
        employmentType: savedJob.tags.find((tag) => tag.toLowerCase().includes("full")) ?? "Full-time",
        experience: "Not specified",
      });

      setApplyState((prev) => ({ ...prev, [savedJob.id]: { applied: true, applying: false } }));
      setToastMessage(`Application submitted for ${savedJob.title}.`);
    } catch (error) {
      setApplyState((prev) => ({ ...prev, [savedJob.id]: { applied: prev[savedJob.id]?.applied ?? false, applying: false } }));
      setToastMessage(getFriendlyErrorMessage(error));
    }
  }

  if (isLoading) {
    return (
      <main className="main-content">
        <div className="empty-state">
          <svg className="empty-icon apps-icon" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="4" width="36" height="48" rx="4" stroke="#D1D5DB" strokeWidth="2.5" />
            <line x1="16" y1="18" x2="36" y2="18" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="27" x2="36" y2="27" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="36" x2="28" y2="36" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <h1 className="empty-title">Loading saved jobs…</h1>
          <p className="empty-subtitle">Please wait while we load your saved opportunities.</p>
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="main-content">
        <div className="empty-state">
          <svg className="empty-icon apps-icon" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="4" width="36" height="48" rx="4" stroke="#D1D5DB" strokeWidth="2.5" />
            <line x1="16" y1="18" x2="36" y2="18" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="27" x2="36" y2="27" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="36" x2="28" y2="36" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <h1 className="empty-title">Unable to load saved jobs</h1>
          <p className="empty-subtitle">{errorMessage}</p>
        </div>
      </main>
    );
  }

  if (savedJobs.length === 0) {
    return (
      <main className="main-content">
        <div className="empty-state">
          <svg className="empty-icon apps-icon" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="4" width="36" height="48" rx="4" stroke="#D1D5DB" strokeWidth="2.5" />
            <line x1="16" y1="18" x2="36" y2="18" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="27" x2="36" y2="27" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="16" y1="36" x2="28" y2="36" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <h1 className="empty-title">No saved jobs yet.</h1>
          <p className="empty-subtitle">Save a job to see it here.</p>
          <button className="explore-btn" onClick={onExplore}>
            Explore jobs →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="main-content">
      {toastMessage && (
        <div style={{ marginBottom: 12, padding: "10px 12px", borderRadius: 10, background: toastMessage.includes("already") ? "#fef3c7" : "#f0fdf4", color: toastMessage.includes("already") ? "#92400e" : "#166534", fontSize: 13, border: `1px solid ${toastMessage.includes("already") ? "#fde68a" : "#bbf7d0"}` }}>
          {toastMessage}
        </div>
      )}
      <div className="job-list" style={{ gap: 12 }}>
        {savedJobs.map((savedJob) => {
          const cardJob: JobCardData = {
            id: savedJob.jobId,
            recruiterId: undefined,
            title: savedJob.title || "Untitled role",
            company: savedJob.company || "Unknown company",
            companyColor: ["#6366F1", "#111827", "#5B6AD0", "#F24E1E"][Math.abs((savedJob.title?.length ?? 0) + (savedJob.company?.length ?? 0)) % 4],
            location: savedJob.location || "Remote",
            posted: formatDisplayDate(savedJob.postedDate) || "Just now",
            salary: savedJob.salary || "$0",
            tags: [savedJob.employmentType || "Full-time"],
            description: savedJob.description,
          };

          return (
            <JobCard
              key={savedJob.jobId}
              job={cardJob}
              onClick={() => setSelectedJob(cardJob)}
              onToggleSave={() => void handleSaveJob(cardJob)}
              onApply={() => handleApplyJob(cardJob)}
              isApplied={applyState[cardJob.id]?.applied ?? false}
              isApplying={applyState[cardJob.id]?.applying ?? false}
              isSaved={savedJobIds.includes(savedJob.jobId)}
              isSaving={savingJobIds[savedJob.jobId] ?? false}
            />
          );
        })}
      </div>
      {selectedJob && (
        <JobDetailsDrawer
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={() => handleApplyJob(selectedJob)}
          isApplied={applyState[selectedJob.id]?.applied ?? false}
          isApplying={applyState[selectedJob.id]?.applying ?? false}
          isSaved={savedJobIds.includes(selectedJob.id)}
          isSaving={savingJobIds[selectedJob.id] ?? false}
          onToggleSave={() => handleSaveJob(selectedJob)}
        />
      )}
    </main>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [location, navigate] = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("jobseeker");
  const [navPhotoUrl, setNavPhotoUrl] = useState<string | null>(() => profileImageService.load());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [profileLoading, setProfileLoading] = useState<boolean>(true);
  const appLoading = authLoading || profileLoading;
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [showInitialAcctModal, setShowInitialAcctModal] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) = () => undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      const nextUserId = user?.uid ?? null;
      setAuthUserId(nextUserId);
      setIsAuthenticated(Boolean(nextUserId));
      setAuthLoading(false);
      unsubscribe();

      if (!nextUserId) {
        setSavedJobIds([]);
        return;
      }

      unsubscribe = subscribeToSavedJobs(
        (nextSavedJobs) => {
          setSavedJobIds(nextSavedJobs.map((savedJob) => savedJob.jobId).filter((jobId): jobId is string => Boolean(jobId)));
        },
        () => {
          setSavedJobIds([]);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      unsubscribe();
    };
  }, []);

  async function handleToggleSavedJob(jobId: string, jobData?: SavedJobTogglePayload) {
    return await toggleSavedJob(jobId, jobData);
  }

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!authUserId) {
        if (!cancelled) {
          setProfileData(null);
          setProfileLoading(false);
        }
        return;
      }

      if (!cancelled) setProfileLoading(true);

      try {
        const data = await getUserProfile(authUserId);
        if (!cancelled) {
          setProfileData(data);
          if (data?.activeMode === "jobseeker" || data?.activeMode === "recruiter" || data?.activeMode === "gigsman") {
            setAccountType(data.activeMode);
          }
          setShowInitialAcctModal(data?.accountTypeSelected === false);
        }
      } catch (error) {
        if (!cancelled) setProfileData(null);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [authUserId]);

  // Redirect to the correct home page once the profile has loaded and
  // accountType is known. Skipped while the initial account-type modal is
  // open (that flow handles its own navigation).
  useEffect(() => {
    if (profileLoading || !isAuthenticated) return;
    if (showInitialAcctModal) return;

    if (accountType === "recruiter" && !location.startsWith("/recruiter/")) {
      navigate("/recruiter/home");
    } else if (accountType === "jobseeker" && !location.startsWith("/seeker/")) {
      navigate("/seeker/home");
    }
  }, [profileLoading, isAuthenticated, accountType, showInitialAcctModal]);

  function handleAccountTypeChange(t: AccountType) {
    setAccountType(t);
    if (authUserId) {
      void updateUserProfile(authUserId, { activeMode: t }).catch(() => undefined);
    }
    // Switch to recruiter default page if currently on a seeker-only route
    if (t === "recruiter" && location.startsWith("/seeker/")) {
      navigate("/recruiter/home");
    }
    // Switch to seeker default page if currently on a recruiter-only route
    if (t === "jobseeker" && location.startsWith("/recruiter/")) {
      navigate("/seeker/home");
    }
  }

  async function handleInitialAccountTypeSelection(t: AccountType) {
    setAccountType(t);
    if (authUserId) {
      await updateUserProfile(authUserId, { activeMode: t, accountTypeSelected: true }).catch(() => undefined);
    }
    setShowInitialAcctModal(false);
    if (t === "recruiter") {
      navigate("/recruiter/home");
    } else {
      navigate("/seeker/home");
    }
  }

  const isRecruiter = accountType === "recruiter";

  const navItems: { id: NavPage; icon: string; label: string }[] = isRecruiter
    ? [
      { id: "home", icon: "🏠", label: "Home" },
      { id: "search", icon: "📄", label: "Search jobs" },
      { id: "jobposts", icon: "🏢", label: "Job Posts" },
    ]
    : [
      { id: "home", icon: "🏠", label: "Home" },
      { id: "search", icon: "📄", label: "Search jobs" },
      { id: "applications", icon: "📋", label: "My Applications" },
      { id: "saved", icon: "🔖", label: "Saved Jobs" },
    ];

  function isNavActive(id: NavPage): boolean {
    switch (id) {
      case "home":
        return location === "/seeker/home" || location === "/recruiter/home";
      case "search":
        return location === "/seeker/search";
      case "applications":
        return location === "/seeker/applications";
      case "saved":
        return location === "/seeker/saved";
      case "jobposts":
        return location === "/recruiter/jobposts";
      case "chat":
        return location === "/seeker/chat" || location === "/recruiter/chat";
      case "profile":
        return location === "/seeker/profile" || location === "/recruiter/profile";
      case "companyprofile":
        return location === "/company-profile";
      case "settings":
        return location === "/seeker/settings" || location === "/recruiter/settings";
      default:
        return false;
    }
  }

  function handleNavClick(id: NavPage) {
    switch (id) {
      case "home":
        navigate(isRecruiter ? "/recruiter/home" : "/seeker/home");
        break;
      case "search":
        navigate("/seeker/search");
        break;
      case "applications":
        navigate("/seeker/applications");
        break;
      case "saved":
        navigate("/seeker/saved");
        break;
      case "jobposts":
        navigate("/recruiter/jobposts");
        break;
      case "chat":
        navigate(isRecruiter ? "/recruiter/chat" : "/seeker/chat");
        break;
      case "profile":
        navigate(isRecruiter ? "/recruiter/profile" : "/seeker/profile");
        break;
      case "companyprofile":
        navigate("/company-profile");
        break;
      case "settings":
        navigate(isRecruiter ? "/recruiter/settings" : "/seeker/settings");
        break;
    }
  }

  const isChatActive =
    location === "/seeker/chat" || location === "/recruiter/chat";

  if (appLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span>Loading…</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/login">
          <LoginPage
            onLogin={(remember) => {
              if (remember) {
                localStorage.setItem("dailycruit_auth", "true");
              }
              navigate("/seeker/home");
            }}
            onNavigateToSignUp={() => navigate("/signup")}
            onNavigateToForgotPassword={() => navigate("/forgot-password")}
          />
        </Route>
        <Route path="/signup">
          <SignUpPage
            onSignUp={() => {
              navigate("/seeker/home");
            }}
            onNavigateToLogin={() => navigate("/login")}
          />
        </Route>
        <Route path="/forgot-password">
          <ForgotPasswordPage
            onNavigateToLogin={() => navigate("/login")}
          />
        </Route>
        <Route>
          <Redirect to="/login" />
        </Route>
      </Switch>
    );
  }

  return (
    <>
      {showInitialAcctModal && (
        <AccountTypeModal
          current={accountType}
          onSelect={handleInitialAccountTypeSelection}
          onClose={() => undefined}
          isFirstTime
        />
      )}
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
              className={`nav-link${isNavActive(item.id) ? " active" : ""}`}
              data-page={item.id}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="navbar-right">
          <button
            className={`icon-btn${isChatActive ? " chat-active" : ""}`}
            title="Messages"
            onClick={() =>
              navigate(isRecruiter ? "/recruiter/chat" : "/seeker/chat")
            }
          >
            <ChatIcon />
          </button>

          <button
            className="icon-btn"
            title="Notifications"
            onClick={() => setShowNotifications((v) => !v)}
          >
            <BellIcon />
          </button>

          <div className="avatar-wrapper profile-dropdown-wrapper" title="Profile">
            <div
              className="avatar"
              onClick={() => setShowProfileMenu((v) => !v)}
              style={{ cursor: "pointer", padding: navPhotoUrl ? 0 : undefined, overflow: navPhotoUrl ? "hidden" : undefined }}
            >
              {navPhotoUrl ? (
                <img src={navPhotoUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: "50%" }} />
              ) : "T"}
            </div>
            <span className="online-dot" />
            {showProfileMenu && (
              <ProfileDropdown
                accountType={accountType}
                onClose={() => setShowProfileMenu(false)}
                onNavigate={(page) => {
                  switch (page) {
                    case "profile":
                      navigate(isRecruiter ? "/recruiter/profile" : "/seeker/profile");
                      break;
                    case "companyprofile":
                      navigate("/company-profile");
                      break;
                    case "settings":
                      navigate(isRecruiter ? "/recruiter/settings" : "/seeker/settings");
                      break;
                    case "home":
                      navigate(isRecruiter ? "/recruiter/home" : "/seeker/home");
                      break;
                  }
                  setShowProfileMenu(false);
                }}
                onLogout={() => {
                  void signOut(auth).finally(() => {
                    localStorage.removeItem("dailycruit_auth");
                    setIsAuthenticated(false);
                    setAccountType("jobseeker");
                    setShowProfileMenu(false);
                    navigate("/login");
                  });
                }}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Route-based page rendering */}
      <Switch>
        {/* Root redirect */}
        <Route path="/">
          <Redirect to={isRecruiter ? "/recruiter/home" : "/seeker/home"} />
        </Route>

        {/* Seeker routes */}
        <Route path="/seeker/home">
          <HomePage
            onCreateJob={() => setShowModal(true)}
            savedJobIds={savedJobIds}
            onToggleSavedJob={handleToggleSavedJob}
          />
        </Route>
        <Route path="/seeker/search">
          <SearchJobsPage
            savedJobIds={savedJobIds}
            onToggleSavedJob={handleToggleSavedJob}
          />
        </Route>
        <Route path="/seeker/applications">
          <ApplicationsPage
            onExplore={() => navigate("/seeker/search")}
            savedJobIds={savedJobIds}
            onToggleSavedJob={handleToggleSavedJob}
          />
        </Route>
        <Route path="/seeker/saved">
          <SavedJobsPage
            onExplore={() => navigate("/seeker/search")}
            savedJobIds={savedJobIds}
            onToggleSavedJob={handleToggleSavedJob}
          />
        </Route>
        <Route path="/seeker/chat">
          <ChatPage onBack={() => navigate("/seeker/home")} />
        </Route>
        <Route path="/seeker/profile">
          <ProfilePage
            onBack={() => navigate("/seeker/home")}
            accountType={accountType}
            onPhotoSaved={setNavPhotoUrl}
            onAccountTypeChange={handleAccountTypeChange}
          />
        </Route>
        <Route path="/seeker/settings">
          <SettingsPage
            onBack={() => navigate("/seeker/home")}
            accountType={accountType}
            onAccountTypeChange={handleAccountTypeChange}
          />
        </Route>

        {/* Recruiter routes */}
        <Route path="/recruiter/home">
          <RecruiterHomePage
            onCreatePost={() => navigate("/recruiter/jobposts")}
          />
        </Route>
        <Route path="/recruiter/jobposts">
          <JobPostsPage />
        </Route>
        <Route path="/recruiter/chat">
          <ChatPage onBack={() => navigate("/recruiter/home")} />
        </Route>
        <Route path="/recruiter/profile">
          <ProfilePage
            onBack={() => navigate("/recruiter/home")}
            accountType={accountType}
            onPhotoSaved={setNavPhotoUrl}
            onAccountTypeChange={handleAccountTypeChange}
          />
        </Route>
        <Route path="/company-profile">
          <CompanyProfilePage />
        </Route>
        <Route path="/recruiter/settings">
          <SettingsPage
            onBack={() => navigate("/recruiter/home")}
            accountType={accountType}
            onAccountTypeChange={handleAccountTypeChange}
          />
        </Route>
        <Route path="/login">
          <Redirect to={isRecruiter ? "/recruiter/home" : "/seeker/home"} />
        </Route>
        <Route path="/signup">
          <Redirect to={isRecruiter ? "/recruiter/home" : "/seeker/home"} />
        </Route>
        <Route path="/forgot-password">
          <Redirect to={isRecruiter ? "/recruiter/home" : "/seeker/home"} />
        </Route>
      </Switch>



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
