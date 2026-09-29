// FILE: lib/cms/types.ts
// PURPOSE: Unified CMS data types and seed fixtures for Industries, Services, Portfolio, Clients, Developers, and Testimonials.

export interface CmsIndustry {
  _id?: string;
  name: string;
  slug: string;
  icon: string;
  shortDescription: string;
  badge?: string;
  headline?: string;
  description?: string;
  stats?: Array<{ label: string; value: string }>;
  challenges?: Array<{ problem: string; solution: string }>;
  architecture?: string[];
  techStack?: string[];
  caseStudy?: {
    client: string;
    metrics: string;
    summary: string;
  };
  displayOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsServiceCategory {
  _id?: string;
  name: string;
  title?: string;
  slug: string;
  icon: string;
  description: string;
  badge?: string;
  displayOrder: number;
  isActive: boolean;
  services?: CmsServiceItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CmsServiceItem {
  _id?: string;
  categoryId?: string;
  categoryName?: string;
  name: string;
  title?: string;
  slug: string;
  icon: string;
  shortDescription: string;
  description?: string;
  deliverables?: string[];
  techStack?: string[];
  displayOrder: number;
  isActive: boolean;
  showInMenu: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// DEFAULT SEED FIXTURES (Extracted from existing hardcoded frontends)
// ============================================================================

export const SEED_INDUSTRIES: Omit<CmsIndustry, "_id">[] = [
  {
    name: "Startups & SMBs",
    slug: "startups-smbs",
    icon: "Rocket",
    shortDescription: "Rapid clickable MVPs, scalable architecture & investor demos",
    badge: "Rapid MVP & Scale",
    headline: "High-Velocity MVP Engineering & Cost-Effective Cloud Architectures",
    description: "We help early-stage ventures and growing businesses validate ideas fast, build investor-ready prototypes, and establish scalable cloud foundations without technical debt.",
    stats: [
      { label: "MVP Delivery Timeline", value: "3-5 Weeks" },
      { label: "Code Ownership", value: "100% Client" },
      { label: "Investor Demo Ready", value: "Guaranteed" },
      { label: "Cloud Cost Efficiency", value: "Optimized" },
    ],
    challenges: [
      {
        problem: "Slow engineering cycles depleting runway before achieving product-market fit",
        solution: "Pre-assembled modular Next.js components and turnkey authentication to launch in weeks.",
      },
      {
        problem: "Over-engineered infrastructure creating prohibitive monthly cloud bills",
        solution: "Serverless pay-per-use architecture on Neon PostgreSQL and edge compute scaling from $0/mo.",
      },
      {
        problem: "Spaghetti codebases that must be completely rewritten after raising capital",
        solution: "Strict TypeScript, clean architecture, and automated tests ready for institutional due diligence.",
      },
    ],
    architecture: [
      "Modular Full-Stack Next.js 16 Architecture with Edge Rendering",
      "Serverless PostgreSQL with Connection Pooling and Instant Branching",
      "Automated GitHub Actions CI/CD to Staging and Production",
      "Plug-and-Play Authentication, Stripe Billing and Analytics",
    ],
    techStack: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "PostgreSQL", "Vercel", "Stripe"],
    caseStudy: {
      client: "VentureCraft Labs",
      metrics: "Launched clickable MVP in 24 days, closed $1.2M seed round",
      summary: "Engineered a full-stack SaaS platform from Figma wireframes to production deployment with automated billing and multi-tenant security.",
    },
    displayOrder: 1,
    isActive: true,
  },
  {
    name: "Healthcare",
    slug: "healthcare",
    icon: "HeartPulse",
    shortDescription: "Compliant patient portals, telemedicine & EHR sync",
    badge: "HIPAA & GDPR Certified",
    headline: "Secure Telehealth Portals & Compliant Medical Systems",
    description: "Engineered for uncompromising patient privacy, end-to-end encrypted video consults, Electronic Health Record (EHR) interoperability, and automated clinical appointment scheduling.",
    stats: [
      { label: "Data Encryption", value: "AES-256-GCM" },
      { label: "Video Stream Latency", value: "< 120ms" },
      { label: "HIPAA & GDPR Ready", value: "100%" },
      { label: "Monthly Patient Sessions", value: "85,000+" },
    ],
    challenges: [
      {
        problem: "Strict HIPAA/GDPR constraints on Protected Health Information (PHI)",
        solution: "Column-level field encryption with cryptographic customer keys never logged or stored in cleartext.",
      },
      {
        problem: "Unstable video streaming over erratic mobile cellular networks",
        solution: "Adaptive bitrate WebRTC mesh network with automatic audio fallback and local buffer resilience.",
      },
      {
        problem: "Siloed legacy clinic EHR formats preventing unified patient charts",
        solution: "HL7/FHIR-compliant ingestion translation bridges formatting data into standardized streams.",
      },
    ],
    architecture: [
      "End-to-End Encrypted Peer-to-Peer WebRTC Consultation Rooms",
      "FHIR-Compliant Healthcare Integration Microservices",
      "Role-Based Access Control (RBAC) with Hardware Token Enforcement",
      "Immutable Audit Trail for Every Patient Record Access & Modification",
    ],
    techStack: ["Next.js", "WebRTC", "PostgreSQL", "Node.js", "AWS KMS", "Docker", "FHIR Standards"],
    caseStudy: {
      client: "MedCare Telehealth Network",
      metrics: "99.99% video uptime across 40,000+ monthly clinical sessions",
      summary: "Developed a HIPAA-compliant cross-platform telehealth platform reducing clinic patient wait times by 62%.",
    },
    displayOrder: 2,
    isActive: true,
  },
  {
    name: "Real Estate",
    slug: "real-estate",
    icon: "Home",
    shortDescription: "Property listing portals, MLS/IDX sync & interactive maps",
    badge: "MLS & IDX Integrated",
    headline: "Dynamic Property Portals & Brokerage Management Systems",
    description: "High-performance property discovery engines, real-time MLS/IDX synchronization, interactive geospatial search, automated virtual tour embeds, and agent CRM workflows.",
    stats: [
      { label: "MLS Sync Frequency", value: "Every 15m" },
      { label: "Map Query Speed", value: "< 25ms" },
      { label: "Listing Conversion", value: "+42%" },
      { label: "Active Property Records", value: "150,000+" },
    ],
    challenges: [
      {
        problem: "Laggy geospatial map rendering when displaying tens of thousands of active listings",
        solution: "Clustered Mapbox vector tile endpoints with geo-indexed PostgreSQL PostGIS queries.",
      },
      {
        problem: "Data schema discrepancies across regional MLS boards and IDX feeds",
        solution: "Automated normalization pipeline compliant with RESO Web API standards.",
      },
      {
        problem: "Slow lead routing resulting in lost buyer inquiries to competitors",
        solution: "Instant automated WhatsApp/SMS lead alerts connected directly to listing agents.",
      },
    ],
    architecture: [
      "PostgreSQL PostGIS Geospatial Spatial Indexing for Sub-Second Map Bounds",
      "RESO Web API & IDX Continuous Feed Replication Worker",
      "Interactive Mapbox GL Surface with Dynamic Price Pin Clustering",
      "Automated In-Browser Virtual Tour & Floorplan Renderer",
    ],
    techStack: ["Next.js 16", "Mapbox GL", "PostgreSQL", "PostGIS", "Redis", "TypeScript", "Tailwind CSS"],
    caseStudy: {
      client: "Shanu Jandoo Real Estate & Mortgage",
      metrics: "Over $45M+ luxury portfolio showcased, 4.2x lift in qualified mortgage pre-approvals",
      summary: "Architected a luxury Toronto & GTA property portal combining Leaflet map discovery, live MLS-style property filtering, and 1-click mortgage pre-approval underwriting.",
    },
    displayOrder: 3,
    isActive: true,
  },
  {
    name: "Education",
    slug: "education",
    icon: "GraduationCap",
    shortDescription: "LMS platforms, student portals & online course checkout",
    badge: "Interactive Learning",
    headline: "Scalable Learning Management Systems & Virtual Classrooms",
    description: "Modern digital learning platforms featuring interactive video streaming, automated grading, student progress analytics, multi-tier subscription paywalls, and SCORM compliance.",
    stats: [
      { label: "Concurrent Students", value: "50,000+" },
      { label: "Video Playback Latency", value: "Sub-Second" },
      { label: "Course Completion Rate", value: "+38%" },
      { label: "System Availability", value: "99.98%" },
    ],
    challenges: [
      {
        problem: "High video bandwidth costs and buffering during synchronized live classes",
        solution: "HLS adaptive multi-bitrate video streaming paired with edge CDN caching.",
      },
      {
        problem: "Student drop-off caused by clunky, outdated course interfaces",
        solution: "Gamified learning pathways with instant progress tracking and celebratory micro-animations.",
      },
      {
        problem: "Complex institutional billing with coupon codes, student grants, and installments",
        solution: "Modular checkout supporting one-time payments, subscriptions, and corporate team vouchers.",
      },
    ],
    architecture: [
      "Adaptive Bitrate HLS Video Delivery Network via Cloudflare Stream",
      "WebSocket Real-Time Classroom Chat & Live Q&A Interaction",
      "Automated Quiz Evaluation Engine with Anti-Cheating Timer Guards",
      "Student Portfolio & Verifiable Digital Certificate Generator",
    ],
    techStack: ["Next.js", "React 19", "Node.js", "PostgreSQL", "WebSockets", "Cloudflare", "Stripe"],
    caseStudy: {
      client: "Schoolera Multi-Tenant Cloud ERP",
      metrics: "Deployed across 15+ GCC institutions, 100% cashless canteen adoption with 0 billing disputes",
      summary: "Engineered a centralized multi-tenant cloud platform with 6 dedicated role portals (Super Admin, School Admin, Parent, Student, Vendor, Canteen) and cashless digital wallets.",
    },
    displayOrder: 4,
    isActive: true,
  },
  {
    name: "E-commerce & Retail",
    slug: "ecommerce",
    icon: "ShoppingCart",
    shortDescription: "Custom online stores, Shopify Plus & flash-sale scaling",
    badge: "Sub-Second Checkout",
    headline: "High-Conversion Digital Storefronts & Omnichannel Marketplaces",
    description: "Scalable digital storefronts and headless commerce engines designed to withstand flash sales, multi-vendor commission splits, and global multi-currency checkout without cart drops.",
    stats: [
      { label: "Cart Conversion Lift", value: "+34%" },
      { label: "Page Load (FCP)", value: "0.42s" },
      { label: "Flash Sale Concurrency", value: "50k/min" },
      { label: "Payment Routing Reliability", value: "99.99%" },
    ],
    challenges: [
      {
        problem: "Overselling stock during split-second flash sale checkout peaks",
        solution: "Redis atomic decrement counters coupled with asynchronous PostgreSQL reconciliation queues.",
      },
      {
        problem: "Complex multi-vendor commission settlements and regional VAT calculations",
        solution: "Automated ledger calculating regional tax, provider splits, and escrow transfers.",
      },
      {
        problem: "Slow faceted search across thousands of product catalog SKUs",
        solution: "Edge-cached search pipeline with sub-25ms prefix filtering and typo tolerance.",
      },
    ],
    architecture: [
      "Headless Storefront with Server-Side Incremental Static Regeneration",
      "Distributed Cart Sessions stored in in-memory memory grids",
      "Multi-Gateway Smart Failover (Stripe, PayPal, Razorpay, Apple Pay)",
      "Automated Order Processing Microservices with Queue Workers",
    ],
    techStack: ["React 19", "Next.js", "PostgreSQL", "Redis", "Shopify API", "Stripe", "Tailwind CSS"],
    caseStudy: {
      client: "MZH Resin Art Atelier",
      metrics: "3.2x increase in bespoke inquiries, zero transit damage with insured shipping",
      summary: "Engineered a high-aesthetic luxury e-commerce experience with interactive drop showcases, bespoke custom order inquiries, and secure 256-bit encrypted checkout.",
    },
    displayOrder: 5,
    isActive: true,
  },
  {
    name: "Restaurants & Hospitality",
    slug: "hospitality",
    icon: "UtensilsCrossed",
    shortDescription: "Food ordering systems, table reservations & digital QR menus",
    badge: "Direct Ordering",
    headline: "Online Food Ordering, Table Booking & Hospitality Portals",
    description: "Direct-to-consumer digital food ordering engines, contactless QR code menus, multi-table reservation systems, kitchen display units (KDS), and third-party delivery dispatch integrations.",
    stats: [
      { label: "Commission Savings", value: "100% Direct" },
      { label: "Order Placement Time", value: "< 45s" },
      { label: "Table Turn Acceleration", value: "+22%" },
      { label: "Mobile Order Share", value: "88%" },
    ],
    challenges: [
      {
        problem: "High aggregator commissions (25-35%) eating restaurant margins on delivery orders",
        solution: "White-label direct ordering web app eliminating intermediary fees with integrated payments.",
      },
      {
        problem: "Double bookings and reservation confusion during peak dining hours",
        solution: "Real-time visual floorplan reservation engine with automatic SMS arrival confirmations.",
      },
      {
        problem: "Slow printed menu updates whenever items run out of stock or prices change",
        solution: "Instant-sync digital QR menu updated with a single click from the manager dashboard.",
      },
    ],
    architecture: [
      "Progressive Web App (PWA) for Instant Zero-Install Mobile Ordering",
      "Real-Time Kitchen Display System (KDS) powered by WebSockets",
      "Multi-Location Menu and Modifier Configuration Engine",
      "Integrated Driver Dispatch & Live Order Map Tracking",
    ],
    techStack: ["Next.js", "React 19", "WebSockets", "PostgreSQL", "Stripe", "Tailwind CSS", "PWA"],
    caseStudy: {
      client: "Artisan Dining Group",
      metrics: "$240,000 saved in 3rd-party commissions in the first 6 months",
      summary: "Built a customized multi-location digital ordering and reservation platform across 12 restaurant branches.",
    },
    displayOrder: 6,
    isActive: true,
  },
  {
    name: "Professional Services",
    slug: "professional-services",
    icon: "Briefcase",
    shortDescription: "Legal, accounting & consulting portals with billing",
    badge: "Client Confidentiality",
    headline: "Secure Client Intake, Document Vaults & Practice Management",
    description: "Bespoke digital platforms for law firms, accounting practices, and management consultancies. Featuring secure client onboarding, encrypted document repositories, e-signatures, and automated billing.",
    stats: [
      { label: "Client Intake Speed", value: "4x Faster" },
      { label: "Document Encryption", value: "AES-256" },
      { label: "Billing Collection Rate", value: "98.5%" },
      { label: "Security Audit Pass", value: "100%" },
    ],
    challenges: [
      {
        problem: "Unencrypted email attachments exposing sensitive financial and legal records",
        solution: "Bank-grade encrypted client portals with granular role-based file access permissions.",
      },
      {
        problem: "Time lost chasing clients for intake forms and signed retainer agreements",
        solution: "Automated digital intake workflows with built-in legally binding e-signatures.",
      },
      {
        problem: "Manual hourly invoicing creating billing disputes and delayed payments",
        solution: "Integrated time-tracking and milestone invoicing engine with online payment gating.",
      },
    ],
    architecture: [
      "Zero-Knowledge Client Document Vault with Encrypted S3 Storage",
      "Automated Retainer Agreement Flow with Digital Signature Verification",
      "Multi-Party Time-Tracking & Matter Management Ledger",
      "Granular Audit Logging for Regulatory & Compliance Reporting",
    ],
    techStack: ["Next.js 16", "TypeScript", "PostgreSQL", "Node.js", "DocuSign API", "AWS KMS", "Tailwind CSS"],
    caseStudy: {
      client: "Vance & Sterling Legal",
      metrics: "Reduced client onboarding time from 5 days to 25 minutes",
      summary: "Created a secure corporate client intake and document exchange portal managing over 4,500 active confidential corporate filings.",
    },
    displayOrder: 7,
    isActive: true,
  },
  {
    name: "Logistics",
    slug: "logistics",
    icon: "Truck",
    shortDescription: "Fleet GPS tracking, warehouse barcode ERP & dispatch",
    badge: "Real-Time Telematics",
    headline: "Fleet GPS Telematics & Automated Warehouse ERP",
    description: "Live GPS fleet tracking, barcode-enabled warehouse management, algorithmic route optimization, automated Bill of Lading generation, and real-time customer shipment tracking portals.",
    stats: [
      { label: "GPS Telemetry Ping", value: "Sub-Second" },
      { label: "Route Fuel Savings", value: "18.4%" },
      { label: "Inventory Accuracy", value: "99.8%" },
      { label: "Active Fleet Units", value: "2,500+" },
    ],
    challenges: [
      {
        problem: "High-frequency geospatial telemetry pings overwhelming database writes",
        solution: "Time-series partitions buffering writes via high-throughput Redis streams.",
      },
      {
        problem: "Sub-optimal vehicle routing resulting in costly transit delays and excessive fuel burn",
        solution: "Heuristic TSP path-finding algorithms recalculating dynamic routes on live traffic incidents.",
      },
      {
        problem: "Warehouse barcode scanner connectivity drops in cold-storage zones",
        solution: "Offline-first Progressive Web App (PWA) with local IndexedDB sync on reconnect.",
      },
    ],
    architecture: [
      "Geospatial Ingestion Engine handling 5,000 telemetry events/sec",
      "Dynamic Route Optimization Microservice using Graph Algorithms",
      "Offline-Resilient Warehouse Barcode Progressive Web App",
      "Automated Bill of Lading (BOL) & Dispatch Document Generation",
    ],
    techStack: ["TypeScript", "PostGIS", "Redis Streams", "Mapbox GL", "Next.js", "Docker", "Go"],
    caseStudy: {
      client: "ApnaCab On-Demand Mobility",
      metrics: "Sub-3-second ride booking flow, 99.8% booking completion rate across active test markets",
      summary: "Engineered a responsive ride-hailing web platform utilizing Mapbox GL direction tracing, dynamic distance-based pricing engine, Clerk user authentication, and 1-click Stripe payments.",
    },
    displayOrder: 8,
    isActive: true,
  },
];

export const SEED_SERVICE_CATEGORIES = [
  {
    id: "web-engineering",
    name: "Web Engineering & Redesign",
    slug: "web-engineering",
    icon: "Globe",
    description: "High-performance Next.js websites, complete website redesigns, custom web apps, and e-commerce platforms.",
    badge: "High-Scale",
    displayOrder: 1,
    isActive: true,
    services: [
      {
        name: "Website & Landing Page Development",
        slug: "website-landing-pages",
        icon: "Globe",
        shortDescription: "Ultra-fast Next.js websites & conversion funnels",
        description: "Custom Next.js 16 and React 19 websites engineered for sub-second page loads, 95+ Core Web Vitals, high-converting layouts, and seamless mobile responsiveness.",
        deliverables: [
          "Custom Next.js 16 & React 19 web applications",
          "Conversion-optimized landing funnels & responsive UI",
          "ADA Title III & WCAG 2.1 AA accessibility compliance",
          "Core Web Vitals 95+ and sub-second load times",
          "Interactive motion & glassmorphic aesthetics",
        ],
        techStack: ["Next.js 16", "React 19", "Tailwind CSS", "Framer Motion", "TypeScript"],
        displayOrder: 1,
        isActive: true,
        showInMenu: true,
      },
      {
        name: "Website Redesign & Modernization",
        slug: "website-redesign-modernization",
        icon: "RotateCw",
        shortDescription: "Legacy revamp, 3x-10x speedup & mobile overhaul",
        description: "Transform outdated, slow, or poorly converting legacy websites into cutting-edge, high-speed digital platforms with preserved SEO equity.",
        deliverables: [
          "Complete visual facelift & modern UX architecture",
          "Migration from legacy systems (Wix, slow WordPress, Joomla) to Next.js",
          "100% mobile-first responsiveness overhaul",
          "SEO rank preservation & 301 URL redirect mapping",
          "Elimination of legacy code bloat and security holes",
        ],
        techStack: ["Next.js 16", "React 19", "Tailwind CSS", "Lighthouse", "Headless CMS"],
        displayOrder: 2,
        isActive: true,
        showInMenu: true,
      },
      {
        name: "Custom Web Applications",
        slug: "custom-web-apps",
        icon: "LayoutDashboard",
        shortDescription: "Scalable SaaS platforms & client portals",
        description: "Tailored full-stack web applications, SaaS platforms, and secure client portals designed around your exact business logic with multi-tenant data isolation.",
        deliverables: [
          "Tailored enterprise SaaS platforms & business portals",
          "Role-Based Access Control (RBAC) & permissions",
          "Multi-tenant data isolation & secure session tokens",
          "Interactive analytics dashboards & reporting tables",
          "Real-time notifications & bi-directional WebSockets",
        ],
        techStack: ["Next.js", "Node.js", "PostgreSQL", "Redis", "Docker"],
        displayOrder: 3,
        isActive: true,
        showInMenu: true,
      },
      {
        name: "E-commerce Development",
        slug: "ecommerce-development",
        icon: "ShoppingCart",
        shortDescription: "Custom storefronts, Shopify Plus & payment flows",
        description: "Modern headless e-commerce storefronts, Shopify Plus custom builds, and multi-vendor marketplaces engineered for high conversion rates and sub-second checkout.",
        deliverables: [
          "Custom headless storefronts & Shopify Plus integration",
          "Sub-second checkout flows with multi-currency support",
          "Cart abandonment recovery & discount engines",
          "Automated inventory synchronization & 3PL feeds",
          "Payment gateway setup (Stripe, PayPal, Apple Pay)",
        ],
        techStack: ["Next.js", "Shopify Storefront API", "Stripe", "Tailwind CSS", "PostgreSQL"],
        displayOrder: 4,
        isActive: true,
        showInMenu: true,
      },
    ],
  },
  {
    id: "mobile-development",
    name: "Mobile & App Engineering",
    slug: "mobile-development",
    icon: "Smartphone",
    description: "Native and cross-platform mobile apps for iOS and Android with fluid 60fps performance and offline resilience.",
    badge: "iOS & Android",
    displayOrder: 2,
    isActive: true,
    services: [
      {
        name: "Mobile App Development",
        slug: "mobile-app-development",
        icon: "Smartphone",
        shortDescription: "Cross-platform iOS & Android mobile applications",
        description: "High-performance cross-platform iOS and Android mobile applications built using React Native and Flutter with native device integration.",
        deliverables: [
          "Cross-platform iOS & Android apps (React Native & Flutter)",
          "Offline-first SQLite local caching & data sync",
          "Native push notifications, camera & biometric auth",
          "Apple App Store & Google Play Store release management",
          "Smooth 60fps gesture animations & responsive layouts",
        ],
        techStack: ["React Native", "Flutter", "iOS (Swift)", "Android (Kotlin)", "TypeScript"],
        displayOrder: 1,
        isActive: true,
        showInMenu: true,
      },
    ],
  },
  {
    id: "business-software",
    name: "Business Software & Integrations",
    slug: "business-software",
    icon: "Building2",
    description: "Custom ERP/CRM systems, automated booking engines, and robust API & payment integrations.",
    badge: "Automation",
    displayOrder: 3,
    isActive: true,
    services: [
      {
        name: "CRM / ERP / Business Software",
        slug: "crm-erp-software",
        icon: "Building2",
        shortDescription: "Tailored operations, pipeline CRM & multi-branch ERP",
        description: "Centralized company operating systems replacing scattered spreadsheets with unified departmental workflows, inventory tracking, and executive analytics.",
        deliverables: [
          "Tailored ERP platforms built around your exact workflows",
          "Visual Kanban pipeline CRM with automated deal stages",
          "Multi-branch, warehouse & inventory tracking",
          "Automated GST/VAT/Sales Tax billing & invoice PDFs",
          "Granular employee access roles & audit trails",
        ],
        techStack: ["Next.js", "PostgreSQL", "Node.js", "Redis", "Tailwind CSS"],
        displayOrder: 1,
        isActive: true,
        showInMenu: true,
      },
      {
        name: "Booking & Appointment Systems",
        slug: "booking-appointment-systems",
        icon: "Calendar",
        shortDescription: "Global calendar sync & multi-timezone scheduling",
        description: "Frictionless online consultation and appointment scheduling engines with automatic global timezone conversions, calendar syncing, and automated reminders.",
        deliverables: [
          "Multi-timezone calendar scheduling with dual-time preview",
          "Automated WhatsApp, SMS & Email confirmations/reminders",
          "Google Calendar, Outlook & Apple iCal bi-directional sync",
          "Deposit payment gating & cancellation fee enforcement",
          "Staff assignment, buffer times & capacity management",
        ],
        techStack: ["Next.js", "Fast2SMS", "Nodemailer", "Google Calendar API", "PostgreSQL"],
        displayOrder: 2,
        isActive: true,
        showInMenu: true,
      },
      {
        name: "API & Payment Integrations",
        slug: "api-payment-integrations",
        icon: "Receipt",
        shortDescription: "Stripe, PayPal, Razorpay, KNET & custom API bridges",
        description: "Secure payment gateway integrations, third-party software data bridges, and webhook synchronization connecting your systems with global commerce platforms.",
        deliverables: [
          "Payment gateway integrations (Stripe, PayPal, Razorpay, KNET, Tabby)",
          "Third-party ERP/CRM data bridges (Salesforce, SAP, QuickBooks)",
          "Webhook listeners with idempotent queue processing",
          "HMAC-SHA256 signed REST & GraphQL API gateways",
          "Automated recurring subscriptions & webhook reconciliation",
        ],
        techStack: ["Node.js", "Express", "Stripe API", "REST", "GraphQL", "Webhooks"],
        displayOrder: 3,
        isActive: true,
        showInMenu: true,
      },
    ],
  },
  {
    id: "creative-branding",
    name: "Creative, Design & Branding",
    slug: "creative-branding",
    icon: "Palette",
    description: "World-class interface design, interactive Figma prototypes, and complete brand identity packages.",
    badge: "Brand-Led",
    displayOrder: 4,
    isActive: true,
    services: [
      {
        name: "UI/UX Design & Prototyping",
        slug: "ui-ux-design",
        icon: "Layout",
        shortDescription: "Interactive Figma prototypes & modern design systems",
        description: "Clean, intuitive user interface design with modern typography, dark/light themes, user journey wireframes, and design token architectures.",
        deliverables: [
          "Complete interactive Figma prototypes & user journeys",
          "Atomic design systems & design token documentation",
          "Dark/Light mode theme architectures & micro-interactions",
          "Usability testing, wireframing & conversion optimization",
          "WCAG 2.1 AA accessibility compliant UI components",
        ],
        techStack: ["Figma", "Storybook", "Tailwind CSS", "Framer Motion"],
        displayOrder: 1,
        isActive: true,
        showInMenu: true,
      },
      {
        name: "Logo & Brand Identity Design",
        slug: "logo-brand-identity",
        icon: "Sparkles",
        shortDescription: "Vector logos, brand books, typography & social kits",
        description: "Memorable visual brand identities, logo marks, typography pairings, color systems, and complete corporate brand guidelines for new and scaling businesses.",
        deliverables: [
          "Custom vector logo marks, wordmarks & responsive lockups",
          "Comprehensive Brand Style Guide & typography hierarchy",
          "Standardized color palettes (CMYK, RGB, HEX, Pantone)",
          "Social media branding kit & avatar/banner templates",
          "Corporate stationery (business cards, letterheads, invoice templates)",
        ],
        techStack: ["Figma", "Adobe Illustrator", "Vector SVG", "Design Tokens"],
        displayOrder: 2,
        isActive: true,
        showInMenu: true,
      },
    ],
  },
  {
    id: "cloud-growth",
    name: "Cloud, Performance & Growth",
    slug: "cloud-growth",
    icon: "Zap",
    description: "Cloud infrastructure provisioning, proactive 24/7 SLA maintenance retainers, and technical SEO acceleration.",
    badge: "24/7 Reliability",
    displayOrder: 5,
    isActive: true,
    services: [
      {
        name: "Cloud & Deployment",
        slug: "cloud-deployment",
        icon: "Cloud",
        shortDescription: "AWS, Vercel, Docker & automated CI/CD pipelines",
        description: "Rock-solid cloud infrastructure, multi-stage Docker containerization, automated GitHub Actions pipelines, and zero-downtime blue/green deployments.",
        deliverables: [
          "Multi-stage Docker containerization & cloud provisioning",
          "Automated GitHub Actions CI/CD workflows",
          "Multi-region AWS (ECS, Lambda, RDS) and Vercel architectures",
          "Automated SSL, custom domain management & Cloudflare CDN",
          "Zero-downtime blue/green deployment orchestration",
        ],
        techStack: ["AWS", "Docker", "GitHub Actions", "Vercel", "Cloudflare"],
        displayOrder: 1,
        isActive: true,
        showInMenu: true,
      },
      {
        name: "Maintenance & Support",
        slug: "maintenance-support",
        icon: "ShieldCheck",
        shortDescription: "24/7 uptime monitoring, SLA retainers & security patches",
        description: "Proactive technical care, security patching, daily off-site backups, and round-the-clock monitoring to keep your web platforms operating without downtime.",
        deliverables: [
          "24/7 uptime monitoring & rapid incident response",
          "Formal SLA guarantee with dedicated priority support",
          "Weekly dependency security updates & vulnerability patches",
          "Automated daily offsite database backups & disaster recovery",
          "Ongoing monthly feature enhancements & bug-fix retainers",
        ],
        techStack: ["Sentry", "Datadog", "GitHub", "AWS CloudWatch", "PostgreSQL Backups"],
        displayOrder: 2,
        isActive: true,
        showInMenu: true,
      },
      {
        name: "SEO & Performance Optimization",
        slug: "seo-performance",
        icon: "TrendingUp",
        shortDescription: "Core Web Vitals 95+, technical SEO & Google ranking",
        description: "Comprehensive technical SEO audits, 95+ Core Web Vitals score optimization, structured JSON-LD schema markup, and speed acceleration that ranks on Google.",
        deliverables: [
          "Google Core Web Vitals 95+ score optimization (LCP, FID, CLS)",
          "Complete technical SEO audit & crawl error remediation",
          "Dynamic JSON-LD structured schema markup generation",
          "Edge caching, Brotli compression & WebP/AVIF asset pipeline",
          "XML sitemap, robots.txt & canonical tag management",
        ],
        techStack: ["Google Lighthouse", "Next.js Metadata API", "Schema.org", "Cloudflare CDN"],
        displayOrder: 3,
        isActive: true,
        showInMenu: true,
      },
    ],
  },
];

