import type { MetadataRoute } from "next";
import { getSiteUrl } from "../core/config/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/internal/",
        "/client/",
        "/clients/",
        "/dashboard/",
        "/developer/",
        "/api/",
        "/settings/",
        "/invoices/",
        "/payments/",
        "/tasks/",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
