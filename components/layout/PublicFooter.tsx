"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { publicFooterConfig } from "../../core/config/publicSite";
import { SOCIAL_PLATFORM_META, type SocialPlatformMeta } from "../../lib/social-platforms";
import API from "../../core/services/apiService";
import { usePublicTheme } from "../../app/providers/PublicThemeProvider";

type SocialItem = SocialPlatformMeta & { href: string };

export default function PublicFooter() {
  const pathname = usePathname();
  const { publicTheme } = usePublicTheme();
  const isDark = publicTheme === "dark";
  const year = new Date().getFullYear();
  const [socials, setSocials] = useState<SocialItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    API.get("/settings/public/contact_info")
      .then((res) => {
        if (cancelled || !res.data?.success || !res.data?.data) return;
        const data = res.data.data;
        setSocials(
          SOCIAL_PLATFORM_META.map((platform) => ({
            ...platform,
            href: data[platform.key] || "",
          })).filter((item) => Boolean(item.href))
        );
      })
      .catch(() => {
        // Footer keeps brand/sections; socials stay hidden when settings cannot load.
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
        backgroundColor: isDark ? "#070B14" : "var(--bg-secondary)",
        borderTop: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid var(--border-color)",
      }}
    >
      <div style={styles.content} className="landing-footer-content">
        <div style={styles.section} className="public-footer-brand">
          <div style={styles.brandRow} className="public-footer-brand-row">
            <span
              className="public-footer-logo-shell"
              style={{
                ...styles.footerLogoShell,
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "var(--bg-primary)",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid var(--border-color)",
              }}
            >
              <Image src="/images/icon.png" alt="Websmith Digital icon" width={48} height={48} style={styles.footerLogo} className="public-footer-logo-img" />
            </span>
            <Image
              src="/images/wordmark1.png"
              alt={publicFooterConfig.brand.name}
              width={235}
              height={50}
              className="public-footer-wordmark"
              style={{ height: "50px", width: "auto", objectFit: "contain" }}
            />
          </div>
          <p style={styles.tagline} className="public-footer-tagline">{publicFooterConfig.brand.tagline}</p>
          <p style={styles.aboutSummary} className="public-footer-about">
            We design smart solutions and build powerful digital ecosystems that help businesses grow and automate through innovation and practicality.
          </p>
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
                    style={styles.socialLink}
                    className="public-footer-social"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="public-footer-links-grid">
          {publicFooterConfig.sections.map((section, idx) => (
            <div key={section.title} style={styles.section} className={`public-footer-nav-col public-footer-nav-col-${idx}`}>
              <h4 style={styles.sectionTitle} className="public-footer-col-title">{section.title}</h4>
              <div className="public-footer-link-list">
                {section.links.map((link) => (
                  <Link key={`${section.title}-${link.href}`} href={link.href} style={styles.link} className="public-footer-link">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={styles.bottomBar} className="public-footer-bottom-bar">
        <p style={styles.bottomText} className="public-footer-bottom-text">© {year} Websmith Digital. All Rights Reserved. Developed with care by the Websmith Digital Team.</p>
      </div>
      <style>{`
        .public-footer-links-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 32px;
          flex: 1;
        }
        .public-footer-link-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .public-footer-link,
        .public-footer-social {
          transition: all 0.24s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .public-footer-link:hover {
          color: #007AFF !important;
          transform: translateX(4px);
        }
        .public-footer-social:hover {
          border-color: rgba(0, 122, 255, 0.35) !important;
          color: #007AFF !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 24px rgba(0, 122, 255, 0.14);
        }
        @media (max-width: 768px) {
          .public-footer-root {
            padding: 24px 0 14px !important;
          }
          .landing-footer-content {
            display: flex !important;
            flex-direction: column !important;
            gap: 16px !important;
            margin-bottom: 16px !important;
            padding: 0 16px !important;
          }
          .public-footer-brand {
            gap: 8px !important;
          }
          .public-footer-brand-row {
            gap: 10px !important;
          }
          .public-footer-logo-shell {
            width: 34px !important;
            height: 34px !important;
            border-radius: 9px !important;
            padding: 2px !important;
          }
          .public-footer-logo-img {
            width: 100% !important;
            height: 100% !important;
          }
          .public-footer-wordmark {
            height: 30px !important;
            width: auto !important;
          }
          .public-footer-tagline {
            font-size: 11.5px !important;
            line-height: 1.35 !important;
            margin: 0 !important;
          }
          .public-footer-about {
            display: none !important;
          }
          .public-footer-social-row {
            gap: 8px !important;
            margin-top: 4px !important;
          }
          .public-footer-social {
            width: 28px !important;
            height: 28px !important;
          }
          .public-footer-social svg {
            width: 13px !important;
            height: 13px !important;
          }
          .public-footer-links-grid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 16px 12px !important;
          }
          .public-footer-nav-col {
            gap: 6px !important;
          }
          .public-footer-nav-col-2 {
            grid-column: 1 / -1 !important;
            margin-top: 2px !important;
          }
          .public-footer-nav-col-2 .public-footer-link-list {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 4px 12px !important;
          }
          .public-footer-col-title {
            font-size: 12px !important;
            font-weight: 700 !important;
            margin-bottom: 2px !important;
            color: var(--text-primary) !important;
          }
          .public-footer-link-list {
            display: flex;
            flex-direction: column;
            gap: 4px !important;
          }
          .public-footer-link {
            font-size: 11px !important;
            line-height: 1.3 !important;
            padding: 1px 0 !important;
          }
          .public-footer-bottom-bar {
            padding-top: 12px !important;
            margin: 0 16px !important;
          }
          .public-footer-bottom-text {
            font-size: 10px !important;
            line-height: 1.35 !important;
          }
        }
      `}</style>
    </footer>
  );
}

const styles: Record<string, CSSProperties> = {
  footer: {
    backgroundColor: "var(--bg-secondary)",
    borderTop: "1px solid var(--border-color)",
    padding: "48px 0 24px",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    width: "100%",
    maxWidth: "100%",
    margin: 0,
    padding: "0 clamp(16px, 4vw, 48px)",
    marginBottom: "40px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexShrink: 0,
  },
  footerLogoShell: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    overflow: "hidden",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    flexShrink: 0,
    padding: "3px",
  },
  footerLogo: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transform: "scale(1.2)",
  },
  brandName: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  tagline: {
    margin: 0,
    fontSize: "14px",
    color: "var(--text-secondary)",
    lineHeight: 1.6,
  },
  aboutSummary: {
    margin: "8px 0 0",
    fontSize: "13px",
    color: "var(--text-secondary)",
    lineHeight: 1.6,
    opacity: 0.8,
  },
  socialRow: {
    display: "flex",
    gap: "16px",
    marginTop: "8px",
  },
  socialLink: {
    width: "36px",
    height: "36px",
    borderRadius: "999px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    fontSize: "11px",
    fontWeight: 700,
  },
  sectionTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  link: {
    fontSize: "14px",
    color: "var(--text-secondary)",
    textDecoration: "none",
  },
  bottomBar: {
    textAlign: "center",
    paddingTop: "24px",
    borderTop: "1px solid var(--border-color)",
    margin: "0 clamp(16px, 4vw, 48px)",
  },
  bottomText: {
    margin: 0,
    color: "var(--text-secondary)",
    fontSize: "12px",
  },
};
