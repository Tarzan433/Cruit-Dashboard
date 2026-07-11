
// ─── Imports ─────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { CreateJobPostWizard, PublishedJob } from "../components/CreateJobPostWizard";
import { auth } from "../firebase/firebase";
import { createJob, getRecruiterJobs } from "../services/jobService";
import { onAuthStateChanged } from "firebase/auth";


// ─── Recruiter Home Page ──────────────────────────────────────────────────────

const REC_CHATS = [
  { letter: "M", name: "Muhammed Faris", sub: "No messages yet" },
  { letter: "M", name: "Muhammed Faris", sub: "No messages yet" },
  { letter: "M", name: "Muhammed Faris", sub: "No messages yet" },
];

export function RecruiterHomePage({ onCreatePost }: { onCreatePost: () => void }) {
  return (
    <main className="main-content rec-main">
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

        {/* Metric: Total Views */}
        <div className="rec-metric-card">
          <div className="rec-metric-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span className="rec-metric-value">0</span>
          <span className="rec-metric-label">Total Views</span>
          <span className="rec-metric-sub">Across all posts</span>
        </div>

        {/* Metric: Total Posts */}
        <div className="rec-metric-card">
          <div className="rec-metric-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <span className="rec-metric-value">0</span>
          <span className="rec-metric-label">Total Posts</span>
          <div className="rec-posts-stats">
            <span>0 Active</span><span className="rec-stat-dot" /><span>0 Draft</span><span className="rec-stat-dot" /><span>0 Archived</span>
          </div>
        </div>

        {/* Metric: Applications */}
        <div className="rec-metric-card">
          <div className="rec-metric-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <span className="rec-metric-value">0</span>
          <span className="rec-metric-label">Applications</span>
          <span className="rec-metric-sub">Recent received</span>
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
          <div className="rec-empty-panel">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="rec-empty-text">No applications yet</span>
          </div>
        </div>

        {/* Right column: Top Posts + Recent Chats stacked */}
        <div className="rec-right-col">
          <div className="rec-panel-card">
            <div className="rec-panel-header">
              <span className="rec-panel-title">Top Posts</span>
              <button className="rec-see-all">See all →</button>
            </div>
            <div className="rec-empty-panel">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="rec-empty-text">No posts yet</span>
            </div>
          </div>

          {/* Recent Chats */}
          <div className="rec-panel-card">
            <div className="rec-panel-header">
              <span className="rec-panel-title">Recent Chats</span>
              <button className="rec-see-all">See all →</button>
            </div>
            <ul className="rec-chat-list">
              {REC_CHATS.map((c, i) => (
                <li key={i} className="rec-chat-row">
                  <div className="rec-chat-avatar">{c.letter}</div>
                  <div className="rec-chat-info">
                    <span className="rec-chat-name">{c.name}</span>
                    <span className="rec-chat-sub">{c.sub}</span>
                  </div>
                  <span className="rec-chat-arrow">→</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Job Posts Page (Recruiter) ───────────────────────────────────────────────

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
        setJobs(recruiterJobs as unknown as PublishedJob[]);
      } catch {
        setErrorMessage("We couldn't load your posts right now.");
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
        /* ── Dashboard table ── */
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", overflow: "hidden" }}>
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
                  background: job.status === "Active" ? "#f0fdf4" : "#fef9f0",
                  color: job.status === "Active" ? "#16a34a" : "#d97706",
                  border: `1px solid ${job.status === "Active" ? "#bbf7d0" : "#fde68a"}`,
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
                  { icon: "👁", title: "View" },
                  { icon: "✏", title: "Edit" },
                  { icon: "🔗", title: "Share" },
                ].map(({ icon, title }) => (
                  <button
                    key={title}
                    title={title}
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
      )}
    </main>
  );
}