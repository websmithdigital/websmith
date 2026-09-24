"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  if (!content) return null;

  // Split lines
  const lines = content.split(/\r?\n/);
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockLines: string[] = [];
  let inList: "ul" | "ol" | null = null;
  let listItems: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (!inList || listItems.length === 0) return;
    const ListTag = inList;
    const items = [...listItems];
    elements.push(
      <ListTag
        key={`${keyPrefix}-list`}
        style={{
          margin: "16px 0 20px 24px",
          paddingLeft: "8px",
          color: "var(--text-secondary)",
          lineHeight: "1.75",
          fontSize: "16px",
        }}
      >
        {items.map((it, idx) => (
          <li key={idx} style={{ marginBottom: "6px" }}>
            {parseInline(it)}
          </li>
        ))}
      </ListTag>
    );
    inList = null;
    listItems = [];
  };

  const flushCodeBlock = (keyPrefix: string) => {
    if (!inCodeBlock) return;
    const code = codeBlockLines.join("\n");
    const lang = codeBlockLang;
    elements.push(<CodeBlockSnippet key={`${keyPrefix}-code`} code={code} lang={lang} />);
    inCodeBlock = false;
    codeBlockLang = "";
    codeBlockLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced Code Block
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        flushCodeBlock(`cb-${i}`);
      } else {
        flushList(`before-cb-${i}`);
        inCodeBlock = true;
        codeBlockLang = line.trim().slice(3).trim();
        codeBlockLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // Unordered List (- or *)
    const ulMatch = line.match(/^(\s*)[-*]\s+(.*)$/);
    if (ulMatch) {
      if (inList === "ol") flushList(`swap-ol-${i}`);
      inList = "ul";
      listItems.push(ulMatch[2]);
      continue;
    }

    // Ordered List (1. 2.)
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (olMatch) {
      if (inList === "ul") flushList(`swap-ul-${i}`);
      inList = "ol";
      listItems.push(olMatch[2]);
      continue;
    }

    // Not a list item
    if (inList) {
      flushList(`end-list-${i}`);
    }

    // Empty line
    if (!line.trim()) {
      continue;
    }

    // Headings
    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={`h1-${i}`}
          style={{
            fontSize: "30px",
            fontWeight: 800,
            color: "var(--text-primary)",
            margin: "32px 0 16px 0",
            letterSpacing: "-0.5px",
            lineHeight: 1.25,
          }}
        >
          {parseInline(line.slice(2))}
        </h1>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${i}`}
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "var(--text-primary)",
            margin: "28px 0 14px 0",
            letterSpacing: "-0.3px",
            lineHeight: 1.3,
          }}
        >
          {parseInline(line.slice(3))}
        </h2>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${i}`}
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: "24px 0 12px 0",
            lineHeight: 1.35,
          }}
        >
          {parseInline(line.slice(4))}
        </h3>
      );
      continue;
    }

    // Horizontal Rule
    if (line.trim() === "---" || line.trim() === "***" || line.trim() === "___") {
      elements.push(
        <hr
          key={`hr-${i}`}
          style={{
            border: "none",
            borderTop: "1px solid var(--border-color)",
            margin: "28px 0",
          }}
        />
      );
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`bq-${i}`}
          style={{
            margin: "20px 0",
            padding: "14px 20px",
            borderLeft: "4px solid #007AFF",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "0 8px 8px 0",
            color: "var(--text-primary)",
            fontStyle: "italic",
            fontSize: "16px",
            lineHeight: "1.7",
          }}
        >
          {parseInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Image (![alt](url))
    const imgMatch = line.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (imgMatch) {
      const alt = imgMatch[1];
      const src = imgMatch[2];
      elements.push(
        <figure key={`img-${i}`} style={{ margin: "24px 0", textAlign: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
              border: "1px solid var(--border-color)",
            }}
          />
          {alt && (
            <figcaption
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginTop: "8px",
                fontStyle: "italic",
              }}
            >
              {alt}
            </figcaption>
          )}
        </figure>
      );
      continue;
    }

    // Standard paragraph
    elements.push(
      <p
        key={`p-${i}`}
        style={{
          margin: "12px 0 16px 0",
          fontSize: "16px",
          lineHeight: "1.8",
          color: "var(--text-secondary)",
        }}
      >
        {parseInline(line)}
      </p>
    );
  }

  // Flush remaining list/code block
  if (inList) flushList("trailing-list");
  if (inCodeBlock) flushCodeBlock("trailing-code");

  return <div className={`wsd-markdown-content ${className}`}>{elements}</div>;
}

function CodeBlockSnippet({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        margin: "20px 0 24px 0",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid var(--border-color)",
        backgroundColor: "rgba(10, 15, 25, 0.95)",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 16px",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.6)",
            fontFamily: "monospace",
          }}
        >
          {lang || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            background: "transparent",
            border: "none",
            color: copied ? "#34C759" : "rgba(255, 255, 255, 0.7)",
            fontSize: "12px",
            cursor: "pointer",
            padding: "4px 8px",
            borderRadius: "4px",
          }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "16px 20px",
          overflowX: "auto",
          fontSize: "14px",
          lineHeight: "1.6",
          fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
          color: "#E2E8F0",
        }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Parses inline formatting: bold, italic, strikethrough, inline code, links
function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  // Tokenize regex
  // Match: `code`, **bold**, *italic*, ~~strike~~, [text](url)
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~|\[[^\]]+\]\([^)]+\))/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `token-${match.index}`;

    if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={key}
          style={{
            padding: "2px 6px",
            borderRadius: "5px",
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "#007AFF",
            fontSize: "13.5px",
            fontFamily: "monospace",
          }}
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={key} style={{ fontWeight: 700, color: "var(--text-primary)" }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={key} style={{ fontStyle: "italic" }}>
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith("~~") && token.endsWith("~~")) {
      parts.push(
        <del key={key} style={{ textDecoration: "line-through", opacity: 0.7 }}>
          {token.slice(2, -2)}
        </del>
      );
    } else if (token.startsWith("[") && token.includes("](")) {
      const closingBracket = token.indexOf("]");
      const linkText = token.slice(1, closingBracket);
      const linkUrl = token.slice(closingBracket + 2, -1);
      const isExternal = linkUrl.startsWith("http");

      parts.push(
        <Link
          key={key}
          href={linkUrl}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          style={{
            color: "#007AFF",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            fontWeight: 500,
          }}
        >
          {linkText}
        </Link>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}
