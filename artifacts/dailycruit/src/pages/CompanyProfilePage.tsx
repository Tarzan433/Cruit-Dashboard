import { useEffect, useState, type FormEvent } from "react";
import { useLocation } from "wouter";
import { auth, db } from "../firebase/firebase";
import { collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getUserProfile, updateUserProfile, type ProfileData } from "../services/profile";
import type { Company } from "../models/company";

const COMPANY_SIZE_OPTIONS = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5000+",
];

const INDUSTRY_OPTIONS = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Other",
];

export default function CompanyProfilePage() {
  const [location, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState({
    logo: "",
    name: "",
    description: "",
    industry: "",
    size: "",
    website: "",
    headquarters: "",
    foundedYear: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    let cancelled = false;

    async function loadCompanyProfile() {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        const profile = await getUserProfile(currentUser.uid);
        const activeMode = profile?.activeMode ?? "jobseeker";
        if (activeMode !== "recruiter") {
          navigate("/");
          return;
        }

        if (!cancelled) {
          setUserProfile(profile ?? null);
          setCompanyId(profile?.companyId ?? null);
        }

        if (profile?.companyId) {
          const companyRef = doc(db, "companies", profile.companyId);
          const companySnapshot = await getDoc(companyRef);

          if (companySnapshot.exists() && !cancelled) {
            const data = companySnapshot.data() as Company;
            setForm({
              logo: data.logo ?? "",
              name: data.name,
              description: data.description ?? "",
              industry: data.industry ?? "",
              size: data.size ?? "",
              website: data.website ?? "",
              headquarters: data.headquarters ?? "",
              foundedYear: data.foundedYear?.toString() ?? "",
              email: data.email ?? "",
              phone: data.phone ?? "",
            });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load company profile.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCompanyProfile();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  function updateField<Field extends keyof typeof form>(field: Field, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.name.trim()) {
      setError("Company name is required.");
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError("You must be signed in to save a company profile.");
      return;
    }

    setSaving(true);

    const payload = {
      logo: form.logo.trim() || null,
      name: form.name.trim(),
      description: form.description.trim() || null,
      industry: form.industry.trim() || null,
      size: form.size.trim() || null,
      website: form.website.trim() || null,
      headquarters: form.headquarters.trim() || null,
      foundedYear: form.foundedYear.trim() ? Number(form.foundedYear.trim()) : null,
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
    } as Omit<Company, "createdBy" | "createdAt">;

    try {
      if (companyId) {
        const companyRef = doc(db, "companies", companyId);
        const companySnapshot = await getDoc(companyRef);

        if (companySnapshot.exists()) {
          await updateDoc(companyRef, payload);
        } else {
          await setDoc(companyRef, {
            ...payload,
            createdAt: serverTimestamp(),
            createdBy: currentUser.uid,
          });
        }
      } else {
        const companyRef = doc(collection(db, "companies"));
        await setDoc(companyRef, {
          ...payload,
          createdAt: serverTimestamp(),
          createdBy: currentUser.uid,
        });
        await updateUserProfile(currentUser.uid, {
          companyId: companyRef.id,
        });
        setCompanyId(companyRef.id);
      }

      setSuccess("Company profile saved successfully.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save company profile.";
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-title">Company Profile</div>
        <p>Loading company profile…</p>
      </div>
    );
  }

  return (
    <main className="main-content profile-main">
      {/* Back button */}
      <button 
        className="profile-back-btn" 
        type="button" 
        onClick={() => navigate("/recruiter/home")}
        style={{ marginBottom: "16px" }}
      >
        ← Back
      </button>

      {/* Header Card (Mirrors Personal Profile header) */}
      <div className="profile-header-card" style={{ marginBottom: "24px" }}>
        <div className="profile-header-left">
          <div className="profile-photo-wrapper">
            {form.logo ? (
              <img src={form.logo} alt="Company Logo" className="profile-avatar-photo" />
            ) : (
              <div className="profile-avatar-lg">
                {form.name ? form.name.charAt(0).toUpperCase() : "C"}
              </div>
            )}
            <button
              className="profile-photo-pencil"
              type="button"
              onClick={() => {
                const url = prompt("Enter Company Logo URL:", form.logo);
                if (url !== null) updateField("logo", url);
              }}
              title="Change company logo URL"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
              </svg>
            </button>
          </div>
          <div className="profile-info-block">
            <h2 className="profile-name">{form.name || "Company Name"}</h2>
            <div className="profile-meta-line">
              <span>{form.industry || "No Industry Specified"}</span>
              <span className="meta-dot">•</span>
              <span>{form.size ? `${form.size} employees` : "Size not set"}</span>
            </div>
            {form.website ? (
              <a 
                href={form.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="profile-handle" 
                style={{ color: "var(--brand-color, #7c3aed)", textDecoration: "underline", display: "inline-block", marginTop: "4px" }}
              >
                {form.website}
              </a>
            ) : (
              <span className="profile-handle">No website set</span>
            )}
            <span className="profile-seeker-badge">Recruiter Mode</span>
          </div>
        </div>
      </div>

      {/* Form and sectioned layout */}
      <form onSubmit={handleSubmit} className="profile-edit-form" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Main profile card, mirroring .profile-main-card */}
        <div className="profile-main-card" style={{ padding: "8px 0" }}>
          
          {/* Section: About */}
          <section className="profile-section">
            <h4 className="section-title">About the Company</h4>
            
            <div className="profile-edit-grid" style={{ marginTop: "16px" }}>
              <div className="profile-edit-field profile-edit-field-full">
                <label className="profile-edit-label">Company Name *</label>
                <input
                  className="profile-edit-input"
                  type="text"
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  required
                  placeholder="Enter company name"
                />
              </div>

              <div className="profile-edit-field profile-edit-field-full">
                <label className="profile-edit-label">Website URL</label>
                <input
                  className="profile-edit-input"
                  type="url"
                  value={form.website}
                  onChange={(event) => updateField("website", event.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="profile-edit-field profile-edit-field-full">
                <label className="profile-edit-label">Company Description</label>
                <textarea
                  className="profile-edit-textarea"
                  rows={5}
                  value={form.description}
                  onChange={(event) => updateField("description", event.target.value)}
                  placeholder="Describe your company's mission, values, and work..."
                />
              </div>
            </div>
          </section>

          <div className="section-divider" />

          {/* Section: Details */}
          <section className="profile-section">
            <h4 className="section-title">Company Details</h4>
            
            <div className="profile-edit-grid" style={{ marginTop: "16px" }}>
              <div className="profile-edit-field">
                <label className="profile-edit-label">Industry</label>
                <select
                  className="profile-edit-input"
                  value={form.industry}
                  onChange={(event) => updateField("industry", event.target.value)}
                >
                  <option value="">Select industry</option>
                  {INDUSTRY_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="profile-edit-field">
                <label className="profile-edit-label">Company Size</label>
                <select
                  className="profile-edit-input"
                  value={form.size}
                  onChange={(event) => updateField("size", event.target.value)}
                >
                  <option value="">Select size</option>
                  {COMPANY_SIZE_OPTIONS.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="profile-edit-field">
                <label className="profile-edit-label">Headquarters</label>
                <input
                  className="profile-edit-input"
                  type="text"
                  value={form.headquarters}
                  onChange={(event) => updateField("headquarters", event.target.value)}
                  placeholder="e.g. San Francisco, CA"
                />
              </div>

              <div className="profile-edit-field">
                <label className="profile-edit-label">Founded Year</label>
                <input
                  className="profile-edit-input"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear().toString()}
                  value={form.foundedYear}
                  onChange={(event) => updateField("foundedYear", event.target.value)}
                  placeholder="e.g. 2015"
                />
              </div>
            </div>
          </section>

          <div className="section-divider" />

          {/* Section: Contact Information */}
          <section className="profile-section">
            <h4 className="section-title">Contact Information</h4>
            
            <div className="profile-edit-grid" style={{ marginTop: "16px" }}>
              <div className="profile-edit-field">
                <label className="profile-edit-label">Company Email</label>
                <input
                  className="profile-edit-input"
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="info@company.com"
                />
              </div>

              <div className="profile-edit-field">
                <label className="profile-edit-label">Company Phone</label>
                <input
                  className="profile-edit-input"
                  type="text"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </section>
        </div>

        {error && <p className="profile-edit-error" style={{ margin: "0 4px" }}>{error}</p>}
        {success && <p className="profile-edit-success" style={{ margin: "0 4px" }}>{success}</p>}

        <div className="profile-edit-actions" style={{ marginTop: "8px", justifyContent: "flex-end" }}>
          <button className="profile-edit-save-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save company profile"}
          </button>
        </div>
      </form>
    </main>
  );
}
