import { useState } from "react";

type NavPage = "home" | "search" | "applications";

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

function Modal({ onClose }: { onClose: () => void }) {
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
        <h2>Job post form coming soon!</h2>
        <p>We're working on the job posting feature. Check back soon to start finding your ideal candidates.</p>
        <button className="modal-close" onClick={onClose}>Got it</button>
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState<NavPage>("home");
  const [showModal, setShowModal] = useState(false);

  const navItems: { id: NavPage; icon: string; label: string }[] = [
    { id: "home", icon: "🏠", label: "Home" },
    { id: "search", icon: "📄", label: "Search jobs" },
    { id: "applications", icon: "📋", label: "My Applications" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        {/* Logo */}
        <a className="navbar-logo" href="#" onClick={(e) => e.preventDefault()}>
          <LogoIcon />
          <span className="logo-text">DAILYCRUIT</span>
        </a>

        {/* Center pill nav */}
        <div className="nav-pill">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-link${activePage === item.id ? " active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right icons */}
        <div className="navbar-right">
          <button className="icon-btn" title="Messages">
            <ChatIcon />
          </button>
          <button className="icon-btn" title="Notifications">
            <BellIcon />
          </button>
          <div className="avatar-wrapper" title="Profile">
            <div className="avatar">T</div>
            <span className="online-dot" />
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="main-content">
        {/* Top-right create button */}
        <button className="create-btn-top" onClick={() => setShowModal(true)}>
          <PlusIcon size={15} />
          Create job post
        </button>

        {/* Empty state */}
        <div className="empty-state">
          <PeopleIcon />
          <h1 className="empty-title">No job posts yet</h1>
          <p className="empty-subtitle">
            Create your first job post and start finding candidates.
          </p>
          <button className="create-btn-empty" onClick={() => setShowModal(true)}>
            <PlusIcon size={16} />
            Create a job post
          </button>
        </div>
      </main>

      {/* Modal */}
      {showModal && <Modal onClose={() => setShowModal(false)} />}
    </>
  );
}
