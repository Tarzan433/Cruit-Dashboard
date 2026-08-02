
// ─── Imports ─────────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Eye, Pencil, Share2, Ban, RotateCcw } from "lucide-react";

import { auth } from "../firebase/firebase";
import { useLocation } from "wouter";
import { findOrCreateConversation } from "../services/chatService";

import {
  CreateJobPostWizard,
  PublishedJob,
} from "../components/CreateJobPostWizard";

import { ApplicantViewPanel } from "../components/ApplicantViewPanel";

import {
  createJob,
  getRecruiterJobs,
  updateJobStatus,
} from "../services/jobService";

import { 
  getApplicationsForRecruiter,
  type Application,
} from "../services/applicationService";

import {
  getUserProfile,
  type ProfileData,
} from "../services/profile";
// ─── Recruiter Home Page ──────────────────────────────────────────────────────

const REC_CHATS = [
  { letter: "M", name: "Muhammed Faris", sub: "No messages yet" },
  { letter: "M", name: "Muhammed Faris", sub: "No messages yet" },
  { letter: "M", name: "Muhammed Faris", sub: "No messages yet" },
];

export function RecruiterHomePage({ onCreatePost }: { onCreatePost: () => void }) {
const [location, navigate] = useLocation();
const [jobs, setJobs] = useState<PublishedJob[]>([]);
const [applications, setApplications] = useState<
  (Application & {
    applicantName: string;
    applicantProfile: ProfileData | null;
  })[]
>([]);
const [isLoading, setIsLoading] = useState(true);

const [showApplicantPanel, setShowApplicantPanel] = useState(false);
const [selectedApplicant, setSelectedApplicant] =
  useState<ProfileData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setJobs([]);
        setApplications([]);
        setIsLoading(false);
        return;
      }

      try {
        const recruiterJobs = await getRecruiterJobs(user.uid);
        const recruiterApplications = await getApplicationsForRecruiter(user.uid);

        const uniqueApplicantIds = Array.from(new Set(recruiterApplications.map((app) => app.applicantId)));
        const applicantProfiles = await Promise.all(
          uniqueApplicantIds.map((id) => getUserProfile(id))
        );

const profileById: Record<string, ProfileData | null> = {};

uniqueApplicantIds.forEach((id, index) => {
  profileById[id] = applicantProfiles[index];
});

const applicationsWithProfiles = recruiterApplications.map((app) => ({
  ...app,
  applicantName:
    profileById[app.applicantId]?.fullName ?? "Unknown applicant",
  applicantProfile: profileById[app.applicantId] ?? null,
}));

        setJobs(recruiterJobs as unknown as PublishedJob[]);
setApplications(applicationsWithProfiles);        
      } catch {
        setJobs([]);
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const totalPosts = jobs.length;
  const activeCount = jobs.filter((j) => j.status === "Active").length;
  const draftCount = jobs.filter((j) => j.status === "Draft").length;
  const closedCount = jobs.filter((j) => j.status === "Closed").length;
  const totalApplications = applications.length;
  const totalViews = jobs.reduce((sum, j) => sum + (j.views ?? 0), 0);

  return (



    <main className="main-content rec-main">
      <div className="content-container content-container--grid">
      {/* Top row: welcome + 3 metric cards */}
      <div className="rec-top-row">
        {/* Welcome card */}
        <div className="rec-welcome-card">
          <div className="rec-welcome-text">
            <h2 className="rec-welcome-title">Welcome back, Tarzan! 👋</h2>
            <p className="rec-welcome-sub">Here's an overview of your activity</p>
          </div>
          <button className="rec-new-post-btn" onClick={onCreatePost}>+ New Post</button>
        </div>

        {/* Metric cards wrapper */}
        <div className="rec-stats-row">
          {/* Metric: Total Views */}
          <div className="rec-metric-card">
            <span className="rec-metric-label mobile-only">Total Views</span>
            <div className="rec-metric-icon desktop-only">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="rec-metric-value desktop-only">{totalViews}</span>
            <span className="rec-metric-label desktop-only">Total Views</span>

            {/* Mobile view layout */}
            <div className="rec-metric-value-row mobile-only">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
              <span className="rec-metric-value">{totalViews}</span>
            </div>
            <span className="rec-metric-sub desktop-only">Across all posts</span>
          </div>

          {/* Metric: Total Posts */}
          <div className="rec-metric-card">
            <span className="rec-metric-label mobile-only">Total Posts</span>
            <div className="rec-metric-icon desktop-only">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <span className="rec-metric-value desktop-only">{totalPosts}</span>
            <span className="rec-metric-label desktop-only">Total Posts</span>

            {/* Mobile view layout */}
            <div className="rec-metric-value-row mobile-only">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
              </svg>
              <span className="rec-metric-value">{totalPosts}</span>
            </div>

            <div className="rec-posts-stats desktop-only">
              <span>{draftCount} Draft</span><span className="rec-stat-dot" /><span>{closedCount} Closed</span>
            </div>
            <div className="rec-posts-stats-mobile mobile-only">
              <div className="rec-posts-stats-mobile-row">
                <span><span className="stat-num">{activeCount}</span>Active</span>
                <span><span className="stat-num">{draftCount}</span>Draft</span>
              </div>
              <div><span className="stat-num">{closedCount}</span>Archived</div>
            </div>
          </div>

          {/* Metric: Applications */}
          <div className="rec-metric-card">
            <span className="rec-metric-label mobile-only">Applications</span>
            <div className="rec-metric-icon desktop-only">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <span className="rec-metric-value desktop-only">{totalApplications}</span>
            <span className="rec-metric-label desktop-only">Applications</span>

            {/* Mobile view layout */}
            <div className="rec-metric-value-row mobile-only">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
              <span className="rec-metric-value">{totalApplications}</span>
            </div>
            <span className="rec-metric-sub desktop-only">Recent received</span>
          </div>
        </div>
      </div>

      {/* Middle grid: Recent Applications + Top Posts + Recent Chats */}
      <div className="rec-mid-grid">
     {/* Recent Applications */}
<div className="rec-panel-card">
  <div className="rec-panel-header">
    <span className="rec-panel-title">Recent Applications</span>
    <button className="rec-see-all">See all →</button>
  </div>
  {applications.length === 0 ? (
    <div className="rec-empty-panel">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
      </svg>
      <span className="rec-empty-text">No applications yet</span>
    </div>
  ) : (
    <ul className="rec-app-list">
  {applications.slice(0, 5).map((app) => (
    <li key={app.applicationId} className="rec-app-row">
      <div className="rec-app-item">
        <div className="rec-app-info">
          <p className="rec-app-name">{app.applicantName}</p>
          <p className="rec-app-sub">
            Applied to <span className="rec-app-job">{app.jobTitle}</span> · {app.status}
          </p>
        </div>
      <div className="rec-app-actions">
        <button
          onClick={async (event) => {
            event.stopPropagation();
            const myUid = auth.currentUser?.uid;
            if (!myUid) return;

            const theirUid = app.applicantId;
            if (!theirUid) return;

            const myInfo = {
              name: auth.currentUser?.displayName || "Recruiter",
              initial: (auth.currentUser?.displayName || "R").charAt(0).toUpperCase(),
              job: "Recruiter",
              role: "recruiter",
            };

            const theirInfo = {
              name: app.applicantName || "Applicant",
              initial: (app.applicantName || "A").charAt(0).toUpperCase(),
              job: "Applicant",
              role: "seeker",
            };

            try {
              const convId = await findOrCreateConversation(myUid, myInfo, theirUid, theirInfo);
              const basePath = location.startsWith('/recruiter') ? '/recruiter' : '/seeker';
              navigate(`${basePath}/chat?id=${convId}`);
            } catch (err) {
              console.error("Failed to open chat", err);
            }
          }}
          title="Chat"
          style={{
            background: "none",
            border: "1px solid #E5E7EB",
            borderRadius: "6px",
            color: "#6B7280",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.15s ease",
            padding: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#374151";
            e.currentTarget.style.borderColor = "#D1D5DB";
            e.currentTarget.style.backgroundColor = "#F9FAFB";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#6B7280";
            e.currentTarget.style.borderColor = "#E5E7EB";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
        <button
          onClick={() => {
            setSelectedApplicant(app.applicantProfile);
            setShowApplicantPanel(true);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#7C3AED",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          View profile
        </button>
      </div>
      </div>
    </li>
  ))}
</ul>
  )}
</div>

        {/* Right column: Top Posts + Recent Chats stacked */}
        <div className="rec-right-col">
          <div className="rec-panel-card">
            <div className="rec-panel-header">
              <span className="rec-panel-title">Top Posts</span>
              <button className="rec-see-all">See all →</button>
            </div>
            {jobs.length === 0 ? (
              <div className="rec-empty-panel">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                <span className="rec-empty-text">No posts yet</span>
              </div>
            ) : (
              <div style={{ background: "#F9FAFB", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {jobs.slice(0, 3).map((job) => {
                  const views = job.views ?? 0;
                  const applicants = job.applicants ?? 0;
                  const rate = views > 0 ? ((applicants / views) * 100).toFixed(1) : "0.0";
                  return (
                    <div key={job.id} style={{ background: "#ffffff", borderRadius: "10px", padding: "10px 12px", border: "1px solid #E5E7EB" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontWeight: 700, fontSize: "13px", color: "#111827" }}>{job.title}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#6B7280" }}>
                          <Eye size={13} color="#6B7280" /> {views}
                        </span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#9CA3AF", marginTop: "2px" }}>
                        {applicants} applicants
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                        <div style={{ flex: 1, height: "4px", borderRadius: "999px", background: "#E5E7EB", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${Math.min(100, Number(rate))}%`, background: "#22C55E", borderRadius: "999px" }} />
                        </div>
                        <span style={{ fontSize: "11px", fontWeight: 600, color: "#22C55E" }}>
                          {rate}% applied
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Chats */}
          <div className="rec-panel-card">
            <div className="rec-panel-header">
              <span className="rec-panel-title">Recent Chats</span>
              <button className="rec-see-all">See all →</button>
            </div>
            <div style={{ background: "#F9FAFB", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {REC_CHATS.map((c, i) => (
                <div key={i} className="rec-chat-row" style={{ background: "#ffffff", borderRadius: "10px", padding: "10px 12px", border: "1px solid #E5E7EB" }}>
                  <div className="rec-chat-avatar" style={{ background: "#047857", width: "36px", height: "36px" }}>{c.letter}</div>
                  <div className="rec-chat-info">
                    <span className="rec-chat-name">{c.name}</span>
                    <span className="rec-chat-sub">{c.sub}</span>
                  </div>
                  <span className="rec-chat-arrow">→</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>

      <ApplicantViewPanel
        open={showApplicantPanel}
        applicant={selectedApplicant}
        onClose={() => setShowApplicantPanel(false)}
      />
    </main>
  );
}

// ─── Job Posts Page (Recruiter) ──────────────────────────────────────────

export function JobPostsPage() {
  const [showWizard, setShowWizard] = useState(false);
  const [jobs, setJobs] = useState<PublishedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setJobs([]);
        setIsLoading(false);
        return;
      }

      try {
        const recruiterJobs = await getRecruiterJobs(user.uid);
        const applications = await getApplicationsForRecruiter(user.uid);

        const applicantCounts: Record<string, number> = {};
        applications.forEach((app) => {
          applicantCounts[app.jobId] = (applicantCounts[app.jobId] ?? 0) + 1;
        });

        const jobsWithCounts = recruiterJobs.map((job) => ({
          ...job,
          applicants: applicantCounts[job.id ?? ""] ?? 0,
        }));

        setJobs(jobsWithCounts as unknown as PublishedJob[]);
      } catch {
        setErrorMessage("We couldn't load your posts right now.");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  async function handleToggleJobStatus(jobId: string, currentStatus: string | undefined) {
  const isClosing = currentStatus !== "Closed";
  const newStatus = isClosing ? "Closed" : "Active";
  const confirmMessage = isClosing
    ? "Close this job post? Seekers won't be able to view it anymore."
    : "Reopen this job post? It will be visible to seekers again.";

  const confirmed = window.confirm(confirmMessage);
  if (!confirmed) return;

  try {
    await updateJobStatus(jobId, newStatus);
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId ? { ...job, status: newStatus } : job
      )
    );
  } catch {
    setErrorMessage("We couldn't update this job post. Please try again.");
  }
}


  async function handlePublish(job: PublishedJob) {
    try {
      await createJob({
        title: job.title,
        company: job.companyName,
        location: job.location,
        salary: job.salary,
        employmentType: job.commitment,
        experience: "",
        description: job.description,
        requirements: job.skills,
        benefits: [],
        companyLogo: "",
        commitment: job.commitment,
        workMode: job.workMode,
        skills: job.skills,
        status: job.status,
        views: job.views,
        applicants: job.applicants,
        createdAt: job.createdAt,
      });

      const user = auth.currentUser;
      if (user) {
        const recruiterJobs = await getRecruiterJobs(user.uid);
        setJobs(recruiterJobs as unknown as PublishedJob[]);
      }
      setShowWizard(false);
      setErrorMessage(null);
      setSuccessMessage("Your job was posted successfully.");
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "We couldn't publish your job right now.");
    }
  }

  if (showWizard) {
    return (
      <CreateJobPostWizard
        onBack={() => setShowWizard(false)}
        onPublish={handlePublish}
      />
    );
  }

  return (
    <main className="main-content" style={{ background: "#f0f2f5", minHeight: "100vh", padding: "28px 32px" }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>Job Posts</h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0" }}>
            {jobs.length} {jobs.length === 1 ? "post" : "posts"}
          </p>
        </div>
        <button
          onClick={() => setShowWizard(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#22c55e", color: "#fff", border: "none",
            borderRadius: 999, padding: "10px 20px",
            fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}
        >
          + Create Job Post
        </button>
      </div>

      {errorMessage && (
        <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 12, background: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca", fontSize: 13 }}>
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div style={{ marginBottom: 16, padding: "12px 14px", borderRadius: 12, background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", fontSize: 13 }}>
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: "40px 32px", textAlign: "center", color: "#6B7280" }}>
          Loading your posts...
        </div>
      ) : jobs.length === 0 ? (
        /* ── Empty state ── */
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB",
          padding: "60px 32px", textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏢</div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>No job posts yet</h3>
          <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
            Create your first job post to start hiring.
          </p>
          <button
            onClick={() => setShowWizard(true)}
            style={{
              background: "#22c55e", color: "#fff", border: "none",
              borderRadius: 999, padding: "11px 28px",
              fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}
          >
            + Create Job Post
          </button>
        </div>
      ) : (
        /* ── Dashboard table (desktop) + Mobile card list ── */
        <>
        {/* Mobile card list — hidden on desktop via CSS */}
        <div className="mobile-card-list">
          {jobs.map((job) => {
            const badgeClass =
              job.status === "Active"
                ? "mobile-card__badge mobile-card__badge--active"
                : job.status === "Closed"
                ? "mobile-card__badge mobile-card__badge--closed"
                : "mobile-card__badge mobile-card__badge--draft";
            return (
              <div key={job.id} className="mobile-card">
                {/* Top row: title + badge */}
                <div className="mobile-card__top">
                  <div>
                    <p className="mobile-card__title">{job.title}</p>
                    <p className="mobile-card__meta">
                      {job.location}{job.commitment && job.commitment !== "—" ? ` · ${job.commitment}` : ""}
                    </p>
                  </div>
                  <span className={badgeClass}>
                    <span className="mobile-card__badge-dot">●</span>
                    {job.status}
                  </span>
                </div>

                {/* Stats row */}
                <div className="mobile-card__stats">
                  <div className="mobile-card__stat">
                    <span className="mobile-card__stat-label">Views</span>
                    <span className="mobile-card__stat-value">{job.views ?? 0}</span>
                  </div>
                  <div className="mobile-card__stat">
                    <span className="mobile-card__stat-label">Applicants</span>
                    <span className="mobile-card__stat-value">{job.applicants ?? 0}</span>
                  </div>
                  <div className="mobile-card__stat">
                    <span className="mobile-card__stat-label">Posted</span>
                    <span className="mobile-card__stat-value">{job.postedDate ?? "—"}</span>
                  </div>
                </div>

                {/* Action icons */}
                <div className="mobile-card__actions">
                  {[
                    { icon: <Eye size={15} />, title: "View" },
                    { icon: <Pencil size={15} />, title: "Edit" },
                    { icon: <Share2 size={15} />, title: "Share" },
                    {
                      icon: job.status === "Closed" ? <RotateCcw size={15} /> : <Ban size={15} />,
                      title: job.status === "Closed" ? "Reopen" : "Close",
                    },
                  ].map(({ icon, title }) => (
                    <button
                      key={title}
                      title={title}
                      className="mobile-card__action-btn"
                      onClick={
                        title === "Close" || title === "Reopen"
                          ? () => handleToggleJobStatus(job.id ?? "", job.status)
                          : undefined
                      }
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop table — hidden on mobile via CSS */}
        <div className="job-posts-table" style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", overflow: "hidden" }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 80px 100px 120px 100px",
            padding: "12px 20px",
            borderBottom: "1px solid #E5E7EB",
            background: "#F9FAFB",
          }}>
            {["JOB", "STATUS", "VIEWS", "APPLICANTS", "POSTED", "ACTIONS"].map((h) => (
              <span key={h} style={{ fontSize: 11, fontWeight: 600, color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {h}
              </span>
            ))}
          </div>

          {/* Table rows */}
          {jobs.map((job, idx) => (
            <div
              key={job.id}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 80px 100px 120px 100px",
                padding: "16px 20px",
                alignItems: "center",
                borderBottom: idx < jobs.length - 1 ? "1px solid #F3F4F6" : "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Job title + meta */}
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: 0 }}>{job.title}</p>
                <p style={{ fontSize: 12, color: "#6B7280", margin: "2px 0 0" }}>
                  {job.location}{job.commitment && job.commitment !== "—" ? ` · ${job.commitment}` : ""}
                </p>
              </div>

              {/* Status badge */}
      <div>
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 5,
    background: job.status === "Active" ? "#f0fdf4" : job.status === "Closed" ? "#fef2f2" : "#fef9f0",
    color: job.status === "Active" ? "#16a34a" : job.status === "Closed" ? "#b91c1c" : "#d97706",
    border: `1px solid ${job.status === "Active" ? "#bbf7d0" : job.status === "Closed" ? "#fecaca" : "#fde68a"}`,
    borderRadius: 999, padding: "4px 12px",
    fontSize: 12, fontWeight: 600,
  }}>
    <span style={{ fontSize: 8 }}>●</span>
    {job.status}
  </span>
</div>

              {/* Views */}
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{job.views}</span>

              {/* Applicants */}
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{job.applicants}</span>

              {/* Posted date */}
              <span style={{ fontSize: 13, color: "#6B7280" }}>{job.postedDate}</span>

{/* Actions */}
<div style={{ display: "flex", gap: 8 }}>
{[
  { icon: <Eye size={16} />, title: "View" },
  { icon: <Pencil size={16} />, title: "Edit" },
  { icon: <Share2 size={16} />, title: "Share" },
  {
    icon: job.status === "Closed" ? <RotateCcw size={16} /> : <Ban size={16} />,
    title: job.status === "Closed" ? "Reopen" : "Close",
  },
].map(({ icon, title }) => (
  <button
    key={title}
    title={title}
    onClick={
      title === "Close" || title === "Reopen"
        ? () => handleToggleJobStatus(job.id ?? "", job.status)
        : undefined
    }
    style={{
      background: "none", border: "none", cursor: "pointer",
      fontSize: 15, padding: "4px",
      borderRadius: 6, transition: "background 0.15s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F4F6")}
    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
  >
    {icon}
  </button>
))}
</div>
            </div>
          ))}
        </div>
        </>
      )}
    </main>
  );
}