import React, { useState, useEffect } from "react";
import "../styles/auth.css";

import {
  loginUser,
  signInWithGoogle,
} from "../services/auth";

interface LoginPageProps {
  onLogin: (rememberMe: boolean) => void;
  onNavigateToSignUp: () => void;
  onNavigateToForgotPassword: () => void;
}

export default function LoginPage({
  onLogin,
  onNavigateToSignUp,
  onNavigateToForgotPassword,
}: LoginPageProps) {


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
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Interaction states
  const [isLoading, setIsLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // SVG Icons
  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );

  const EyeIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
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

  // Auto-dismiss toast notification after 3 seconds
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
    const tempErrors: { email?: string; password?: string } = {};

    // Email validation
    if (!email) {
      tempErrors.email = "Email address is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        tempErrors.email = "Please enter a valid email address";
      }
    }

    // Password validation
    if (!password) {
      tempErrors.password = "Password is required";
    } else if (password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };


  // handle submit for login using Firebase authentication 

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

      await loginUser(email, password);

      showToast("Login successful!");

      onLogin(rememberMe);
    } catch (error: any) {
      setShake(true);
      setTimeout(() => setShake(false), 400);

      switch (error.code) {
        case "auth/user-not-found":
          showToast("No account found with this email.");
          break;

        case "auth/wrong-password":
        case "auth/invalid-credential":
          showToast("Incorrect email or password.");
          break;

        case "auth/too-many-requests":
          showToast("Too many attempts. Try again later.");
          break;

        default:
          showToast(error.message || "Login failed.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className={`auth-page-container ${isDark ? "dark" : ""}`}>
      {/* Visual background decorations */}
      <div className="auth-grid-overlay" />
      <div className="auth-glow-orb-1" />
      <div className="auth-glow-orb-2" />

      {/* Floating toast notification */}
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

      {/* Theme Switcher Toggle */}
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

          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Enter your credentials to access your dashboard</p>
          </div>

          {/* Social Continue with Google Button */}
          <button
            type="button"
            className="auth-google-btn"

            onClick={async () => {
              try {
                setIsLoading(true);

                await signInWithGoogle();

                showToast("Google sign in successful!");

                onLogin(true);
              } catch (error: any) {
                showToast(error.message || "Google sign in failed.");
              } finally {
                setIsLoading(false);
              }
            }}

            aria-label="Continue with Google"
          >
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <div className="auth-divider">or sign in with email</div>

          {/* Login Form */}
          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            {/* Email Field */}
            <div className="auth-field-group">
              <input
                id="email-input"
                type="email"
                className={`auth-input ${errors.email ? "invalid" : ""}`}
                placeholder=" "
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
                disabled={isLoading}
              />
              <label htmlFor="email-input" className="auth-label">
                Email address
              </label>
              {errors.email && (
                <div id="email-error" className="auth-error-msg" role="alert">
                  <span>⚠</span> {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="auth-field-group">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                className={`auth-input ${errors.password ? "invalid" : ""}`}
                placeholder=" "
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                required
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                disabled={isLoading}
              />
              <label htmlFor="password-input" className="auth-label">
                Password
              </label>
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
                disabled={isLoading}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
              {errors.password && (
                <div id="password-error" className="auth-error-msg" role="alert">
                  <span>⚠</span> {errors.password}
                </div>
              )}
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="auth-options-row">
              <label className="auth-remember-label">
                <input
                  type="checkbox"
                  className="auth-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span>Remember me</span>
              </label>
              <a
                href="#forgot"
                className="auth-forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateToForgotPassword();
                }}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Login Button */}
            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="auth-spinner" aria-hidden="true" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          {/* Redirect to signup link */}
          <div className="auth-footer-text">
            Don't have an account?
            <a
              href="#signup"
              className="auth-footer-link"
              onClick={(e) => {
                e.preventDefault();
                onNavigateToSignUp();
              }}
            >
              Create Account
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
