import { useEffect, useRef } from "react";
import { CompanyAvatar } from "./ui/CompanyAvatar";
import { useLocation } from "wouter";
import { auth } from "../firebase/firebase";
import { findOrCreateConversation } from "../services/chatService";
import type { JobCardData } from "./JobCard";
import { useTrackJobView } from "../hooks/useTrackJobView";

type JobDetailsDrawerProps = {
  job: JobCardData;
  onClose: () => void;
  onApply: () => void;
  isApplied: boolean;
  isApplying: boolean;
  isSaved: boolean;
  isSaving: boolean;
  onToggleSave: () => void;
  isOwner?: boolean;
};

export function JobDetailsDrawer({
  job,
  onClose,
  onApply,
  isApplied,
  isApplying,
  isSaved,
  isSaving,
  onToggleSave,
  isOwner = false,
}: JobDetailsDrawerProps) {
  const [location, navigate] = useLocation();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const bullets = job.bullets && job.bullets.length > 0
    ? job.bullets
    : job.description
      ? [job.description]
      : ["Apply now to learn more about this opportunity."];

  const hasViews = typeof job.views === "number" && job.views >= 0;
  const viewText = hasViews ? `${job.views} views` : "";
  const locationText = job.location || "";

  const employmentTypeTag = job.tags?.[0];
  const workModeTag = job.workMode || job.tags?.find((tag) => /remote|hybrid|on-site|onsite/i.test(tag));
  const tagItems = [employmentTypeTag, workModeTag].filter(Boolean) as string[];

  useTrackJobView(job.id, isOwner);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const previousActive = document.activeElement as HTMLElement | null;
    drawerRef.current?.focus();
    return () => previousActive?.focus();
  }, []);

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />
      <aside
        className="job-sidebar"
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-details-title"
        aria-describedby="job-details-description"
        ref={drawerRef}
        tabIndex={-1}
      >
        <header className="drawer-header">
          <div className="drawer-header-main">
            {job.company ? (
              <CompanyAvatar
                companyName={job.company}
                companyLogo={job.companyLogo}
                companyColor={job.companyColor}
                size={48}
              />
            ) : (
              <div className="drawer-logo-placeholder" />
            )}
            <div className="drawer-header-text">
              <h2 id="job-details-title">{job.title}</h2>
              {job.company ? <p className="drawer-company-name">{job.company}</p> : null}
            </div>
          </div>

          <div className="drawer-header-actions">
            <button
              className="drawer-bookmark-btn"
              title="Chat"
              onClick={async (event) => {
                event.stopPropagation();
                
                const myUid = auth.currentUser?.uid;
                if (!myUid) return;
                
                const theirUid = job.recruiterId || job.companyId;
                if (!theirUid) return;
                
                const myInfo = {
                  name: auth.currentUser?.displayName || "Applicant",
                  initial: (auth.currentUser?.displayName || "A").charAt(0).toUpperCase(),
                  job: "Applicant",
                  role: "seeker",
                };
                
                const theirInfo = {
                  name: job.company || "Company",
                  initial: (job.company || "C").charAt(0).toUpperCase(),
                  job: "Recruiter",
                  role: "recruiter",
                };
                
                try {
                  const convId = await findOrCreateConversation(myUid, myInfo, theirUid, theirInfo);
                  const basePath = location.startsWith('/recruiter') ? '/recruiter' : '/seeker';
                  navigate(`${basePath}/chat?id=${convId}`);
                } catch (err) {
                  console.error("Failed to open chat", err);
                }
              }}
              aria-label="Open chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </button>
            <button
              className={`drawer-bookmark-btn${isSaved ? " saved" : ""}`}
              title={isSaved ? "Saved" : "Save job"}
              onClick={(event) => {
                event.stopPropagation();
                onToggleSave();
              }}
              disabled={isSaving}
              aria-pressed={isSaved}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" fill="none" />
              </svg>
            </button>
            <button className="drawer-close-btn" onClick={onClose} aria-label="Close job details">
              ×
            </button>
          </div>
        </header>

        <section className="drawer-meta-row" aria-label="Job location and views">
          {locationText ? (
            <span className="drawer-meta-item">
              <span className="drawer-meta-icon" aria-hidden="true">📍</span>
              {locationText}
            </span>
          ) : null}
          {hasViews ? (
            <>
              {locationText ? <span className="drawer-meta-separator" aria-hidden="true">·</span> : null}
              <span className="drawer-meta-item">
                <span className="drawer-meta-icon" aria-hidden="true">👁</span>
                {viewText}
              </span>
            </>
          ) : null}
        </section>

        <section className="drawer-stats-grid" aria-label="Quick stats">
          <div className="drawer-stat-card drawer-stat-card--salary">
            <span className="stat-label">Salary</span>
            <span className="stat-value">{job.salary || "Not specified"}</span>
          </div>
          <div className="drawer-stat-card">
            <span className="stat-label">Posted</span>
            <span className="stat-value">{job.posted || "N/A"}</span>
          </div>
        </section>

        {tagItems.length > 0 ? (
          <section className="drawer-tag-row" aria-label="Employment tags">
            {tagItems.map((tag) => (
              <span key={tag} className="drawer-tag-pill">{tag}</span>
            ))}
          </section>
        ) : null}

        <section className="drawer-section">
          <div className="drawer-section-heading">
            <h3>Description</h3>
          </div>
          <p id="job-details-description" className="drawer-section-text">
            {job.description || "This position offers an exciting opportunity to join the team and contribute to meaningful projects."}
          </p>
        </section>

        <div className="drawer-footer-spacer" />

        <div className="drawer-footer" aria-label="Job actions">
          <button
            className={`drawer-apply-btn${isApplied ? " applied" : ""}`}
            onClick={onApply}
            disabled={isApplied || isApplying}
          >
            {isApplying ? "Applying..." : isApplied ? "Applied ✓" : "Apply now"}
          </button>
        </div>
      </aside>
    </>
  );
}
