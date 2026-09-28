// scripts/sync_portfolio_projects.mjs
// Synchronizes 16 modernized industry showcase projects with clean, professional names into Neon PostgreSQL (portal_projects)

import pg from 'pg';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

let envContent = '';
try {
  envContent = fs.readFileSync(path.resolve('.env.local'), 'utf-8');
} catch {
  try {
    envContent = fs.readFileSync(path.resolve('.env'), 'utf-8');
  } catch {}
}

let connectionString = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
if (!connectionString && envContent) {
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('DATABASE_URL=') || trimmed.startsWith('NEON_DATABASE_URL=')) {
      connectionString = trimmed.split('=')[1]?.replace(/^["']|["']$/g, '');
      break;
    }
  }
}

if (!connectionString) {
  console.error("No DATABASE_URL found in environment or .env files.");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });

export const MODERN_PROJECTS = [
  // 1. STARTUPS & SMBS (2 Projects)
  {
    name: "VentureCraft Studio",
    slug: "venturecraft-studio",
    category: "Startups & SMBs",
    client: "VentureCraft Labs",
    clientCompany: "Tech Venture Studio",
    description: "End-to-end venture launch package including modern vector logo & brand identity guidelines, high-converting marketing website, and clickable multi-tenant SaaS MVP with Stripe billing.",
    challenge: "Tight 4-week investor demo deadline with zero existing brand assets and no backend infrastructure.",
    solution: "Designed full vector branding kit, brand guidelines, and engineered a production Next.js 16 SaaS platform in 24 calendar days.",
    features: ["Vector logo package & brand identity style guide", "Next.js 16 high-converting marketing website", "Interactive SaaS MVP with multi-tenant auth", "Automated Stripe subscription billing & tier gating"],
    techStack: ["Next.js 16", "React 19", "Tailwind CSS", "PostgreSQL", "Stripe", "Figma", "Docker"],
    metrics: "Launched in 24 days, successfully closed $1.2M seed funding round",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/apexflow_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-05-01",
    feedback: [
      {
        authorName: "Liam Gallagher",
        clientName: "Liam Gallagher",
        company: "Co-Founder, VentureCraft Labs",
        rating: 5,
        comment: "Websmith delivered our logo, brand book, marketing landing page, and live SaaS MVP in just over 3 weeks. Investors were blown away.",
        publishedAsTestimonial: true,
        date: "2025-09-02",
      },
    ],
  },
  {
    name: "NexusFlow Studio",
    slug: "nexusflow-studio",
    category: "Startups & SMBs",
    client: "NexusFlow Inc.",
    clientCompany: "Workflow Automation",
    description: "Visual drag-and-drop workflow canvas enabling non-technical teams to connect third-party APIs, trigger webhooks, and automate internal business processes.",
    challenge: "High engineering backlog creating bottlenecks for operations teams needing routine API data transfers and customer notifications.",
    solution: "Built a high-performance flow-based orchestration engine using React Flow, Redis BullMQ queues, and sandboxed Node.js step execution.",
    features: ["Visual node-based drag-and-drop workflow builder", "Over 50+ pre-built third-party API connectors", "Real-time execution log inspector and retry engine", "Multi-tenant team workspaces with RBAC permissions"],
    techStack: ["React 19", "Next.js 16", "Redis", "BullMQ", "PostgreSQL", "Tailwind CSS", "TypeScript"],
    metrics: "Reduced manual team workflows by 82%, processed 1.2M automated jobs in first quarter",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/finpulse_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-06-10",
    feedback: [
      {
        authorName: "Kavita Rao",
        clientName: "Kavita Rao",
        company: "Head of Product, NexusFlow",
        rating: 5,
        comment: "The visual workflow canvas built by Websmith is responsive and rock-solid. It allowed us to launch months ahead of competitors.",
        publishedAsTestimonial: true,
        date: "2025-09-14",
      },
    ],
  },

  // 2. HEALTHCARE (2 Projects)
  {
    name: "MedCare Live",
    slug: "medcare-live",
    category: "Healthcare",
    client: "MedCare Health Network",
    clientCompany: "Telehealth & Clinical Care",
    description: "HIPAA-compliant telemedicine consultation platform with peer-to-peer encrypted WebRTC video rooms, multi-timezone appointment booking, and EHR/FHIR interoperability.",
    challenge: "Strict HIPAA regulations, high video latency over mobile networks, and siloed clinic scheduling causing 35% no-show rates.",
    solution: "Architected an AES-256 encrypted consultation suite with automated WhatsApp and SMS appointment reminders and adaptive bitrate video streaming.",
    features: ["End-to-end encrypted WebRTC video rooms", "Automated SMS/Email appointment confirmations", "FHIR-compliant patient chart sync", "Multi-provider calendar buffer management"],
    techStack: ["Next.js", "WebRTC", "PostgreSQL", "Node.js", "AWS KMS", "Docker", "FHIR Standards"],
    metrics: "99.99% video uptime across 40,000+ monthly clinical sessions, 62% cut in patient wait times",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/telemed_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-02-01",
    feedback: [
      {
        authorName: "Dr. Julian Martinez",
        clientName: "Dr. Julian Martinez",
        company: "Chief Medical Officer, MedCare Network",
        rating: 5,
        comment: "Security and HIPAA compliance were non-negotiable for us. Websmith's architecture passed all third-party penetration audits seamlessly.",
        publishedAsTestimonial: true,
        date: "2025-05-18",
      },
    ],
  },
  {
    name: "PharmaSync Portal",
    slug: "pharmasync-portal",
    category: "Healthcare",
    client: "PharmaSync Alliance",
    clientCompany: "Pharmacy Networks",
    description: "Cloud-native e-prescription routing engine connecting healthcare providers with regional pharmacies, featuring barcode medicine verification and automated patient refill alerts.",
    challenge: "Prescription transcription errors and delayed refill approvals leading to customer frustration and regulatory compliance risks.",
    solution: "Engineered an audit-trailed digital prescription exchange with doctor digital signatures, real-time inventory checks, and patient SMS notifications.",
    features: ["Cryptographic doctor e-prescription verification", "Real-time pharmacy stock lookup across 45 branches", "Automated refill request SMS bot with 1-click renewal", "Full DEA / FDA digital prescription audit logging"],
    techStack: ["Next.js 16", "PostgreSQL", "Redis", "TypeScript", "Twilio API", "Tailwind CSS", "Docker"],
    metrics: "Cut prescription fill delays from 4 hours to 12 minutes, zero dispensing errors across 180,000 orders",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/license_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-03-20",
    feedback: [
      {
        authorName: "Dr. Rachel Al-Mansoor",
        clientName: "Dr. Rachel Al-Mansoor",
        company: "Director of Pharmacy Operations, PharmaSync",
        rating: 5,
        comment: "PharmaSync revolutionized how our network dispenses medications. The real-time inventory checks and doctor signatures are seamless.",
        publishedAsTestimonial: true,
        date: "2025-07-22",
      },
    ],
  },

  // 3. REAL ESTATE (2 Projects)
  {
    name: "Apex Realty",
    slug: "apex-realty",
    category: "Real Estate",
    client: "Apex Realty Group",
    clientCompany: "Luxury Real Estate",
    description: "Modern bilingual real estate discovery engine with real-time MLS/RESO Web API synchronization, interactive Mapbox clustering, and 3D virtual tour viewer.",
    challenge: "Laggy map rendering and inconsistent listing updates across regional MLS boards leading to lost buyer tour requests.",
    solution: "Engineered a sub-second Next.js 16 portal with geo-indexed PostgreSQL PostGIS bounding box queries and automated RESO Web API replication.",
    features: ["Real-time MLS/IDX feed replication", "Interactive Mapbox GL vector clustering", "Direct agent WhatsApp/SMS tour dispatch", "Automated virtual tour & floorplan viewer"],
    techStack: ["Next.js 16", "Mapbox GL", "PostgreSQL", "PostGIS", "Redis", "TypeScript", "Tailwind CSS"],
    metrics: "3.4x faster listing search, 42% lift in direct tour bookings",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/apexflow_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-01-10",
    feedback: [
      {
        authorName: "Marcus Thorne",
        clientName: "Marcus Thorne",
        company: "Managing Partner, Apex Realty",
        rating: 5,
        comment: "Websmith transformed our property portal into the fastest in the luxury market. Tour bookings skyrocketed within 30 days.",
        publishedAsTestimonial: true,
        date: "2025-04-12",
      },
    ],
  },
  {
    name: "HavenStay Engine",
    slug: "havenstay-engine",
    category: "Real Estate",
    client: "HavenStay Escapes",
    clientCompany: "Vacation Rentals & Hospitality",
    description: "Direct booking engine and centralized Property Management System (PMS) unifying multi-calendar availability across Airbnb, VRBO, and direct booking channels.",
    challenge: "Double-bookings caused by 15-minute iCal sync delays and paying 18% OTA commission fees on repeat high-value guests.",
    solution: "Built a direct booking portal with sub-second bi-directional calendar webhooks, automated Stripe security deposit holding, and smart lock keycode generation.",
    features: ["Zero-commission direct booking checkout", "Two-way sub-second multi-channel calendar sync", "Automated smart door lock PIN generation", "Automated cleaning team dispatch & turnover calendar"],
    techStack: ["Next.js 16", "PostgreSQL", "Stripe Connect", "IoT Smart Lock APIs", "Tailwind CSS", "Redis"],
    metrics: "Saved $110,000 in OTA fees within 6 months, 0 double bookings across 120 properties",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/marketplace_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-04-05",
    feedback: [
      {
        authorName: "Chloe Davenport",
        clientName: "Chloe Davenport",
        company: "Founder & COO, HavenStay",
        rating: 5,
        comment: "Direct bookings increased from 8% to 48% within 90 days of launching our new HavenStay platform. The automated door codes save us hours every day.",
        publishedAsTestimonial: true,
        date: "2025-08-14",
      },
    ],
  },

  // 4. EDUCATION (2 Projects)
  {
    name: "Horizon Classroom",
    slug: "horizon-classroom",
    category: "Education",
    client: "Horizon EdTech Institute",
    clientCompany: "Adaptive Digital Learning",
    description: "Modern learning management system (LMS) with adaptive multi-bitrate video streaming, live student chat, interactive coding quizzes, and automated certificate generation.",
    challenge: "Buffering issues during synchronized video lectures and high student drop-off due to an outdated, clunky legacy portal.",
    solution: "Developed an edge-streamed Next.js LMS platform with gamified progress checkpoints, live teacher Q&A, and modular course paywalls.",
    features: ["Adaptive bitrate HLS video delivery", "Real-time classroom WebSocket interactions", "Automated quiz grading with timer guards", "Digital verifiable completion certificates"],
    techStack: ["Next.js", "React 19", "Node.js", "PostgreSQL", "WebSockets", "Cloudflare Stream", "Stripe"],
    metrics: "Scaled smoothly to 35,000 active concurrent students with 0 buffering incidents",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/license_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-04-01",
    feedback: [
      {
        authorName: "Dr. Evelyn Reed",
        clientName: "Dr. Evelyn Reed",
        company: "Dean of Digital Learning, Horizon EdTech",
        rating: 5,
        comment: "The live virtual classrooms and video streaming are silky smooth even during campus-wide exams. Exceptional engineering.",
        publishedAsTestimonial: true,
        date: "2025-08-05",
      },
    ],
  },
  {
    name: "CampusSync Portal",
    slug: "campussync-portal",
    category: "Education",
    client: "Metropolitan University",
    clientCompany: "Higher Education",
    description: "Centralized university management suite supporting course enrollment, dynamic GPA calculation, digital transcript requests, and installment tuition payment gateways.",
    challenge: "System crashes during semester course registration registration rushes and paper-based transcript approval delays.",
    solution: "Engineered a high-concurrency microservice handling 15,000 simultaneous student registrations with Redis queue locking and instant tuition receipts.",
    features: ["High-concurrency instant course seat reservation", "Dynamic GPA / transcript generation with watermark security", "Automated tuition fee payment installment scheduler", "Faculty grading portal with LMS grade sync"],
    techStack: ["Next.js 16", "TypeScript", "PostgreSQL", "Redis", "Docker", "Stripe", "Tailwind CSS"],
    metrics: "Handled 18,500 simultaneous enrollments in 10 minutes with zero downtime",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/apexflow_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-05-10",
    feedback: [
      {
        authorName: "Prof. Arthur Pendelton",
        clientName: "Prof. Arthur Pendelton",
        company: "Registrar, Metropolitan Academic University",
        rating: 5,
        comment: "Course registration day used to crash our servers every semester. With CampusSync, 18,000 students registered without a single error.",
        publishedAsTestimonial: true,
        date: "2025-09-12",
      },
    ],
  },

  // 5. E-COMMERCE & RETAIL (2 Projects)
  {
    name: "Nordic Storefront",
    slug: "nordic-storefront",
    category: "E-Commerce & Retail",
    client: "Nordic Retail Labs",
    clientCompany: "Omnichannel Retail",
    description: "Headless e-commerce storefront integrated with Shopify Plus, sub-500ms global checkout, multi-currency pricing, and automated inventory sync across 8 fulfillment centers.",
    challenge: "Monolithic Magento catalog crashing during flash sales with high cart abandonment and slow mobile page loads.",
    solution: "Re-architected the catalog into a headless Next.js 16 frontend with edge caching, Redis atomic stock decrementing, and sub-second checkout routing.",
    features: ["Headless Shopify Plus architecture", "Sub-500ms multi-currency checkout", "Flash-sale atomic inventory locks", "Automated 3PL warehouse fulfillment feeds"],
    techStack: ["React 19", "Next.js 16", "Shopify Storefront API", "Stripe", "Redis", "PostgreSQL", "Tailwind CSS"],
    metrics: "Handled 140,000 orders in 4 hours with 0 cart drops, 34% lift in conversion",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/nordic_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-03-01",
    feedback: [
      {
        authorName: "Astrid Lindholm",
        clientName: "Astrid Lindholm",
        company: "Head of Digital, Nordic Retail Labs",
        rating: 5,
        comment: "Our Black Friday traffic was handled flawlessly. Zero dropped checkouts and blazing fast page transitions on mobile.",
        publishedAsTestimonial: true,
        date: "2025-06-20",
      },
    ],
  },
  {
    name: "AuraStyle Studio",
    slug: "aurastyle-studio",
    category: "E-Commerce & Retail",
    client: "AuraStyle Brands",
    clientCompany: "Luxury Fashion & Apparel",
    description: "High-fashion omnichannel retail platform featuring interactive WebGL 3D garment views, AI size recommendation engine, and abandoned cart SMS recovery.",
    challenge: "High return rates (38%) caused by inaccurate sizing and slow mobile catalog load times dampening luxury buyer engagement.",
    solution: "Engineered a custom Three.js 3D fabric visualizer combined with a 5-question AI size recommendation model and 1-click Apple Pay / Google Pay checkout.",
    features: ["Interactive Three.js 3D garment visualization", "AI smart sizing recommendation reducing returns", "1-click Apple Pay & Google Pay express checkout", "Automated personalized SMS abandoned cart sequences"],
    techStack: ["Next.js 16", "Three.js", "WebGL", "PostgreSQL", "Shopify Plus", "Klaviyo API", "Tailwind CSS"],
    metrics: "Cut garment return rate from 38% to 14%, 28% increase in average order value (AOV)",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/finpulse_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-05-18",
    feedback: [
      {
        authorName: "Dominique Moreau",
        clientName: "Dominique Moreau",
        company: "Creative Director, AuraStyle Brands",
        rating: 5,
        comment: "The 3D garment visualizer gave our online store the luxury showroom feel we needed. Our return rates dropped dramatically.",
        publishedAsTestimonial: true,
        date: "2025-09-20",
      },
    ],
  },

  // 6. RESTAURANTS & HOSPITALITY (2 Projects)
  {
    name: "Artisan Dine",
    slug: "artisan-dine",
    category: "Restaurants & Hospitality",
    client: "Artisan Dining Group",
    clientCompany: "Hospitality & Restaurants",
    description: "Direct-to-consumer digital food ordering web app, real-time table reservation floorplan, contactless digital QR menus, and kitchen display unit (KDS) integration.",
    challenge: "High third-party delivery commissions (30%) eroding margins and double bookings during busy weekend dinner services.",
    solution: "Built a white-label direct ordering Progressive Web App (PWA) with instant kitchen WebSocket streaming and SMS arrival notifications.",
    features: ["Zero-install mobile ordering PWA", "Interactive visual table floorplan reservation", "Digital QR menu instant-sync dashboard", "Direct payment processing eliminating aggregator fees"],
    techStack: ["Next.js", "React 19", "WebSockets", "PostgreSQL", "Stripe", "PWA", "Tailwind CSS"],
    metrics: "$240,000 saved in 3rd-party delivery commissions within 6 months",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/fleet_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-03-15",
    feedback: [
      {
        authorName: "Chef Matteo Rossi",
        clientName: "Chef Matteo Rossi",
        company: "Founder & Executive Chef, Artisan Dining",
        rating: 5,
        comment: "By taking control of our direct ordering and table reservations, we saved six figures in aggregator fees while giving guests a flawless experience.",
        publishedAsTestimonial: true,
        date: "2025-07-10",
      },
    ],
  },
  {
    name: "BoutiqueStay Concierge",
    slug: "boutiquestay-concierge",
    category: "Restaurants & Hospitality",
    client: "BoutiqueStay Resorts",
    clientCompany: "Luxury Resorts & Spas",
    description: "Guest-facing mobile resort portal supporting digital room keys, contactless pool & cabana food ordering, live concierge chat, and excursion reservations.",
    challenge: "Front-desk queues during check-in peaks and missed ancillary revenue from spa appointments and poolside dining.",
    solution: "Built a lightning-fast resort web app accessible via room QR codes or booking SMS with integrated room-charge billing and instant staff dispatch.",
    features: ["Digital check-in and mobile room access key", "Cabana & poolside QR food and cocktail ordering", "Real-time multilingual guest concierge chat", "Integrated room-folio billing for all resort amenities"],
    techStack: ["Next.js 16", "WebSockets", "PostgreSQL", "Stripe Terminal", "PWA", "Tailwind CSS"],
    metrics: "42% increase in on-property guest ancillary spend, front desk wait times reduced by 70%",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/telemed_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-06-01",
    feedback: [
      {
        authorName: "Camilla Bernardi",
        clientName: "Camilla Bernardi",
        company: "General Manager, BoutiqueStay Grand Resort",
        rating: 5,
        comment: "Our guests love ordering drinks from their sunbeds without waiting for a server. The platform elevated our 5-star guest satisfaction ratings.",
        publishedAsTestimonial: true,
        date: "2025-09-22",
      },
    ],
  },

  // 7. PROFESSIONAL SERVICES (2 Projects)
  {
    name: "Vance & Sterling Vault",
    slug: "vance-sterling-vault",
    category: "Professional Services",
    client: "Vance & Sterling Legal",
    clientCompany: "Corporate Law & Advisory",
    description: "Bank-grade encrypted corporate client intake portal, zero-knowledge document repository, automated retainer agreements with e-signatures, and milestone billing.",
    challenge: "Unencrypted email exchanges exposing sensitive corporate merger files and days spent chasing clients for signed retainers.",
    solution: "Engineered an AES-256 encrypted client portal with granular role-based file access and integrated legally binding electronic signatures.",
    features: ["Bank-grade AES-256 encrypted document vault", "Automated digital intake & retainer e-signatures", "Multi-party time-tracking and milestone invoicing", "Complete regulatory compliance audit trail"],
    techStack: ["Next.js 16", "TypeScript", "PostgreSQL", "Node.js", "AWS KMS", "DocuSign API", "Tailwind CSS"],
    metrics: "Reduced corporate onboarding time from 5 days to 25 minutes, 100% security audit pass",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/finpulse_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-04-20",
    feedback: [
      {
        authorName: "Julian Vance",
        clientName: "Julian Vance",
        company: "Senior Partner, Vance & Sterling",
        rating: 5,
        comment: "Our corporate clients rave about the security and speed of our new client portal. It elevated our practice to the next tier.",
        publishedAsTestimonial: true,
        date: "2025-08-25",
      },
    ],
  },
  {
    name: "AuditCrest Hub",
    slug: "auditcrest-hub",
    category: "Professional Services",
    client: "AuditCrest Financial",
    clientCompany: "Certified Public Accounting",
    description: "Secure accounting client portal with automated tax document intake, receipt OCR scanning, milestone retainer invoicing, and private messaging.",
    challenge: "Scattered paper receipts, missing client tax documents during fiscal deadlines, and manual follow-up phone calls.",
    solution: "Created a centralized client accounting portal with instant mobile camera receipt uploading, automated OCR data extraction, and progress dashboards.",
    features: ["Mobile camera receipt upload with automated OCR parsing", "Secure encrypted tax filing document dropbox", "Milestone retainer payment gateway with ACH/Credit Card", "Automated missing document checklist reminders"],
    techStack: ["Next.js 16", "Tesseract OCR", "PostgreSQL", "Stripe ACH", "AWS S3", "Tailwind CSS"],
    metrics: "Accelerated tax return filing turnaround by 55%, zero misplaced client receipts",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/apexflow_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-06-15",
    feedback: [
      {
        authorName: "Marcus Sterling, CPA",
        clientName: "Marcus Sterling, CPA",
        company: "Managing Director, AuditCrest Financial",
        rating: 5,
        comment: "Tax season used to be chaotic with disorganized paperwork. AuditCrest portal automated 70% of our document collection. A complete game changer.",
        publishedAsTestimonial: true,
        date: "2025-09-26",
      },
    ],
  },

  // 8. LOGISTICS (2 Projects)
  {
    name: "TransLogix Fleet",
    slug: "translogix-fleet",
    category: "Logistics",
    client: "TransLogix Express",
    clientCompany: "Fleet & Freight Logistics",
    description: "Live GPS vehicle telematics tracking, algorithmic route optimization microservice, and mobile barcode inventory dispatch system managing 600+ transport vehicles.",
    challenge: "Static driver routing and high fuel burn causing 18% shipping delays and lost shipments across regional distribution hubs.",
    solution: "Engineered a dynamic TSP routing engine integrated with real-time GPS telemetry streams and offline-resilient warehouse barcode Progressive Web App.",
    features: ["Sub-second GPS vehicle telematics ingestion", "Dynamic route optimization for fuel reduction", "Offline barcode & QR warehouse Progressive Web App", "Automated Bill of Lading (BOL) generation"],
    techStack: ["TypeScript", "PostGIS", "Redis Streams", "Mapbox GL", "Next.js", "Docker", "Go"],
    metrics: "18% reduction in fuel consumption, zero lost shipments across 8 distribution hubs",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/fleet_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-05-15",
    feedback: [
      {
        authorName: "Michael O'Connor",
        clientName: "Michael O'Connor",
        company: "COO, TransLogix Express",
        rating: 5,
        comment: "From architectural consulting to production launch, Websmith has been an indispensable engineering partner for our fleet dispatch system.",
        publishedAsTestimonial: true,
        date: "2025-09-18",
      },
    ],
  },
  {
    name: "CargoHub International",
    slug: "cargohub-international",
    category: "Logistics",
    client: "CargoHub Global",
    clientCompany: "Ocean & Air Freight Forwarding",
    description: "Comprehensive freight forwarding visibility engine tracking maritime containers and air cargo shipments with automated customs document compliance checks.",
    challenge: "Unpredictable port delays and manual paper customs declarations resulting in demurrage fines and client disputes.",
    solution: "Integrated ocean carrier AIS container tracking with automated HS-code tariff validation, instant Bill of Lading PDF generation, and milestone webhooks.",
    features: ["Real-time ocean container AIS vessel tracking", "Automated HS-code customs declaration paperwork generator", "Demurrage penalty early-warning alert system", "Direct client self-service shipment tracking portal"],
    techStack: ["Next.js 16", "AIS Marine APIs", "PostgreSQL", "Redis", "TypeScript", "Tailwind CSS", "Docker"],
    metrics: "Reduced port customs clearance delays by 68%, zero demurrage penalties incurred",
    publicUrl: "https://websmithdigital.com",
    previewImage: "/images/portfolio/marketplace_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-06-25",
    feedback: [
      {
        authorName: "Tariq Al-Hamad",
        clientName: "Tariq Al-Hamad",
        company: "VP Operations, CargoHub International",
        rating: 5,
        comment: "CargoHub transformed our cross-border shipping operations. Our customers now track their international freight with complete transparency.",
        publishedAsTestimonial: true,
        date: "2025-09-28",
      },
    ],
  },
];

async function sync() {
  const client = await pool.connect();
  try {
    console.log("Connected to PostgreSQL database.");
    await client.query(`
      CREATE TABLE IF NOT EXISTS portal_projects (
        _id TEXT PRIMARY KEY,
        data JSONB NOT NULL
      )
    `);

    // Clear old projects and re-seed with all 16 modernized showcase projects
    await client.query(`DELETE FROM portal_projects`);
    console.log("Cleared existing portal_projects records.");

    let inserted = 0;
    const baseTime = Date.now();
    for (let i = 0; i < MODERN_PROJECTS.length; i++) {
      const p = MODERN_PROJECTS[i];
      const _id = crypto.randomBytes(12).toString("hex");
      // Stagger createdAt so Startups & SMBs (at index 0) is newest, down to Logistics at the end
      const createdAt = new Date(baseTime + (MODERN_PROJECTS.length - i) * 60000).toISOString();
      const doc = {
        _id,
        ...p,
        createdAt,
        updatedAt: createdAt,
      };
      await client.query(`INSERT INTO portal_projects (_id, data) VALUES ($1, $2)`, [_id, JSON.stringify(doc)]);
      inserted++;
    }

    console.log(`Successfully synced ${inserted} modernized portfolio projects (with proper names and correct order) into portal_projects.`);
  } finally {
    client.release();
    await pool.end();
  }
}

sync().catch((err) => {
  console.error("Sync error:", err);
  process.exit(1);
});
