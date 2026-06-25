
// ─── Imports ─────────────────────────────────────────────────────────────────

import { useState } from "react";
import { CreateJobPostWizard } from "../components/CreateJobPostWizard";


// ─── Recruiter Home Page ──────────────────────────────────────────────────────

const REC_CHATS = [
  { letter: "M", name: "Muhammed Faris", sub: "No messages yet" },
  { letter: "M", name: "Muhammed Faris", sub: "No messages yet" },
  { letter: "M", name: "Muhammed Faris", sub: "No messages yet" },
];

export function RecruiterHomePage({ onCreatePost }: { onCreatePost: () => void }) {
  return (
    <main className="main-content rec-main">
      {/* Top row: welcome + 3 metric cards */}
      <div className="rec-top-row">
        {/* Welcome card */}
        <div className="rec-welcome-card">
          <div className="rec-welcome-text">
            <h2 className="rec-welcome-title">Welcome back, Tarzan! 👋</h2>
            <p className="rec-welcome-sub">Here's an overview of your activity</p>
          </div>
          <button className="rec-new-post-btn" onClick={onCreatePost}>+ New Post</button>
        </div>

        {/* Metric: Total Views */}
        <div className="rec-metric-card">
          <div className="rec-metric-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span className="rec-metric-value">0</span>
          <span className="rec-metric-label">Total Views</span>
          <span className="rec-metric-sub">Across all posts</span>
        </div>

        {/* Metric: Total Posts */}
        <div className="rec-metric-card">
          <div className="rec-metric-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <span className="rec-metric-value">0</span>
          <span className="rec-metric-label">Total Posts</span>
          <div className="rec-posts-stats">
            <span>0 Active</span><span className="rec-stat-dot" /><span>0 Draft</span><span className="rec-stat-dot" /><span>0 Archived</span>
          </div>
        </div>

        {/* Metric: Applications */}
        <div className="rec-metric-card">
          <div className="rec-metric-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <span className="rec-metric-value">0</span>
          <span className="rec-metric-label">Applications</span>
          <span className="rec-metric-sub">Recent received</span>
        </div>
      </div>

      {/* Middle grid: Recent Applications + Top Posts + Recent Chats */}
      <div className="rec-mid-grid">
        {/* Recent Applications */}
        <div className="rec-panel-card">
          <div className="rec-panel-header">
            <span className="rec-panel-title">Recent Applications</span>
            <button className="rec-see-all">See all →</button>
          </div>
          <div className="rec-empty-panel">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
            <span className="rec-empty-text">No applications yet</span>
          </div>
        </div>

        {/* Right column: Top Posts + Recent Chats stacked */}
        <div className="rec-right-col">
          <div className="rec-panel-card">
            <div className="rec-panel-header">
              <span className="rec-panel-title">Top Posts</span>
              <button className="rec-see-all">See all →</button>
            </div>
            <div className="rec-empty-panel">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="rec-empty-text">No posts yet</span>
            </div>
          </div>

          {/* Recent Chats */}
          <div className="rec-panel-card">
            <div className="rec-panel-header">
              <span className="rec-panel-title">Recent Chats</span>
              <button className="rec-see-all">See all →</button>
            </div>
            <ul className="rec-chat-list">
              {REC_CHATS.map((c, i) => (
                <li key={i} className="rec-chat-row">
                  <div className="rec-chat-avatar">{c.letter}</div>
                  <div className="rec-chat-info">
                    <span className="rec-chat-name">{c.name}</span>
                    <span className="rec-chat-sub">{c.sub}</span>
                  </div>
                  <span className="rec-chat-arrow">→</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── Job Posts Page (Recruiter) ───────────────────────────────────────────────


export function JobPostsPage() {
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return <CreateJobPostWizard onBack={() => setShowWizard(false)} />;
  }

  return (
    <main className="main-content">
      <div className="empty-state">
        <div style={{ fontSize: 48, marginBottom: 12 }}>🏢</div>
        <h3 className="empty-title">No job posts yet</h3>
        <p className="empty-desc">You're in Recruiter mode. Create your first job post to start finding talent.</p>
        <button className="explore-btn" style={{ marginTop: 12 }} onClick={() => setShowWizard(true)}>
          + Create job post
        </button>
      </div>
    </main>
  );
}