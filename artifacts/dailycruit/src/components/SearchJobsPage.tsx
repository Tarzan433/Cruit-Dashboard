import { useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { subscribeToActiveJobs } from "../services/jobService";
import {
  applyToJob,
  getFriendlyErrorMessage,
  hasAppliedToJob,
} from "../services/applicationService";
import {
  getFriendlySavedJobsError,
  toggleSavedJob,
} from "../services/savedJobService";
import { getUserAchievements, updateUserAchievements } from "../services/achievementService";
import { JobCard, type JobCardData } from "./JobCard";
import { JobDetailsDrawer } from "./JobDetailsDrawer";

type SavedJobTogglePayload = Parameters<typeof toggleSavedJob>[1];

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

function SearchBigIcon() {
  return (
    <svg className="empty-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="34" r="18" stroke="#D1D5DB" strokeWidth="3" />
      <path d="M48 47L62 61" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

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

type SearchJobsPageProps = {
  savedJobIds: string[];
  onToggleSavedJob: (jobId: string, jobData?: SavedJobTogglePayload) => Promise<boolean>;
  query?: string;
  onQueryChange?: (value: string) => void;
  showSearchInput?: boolean;
};

export function SearchJobsPage({ savedJobIds, onToggleSavedJob, query: controlledQuery, onQueryChange, showSearchInput = true }: SearchJobsPageProps) {
  const [internalQuery, setInternalQuery] = useState("");
  const query = controlledQuery ?? internalQuery;
  const setQuery = (value: string) => {
    if (onQueryChange) {
      onQueryChange(value);
    } else {
      setInternalQuery(value);
    }
  };
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
      (error) => {
        console.error("subscribeToActiveJobs error:", error);
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
      {showSearchInput && (
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
      )}

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
              isOwner={auth.currentUser?.uid === selectedJob.recruiterId}
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
