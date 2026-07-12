import { useEffect, useState, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import type { Company } from "../models/company";
import { CompanyAvatar } from "./ui/CompanyAvatar";

interface CompanyViewPanelProps {
  companyId: string;
  onClose: () => void;
}

export function CompanyViewPanel({ companyId, onClose }: CompanyViewPanelProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchCompany() {
      setLoading(true);
      setError(null);
      try {
        const companyRef = doc(db, "companies", companyId);
        const snapshot = await getDoc(companyRef);
        if (snapshot.exists()) {
          if (active) {
            setCompany(snapshot.data() as Company);
          }
        } else {
          if (active) {
            setError("Company not found.");
          }
        }
      } catch (err) {
        if (active) {
          setError("Failed to load company details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    fetchCompany();
    return () => {
      active = false;
    };
  }, [companyId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />
      <aside
        className="job-sidebar"
        role="dialog"
        aria-modal="true"
        ref={panelRef}
        tabIndex={-1}
        style={{ outline: "none" }}
      >
        <header className="drawer-header">
          <div className="drawer-header-main">
            {company ? (
              <CompanyAvatar
                companyName={company.name}
                companyLogo={company.logo || undefined}
                size={48}
              />
            ) : (
              <div className="drawer-logo-placeholder" />
            )}
            <div className="drawer-header-text">
              <h2>{company ? company.name : "Company Details"}</h2>
              {company?.website ? (
                <p className="drawer-company-name">
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: "inherit", textDecoration: "underline" }}
                  >
                    {company.website.replace(/^https?:\/\/(www\.)?/, "")}
                  </a>
                </p>
              ) : null}
            </div>
          </div>

          <div className="drawer-header-actions">
            <button className="drawer-close-btn" onClick={onClose} aria-label="Close company details">
              ×
            </button>
          </div>
        </header>

        {loading && (
          <section className="drawer-section">
            <p className="drawer-section-text">Loading company information...</p>
          </section>
        )}

        {error && (
          <section className="drawer-section">
            <p className="drawer-section-text" style={{ color: "#EF4444" }}>{error}</p>
          </section>
        )}

        {!loading && !error && company && (
          <>
            {/* Quick stats grid */}
            <section className="drawer-stats-grid" aria-label="Company details stats" style={{ marginTop: "16px" }}>
              <div className="drawer-stat-card">
                <span className="stat-label">INDUSTRY</span>
                <span className="stat-value">{company.industry || "N/A"}</span>
              </div>
              <div className="drawer-stat-card">
                <span className="stat-label">SIZE</span>
                <span className="stat-value">{company.size ? `${company.size}` : "N/A"}</span>
              </div>
            </section>

            <section className="drawer-stats-grid" aria-label="Company location stats" style={{ marginTop: "12px" }}>
              <div className="drawer-stat-card">
                <span className="stat-label">HEADQUARTERS</span>
                <span className="stat-value">{company.headquarters || "N/A"}</span>
              </div>
              <div className="drawer-stat-card">
                <span className="stat-label">FOUNDED</span>
                <span className="stat-value">{company.foundedYear || "N/A"}</span>
              </div>
            </section>

            <section className="drawer-stats-grid" aria-label="Company contact stats" style={{ marginTop: "12px", marginBottom: "16px" }}>
              <div className="drawer-stat-card">
                <span className="stat-label">EMAIL</span>
                <span className="stat-value" style={{ wordBreak: "break-all" }}>{company.email || "N/A"}</span>
              </div>
              <div className="drawer-stat-card">
                <span className="stat-label">PHONE</span>
                <span className="stat-value">{company.phone || "N/A"}</span>
              </div>
            </section>

            {/* Description */}
            <section className="drawer-section" style={{ borderTop: "1px solid #F3F4F6", paddingTop: "20px" }}>
              <div className="drawer-section-heading">
                <h3>About the Company</h3>
              </div>
              <p className="drawer-section-text" style={{ whiteSpace: "pre-wrap" }}>
                {company.description || "No description provided."}
              </p>
            </section>
          </>
        )}
      </aside>
    </>
  );
}
