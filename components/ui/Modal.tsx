"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  headerAction?: React.ReactNode;
  maxWidth?: string;
  // Optional CSS custom properties applied to the dialog box itself. Needed
  // for callers that render inside a scoped theme subtree (e.g. the Software
  // Store) whose CSS variables are lost when the modal portals into <body>.
  containerStyle?: React.CSSProperties;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  headerAction,
  maxWidth = "500px",
  containerStyle,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render through a portal into <body> so the fixed overlay is always
  // positioned against the real viewport. This escapes any ancestor that
  // creates a containing block for fixed-position descendants (e.g. a
  // backdrop-filter on the app Topbar), which would otherwise pin the modal
  // to that ancestor's box instead of centering it on screen.
  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="wsd-modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        className="wsd-responsive-modal"
        style={{
          width: "100%",
          maxWidth: maxWidth,
          backgroundColor: "var(--bg-primary)",
          borderRadius: "24px",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--card-shadow, 0 20px 40px rgba(0, 0, 0, 0.15))",
          display: "flex",
          flexDirection: "column",
          maxHeight: "min(90vh, calc(100dvh - 24px))",
          overflow: "hidden",
          color: "var(--text-primary)",
          animation: "modalSlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          ...containerStyle,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="wsd-modal-header"
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
          }}
        >
          <h2
            className="wsd-modal-title"
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            {title}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            {headerAction}
            <button
              onClick={onClose}
              type="button"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s ease",
              }}
              className="wsd-modal-close"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="wsd-modal-content"
          style={{
            padding: "24px",
            overflowY: "auto",
            flex: 1,
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className="wsd-modal-footer"
            style={{
              padding: "20px 24px",
              borderTop: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-secondary)",
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
            }}
          >
            {footer}
          </div>
        )}
      </div>
      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .wsd-modal-close:hover {
          color: var(--text-primary) !important;
        }
        .wsd-modal-back-btn:hover {
          background-color: var(--bg-hover, rgba(0, 0, 0, 0.08)) !important;
          color: var(--text-primary) !important;
          border-color: var(--text-secondary) !important;
        }
        .wsd-modal-overlay {
          z-index: 9999 !important;
        }
        @media (max-width: 640px) {
          .wsd-modal-overlay {
            z-index: 9999 !important;
            padding: max(8px, env(safe-area-inset-top, 8px)) 6px max(8px, env(safe-area-inset-bottom, 8px)) 6px !important;
          }
          .wsd-responsive-modal {
            border-radius: 16px !important;
            max-height: min(94vh, calc(100dvh - 16px)) !important;
          }
          .wsd-modal-header {
            padding: 10px 14px !important;
          }
          .wsd-modal-title {
            font-size: 15px !important;
          }
          .wsd-modal-content {
            padding: 10px 8px !important;
          }
          .wsd-modal-footer {
            padding: 10px 12px !important;
          }
        }
        @media (max-width: 480px) {
          .wsd-modal-overlay {
            padding: max(6px, env(safe-area-inset-top, 6px)) 4px max(6px, env(safe-area-inset-bottom, 6px)) 4px !important;
          }
          .wsd-responsive-modal {
            border-radius: 14px !important;
            max-height: min(96vh, calc(100dvh - 12px)) !important;
          }
          .wsd-modal-header {
            padding: 9px 12px !important;
          }
          .wsd-modal-title {
            font-size: 14.5px !important;
          }
          .wsd-modal-content {
            padding: 8px 6px !important;
          }
        }
        @media (max-width: 520px) {
          .wsd-modal-back-text {
            display: none !important;
          }
          .wsd-modal-back-btn {
            padding: 4px 8px !important;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
