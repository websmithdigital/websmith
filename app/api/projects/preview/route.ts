import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl || !rawUrl.trim()) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  let formattedUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }

  // Generate robust high-resolution screenshot thumbnail via WordPress mShots
  const screenshotUrl = `https://s0.wp.com/mshots/v1/${encodeURIComponent(formattedUrl)}?w=1280&h=800`;

  let ogImage = "";
  let title = "";
  let description = "";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(formattedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const html = await response.text();

      // Extract OpenGraph / Twitter Image
      const ogMatch =
        html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
        html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);

      if (ogMatch && ogMatch[1]) {
        let rawImg = ogMatch[1].trim();
        if (rawImg.startsWith("//")) {
          ogImage = `https:${rawImg}`;
        } else if (rawImg.startsWith("/")) {
          const origin = new URL(formattedUrl).origin;
          ogImage = `${origin}${rawImg}`;
        } else if (/^https?:\/\//i.test(rawImg)) {
          ogImage = rawImg;
        }
      }

      // Extract Title
      const titleMatch =
        html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        title = titleMatch[1].trim().replace(/\s+/g, " ");
      }

      // Extract Description
      const descMatch =
        html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
      if (descMatch && descMatch[1]) {
        description = descMatch[1].trim().replace(/\s+/g, " ");
      }
    }
  } catch {
    // If fetch fails or site blocks automated crawlers, gracefully proceed with screenshot
  }

  return NextResponse.json({
    success: true,
    url: formattedUrl,
    previewImage: ogImage || screenshotUrl,
    ogImage: ogImage || null,
    screenshotUrl,
    title: title || "",
    description: description || "",
  });
}
