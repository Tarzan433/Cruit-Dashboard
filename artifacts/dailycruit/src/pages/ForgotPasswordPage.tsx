import React, { useState, useEffect } from "react";
import "../styles/auth.css";

import { resetPassword } from "../services/auth";

interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void;
}

export default function ForgotPasswordPage({ onNavigateToLogin }: ForgotPasswordPageProps) {
  // Theme state
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("dailycruit_theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Apply theme to document element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dailycruit_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dailycruit_theme", "light");
    }
  }, [isDark]);

  // Form states
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // SVG Icons
  const KeyLockIllustration = () => (
    <svg viewBox="0 0 100 100" width="80" height="80" className="auth-illustration" style={{ margin: "0 auto 20px" }}>
      <defs>
        <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
        <filter id="glow-effect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient-accent)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
      <rect x="35" y="42" width="30" height="24" rx="6" fill="none" stroke="url(#gradient-accent)" strokeWidth="2.5" />
      <path d="M42 42V34c0-4.4 3.6-8 8-8s8 3.6 8 8v8" fill="none" stroke="url(#gradient-accent)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="52" r="2.5" fill="url(#gradient-accent)" />
      <line x1="50" y1="54.5" x2="50" y2="60" stroke="url(#gradient-accent)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );

  const SuccessIllustration = () => (
    <svg viewBox="0 0 100 100" width="80" height="80" className="auth-illustration" style={{ margin: "0 auto 20px" }}>
      <defs>
        <linearGradient id="gradient-success" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient-success)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />
      {/* Paper plane */}
      <path d="M25 50 L75 30 L55 60 L48 72 L45 57 Z" fill="none" stroke="url(#gradient-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M75 30 L45 57" fill="none" stroke="url(#gradient-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dots trailing */}
      <circle cx="20" cy="58" r="1.5" fill="#22c55e" opacity="0.5" />
      <circle cx="28" cy="62" r="1" fill="#22c55e" opacity="0.3" />
    </svg>
  );

  const SunIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );

  const MoonIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  const LogoIcon = () => (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
      <path d="M3 8.5L6.5 12L13 5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Toast timer
  useEffect(() => {
    let timer: number | undefined;
    if (toastMessage) {
      timer = window.setTimeout(() => {
        setToastMessage(null);
      }, 3000);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [toastMessage]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const validate = () => {
    if (!email) {
      setError("Email address is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError(null);
    return true;
  };

  //handle submit 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    if (!validate()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    try {
      setIsLoading(true);

      await resetPassword(email);

      setIsSubmitted(true);
      showToast("Password reset email sent.");

    } catch (error: any) {

      showToast(error.message || "Unable to send reset email.");

    } finally {

      setIsLoading(false);

    }
  };

  return (
    <div className={`auth-page-container ${isDark ? "dark" : ""}`}>
      <div className="auth-grid-overlay" />
      <div className="auth-glow-orb-1" />
      <div className="auth-glow-orb-2" />

      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: isDark ? "rgba(17, 24, 39, 0.95)" : "rgba(255, 255, 255, 0.95)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
            color: "var(--auth-text-primary)",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
            fontSize: "14px",
            fontWeight: 500,
            zIndex: 100,
            animation: "auth-slide-down 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span style={{ color: "#22c55e" }}>✓</span> {toastMessage}
        </div>
      )}

      {/* Theme Toggle */}
      <button
        type="button"
        className="auth-theme-toggle"
        onClick={() => setIsDark(!isDark)}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label="Toggle dark theme"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className={`auth-card-wrapper ${shake ? "auth-shake" : ""}`}>
        <div className="auth-card">

          {/* Daily-Cruit Branding */}
          <div className="auth-logo-row">
            <div className="auth-logo-box">
              <LogoIcon />
            </div>
            <span className="auth-logo-text">DAILYCRUIT</span>
          </div>

          {!isSubmitted ? (
            <>
              {/* Lock SVG Illustration */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <KeyLockIllustration />
              </div>

              <div className="auth-header">
                <h1>Reset your password</h1>
                <p>Enter your email and we'll send you a password recovery link</p>
              </div>

              {/* Form */}
              <form className="auth-form" onSubmit={handleSubmit} noValidate>

                {/* Email Field */}
                <div className="auth-field-group" style={{ marginBottom: "28px" }}>
                  <input
                    id="email-input"
                    type="email"
                    className={`auth-input ${error ? "invalid" : ""}`}
                    placeholder=" "
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    required
                    aria-invalid={!!error}
                    aria-describedby={error ? "email-error" : undefined}
                    disabled={isLoading}
                  />
                  <label htmlFor="email-input" className="auth-label">
                    Email address
                  </label>
                  {error && (
                    <div id="email-error" className="auth-error-msg" role="alert">
                      <span>⚠</span> {error}
                    </div>
                  )}
                </div>

                {/* Submit Reset button */}
                <button
                  type="submit"
                  className="auth-submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="auth-spinner" aria-hidden="true" />
                      <span>Sending reset link...</span>
                    </>
                  ) : (
                    <span>Send Reset Link</span>
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Paper Plane success SVG */}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <SuccessIllustration />
              </div>

              <div className="auth-header" style={{ marginBottom: "28px" }}>
                <h1 style={{ color: "#22c55e" }}>Link Sent!</h1>
                <p style={{ marginTop: "12px", lineHeight: "1.6" }}>
                  We've sent a password reset link to <strong style={{ color: "var(--auth-text-primary)" }}>{email}</strong>.
                  Please check your inbox and click the link to configure a new password.
                </p>
              </div>

              <button
                type="button"
                className="auth-submit-btn"

                onClick={async () => {
                  try {
                    setIsLoading(true);

                    await resetPassword(email);

                    showToast("Password reset email sent again.");

                  } catch (error: any) {
                    showToast(error.message || "Unable to resend email.");
                  } finally {
                    setIsLoading(false);
                  }
                }}

                style={{
                  background: "var(--auth-google-bg)",
                  color: "var(--auth-google-text)",
                  border: "1px solid var(--auth-google-border)",
                  marginBottom: "8px",
                  boxShadow: "none"
                }}
              >
                Resend Link
              </button>
            </>
          )}

          {/* Redirect to login */}
          <div className="auth-footer-text" style={{ marginTop: "24px" }}>
            <a
              href="#login"
              className="auth-footer-link"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToLogin();
              }}
              style={{ fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px" }}
            >
              ← Back to Sign In
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
