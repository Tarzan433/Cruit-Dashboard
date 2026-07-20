import { useEffect, useState } from "react";
import {
  X,
  MapPin,
  Mail,
  Phone,
  User,
  Briefcase,
  GraduationCap,
  Link,
  FileText,
  Code2,
  ExternalLink,
  MessageSquare,
  Star,
  Calendar,
  XCircle,
  Sparkles,
} from "lucide-react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (open && applicant) {
      t = setTimeout(() => setMounted(true), 50);
    } else {
      setMounted(false);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [open, applicant]);

  if (!open || !applicant) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Drawer Shell */}
      <div
        className={`h-full w-full bg-white shadow-2xl rounded-l-2xl border-l border-zinc-200/80 flex flex-col transition-transform duration-300 ease-out sm:max-w-[560px] lg:max-w-[720px] ${
          mounted ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header / Hero Section */}
        <div className="sticky top-0 z-20 bg-white border-b border-zinc-200/80 px-6 py-6 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-5">
              {/* Large Avatar */}
              <div className="relative flex-shrink-0">
                {applicant.photoURL ? (
                  <img
                    src={applicant.photoURL}
                    alt={applicant.fullName}
                    className="h-20 w-20 rounded-full object-cover border-4 border-white shadow-md ring-1 ring-zinc-200"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-emerald-600 text-2xl font-bold text-white shadow-md border-4 border-white ring-1 ring-zinc-200">
                    {applicant.fullName?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                {/* Available for Work Green Dot indicator */}
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-green-500 shadow-sm" />
              </div>

              {/* Profile Details */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-zinc-900 tracking-tight leading-none">
                    {applicant.fullName || "Unknown User"}
                  </h2>
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                    Available for Work
                  </span>
                </div>
                
                <p className="text-xs text-zinc-400 mt-1">
                  @{applicant.username || "username"} • {applicant.headline || "Professional"}
                </p>

                {/* Contact details */}
                <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-500">
                  {applicant.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} className="text-green-600" />
                      {applicant.location}
                    </span>
                  )}
                  {applicant.email && (
                    <a href={`mailto:${applicant.email}`} className="flex items-center gap-1.5 hover:text-green-600 transition-colors">
                      <Mail size={13} className="text-green-600" />
                      {applicant.email}
                    </a>
                  )}
                  {applicant.phoneNumber && (
                    <a href={`tel:${applicant.phoneNumber}`} className="flex items-center gap-1.5 hover:text-green-600 transition-colors">
                      <Phone size={13} className="text-green-600" />
                      {applicant.phoneNumber}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all duration-200"
            >
              <X size={20} />
            </button>
            
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto bg-zinc-50/50 p-6 space-y-5 scrollbar-thin">
          
          {/* About Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="mb-4 flex items-center gap-2">
              <User size={18} className="text-green-600" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                About
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-zinc-600 whitespace-pre-line">
              {applicant.about || "This applicant hasn't added an introduction yet."}
            </p>
          </div>

          {/* Skills Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-green-600" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Skills
              </h3>
            </div>
            {applicant.skills && applicant.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-green-200 bg-green-50 px-3.5 py-1.5 text-xs font-semibold text-green-700 transition hover:border-green-300 hover:bg-green-100/50 shadow-sm cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400">
                No skills added.
              </p>
            )}
          </div>

          {/* Experience Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="mb-4 flex items-center gap-2">
              <Briefcase size={18} className="text-green-600" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Experience
              </h3>
            </div>
            {applicant.experience ? (
              <div className="border-l-2 border-green-500 pl-4 py-1 ml-1">
                <div className="relative">
                  <div className="absolute -left-[23px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-green-500 bg-white" />
                  <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600">
                    {applicant.experience}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-400">
                No experience added.
              </p>
            )}
          </div>

          {/* Education Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="mb-4 flex items-center gap-2">
              <GraduationCap size={18} className="text-green-600" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Education
              </h3>
            </div>
            {applicant.education ? (
              <div className="border-l-2 border-blue-500 pl-4 py-1 ml-1">
                <div className="relative">
                  <div className="absolute -left-[23px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-blue-500 bg-white" />
                  <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600">
                    {applicant.education}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-zinc-400">
                No education added.
              </p>
            )}
          </div>

          {/* Links Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="mb-4 flex items-center gap-2">
              <Link size={18} className="text-green-600" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Professional Links
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Portfolio */}
              {applicant.portfolio ? (
                <a
                  href={applicant.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <div>
                    <span className="text-lg">🌐</span>
                    <h4 className="text-xs font-semibold text-zinc-900 mt-2">Portfolio</h4>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">{applicant.portfolio}</p>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <ExternalLink size={12} className="text-zinc-400" />
                  </div>
                </a>
              ) : (
                <div className="flex flex-col justify-between rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 opacity-50 cursor-not-allowed">
                  <div>
                    <span className="text-lg">🌐</span>
                    <h4 className="text-xs font-semibold text-zinc-400 mt-2">Portfolio</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Not provided</p>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <ExternalLink size={12} className="text-zinc-300" />
                  </div>
                </div>
              )}

              {/* LinkedIn */}
              {applicant.linkedin ? (
                <a
                  href={applicant.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <div>
                    <span className="text-lg">💼</span>
                    <h4 className="text-xs font-semibold text-zinc-900 mt-2">LinkedIn</h4>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">{applicant.linkedin}</p>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <ExternalLink size={12} className="text-zinc-400" />
                  </div>
                </a>
              ) : (
                <div className="flex flex-col justify-between rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 opacity-50 cursor-not-allowed">
                  <div>
                    <span className="text-lg">💼</span>
                    <h4 className="text-xs font-semibold text-zinc-400 mt-2">LinkedIn</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Not provided</p>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <ExternalLink size={12} className="text-zinc-300" />
                  </div>
                </div>
              )}

              {/* GitHub */}
              {applicant.github ? (
                <a
                  href={applicant.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <div>
                    <span className="text-lg">🐙</span>
                    <h4 className="text-xs font-semibold text-zinc-900 mt-2">GitHub</h4>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">{applicant.github}</p>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <ExternalLink size={12} className="text-zinc-400" />
                  </div>
                </a>
              ) : (
                <div className="flex flex-col justify-between rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 opacity-50 cursor-not-allowed">
                  <div>
                    <span className="text-lg">🐙</span>
                    <h4 className="text-xs font-semibold text-zinc-400 mt-2">GitHub</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Not provided</p>
                  </div>
                  <div className="flex items-center justify-end mt-4">
                    <ExternalLink size={12} className="text-zinc-300" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resume Card */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="mb-4 flex items-center gap-2">
              <FileText size={18} className="text-green-600" />
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Resume
              </h3>
            </div>
            
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/30 p-10 text-center flex flex-col items-center justify-center hover:bg-zinc-50/60 transition-colors duration-200">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 mb-3 shadow-sm border border-zinc-200/50">
                <FileText size={20} />
              </div>
              <p className="text-sm font-semibold text-zinc-900">Resume coming soon</p>
              <p className="text-xs text-zinc-400 mt-1 max-w-[240px]">Applicant resume document will be uploaded and accessible here once the feature is active.</p>
            </div>
          </div>

        </div>

        {/* Recruiter Actions */}
        <div className="sticky bottom-0 border-t border-zinc-200 bg-white/95 backdrop-blur px-6 py-4 flex-shrink-0">
          <div className="grid grid-cols-4 gap-3">
            <button
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:border-zinc-300 active:bg-zinc-100 transform hover:-translate-y-0.5 duration-200"
            >
              <MessageSquare size={14} className="text-zinc-500" />
              <span className="hidden sm:inline">Message</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-green-700 active:bg-green-800 transform hover:-translate-y-0.5 duration-200"
            >
              <Star size={14} fill="currentColor" />
              <span className="hidden sm:inline">Shortlist</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white py-3 text-xs font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:border-zinc-300 active:bg-zinc-100 transform hover:-translate-y-0.5 duration-200"
            >
              <Calendar size={14} className="text-zinc-500" />
              <span className="hidden sm:inline">Interview</span>
            </button>

            <button
              className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-xs font-semibold text-red-600 shadow-sm transition hover:bg-red-100 hover:border-red-300 active:bg-red-200/80 transform hover:-translate-y-0.5 duration-200"
            >
              <XCircle size={14} />
              <span className="hidden sm:inline">Reject</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
