import { apiHandler, jsonBody, json, unauthorized } from "@/lib/server/api";
import { DEFAULT_ABOUT_CONTENT, type AboutPageContent } from "@/lib/about-settings";

export const GET = apiHandler(async ({ db }) => {
  try {
    const settings = db.collection("settings");
    const doc = await settings.findOne({ key: "about_page" });
    const data = { ...DEFAULT_ABOUT_CONTENT, ...(doc?.value ?? {}) };
    return json({ data });
  } catch (error) {
    console.warn("Public about page settings read warning:", error instanceof Error ? error.message : error);
    return json({ data: DEFAULT_ABOUT_CONTENT });
  }
});

const saveHandler = async ({ db, request, user }: any) => {
  if (!user) throw unauthorized();
  if (user.role !== "admin") throw unauthorized("Insufficient permissions");
  const body = await jsonBody(request);
  const value = body?.value && typeof body.value === "object" ? body.value : body;

  const saved: AboutPageContent = {
    story_badge: String(value.story_badge ?? DEFAULT_ABOUT_CONTENT.story_badge).trim(),
    story_title: String(value.story_title ?? DEFAULT_ABOUT_CONTENT.story_title).trim(),
    story_lead: String(value.story_lead ?? DEFAULT_ABOUT_CONTENT.story_lead).trim(),
    story_body: String(value.story_body ?? DEFAULT_ABOUT_CONTENT.story_body).trim(),
    story_quote: String(value.story_quote ?? DEFAULT_ABOUT_CONTENT.story_quote).trim(),
    story_quote_author: String(value.story_quote_author ?? DEFAULT_ABOUT_CONTENT.story_quote_author).trim(),
    who_we_serve_title: String(value.who_we_serve_title ?? DEFAULT_ABOUT_CONTENT.who_we_serve_title).trim(),
    who_we_serve_subtitle: String(value.who_we_serve_subtitle ?? DEFAULT_ABOUT_CONTENT.who_we_serve_subtitle).trim(),
    who_we_serve_items: Array.isArray(value.who_we_serve_items) && value.who_we_serve_items.length > 0
      ? value.who_we_serve_items.map((item: any, idx: number) => ({
          id: String(item.id || `audience-${idx}`),
          tag: String(item.tag || ""),
          title: String(item.title || ""),
          description: String(item.description || ""),
          benefits: Array.isArray(item.benefits) ? item.benefits.map(String) : [],
        }))
      : DEFAULT_ABOUT_CONTENT.who_we_serve_items,
  };

  const settings = db.collection("settings");
  await settings.updateOne(
    { key: "about_page" },
    { $set: { key: "about_page", value: saved, updatedAt: new Date() } },
    { upsert: true }
  );

  return json({ data: saved, message: "About page settings updated successfully" });
};

export const PUT = apiHandler(saveHandler, { auth: "required" });
export const POST = apiHandler(saveHandler, { auth: "required" });
