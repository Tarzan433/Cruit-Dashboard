import { useState, useEffect } from "react";
import { auth } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { subscribeToActiveJobs } from "../services/jobService";
import { applyToJob, getFriendlyErrorMessage, hasAppliedToJob } from "../services/applicationService";
import { JobCard, type JobCardData } from "../components/JobCard";
import { JobDetailsDrawer } from "../components/JobDetailsDrawer";
import { CompanyViewPanel } from "../components/CompanyViewPanel";
import { SearchJobsPage } from "../components/SeekerHomeSearchPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

export type HomeJob = {
  id: number;
  jobId?: string;
  recruiterId?: string;
  company?: string;
  companyId?: string | null;
  title: string;
  tags: string[];
  description: string;
  location: string;
  date: string;
  salary: string;
  views: number;
  bullets: string[];
};

// ─── Shared jobs loader ────────────────────────────────────────────────────────

function toHomeJob(job: { id?: string; recruiterId?: string; company?: string; companyId?: string | null; title: string; description: string; location: string; salary: string; postedDate?: string; commitment?: string; workMode?: string; skills?: string[]; views?: number; createdAt?: number; }): HomeJob {
  return {
    id: Number(job.createdAt ?? 0),
    jobId: job.id,
    recruiterId: job.recruiterId,
    company: job.company,
    companyId: job.companyId ?? null,
    title: job.title,
    tags: [job.commitment, job.workMode]
      .filter((t): t is string => Boolean(t) && t !== "—" && t !== "onsite" && t !== "remote" && t !== "hybrid")
      .concat(job.workMode === "remote" ? ["Remote"] : job.workMode === "hybrid" ? ["Hybrid"] : ["On-site"]),
    description: job.description,
    location: job.location || job.workMode || "Remote",
    date: job.postedDate || "Just now",
    salary: job.salary,
    views: job.views ?? 0,
    bullets: job.skills && job.skills.length > 0
      ? job.skills.map((s) => `Skill required: ${s}`)
      : ["Apply now to learn more about this opportunity."],
  };
}



function HomeSearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
    </svg>
  );
}

type HomePageProps = {
  onCreateJob: () => void;
  savedJobIds: string[];
  onToggleSavedJob: (jobId: string, jobData?: { title?: string; company?: string; location?: string; salary?: string; employmentType?: string }) => Promise<boolean>;
};

export default function HomePage({ onCreateJob, savedJobIds, onToggleSavedJob }: HomePageProps) {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<HomeJob | null>(null);
  const [sharedJobs, setSharedJobs] = useState<HomeJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savingJobIds, setSavingJobIds] = useState<Record<string, boolean>>({});
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let mounted = true;

    const unsubscribe = subscribeToActiveJobs(
      (jobs) => {
        if (!mounted) return;
        setSharedJobs(jobs.map(toHomeJob));
        setIsLoading(false);
        setErrorMessage(null);
      },
      (error) => {
        if (!mounted) return;
        console.error("subscribeToActiveJobs error:", error);
        setErrorMessage("We couldn't load jobs right now. Please try again.");
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async () => {
      if (!selectedJob?.jobId) return;
      try {
        setIsApplied(await hasAppliedToJob(selectedJob.jobId));
      } catch {
        setIsApplied(false);
      }
    });

    return () => unsubscribeAuth();
  }, [selectedJob?.jobId]);

  useEffect(() => {
    if (!toastMessage) return;
    const timeout = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  async function handleToggleSaved(job: HomeJob) {
    if (!job.jobId) return;

    setSavingJobIds((prev) => ({ ...prev, [job.jobId!]: true }));

    try {
      const nextSaved = await onToggleSavedJob(job.jobId, {
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        employmentType: job.tags.find((tag) => tag.toLowerCase().includes("full")) ?? "Full-time",
      });

      setToastMessage(nextSaved ? `Saved ${job.title}.` : `Removed ${job.title} from saved jobs.`);
    } catch (error) {
      setToastMessage(error instanceof Error ? error.message : "We couldn't update your saved jobs right now. Please try again.");
    } finally {
      setSavingJobIds((prev) => ({ ...prev, [job.jobId!]: false }));
    }
  }

  async function handleApplyToSelectedJob() {
    if (!selectedJob?.jobId) return;
    const userId = auth.currentUser?.uid;
    if (!userId) {
      setToastMessage("Please sign in before applying to a job.");
      return;
    }

    setIsApplying(true);

    try {
      await applyToJob({
        jobId: selectedJob.jobId,
        recruiterId: selectedJob.recruiterId ?? "",
        applicantId: userId,
        jobTitle: selectedJob.title,
        company: selectedJob.company ?? selectedJob.title,
        location: selectedJob.location,
        salary: selectedJob.salary,
        employmentType: selectedJob.tags.find((tag) => tag.toLowerCase().includes("full")) ?? "Full-time",
        experience: "Not specified",
      });
      setIsApplied(true);
      setToastMessage(`Application submitted for ${selectedJob.title}.`);
    } catch (error) {
      setToastMessage(getFriendlyErrorMessage(error));
    } finally {
      setIsApplying(false);
    }
  }

  const allJobs: HomeJob[] = [...sharedJobs];

  const mapToCardData = (job: HomeJob): JobCardData => ({
    id: job.jobId ?? String(job.id),
    recruiterId: job.recruiterId,
    title: job.title,
    company: job.company,
    companyId: job.companyId,
    location: job.location,
    posted: job.date,
    salary: job.salary,
    tags: job.tags,
    description: job.description,
    views: job.views,
    bullets: job.bullets,
  });

  return (
    <>
      <main className="main-content home-main">
        <div className="content-container">
          <div className="home-welcome">
            <div>
              <h1 className="home-heading">Welcome, Tarzan 👋</h1>
              <p className="home-subheading">Find your next opportunity</p>
            </div>
          </div>

          <div className={`home-search-shell${isSearchExpanded ? " home-search-expanded" : ""}`}>
          <div className="home-search-trigger" role="searchbox">
            <span className="home-search-icon">
              <HomeSearchIcon size={18} />
            </span>
            <input
              className="home-search-input"
              type="text"
              placeholder="Search jobs, companies, or locations"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onFocus={() => setIsSearchExpanded(true)}
              onClick={() => setIsSearchExpanded(true)}
            />
            {isSearchExpanded && (
              <button
                type="button"
                className="home-search-close"
                aria-label="Close search"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsSearchExpanded(false);
                }}
              >
                ✕
              </button>
            )}
          </div>

          {isSearchExpanded ? (
            <div className="home-search-expanded-panel">
              <SearchJobsPage
                savedJobIds={savedJobIds}
                onToggleSavedJob={onToggleSavedJob}
                query={searchQuery}
                onQueryChange={setSearchQuery}
                showSearchInput={false}
              />
            </div>
          ) : (
            <>
              <div className="home-job-list">
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
                  <div style={{ textAlign: "center", padding: "48px 0", color: "#6B7280" }}>
                    <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Loading jobs...</p>
                    <p style={{ fontSize: 14 }}>Please wait while we load the latest opportunities.</p>
                  </div>
                ) : allJobs.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "#6B7280" }}>
                    <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No jobs available yet.</p>
                    <p style={{ fontSize: 14 }}>Check back later for new opportunities.</p>
                  </div>
                ) : (
                  allJobs.map((job) => {
                    const cardJob = mapToCardData(job);
                    return (
                      <JobCard
                        key={cardJob.id}
                        job={cardJob}
                        onClick={() => setSelectedJob(job)}
                        onToggleSave={() => handleToggleSaved(job)}
                        isSaved={savedJobIds.includes(job.jobId ?? "")}
                        isSaving={savingJobIds[job.jobId ?? ""] ?? false}
                        showApplyButton={false}
                        onViewCompany={(companyId) => setSelectedCompanyId(companyId)}
                      />
                    );
                  })
                )}
              </div>
            </>
          )}
          </div>
        </div>
      </main>

      {selectedJob && (
        <JobDetailsDrawer
          job={mapToCardData(selectedJob)}
          onClose={() => setSelectedJob(null)}
          onApply={handleApplyToSelectedJob}
          isApplied={isApplied}
          isApplying={isApplying}
          isSaved={savedJobIds.includes(selectedJob.jobId ?? "")}
          isSaving={savingJobIds[selectedJob.jobId ?? ""] ?? false}
          onToggleSave={() => handleToggleSaved(selectedJob)}
        />
      )}

      {selectedCompanyId && (
        <CompanyViewPanel
          companyId={selectedCompanyId}
          onClose={() => setSelectedCompanyId(null)}
        />
      )}
    </>
  );
}
