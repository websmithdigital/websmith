# Website UI & Design System Specification

This document details the public visual architecture, brand assets, navigation hierarchy, and layout engineering of the **WebSmith Digital** platform.

---

## Brand Asset Standards (`public/images/`)

All brand imagery strictly maintains physical aspect ratio constraints to eliminate layout shifts (CLS) and Next.js Image optimization warnings:

| Asset | Source File | Dimensions | Aspect Ratio | Primary Role |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Crest** | `public/images/icon.png` | 1254 × 1254 px | **1:1** | High-contrast circular header icon, admin sidebars, auth badges, and mobile app avatars. |
| **Typographic Wordmark** | `public/images/wordmark.png` | 2172 × 724 px | **3:1** | Horizontal logotype with geometric emblem and typography. (Also duplicated as `wordmark1.png`). |
| **Browser Tab Favicon** | `public/favicon.ico` | 16/32/48 px | **1:1** | Multi-resolution ICO generated directly from `icon.png` (replaces legacy black banners). |
| **High-DPI Tab Favicon** | `public/images/favicon-32x32.png` | 32 × 32 px | **1:1** | Desktop tab favicon. |
| **Apple Touch Icon** | `public/images/apple-touch-icon.png` | 180 × 180 px | **1:1** | iOS home-screen icon and safari pinned tab. |
| **Android Chrome Icons** | `public/images/android-chrome-*.png` | 192 / 512 px | **1:1** | PWA shortcut and splash screen icons. |
| **OpenGraph Preview** | `public/images/websmith_original.jpg` | 1200 × 630 px | **1.91:1** | Social media card (Twitter/X, LinkedIn, Discord). |

### Implementation Rules for Next.js `<Image>`
Whenever rendering `wordmark.png` (`2172x724`), the `width` and `height` properties passed to `<Image>` must strictly preserve the **3:1** aspect ratio to prevent browser console warnings:
```tsx
<Image
  src="/images/wordmark1.png"
  alt="Websmith Digital"
  width={132}
  height={44}
  style={{ height: "44px", width: "auto", objectFit: "contain" }}
  priority
/>
```

---

## Header Navigation Hierarchy (`PublicSiteNav.tsx`)

The public header provides desktop mega-menus and a responsive slide-out mobile drawer:

1. **Brand Identity**: Circular logo shell (`icon.png`) + responsive wordmark (`wordmark.png`).
2. **Services Dropdown**: Interactive interactive grid linking to dynamic CMS capability tabs (`web-engineering`, `mobile-development`, `business-software`, `creative-branding`, `cloud-growth`).
3. **Industries Dropdown**: Links to industry vertical showcases (`fintech`, `healthcare`, `ecommerce`, `logistics`, `real-estate`).
4. **Portfolio**: Direct link to `/portfolio`.
5. **Company Dropdown (`DropdownCompany.tsx`)**:
   - About WebSmith (`/about`)
   - Careers & Culture (`/careers`) — with live "Hiring" badge
   - Core Team & Developers (`/about#team`)
   - Engineering Blog (`/blog`)
   - Documentation Center (`/documentation`)
   - **Privacy Policy** (`/privacy`) — data governance and compliance
   - **Terms of Service** (`/terms`) — platform licensing and usage agreements
6. **Software Storefront**: Direct link to `/software-store` with embedded search query engine.
7. **Contact Us & CTA**: Contact link (`/contact`) and high-conversion "Get Started" modal trigger.

---

## Modernized Public Footer (`PublicFooter.tsx`)

A 3-column architecture synchronized with the master CMS configuration in [core/config/publicSite.ts](file:///f:/Projects/WSD/websmith/core/config/publicSite.ts):

### 1. Brand & Direct Contact Column
- WebSmith Digital identity with 1:1 crest and 3:1 wordmark.
- Mission tagline: *"Building high-performance web ecosystems, enterprise ERP platforms, and universal software licensing infrastructure."*
- Click-to-email: `mailto:support@websmithdigital.com`
- Click-to-call: `tel:+18154269572`
- Headquarters: Kolkata Regional Hub
- Live system status pulse badge: *"All Systems Operational"* (animated emerald beacon).
- Social links: GitHub, LinkedIn, X (Twitter), Discord, YouTube.

### 2. Services Column
- Web Engineering & Redesign (`/services?tab=web-engineering`)
- Mobile & App Development (`/services?tab=mobile-development`)
- Business Software & CRM/ERP (`/services?tab=business-software`)
- Creative, Design & Branding (`/services?tab=creative-branding`)
- Cloud, Performance & SLA (`/services?tab=cloud-growth`)
- All Capabilities (`/services`)

### 3. Company Column
- About WebSmith (`/about`)
- Industry Verticals (`/industries`)
- **Portfolio** (`/portfolio`)
- Careers & Culture (`/careers`)
- Engineering Blog (`/blog`)
- Book Consultation (`/lead-form`)

### 4. Products & Support Column
- Software Storefront (`/software-store`)
- Universal Licensing (ULP) (`/license`)
- Documentation & APIs (`/documentation`)
- Help & Support Center (`/support`)
- Contact Engineering (`/contact`)
- **Privacy Policy** (`/privacy`)
- **Terms of Service** (`/terms`)

### 5. Centered Copyright Bottom Bar
- Clean, focused copyright notice without legal links clutter:
  `© 2026 WebSmith Digital. All Rights Reserved. Engineered for Scale & Performance.`

---

## Dynamic URL Routing & Tab Aliases

[app/services/page.tsx](file:///f:/Projects/WSD/websmith/app/services/page.tsx) automatically normalizes shorthand query parameters to official CMS slugs:
- `?tab=engineering` → `web-engineering`
- `?tab=mobile` → `mobile-development`
- `?tab=erp` → `business-software`
- `?tab=design` → `creative-branding`
- `?tab=cloud` → `cloud-growth`