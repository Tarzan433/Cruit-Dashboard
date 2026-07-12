import { CompanyAvatar } from "./ui/CompanyAvatar";

export type JobCardData = {
  id: string;
  recruiterId?: string;
  title: string;
  company?: string;
  companyId?: string | null;
  companyLogo?: string;
  companyColor?: string;
  location: string;
  posted: string;
  salary: string;
  tags: string[];
  description?: string;
  views?: number;
  bullets?: string[];
  experience?: string;
  category?: string;
  workMode?: string;
  applicationDeadline?: string;
  skills?: string[];
  requirements?: string[];
  responsibilities?: string[];
  benefits?: string[];
  companyDescription?: string;
};

type JobCardProps = {
  job: JobCardData;
  onClick?: () => void;
  onApply?: () => void;
  onToggleSave: () => void;
  isSaved: boolean;
  isSaving?: boolean;
  isApplied?: boolean;
  isApplying?: boolean;
  showApplyButton?: boolean;
  showCompany?: boolean;
  onViewCompany?: (companyId: string) => void;
};

export function JobCard({
  job,
  onClick,
  onApply,
  onToggleSave,
  isSaved,
  isSaving = false,
  isApplied = false,
  isApplying = false,
  showApplyButton = true,
  showCompany = true,
  onViewCompany,
}: JobCardProps) {
  return (
    <div className="home-job-card" onClick={onClick}>
      <div className="home-job-card-inner">
        <div className="home-job-top">
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              {showCompany && job.company ? (
                <CompanyAvatar
                  companyLogo={job.companyLogo}
                  companyName={job.company}
                  companyColor={job.companyColor}
                  size={36}
                />
              ) : null}
              <h3 className="home-job-title">{job.title}</h3>
            </div>
            {showCompany && job.company ? (
              job.companyId ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    if (onViewCompany && job.companyId) {
                      onViewCompany(job.companyId);
                    }
                  }}
                  style={{
                    marginTop: -4,
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: "#7C3AED",
                    textDecoration: "underline",
                    cursor: "pointer",
                    textAlign: "left",
                    fontFamily: "inherit",
                    fontSize: "13px",
                    fontWeight: 500,
                    alignSelf: "flex-start",
                  }}
                >
                  View company
                </button>
              ) : (
                <span className="job-company" style={{ marginTop: -4 }}>{job.company}</span>
              )
            ) : null}
          </div>

          <button
            className="job-save-btn"
            title={isSaved ? "Saved" : "Save job"}
            onClick={(event) => {
              event.stopPropagation();
              onToggleSave();
            }}
            disabled={isSaving}
            style={{
              opacity: isSaving ? 0.7 : 1,
              color: isSaved ? "#16A34A" : undefined,
              borderColor: isSaved ? "#BBF7D0" : undefined,
              background: isSaved ? "#F0FDF4" : undefined,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>

        <div className="home-job-tags">
          {job.tags.map((tag) => (
            <span key={tag} className="home-tag">{tag}</span>
          ))}
        </div>

        <p className="home-job-desc">{job.description ?? "Apply now to learn more about this opportunity."}</p>

        <div className="home-job-meta">
          <span className="home-meta-item">{job.location}</span>
          <span className="home-meta-item">{job.posted}</span>
          <span className="home-meta-salary">{job.salary}</span>
        </div>

        {showApplyButton && onApply ? (
          <button
            className="apply-btn"
            onClick={(event) => {
              event.stopPropagation();
              onApply();
            }}
            disabled={isApplied || isApplying}
            style={{
              opacity: isApplied || isApplying ? 0.7 : 1,
              cursor: isApplied || isApplying ? "default" : "pointer",
            }}
          >
            {isApplying ? "Applying..." : isApplied ? "Applied ✓" : "Apply now"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
