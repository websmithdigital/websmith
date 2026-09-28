"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { Mail, Phone, MapPin, ShieldCheck, ArrowUpRight } from "lucide-react";
import { publicFooterConfig } from "../../core/config/publicSite";
import { SOCIAL_PLATFORM_META, type SocialPlatformMeta } from "../../lib/social-platforms";
import API from "../../core/services/apiService";
import { usePublicTheme } from "../../app/providers/PublicThemeProvider";

type SocialItem = SocialPlatformMeta & { href: string };

const DEFAULT_CONTACT = {
  email: "support@websmithdigital.com",
  phone: "+1 815-426-9572",
  headquarters: "T-35, Rajarhat Main Road, Diamond Enclave, Kolkata - 700157",
};

export default function PublicFooter() {
  const pathname = usePathname();
  const { publicTheme } = usePublicTheme();
  const isDark = publicTheme === "dark";
  const year = new Date().getFullYear();

  const [socials, setSocials] = useState<SocialItem[]>([]);
  const [contact, setContact] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    let cancelled = false;
    API.get("/settings/public/contact_info")
      .then((res) => {
        if (cancelled || !res.data?.success || !res.data?.data) return;
        const data = res.data.data;
        if (data.email || data.phone || data.headquarters) {
          setContact({
            email: data.email || DEFAULT_CONTACT.email,
            phone: data.phone || DEFAULT_CONTACT.phone,
            headquarters: data.headquarters || DEFAULT_CONTACT.headquarters,
          });
        }
        setSocials(
          SOCIAL_PLATFORM_META.map((platform) => ({
            ...platform,
            href: data[platform.key] || "",
          })).filter((item) => Boolean(item.href))
        );
      })
      .catch(() => {
        // Fallback to defaults gracefully
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <footer
      className="public-footer-root"
      style={{
        ...styles.footer,
        backgroundColor: isDark ? "#060A12" : "#f8fafc",
        borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
      }}
    >
      <div style={styles.content} className="landing-footer-content">
        {/* Brand Column */}
        <div style={styles.brandCol} className="public-footer-brand">
          <div style={styles.brandRow} className="public-footer-brand-row">
            <span
              className="public-footer-logo-shell"
              style={{
                ...styles.footerLogoShell,
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#ffffff",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid #e2e8f0",
              }}
            >
              <Image
                src="/images/icon.png"
                alt="WebSmith Digital icon"
                width={48}
                height={48}
                style={styles.footerLogo}
                className="public-footer-logo-img"
              />
            </span>
            <Image
              src="/images/wordmark1.png"
              alt={publicFooterConfig.brand.name}
              width={220}
              height={46}
              className="public-footer-wordmark"
              style={{ height: "46px", width: "auto", objectFit: "contain" }}
            />
          </div>

          <p style={styles.tagline} className="public-footer-tagline">
            {publicFooterConfig.brand.tagline}
          </p>

          {/* Direct Contact Items */}
          <div style={styles.contactList} className="public-footer-contact-list">
            <a
              href={`mailto:${contact.email}`}
              style={styles.contactItem}
              className="public-footer-contact-link"
              title="Email support"
            >
              <Mail size={15} color="#3b82f6" />
              <span>{contact.email}</span>
            </a>
            <a
              href={`tel:${contact.phone.replace(/[^+\d]/g, "")}`}
              style={styles.contactItem}
              className="public-footer-contact-link"
              title="Call support"
            >
              <Phone size={15} color="#10b981" />
              <span>{contact.phone}</span>
            </a>
            <div style={styles.contactItem} className="public-footer-contact-text">
              <MapPin size={15} color="#a855f7" style={{ flexShrink: 0 }} />
              <span>{contact.headquarters}</span>
            </div>
          </div>

          {/* Social Links */}
          {socials.length > 0 && (
            <div style={styles.socialRow} className="public-footer-social-row">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    style={{
                      ...styles.socialLink,
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
                      borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "#e2e8f0",
                      color: isDark ? "#e2e8f0" : "#334155",
                    }}
                    className="public-footer-social"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          )}

          {/* Status Indicator Badge */}
          <div
            style={{
              ...styles.statusBadge,
              backgroundColor: isDark ? "rgba(16, 185, 129, 0.1)" : "rgba(16, 185, 129, 0.08)",
              border: isDark ? "1px solid rgba(16, 185, 129, 0.25)" : "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <span style={styles.statusDot} />
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#10b981" }}>
              All Systems Operational
            </span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="public-footer-links-grid">
          {publicFooterConfig.sections.map((section, idx) => (
            <div key={section.title} style={styles.navCol} className={`public-footer-nav-col public-footer-nav-col-${idx}`}>
              <h4 style={styles.sectionTitle} className="public-footer-col-title">
                {section.title}
              </h4>
              <div className="public-footer-link-list">
                {section.links.map((link) => (
                  <Link
                    key={`${section.title}-${link.href}`}
                    href={link.href}
                    style={styles.link}
                    className="public-footer-link"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div
        style={{
          ...styles.bottomBar,
          borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.06)" : "1px solid #e2e8f0",
          justifyContent: "center",
          textAlign: "center",
        }}
        className="public-footer-bottom-bar"
      >
        <p style={styles.bottomText} className="public-footer-bottom-text">
          © {year} WebSmith Digital. All Rights Reserved. Engineered for Scale & Performance.
        </p>
      </div>

      <style>{`
        .public-footer-links-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 36px;
          flex: 1;
        }
        .public-footer-link-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .public-footer-link,
        .public-footer-social,
        .public-footer-contact-link {
          transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .public-footer-link:hover {
          color: #3b82f6 !important;
          transform: translateX(4px);
        }
        .public-footer-contact-link:hover {
          color: #3b82f6 !important;
          opacity: 1 !important;
        }
        .public-footer-social:hover {
          border-color: rgba(59, 130, 246, 0.5) !important;
          color: #3b82f6 !important;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.15); }
        }
        .public-footer-status-dot {
          animation: statusPulse 2.4s ease-in-out infinite;
        }
        @media (max-width: 900px) {
          .landing-footer-content {
            flex-direction: column !important;
            gap: 32px !important;
          }
          .public-footer-links-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 24px !important;
          }
          .public-footer-bottom-bar {
            flex-direction: column !important;
            gap: 12px !important;
            text-align: center !important;
          }
        }
        @media (max-width: 600px) {
          .public-footer-links-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .public-footer-brand-row {
            gap: 10px !important;
          }
          .public-footer-logo-shell {
            width: 36px !important;
            height: 36px !important;
          }
        }
      `}</style>
    </footer>
  );
}

const styles: Record<string, CSSProperties> = {
  footer: {
    padding: "56px 0 28px",
    width: "100%",
  },
  content: {
    display: "flex",
    flexWrap: "wrap",
    gap: "48px",
    width: "100%",
    maxWidth: "100%",
    margin: 0,
    padding: "0 clamp(16px, 4vw, 48px)",
    marginBottom: "40px",
  },
  brandCol: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    maxWidth: "420px",
    flex: "1 1 320px",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexShrink: 0,
  },
  footerLogoShell: {
    width: "46px",
    height: "46px",
    borderRadius: "12px",
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: "2px",
  },
  footerLogo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  tagline: {
    margin: 0,
    fontSize: "13.5px",
    lineHeight: 1.6,
    color: "var(--text-secondary, #94a3b8)",
    opacity: 0.9,
  },
  contactList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "2px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "12.5px",
    color: "var(--text-secondary, #94a3b8)",
    textDecoration: "none",
    opacity: 0.85,
    lineHeight: 1.4,
  },
  socialRow: {
    display: "flex",
    gap: "10px",
    marginTop: "6px",
  },
  socialLink: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    border: "1px solid",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "5px 12px",
    borderRadius: "999px",
    width: "fit-content",
    marginTop: "4px",
  },
  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    boxShadow: "0 0 8px #10b981",
    display: "inline-block",
  },
  navCol: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary, #ffffff)",
    letterSpacing: "-0.01em",
  },
  link: {
    fontSize: "13px",
    color: "var(--text-secondary, #94a3b8)",
    textDecoration: "none",
    lineHeight: 1.4,
  },
  bottomBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "24px",
    margin: "0 clamp(16px, 4vw, 48px)",
  },
  bottomText: {
    margin: 0,
    color: "var(--text-secondary, #64748b)",
    fontSize: "12px",
    textAlign: "center",
  },
};
