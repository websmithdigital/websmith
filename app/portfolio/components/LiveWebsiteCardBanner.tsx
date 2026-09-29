"use client";

import { useState, useRef, useEffect } from "react";
import { ExternalLink, Globe, Camera, RefreshCw } from "lucide-react";

interface LiveWebsiteCardBannerProps {
  publicUrl?: string;
  previewImage?: string;
  name: string;
  category?: string;
  isDark: boolean;
}

export default function LiveWebsiteCardBanner({
  publicUrl,
  previewImage,
  name,
  category,
  isDark,
}: LiveWebsiteCardBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(380);
  const [viewMode, setViewMode] = useState<"live" | "snapshot">("snapshot");
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const cleanUrl = publicUrl?.trim();
  const hasLiveUrl = Boolean(cleanUrl && /^https?:\/\//i.test(cleanUrl));

  // Determine domain name for the browser address bar
  let domain = "";
  if (hasLiveUrl && cleanUrl) {
    try {
      domain = new URL(cleanUrl).hostname.replace(/^www\./, "");
    } catch {
      domain = cleanUrl.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
    }
  }

  // Measure container width for responsive iframe scaling
  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth || 380);
      }
    };
    updateSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(containerRef.current);
    } else {
      window.addEventListener("resize", updateSize);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  // Compute live website snapshot from URL if previewImage is empty or hardcoded mockup
  const isMockup = previewImage?.includes("/images/portfolio/");
  const liveSnapshotSrc = hasLiveUrl && cleanUrl
    ? `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=1280&h=800`
    : previewImage && !isMockup
    ? previewImage
    : "/images/websmith_original.jpg";

  // Iframe scale factor: desktop viewport is 1280px wide
  const scale = containerWidth > 0 ? Math.min(1, containerWidth / 1280) : 0.29;
  const viewportHeight = 205; // Banner height minus top browser bar (235 - 30)
  const iframeHeight = Math.round(viewportHeight / (scale || 0.29));

  // If no live URL or iframe failed, force snapshot
  const effectiveMode = hasLiveUrl && !iframeError ? viewMode : "snapshot";

  return (
    <div
      ref={containerRef}
      className="portfolio-card-banner group"
      style={{
        position: "relative",
        height: "235px",
        width: "100%",
        backgroundColor: isDark ? "#090d16" : "#0f172a",
        overflow: "hidden",
        borderBottom: isDark ? "1px solid rgba(255, 255, 255, 0.08)" : "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        userSelect: "none",
      }}
    >
      {/* Mini Browser Bar */}
      <div
        className="wsd-browser-chrome"
        style={{
          height: "30px",
          width: "100%",
          backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "#1e293b",
          backdropFilter: "blur(8px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 10px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          zIndex: 6,
          flexShrink: 0,
        }}
      >
        {/* macOS traffic light dots */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <span className="wsd-browser-dot" style={{ width: "7.5px", height: "7.5px", borderRadius: "50%", backgroundColor: "#ef4444", display: "inline-block" }} />
          <span className="wsd-browser-dot" style={{ width: "7.5px", height: "7.5px", borderRadius: "50%", backgroundColor: "#eab308", display: "inline-block" }} />
          <span className="wsd-browser-dot" style={{ width: "7.5px", height: "7.5px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block" }} />
        </div>

        {/* URL Pill & Status */}
        {hasLiveUrl && (
          <div
            className="wsd-browser-domain"
            style={{
              fontSize: "10.5px",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              color: "rgba(255, 255, 255, 0.85)",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              padding: "2px 8px",
              borderRadius: "4px",
              maxWidth: "180px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <span
              style={{
                width: "5.5px",
                height: "5.5px",
                borderRadius: "50%",
                backgroundColor: iframeLoaded ? "#22c55e" : "#38bdf8",
                display: "inline-block",
                boxShadow: iframeLoaded ? "0 0 6px #22c55e" : "0 0 4px #38bdf8",
              }}
            />
            {domain}
          </div>
        )}

        {/* Controls: Mode Switcher & Open Link */}
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          {hasLiveUrl && !iframeError && (
            <button
              type="button"
              className="wsd-browser-mode-btn"
              onClick={(e) => {
                e.stopPropagation();
                setViewMode(viewMode === "live" ? "snapshot" : "live");
              }}
              title={viewMode === "live" ? "Switch to high-res snapshot" : "Switch to live website iframe"}
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "0.03em",
                padding: "2.5px 7px",
                borderRadius: "5px",
                backgroundColor: viewMode === "live" ? "rgba(34, 197, 94, 0.18)" : "rgba(255, 255, 255, 0.08)",
                color: viewMode === "live" ? "#4ade80" : "rgba(255, 255, 255, 0.7)",
                border: viewMode === "live" ? "1px solid rgba(34, 197, 94, 0.4)" : "1px solid rgba(255, 255, 255, 0.12)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
                transition: "all 0.15s ease",
              }}
            >
              {viewMode === "live" ? (
                <>
                  <Camera size={10} /> SNAPSHOT
                </>
              ) : (
                <>
                  <Globe size={10} /> RUN LIVE
                </>
              )}
            </button>
          )}

          {hasLiveUrl && cleanUrl && (
            <a
              href={cleanUrl}
              target="_blank"
              rel="noreferrer"
              title="Open website in new tab"
              onClick={(e) => e.stopPropagation()}
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                display: "inline-flex",
                alignItems: "center",
                padding: "2px",
                borderRadius: "4px",
                transition: "color 0.15s ease",
              }}
            >
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>

      {/* Main Viewport */}
      <div
        style={{
          position: "relative",
          flex: 1,
          width: "100%",
          height: `${viewportHeight}px`,
          overflow: "hidden",
          backgroundColor: "#0b1120",
        }}
      >
        {/* Baseline Website Snapshot (Instant Zero-Wait Visual) */}
        <img
          src={liveSnapshotSrc}
          alt={name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            zIndex: 1,
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/images/websmith_original.jpg";
          }}
        />

        {/* Click to launch interactive live mode from snapshot */}
        {effectiveMode === "snapshot" && hasLiveUrl && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setViewMode("live");
            }}
            title="Click to launch interactive live website"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              cursor: "pointer",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              padding: "8px",
              background: "transparent",
            }}
          >
            <span
              style={{
                fontSize: "9px",
                fontWeight: 600,
                padding: "3px 8px",
                borderRadius: "6px",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
                backdropFilter: "blur(6px)",
                color: "#38bdf8",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                opacity: 0,
                transition: "opacity 0.2s ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
              className="interactive-hint"
            >
              <Globe size={10} /> Click to Run Live
            </span>
          </div>
        )}

        {/* Live Interactive Iframe (Fades in over snapshot once ready) */}
        {effectiveMode === "live" && hasLiveUrl && cleanUrl && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              overflow: "hidden",
              zIndex: 2,
              opacity: iframeLoaded ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            <iframe
              src={cleanUrl}
              title={`Live preview of ${name}`}
              loading="lazy"
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeError(true)}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "1280px",
                height: `${iframeHeight}px`,
                border: "none",
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                pointerEvents: isInteracting ? "auto" : "none",
                backgroundColor: "#ffffff",
              }}
            />

            {/* Click to interact overlay */}
            {!isInteracting && (
              <div
                onClick={() => setIsInteracting(true)}
                title="Click to interact with live website"
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 3,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  padding: "8px",
                  background: "transparent",
                }}
              >
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                    backdropFilter: "blur(6px)",
                    color: "#ffffff",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    opacity: 0,
                    transition: "opacity 0.2s ease",
                  }}
                  className="interactive-hint"
                >
                  Click to Interact
                </span>
              </div>
            )}

            {/* Floating exit interaction button when interacting */}
            {isInteracting && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsInteracting(false);
                }}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  zIndex: 5,
                  fontSize: "10px",
                  fontWeight: 700,
                  padding: "3px 8px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  color: "#38bdf8",
                  border: "1px solid rgba(56, 189, 248, 0.3)",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                }}
              >
                Lock Preview
              </button>
            )}
          </div>
        )}

        {/* Category Pill */}
        {category && (
          <div
            className="portfolio-card-tag"
            style={{
              position: "absolute",
              bottom: "8px",
              left: "8px",
              top: "auto",
              right: "auto",
              height: "auto",
              width: "fit-content",
              maxWidth: "85%",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              padding: "2.5px 7px",
              borderRadius: "5px",
              fontSize: "9.5px",
              fontWeight: 700,
              letterSpacing: "0.03em",
              backgroundColor: isDark ? "rgba(0, 0, 0, 0.75)" : "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(8px)",
              color: "#3b82f6",
              border: isDark ? "1px solid rgba(255, 255, 255, 0.15)" : "1px solid #cbd5e1",
              zIndex: 4,
            }}
          >
            {category}
          </div>
        )}
      </div>

      <style>{`
        .portfolio-card-banner:hover .interactive-hint {
          opacity: 1 !important;
        }

        @media (max-width: 768px) {
          .wsd-browser-chrome {
            height: 24px !important;
            padding: 0 6px !important;
          }
          .wsd-browser-dot {
            width: 5px !important;
            height: 5px !important;
          }
          .wsd-browser-domain {
            font-size: 8px !important;
            max-width: 65px !important;
            padding: 1px 4px !important;
          }
          .wsd-browser-mode-btn {
            font-size: 7.5px !important;
            padding: 1.5px 4px !important;
          }
          .portfolio-card-tag {
            top: auto !important;
            bottom: 6px !important;
            left: 6px !important;
            right: auto !important;
            height: auto !important;
            width: fit-content !important;
            max-width: 85% !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            padding: 2px 6px !important;
            font-size: 8px !important;
            border-radius: 4px !important;
          }
        }
      `}</style>
    </div>
  );
}
