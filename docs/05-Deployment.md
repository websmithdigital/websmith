# 05 — Deployment & Production Readiness

## Hosting & Infrastructure

- **Platform**: Vercel (Next.js 16 App Router build with Webpack/Turbopack runtime).
  - Canonical domain: `https://websmithdigital.com`
  - Vercel alias: `https://websmith-z.vercel.app`
  - GitHub Remote: `github.com/khankeemo/websmith.git`
- **Deploy command**: `npx vercel --prod`
- **Verification after deploy**: Run production checklist (API status, Neon database connectivity, sitemap generation, robots.txt crawler verification, dynamic blogs, SDK publisher download, ULC activation, SMTP/IMAP communications).

## Environment Variables Architecture (`.env.example`)

A centralized template is maintained in the root [`.env.example`](file:///f:/Projects/WSD/websmith/.env.example) covering all 9 platform subsystems:

| Subsystem | Key Variables | Description & Scope |
|---|---|---|
| **1. Core Application** | `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_API_URL`, `NODE_ENV`, `PORT` | Canonical public URLs and runtime environment. |
| **2. Primary Database** | `DATABASE_URL`, `FORCE_DB_INIT` | Neon Serverless PostgreSQL with PgBouncer connection pooling and auto-schema migrations. |
| **3. Authentication & Secrets** | `JWT_SECRET`, `API_CENTER_JWT_SECRET`, `ADMIN_API_KEY` | Server-only secrets for JWT signing and internal backend execution. Client key leaks (`NEXT_PUBLIC_ADMIN_API_KEY`) are strictly prohibited. |
| **4. Outbound Email (SMTP)** | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SENDER_EMAIL`, `BREVO_API_KEY` | Dual-mode outbound delivery (PrivateEmail/Custom SMTP primary, Brevo fallback). |
| **5. Inbound Mailboxes (IMAP)** | `MAIL_SALES_IMAP_*`, `MAIL_SUPPORT_IMAP_*` | Secure IMAP pollers for sales and customer support inboxes. |
| **6. Redis & Distributed Queue**| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `QSTASH_*` | Upstash Redis for rate-limiting and nonces; QStash for resilient async workflows. |
| **7. SMS Notifications** | `FAST2SMS_API_KEY`, `FAST2SMS_SENDER_ID` | SMS delivery provider for OTPs and high-priority alerts. |
| **8. Google OAuth** | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Client and administrative SSO login. |
| **9. Public API Engine** | `PUBLIC_API_SIGNATURE_TTL`, `PUBLIC_API_AUDIT_ENABLED` | HMAC request signature validation and database audit logging (`api_request_logs`). |

## Security & Diagnostics Hardening

- **Diagnostic Routes Security Gate**:
  - `/api/diagnostic/bridge` and `/api/diagnostic/mailboxes` are strictly blocked in production (`NODE_ENV === 'production'` returns HTTP 404).
  - In development and staging, access requires a Bearer token matching `ADMIN_API_KEY` or `CLEANUP_SECRET_KEY`.
- **Client Security Boundary**:
  - `ADMIN_API_KEY` is server-only. Client-side code (`lib/api/license-api.ts`) communicates via same-origin relative endpoints with `credentials: "include"`, preventing key leakage to the browser.
- **Search Engine Crawler Security (`app/robots.ts`)**:
  - Search crawlers are instructed to index only public surfaces (`/`, `/services`, `/portfolio`, `/blog`, `/about`, `/contact`, `/privacy`, `/terms`).
  - Private surfaces are disallowed: `/admin/`, `/internal/`, `/client/`, `/dashboard/`, `/developer/`, `/api/`.

## SEO & Dynamic Sitemap Engine (`app/sitemap.ts`)

- **Dynamic Entity Discovery**:
  - Pulls published blog articles from the Neon PostgreSQL `blogs` collection with fallback to static `DEFAULT_BLOGS`.
  - Pulls active products from the `software_products` catalog.
  - Automatically indexes core public pages (`/services`, `/portfolio`, `/industries`, `/software-store`, `/lead-form`, `/privacy`, `/terms`).
- **Incremental Static Regeneration (ISR)**:
  - Configured with `export const revalidate = 604800` (1 week / 7 days).
  - Next.js automatically refreshes `https://websmithdigital.com/sitemap.xml` in the background without requiring code redeployments when new blogs or products are published.

## Error Handling & Resiliency

- **Global Error Boundary (`app/error.tsx`)**:
  - Branded, glassmorphic fallback with live error telemetry logging.
  - Interactive `reset()` retry button allowing visitors to recover from intermittent errors without leaving the page.
  - Direct fallback links to Home and Support.
- **Custom 404 Not Found (`app/not-found.tsx`)**:
  - Clean branded navigation hub pointing users directly to Home, Services, Portfolio, Software Store, and Technical Support.

## Database & Storage Strategy

- **Primary Storage**: Single Neon PostgreSQL serverless database.
  - Accessed exclusively through `lib/backend-db/index.ts` `getDb()` connection pool.
  - Schema migrations run automatically on boot via `lib/migrations/runner.ts` (idempotent DDL).
- **Filesystem Temporary Storage (`temp/`)**:
  - Designated local runtime directory for packaging SDK ZIP files prior to customer download ([app/api/internal/publisher/download/[filename]/route.ts](file:///f:/Projects/WSD/websmith/app/api/internal/publisher/download/%5Bfilename%5D/route.ts)).
  - Tracked with `.gitkeep` and excluded from Git commits via `.gitignore`.

## Production Pre-Flight Checklist

1. `npx tsc --noEmit` — 0 TypeScript compilation errors.
2. `npm run build` — Successful clean build of all public and internal routes.
3. Automated Tests: `npm test` passing (6/6 validator + 13/13 runtime parity).
4. Public Brand Assets: Favicons (`favicon.ico`, `favicon-32x32.png`), 1:1 `icon.png`, and 3:1 `wordmark.png` rendering without aspect-ratio warnings.
5. Verification after deploy: Check `/sitemap.xml`, `/robots.txt`, and `/api/v1/status`.
