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
        const role = profile?.role ?? "seeker";
        if (role !== "recruiter") {
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
    <div className="page-shell">
      <div className="page-header">
        <button className="profile-edit-close" type="button" onClick={() => navigate("/recruiter/home")}>← Back</button>
        <div>
          <h1 className="page-title">Company Profile</h1>
          <p className="page-subtitle">Create or update your recruiter company profile.</p>
        </div>
      </div>

      <form className="profile-edit-form" onSubmit={handleSubmit}>
        <div className="profile-edit-section">
          <h4 className="profile-edit-section-title">Company details</h4>
          <div className="profile-edit-grid">
            <div className="profile-edit-field profile-edit-field-full">
              <label className="profile-edit-label">Company logo URL</label>
              <input
                className="profile-edit-input"
                type="text"
                value={form.logo}
                onChange={(event) => updateField("logo", event.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="profile-edit-field profile-edit-field-full">
              <label className="profile-edit-label">Company name *</label>
              <input
                className="profile-edit-input"
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                required
              />
            </div>
            <div className="profile-edit-field profile-edit-field-full">
              <label className="profile-edit-label">About the company</label>
              <textarea
                className="profile-edit-textarea"
                rows={5}
                value={form.description}
                onChange={(event) => updateField("description", event.target.value)}
              />
            </div>
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
              <label className="profile-edit-label">Company size</label>
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
              <label className="profile-edit-label">Website</label>
              <input
                className="profile-edit-input"
                type="url"
                value={form.website}
                onChange={(event) => updateField("website", event.target.value)}
                placeholder="https://"
              />
            </div>
            <div className="profile-edit-field">
              <label className="profile-edit-label">Headquarters</label>
              <input
                className="profile-edit-input"
                type="text"
                value={form.headquarters}
                onChange={(event) => updateField("headquarters", event.target.value)}
              />
            </div>
            <div className="profile-edit-field">
              <label className="profile-edit-label">Founded year</label>
              <input
                className="profile-edit-input"
                type="number"
                min="1800"
                max={new Date().getFullYear().toString()}
                value={form.foundedYear}
                onChange={(event) => updateField("foundedYear", event.target.value)}
              />
            </div>
            <div className="profile-edit-field">
              <label className="profile-edit-label">Company email</label>
              <input
                className="profile-edit-input"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </div>
            <div className="profile-edit-field">
              <label className="profile-edit-label">Company phone</label>
              <input
                className="profile-edit-input"
                type="text"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </div>
          </div>
        </div>

        {error && <p className="profile-edit-error">{error}</p>}
        {success && <p className="profile-edit-success">{success}</p>}

        <div className="profile-edit-actions">
          <button className="profile-edit-save-btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save company profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
