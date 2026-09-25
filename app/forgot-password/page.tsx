"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Mail, ShieldCheck, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";
import {
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  verifyPasswordResetOtp,
} from "@/core/services/authService";
import {
  getPasswordChecklistItems,
  getPasswordValidationMessage,
  validateEmail,
  validateStrongPassword,
} from "@/core/utils/validation";

type ResetStep = "request" | "verify" | "reset" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<ResetStep>("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [expiryCountdown, setExpiryCountdown] = useState(0);
  const [otpExpired, setOtpExpired] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const expiryTimerRef = useRef<NodeJS.Timeout | null>(null);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const clearExpiryTimer = () => {
    if (expiryTimerRef.current) {
      clearInterval(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearExpiryTimer();
  }, []);

  const startExpiryTimer = (expiresAtISO: string) => {
    clearExpiryTimer();
    setOtpExpired(false);
    const expiresAt = new Date(expiresAtISO).getTime();

    const tick = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setExpiryCountdown(remaining);
      if (remaining <= 0) {
        setOtpExpired(true);
        clearExpiryTimer();
      }
    };

    tick();
    expiryTimerRef.current = setInterval(tick, 1000);
  };

  const handleRequestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await requestPasswordResetOtp(email);
      setMessage(response.message || "OTP has been sent to your registered email.");
      setAttemptsUsed(0);
      setStep("verify");
      startExpiryTimer(response.expires_at);
    } catch (err: any) {
      setError(err.response?.data?.error || "Email not found. Please register first.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (otpExpired) {
      setError("OTP has expired. Please request a new one.");
      return;
    }

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Enter the 6-digit OTP sent to your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyPasswordResetOtp(email, otp.trim());
      setMessage(response.message || "OTP verified successfully.");
      clearExpiryTimer();
      setStep("reset");
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.expired) {
        setOtpExpired(true);
        clearExpiryTimer();
        setExpiryCountdown(0);
      }
      if (data?.attempts_used) {
        setAttemptsUsed(data.attempts_used);
      }
      setError(data?.error || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!validateStrongPassword(newPassword)) {
      setError(getPasswordValidationMessage());
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPasswordWithOtp({
        email,
        otp,
        newPassword,
        confirmPassword,
      });
      setMessage(response.message || "Password reset successfully.");
      setStep("done");
    } catch (err: any) {
      setError(err?.response?.data?.error || "An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (loading || expiryCountdown > 0) return;
    setLoading(true);
    try {
      const response = await requestPasswordResetOtp(email);
      setAttemptsUsed(0);
      setMessage("A new OTP has been sent to your email.");
      startExpiryTimer(response.expires_at);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to resend OTP. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const checklistItems = useMemo(() => getPasswordChecklistItems(newPassword), [newPassword]);

  return (
    <div style={styles.container} className="forgot-page-shell">
      {/* Background glow matching auth aesthetic */}
      <div style={styles.background}></div>

      <div style={styles.main}>
        <div style={styles.card} className="wsd-auth-card">
          <Link href="/login" style={styles.backLink} className="auth-back-link">
            <ArrowLeft size={16} />
            <span>Back to login</span>
          </Link>

          <div style={styles.hero} className="auth-hero">
            <div style={styles.iconWrap} className="auth-icon-wrap">
              {step === "done" ? <CheckCircle2 size={24} color="#10B981" /> : <ShieldCheck size={24} color="#007AFF" />}
            </div>
            <h1 style={styles.title} className="auth-title">Reset your password</h1>
            <p style={styles.subtitle} className="auth-subtitle">
              {step === "request" && "Enter your registered organization email address."}
              {step === "verify" && "Enter the OTP sent to your email."}
              {step === "reset" && "Create your new password to complete reset."}
              {step === "done" && "Your password has been changed successfully."}
            </p>
          </div>

          {message ? <div style={styles.successBox} className="auth-msg-box auth-msg-success">{message}</div> : null}
          {error ? <div style={styles.errorBox} className="auth-msg-box auth-msg-error">{error}</div> : null}

          {step === "request" && (
            <form onSubmit={handleRequestOtp} style={styles.form} className="auth-form">
              <label style={styles.label} className="auth-label">Registered email address</label>
              <div style={styles.inputWrap} className="auth-input-wrap">
                <Mail size={18} style={styles.inputIcon} />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  style={styles.input}
                  className="auth-input"
                  placeholder="name@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              <button type="submit" style={styles.primaryButton} className="auth-primary-btn" disabled={loading}>
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {step === "verify" && (
            <form onSubmit={handleVerifyOtp} style={styles.form} className="auth-form">
              <label style={styles.label} className="auth-label">Registered email address</label>
              <div style={styles.inputWrap} className="auth-input-wrap">
                <Mail size={18} style={styles.inputIcon} />
                <input value={email} disabled type="email" style={{ ...styles.input, opacity: 0.65 }} className="auth-input" />
              </div>

              {/* OTP Expiry Countdown */}
              <div style={styles.countdownContainer} className="auth-countdown-container">
                <Clock size={15} color={otpExpired ? "#EF4444" : "#3B82F6"} />
                <span style={{ ...styles.countdownText, color: otpExpired ? "#EF4444" : "#3B82F6" }}>
                  {otpExpired ? "OTP Expired" : `${formatCountdown(expiryCountdown)} remaining`}
                </span>
              </div>

              {/* Expired warning */}
              {otpExpired && (
                <div style={styles.expiredWarning} className="auth-expired-warning">
                  <AlertTriangle size={15} />
                  <span>OTP has expired. Please request a new one.</span>
                </div>
              )}

              <label style={styles.label} className="auth-label">OTP</label>
              <div style={styles.inputWrap} className="auth-input-wrap">
                <KeyRound size={18} style={styles.inputIcon} />
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="one-time-code"
                  style={{ ...styles.input, ...(otpExpired ? { opacity: 0.5 } : {}) }}
                  className="auth-input"
                  placeholder="123456"
                  disabled={otpExpired}
                  required
                />
              </div>

              {attemptsUsed > 0 && (
                <p style={styles.attemptsInfo} className="auth-attempts-info">Attempts: {attemptsUsed} / 15</p>
              )}

              <button
                type="submit"
                style={{ ...styles.primaryButton, ...(otpExpired ? { opacity: 0.5, cursor: "not-allowed" } : {}) }}
                className="auth-primary-btn"
                disabled={loading || otpExpired}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                style={styles.secondaryButton}
                className="auth-secondary-btn"
                disabled={loading || expiryCountdown > 0}
              >
                {expiryCountdown > 0 ? `Resend OTP in ${formatCountdown(expiryCountdown)}` : "Resend OTP"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleResetPassword} style={styles.form} className="auth-form">
              <label style={styles.label} className="auth-label">New password</label>
              <div style={styles.inputWrap} className="auth-input-wrap">
                <KeyRound size={18} style={styles.inputIcon} />
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type={showNewPassword ? "text" : "password"}
                  style={styles.input}
                  className="auth-input"
                  placeholder="Enter a strong password"
                  autoComplete="new-password"
                  required
                />
                <button type="button" onClick={() => setShowNewPassword((value) => !value)} style={styles.eyeButton} className="auth-eye-btn">
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <label style={styles.label} className="auth-label">Confirm password</label>
              <div style={styles.inputWrap} className="auth-input-wrap">
                <KeyRound size={18} style={styles.inputIcon} />
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type={showConfirmPassword ? "text" : "password"}
                  style={styles.input}
                  className="auth-input"
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} style={styles.eyeButton} className="auth-eye-btn">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div style={styles.checklist} className="auth-checklist">
                {checklistItems.map((item) => (
                  <div key={item.key} style={styles.checklistItem} className="auth-checklist-item">
                    <span style={{ ...styles.checkDot, backgroundColor: item.met ? "#10B981" : "#9CA3AF" }} />
                    <span style={{ color: item.met ? "var(--text-primary, #111827)" : "var(--text-secondary, #6B7280)" }}>{item.label}</span>
                  </div>
                ))}
              </div>

              <button type="submit" style={styles.primaryButton} className="auth-primary-btn" disabled={loading}>
                {loading ? "Updating password..." : "Reset password"}
              </button>
            </form>
          )}

          {step === "done" && (
            <div style={styles.doneState}>
              <Link href="/login" style={styles.primaryLinkButton} className="auth-primary-btn">
                Go to login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Copyright */}
      <div style={styles.footer} className="auth-footer">
        <p style={styles.copyright} className="auth-copyright">
          © {new Date().getFullYear()} Websmith Digital. All Rights Reserved. Developed with care by the Websmith Digital Team.
        </p>
      </div>

      <style>{`
        .auth-primary-btn {
          transition: transform 0.15s ease, filter 0.15s ease;
        }
        .auth-primary-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .auth-secondary-btn {
          transition: transform 0.15s ease, background-color 0.15s ease;
        }
        .auth-secondary-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .auth-back-link {
          transition: opacity 0.2s ease;
        }
        .auth-back-link:hover {
          opacity: 0.8;
        }

        /* Dark Theme Support */
        .dark-theme .auth-label {
          color: #F1F5F9 !important;
        }
        .dark-theme .auth-title {
          color: #FFFFFF !important;
        }
        .dark-theme .auth-subtitle {
          color: #94A3B8 !important;
        }
        .dark-theme .auth-back-link {
          color: #94A3B8 !important;
        }
        .dark-theme .auth-back-link:hover {
          color: #F1F5F9 !important;
        }
        .dark-theme .auth-icon-wrap {
          background-color: rgba(59, 130, 246, 0.15) !important;
        }
        .dark-theme .auth-input {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #FFFFFF !important;
        }
        .dark-theme .auth-input:focus {
          border-color: #3B82F6 !important;
          background-color: rgba(255, 255, 255, 0.08) !important;
        }
        .dark-theme .auth-countdown-container {
          background-color: rgba(59, 130, 246, 0.12) !important;
          border-color: rgba(59, 130, 246, 0.25) !important;
        }
        .dark-theme .auth-checklist {
          background-color: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(255, 255, 255, 0.08) !important;
        }
        .dark-theme .auth-secondary-btn {
          background-color: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #F1F5F9 !important;
        }
        .dark-theme .auth-copyright {
          color: #64748B !important;
        }

        /* Mobile Viewport Optimizations */
        @media (max-width: 640px) {
          .forgot-page-shell {
            padding: 14px 14px 22px 14px !important;
            min-height: calc(100dvh - 64px) !important;
            justify-content: flex-start !important;
          }
          .forgot-page-shell .wsd-auth-card {
            padding: 20px 16px 18px !important;
            border-radius: 20px !important;
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.1) !important;
          }
          .auth-back-link {
            font-size: 13px !important;
            margin-bottom: 12px !important;
          }
          .auth-hero {
            margin-bottom: 12px !important;
          }
          .auth-icon-wrap {
            width: 44px !important;
            height: 44px !important;
            border-radius: 12px !important;
            margin-bottom: 8px !important;
          }
          .auth-title {
            font-size: 21px !important;
            line-height: 1.25 !important;
            margin-bottom: 3px !important;
          }
          .auth-subtitle {
            font-size: 13px !important;
            line-height: 1.4 !important;
            margin-top: 3px !important;
          }
          .auth-msg-box {
            padding: 8px 12px !important;
            font-size: 12.5px !important;
            margin-bottom: 11px !important;
            border-radius: 10px !important;
          }
          .auth-form {
            gap: 10px !important;
          }
          .auth-label {
            font-size: 12px !important;
            margin-bottom: 2px !important;
          }
          .auth-input {
            height: 45px !important;
            font-size: 14px !important;
            padding: 10px 14px 10px 38px !important;
            border-radius: 11px !important;
          }
          .auth-countdown-container {
            padding: 7px 11px !important;
            border-radius: 9px !important;
          }
          .auth-countdown-container span {
            font-size: 13px !important;
          }
          .auth-expired-warning {
            padding: 7px 11px !important;
            font-size: 12.5px !important;
            border-radius: 9px !important;
          }
          .auth-checklist {
            padding: 9px 11px !important;
            gap: 5px !important;
            border-radius: 11px !important;
          }
          .auth-checklist-item {
            font-size: 12px !important;
            gap: 8px !important;
          }
          .auth-primary-btn,
          .auth-secondary-btn {
            height: 45px !important;
            padding: 10px 14px !important;
            font-size: 14.5px !important;
            border-radius: 11px !important;
          }
          .auth-footer {
            margin-top: 14px !important;
          }
          .auth-copyright {
            font-size: 11.5px !important;
            line-height: 1.4 !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, any> = {
  container: {
    minHeight: "calc(100dvh - 72px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    position: "relative",
    fontFamily: "var(--font-sans)",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    padding: "24px 16px 28px 16px",
    boxSizing: "border-box",
  },
  main: {
    width: "100%",
    maxWidth: "460px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    margin: "auto 0",
  },
  background: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "radial-gradient(circle at 20% 50%, color-mix(in srgb, #007AFF 14%, transparent) 0%, transparent 55%)",
    pointerEvents: "none",
  },
  card: {
    borderRadius: "26px",
    padding: "30px 32px 26px",
    width: "100%",
    maxWidth: "460px",
    position: "relative",
    zIndex: 1,
    marginTop: 0,
    boxSizing: "border-box",
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    color: "#4B5563",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "18px",
  },
  hero: {
    marginBottom: "18px",
  },
  iconWrap: {
    width: "50px",
    height: "50px",
    borderRadius: "15px",
    backgroundColor: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "14px",
  },
  title: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 700,
    color: "#111827",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: "6px 0 0 0",
    color: "#6B7280",
    lineHeight: 1.5,
    fontSize: "14.5px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "13px",
  },
  label: {
    fontSize: "12.5px",
    fontWeight: 600,
    color: "#111827",
  },
  inputWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    color: "#9CA3AF",
    pointerEvents: "none",
  },
  input: {
    width: "100%",
    borderRadius: "14px",
    border: "1px solid #D1D5DB",
    padding: "12px 16px 12px 42px",
    fontSize: "14.5px",
    outline: "none",
    backgroundColor: "#F9FAFB",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    border: "none",
    background: "transparent",
    color: "#9CA3AF",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px",
  },
  countdownContainer: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 12px",
    backgroundColor: "#EFF6FF",
    borderRadius: "11px",
    border: "1px solid rgba(59, 130, 246, 0.2)",
  },
  countdownText: {
    fontSize: "14px",
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
  },
  expiredWarning: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "9px 12px",
    backgroundColor: "#FEF2F2",
    borderRadius: "11px",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    color: "#DC2626",
    fontSize: "13.5px",
    fontWeight: 600,
  },
  attemptsInfo: {
    margin: 0,
    fontSize: "11.5px",
    color: "#6B7280",
    textAlign: "right",
  },
  primaryButton: {
    marginTop: "4px",
    border: "none",
    borderRadius: "14px",
    backgroundColor: "#007AFF",
    color: "#FFFFFF",
    padding: "13px 16px",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 14px rgba(0, 122, 255, 0.3)",
  },
  successBox: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
    color: "#047857",
    border: "1px solid rgba(16, 185, 129, 0.2)",
    borderRadius: "12px",
    padding: "10px 13px",
    marginBottom: "14px",
    fontSize: "13.5px",
  },
  errorBox: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#B91C1C",
    border: "1px solid rgba(239, 68, 68, 0.18)",
    borderRadius: "12px",
    padding: "10px 13px",
    marginBottom: "14px",
    fontSize: "13.5px",
  },
  checklist: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "7px",
    backgroundColor: "#F9FAFB",
    border: "1px solid #E5E7EB",
    borderRadius: "14px",
    padding: "12px 14px",
  },
  checklistItem: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontSize: "13px",
  },
  checkDot: {
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    flexShrink: 0,
  },
  doneState: {
    display: "flex",
    justifyContent: "flex-start",
  },
  primaryLinkButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "13px 20px",
    borderRadius: "14px",
    backgroundColor: "#007AFF",
    color: "#FFFFFF",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "15px",
    boxShadow: "0 4px 14px rgba(0, 122, 255, 0.3)",
  },
  secondaryButton: {
    border: "1px solid #D1D5DB",
    borderRadius: "14px",
    backgroundColor: "#FFFFFF",
    color: "#111827",
    padding: "12px 16px",
    fontSize: "14.5px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    width: "100%",
    maxWidth: "520px",
    textAlign: "center",
    marginTop: "auto",
    paddingTop: "16px",
    zIndex: 1,
  },
  copyright: {
    fontSize: "12px",
    color: "#6B7280",
    margin: 0,
    lineHeight: 1.5,
  },
};
