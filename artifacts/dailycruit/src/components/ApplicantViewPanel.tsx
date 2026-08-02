import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { auth } from "../firebase/firebase";
import { findOrCreateConversation } from "../services/chatService";
import {
  X,
  MapPin,
  Mail,
  Phone,
  User,
  Briefcase,
  GraduationCap,
  Link as LinkIcon,
  FileText,
  ExternalLink,
  MessageSquare,
  Star,
  Calendar,
  XCircle,
  Sparkles,
  Globe,
  Linkedin,
  Github,
  Download,
  CheckCircle2,
  UserCheck,
} from "lucide-react";
import type { ProfileData } from "../services/profile";

type ApplicantViewPanelProps = {
  open: boolean;
  onClose: () => void;
  applicant: ProfileData | null;
};

/* -------------------------------------------------------------------------- */
/*  Design tokens (local — keeps your folder structure untouched)             */
/* -------------------------------------------------------------------------- */

const ACCENT = "emerald";

/* -------------------------------------------------------------------------- */
/*  Reusable primitives                                                        */
/* -------------------------------------------------------------------------- */

type LucideIcon = React.ComponentType<{ size?: number; className?: string }>;

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  accent?: "emerald" | "blue" | "violet";
}

const sectionAccent: Record<NonNullable<SectionCardProps["accent"]>, string> = {
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-600/10",
  blue: "bg-blue-50 text-blue-600 ring-blue-600/10",
  violet: "bg-violet-50 text-violet-600 ring-violet-600/10",
};

function SectionCard({
  icon: Icon,
  title,
  children,
  accent = "emerald",
}: SectionCardProps) {
  return (
    <section className="group rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-300 hover:border-zinc-300/60 hover:shadow-[0_8px_24px_-8px_rgba(16,24,40,0.12)]">
      <header className="mb-5 flex items-center gap-3">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ring-1 ring-inset ${sectionAccent[accent]}`}
        >
          <Icon size={17} />
        </span>
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-500">
          {title}
        </h3>
      </header>
      {children}
    </section>
  );
}

interface TimelineItemProps {
  lineColor: string;
  dotColor: string;
  children: React.ReactNode;
}

function TimelineItem({ lineColor, dotColor, children }: TimelineItemProps) {
  return (
    <div className={`ml-1 border-l-2 ${lineColor} py-1 pl-5`}>
      <div className="relative">
        <span
          className={`absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${dotColor} bg-white shadow-sm`}
        />
        <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600">
          {children}
        </p>
      </div>
    </div>
  );
}

interface LinkTileProps {
  href?: string;
  icon: LucideIcon;
  label: string;
  displayUrl?: string;
}

function LinkTile({ href, icon: Icon, label, displayUrl }: LinkTileProps) {
  if (!href) {
    return (
      <div
        aria-disabled="true"
        className="flex flex-col justify-between rounded-xl border border-dashed border-zinc-200 bg-zinc-50/40 p-4 opacity-60"
      >
        <div>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400">
            <Icon size={16} />
          </span>
          <h4 className="mt-3 text-xs font-semibold text-zinc-400">{label}</h4>
          <p className="mt-0.5 text-[11px] text-zinc-400">Not provided</p>
        </div>
        <div className="mt-4 flex items-center justify-end">
          <ExternalLink size={12} className="text-zinc-300" />
        </div>
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2"
    >
      <div>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-600/10">
          <Icon size={16} />
        </span>
        <h4 className="mt-3 text-xs font-semibold text-zinc-900">{label}</h4>
        <p className="mt-0.5 truncate text-[11px] text-zinc-400">{displayUrl}</p>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <ExternalLink size={12} className="text-zinc-400" />
      </div>
    </a>
  );
}

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  variant: "default" | "primary" | "success" | "danger";
  onClick?: () => void;
}

const actionVariants: Record<ActionButtonProps["variant"], string> = {
  default:
    "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 active:bg-zinc-100",
  primary:
    "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 active:bg-zinc-100",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm shadow-emerald-600/20",
  danger:
    "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 active:bg-red-200/80",
};

function ActionButton({ icon: Icon, label, variant, onClick }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40 focus-visible:ring-offset-2 ${actionVariants[variant]}`}
    >
      <Icon size={15} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main panel                                                                 */
/* -------------------------------------------------------------------------- */

export function ApplicantViewPanel({
  open,
  onClose,
  applicant,
}: ApplicantViewPanelProps) {
  const [location, navigate] = useLocation();
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = "applicant-panel-title";

  // Mount animation trigger (preserves original enter/exit transition behavior)
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (open && applicant) {
      t = setTimeout(() => setMounted(true), 50);
    } else {
      setMounted(false);
    }
    return () => {
      if (t) clearTimeout(t);
    };
  }, [open, applicant]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  // Escape-to-close + body scroll lock + focus management
  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, handleKeyDown]);

  if (!open || !applicant) return null;

  const handleMessage = async () => {
    const myUid = auth.currentUser?.uid;
    if (!myUid) return;
    
    const theirUid = applicant.uid;
    if (!theirUid) return;
    
    const myInfo = {
      name: auth.currentUser?.displayName || "Recruiter",
      initial: (auth.currentUser?.displayName || "R").charAt(0).toUpperCase(),
      job: "Recruiter",
      role: "recruiter",
    };
    
    const theirInfo = {
      name: applicant.fullName || "Applicant",
      initial: (applicant.fullName || "A").charAt(0).toUpperCase(),
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
  };

  const initials = applicant.fullName?.charAt(0).toUpperCase() || "?";

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end bg-zinc-900/40 backdrop-blur-sm transition-opacity duration-300 ${
        mounted ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
      role="presentation"
    >
      {/* Drawer shell */}
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex h-full w-full flex-col rounded-l-2xl border-l border-zinc-200/80 bg-white shadow-2xl transition-transform duration-300 ease-out focus:outline-none sm:max-w-[560px] lg:max-w-[720px] ${
          mounted ? "translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ---------------------------------------------------------------- */}
        {/*  HERO HEADER                                                      */}
        {/* ---------------------------------------------------------------- */}
        <header className="relative flex-shrink-0 overflow-hidden border-b border-zinc-200/80 bg-gradient-to-b from-emerald-50/60 via-white to-white">
          {/* decorative glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-200/30 blur-3xl"
          />
          <div className="relative px-7 pt-6 pb-7">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-5">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  {applicant.photoURL ? (
                    <img
                      src={applicant.photoURL}
                      alt={applicant.fullName}
                      className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg ring-1 ring-zinc-200"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-emerald-400 to-emerald-600 text-2xl font-bold text-white shadow-lg ring-1 ring-zinc-200">
                      {initials}
                    </div>
                  )}
                  <span
                    aria-label="Available for work"
                    className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-500 shadow-sm"
                  />
                </div>

                {/* Identity */}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2
                      id={titleId}
                      className="text-2xl font-bold leading-tight tracking-tight text-zinc-900"
                    >
                      {applicant.fullName || "Unknown User"}
                    </h2>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Available for Work
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm font-medium text-zinc-500">
                    {applicant.headline || "Professional"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-400">
                    @{applicant.username || "username"}
                  </p>
                </div>
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="rounded-xl p-2 text-zinc-400 transition-all duration-200 hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
              >
                <X size={20} />
              </button>
            </div>

            {/* Contact row */}
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-600">
              {applicant.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-emerald-600" />
                  {applicant.location}
                </span>
              )}
              {applicant.email && (
                <a
                  href={`mailto:${applicant.email}`}
                  className="flex items-center gap-1.5 transition-colors hover:text-emerald-600"
                >
                  <Mail size={14} className="text-emerald-600" />
                  <span className="truncate">{applicant.email}</span>
                </a>
              )}
              {applicant.phoneNumber && (
                <a
                  href={`tel:${applicant.phoneNumber}`}
                  className="flex items-center gap-1.5 transition-colors hover:text-emerald-600"
                >
                  <Phone size={14} className="text-emerald-600" />
                  {applicant.phoneNumber}
                </a>
              )}
            </div>

            {/* Quick actions */}
            <div className="mt-6 grid grid-cols-4 gap-2.5">
              <ActionButton icon={MessageSquare} label="Message" variant="default" onClick={handleMessage} />
              <ActionButton icon={Star} label="Shortlist" variant="success" />
              <ActionButton icon={UserCheck} label="Hire" variant="default" />
              <ActionButton icon={XCircle} label="Reject" variant="danger" />
            </div>
          </div>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/*  SCROLLABLE BODY                                                  */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex-1 space-y-5 overflow-y-auto bg-zinc-50/60 p-7">
          {/* About */}
          <SectionCard icon={User} title="About">
            <p className="whitespace-pre-line text-[15px] leading-relaxed text-zinc-600">
              {applicant.about ||
                "This applicant hasn't added an introduction yet."}
            </p>
          </SectionCard>

          {/* Skills */}
          <SectionCard icon={Sparkles} title="Skills">
            {applicant.skills && applicant.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {applicant.skills.map((skill) => (
                  <span
                    key={skill}
                    className="cursor-default rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-100/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-400">No skills added.</p>
            )}
          </SectionCard>

          {/* Experience */}
          <SectionCard icon={Briefcase} title="Experience">
            {applicant.experience ? (
              <div className="rounded-xl border border-zinc-200/70 bg-zinc-50/40 p-4">
                <TimelineItem
                  lineColor="border-emerald-500"
                  dotColor="border-emerald-500"
                >
                  {applicant.experience}
                </TimelineItem>
              </div>
            ) : (
              <p className="text-sm text-zinc-400">No experience added.</p>
            )}
          </SectionCard>

          {/* Education */}
          <SectionCard icon={GraduationCap} title="Education" accent="blue">
            {applicant.education ? (
              <TimelineItem
                lineColor="border-blue-500"
                dotColor="border-blue-500"
              >
                {applicant.education}
              </TimelineItem>
            ) : (
              <p className="text-sm text-zinc-400">No education added.</p>
            )}
          </SectionCard>

          {/* Links */}
          <SectionCard icon={LinkIcon} title="Professional Links" accent="violet">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <LinkTile
                href={applicant.portfolio}
                icon={Globe}
                label="Portfolio"
                displayUrl={applicant.portfolio}
              />
              <LinkTile
                href={applicant.linkedin}
                icon={Linkedin}
                label="LinkedIn"
                displayUrl={applicant.linkedin}
              />
              <LinkTile
                href={applicant.github}
                icon={Github}
                label="GitHub"
                displayUrl={applicant.github}
              />
            </div>
          </SectionCard>

          {/* Resume */}
          <SectionCard icon={FileText} title="Resume">
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-gradient-to-b from-zinc-50/60 to-white p-10 text-center transition-colors duration-200 hover:bg-zinc-50/80">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-200/60 bg-white text-zinc-400 shadow-sm">
                <FileText size={22} />
              </div>
              <p className="text-sm font-semibold text-zinc-900">
                Resume coming soon
              </p>
              <p className="mt-1 max-w-[260px] text-xs leading-relaxed text-zinc-400">
                Applicant resume document will be uploaded and accessible here
                once the feature is active.
              </p>
            </div>
          </SectionCard>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/*  STICKY BOTTOM ACTIONS                                            */}
        {/* ---------------------------------------------------------------- */}
        <footer className="flex-shrink-0 border-t border-zinc-200 bg-white/95 px-7 py-4 backdrop-blur">
          <div className="grid grid-cols-4 gap-3">
            <ActionButton icon={XCircle} label="Reject" variant="danger" />
            <ActionButton icon={Star} label="Shortlist" variant="success" />
            <ActionButton icon={UserCheck} label="Hire" variant="default" />
            <ActionButton icon={MessageSquare} label="Message" variant="default" onClick={handleMessage} />
          </div>
        </footer>
      </div>
    </div>
  );
}