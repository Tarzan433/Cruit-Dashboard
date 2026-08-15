// ─── marginBottom ──────────────────────────────────────────────────
import { useState, useRef, useEffect } from "react";

// The 6 steps shown in the progress bar
const STEPS = ["Type", "Details", "Location", "Terms", "Requirements", "Review"];

// The two job-type options on step 1
type JobType = "standard" | "mappin" | null;

export interface PublishedJob {
  id: string;
  title: string;
  companyName: string;
  description: string;
  location: string;
  salary: string;
  commitment: string;
  workMode: string;
  skills: string[];
  status: "Active" | "Paused" | "Draft" | "Closed";
  views: number;
  applicants: number;
  postedDate: string;
  createdAt: number;
}

interface Props {
  onBack: () => void;
  onPublish: (job: PublishedJob) => Promise<void> | void;
}

type WorkType = "remote" | "hybrid" | "onsite";

export function CreateJobPostWizard({ onBack, onPublish }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedType, setSelectedType] = useState<JobType>(null);

  // Step 2 state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  // Step 3 — Location state
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [address, setAddress] = useState("");
  const [workType, setWorkType] = useState<WorkType>("onsite");

  // Step 4 — Terms state
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryType, setSalaryType] = useState("");
  const [commitment, setCommitment] = useState<string | null>(null);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [contractDuration, setContractDuration] = useState("");

  // Step 5 — Requirements state
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<string | null>(null);
  const [education, setEducation] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState("");
  const [certifications, setCertifications] = useState("");

  // Step 6 — Publish state
  const [published, setPublished] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Stepper scroll refs — auto-scroll active step into view on mobile
  const stepperScrollRef = useRef<HTMLDivElement>(null);
  const stepItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const container = stepperScrollRef.current;
    const el = stepItemRefs.current[currentStep];
    if (!container || !el) return;
    const targetScrollLeft = el.offsetLeft - container.clientWidth / 2 + el.offsetWidth / 2;
    container.scrollTo({ left: Math.max(0, targetScrollLeft), behavior: "smooth" });
  }, [currentStep]);

  function buildPublishedJob(status: "Active" | "Draft" = "Active"): PublishedJob {
    const now = Date.now();
    const today = new Date(now).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

    return {
      id: now.toString(),
      title: title || "Untitled Job",
      companyName: "Your Company",
      description: description || "An exciting opportunity posted on DailyCruit.",
      location: [city, country].filter(Boolean).join(", ") || workType,
      salary: salaryMin
  ? `€${salaryMin}${salaryType ? ` / ${salaryType}` : ""}`
  : "—",
      commitment: commitment || "—",
      workMode: workType,
      skills: [...skills],
      status,
      views: 0,
      applicants: 0,
      postedDate: today,
      createdAt: now,
    };
  }

  function validateRequiredFields() {
    const errors: string[] = [];

    if (!selectedType) {
      errors.push("Please choose a job type.");
    }
    if (!title.trim()) {
      errors.push("Add a job title.");
    }
    if (!description.trim()) {
      errors.push("Add a job description.");
    }
    if (!city.trim()) {
      errors.push("Add the city where the job is based.");
    }
    if (!salaryType) {
      errors.push("Select a salary type.");
    }
    if (!commitment) {
      errors.push("Choose a commitment type.");
    }

    return errors;
  }

   async function handlePublishNow() {
    const validationErrors = validateRequiredFields();
    if (validationErrors.length > 0) {
      setPublishError(validationErrors[0]);
      setShowErrors(true);
      return;
    }

    setPublishError(null);
    setIsPublishing(true);

    try {
      await onPublish(buildPublishedJob());
      setPublished(true);
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : "We couldn't publish your job right now. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  }

  async function handleSaveDraft() {
    setPublishError(null);
    setIsPublishing(true);
    try {
      await onPublish(buildPublishedJob("Draft"));
      setPublished(true);
    } catch (error) {
      setPublishError(error instanceof Error ? error.message : "We couldn't save your draft. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  }

  // Derived: is the Continue button disabled for the current step?
  const continueDisabled =
    (currentStep === 0 && selectedType === null) ||
    (currentStep === 1 && (!title.trim() || !description.trim())) ||
    (currentStep === 2 && !city.trim()) ||
    (currentStep === 3 && (!salaryType || !commitment));

  // Keyboard: Enter on any <input> (not textarea/button) fires the primary action
  function handleFormKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Enter") return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag !== "INPUT") return;
    e.preventDefault();
    if (currentStep < STEPS.length - 1) {
      handleContinue();
    } else if (currentStep === STEPS.length - 1 && !published) {
      handlePublishNow();
    }
  }

  //Continue button logic
  function handleContinue() {
  if (currentStep === 1) {
    if (!title.trim() || !description.trim()) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
  }
  if (currentStep === 2) {
    if (!city.trim()) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
  }
  if (currentStep === 3) {
    if (!salaryType || !commitment) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
  }
  if (currentStep < STEPS.length - 1) {
    setCurrentStep((s) => s + 1);
  }
}

function handleAddTag() {
  const t = tagInput.trim();
  if (t && !tags.includes(t)) {
    setTags((prev) => [...prev, t]);
  }
  setTagInput("");
}

  return (
    <main className="main-content wizard-shell">
      {/* ── Back link ── */}
      <button
        onClick={onBack}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "none", border: "none", cursor: "pointer",
          color: "#4B5563", fontSize: 14, fontWeight: 500, marginBottom: 16,
        }}
      >
        ← Job Posts
      </button>
      <div className="content-container wizard-card" onKeyDown={handleFormKeyDown}>
        {/* ── Page header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 2 }}>
            YOU'RE CREATING
          </p>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", margin: 0 }}>New Job Post</h2>
        </div>
      </div>

      {/* ── Step progress bar ── */}
      <div
        ref={stepperScrollRef}
        className="wizard-stepper-scroll"
        style={{ width: "100%", overflowX: "auto", marginBottom: 24 }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 0, minWidth: "max(100%, 360px)" }}>
        {STEPS.map((label, i) => {
          const isDone = i < currentStep;
          const isActive = i === currentStep;
          return (
            <div
              key={label}
              ref={(el) => { stepItemRefs.current[i] = el; }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: 60 }}
            >
              {/* circle + connecting line row */}
              <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                {/* left line */}
                {i > 0 && (
                  <div style={{
                    flex: 1, height: 2,
                    background: isDone || isActive ? "#22c55e" : "#E5E7EB",
                    transition: "background 0.3s",
                  }} />
                )}
                {/* circle */}
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: isActive || isDone ? "#22c55e" : "#E5E7EB",
                  color: isActive || isDone ? "#fff" : "#9CA3AF",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, flexShrink: 0,
                  transition: "background 0.3s",
                }}>
                  {isDone ? "✓" : i + 1}
                </div>
                {/* right line */}
                {i < STEPS.length - 1 && (
                  <div style={{
                    flex: 1, height: 2,
                    background: isDone ? "#22c55e" : "#E5E7EB",
                    transition: "background 0.3s",
                  }} />
                )}
              </div>
              {/* label */}
              <span style={{
                marginTop: 4, fontSize: 11, fontWeight: isActive ? 700 : 500,
                color: isActive ? "#111827" : "#9CA3AF",
                textAlign: "center", whiteSpace: "nowrap",
              }}>
                {label}
              </span>
            </div>
          );
        })}
        </div> {/* closes inner flex row */}
      </div> {/* closes stepper scroll container */}

      {/* ── Step content ── */}
      <div style={{ width: "100%" }}>

        {/* STEP 1 — Type */}
        {currentStep === 0 && (
          <>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
              What type of job post?
            </h3>
            <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 16 }}>
              Choose how candidates will find this job
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {/* Standard option */}
              <button
                onClick={() => setSelectedType("standard")}
                style={{
                  border: selectedType === "standard" ? "2px solid #22c55e" : "1.5px solid #E5E7EB",
                  background: selectedType === "standard" ? "#f0fdf4" : "#fff",
                  borderRadius: 12, padding: "16px 14px", textAlign: "left",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: "#dcfce7",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10,
                }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </div>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#22c55e", marginBottom: 4 }}>Standard</p>
                <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
                  Appears in the jobs feed with text location
                </p>
              </button>
            

              {/* Map Pin option */}
              <button
                onClick={() => setSelectedType("mappin")}
                style={{
                  border: selectedType === "mappin" ? "2px solid #22c55e" : "1.5px solid #E5E7EB",
                  background: selectedType === "mappin" ? "#f0fdf4" : "#fff",
                  borderRadius: 12, padding: "16px 14px", textAlign: "left",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: "#f3f4f6",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10,
                }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <p style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 4 }}>Map Pin</p>
                <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5, margin: 0 }}>
                  Pinned on the map — visible to nearby candidates
                </p>
              </button>
            </div>
          </>
        )}


        {/* STEP 2 — Job Details */}
{currentStep === 1 && (
  <div>
    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 20 }}>
      Job Details
    </h3>

    {/* Job Title */}
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>
        Job Title *
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Senior Barista"
        style={{
          width: "100%", padding: "12px 14px", fontSize: 14,
          border: showErrors && !title.trim() ? "1.5px solid #ef4444" : "1.5px solid #E5E7EB",
          borderRadius: 10, outline: "none", background: "#fff",
          transition: "border 0.15s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => e.target.style.borderColor = "#22c55e"}
        onBlur={(e) => e.target.style.borderColor = showErrors && !title.trim() ? "#ef4444" : "#E5E7EB"}
      />
      {showErrors && !title.trim() && (
        <p style={{ color: "#ef4444", fontSize: 12, marginTop: 5 }}>Title is required</p>
      )}
    </div>

    {/* Description */}
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>
        Description *
      </label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe the role, responsibilities and expectations..."
        rows={5}
        style={{
          width: "100%", padding: "12px 14px", fontSize: 14,
          border: showErrors && !description.trim() ? "1.5px solid #ef4444" : "1.5px solid #E5E7EB",
          borderRadius: 10, outline: "none", background: "#fff", resize: "vertical",
          fontFamily: "inherit", transition: "border 0.15s",
          boxSizing: "border-box",
        }}
        onFocus={(e) => e.target.style.borderColor = "#22c55e"}
        onBlur={(e) => e.target.style.borderColor = showErrors && !description.trim() ? "#ef4444" : "#E5E7EB"}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        {showErrors && !description.trim()
          ? <p style={{ color: "#ef4444", fontSize: 12, margin: 0 }}>Description is required</p>
          : <span />
        }
        <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: "auto" }}>
          {description.length} chars
        </span>
      </div>
    </div>

    {/* Remote Job Toggle */}
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: "#fff", border: "1.5px solid #E5E7EB", borderRadius: 10,
      padding: "14px 16px", marginBottom: 20,
    }}>
      <div>
        <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", margin: 0 }}>Remote Job</p>
        <p style={{ fontSize: 12, color: "#6B7280", margin: "2px 0 0" }}>Skip location step if fully remote</p>
      </div>
      <button
        onClick={() => setIsRemote((v) => !v)}
        style={{
          width: 44, height: 24, borderRadius: 999, border: "none",
          background: isRemote ? "#22c55e" : "#D1D5DB",
          cursor: "pointer", position: "relative", transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <span style={{
          position: "absolute", top: 3,
          left: isRemote ? 23 : 3,
          width: 18, height: 18, borderRadius: "50%",
          background: "#fff", transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </button>
    </div>

    {/* Tags */}
    <div style={{ marginBottom: 8 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>
        Tags
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
          placeholder="e.g. barista, coffee, hospital"
          style={{
            flex: 1, padding: "11px 14px", fontSize: 14,
            border: "1.5px solid #E5E7EB", borderRadius: 10,
            outline: "none", fontFamily: "inherit",
          }}
          onFocus={(e) => e.target.style.borderColor = "#22c55e"}
          onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
        />
        <button
          onClick={handleAddTag}
          style={{
            padding: "11px 20px", background: "#111827", color: "#fff",
            border: "none", borderRadius: 10, fontWeight: 700,
            fontSize: 14, cursor: "pointer",
          }}
        >
          Add
        </button>
      </div>
      {/* Tag chips */}
      {tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {tags.map((tag) => (
            <span key={tag} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#f0fdf4", border: "1px solid #bbf7d0",
              color: "#15803d", fontSize: 12, fontWeight: 600,
              padding: "4px 10px", borderRadius: 999,
            }}>
              {tag}
              <button
                onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#15803d", fontSize: 14, lineHeight: 1, padding: 0,
                }}
              >×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
)}

        {/* STEP 3 — Location */}
{currentStep === 2 && (
  <div>
    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 20 }}>
      Location
    </h3>

    {/* Country + City row */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
      {/* Country */}
      <div>
        <label style={{
          display: "block", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.08em", color: "#6B7280",
          textTransform: "uppercase", marginBottom: 6,
        }}>Country</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          placeholder="Italy"
          style={{
            width: "100%", height: 44, padding: "0 14px", fontSize: 14,
            border: "1.5px solid #E5E7EB", borderRadius: 10,
            outline: "none", background: "#fff",
            boxSizing: "border-box", fontFamily: "inherit",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#22c55e";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#E5E7EB";
          }}
        />
      </div>

      {/* City */}
      <div>
        <label style={{
          display: "block", fontSize: 11, fontWeight: 700,
          letterSpacing: "0.08em", color: "#6B7280",
          textTransform: "uppercase", marginBottom: 6,
        }}>
          City <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Milan"
          style={{
            width: "100%", height: 44, padding: "0 14px", fontSize: 14,
            border: "1.5px solid #E5E7EB", borderRadius: 10,
            outline: "none", background: "#fff",
            boxSizing: "border-box", fontFamily: "inherit",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#22c55e";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "#E5E7EB";
          }}
        />
        <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 5, margin: "5px 0 0" }}>
          Enter the city where the job is based
        </p>
        {showErrors && !city.trim() && (
          <p style={{ color: "#ef4444", fontSize: 12, marginTop: 5 }}>City is required</p>
        )}
      </div>
    </div>

    {/* State / Region */}
    <div style={{ marginBottom: 16 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.08em", color: "#6B7280",
        textTransform: "uppercase", marginBottom: 6,
      }}>State / Region <span style={{ fontSize: 10, fontWeight: 500, textTransform: "none", color: "#9CA3AF" }}>(optional)</span></label>
      <input
        type="text"
        value={stateRegion}
        onChange={(e) => setStateRegion(e.target.value)}
        placeholder="e.g. Lombardy"
        style={{
          width: "100%", height: 44, padding: "0 14px", fontSize: 14,
          border: "1.5px solid #E5E7EB", borderRadius: 10,
          outline: "none", background: "#fff",
          boxSizing: "border-box", fontFamily: "inherit",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#22c55e";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#E5E7EB";
        }}
      />
    </div>

    {/* Address */}
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.08em", color: "#6B7280",
        textTransform: "uppercase", marginBottom: 6,
      }}>Address</label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Via Roma 1"
        style={{
          width: "100%", height: 44, padding: "0 14px", fontSize: 14,
          border: "1.5px solid #E5E7EB", borderRadius: 10,
          outline: "none", background: "#fff",
          boxSizing: "border-box", fontFamily: "inherit",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#22c55e";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#E5E7EB";
        }}
      />
    </div>

    {/* Work Type toggle */}
    <div style={{ marginBottom: 8 }}>
      <label style={{
        display: "block", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.08em", color: "#6B7280",
        textTransform: "uppercase", marginBottom: 8,
      }}>Work Type</label>
      <div style={{ display: "flex", gap: 8 }}>
        {(["remote", "hybrid", "onsite"] as WorkType[]).map((wt) => {
          const labels: Record<WorkType, string> = { remote: "Remote", hybrid: "Hybrid", onsite: "On-site" };
          const active = workType === wt;
          return (
            <button
              key={wt}
              onClick={() => setWorkType(wt)}
              style={{
                flex: 1, padding: "10px 0", fontSize: 13, fontWeight: 600,
                borderRadius: 999, cursor: "pointer",
                border: active ? "2px solid #22c55e" : "1.5px solid #E5E7EB",
                background: active ? "#f0fdf4" : "#fff",
                color: active ? "#16a34a" : "#6B7280",
                transition: "all 0.15s",
              }}
            >
              {labels[wt]}
            </button>
          );
        })}
      </div>
    </div>
  </div>
)}

{/* STEP 4 — Terms */}
{currentStep === 3 && (
  <div>
    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 20 }}>Job Terms</h3>

    {/* Row 1: Salary + Salary Type */}
    <div style={{ marginBottom: 20 }}>
  <div className="wizard-salary-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, alignItems: "end" }}>
    {/* Salary Amount */}
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>
        SALARY
      </label>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: 14, pointerEvents: "none" }}>€</span>
        <input
          type="number"
          value={salaryMin}
          onChange={(e) => setSalaryMin(e.target.value)}
          placeholder="15"
          style={{
            width: "100%", height: 44, padding: "0 14px 0 28px", fontSize: 14,
            border: "1.5px solid #E5E7EB", borderRadius: 10,
            outline: "none", background: "#fff",
            boxSizing: "border-box", fontFamily: "inherit",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#22c55e"}
          onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
        />
      </div>
    </div>

    {/* Salary Type */}
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>
        SALARY TYPE <span style={{ color: "#ef4444" }}>*</span>
      </label>
      <div style={{ position: "relative" }}>
        <select
          value={salaryType}
          onChange={(e) => setSalaryType(e.target.value)}
          style={{
            width: "100%", height: 44, padding: "0 36px 0 14px", fontSize: 14,
            border: "1.5px solid #E5E7EB", borderRadius: 10,
            outline: "none", background: "#fff",
            boxSizing: "border-box", fontFamily: "inherit",
            appearance: "none", cursor: "pointer",
            color: salaryType ? "#111827" : "#9CA3AF",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#22c55e"}
          onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
        >
          <option value="" disabled>Select...</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="fixed">Fixed</option>
        </select>
        <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  </div>
  {showErrors && !salaryType && (
    <p style={{ color: "#ef4444", fontSize: 12, marginTop: 5 }}>Salary type is required</p>
  )}
</div>

    {/* Commitment */}
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 8 }}>
        COMMITMENT <span style={{ color: "#ef4444" }}>*</span>
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        {["full-time", "part-time", "one-time"].map((opt) => {
          const active = commitment === opt;
          return (
            <button
              key={opt}
              onClick={() => setCommitment(active ? null : opt)}
              style={{
                padding: "8px 20px", fontSize: 13, fontWeight: 600,
                borderRadius: 999, cursor: "pointer",
                border: active ? "2px solid #22c55e" : "1.5px solid #E5E7EB",
                background: active ? "#f0fdf4" : "#fff",
                color: active ? "#16a34a" : "#6B7280",
                transition: "all 0.15s",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {showErrors && !commitment && (
        <p style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>Choose a commitment type</p>
      )}
    </div>

    {/* Benefits */}
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 8 }}>
        BENEFITS
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {["Health Insurance", "Remote Work", "Flexible Hours", "Stock Options", "Paid Leave", "Bonus"].map((b) => {
          const selected = benefits.includes(b);
          return (
            <button
              key={b}
              onClick={() => setBenefits((prev) => selected ? prev.filter((x) => x !== b) : [...prev, b])}
              style={{
                padding: "8px 16px", fontSize: 13, fontWeight: 600,
                borderRadius: 999, cursor: "pointer",
                border: selected ? "none" : "1.5px solid #E5E7EB",
                background: selected ? "#22c55e" : "#fff",
                color: selected ? "#fff" : "#6B7280",
                transition: "all 0.15s",
              }}
            >
              {b}
            </button>
          );
        })}
      </div>
    </div>

    {/* Start Date + Contract Duration */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 8 }}>
      {/* Start Date */}
      <div>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>
          START DATE
        </label>
        <input
          type="text"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          placeholder="e.g. Immediately or 2024-09-01"
          style={{
            width: "100%", height: 44, padding: "0 14px", fontSize: 14,
            border: "1.5px solid #E5E7EB", borderRadius: 10,
            outline: "none", background: "#fff",
            boxSizing: "border-box", fontFamily: "inherit",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#22c55e"}
          onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
        />
      </div>

      {/* Contract Duration */}
      <div>
        <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>
          CONTRACT DURATION
        </label>
        <div style={{ position: "relative" }}>
          <select
            value={contractDuration}
            onChange={(e) => setContractDuration(e.target.value)}
            style={{
              width: "100%", height: 44, padding: "0 36px 0 14px", fontSize: 14,
              border: "1.5px solid #E5E7EB", borderRadius: 10,
              outline: "none", background: "#fff",
              boxSizing: "border-box", fontFamily: "inherit",
              appearance: "none", cursor: "pointer",
              color: contractDuration ? "#111827" : "#9CA3AF",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#22c55e"}
            onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
          >
            <option value="" disabled>Select...</option>
            <option value="permanent">Permanent</option>
            <option value="3months">3 months</option>
            <option value="6months">6 months</option>
            <option value="1year">1 year</option>
            <option value="project">Project-based</option>
          </select>
          <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  </div>
)}

{/* STEP 5 — Requirements */}
{currentStep === 4 && (
  <div>
    <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 4 }}>Requirements</h3>
    <p
      style={{ fontSize: 13, color: "#9CA3AF", fontStyle: "italic", marginBottom: 20, marginTop: 0 }}
      className="font-bold text-[color:var(--auth-input-focus-border)]">
      All optional — you can skip this step
    </p>

    {/* Skills */}
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>
        SKILLS REQUIRED
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const t = skillInput.trim();
              if (t && !skills.includes(t)) setSkills((p) => [...p, t]);
              setSkillInput("");
            }
          }}
          placeholder="e.g. React, Photoshop, Excel..."
          style={{
            flex: 1, height: 44, padding: "0 14px", fontSize: 14,
            border: "1.5px solid #E5E7EB", borderRadius: 10,
            outline: "none", background: "#fff", fontFamily: "inherit",
            transition: "border-color 0.15s", boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "#22c55e"}
          onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
        />
        <button
          onClick={() => {
            const t = skillInput.trim();
            if (t && !skills.includes(t)) setSkills((p) => [...p, t]);
            setSkillInput("");
          }}
          style={{
            padding: "0 18px", height: 44, background: "#111827", color: "#fff",
            border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}
        >Add</button>
      </div>
      {skills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {skills.map((s) => (
            <span key={s} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#22c55e", color: "#fff",
              fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999,
            }}>
              {s}
              <button onClick={() => setSkills((p) => p.filter((x) => x !== s))}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>

    {/* Experience Level */}
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 8 }}>
        EXPERIENCE LEVEL
      </label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["Internship", "Junior", "Mid-level", "Senior"].map((lvl) => {
          const active = experienceLevel === lvl;
          return (
            <button
              key={lvl}
              onClick={() => setExperienceLevel(active ? null : lvl)}
              style={{
                padding: "8px 18px", fontSize: 13, fontWeight: 600,
                borderRadius: 999, cursor: "pointer",
                border: active ? "none" : "1.5px solid #E5E7EB",
                background: active ? "#22c55e" : "#fff",
                color: active ? "#fff" : "#6B7280",
                transition: "all 0.15s",
              }}
            >{lvl}</button>
          );
        })}
      </div>
    </div>

    {/* Education */}
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>
        EDUCATION
      </label>
      <div style={{ position: "relative" }}>
        <select
          value={education}
          onChange={(e) => setEducation(e.target.value)}
          style={{
            width: "100%", height: 44, padding: "0 36px 0 14px", fontSize: 14,
            border: "1.5px solid #E5E7EB", borderRadius: 10,
            outline: "none", background: "#fff", fontFamily: "inherit",
            appearance: "none", cursor: "pointer",
            color: education ? "#111827" : "#9CA3AF",
            boxSizing: "border-box", transition: "border-color 0.15s",
          }}
          onFocus={(e) => e.target.style.borderColor = "#22c55e"}
          onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
        >
          <option value="">Any</option>
          <option value="highschool">High School</option>
          <option value="bachelor">Bachelor's Degree</option>
          <option value="master">Master's Degree</option>
          <option value="phd">PhD</option>
        </select>
        <svg style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>

    {/* Languages */}
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>
        LANGUAGES
      </label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          value={languageInput}
          onChange={(e) => setLanguageInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const t = languageInput.trim();
              if (t && !languages.includes(t)) setLanguages((p) => [...p, t]);
              setLanguageInput("");
            }
          }}
          placeholder="e.g. English, Spanish..."
          style={{
            flex: 1, height: 44, padding: "0 14px", fontSize: 14,
            border: "1.5px solid #E5E7EB", borderRadius: 10,
            outline: "none", background: "#fff", fontFamily: "inherit",
            transition: "border-color 0.15s", boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "#22c55e"}
          onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
        />
        <button
          onClick={() => {
            const t = languageInput.trim();
            if (t && !languages.includes(t)) setLanguages((p) => [...p, t]);
            setLanguageInput("");
          }}
          style={{
            padding: "0 18px", height: 44, background: "#111827", color: "#fff",
            border: "none", borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer",
          }}
        >Add</button>
      </div>
      {languages.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {languages.map((l) => (
            <span key={l} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "#22c55e", color: "#fff",
              fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 999,
            }}>
              {l}
              <button onClick={() => setLanguages((p) => p.filter((x) => x !== l))}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
            </span>
          ))}
        </div>
      )}
    </div>

    {/* Certifications */}
    <div style={{ marginBottom: 8 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "#6B7280", textTransform: "uppercase", marginBottom: 6 }}>
        CERTIFICATIONS <span style={{ fontWeight: 500, textTransform: "none", color: "#9CA3AF", fontSize: 10 }}>(optional)</span>
      </label>
      <input
        type="text"
        value={certifications}
        onChange={(e) => setCertifications(e.target.value)}
        placeholder="e.g. AWS Certified, PMP..."
        style={{
          width: "100%", height: 44, padding: "0 14px", fontSize: 14,
          border: "1.5px solid #E5E7EB", borderRadius: 10,
          outline: "none", background: "#fff", fontFamily: "inherit",
          transition: "border-color 0.15s", boxSizing: "border-box",
        }}
        onFocus={(e) => e.target.style.borderColor = "#22c55e"}
        onBlur={(e) => e.target.style.borderColor = "#E5E7EB"}
      />
    </div>
  </div>
)}

        {/* STEP 6 — Review & Publish */}
        {currentStep === STEPS.length - 1 && (
          published ? (
            /* ── Success state ── */
            (<div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", background: "#22c55e",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px", fontSize: 28, color: "#fff",
              }}>✓</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
                Job Post Published! 🎉
              </h3>
              <p style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
                Your job is now live and visible to candidates.
              </p>
              <button
                onClick={onBack}
                style={{
                  display: "block", width: "100%", padding: "13px 0",
                  background: "#22c55e", color: "#fff", border: "none",
                  borderRadius: 999, fontSize: 15, fontWeight: 700, cursor: "pointer",
                  marginBottom: 14,
                }}
              >
                Go to My Jobs
              </button>
              <button
                onClick={() => {
                  setCurrentStep(0);
                  setPublished(false);
                  setSelectedType(null);
                  setTitle(""); setDescription(""); setTags([]);
                }}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#6B7280", fontSize: 13, fontWeight: 500,
                }}
              >
                Create another job post
              </button>
            </div>)
          ) : (
            /* ── Review UI ── */
            (<div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 16 }}>
                Review &amp; Publish
              </h3>
              {/* Job preview card */}
              <div style={{
                background: "#fff", border: "1px solid #E5E7EB",
                borderRadius: 12, padding: 20, marginBottom: 16,
              }}>
                {/* Card header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 0 }}>
                  {/* Logo placeholder */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, background: "#F3F4F6",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-4 0v2" /><line x1="8" y1="12" x2="8" y2="12" /><line x1="16" y1="12" x2="16" y2="12" />
                    </svg>
                  </div>
                  {/* Title + company */}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.3 }}>
                      {title || "Untitled Job"}
                    </p>
                    <p style={{ fontSize: 13, color: "#6B7280", margin: "2px 0 0" }}>Your Company</p>
                  </div>
                  {/* Type badge */}
                  {selectedType && (
                    <span style={{
                      background: "#F3F4F6", color: "#374151",
                      borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 500,
                      whiteSpace: "nowrap", flexShrink: 0,
                    }}>
                      {selectedType === "standard" ? "Standard" : "Map Pin"}
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div style={{ borderTop: "1px solid #E5E7EB", margin: "16px 0" }} />

                {/* Detail rows */}
                {[
                  {
                    icon: "📍",
                    label: "Location",
                    value: [city, country].filter(Boolean).join(", ") || workType,
                  },
                  {
                    icon: "💰",
                    label: "Salary",
                    value: salaryMin
                      ? `€${salaryMin}${salaryType ? ` / ${salaryType}` : ""}`
                      : null,
                  },
                  {
                    icon: "👥",
                    label: "Commitment",
                    value: commitment,
                  },
                  {
                    icon: "🗓",
                    label: "Posted",
                    value: "just-now",
                  },
                ].filter((r) => r.value).map((row) => (
                  <div
                    key={row.label}
                    style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 0", borderBottom: "1px solid #F9FAFB",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ color: "#6B7280", fontSize: 13 }}>
                      {row.icon} {row.label}
                    </span>
                    {row.value === "just-now" ? (
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>Just now</span>
                    ) : (
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", textAlign: "right" }}>
                        {row.value}
                      </span>
                    )}
                  </div>
                ))}

                {/* Skills chips (conditional) */}
                {skills.length > 0 && (
                  <div style={{ paddingTop: 12 }}>
                    <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>🎯 Skills</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {skills.map((s) => (
                        <span key={s} style={{
                          background: "#dcfce7", color: "#166534",
                          borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 600,
                        }}>{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer text */}
                <p style={{ fontSize: 12, color: "#6B7280", textAlign: "center", marginTop: 16, marginBottom: 0 }}>
                  This is how your job post will appear to candidates.
                </p>
              </div>
              {/* Edit links */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", marginBottom: 24 }}>
                {[
                  { label: "Edit Type", step: 0 },
                  { label: "Edit Details", step: 1 },
                  { label: "Edit Location", step: 2 },
                  { label: "Edit Terms", step: 3 },
                ].map(({ label, step }) => (
                  <button
                    key={label}
                    onClick={() => setCurrentStep(step)}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 12, color: "#6B7280", padding: 0,
                      display: "flex", alignItems: "center", gap: 4,
                    }}
                  >
                    ✏ {label}
                  </button>
                ))}
              </div>
              {publishError && (
                <div style={{ marginBottom: 12, padding: "10px 12px", borderRadius: 10, background: "#fef2f2", color: "#b91c1c", fontSize: 13, border: "1px solid #fecaca" }}>
                  {publishError}
                </div>
              )}
              {/* Primary actions */}
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <button
                  onClick={handleSaveDraft}
                  disabled={isPublishing}
                  style={{
                    flex: 1, padding: "13px 0", background: "#fff",
                    color: "#374151", border: "1.5px solid #E5E7EB",
                    borderRadius: 999, fontSize: 14, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Save Draft
                </button>
                <button
                  onClick={handlePublishNow}
                  disabled={isPublishing}
                  style={{
                    flex: 2, padding: "13px 0", background: "#22c55e",
                    color: "#fff", border: "none", borderRadius: 999,
                    fontSize: 14, fontWeight: 700, cursor: "pointer",
                    opacity: isPublishing ? 0.7 : 1,
                  }}
                >
                  {isPublishing ? "Publishing..." : "🚀 Publish"}
                </button>
              </div>
            </div>)
          )
        )}

        {/* ── Navigation buttons (steps 0–4 only; step 6 has its own buttons) ── */}
        {currentStep < STEPS.length - 1 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", gap: 12 }}>
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep((s) => s - 1)}
                  style={{
                    flex: 1, padding: "14px 0", background: "#fff",
                    color: "#374151", border: "1.5px solid #E5E7EB",
                    borderRadius: 999, fontSize: 15, fontWeight: 700, cursor: "pointer",
                  }}
                >
                  Back
                </button>
              )}
              <button
                onClick={handleContinue}
                disabled={currentStep === 0 && selectedType === null}
                style={{
                  flex: 2, padding: "14px 0",
                  background: currentStep === 0 && selectedType === null ? "#86efac" : "#22c55e",
                  color: "#fff", border: "none", borderRadius: 999,
                  fontSize: 15, fontWeight: 700,
                  cursor: currentStep === 0 && selectedType === null ? "not-allowed" : "pointer",
                  transition: "background 0.15s",
                }}
              >
                Continue
              </button>
            </div>
            {currentStep === 4 && (
              <div style={{ textAlign: "center", marginTop: 14 }}>
                <button
                  onClick={() => setCurrentStep(5)}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#9CA3AF", fontSize: 13, fontWeight: 500,
                  }}
                >
                  Skip this step →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 6: Back button below the review card (only when not published) ── */}
        {currentStep === STEPS.length - 1 && !published && (
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              style={{
                width: "100%", padding: "12px 0", background: "#fff",
                border: "1px solid #D1D5DB", borderRadius: 999,
                fontSize: 14, fontWeight: 600, color: "#374151", cursor: "pointer",
              }}
            >
              Back
            </button>
          </div>
        )}
      </div> {/* closes Step content div */}
      </div> {/* closes content-container */}
    </main>
  );
}  