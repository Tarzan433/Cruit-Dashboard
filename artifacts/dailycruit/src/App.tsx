import { useState, useEffect, useRef } from "react";
import HomePage from "./pages/HomePage";
import { RecruiterHomePage, JobPostsPage } from "./pages/RecruiterHomePage";
import { Switch, Route, Redirect, useLocation } from "wouter";

type NavPage = "home" | "search" | "applications" | "jobposts" | "chat" | "profile" | "settings";

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

function BriefcaseIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="12" x2="12" y2="17" />
      <line x1="9" y1="14.5" x2="15" y2="14.5" />
    </svg>
  );
}

function MapPinIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}


function ClockIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

type FilterChip = {
  id: string;
  label: string;
  chip?: "trending" | "clock";
};

const FILTER_TAGS: FilterChip[] = [
  { id: "all",      label: "All" },
  { id: "new",      label: "New",       chip: "trending" },
  { id: "expiring", label: "Expiring",  chip: "clock" },
  { id: "remote",   label: "Remote" },
  { id: "onsite",   label: "On-site" },
  { id: "hybrid",   label: "Hybrid" },
  { id: "fulltime", label: "Full-time" },
  { id: "parttime", label: "Part time" },
  { id: "gig",      label: "Gig" },
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
        <span className="job-tag"><MapPinIcon /> {job.location}</span>
        <span className="job-tag"><BriefcaseIcon /> {job.type}</span>
        <span className="job-tag salary">{job.salary}</span>
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
      <div className="search-input-container">
        <span className="search-icon-left">
          <SearchIcon size={18} />
        </span>
        <input
          type="text"
          className="search-input"
          placeholder="Search by role, company or location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="search-filter-btn"
          title="Advanced filters"
          onClick={() => setShowFilterModal(true)}
        >
          <FilterIcon />
        </button>
      </div>

      {/* Filter chips */}
      <div className="filter-tags-row">
        {FILTER_TAGS.map((tag) => (
          <button
            key={tag.id}
            className={`filter-tag${activeFilter === tag.id ? " filter-tag-active" : ""}`}
            onClick={() => setActiveFilter(tag.id)}
          >
            {tag.chip === "trending" && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                <polyline points="17 6 23 6 23 12" />
              </svg>
            )}
            {tag.chip === "clock" && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            )}
            {tag.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {!isSearching ? (
        <div className="empty-state search-empty">
          <SearchBigIcon />
          <h2 className="empty-title">Start searching</h2>
          <p className="empty-subtitle">
            <span className="empty-highlight">Type</span> at least 2 characters to find jobs
          </p>
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

// ─── Profile Dropdown ─────────────────────────────────────────────────────────

const DD_MENU_ITEMS = [
  { icon: "👤", label: "Profile", badge: null },
  { icon: "⚙️", label: "Settings", badge: null },
  { icon: "📖", label: "Instructions", badge: null },
  { icon: "🛍️", label: "Shop", badge: { text: "new", color: "green" } },
  { icon: "📝", label: "Dev Log", badge: { text: "v0.4.8", color: "gray" } },
  { icon: "📲", label: "Install App", badge: { text: "new", color: "green" } },
];

function ProfileDropdown({ onClose, onNavigate }: { onClose: () => void; onNavigate: (page: NavPage) => void }) {
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
          <li
            key={item.label}
            className="profile-dd-item"
            onClick={() => {
              if (item.label === "Profile") { onNavigate("profile"); onClose(); }
              if (item.label === "Settings") { onNavigate("settings"); onClose(); }
            }}
          >
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

// ─── Account Type Modal ───────────────────────────────────────────────────────

type AccountType = "jobseeker" | "recruiter" | "gigsman";

const ACCOUNT_TYPES: { id: AccountType; title: string; desc: string; icon: string }[] = [
  {
    id: "jobseeker",
    title: "Job Seeker",
    desc: "Find and apply to jobs perfectly matched for you",
    icon: "🧑‍💼",
  },
  {
    id: "recruiter",
    title: "Recruiter",
    desc: "Professional dashboard to post jobs & hire talent",
    icon: "🏢",
  },
  {
    id: "gigsman",
    title: "Gigsman",
    desc: "Search gigs & post flexible one-time work",
    icon: "⚡",
  },
];

function AccountTypeModal({
  current,
  onSelect,
  onClose,
}: {
  current: AccountType;
  onSelect: (t: AccountType) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<AccountType>(current);

  return (
    <div className="acct-modal-overlay" onMouseDown={onClose}>
      <div className="acct-modal-card" onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="acct-modal-header">
          <span className="acct-modal-title">Change account type</span>
          <span className="acct-modal-subtitle">Previous data is retained for 60 days after switching</span>
        </div>

        {/* Cards grid */}
        <div className="acct-cards-grid">
          {ACCOUNT_TYPES.map((t) => {
            const isActive = selected === t.id;
            return (
              <div
                key={t.id}
                className={`acct-type-card${isActive ? " acct-type-active" : ""}`}
                onClick={() => setSelected(t.id)}
              >
                {isActive && <span className="acct-current-badge">CURRENT</span>}
                <div className="acct-card-icon">{t.icon}</div>
                <span className={`acct-card-title${isActive ? " acct-card-title-active" : ""}`}>{t.title}</span>
                <span className="acct-card-desc">{t.desc}</span>
                <div className="acct-dot-row">
                  {isActive && <span className="acct-dot" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="acct-modal-footer">
          <button className="acct-cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className="acct-confirm-btn"
            onClick={() => { onSelect(selected); setTimeout(onClose, 300); }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <div
      className={`toggle-switch${on ? " toggle-on" : ""}`}
      onClick={onChange}
      role="switch"
      aria-checked={on}
      tabIndex={0}
      onKeyDown={(e) => e.key === " " && onChange()}
    >
      <div className="toggle-track" />
      <div className="toggle-thumb" />
    </div>
  );
}

function SettingsPage({
  onBack,
  accountType,
  onAccountTypeChange,
}: {
  onBack: () => void;
  accountType: AccountType;
  onAccountTypeChange: (t: AccountType) => void;
}) {
  const [webNotif, setWebNotif] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [mobileNotif, setMobileNotif] = useState(false);
  const [hideSearch, setHideSearch] = useState(false);
  const [showAcctModal, setShowAcctModal] = useState(false);

  const acctLabel: Record<AccountType, string> = {
    jobseeker: "Job Seeker",
    recruiter: "Recruiter",
    gigsman: "Gigsman",
  };

  return (
    <main className="main-content settings-main">
      {/* Header row */}
      <div className="settings-header-row">
        <button className="settings-back-btn" onClick={onBack}>← Back</button>
        <div className="settings-title-group">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <h2 className="settings-title">Settings</h2>
        </div>
      </div>

      {/* Account */}
      <div className="settings-card">
        <div className="settings-section-header">Account</div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Account Type</span>
            <span className="settings-row-desc">Switch between Job Seeker, Recruiter, or Gigsman. Your previous data is retained for 60 days after switching.</span>
          </div>
          <div className="settings-row-control">
            <span className="account-type-badge">{acctLabel[accountType]}</span>
            <button className="settings-btn settings-btn-black" onClick={() => setShowAcctModal(true)}>Change</button>
          </div>
        </div>
      </div>

      {/* Language & Region */}
      <div className="settings-card">
        <div className="settings-section-header">Language &amp; Region</div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Language</span>
            <span className="settings-row-desc">Interface display language</span>
          </div>
          <div className="settings-row-control">
            <select className="settings-select">
              <option>English</option>
              <option>French</option>
              <option>German</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Region</span>
            <span className="settings-row-desc">Affects job listings and local content</span>
          </div>
          <div className="settings-row-control">
            <select className="settings-select">
              <option>Europe</option>
              <option>North America</option>
              <option>Asia Pacific</option>
              <option>Middle East</option>
            </select>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Time Zone</span>
            <span className="settings-row-desc">Used for scheduling and deadlines</span>
          </div>
          <div className="settings-row-control">
            <select className="settings-select">
              <option value="">Select Time Zone</option>
              <option>UTC+0 London</option>
              <option>UTC+1 Paris</option>
              <option>UTC+2 Athens</option>
              <option>UTC+5:30 Mumbai</option>
              <option>UTC-5 New York</option>
              <option>UTC-8 Los Angeles</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="settings-card">
        <div className="settings-section-header">Notifications</div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Web Notifications</span>
            <span className="settings-row-desc">Receive alerts directly in your browser</span>
          </div>
          <div className="settings-row-control">
            <Toggle on={webNotif} onChange={() => setWebNotif((v) => !v)} />
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Email Notifications</span>
            <span className="settings-row-desc">Updates and activity sent to your email</span>
          </div>
          <div className="settings-row-control">
            <Toggle on={emailNotif} onChange={() => setEmailNotif((v) => !v)} />
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Mobile Notifications</span>
            <span className="settings-row-desc">Push notifications on your mobile device</span>
          </div>
          <div className="settings-row-control">
            <Toggle on={mobileNotif} onChange={() => setMobileNotif((v) => !v)} />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="settings-card">
        <div className="settings-section-header danger-header">Danger Zone</div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Export my data</span>
            <span className="settings-row-desc">Download a copy of all your personal data, activity, and content stored on this platform.</span>
          </div>
          <div className="settings-row-control">
            <button className="settings-btn">Export</button>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Revoke all active sessions</span>
            <span className="settings-row-desc">Sign out from all devices immediately. You'll need to log in again everywhere.</span>
          </div>
          <div className="settings-row-control">
            <button className="settings-btn">Revoke</button>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Delete all personal data</span>
            <span className="settings-row-desc">Permanently remove your personal information while keeping your account active. This cannot be undone.</span>
          </div>
          <div className="settings-row-control">
            <button className="settings-btn settings-btn-red">Delete data</button>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Remove profile from search</span>
            <span className="settings-row-desc">Your profile won't appear in recruiter or employer searches. You can still use the platform normally.</span>
          </div>
          <div className="settings-row-control">
            <Toggle on={hideSearch} onChange={() => setHideSearch((v) => !v)} />
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Reset feed &amp; preferences</span>
            <span className="settings-row-desc">Clear your personalized feed, saved filters, and interest history. Your account and content won't be affected.</span>
          </div>
          <div className="settings-row-control">
            <button className="settings-btn">Reset</button>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Deactivate account</span>
            <span className="settings-row-desc">Temporarily hide your profile and pause all activity. Your data is preserved and you can reactivate at any time by logging back in.</span>
          </div>
          <div className="settings-row-control">
            <button className="settings-btn settings-btn-red">Deactivate</button>
          </div>
        </div>
        <div className="settings-row">
          <div className="settings-row-text">
            <span className="settings-row-title">Delete account</span>
            <span className="settings-row-desc">Permanently delete your account and all associated data. A 15-day grace period applies — you can cancel within that window.</span>
          </div>
          <div className="settings-row-control">
            <button className="settings-btn settings-btn-red-solid">Delete account</button>
          </div>
        </div>
      </div>
      {showAcctModal && (
        <AccountTypeModal
          current={accountType}
          onSelect={(t) => onAccountTypeChange(t)}
          onClose={() => setShowAcctModal(false)}
        />
      )}
    </main>
  );
}

// ─── Preferences Tab ──────────────────────────────────────────────────────────

function PreferencesTab() {
  const workModes = ["Remote", "Hybrid", "On-site"];
  const contractTypes = ["Full-time", "Part-time", "Gig", "Internship", "Contract"];

  const [selectedWorkModes, setSelectedWorkModes] = useState<Set<string>>(new Set());
  const [selectedContracts, setSelectedContracts] = useState<Set<string>>(new Set());
  const [targetRoles, setTargetRoles] = useState("");
  const [preferredLocations, setPreferredLocations] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [seniority, setSeniority] = useState("");
  const [saved, setSaved] = useState(false);

  function toggle(set: Set<string>, setFn: (s: Set<string>) => void, val: string) {
    const next = new Set(set);
    next.has(val) ? next.delete(val) : next.add(val);
    setFn(next);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="pref-card">
      {/* Work mode */}
      <div className="pref-section">
        <span className="pref-section-title">Work mode</span>
        <div className="pref-pills">
          {workModes.map((m) => (
            <button
              key={m}
              className={`pref-pill${selectedWorkModes.has(m) ? " pref-pill-active" : ""}`}
              onClick={() => toggle(selectedWorkModes, setSelectedWorkModes, m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="pref-divider" />

      {/* Contract type */}
      <div className="pref-section">
        <span className="pref-section-title">Contract type</span>
        <div className="pref-pills">
          {contractTypes.map((c) => (
            <button
              key={c}
              className={`pref-pill${selectedContracts.has(c) ? " pref-pill-active" : ""}`}
              onClick={() => toggle(selectedContracts, setSelectedContracts, c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="pref-divider" />

      {/* Row 1: Target roles + Preferred locations */}
      <div className="pref-section">
        <div className="pref-inputs-grid">
          <div className="pref-field">
            <label className="pref-label">Target roles</label>
            <input
              className="pref-input"
              type="text"
              placeholder="Full-stack, Backend, Tech lead"
              value={targetRoles}
              onChange={(e) => setTargetRoles(e.target.value)}
            />
            <span className="pref-sublabel">Comma separated</span>
          </div>
          <div className="pref-field">
            <label className="pref-label">Preferred locations</label>
            <input
              className="pref-input"
              type="text"
              placeholder="Remote EU, Italy"
              value={preferredLocations}
              onChange={(e) => setPreferredLocations(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="pref-divider" />

      {/* Row 2: Salary range + Seniority */}
      <div className="pref-section">
        <div className="pref-inputs-grid">
          <div className="pref-field">
            <label className="pref-label">Salary range</label>
            <input
              className="pref-input"
              type="text"
              placeholder="40k - 65k EUR"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
            />
          </div>
          <div className="pref-field">
            <label className="pref-label">Seniority</label>
            <input
              className="pref-input"
              type="text"
              placeholder="Mid / Senior"
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="pref-actions">
        <button className={`pref-save-btn${saved ? " pref-save-saved" : ""}`} onClick={handleSave}>
          {saved ? "✓ Saved!" : "Save preferences"}
        </button>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

type ProfileTab = "general" | "preferences" | "achievements";

function ProfilePage({ onBack, accountType }: { onBack: () => void; accountType: AccountType }) {
  const acctLabel: Record<AccountType, string> = {
    jobseeker: "Job Seeker",
    recruiter: "Recruiter",
    gigsman: "Gigsman",
  };
  const [activeTab, setActiveTab] = useState<ProfileTab>("general");
  const [showBanner, setShowBanner] = useState(true);

  const tabs: { id: ProfileTab; label: string }[] = [
    { id: "general", label: "General" },
    { id: "preferences", label: "Preferences" },
    { id: "achievements", label: "Achievements" },
  ];

  const stats = [
    { label: "Applied", value: 0 },
    { label: "Responses", value: 0 },
    { label: "Interviews", value: 0 },
    { label: "Offers", value: 0 },
  ];

  return (
    <main className="main-content profile-main">
      {/* Back */}
      <button className="profile-back-btn" onClick={onBack}>
        ← Back
      </button>

      {/* Alert banner */}
      {showBanner && (
        <div className="profile-alert-banner">
          <div className="alert-text">
            <strong>Your profile is not complete</strong>
            <span>Complete your profile to improve visibility and get better matches.</span>
          </div>
          <button className="alert-complete-btn" onClick={() => setShowBanner(false)}>
            Complete now
          </button>
        </div>
      )}

      {/* Profile header card */}
      <div className="profile-header-card">
        <div className="profile-header-left">
          <div className="profile-avatar-lg">T</div>
          <div className="profile-info-block">
            <h2 className="profile-name">Tarzan</h2>
            <span className="profile-handle">@legend</span>
            <button className="profile-add-headline">+ Add headline</button>
            <div className="profile-meta-line">
              <span>karnataka</span>
              <span className="meta-dot">•</span>
              <span>t8857352@gmail.com</span>
            </div>
            <span className="profile-seeker-badge">Job Seeker</span>
          </div>
        </div>

        <div className="profile-header-right">
          <div className="completion-label-row">
            <span className="completion-label">Profile completion</span>
            <span className="completion-pct">88%</span>
          </div>
          <div className="completion-bar-track">
            <div className="completion-bar-fill" style={{ width: "88%" }} />
          </div>
          <span className="completion-missing">⚠ Missing: Headline</span>
          <button className="profile-edit-btn">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit profile
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div className="profile-tab-nav">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`profile-tab-btn${activeTab === t.id ? " profile-tab-active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* General tab */}
      {activeTab === "general" && (
        <div className="profile-content-grid">
          {/* Left column */}
          <div className="profile-main-card">
            <section className="profile-section">
              <h4 className="section-title">About</h4>
              <p className="section-body">sales guy i can even sell yo veggies ****</p>
            </section>
            <div className="section-divider" />
            <section className="profile-section">
              <h4 className="section-title">Skills</h4>
              <div className="skills-list">
                <span className="skill-tag">porgrammers</span>
                <span className="skill-tag">+ Add skill</span>
              </div>
            </section>
            <div className="section-divider" />
            <section className="profile-section">
              <h4 className="section-title">Account Meta</h4>
              <ul className="account-meta-list">
                <li><span className="meta-key">Account type</span><span className="meta-val">{acctLabel[accountType]}</span></li>
                <li><span className="meta-key">Member since</span><span className="meta-val">Mar 2026</span></li>
                <li><span className="meta-key">Reputation</span><span className="meta-val">0</span></li>
              </ul>
            </section>
          </div>

          {/* Right column: stats 2×2 */}
          <div className="profile-stats-col">
            <div className="stats-grid">
              {stats.map((s) => (
                <div key={s.label} className="stat-card">
                  <span className="stat-value">{s.value}</span>
                  <span className="stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "preferences" && (
        <PreferencesTab />
      )}
      {activeTab === "achievements" && (
        <div className="profile-placeholder-tab">
          <p>Achievements coming soon.</p>
        </div>
      )}
    </main>
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
  const [location, navigate] = useLocation();

  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>("jobseeker");

  function handleAccountTypeChange(t: AccountType) {
    setAccountType(t);
    // Switch to recruiter default page if currently on a seeker-only route
    if (t === "recruiter" && location.startsWith("/seeker/")) {
      navigate("/recruiter/home");
    }
    // Switch to seeker default page if currently on a recruiter-only route
    if (t === "jobseeker" && location.startsWith("/recruiter/")) {
      navigate("/seeker/home");
    }
  }

  const isRecruiter = accountType === "recruiter";

  const navItems: { id: NavPage; icon: string; label: string }[] = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "search", icon: "📄", label: "Search jobs" },
    isRecruiter
      ? { id: "jobposts", icon: "🏢", label: "Job Posts" }
      : { id: "applications", icon: "📋", label: "My Applications" },
  ];

  function isNavActive(id: NavPage): boolean {
    switch (id) {
      case "home":
        return location === "/seeker/home" || location === "/recruiter/home";
      case "search":
        return location === "/seeker/search";
      case "applications":
        return location === "/seeker/applications";
      case "jobposts":
        return location === "/recruiter/jobposts";
      case "chat":
        return location === "/seeker/chat" || location === "/recruiter/chat";
      case "profile":
        return location === "/seeker/profile" || location === "/recruiter/profile";
      case "settings":
        return location === "/seeker/settings" || location === "/recruiter/settings";
      default:
        return false;
    }
  }

  function handleNavClick(id: NavPage) {
    switch (id) {
      case "home":
        navigate(isRecruiter ? "/recruiter/home" : "/seeker/home");
        break;
      case "search":
        navigate("/seeker/search");
        break;
      case "applications":
        navigate("/seeker/applications");
        break;
      case "jobposts":
        navigate("/recruiter/jobposts");
        break;
      case "chat":
        navigate(isRecruiter ? "/recruiter/chat" : "/seeker/chat");
        break;
      case "profile":
        navigate(isRecruiter ? "/recruiter/profile" : "/seeker/profile");
        break;
      case "settings":
        navigate(isRecruiter ? "/recruiter/settings" : "/seeker/settings");
        break;
    }
  }

  const isChatActive =
    location === "/seeker/chat" || location === "/recruiter/chat";

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
              className={`nav-link${isNavActive(item.id) ? " active" : ""}`}
              data-page={item.id}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="navbar-right">
          <button
            className={`icon-btn${isChatActive ? " chat-active" : ""}`}
            title="Messages"
            onClick={() =>
              navigate(isRecruiter ? "/recruiter/chat" : "/seeker/chat")
            }
          >
            <ChatIcon />
          </button>

          <button
            className="icon-btn"
            title="Notifications"
            onClick={() => setShowNotifications((v) => !v)}
          >
            <BellIcon />
          </button>

          <div className="avatar-wrapper profile-dropdown-wrapper" title="Profile">
            <div
              className="avatar"
              onClick={() => setShowProfileMenu((v) => !v)}
              style={{ cursor: "pointer" }}
            >
              T
            </div>
            <span className="online-dot" />
            {showProfileMenu && (
              <ProfileDropdown
                onClose={() => setShowProfileMenu(false)}
                onNavigate={(page) => {
                  switch (page) {
                    case "profile":
                      navigate(isRecruiter ? "/recruiter/profile" : "/seeker/profile");
                      break;
                    case "settings":
                      navigate(isRecruiter ? "/recruiter/settings" : "/seeker/settings");
                      break;
                    case "home":
                      navigate(isRecruiter ? "/recruiter/home" : "/seeker/home");
                      break;
                  }
                  setShowProfileMenu(false);
                }}
              />
            )}
          </div>
        </div>
      </nav>

      {/* Route-based page rendering */}
      <Switch>
        {/* Root redirect */}
        <Route path="/">
          <Redirect to={isRecruiter ? "/recruiter/home" : "/seeker/home"} />
        </Route>

        {/* Seeker routes */}
        <Route path="/seeker/home">
          <HomePage onCreateJob={() => setShowModal(true)} />
        </Route>
        <Route path="/seeker/search">
          <SearchJobsPage />
        </Route>
        <Route path="/seeker/applications">
          <ApplicationsPage onExplore={() => navigate("/seeker/search")} />
        </Route>
        <Route path="/seeker/chat">
          <ChatPage onBack={() => navigate("/seeker/home")} />
        </Route>
        <Route path="/seeker/profile">
          <ProfilePage
            onBack={() => navigate("/seeker/home")}
            accountType={accountType}
          />
        </Route>
        <Route path="/seeker/settings">
          <SettingsPage
            onBack={() => navigate("/seeker/home")}
            accountType={accountType}
            onAccountTypeChange={handleAccountTypeChange}
          />
        </Route>

        {/* Recruiter routes */}
        <Route path="/recruiter/home">
          <RecruiterHomePage
            onCreatePost={() => navigate("/recruiter/jobposts")}
          />
        </Route>
        <Route path="/recruiter/jobposts">
          <JobPostsPage />
        </Route>
        <Route path="/recruiter/chat">
          <ChatPage onBack={() => navigate("/recruiter/home")} />
        </Route>
        <Route path="/recruiter/profile">
          <ProfilePage
            onBack={() => navigate("/recruiter/home")}
            accountType={accountType}
          />
        </Route>
        <Route path="/recruiter/settings">
          <SettingsPage
            onBack={() => navigate("/recruiter/home")}
            accountType={accountType}
            onAccountTypeChange={handleAccountTypeChange}
          />
        </Route>
      </Switch>



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
