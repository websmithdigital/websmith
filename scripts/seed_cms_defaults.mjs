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

const pool = new pg.Pool({ connectionString, ssl: { rejectUnauthorized: false } });

const SEED_CLIENTS = [
  { name: "Logix Global Supply Chain", company: "Enterprise Logistics", address: "Global freight tracking and inventory architecture across 8 international fulfillment hubs.", description: "Global freight tracking and inventory architecture across 8 international fulfillment hubs.", email: "contact@logixglobal.com" },
  { name: "Aura Capital Partners", company: "FinTech & Wealth Management", address: "Real-time algorithmic trading and risk analytics interface with sub-50ms market execution.", description: "Real-time algorithmic trading and risk analytics interface with sub-50ms market execution.", email: "info@auracapital.com" },
  { name: "MedCare Health Network", company: "Healthcare & Telemedicine", address: "HIPAA-compliant encrypted telemedicine portals and real-time doctor consult scheduling.", description: "HIPAA-compliant encrypted telemedicine portals and real-time doctor consult scheduling.", email: "contact@medcarenetwork.com" },
  { name: "TransLogix Express", company: "Transportation & Fleet", address: "Automated telemetry dispatch, driver routing, and live geospatial vehicle tracking.", description: "Automated telemetry dispatch, driver routing, and live geospatial vehicle tracking.", email: "dispatch@translogix.com" },
  { name: "Nordic Retail Labs", company: "eCommerce Solutions", address: "Modern B2B marketplace infrastructure with automated invoicing and multi-currency tax reporting.", description: "Modern B2B marketplace infrastructure with automated invoicing and multi-currency tax reporting.", email: "partner@nordicretail.com" },
  { name: "Vanguard Cloud Systems", company: "Cloud Infrastructure", address: "Distributed license key authentication gate serving multi-region SaaS vendors.", description: "Distributed license key authentication gate serving multi-region SaaS vendors.", email: "support@vanguardcloud.com" },
  { name: "Apex Mobility", company: "Urban Transit & IoT", address: "Connected IoT asset tracking platform with sub-second device status synchronization.", description: "Connected IoT asset tracking platform with sub-second device status synchronization.", email: "ops@apexmobility.io" },
  { name: "Solaris Energy Tech", company: "Renewable Energy Analytics", address: "High-resolution telemetry dashboard for smart solar grid performance monitoring.", description: "High-resolution telemetry dashboard for smart solar grid performance monitoring.", email: "grid@solarisenergy.com" },
  { name: "Quantum Digital Assets", company: "Institutional Digital Custody", address: "Hardware-security-backed key management and cryptographic authorization gateways.", description: "Hardware-security-backed key management and cryptographic authorization gateways.", email: "custody@quantumdigital.io" },
  { name: "Horizon EdTech", company: "Adaptive Learning Systems", address: "Interactive classroom streaming platform with automated grading and student analytics.", description: "Interactive classroom streaming platform with automated grading and student analytics.", email: "hello@horizonedtech.org" },
];

const SEED_DEVELOPERS = [
  { name: "Alex Rivera", role: "Principal Cloud Architect", headline: "Principal Cloud Architect", skills: ["AWS", "Kubernetes", "Go", "PostgreSQL"], experienceYears: 10, bio: "Designs ultra-reliable, high-throughput cloud infrastructure and distributed microservices.", email: "alex.rivera@websmithdigital.com" },
  { name: "Sophia Chen", role: "Lead Full-Stack Engineer", headline: "Lead Full-Stack Engineer", skills: ["Next.js", "React 19", "TypeScript", "Node.js"], experienceYears: 8, bio: "Specializes in modern React architecture, complex interactive dashboards, and design systems.", email: "sophia.chen@websmithdigital.com" },
  { name: "Marcus Vance", role: "Enterprise Systems Architect", headline: "Enterprise Systems Architect", skills: ["Java", "Spring Boot", "PostgreSQL", "Docker"], experienceYears: 12, bio: "Architects mission-critical ERP systems, high-compliance APIs, and enterprise data sync pipelines.", email: "marcus.vance@websmithdigital.com" },
  { name: "Elena Rostova", role: "Senior Mobile & Web Engineer", headline: "Senior Mobile & Web Engineer", skills: ["React Native", "Flutter", "iOS", "TypeScript"], experienceYears: 7, bio: "Crafts silky-smooth cross-platform mobile experiences with strict offline-first resilience.", email: "elena.rostova@websmithdigital.com" },
  { name: "David Kim", role: "Senior Security & Backend Engineer", headline: "Senior Security & Backend Engineer", skills: ["Python", "FastAPI", "Redis", "Cryptography"], experienceYears: 9, bio: "Expert in AES-256 encryption, HMAC API security gates, and ultra-low-latency backend services.", email: "david.kim@websmithdigital.com" },
  { name: "Priya Sharma", role: "Lead UI/UX Engineer", headline: "Lead UI/UX Engineer", skills: ["Tailwind CSS", "Next.js", "Figma", "Design Systems"], experienceYears: 6, bio: "Obsessed with micro-interactions, responsive typography, and enterprise-grade design systems.", email: "priya.sharma@websmithdigital.com" },
];

const SEED_PROJECTS = [
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
    name: "Shanu Jandoo Real Estate & Mortgage",
    slug: "shanu-jandoo-real-estate",
    category: "Real Estate",
    client: "Shanu Jandoo Advisory",
    clientCompany: "Luxury Real Estate & Mortgage",
    description: "Dedicated luxury residential real estate advisory, pre-construction VIP allocations, and integrated private mortgage banking platform in Toronto & GTA.",
    challenge: "Fragmented client journey between high-value property search and mortgage pre-approval causing lost luxury deals.",
    solution: "Built a unified luxury portal combining Leaflet map discovery, live MLS-style property filtering, Oppono-model private equity loans, and 1-click mortgage calculators.",
    features: ["Interactive Leaflet.js real estate map discovery & geo-filtering", "Built-in Mortgage Hub: amortization calculators, live interest rate trends, and 1-click pre-approval", "Private & Equity Lending portal with Oppono finance model", "VIP Pre-Construction allocation events with extended deposit calculators", "Integrated Admin CMS for live listing management, price drops, and tour bookings", "Dark/Light luxury obsidian gold aesthetic with video hero showcase"],
    techStack: ["Next.js", "React 19", "Leaflet.js", "Tailwind CSS", "TypeScript", "PostgreSQL", "Video Streaming"],
    metrics: "Over $45M+ luxury portfolio showcased, 4.2x increase in qualified mortgage pre-approvals",
    publicUrl: "https://mzhrealestate.vercel.app/",
    previewImage: "/images/portfolio/apexflow_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-01-10",
    feedback: [
      {
        authorName: "Shanu Jandoo",
        clientName: "Shanu Jandoo",
        company: "Principal Broker, Shanu Jandoo Real Estate",
        rating: 5,
        comment: "Websmith transformed our property portal into the fastest in the luxury market. Tour bookings and mortgage pre-approvals skyrocketed within 30 days.",
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
    name: "Schoolera Multi-Tenant Cloud ERP",
    slug: "schoolera-cloud-erp",
    category: "Education",
    client: "Schoolera SaaS",
    clientCompany: "K-12 Educational Technologies",
    description: "All-in-one multi-tenant SaaS ecosystem for K-12 schools, parents, students, and campus vendors across Saudi Arabia and the GCC, unifying campus commerce, cashless digital wallets, canteen POS, and tuition fees.",
    challenge: "Disparate campus systems for canteen payments, school stores, fee collection, and vendor settlement causing administrative overhead and cash leakage.",
    solution: "Engineered a centralized multi-tenant cloud platform with 6 dedicated role portals (Super Admin, School Admin, Parent, Student, Vendor, Canteen) and cashless digital wallets.",
    features: ["6 Dedicated Role-Based Portals: Super Admin, School Admin, Parent, Student, Vendor, and Canteen", "Cashless Digital Wallet with parent top-ups, daily spending limits, and student QR badge payments", "School Store & Uniforms e-commerce with inventory and vendor fulfillment tracking", "Automated Tuition Fee Collection with digital invoices, payment schedules, and GCC payment gateways", "Canteen POS operations console with live menu management and dietary controls", "Multi-tenant cloud architecture engineered for GCC educational institutions"],
    techStack: ["Next.js", "React 19", "TypeScript", "PostgreSQL", "Redis", "Docker", "Tailwind CSS", "GCC Payment APIs"],
    metrics: "Deployed across 15+ GCC institutions, 100% cashless canteen adoption with 0 billing disputes",
    publicUrl: "https://schoolera.vercel.app/",
    previewImage: "/images/portfolio/license_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-04-01",
    feedback: [
      {
        authorName: "Dr. Tariq Al-Otaibi",
        clientName: "Dr. Tariq Al-Otaibi",
        company: "Director of Digital Strategy, Schoolera",
        rating: 5,
        comment: "Schoolera completely transformed our campus operations. Cashless wallets and the multi-role portals streamlined student dining and fee collection across all campuses.",
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
    name: "MZH Resin Art Atelier",
    slug: "mzh-resin-art",
    category: "E-Commerce & Retail",
    client: "MZH Resin Art Atelier",
    clientCompany: "Luxury Handcrafted Resin Art",
    description: "Luxury handcrafted resin art atelier featuring ocean-inspired wall clocks, custom live-edge tables, and eternal wedding varmala floral preservations with museum-grade UV protection and insured nationwide delivery.",
    challenge: "Showcasing bespoke handcrafted luxury art online with high-fidelity visual detail while handling delicate custom floral preservation workflows.",
    solution: "Engineered a high-aesthetic luxury e-commerce experience with interactive drop showcases, bespoke custom order inquiries, and secure 256-bit encrypted checkout.",
    features: ["Interactive Atelier Drop showcase with Ocean & Varmala collections", "Curated e-commerce catalog (Wall Art, Ocean Tables, Keepsakes, Coasters)", "Bespoke preservation ordering pipeline with custom inquiry requests", "VIP Atelier Club newsletter and multi-channel order tracking", "Museum-grade UV-resistant and non-toxic resin craftsmanship"],
    techStack: ["Next.js", "React 19", "Tailwind CSS", "TypeScript", "PWA", "Framer Motion", "Stripe"],
    metrics: "3.2x increase in bespoke inquiries, zero transit damage with insured shipping",
    publicUrl: "https://mzhresin-art.vercel.app/",
    previewImage: "/images/portfolio/nordic_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-03-01",
    feedback: [
      {
        authorName: "Ayesha Khan",
        clientName: "Ayesha Khan",
        company: "Founder, MZH Resin Art Atelier",
        rating: 5,
        comment: "Websmith brought our luxury atelier vision to life with stunning aesthetics. Our customers love the bespoke varmala preservation inquiry process.",
        publishedAsTestimonial: true,
        date: "2025-06-20",
      },
    ],
  },
  {
    name: "Niyaj Enterprise",
    slug: "niyaj-enterprise",
    category: "E-Commerce & Retail",
    client: "Niyaj Enterprise",
    clientCompany: "Artisan Luxury Leather Goods",
    description: "Artisan luxury leather atelier featuring handcrafted full-grain ladies handbags, bespoke genuine leather jackets, purses, and belts with 256-bit encrypted checkout and insured global delivery.",
    challenge: "Establishing an international luxury e-commerce presence for bespoke genuine leather goods, handling customization inquiries, and building trust across high-value global transactions.",
    solution: "Engineered a high-performance modern e-commerce storefront with categorized collections (Ladies Handbags, Leather Jackets, Wallets & Belts), secure checkout, and interactive customer inquiry routing.",
    features: [
      "Handcrafted Full-Grain Leather Handbags, Purses, & Shoulder Bags Showcase",
      "Bespoke Genuine Leather Jackets & Custom Fit Ordering",
      "Luxury Leather Belts & Men's Accessory Catalog with dynamic filtering",
      "256-Bit Encrypted Secure Checkout with international card & digital wallet support",
      "100% Genuine Leather Quality Guarantee & Insured Global Shipping tracking"
    ],
    techStack: ["Next.js", "React 19", "Tailwind CSS", "TypeScript", "PWA", "Stripe"],
    metrics: "2.8x increase in direct international orders, 0 return disputes across 4,500+ leather shipments",
    publicUrl: "https://niyaj-enterprise.vercel.app/",
    previewImage: "/images/portfolio/marketplace_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-05-18",
    feedback: [
      {
        authorName: "Niyaj Ahmed",
        clientName: "Niyaj Ahmed",
        company: "Founder & Master Artisan, Niyaj Enterprise",
        rating: 5,
        comment: "Websmith created an exquisite digital storefront that conveys our artisanal leather craftsmanship. Our international orders have grown exponentially.",
        publishedAsTestimonial: true,
        date: "2025-09-22",
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
    name: "ApnaCab On-Demand Mobility",
    slug: "apnacab-mobility",
    category: "Logistics",
    client: "ApnaCab Technologies",
    clientCompany: "On-Demand Ride Hailing & Fleet",
    description: "Modern real-time cab booking and dispatch application featuring Mapbox GL interactive geospatial routing, live pickup/dropoff address autocompletion, dynamic fare calculation by vehicle tier, and secure Stripe payment processing.",
    challenge: "High passenger drop-offs during ride booking due to clunky route mapping, unpredictable fare calculations, and slow payment checkout.",
    solution: "Engineered a responsive ride-hailing web platform utilizing Mapbox GL direction tracing, dynamic distance-based pricing engine, Clerk user authentication, and 1-click Stripe payments.",
    features: ["Interactive Mapbox GL vector map with real-time route tracing and distance estimation", "Instant pickup & dropoff geocoding autocomplete with user GPS geolocation detection", "Tiered fleet vehicle selection (Sedan, SUV, Luxury Cab) with dynamic rate calculation", "Integrated Stripe checkout for secure, seamless digital ride payments", "Secure passenger authentication and ride history with Clerk Auth", "Responsive mobile-first Progressive Web App interface designed for high rider throughput"],
    techStack: ["Next.js 15", "React 19", "Mapbox GL", "React Map GL", "Stripe", "Clerk Auth", "Tailwind CSS", "TypeScript"],
    metrics: "Sub-3-second ride booking flow, 99.8% booking completion rate across active test markets",
    publicUrl: "https://apnacab.vercel.app/",
    previewImage: "/images/portfolio/fleet_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-05-15",
    feedback: [
      {
        authorName: "Vikram Malhotra",
        clientName: "Vikram Malhotra",
        company: "Chief Product Officer, ApnaCab",
        rating: 5,
        comment: "The Mapbox routing and instant price calculation delivered by Websmith gave us the seamless rider experience needed to compete with established giants.",
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

async function run() {
  const client = await pool.connect();
  try {
    console.log("Seeding CMS defaults into database...");

    // 1. Seed 10 Clients into portal_users (role: 'client', published: true)
    let clientsAdded = 0;
    for (let i = 0; i < SEED_CLIENTS.length; i++) {
      const c = SEED_CLIENTS[i];
      const existing = await client.query(
        `SELECT _id FROM portal_users WHERE data->>'email' = $1 OR data->>'name' = $2`,
        [c.email, c.name]
      );
      if (existing.rows.length === 0) {
        const _id = crypto.randomBytes(12).toString("hex");
        const customId = `CL-${String(i + 101).padStart(4, "0")}`;
        const doc = {
          _id,
          ...c,
          role: "client",
          status: "active",
          published: true,
          customId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await client.query(`INSERT INTO portal_users (_id, data) VALUES ($1, $2)`, [_id, JSON.stringify(doc)]);
        clientsAdded++;
      } else {
        const rowId = existing.rows[0]._id;
        await client.query(
          `UPDATE portal_users SET data = jsonb_set(data, '{published}', 'true') WHERE _id = $1`,
          [rowId]
        );
      }
    }
    console.log(`Clients processed: ${clientsAdded} newly added.`);

    // 2. Seed 6 Developers into portal_users (role: 'developer', published: true)
    let devsAdded = 0;
    for (let i = 0; i < SEED_DEVELOPERS.length; i++) {
      const d = SEED_DEVELOPERS[i];
      const existing = await client.query(
        `SELECT _id FROM portal_users WHERE data->>'email' = $1 OR data->>'name' = $2`,
        [d.email, d.name]
      );
      if (existing.rows.length === 0) {
        const _id = crypto.randomBytes(12).toString("hex");
        const customId = `DEV-${String(i + 101).padStart(4, "0")}`;
        const doc = {
          _id,
          ...d,
          role: "developer",
          status: "active",
          published: true,
          customId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await client.query(`INSERT INTO portal_users (_id, data) VALUES ($1, $2)`, [_id, JSON.stringify(doc)]);
        devsAdded++;
      } else {
        const rowId = existing.rows[0]._id;
        await client.query(
          `UPDATE portal_users SET data = jsonb_set(data, '{published}', 'true') WHERE _id = $1`,
          [rowId]
        );
      }
    }
    console.log(`Developers processed: ${devsAdded} newly added.`);

    // 3. Seed 16 Projects into portal_projects (published: true, with testimonials)
    let projectsAdded = 0;
    const baseTime = Date.now();
    for (let i = 0; i < SEED_PROJECTS.length; i++) {
      const p = SEED_PROJECTS[i];
      const existing = await client.query(
        `SELECT _id FROM portal_projects WHERE data->>'name' = $1`,
        [p.name]
      );
      const createdAt = new Date(baseTime + (SEED_PROJECTS.length - i) * 60000).toISOString();
      if (existing.rows.length === 0) {
        const _id = crypto.randomBytes(12).toString("hex");
        const doc = {
          _id,
          ...p,
          createdAt,
          updatedAt: createdAt,
        };
        await client.query(`INSERT INTO portal_projects (_id, data) VALUES ($1, $2)`, [_id, JSON.stringify(doc)]);
        projectsAdded++;
      } else {
        const rowId = existing.rows[0]._id;
        await client.query(
          `UPDATE portal_projects SET data = jsonb_set(jsonb_set(data, '{published}', 'true'), '{feedback}', $2::jsonb) WHERE _id = $1`,
          [rowId, JSON.stringify(p.feedback)]
        );
      }
    }
    console.log(`Projects processed: ${projectsAdded} newly added.`);

    console.log("Seeding complete!");
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(console.error);
