import { X, MapPin, Mail, Phone } from "lucide-react";
import type { ProfileData } from "../services/profile";

type ApplicantViewPanelProps = {
  open: boolean;
  onClose: () => void;
  applicant: ProfileData | null;
};

export function ApplicantViewPanel({
  open,
  onClose,
  applicant,
}: ApplicantViewPanelProps) {
  if (!open || !applicant) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <div className="ml-auto h-full w-full max-w-full overflow-y-auto bg-gray-50 shadow-2xl sm:max-w-lg md:max-w-xl lg:max-w-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Applicant Profile
          </h2>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5">

          {/* Hero Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="flex items-start gap-4">

              {applicant.photoURL ? (
                <img
                  src={applicant.photoURL}
                  alt={applicant.fullName}
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-green-100"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-600 to-emerald-500 text-3xl font-bold text-white">
                  {applicant.fullName?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">

                <h3 className="truncate text-xl font-bold text-gray-900">
                  {applicant.fullName || "Unknown User"}
                </h3>

                <p className="truncate text-sm text-gray-500">
                  @{applicant.username || "username"}
                </p>

                <div className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {applicant.headline || "Professional"}
                </div>

              </div>

            </div>
            </div>


            {/* About */}

<div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
    About
  </h3>

  <p className="text-sm leading-7 text-gray-700">
    {applicant.about ||
      "This applicant hasn't added an introduction yet."}
  </p>

</div>


{/* Skills */}

<div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
    Skills
  </h3>

  {applicant.skills && applicant.skills.length > 0 ? (
    <div className="flex flex-wrap gap-2">
      {applicant.skills.map((skill) => (
        <span
          key={skill}
          className="rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700"
        >
          {skill}
        </span>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500">
      No skills added.
    </p>
  )}

</div>

{/* Experience */}

<div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
    Experience
  </h3>

  {applicant.experience ? (
    <div className="rounded-xl border-l-4 border-green-500 bg-gray-50 p-4">
      <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
        {applicant.experience}
      </p>
    </div>
  ) : (
    <p className="text-sm text-gray-500">
      No experience added.
    </p>
  )}

</div>

{/* Education */}

<div className="mt-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
    Education
  </h3>

  {applicant.education ? (
    <div className="rounded-xl border-l-4 border-blue-500 bg-gray-50 p-4">
      <p className="whitespace-pre-line text-sm leading-7 text-gray-700">
        {applicant.education}
      </p>
    </div>
  ) : (
    <p className="text-sm text-gray-500">
      No education added.
    </p>
  )}

</div>

{/* Professional Details */}

<div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

  {/* Links */}
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
      Professional Links
    </h3>

    <div className="space-y-3">

      <a
        href={applicant.portfolio || "#"}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between rounded-xl border p-3 transition hover:bg-gray-50"
      >
        <span>🌐 Portfolio</span>
        <span className="text-sm text-green-600">Open →</span>
      </a>

      <a
        href={applicant.linkedin || "#"}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between rounded-xl border p-3 transition hover:bg-gray-50"
      >
        <span>💼 LinkedIn</span>
        <span className="text-sm text-green-600">Open →</span>
      </a>

      <a
        href={applicant.github || "#"}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-between rounded-xl border p-3 transition hover:bg-gray-50"
      >
        <span>🐙 GitHub</span>
        <span className="text-sm text-green-600">Open →</span>
      </a>

    </div>
  </div>

  {/* Resume */}
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
      Resume
    </h3>

    <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">

      <div className="text-4xl">📄</div>

      <p className="mt-3 text-sm text-gray-600">
        Resume feature coming soon
      </p>

    </div>

  </div>

</div>

      {/* Recruiter Actions */}

<div className="sticky bottom-0 mt-6 border-t border-gray-200 bg-white/95 backdrop-blur p-4">

  <div className="grid grid-cols-2 gap-3">

    <button
      className="rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold transition hover:bg-gray-50"
    >
      💬 Message
    </button>

    <button
      className="rounded-xl bg-green-600 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
    >
      ⭐ Shortlist
    </button>

    <button
      className="rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold transition hover:bg-gray-50"
    >
      📅 Interview
    </button>

    <button
      className="rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
    >
      ❌ Reject
    </button>

  </div>

</div>
</div>   {/* closes p-5 */}

</div>   {/* closes drawer */}

</div>   {/* closes overlay */}

);
}
