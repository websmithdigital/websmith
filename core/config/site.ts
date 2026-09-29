export const CANONICAL_SITE_URL = "https://websmithdigital.com";

export function getSiteUrl(): string {
  const envUrl = (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "")
  )?.trim();

  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin.replace(/\/$/, "");
  }

  // During SSR, builds, and SEO generation, default to canonical production domain
  return CANONICAL_SITE_URL;
}