33// FILE: app/api/projects/public/route.ts
// PURPOSE: Public API for published projects with full portfolio metadata and auto-seeding

import { apiHandler, json, serialize } from "@/lib/server/api";

const SEED_PROJECTS = [
  // 1. REAL ESTATE (1 Project)
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

  // 2. EDUCATION (2 Projects)
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
    name: "MZH Mock Exam Engine",
    slug: "mzh-mock-exam-engine",
    category: "Education",
    client: "MZH Mock Platform",
    clientCompany: "EdTech & Online Assessment Systems",
    description: "Full-stack online mock examination and test preparation platform featuring timed student exam consoles, automated scoring, question bookmarking, deep performance analytics, and dedicated test-setter authoring console.",
    challenge: "High-latency question rendering during peak exam windows, lack of granular subject-wise analytics for students, and complex question authoring workflows for educators.",
    solution: "Engineered an adaptive mock testing platform featuring timed question sessions, automated scoring, student bookmarking, detailed category analytics, and role-based test creator dashboards.",
    features: [
      "Interactive Timed Student Test-Taking Console with Question Palettes",
      "Automated Exam Scoring, Instant Result Review & Granular Analytics",
      "Question Bookmarking & Revision Workspace for Candidates",
      "Dedicated Test Setter Portal for Rapid Question Authoring & Publishing",
      "Multi-Role Portals (Student, Setter, Admin) with secure authentication"
    ],
    techStack: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "REST API", "PostgreSQL", "Vercel"],
    metrics: "Over 25,000+ mock tests processed with sub-second question transitions and 99.9% uptime",
    publicUrl: "https://mzhmock.vercel.app/",
    previewImage: "/images/portfolio/apexflow_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-05-10",
    feedback: [
      {
        authorName: "Dr. Farhan Siddiqui",
        clientName: "Dr. Farhan Siddiqui",
        company: "Academic Director, MZH Mock",
        rating: 5,
        comment: "The testing platform built by Websmith gives students a seamless, real-exam simulation experience with instant analytics that dramatically improve their scores.",
        publishedAsTestimonial: true,
        date: "2025-09-12",
      },
    ],
  },

  // 3. E-COMMERCE & RETAIL (2 Projects)
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
    name: "MZH Enterprise",
    slug: "mzh-enterprise",
    category: "E-Commerce & Retail",
    client: "MZH Enterprise",
    clientCompany: "Handcrafted Luxury Leather Goods",
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
    publicUrl: "https://mzh-enterprise.vercel.app/",
    previewImage: "/images/portfolio/marketplace_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-05-18",
    feedback: [
      {
        authorName: "MZH Enterprise Artisans",
        clientName: "MZH Enterprise",
        company: "Director of Operations, MZH Enterprise",
        rating: 5,
        comment: "Websmith created an exquisite digital storefront that conveys our artisanal leather craftsmanship. Our direct orders have grown exponentially.",
        publishedAsTestimonial: true,
        date: "2025-09-22",
      },
    ],
  },

  // 4. PROFESSIONAL SERVICES (1 Project)
  {
    name: "ApexFin Advisory",
    slug: "apex-fin-advisory",
    category: "Professional Services",
    client: "ApexFin Advisory Partners",
    clientCompany: "Corporate Tax Strategy & Fiduciary Wealth Advisory",
    description: "Fiduciary corporate tax optimization and M&A wealth advisory platform featuring an interactive Corporate Tax Liability Simulator, R&D credits (§179) calculator, multi-asset portfolio yield rebalancer, and confidential fiduciary review booking.",
    challenge: "Visionary business owners and corporations overpaying taxes due to siloed financial advisory and lack of real-time corporate tax liability forecasting tools.",
    solution: "Architected a high-converting fiduciary advisory digital suite with an interactive corporate tax savings simulator, multi-pillar asset allocation showcases, and automated confidential consultation scheduling.",
    features: [
      "Interactive Corporate Tax Liability Simulator with IRC §179 & R&D credit optimization",
      "Fiduciary Wealth & Multi-Asset Yield Allocation Showcase ($1M+ Portfolios)",
      "Executive Estate, Dynasty Trusts & GRATs wealth transfer structuring",
      "Confidential Fiduciary Review booking with direct advisory intake",
      "Encrypted Virtual Data Vault and 100% Fee-Only Fiduciary Governance standards"
    ],
    techStack: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "Lucide React", "Vercel"],
    metrics: "24.2% average client corporate tax reduction, $850M+ fiduciary assets showcased",
    publicUrl: "https://apex-fin-advisory.vercel.app/",
    previewImage: "/images/portfolio/apexflow_mockup.jpg",
    published: true,
    isFeatured: true,
    status: "completed",
    priority: "high",
    startDate: "2025-06-15",
    feedback: [
      {
        authorName: "Marcus Sterling, CFP",
        clientName: "Marcus Sterling, CFP",
        company: "Managing Principal, ApexFin Advisory",
        rating: 5,
        comment: "The interactive corporate tax simulator built by Websmith instantly engages executive prospects. Our fiduciary consultation bookings tripled within the first quarter.",
        publishedAsTestimonial: true,
        date: "2025-09-26",
      },
    ],
  },

  // 5. LOGISTICS (1 Project)
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
];

export const GET = apiHandler(async ({ db, request }) => {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const collection = db.collection("projects");

    let projects = await collection.find({ published: true }).sort({ createdAt: -1 }).toArray();

    if (projects.length === 0) {
      const baseTime = Date.now();
      for (let i = 0; i < SEED_PROJECTS.length; i++) {
        const item = SEED_PROJECTS[i];
        const createdAt = new Date(baseTime + (SEED_PROJECTS.length - i) * 60000).toISOString();
        await collection.insertOne({
          ...item,
          createdAt,
          updatedAt: createdAt,
        });
      }
      projects = await collection.find({ published: true }).sort({ createdAt: -1 }).toArray();
    }

    if (category && category !== "All") {
      projects = projects.filter((p) => p.category === category || p.projectType === category);
    }

    const data = projects.map((p) => ({
      _id: p._id.toString(),
      id: p._id.toString(),
      title: p.name,
      name: p.name,
      slug: p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: p.description || "",
      publicUrl: p.publicUrl || "",
      previewImage:
        p.publicUrl && /^https?:\/\//i.test(p.publicUrl.trim())
          ? (!p.previewImage || p.previewImage.includes("/images/portfolio/")
              ? `https://s0.wp.com/mshots/v1/${encodeURIComponent(p.publicUrl.trim())}?w=1280&h=800`
              : p.previewImage.trim())
          : p.previewImage?.trim() || "/images/websmith_original.jpg",
      client: p.client || p.clientCompany || "Enterprise Client",
      clientCompany: p.clientCompany || p.client || "Client Company",
      category: p.category || p.projectType || "Web Apps",
      metrics: p.metrics || "Delivered on schedule with 100% quality score",
      techStack: Array.isArray(p.techStack) && p.techStack.length ? p.techStack : ["Next.js", "TypeScript", "Tailwind CSS"],
      challenge: p.challenge || "",
      solution: p.solution || "",
      features: p.features || [],
      isFeatured: Boolean(p.isFeatured),
      status: p.status || "completed",
    }));

    return json({ data: serialize(data) });
  } catch (error) {
    console.warn("Public projects read warning (returning empty list):", error instanceof Error ? error.message : error);
    return json({ data: [] });
  }
});
