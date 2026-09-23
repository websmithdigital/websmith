import API from "./apiService";
import { SEED_SERVICE_CATEGORIES } from "@/lib/cms/types";

export interface PublicService {
  id: string;
  name: string;
  description: string;
  badge?: string;
  icon?: string;
  subServices?: Array<{ id?: string; name: string; shortDescription?: string }>;
  price?: number | null;
}

export interface LeadPayload {
  name: string;
  email: string;
  phone?: string;
  callingPhone?: string;
  whatsappPhone?: string;
  company?: string;
  budget?: number | null;
  timeline?: string;
  preferredContactDate?: string;
  preferredContactTime?: string;
  timeZone?: string;
  adminCallTimeIST?: string;
  notes?: string;
  cmsRequirement?: string;
  appPlatform?: "iOS" | "Android" | "Both" | "";
  services: string[];
}

export const getPublicServices = async (): Promise<PublicService[]> => {
  try {
    const response = await API.get("/cms/services/categories", {
      params: { t: Date.now() },
      headers: {
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });
    const categories = response.data?.data;
    if (Array.isArray(categories) && categories.length > 0) {
      return categories.map((cat: any) => ({
        id: cat._id || cat.slug || cat.id,
        name: cat.name,
        description: cat.description,
        badge: cat.badge,
        icon: cat.icon,
        subServices: (cat.services || []).map((s: any) => ({
          id: s._id || s.slug,
          name: s.name,
          shortDescription: s.shortDescription,
        })),
      }));
    }
  } catch (error: any) {
    console.warn("Failed to fetch CMS categories for public services, falling back to seed data:", error?.message);
  }

  // Fallback to active CMS seed categories
  if (Array.isArray(SEED_SERVICE_CATEGORIES) && SEED_SERVICE_CATEGORIES.length > 0) {
    return SEED_SERVICE_CATEGORIES.map((cat: any) => ({
      id: cat.id || cat.slug,
      name: cat.name,
      description: cat.description,
      badge: cat.badge,
      icon: cat.icon,
      subServices: (cat.services || []).map((s: any) => ({
        id: s.slug || s.name,
        name: s.name,
        shortDescription: s.shortDescription,
      })),
    }));
  }

  return [];
};

export const createLead = async (payload: LeadPayload) => {
  try {
    const response = await API.post("/leads", payload);
    return response.data.data || response.data;
  } catch (error: any) {
    console.error("Create lead error:", error);
    throw new Error(error.response?.data?.message || "Failed to submit lead");
  }
};
