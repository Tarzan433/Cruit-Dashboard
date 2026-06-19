import { useState, useEffect, useRef } from "react";

type NavPage = "home" | "search" | "applications" | "chat";

// ─── Icons ────────────────────────────────────────────────────────────────────

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg className="empty-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="26" r="10" stroke="#D1D5DB" strokeWidth="3" />
      <circle cx="54" cy="22" r="8" stroke="#D1D5DB" strokeWidth="3" />
      <path d="M6 60c0-12.15 10.745-22 24-22s24 9.85 24 22" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
      <path d="M54 38c8.284 0 15 6.268 15 14" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function SearchBigIcon() {
  return (
    <svg className="empty-icon" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="34" r="18" stroke="#D1D5DB" strokeWidth="3" />
      <path d="M48 47L62 61" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function LogoIcon() {
  return (
    <div className="logo-icon">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8.5L6.5 12L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function SearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="16.5" y1="16.5" x2="22" y2="22" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="8" y1="12" x2="16" y2="12" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="17" />
      <line x1="9" y1="14.5" x2="15" y2="14.5" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </svg>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

// ─── Chat Icons ───────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function SendArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function BriefcaseSmIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function ChatBubbleEmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M40 8H8a4 4 0 0 0-4 4v20a4 4 0 0 0 4 4h6l4 6 4-6h18a4 4 0 0 0 4-4V12a4 4 0 0 0-4-4z" stroke="#D1D5DB" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Chat data & types ────────────────────────────────────────────────────────

type Message = { id: number; text: string; sent: boolean; time: string };

type Contact = {
  id: number;
  name: string;
  initial: string;
  job: string;
  messages: Message[];
};

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 1,
    name: "Sarah Chen",
    initial: "S",
    job: "Senior Frontend Engineer",
    messages: [
      { id: 1, text: "Hi! I saw your application for the Frontend role at Stripe. Can we schedule a quick call?", sent: false, time: "10:30 AM" },
      { id: 2, text: "Of course! I'm available this Thursday afternoon.", sent: true, time: "10:45 AM" },
      { id: 3, text: "Perfect, I'll send a calendar invite. Looking forward to it!", sent: false, time: "10:47 AM" },
    ],
  },
  {
    id: 2,
    name: "Marcus Reid",
    initial: "M",
    job: "Product Designer",
    messages: [
      { id: 1, text: "Thanks for applying to the Product Designer position at Notion!", sent: false, time: "Yesterday" },
      { id: 2, text: "Thank you for considering my application. Happy to share more about my work.", sent: true, time: "Yesterday" },
    ],
  },
  {
    id: 3,
    name: "Priya Nair",
    initial: "P",
    job: "Backend Engineer (Node.js)",
    messages: [
      { id: 1, text: "We reviewed your profile and we think you'd be a great fit for the Node.js role.", sent: false, time: "Mon" },
    ],
  },
];

// ─── Chat Page ────────────────────────────────────────────────────────────────

function ChatPage({ onBack }: { onBack: () => void }) {
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedContact = contacts.find((c) => c.id === selectedId) ?? null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedContact?.messages.length]);

  function sendMessage() {
    const text = inputValue.trim();
    if (!text || !selectedId) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setContacts((prev) =>
      prev.map((c) =>
        c.id === selectedId
          ? { ...c, messages: [...c.messages, { id: Date.now(), text, sent: true, time }] }
          : c
      )
    );
    setInputValue("");
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div className="chat-layout">
      {/* Left panel */}
      <div className="chat-left">
        <div className="chat-left-header">
          <button className="chat-back-btn" onClick={onBack} title="Back to Home">
            <ArrowLeftIcon />
          </button>
          <h2>Chats</h2>
        </div>

        {contacts.length === 0 ? (
          <div className="chat-list-empty">
            <ChatBubbleEmptyIcon />
            <h4>No chats yet</h4>
            <p>When you message a recruiter or applicant, it will appear here.</p>
          </div>
        ) : (
          <div className="chat-list">
            {contacts.map((contact) => {
              const last = contact.messages[contact.messages.length - 1];
              return (
                <div
                  key={contact.id}
                  className={`chat-item${selectedId === contact.id ? " active" : ""}`}
                  onClick={() => setSelectedId(contact.id)}
                >
                  <div className="chat-avatar">{contact.initial}</div>
                  <div className="chat-item-body">
                    <div className="chat-item-row1">
                      <span className="chat-contact-name">{contact.name}</span>
                      <span className="chat-timestamp">{last?.time}</span>
                    </div>
                    <div className="chat-item-row2">
                      <span className="chat-job-tag">
                        <BriefcaseSmIcon /> {contact.job}
                      </span>
                      <span className="recruiter-badge">RECRUITER</span>
                    </div>
                    <div className="chat-preview">
                      {last?.sent ? "You: " : ""}{last?.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Right panel */}
      <div className="chat-right">
        {!selectedContact ? (
          <div className="chat-right-default">
            <span className="chat-select-pill">Select a chat to start messaging</span>
          </div>
        ) : (
          <div className="chat-window">
            {/* Top bar */}
            <div className="chat-top-bar">
              <div className="chat-top-bar-left">
                <div className="chat-top-avatar">{selectedContact.initial}</div>
                <div className="chat-top-info">
                  <h4>{selectedContact.name}</h4>
                  <div className="chat-top-job">{selectedContact.job}</div>
                </div>
              </div>
              <div className="chat-top-bar-right">
                <button className="chat-action-btn" title="Call"><PhoneIcon /></button>
                <button className="chat-action-btn" title="Video"><VideoIcon /></button>
                <button className="chat-action-btn" title="Info"><InfoIcon /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="chat-messages">
              {selectedContact.messages.map((msg) => (
                <div key={msg.id} className={`message-group ${msg.sent ? "sent" : "received"}`}>
                  <div className="message-bubble">{msg.text}</div>
                  <div className="message-time">{msg.time}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="chat-input-bar">
              <button className="chat-attach-btn" title="Attach file"><PaperclipIcon /></button>
              <input
                className="chat-text-input"
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKey}
              />
              <button
                className="chat-send-btn"
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                title="Send"
              >
                <SendArrowIcon />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Notifications Modal ──────────────────────────────────────────────────────

function NotificationsModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="notif-overlay" onClick={onClose}>
      <div className="notif-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="notif-header">
          <div className="notif-header-left">
            <span className="notif-header-bell">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </span>
            <div className="notif-header-text">
              <h3>Notifications</h3>
              <span>0 unread</span>
            </div>
          </div>
          <button className="notif-close" onClick={onClose} title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="notif-body">
          <span className="notif-bell-emoji">🔔</span>
          <h4>No notifications yet</h4>
          <p>Messages, application status and account updates will appear here.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Generic Modal ────────────────────────────────────────────────────────────

function Modal({ title, message, onClose }: { title: string; message: string; onClose: () => void }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
        </div>
        <h2>{title}</h2>
        <p>{message}</p>
        <button className="modal-close" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}

// ─── Mock job data ─────────────────────────────────────────────────────────────

const MOCK_JOBS = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    company: "Stripe",
    logo: "S",
    logoColor: "#6366F1",
    location: "Remote",
    type: "Full-time",
    posted: "2 days ago",
    salary: "$140k–$180k",
  },
  {
    id: 2,
    title: "Product Designer",
    company: "Notion",
    logo: "N",
    logoColor: "#111827",
    location: "San Francisco, CA",
    type: "Full-time",
    posted: "1 day ago",
    salary: "$120k–$150k",
  },
  {
    id: 3,
    title: "Backend Engineer (Node.js)",
    company: "Linear",
    logo: "L",
    logoColor: "#5B6AD0",
    location: "Hybrid",
    type: "Full-time",
    posted: "3 days ago",
    salary: "$130k–$165k",
  },
  {
    id: 4,
    title: "Data Analyst",
    company: "Figma",
    logo: "F",
    logoColor: "#F24E1E",
    location: "Remote",
    type: "Part-time",
    posted: "Today",
    salary: "$80k–$100k",
  },
];

// ─── Search Jobs Page ─────────────────────────────────────────────────────────

type FilterTag = {
  id: string;
  label: string;
  icon: string;
};

const FILTER_TAGS: FilterTag[] = [
  { id: "all", label: "All", icon: "" },
  { id: "new", label: "New", icon: "↗" },
  { id: "expiring", label: "Expiring", icon: "⏱" },
  { id: "remote", label: "Remote", icon: "" },
  { id: "onsite", label: "On-site", icon: "" },
  { id: "hybrid", label: "Hybrid", icon: "" },
  { id: "fulltime", label: "Full-time", icon: "" },
  { id: "parttime", label: "Part-time", icon: "" },
  { id: "gig", label: "Gig", icon: "" },
];

function JobCard({ job }: { job: typeof MOCK_JOBS[0] }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="job-logo" style={{ background: job.logoColor }}>
          {job.logo}
        </div>
        <div className="job-info">
          <h3 className="job-title">{job.title}</h3>
          <span className="job-company">{job.company}</span>
        </div>
        <button className="job-save-btn" title="Save job">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
      <div className="job-tags">
        <span className="job-tag">
          <MapPinIcon /> {job.location}
        </span>
        <span className="job-tag">
          <BriefcaseIcon style={{ width: 13, height: 13 }} /> {job.type}
        </span>
        <span className="job-tag salary">
          {job.salary}
        </span>
      </div>
      <div className="job-footer">
        <span className="job-posted">
          <ClockIcon /> {job.posted}
        </span>
        <button className="apply-btn">Apply now</button>
      </div>
    </div>
  );
}

function SearchJobsPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const isSearching = query.trim().length >= 2;

  const filteredJobs = MOCK_JOBS.filter((job) => {
    const q = query.toLowerCase();
    const matchesQuery =
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q);

    if (activeFilter === "all") return matchesQuery;
    if (activeFilter === "remote") return matchesQuery && job.location === "Remote";
    if (activeFilter === "onsite") return matchesQuery && job.location !== "Remote" && job.location !== "Hybrid";
    if (activeFilter === "hybrid") return matchesQuery && job.location === "Hybrid";
    if (activeFilter === "fulltime") return matchesQuery && job.type === "Full-time";
    if (activeFilter === "parttime") return matchesQuery && job.type === "Part-time";
    return matchesQuery;
  });

  return (
    <div className="search-page">
      {/* Search bar */}
      <div className="search-bar-wrapper">
        <div className="search-bar">
          <span className="search-bar-icon">
            <SearchIcon size={18} />
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by role, company or location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <button
          className="filter-icon-btn"
          title="Advanced filters"
          onClick={() => setShowFilterModal(true)}
        >
          <FilterIcon />
        </button>
      </div>

      {/* Filter tags */}
      <div className="filter-tags-row">
        {FILTER_TAGS.map((tag) => (
          <button
            key={tag.id}
            className={`filter-tag${activeFilter === tag.id ? " filter-tag-active" : ""}`}
            onClick={() => setActiveFilter(tag.id)}
          >
            {tag.icon && <span className="tag-icon">{tag.icon}</span>}
            {tag.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {!isSearching ? (
        <div className="empty-state search-empty">
          <SearchBigIcon />
          <h2 className="empty-title">Start searching</h2>
          <p className="empty-subtitle">Type at least 2 characters to find jobs</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="empty-state search-empty">
          <SearchBigIcon />
          <h2 className="empty-title">No results found</h2>
          <p className="empty-subtitle">Try a different keyword or adjust your filters</p>
        </div>
      ) : (
        <div className="job-list">
          <p className="results-count">{filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""} found</p>
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {showFilterModal && (
        <Modal
          title="Advanced filters coming soon!"
          message="We're building more powerful filtering options. Check back soon to narrow down your perfect role."
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </div>
  );
}

// ─── Home job data ────────────────────────────────────────────────────────────

type HomeJob = {
  id: number;
  title: string;
  tags: string[];
  description: string;
  location: string;
  date: string;
  salary: string;
  views: number;
  bullets: string[];
};

const HOME_JOBS: HomeJob[] = [
  {
    id: 1,
    title: "🚀 Work From Home Opportunity for Students & Freshers IN",
    tags: ["Full time", "Remote"],
    description:
      "Join a fast-growing startup and build real-world skills from home. Perfect for recent graduates and students looking for flexible remote work.",
    location: "Remote",
    date: "07 Jun 2026",
    salary: "40$/monthly",
    views: 21,
    bullets: [
      "Work flexible hours from the comfort of your home",
      "Gain hands-on experience with real client projects",
      "Mentorship and guidance from senior team members",
      "Weekly pay with performance bonuses",
      "Open to students and freshers with 0–1 year of experience",
    ],
  },
  {
    id: 2,
    title: "💼 Junior React Developer — Remote First Team",
    tags: ["Full time", "Remote"],
    description:
      "We're looking for an entry-level React developer to join our distributed team. Strong JavaScript fundamentals required.",
    location: "Remote",
    date: "10 Jun 2026",
    salary: "120$/monthly",
    views: 43,
    bullets: [
      "Build reusable UI components with React and TypeScript",
      "Collaborate daily with designers and backend engineers",
      "Async-first culture with flexible working hours",
      "Equipment stipend provided on joining",
      "Fast-track growth with quarterly reviews",
    ],
  },
  {
    id: 3,
    title: "📊 Data Entry Specialist — Part Time",
    tags: ["Part time", "Remote"],
    description:
      "Handle structured data entry tasks accurately and efficiently. Great for students who need a steady part-time income.",
    location: "Remote",
    date: "12 Jun 2026",
    salary: "25$/monthly",
    views: 67,
    bullets: [
      "Accurate data entry into spreadsheets and internal tools",
      "2–4 hours per day, Monday to Friday",
      "Training provided — no prior experience needed",
      "Paid weekly via bank transfer or PayPal",
      "Opportunity to grow into a full-time analyst role",
    ],
  },
];

// ─── Profile Dropdown ─────────────────────────────────────────────────────────

const DD_MENU_ITEMS = [
  { icon: "👤", label: "Profile", badge: null },
  { icon: "⚙️", label: "Settings", badge: null },
  { icon: "📖", label: "Instructions", badge: null },
  { icon: "🛍️", label: "Shop", badge: { text: "new", color: "green" } },
  { icon: "📝", label: "Dev Log", badge: { text: "v0.4.8", color: "gray" } },
  { icon: "📲", label: "Install App", badge: { text: "new", color: "green" } },
];

function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    setTimeout(() => document.addEventListener("mousedown", handler), 0);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="profile-dropdown" ref={ref}>
      <div className="profile-dd-header">
        <div className="profile-dd-avatar">T</div>
        <div>
          <div className="profile-dd-name">Tarzan</div>
          <div className="profile-dd-email">tarzan@dailycruit.com</div>
        </div>
      </div>
      <div className="profile-dd-divider" />
      <ul className="profile-dd-list">
        {DD_MENU_ITEMS.map((item) => (
          <li key={item.label} className="profile-dd-item">
            <span className="profile-dd-item-icon">{item.icon}</span>
            <span className="profile-dd-item-label">{item.label}</span>
            {item.badge && (
              <span className={`profile-dd-badge ${item.badge.color === "green" ? "badge-green" : "badge-gray"}`}>
                {item.badge.text}
              </span>
            )}
          </li>
        ))}
      </ul>
      <div className="profile-dd-divider" />
      <button className="profile-dd-logout">
        <span>🚪</span> Log out
      </button>
    </div>
  );
}

// ─── Job Detail Sidebar ───────────────────────────────────────────────────────

function JobDetailSidebar({ job, onClose }: { job: HomeJob; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} />
      <aside className="job-sidebar">
        <div className="job-sidebar-header">
          <h3 className="job-sidebar-title">{job.title}</h3>
          <button className="job-sidebar-close" onClick={onClose} title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="job-sidebar-stats">
          <span className="sidebar-stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {job.location}
          </span>
          <span className="sidebar-stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            {job.views} views
          </span>
        </div>

        <div className="job-sidebar-meta">
          <div className="meta-block">
            <span className="meta-label">Salary</span>
            <span className="meta-value salary-value">{job.salary}</span>
          </div>
          <div className="meta-block">
            <span className="meta-label">Posted</span>
            <span className="meta-value">{job.date}</span>
          </div>
        </div>

        <div className="job-sidebar-tags">
          {job.tags.map((t) => (
            <span key={t} className="home-tag">{t}</span>
          ))}
        </div>

        <div className="job-sidebar-section">
          <h4 className="sidebar-section-title">DESCRIPTION</h4>
          <ul className="sidebar-bullets">
            {job.bullets.map((b, i) => (
              <li key={i}>✅ {b}</li>
            ))}
          </ul>
        </div>

        <button className="sidebar-apply-btn">Apply Now →</button>
      </aside>
    </>
  );
}

// ─── Home Job Card ────────────────────────────────────────────────────────────

function HomeJobCard({ job, onClick }: { job: HomeJob; onClick: () => void }) {
  return (
    <div className="home-job-card" onClick={onClick}>
      <div className="home-job-card-inner">
        <div className="home-job-top">
          <h3 className="home-job-title">{job.title}</h3>
          <div className="home-job-tags">
            {job.tags.map((t) => (
              <span key={t} className="home-tag">{t}</span>
            ))}
          </div>
        </div>
        <p className="home-job-desc">{job.description}</p>
        <div className="home-job-meta">
          <span className="home-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {job.location}
          </span>
          <span className="home-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {job.date}
          </span>
          <span className="home-meta-salary">{job.salary}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

type HomeFilter = "new" | "expiring" | "nearme";

function HomePage({ onCreateJob }: { onCreateJob: () => void }) {
  const [activeFilter, setActiveFilter] = useState<HomeFilter>("new");
  const [selectedJob, setSelectedJob] = useState<HomeJob | null>(null);

  const filters: { id: HomeFilter; label: string }[] = [
    { id: "new", label: "New" },
    { id: "expiring", label: "Expiring" },
    { id: "nearme", label: "Near me" },
  ];

  return (
    <>
      <main className="main-content home-main">
        {/* Welcome header */}
        <div className="home-welcome">
          <div>
            <h1 className="home-heading">Welcome, Tarzan 👋</h1>
            <p className="home-subheading">Find your next opportunity</p>
          </div>
          <button className="create-btn-top" style={{ position: "static", marginLeft: "auto" }} onClick={onCreateJob}>
            <PlusIcon size={15} />
            Create job post
          </button>
        </div>

        {/* Filter tabs */}
        <div className="home-filter-row">
          {filters.map((f) => (
            <button
              key={f.id}
              className={`home-filter-btn${activeFilter === f.id ? " home-filter-active" : ""}`}
              onClick={() => setActiveFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Job cards */}
        <div className="home-job-list">
          {HOME_JOBS.map((job) => (
            <HomeJobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
          ))}
        </div>
      </main>

      {selectedJob && (
        <JobDetailSidebar job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </>
  );
}

// ─── Applications Page ────────────────────────────────────────────────────────

function ApplicationsPage({ onExplore }: { onExplore: () => void }) {
  return (
    <main className="main-content">
      <div className="empty-state">
        <svg
          className="empty-icon apps-icon"
          viewBox="0 0 56 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="8" y="4" width="36" height="48" rx="4" stroke="#D1D5DB" strokeWidth="2.5" />
          <line x1="16" y1="18" x2="36" y2="18" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="27" x2="36" y2="27" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="16" y1="36" x2="28" y2="36" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <h1 className="empty-title">No applications yet</h1>
        <p className="empty-subtitle">
          Start exploring opportunities and send your first application.
        </p>
        <button className="explore-btn" onClick={onExplore}>
          Explore jobs →
        </button>
      </div>
    </main>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState<NavPage>("home");
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems: { id: NavPage; icon: string; label: string }[] = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "search", icon: "📄", label: "Search jobs" },
    { id: "applications", icon: "📋", label: "My Applications" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <a className="navbar-logo" href="#" onClick={(e) => e.preventDefault()}>
          <LogoIcon />
          <span className="logo-text">DAILYCRUIT</span>
        </a>

        <div className="nav-pill">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link${activePage === item.id ? " active" : ""}`}
              data-page={item.id}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="navbar-right">
          <button
            className={`icon-btn${activePage === "chat" ? " chat-active" : ""}`}
            title="Messages"
            onClick={() => setActivePage(activePage === "chat" ? "home" : "chat")}
          ><ChatIcon /></button>
          <button className="icon-btn" title="Notifications" onClick={() => setShowNotifications((v) => !v)}><BellIcon /></button>
          <div className="avatar-wrapper profile-dropdown-wrapper" title="Profile">
            <div
              className="avatar"
              onClick={() => setShowProfileMenu((v) => !v)}
              style={{ cursor: "pointer" }}
            >T</div>
            <span className="online-dot" />
            {showProfileMenu && (
              <ProfileDropdown onClose={() => setShowProfileMenu(false)} />
            )}
          </div>
        </div>
      </nav>

      {/* Pages */}
      {activePage === "home" && (
        <HomePage onCreateJob={() => setShowModal(true)} />
      )}
      {activePage === "search" && (
        <main className="main-content search-main">
          <SearchJobsPage />
        </main>
      )}
      {activePage === "applications" && (
        <ApplicationsPage onExplore={() => setActivePage("search")} />
      )}
      {activePage === "chat" && (
        <ChatPage onBack={() => setActivePage("home")} />
      )}

      {showNotifications && (
        <NotificationsModal onClose={() => setShowNotifications(false)} />
      )}

      {showModal && (
        <Modal
          title="Job post form coming soon!"
          message="We're working on the job posting feature. Check back soon to start finding your ideal candidates."
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
