"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  Building,
  Camera,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import { AuthUser, getStoredUser, getToken, setAuthSession } from "../../lib/auth";
import API from "../../core/services/apiService";
import {
  getPasswordChecklistItems,
  getPasswordValidationMessage,
  validatePhone,
  validateStrongPassword,
} from "../../core/utils/validation";

type ProfileUser = AuthUser & {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  customId?: string;
  adminLevel?: "super" | "sub" | null;
  headline?: string;
  bio?: string;
  skills?: string[];
  status?: string;
  experienceYears?: number;
  published?: boolean;
};

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ProfilePageContent() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    avatar: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const isEditModeRef = useRef(isEditMode);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePanel = useMemo(() => {
    const role = user?.role?.toLowerCase() || "";
    if (role.includes("admin")) return "Admin";
    if (role.includes("client")) return "Client";
    if (role.includes("developer") || role.includes("dev")) return "Developer";
    return "User";
  }, [user?.role]);

  const passwordChecklist = useMemo(
    () => getPasswordChecklistItems(passwordForm.newPassword),
    [passwordForm.newPassword]
  );

  const panelDetails = useMemo(() => {
    if (!user) return [];

    if (activePanel === "Admin") {
      return [{ label: "Admin Level", value: user.adminLevel ? `${user.adminLevel} admin` : "Admin" }];
    }

    if (activePanel === "Developer") {
      return [
        { label: "Status", value: user.status || "active" },
        { label: "Experience", value: `${user.experienceYears || 0} years` },
        { label: "Published", value: user.published ? "Yes" : "No" },
      ];
    }

    return [{ label: "Client Status", value: user.createdAt ? "Active client" : "Active" }];
  }, [activePanel, user]);

  const syncLocalUser = (nextUser: ProfileUser) => {
    const token = getToken();
    if (token) {
      setAuthSession(token, nextUser);
    } else if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(nextUser));
    }
    setUser(nextUser);
    window.dispatchEvent(new Event("userProfileUpdated"));
  };

  const hydrateForm = (nextUser: ProfileUser) => {
    setProfileForm({
      name: nextUser.name || "",
      email: nextUser.email || "",
      phone: nextUser.phone || "",
      company: nextUser.company || "",
      avatar: nextUser.avatar || "",
    });
  };

  const setEditMode = (nextValue: boolean) => {
    isEditModeRef.current = nextValue;
    setIsEditMode(nextValue);
  };

  const handleEnterEditMode = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    clearFeedback();
    setEditMode(true);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await API.get("/users/profile");
      const liveUser = (response.data.user || response.data.data) as ProfileUser | undefined;
      if (!liveUser) {
        throw new Error("Profile data missing");
      }
      syncLocalUser(liveUser);
      if (!isEditModeRef.current) {
        hydrateForm(liveUser);
      }
      setError("");
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile data");
      const storedUser = getStoredUser() as ProfileUser | null;
      if (storedUser) {
        setUser(storedUser);
        if (!isEditModeRef.current) {
          hydrateForm(storedUser);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isEditModeRef.current = isEditMode;
  }, [isEditMode]);

  useEffect(() => {
    const storedUser = getStoredUser() as ProfileUser | null;
    if (storedUser) {
      setUser(storedUser);
      hydrateForm(storedUser);
    }
    fetchUserProfile();
  }, []);

  const clearFeedback = () => {
    setMessage("");
    setError("");
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError("Image size should be less than 1MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setProfileForm((prev) => ({ ...prev, avatar: base64 }));
      clearFeedback();
    };
    reader.readAsDataURL(file);
  };

  const handleProfileUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    clearFeedback();

    if (profileForm.phone && !validatePhone(profileForm.phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    setProfileSaving(true);
    try {
      const response = await API.put("/users/update", {
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
        company: profileForm.company.trim(),
        avatar: profileForm.avatar,
      });
      const updatedUser = (response.data.user || response.data.data) as ProfileUser | undefined;
      if (!updatedUser) {
        throw new Error("Updated profile missing");
      }
      syncLocalUser(updatedUser);
      hydrateForm(updatedUser);
      setMessage("Profile updated successfully");
      setEditMode(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleCancelEdit = () => {
    clearFeedback();
    if (user) hydrateForm(user);
    setEditMode(false);
  };

  const handleShowPasswordForm = (event?: React.MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault();
    event?.stopPropagation();
    clearFeedback();
    setShowPasswordForm(true);
  };

  const handleClosePasswordForm = () => {
    setShowPasswordForm(false);
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setPasswordForm(emptyPasswordForm);
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    clearFeedback();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError("Please complete all password fields");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (passwordForm.currentPassword === passwordForm.newPassword) {
      setError("New password must be different from your current password");
      return;
    }
    if (!validateStrongPassword(passwordForm.newPassword)) {
      setError(getPasswordValidationMessage());
      return;
    }

    setPasswordSaving(true);
    try {
      await API.post("/users/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm(emptyPasswordForm);
      setMessage("Password changed successfully");
      handleClosePasswordForm();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to change password");
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading && !user) {
    return (
      <div style={styles.loadingState}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Loading your profile...</p>
      </div>
    );
  }

  if (!user) return null;

  const initials = (profileForm.name || user.name || "U").charAt(0).toUpperCase();
  const avatarSrc = profileForm.avatar || user.avatar || "";
  const joinedLabel = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";
  const accountId = user.customId || user.id || user._id || "Not available";
  const isDeveloperPanel = activePanel === "Developer";

  return (
    <div style={styles.page} className="wsd-page admin-panel-scope client-profile-page">
      <div style={styles.heroCard} className="profile-hero-card">
        <div style={styles.heroGradient} className="profile-hero-gradient" />
        <div style={styles.heroContent} className="profile-hero-content">
          <div style={styles.heroAvatarWrap} className="profile-avatar-wrap">
            {avatarSrc ? (
              <img src={avatarSrc} alt={user.name} style={styles.heroAvatar} className="profile-hero-avatar" />
            ) : (
              <div style={styles.heroAvatarFallback} className="profile-avatar-fallback">{initials}</div>
            )}
            <button
              type="button"
              style={{
                ...styles.avatarAction,
                opacity: isEditMode ? 1 : 0.4,
                cursor: isEditMode ? "pointer" : "not-allowed",
              }}
              onClick={() => fileInputRef.current?.click()}
              disabled={!isEditMode}
              className="profile-avatar-action"
            >
              <Camera size={16} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </div>

          <div style={styles.heroText} className="profile-hero-text">
            <h1 style={styles.title} className="profile-hero-title">{user.name}</h1>
            <p style={styles.subtitle} className="profile-hero-subtitle">{user.email}</p>
            <div style={styles.heroMetaRow} className="profile-hero-meta">
              <span style={styles.roleBadge} className="profile-role-badge">{user.role.toUpperCase()}</span>
              <span style={styles.metaPill} className="profile-meta-pill">Member since {joinedLabel}</span>
              <span style={styles.metaPill} className="profile-meta-pill">Account ID {accountId}</span>
            </div>
          </div>
        </div>
      </div>

      {message ? <div style={styles.successBanner} className="profile-banner profile-success-banner">{message}</div> : null}
      {error ? <div style={styles.errorBanner} className="profile-banner profile-error-banner">{error}</div> : null}

      <div style={styles.grid}>
        <section style={styles.primaryColumn} className="profile-primary-column">
          <div style={styles.card} className="wsd-unified-card profile-card">
            <div style={styles.cardHeader} className="profile-card-header">
              <div style={styles.cardHeaderTitle} className="profile-card-header-title">
                <User size={18} />
                <h2 style={styles.cardTitle} className="profile-card-title">Profile Information</h2>
              </div>
              <p style={styles.cardDescription} className="profile-card-description">
                Manage your {activePanel.toLowerCase()} profile details. Fields stay read-only until you choose Edit.
              </p>
            </div>

            <form onSubmit={handleProfileUpdate} style={styles.form} className="profile-form">
              <div style={styles.summaryList} className="profile-summary-list">
                {panelDetails.map((detail) => (
                  <div key={detail.label} style={styles.summaryRow} className="profile-summary-row">
                    <span style={styles.summaryLabel} className="profile-summary-label">{detail.label}</span>
                    <span style={styles.summaryValue} className="profile-summary-value">{detail.value}</span>
                  </div>
                ))}
              </div>

              <div style={styles.formGrid} className="profile-form-grid">
                <label style={styles.field} className="profile-field">
                  <span style={styles.label} className="profile-label">Full Name</span>
                  <div style={styles.inputWrap} className="profile-input-wrap">
                    <User size={16} color="var(--text-secondary)" />
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, name: event.target.value }))}
                      style={styles.input}
                      className="profile-input"
                      readOnly={!isEditMode}
                      required
                      aria-readonly={!isEditMode}
                    />
                  </div>
                </label>

                <label style={styles.field} className="profile-field">
                  <span style={styles.label} className="profile-label">Email Address</span>
                  <div style={{ ...styles.inputWrap, ...styles.readOnlyWrap }} className="profile-input-wrap">
                    <Mail size={16} color="var(--text-secondary)" />
                    <input type="email" value={profileForm.email} style={styles.input} className="profile-input" readOnly />
                  </div>
                  <span style={styles.helperText} className="profile-helper-text">Email is read-only for account security.</span>
                </label>

                <label style={styles.field} className="profile-field">
                  <span style={styles.label} className="profile-label">Phone Number</span>
                  <div style={styles.inputWrap} className="profile-input-wrap">
                    <Phone size={16} color="var(--text-secondary)" />
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, phone: event.target.value }))}
                      style={styles.input}
                      className="profile-input"
                      placeholder="+1 (555) 000-0000"
                      readOnly={!isEditMode}
                      aria-readonly={!isEditMode}
                    />
                  </div>
                </label>

                <label style={styles.field} className="profile-field">
                  <span style={styles.label} className="profile-label">Company</span>
                  <div style={styles.inputWrap} className="profile-input-wrap">
                    <Building size={16} color="var(--text-secondary)" />
                    <input
                      type="text"
                      value={profileForm.company}
                      onChange={(event) => setProfileForm((prev) => ({ ...prev, company: event.target.value }))}
                      style={styles.input}
                      className="profile-input"
                      placeholder="Your company"
                      readOnly={!isEditMode}
                      aria-readonly={!isEditMode}
                    />
                  </div>
                </label>
              </div>

              {isDeveloperPanel && (
                <div style={styles.developerPanelNote} className="profile-dev-note">
                  <strong>Developer profile:</strong> Public portfolio fields such as skills, headline, and availability are managed by the admin team section. Personal contact details can be edited here.
                </div>
              )}

              <div style={styles.actionRow} className="profile-action-row">
                {!isEditMode ? (
                  <>
                    <button type="button" style={styles.primaryButton} onClick={handleEnterEditMode} className="profile-btn profile-primary-btn">
                      <User size={16} />
                      Edit
                    </button>
                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={handleShowPasswordForm}
                      className="profile-btn profile-secondary-btn"
                    >
                      <Lock size={16} />
                      Change Password
                    </button>
                  </>
                ) : (
                  <>
                    <button type="submit" style={styles.primaryButton} disabled={profileSaving} className="profile-btn profile-primary-btn">
                      <Save size={16} />
                      {profileSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={handleCancelEdit}
                      disabled={profileSaving}
                      className="profile-btn profile-secondary-btn"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={handleShowPasswordForm}
                      className="profile-btn profile-secondary-btn"
                    >
                      <Lock size={16} />
                      Change Password
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          {showPasswordForm && (
            <div style={styles.card} className="wsd-unified-card profile-card profile-password-card">
              <div style={styles.cardHeader} className="profile-card-header">
                <div style={styles.cardHeaderTitle} className="profile-card-header-title">
                  <Lock size={18} />
                  <h2 style={styles.cardTitle} className="profile-card-title">Change Password</h2>
                </div>
                <p style={styles.cardDescription} className="profile-card-description">Use a strong password and confirm it before saving.</p>
              </div>

              <form onSubmit={handlePasswordChange} style={styles.form} className="profile-form">
                <label style={styles.field} className="profile-field">
                  <span style={styles.label} className="profile-label">Current Password</span>
                  <div style={styles.passwordWrap} className="profile-password-wrap">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(event) =>
                        setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))
                      }
                      style={styles.passwordInput}
                      className="profile-password-input"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((value) => !value)}
                      style={styles.eyeButton}
                      aria-label="Toggle current password visibility"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>

                <label style={styles.field} className="profile-field">
                  <span style={styles.label} className="profile-label">New Password</span>
                  <div style={styles.passwordWrap} className="profile-password-wrap">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                      style={styles.passwordInput}
                      className="profile-password-input"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((value) => !value)}
                      style={styles.eyeButton}
                      aria-label="Toggle new password visibility"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>

                <label style={styles.field} className="profile-field">
                  <span style={styles.label} className="profile-label">Confirm New Password</span>
                  <div style={styles.passwordWrap} className="profile-password-wrap">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(event) =>
                        setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))
                      }
                      style={styles.passwordInput}
                      className="profile-password-input"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      style={styles.eyeButton}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p style={styles.helperText} className="profile-helper-text">{getPasswordValidationMessage()}</p>
                </label>

                <div style={styles.checklist} className="profile-checklist">
                  {passwordChecklist.map((item) => (
                    <div key={item.key} style={styles.checklistRow} className="profile-checklist-row">
                      <span
                        style={{
                          ...styles.checklistDot,
                          backgroundColor: item.met ? "#22C55E" : "rgba(148, 163, 184, 0.5)",
                        }}
                        className="profile-checklist-dot"
                      />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.actionRow} className="profile-action-row">
                  <button type="submit" style={styles.secondaryButton} disabled={passwordSaving} className="profile-btn profile-primary-btn">
                    <ShieldCheck size={16} />
                    {passwordSaving ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={handleClosePasswordForm}
                    disabled={passwordSaving}
                    className="profile-btn profile-secondary-btn"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-hero-card {
            border-radius: 16px !important;
            margin-bottom: 12px !important;
          }
          .profile-hero-gradient {
            height: 56px !important;
          }
          .profile-hero-content {
            display: flex !important;
            flex-direction: row !important;
            align-items: flex-end !important;
            text-align: left !important;
            padding: 0 12px 12px !important;
            margin-top: -30px !important;
            gap: 12px !important;
            flex-wrap: nowrap !important;
          }
          .profile-avatar-wrap {
            width: 62px !important;
            height: 62px !important;
            flex-shrink: 0 !important;
          }
          .profile-hero-avatar,
          .profile-avatar-fallback {
            border-radius: 16px !important;
            border-width: 3px !important;
            font-size: 22px !important;
          }
          .profile-avatar-action {
            width: 22px !important;
            height: 22px !important;
            right: -2px !important;
            bottom: -2px !important;
          }
          .profile-avatar-action svg {
            width: 11px !important;
            height: 11px !important;
          }
          .profile-hero-text {
            flex: 1 1 auto !important;
            min-width: 0 !important;
          }
          .profile-hero-title {
            font-size: 16px !important;
            margin: 0 !important;
            line-height: 1.25 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .profile-hero-subtitle {
            font-size: 11.5px !important;
            margin: 2px 0 6px !important;
            line-height: 1.2 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
          }
          .profile-hero-meta {
            justify-content: flex-start !important;
            gap: 5px !important;
          }
          .profile-role-badge {
            padding: 2.5px 7px !important;
            font-size: 9.5px !important;
            border-radius: 6px !important;
          }
          .profile-meta-pill {
            padding: 2.5px 7px !important;
            font-size: 9.5px !important;
            border-radius: 6px !important;
          }
          .profile-banner {
            padding: 8px 12px !important;
            font-size: 11.5px !important;
            border-radius: 10px !important;
            margin-bottom: 10px !important;
          }
          .profile-card {
            padding: 12px 14px !important;
            border-radius: 14px !important;
          }
          .profile-card-header {
            margin-bottom: 10px !important;
          }
          .profile-card-header-title {
            gap: 6px !important;
            margin-bottom: 2px !important;
          }
          .profile-card-header-title svg {
            width: 15px !important;
            height: 15px !important;
          }
          .profile-card-title {
            font-size: 14.5px !important;
          }
          .profile-card-description {
            font-size: 11px !important;
            line-height: 1.35 !important;
          }
          .profile-form {
            gap: 10px !important;
          }
          .profile-summary-list {
            gap: 6px !important;
            margin-bottom: 4px !important;
          }
          .profile-summary-row {
            padding-bottom: 6px !important;
          }
          .profile-summary-label,
          .profile-summary-value {
            font-size: 11.5px !important;
          }
          .profile-form-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          .profile-field {
            gap: 3px !important;
          }
          .profile-label {
            font-size: 11.5px !important;
          }
          .profile-input-wrap {
            min-height: 38px !important;
            height: 38px !important;
            padding: 0 10px !important;
            border-radius: 9px !important;
            gap: 8px !important;
          }
          .profile-input-wrap svg {
            width: 13px !important;
            height: 13px !important;
          }
          .profile-input-wrap input {
            font-size: 12.5px !important;
          }
          .profile-helper-text {
            font-size: 10.5px !important;
            margin: 1px 0 0 !important;
          }
          .profile-action-row {
            gap: 8px !important;
            margin-top: 4px !important;
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
          }
          .profile-btn {
            min-width: 0 !important;
            flex: 1 1 auto !important;
            min-height: 35px !important;
            height: 35px !important;
            padding: 0 10px !important;
            font-size: 12px !important;
            border-radius: 8px !important;
            white-space: nowrap !important;
            gap: 5px !important;
          }
          .profile-btn svg {
            width: 13px !important;
            height: 13px !important;
          }
          .profile-password-card {
            padding: 12px 14px !important;
            border-radius: 14px !important;
          }
          .profile-password-wrap {
            min-height: 38px !important;
            height: 38px !important;
            border-radius: 9px !important;
            padding-left: 10px !important;
          }
          .profile-password-input {
            font-size: 12.5px !important;
          }
          .profile-checklist {
            padding: 8px 10px !important;
            gap: 5px !important;
            border-radius: 9px !important;
          }
          .profile-checklist-row {
            font-size: 11px !important;
            gap: 6px !important;
          }
          .profile-checklist-dot {
            width: 6px !important;
            height: 6px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, any> = {
  page: {
    padding: 0,
    width: "100%",
    maxWidth: "100%",
    margin: 0,
    color: "var(--text-primary)",
  },
  heroCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: "28px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-primary)",
    boxShadow: "0 18px 48px rgba(15, 23, 42, 0.06)",
    marginBottom: "24px",
  },
  heroGradient: {
    height: "140px",
    background: "linear-gradient(135deg, #007AFF 0%, #22C55E 100%)",
  },
  heroContent: {
    display: "flex",
    gap: "24px",
    alignItems: "flex-end",
    padding: "0 28px 28px",
    marginTop: "-52px",
    flexWrap: "wrap",
  },
  heroAvatarWrap: {
    position: "relative",
    width: "120px",
    height: "120px",
  },
  heroAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: "28px",
    objectFit: "cover",
    border: "5px solid var(--bg-primary)",
    backgroundColor: "var(--bg-secondary)",
  },
  heroAvatarFallback: {
    width: "100%",
    height: "100%",
    borderRadius: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    fontWeight: 700,
    color: "#FFFFFF",
    border: "5px solid var(--bg-primary)",
    background: "linear-gradient(135deg, #2563EB 0%, #14B8A6 100%)",
  },
  avatarAction: {
    position: "absolute",
    right: "-4px",
    bottom: "-4px",
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    border: "2px solid var(--bg-primary)",
    backgroundColor: "#0F172A",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  heroText: {
    flex: 1,
    minWidth: "260px",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: "-0.04em",
  },
  subtitle: {
    margin: "8px 0 14px",
    color: "var(--text-secondary)",
    fontSize: "15px",
  },
  heroMetaRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "999px",
    padding: "7px 12px",
    backgroundColor: "rgba(0, 122, 255, 0.12)",
    color: "#007AFF",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.06em",
  },
  metaPill: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "999px",
    padding: "7px 12px",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-secondary)",
    fontSize: "12px",
    fontWeight: 600,
  },
  successBanner: {
    marginBottom: "16px",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(34, 197, 94, 0.35)",
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    color: "#15803D",
    fontSize: "14px",
    fontWeight: 600,
  },
  errorBanner: {
    marginBottom: "16px",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(239, 68, 68, 0.35)",
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    color: "#DC2626",
    fontSize: "14px",
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: "24px",
    alignItems: "start",
    width: "100%",
  },
  primaryColumn: {
    display: "grid",
    gap: "24px",
    width: "100%",
  },
  secondaryColumn: {
    display: "grid",
    gap: "24px",
  },
  card: {
    backgroundColor: "var(--bg-primary)",
    borderRadius: "24px",
    border: "1px solid var(--border-color)",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
    padding: "clamp(20px, 3vw, 32px)",
    width: "100%",
  },
  cardHeader: {
    marginBottom: "20px",
  },
  cardHeaderTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
    color: "#007AFF",
  },
  cardTitle: {
    margin: 0,
    color: "var(--text-primary)",
    fontSize: "18px",
    fontWeight: 700,
  },
  cardDescription: {
    margin: 0,
    color: "var(--text-secondary)",
    fontSize: "14px",
    lineHeight: 1.5,
  },
  form: {
    display: "grid",
    gap: "18px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
    width: "100%",
  },
  field: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minHeight: "50px",
    padding: "0 14px",
    borderRadius: "14px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
  },
  readOnlyWrap: {
    opacity: 0.8,
  },
  input: {
    flex: 1,
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    color: "var(--text-primary)",
    fontSize: "14px",
    minWidth: 0,
  },
  passwordWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    minHeight: "50px",
    borderRadius: "14px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
    paddingLeft: "14px",
  },
  passwordInput: {
    flex: 1,
    border: "none",
    outline: "none",
    backgroundColor: "transparent",
    color: "var(--text-primary)",
    fontSize: "14px",
    paddingRight: "44px",
  },
  eyeButton: {
    position: "absolute",
    right: "12px",
    border: "none",
    background: "transparent",
    color: "var(--text-secondary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  helperText: {
    margin: "2px 0 0",
    color: "var(--text-secondary)",
    fontSize: "12px",
    lineHeight: 1.5,
  },
  checklist: {
    display: "grid",
    gap: "10px",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
  },
  checklistRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "13px",
    color: "var(--text-primary)",
  },
  checklistDot: {
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    flexShrink: 0,
  },
  actionRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    width: "100%",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minWidth: "160px",
    minHeight: "46px",
    padding: "0 18px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#007AFF",
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    minWidth: "180px",
    minHeight: "46px",
    padding: "0 18px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "#0F766E",
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  preferenceList: {
    display: "grid",
    gap: "14px",
  },
  preferenceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "14px 0",
    borderBottom: "1px solid var(--border-color)",
  },
  preferenceTitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  preferenceDescription: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "var(--text-secondary)",
    lineHeight: 1.5,
  },
  switch: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
  },
  switchTrack: {
    width: "46px",
    height: "24px",
    borderRadius: "999px",
    padding: "2px",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
  },
  switchThumb: {
    width: "20px",
    height: "20px",
    borderRadius: "999px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 2px 6px rgba(15, 23, 42, 0.25)",
    transition: "transform 0.2s ease",
  },
  summaryList: {
    display: "grid",
    gap: "14px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    paddingBottom: "14px",
    borderBottom: "1px solid var(--border-color)",
  },
  summaryLabel: {
    fontSize: "13px",
    color: "var(--text-secondary)",
    fontWeight: 600,
  },
  summaryValue: {
    fontSize: "13px",
    color: "var(--text-primary)",
    fontWeight: 700,
    textAlign: "right",
  },
  developerPanelNote: {
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(0, 122, 255, 0.22)",
    backgroundColor: "rgba(0, 122, 255, 0.08)",
    color: "var(--text-primary)",
    fontSize: "13px",
    lineHeight: 1.5,
  },
  loadingState: {
    minHeight: "50vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
  },
  spinner: {
    width: "34px",
    height: "34px",
    borderRadius: "999px",
    border: "3px solid var(--border-color)",
    borderTopColor: "#007AFF",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    margin: 0,
    color: "var(--text-secondary)",
    fontSize: "14px",
  },
};
