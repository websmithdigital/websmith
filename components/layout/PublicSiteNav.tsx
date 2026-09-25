"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef, type CSSProperties } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Search, 
  ShoppingCart, 
  Heart, 
  History as HistoryIcon, 
  Mail, 
  ChevronDown, 
  ChevronRight,
  ExternalLink,
  Home,
  Sparkles,
  Building2,
  Layers,
  Briefcase,
  ShoppingBag,
  PhoneCall,
  Sun,
  Moon,
  LogIn,
  ArrowRight
} from "lucide-react";
import { getStoredUser, getToken } from "../../lib/auth";
import { usePublicTheme } from "../../app/providers/PublicThemeProvider";
import { useLeadFunnel } from "../../app/providers/LeadFunnelProvider";
import { useStoreUI } from "../../app/software-store/StoreUIContext";
import MegaMenuServices from "./MegaMenuServices";
import DropdownIndustries from "./DropdownIndustries";
import DropdownCompany from "./DropdownCompany";
import { getPublicIndustries, getPublicServiceCategories } from "../../lib/cms/cmsService";
import type { CmsIndustry, CmsServiceCategory } from "../../lib/cms/types";

const brandLogo = "/images/icon.png";
const brandWordmark = "/images/wordmark1.png";

type PublicSiteNavProps = {
  /** Minimal bar (logo + Home + CTA) for sign-in pages — avoids the full marketing menu on /login */
  variant?: "full" | "auth";
};

export default function PublicSiteNav({ variant = "full" }: PublicSiteNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navMounted, setNavMounted] = useState(false);
  const { publicTheme, togglePublicTheme } = usePublicTheme();
  const { openLeadServicesModal } = useLeadFunnel();
  const isLogin = pathname === "/login";
  const isAuthLayout = variant === "auth";
  const isStoreRoute = Boolean(pathname?.startsWith("/software-store"));
  const storeUI = useStoreUI();
  const isDark = publicTheme === "dark";

  // Dynamic CMS Data for mobile navigation
  const [mobileIndustries, setMobileIndustries] = useState<CmsIndustry[]>([]);
  const [mobileServiceCategories, setMobileServiceCategories] = useState<CmsServiceCategory[]>([]);

  // DreamX Dropdown state
  const [activeDropdown, setActiveDropdown] = useState<"services" | "industries" | "company" | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile accordion state
  const [mobileExpandedSection, setMobileExpandedSection] = useState<"services" | "industries" | "company" | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(62);

  useEffect(() => {
    setNavMounted(true);
  }, []);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        setHeaderHeight(headerRef.current.offsetHeight || 62);
      }
    };
    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, [mobileOpen]);

  useEffect(() => {
    let isCancelled = false;
    async function loadNavData() {
      try {
        const [indList, catList] = await Promise.all([
          getPublicIndustries(),
          getPublicServiceCategories({ menuOnly: true }),
        ]);
        if (!isCancelled) {
          if (Array.isArray(indList) && indList.length > 0) setMobileIndustries(indList);
          if (Array.isArray(catList) && catList.length > 0) setMobileServiceCategories(catList);
        }
      } catch (err) {
        console.error("Failed to load nav CMS data:", err);
      }
    }
    loadNavData();
    return () => {
      isCancelled = true;
    };
  }, []);

  const showGuestThemeToggle = navMounted;

  const handleMouseEnter = (menu: "services" | "industries" | "company") => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // Close dropdowns on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  if (isAuthLayout) {
    return (
      <nav style={styles.navAuth} className="landing-nav-shell public-site-nav public-site-nav--auth">
        <div style={styles.navAuthInner} className="landing-nav-content">
          <Link href="/" style={styles.logo} className="logo-hover" onClick={() => setMobileOpen(false)}>
            <div style={styles.logoCircle}>
              <Image src={brandLogo} alt="Websmith Digital icon" width={42} height={42} style={styles.logoImage} priority />
            </div>
            <Image
              src={brandWordmark}
              alt="Websmith Digital"
              width={195}
              height={44}
              style={{ height: "44px", width: "auto", objectFit: "contain" }}
              priority
            />
          </Link>
          <div style={styles.authNavRight} className="auth-nav-right">
            <Link href="/" style={styles.authTextLink} className="auth-nav-home-link">
              Home
            </Link>
            {showGuestThemeToggle && (
              <button
                type="button"
                onClick={togglePublicTheme}
                style={styles.themeToggleBtn}
                className="auth-theme-toggle-btn"
                aria-label={`Switch to ${publicTheme === "light" ? "dark" : "light"} mode`}
              >
                <span aria-hidden="true" style={styles.themeEmoji} className="auth-theme-emoji">{publicTheme === "light" ? "🌙" : "☀️"}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => openLeadServicesModal()}
              style={styles.ctaBtn}
              className="cta-hover public-nav-cta auth-cta-btn"
            >
              Get Started
            </button>
          </div>
        </div>
        <style>{`
          @media (max-width: 640px) {
            .public-site-nav--auth .landing-nav-content {
              padding: 10px 14px !important;
            }
            .public-site-nav--auth .auth-nav-right {
              gap: 8px !important;
            }
            .public-site-nav--auth .auth-nav-home-link {
              display: none !important;
            }
            .public-site-nav--auth .auth-theme-toggle-btn {
              width: 32px !important;
              height: 32px !important;
              border-radius: 8px !important;
            }
            .public-site-nav--auth .auth-theme-emoji {
              font-size: 14px !important;
            }
            .public-site-nav--auth .auth-cta-btn {
              padding: 6px 12px !important;
              font-size: 12.5px !important;
              border-radius: 8px !important;
              white-space: nowrap !important;
            }
          }
        `}</style>
      </nav>
    );
  }

  return (
    <nav
      style={{
        ...styles.nav,
        backgroundColor: mobileOpen
          ? (isDark ? "#070B14" : "#ffffff")
          : (isDark ? "rgba(10, 15, 29, 0.88)" : "rgba(255, 255, 255, 0.9)"),
        borderBottom: isDark
          ? "1px solid rgba(255, 255, 255, 0.08)"
          : "1px solid #e2e8f0",
        backdropFilter: mobileOpen ? "none" : "blur(16px)",
        WebkitBackdropFilter: mobileOpen ? "none" : "blur(16px)",
      }}
      className={`landing-nav-shell public-site-nav ${mobileOpen ? "mobile-nav-open" : ""}`}
    >
      <div ref={headerRef} style={styles.navContent} className="landing-nav-content">
        <div style={styles.leftNavGroup}>
          {/* Brand Logo */}
          <Link href="/" style={styles.logo} className="logo-hover" onClick={() => setMobileOpen(false)}>
            <div
              style={{
                ...styles.logoCircle,
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "var(--bg-secondary)",
                border: isDark ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid var(--border-color)",
              }}
            >
              <Image src={brandLogo} alt="Websmith Digital icon" width={42} height={42} style={styles.logoImage} priority />
            </div>
            <Image
              src={brandWordmark}
              alt="Websmith Digital"
              width={195}
              height={44}
              style={{ height: "44px", width: "auto", objectFit: "contain" }}
              priority
            />
          </Link>

          {/* DreamX-Style Desktop Navigation */}
          <div style={styles.desktopMenu} className="desktop-menu">
            {/* 1. Home */}
            <Link
              href="/"
              style={{
                ...styles.menuItem,
                color: pathname === "/" ? "#007AFF" : (isDark ? "#E2E8F0" : "#1d1d1f"),
                fontWeight: pathname === "/" ? 600 : 500,
              }}
              className={`menu-item-hover ${pathname === "/" ? "active-nav-link" : ""}`}
            >
              Home
            </Link>

            {/* 2. Services ▾ (DreamX Interactive Mega-Menu) */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => handleMouseEnter("services")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "services" ? null : "services")}
                style={{
                  ...styles.menuItem,
                  color: pathname === "/services" || activeDropdown === "services" ? "#007AFF" : (isDark ? "#E2E8F0" : "#1d1d1f"),
                  fontWeight: pathname === "/services" || activeDropdown === "services" ? 600 : 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "8px 10px",
                }}
                className="menu-item-hover"
                aria-expanded={activeDropdown === "services"}
              >
                <span>Services</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: activeDropdown === "services" ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              {activeDropdown === "services" && (
                <MegaMenuServices isDark={isDark} onClose={() => setActiveDropdown(null)} />
              )}
            </div>

            {/* 3. Industries ▾ */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => handleMouseEnter("industries")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "industries" ? null : "industries")}
                style={{
                  ...styles.menuItem,
                  color: activeDropdown === "industries" ? "#007AFF" : (isDark ? "#E2E8F0" : "#1d1d1f"),
                  fontWeight: activeDropdown === "industries" ? 600 : 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "8px 10px",
                }}
                className="menu-item-hover"
                aria-expanded={activeDropdown === "industries"}
              >
                <span>Industries</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: activeDropdown === "industries" ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              {activeDropdown === "industries" && (
                <DropdownIndustries isDark={isDark} onClose={() => setActiveDropdown(null)} />
              )}
            </div>

            {/* 4. Portfolio (Direct Link) */}
            <Link
              href="/portfolio"
              style={{
                ...styles.menuItem,
                color: pathname === "/portfolio" ? "#007AFF" : (isDark ? "#E2E8F0" : "#1d1d1f"),
                fontWeight: pathname === "/portfolio" ? 600 : 500,
              }}
              className={`menu-item-hover ${pathname === "/portfolio" ? "active-nav-link" : ""}`}
            >
              Portfolio
            </Link>

            {/* 5. Company ▾ */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => handleMouseEnter("company")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === "company" ? null : "company")}
                style={{
                  ...styles.menuItem,
                  color: pathname === "/about" || pathname === "/careers" || activeDropdown === "company" ? "#007AFF" : (isDark ? "#E2E8F0" : "#1d1d1f"),
                  fontWeight: pathname === "/about" || pathname === "/careers" || activeDropdown === "company" ? 600 : 500,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "8px 10px",
                }}
                className="menu-item-hover"
                aria-expanded={activeDropdown === "company"}
              >
                <span>Company</span>
                <ChevronDown
                  size={14}
                  style={{
                    transform: activeDropdown === "company" ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>
              {activeDropdown === "company" && (
                <DropdownCompany isDark={isDark} onClose={() => setActiveDropdown(null)} />
              )}
            </div>

            {/* 6. Software Store */}
            <Link
              href="/software-store"
              style={{
                ...styles.menuItem,
                color: pathname?.startsWith("/software-store") ? "#007AFF" : (isDark ? "#E2E8F0" : "#1d1d1f"),
                fontWeight: pathname?.startsWith("/software-store") ? 600 : 500,
              }}
              className={`menu-item-hover ${pathname?.startsWith("/software-store") ? "active-nav-link" : ""}`}
            >
              Software Store
            </Link>

            {/* 7. Contact Us */}
            <Link
              href="/contact"
              style={{
                ...styles.menuItem,
                color: pathname === "/contact" ? "#007AFF" : (isDark ? "#E2E8F0" : "#1d1d1f"),
                fontWeight: pathname === "/contact" ? 600 : 500,
              }}
              className={`menu-item-hover ${pathname === "/contact" ? "active-nav-link" : ""}`}
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Integrated Store Search in Main Top Navigation */}
        {isStoreRoute && (
          <div className="flex-1 max-w-[180px] md:max-w-xs lg:max-w-sm mx-2 relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              value={storeUI?.searchQuery || ""}
              onChange={(e) => storeUI?.setSearchQuery(e.target.value)}
              placeholder="Search software..."
              aria-label="Search software"
              className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                isDark
                  ? "bg-white/[0.06] border border-white/10 text-white placeholder-slate-400 focus:border-indigo-400/50"
                  : "bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white"
              }`}
            />
          </div>
        )}

        <div style={styles.navButtons} className="nav-buttons">
          {/* Integrated Store Actions in Main Top Navigation */}
          {isStoreRoute && (
            <div className="flex items-center gap-1.5 mr-1">
              <motion.button
                onClick={() => storeUI?.openHistory()}
                className={`relative flex items-center justify-center w-8 h-8 rounded-xl border transition-all ${
                  isDark
                    ? "border-white/10 bg-white/[0.04] text-emerald-300 hover:bg-white/[0.08]"
                    : "border-slate-200 bg-slate-100 text-emerald-600 hover:bg-slate-200"
                }`}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                aria-label="Purchase History"
                title="Purchase History"
              >
                <HistoryIcon className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                onClick={() => storeUI?.openWishlist()}
                className={`relative flex items-center justify-center w-8 h-8 rounded-xl border transition-all ${
                  isDark
                    ? "border-white/10 bg-white/[0.04] text-rose-300 hover:bg-white/[0.08]"
                    : "border-slate-200 bg-slate-100 text-rose-600 hover:bg-slate-200"
                }`}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                aria-label={`Wishlist (${storeUI?.wishlistCount || 0} items)`}
                title={`Wishlist (${storeUI?.wishlistCount || 0} items)`}
              >
                <Heart className="w-3.5 h-3.5" />
                {(storeUI?.wishlistCount ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center leading-none shadow-sm">
                    {storeUI?.wishlistCount}
                  </span>
                )}
              </motion.button>
              <motion.button
                onClick={() => storeUI?.openCart()}
                className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm hover:brightness-110 transition-all"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                aria-label={`Cart (${storeUI?.cartCount || 0} items)`}
                title={`Cart (${storeUI?.cartCount || 0} items)`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {(storeUI?.cartCount ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-amber-400 text-amber-950 text-[9px] font-bold flex items-center justify-center leading-none shadow-sm">
                    {storeUI?.cartCount}
                  </span>
                )}
              </motion.button>
              <motion.button
                onClick={() => storeUI?.openEmailCenter()}
                className={`relative flex items-center justify-center w-8 h-8 rounded-xl border transition-all ${
                  isDark
                    ? "border-white/10 bg-white/[0.04] text-indigo-300 hover:bg-white/[0.08]"
                    : "border-slate-200 bg-slate-100 text-indigo-600 hover:bg-slate-200"
                }`}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                aria-label="Store Email Center"
                title="Store Email Center"
              >
                <Mail className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          )}

          {showGuestThemeToggle && (
            <button
              type="button"
              onClick={togglePublicTheme}
              style={{
                ...styles.themeToggleBtn,
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "#f1f5f9",
                borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#e2e8f0",
                color: isDark ? "#FFFFFF" : "#1d1d1f",
              }}
              aria-label={`Switch to ${publicTheme === "light" ? "dark" : "light"} mode`}
            >
              <span aria-hidden="true" style={styles.themeEmoji}>{publicTheme === "light" ? "🌙" : "☀️"}</span>
            </button>
          )}
          {!isLogin && (
            <button
              type="button"
              onClick={() => router.push("/login")}
              style={{
                ...styles.loginBtn,
                backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "transparent",
                borderColor: isDark ? "rgba(255, 255, 255, 0.12)" : "#e2e8f0",
                color: isDark ? "#F1F5F9" : "#1d1d1f",
              }}
              className="login-btn-hover"
            >
              Log in
            </button>
          )}
          <button 
            type="button" 
            onClick={() => openLeadServicesModal()} 
            style={{
              ...styles.ctaBtn,
              background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
              color: "#ffffff",
              border: "none",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
            }} 
            className="cta-hover public-nav-cta"
          >
            Get Started
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            ...styles.mobileMenuBtn,
            color: isDark ? "#FFFFFF" : "#1d1d1f",
          }}
          className="mobile-menu-btn"
          aria-expanded={mobileOpen}
          aria-controls="public-site-navigation"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                ...styles.mobileMenuOverlay,
                top: `${headerHeight}px`,
                height: `calc(100dvh - ${headerHeight}px)`,
              }}
              className="public-mobile-menu-overlay"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation menu"
            />
            <motion.div
              id="public-site-navigation"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              style={{
                ...styles.mobileMenu,
                backgroundColor: isDark ? "#070B14" : "#ffffff",
                borderColor: isDark ? "rgba(255, 255, 255, 0.08)" : "#e2e8f0",
              }}
              className="public-mobile-menu-panel custom-scrollbar"
            >
              {isStoreRoute && (
                <div className={`pb-3 mb-3 border-b ${isDark ? "border-white/10" : "border-slate-200"} flex flex-col gap-2.5`}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      value={storeUI?.searchQuery || ""}
                      onChange={(e) => storeUI?.setSearchQuery(e.target.value)}
                      placeholder="Search software..."
                      aria-label="Search software"
                      className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
                        isDark
                          ? "bg-white/[0.06] border border-white/10 text-white placeholder-slate-400"
                          : "bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400"
                      }`}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
                    <button
                      onClick={() => { setMobileOpen(false); storeUI?.openHistory(); }}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        isDark ? "border-white/10 bg-white/[0.04] text-emerald-300 active:bg-white/[0.08]" : "border-slate-200 bg-slate-100 text-emerald-700 active:bg-slate-200"
                      }`}
                    >
                      <HistoryIcon className="w-3.5 h-3.5" /> History
                    </button>
                    <button
                      onClick={() => { setMobileOpen(false); storeUI?.openWishlist(); }}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        isDark ? "border-white/10 bg-white/[0.04] text-rose-300 active:bg-white/[0.08]" : "border-slate-200 bg-slate-100 text-rose-700 active:bg-slate-200"
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5" /> Wishlist ({storeUI?.wishlistCount || 0})
                    </button>
                    <button
                      onClick={() => { setMobileOpen(false); storeUI?.openCart(); }}
                      className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm active:brightness-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" /> Cart ({storeUI?.cartCount || 0})
                    </button>
                    <button
                      onClick={() => { setMobileOpen(false); storeUI?.openEmailCenter(); }}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        isDark ? "border-white/10 bg-white/[0.04] text-indigo-300 active:bg-white/[0.08]" : "border-slate-200 bg-slate-100 text-indigo-700 active:bg-slate-200"
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" /> Email
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile Nav Links */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {/* 1. Home */}
                <Link
                  href="/"
                  style={{
                    ...styles.mobileMenuItem,
                    backgroundColor: pathname === "/" ? (isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.08)") : "transparent",
                    color: pathname === "/" ? "#2563eb" : (isDark ? "#f1f5f9" : "#0f172a"),
                    fontWeight: pathname === "/" ? 600 : 500,
                  }}
                  className={`mobile-menu-item ${pathname === "/" ? "active-mobile-link" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <div style={styles.mobileItemLeft}>
                    <div style={{
                      ...styles.mobileIconShell,
                      backgroundColor: pathname === "/" ? "rgba(37, 99, 235, 0.2)" : (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"),
                      color: pathname === "/" ? "#2563eb" : (isDark ? "#94a3b8" : "#64748b"),
                    }}>
                      <Home size={16} />
                    </div>
                    <span>Home</span>
                  </div>
                  <ChevronRight size={15} style={{ opacity: pathname === "/" ? 1 : 0.4 }} />
                </Link>

                {/* 2. Services Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileExpandedSection(mobileExpandedSection === "services" ? null : "services")}
                    style={{
                      ...styles.mobileMenuItem,
                      backgroundColor: mobileExpandedSection === "services" ? (isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)") : "transparent",
                      color: pathname?.startsWith("/services") ? "#2563eb" : (isDark ? "#f1f5f9" : "#0f172a"),
                      fontWeight: pathname?.startsWith("/services") ? 600 : 500,
                      width: "100%",
                    }}
                    aria-expanded={mobileExpandedSection === "services"}
                  >
                    <div style={styles.mobileItemLeft}>
                      <div style={{
                        ...styles.mobileIconShell,
                        backgroundColor: pathname?.startsWith("/services") ? "rgba(37, 99, 235, 0.2)" : (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"),
                        color: pathname?.startsWith("/services") ? "#2563eb" : (isDark ? "#94a3b8" : "#64748b"),
                      }}>
                        <Sparkles size={16} />
                      </div>
                      <span>Services</span>
                    </div>
                    <ChevronDown
                      size={16}
                      style={{
                        transform: mobileExpandedSection === "services" ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.22s ease",
                        color: isDark ? "#94a3b8" : "#64748b",
                      }}
                    />
                  </button>
                  {mobileExpandedSection === "services" && (
                    <div style={{
                      marginLeft: "18px",
                      paddingLeft: "14px",
                      borderLeft: isDark ? "2px solid rgba(59, 130, 246, 0.35)" : "2px solid rgba(37, 99, 235, 0.25)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      margin: "6px 0 10px 18px",
                    }}>
                      <Link
                        href="/services"
                        onClick={() => setMobileOpen(false)}
                        style={{
                          fontSize: "13px",
                          color: "#2563eb",
                          fontWeight: 600,
                          padding: "7px 10px",
                          borderRadius: "8px",
                          backgroundColor: isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.07)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>View All Services</span>
                        <ArrowRight size={13} />
                      </Link>
                      {mobileServiceCategories.map((cat) => (
                        <Link
                          key={cat._id || cat.slug}
                          href={`/services?tab=${cat.slug}#${cat.slug}`}
                          onClick={() => setMobileOpen(false)}
                          style={{
                            fontSize: "13.5px",
                            color: isDark ? "#cbd5e1" : "#475569",
                            padding: "6px 10px",
                            borderRadius: "6px",
                          }}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Industries Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileExpandedSection(mobileExpandedSection === "industries" ? null : "industries")}
                    style={{
                      ...styles.mobileMenuItem,
                      backgroundColor: mobileExpandedSection === "industries" ? (isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)") : "transparent",
                      color: pathname?.startsWith("/industries") ? "#2563eb" : (isDark ? "#f1f5f9" : "#0f172a"),
                      fontWeight: pathname?.startsWith("/industries") ? 600 : 500,
                      width: "100%",
                    }}
                    aria-expanded={mobileExpandedSection === "industries"}
                  >
                    <div style={styles.mobileItemLeft}>
                      <div style={{
                        ...styles.mobileIconShell,
                        backgroundColor: pathname?.startsWith("/industries") ? "rgba(37, 99, 235, 0.2)" : (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"),
                        color: pathname?.startsWith("/industries") ? "#2563eb" : (isDark ? "#94a3b8" : "#64748b"),
                      }}>
                        <Building2 size={16} />
                      </div>
                      <span>Industries</span>
                    </div>
                    <ChevronDown
                      size={16}
                      style={{
                        transform: mobileExpandedSection === "industries" ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.22s ease",
                        color: isDark ? "#94a3b8" : "#64748b",
                      }}
                    />
                  </button>
                  {mobileExpandedSection === "industries" && (
                    <div style={{
                      marginLeft: "18px",
                      paddingLeft: "14px",
                      borderLeft: isDark ? "2px solid rgba(59, 130, 246, 0.35)" : "2px solid rgba(37, 99, 235, 0.25)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      margin: "6px 0 10px 18px",
                    }}>
                      <Link
                        href="/industries"
                        onClick={() => setMobileOpen(false)}
                        style={{
                          fontSize: "13px",
                          color: "#2563eb",
                          fontWeight: 600,
                          padding: "7px 10px",
                          borderRadius: "8px",
                          backgroundColor: isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.07)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>View All Industries</span>
                        <ArrowRight size={13} />
                      </Link>
                      {mobileIndustries.map((ind) => (
                        <Link
                          key={ind._id || ind.slug}
                          href={`/industries?sector=${ind.slug}`}
                          onClick={() => setMobileOpen(false)}
                          style={{
                            fontSize: "13.5px",
                            color: isDark ? "#cbd5e1" : "#475569",
                            padding: "6px 10px",
                            borderRadius: "6px",
                          }}
                        >
                          {ind.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Portfolio */}
                <Link
                  href="/portfolio"
                  style={{
                    ...styles.mobileMenuItem,
                    backgroundColor: pathname === "/portfolio" ? (isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.08)") : "transparent",
                    color: pathname === "/portfolio" ? "#2563eb" : (isDark ? "#f1f5f9" : "#0f172a"),
                    fontWeight: pathname === "/portfolio" ? 600 : 500,
                  }}
                  className={`mobile-menu-item ${pathname === "/portfolio" ? "active-mobile-link" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <div style={styles.mobileItemLeft}>
                    <div style={{
                      ...styles.mobileIconShell,
                      backgroundColor: pathname === "/portfolio" ? "rgba(37, 99, 235, 0.2)" : (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"),
                      color: pathname === "/portfolio" ? "#2563eb" : (isDark ? "#94a3b8" : "#64748b"),
                    }}>
                      <Layers size={16} />
                    </div>
                    <span>Portfolio</span>
                  </div>
                  <ChevronRight size={15} style={{ opacity: pathname === "/portfolio" ? 1 : 0.4 }} />
                </Link>

                {/* 5. Company Accordion */}
                <div>
                  <button
                    type="button"
                    onClick={() => setMobileExpandedSection(mobileExpandedSection === "company" ? null : "company")}
                    style={{
                      ...styles.mobileMenuItem,
                      backgroundColor: mobileExpandedSection === "company" ? (isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)") : "transparent",
                      color: pathname?.startsWith("/about") || pathname?.startsWith("/careers") || pathname?.startsWith("/blog") || pathname?.startsWith("/documentation")
                        ? "#2563eb"
                        : (isDark ? "#f1f5f9" : "#0f172a"),
                      fontWeight: 500,
                      width: "100%",
                    }}
                    aria-expanded={mobileExpandedSection === "company"}
                  >
                    <div style={styles.mobileItemLeft}>
                      <div style={{
                        ...styles.mobileIconShell,
                        backgroundColor: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)",
                        color: isDark ? "#94a3b8" : "#64748b",
                      }}>
                        <Briefcase size={16} />
                      </div>
                      <span>Company</span>
                    </div>
                    <ChevronDown
                      size={16}
                      style={{
                        transform: mobileExpandedSection === "company" ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.22s ease",
                        color: isDark ? "#94a3b8" : "#64748b",
                      }}
                    />
                  </button>
                  {mobileExpandedSection === "company" && (
                    <div style={{
                      marginLeft: "18px",
                      paddingLeft: "14px",
                      borderLeft: isDark ? "2px solid rgba(59, 130, 246, 0.35)" : "2px solid rgba(37, 99, 235, 0.25)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                      margin: "6px 0 10px 18px",
                    }}>
                      <Link href="/about" onClick={() => setMobileOpen(false)} style={{ fontSize: "13.5px", color: isDark ? "#cbd5e1" : "#475569", padding: "6px 10px", borderRadius: "6px" }}>
                        About WebSmith
                      </Link>
                      <Link href="/careers" onClick={() => setMobileOpen(false)} style={{ fontSize: "13.5px", color: isDark ? "#cbd5e1" : "#475569", padding: "6px 10px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span>Careers & Culture</span>
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Hiring</span>
                      </Link>
                      <Link href="/about#team" onClick={() => setMobileOpen(false)} style={{ fontSize: "13.5px", color: isDark ? "#cbd5e1" : "#475569", padding: "6px 10px", borderRadius: "6px" }}>
                        Core Team & Architects
                      </Link>
                      <Link href="/blog" onClick={() => setMobileOpen(false)} style={{ fontSize: "13.5px", color: isDark ? "#cbd5e1" : "#475569", padding: "6px 10px", borderRadius: "6px" }}>
                        Engineering Blog
                      </Link>
                      <Link href="/documentation" onClick={() => setMobileOpen(false)} style={{ fontSize: "13.5px", color: isDark ? "#cbd5e1" : "#475569", padding: "6px 10px", borderRadius: "6px" }}>
                        Documentation Center
                      </Link>
                    </div>
                  )}
                </div>

                {/* 6. Software Store */}
                <Link
                  href="/software-store"
                  style={{
                    ...styles.mobileMenuItem,
                    backgroundColor: pathname?.startsWith("/software-store") ? (isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.08)") : "transparent",
                    color: pathname?.startsWith("/software-store") ? "#2563eb" : (isDark ? "#f1f5f9" : "#0f172a"),
                    fontWeight: pathname?.startsWith("/software-store") ? 600 : 500,
                  }}
                  className={`mobile-menu-item ${pathname?.startsWith("/software-store") ? "active-mobile-link" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <div style={styles.mobileItemLeft}>
                    <div style={{
                      ...styles.mobileIconShell,
                      backgroundColor: pathname?.startsWith("/software-store") ? "rgba(37, 99, 235, 0.2)" : (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"),
                      color: pathname?.startsWith("/software-store") ? "#2563eb" : (isDark ? "#94a3b8" : "#64748b"),
                    }}>
                      <ShoppingBag size={16} />
                    </div>
                    <span>Software Store</span>
                  </div>
                  <span className="px-2 py-0.5 text-[10.5px] font-semibold rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">Store</span>
                </Link>

                {/* 7. Contact Us */}
                <Link
                  href="/contact"
                  style={{
                    ...styles.mobileMenuItem,
                    backgroundColor: pathname === "/contact" ? (isDark ? "rgba(37, 99, 235, 0.12)" : "rgba(37, 99, 235, 0.08)") : "transparent",
                    color: pathname === "/contact" ? "#2563eb" : (isDark ? "#f1f5f9" : "#0f172a"),
                    fontWeight: pathname === "/contact" ? 600 : 500,
                  }}
                  className={`mobile-menu-item ${pathname === "/contact" ? "active-mobile-link" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <div style={styles.mobileItemLeft}>
                    <div style={{
                      ...styles.mobileIconShell,
                      backgroundColor: pathname === "/contact" ? "rgba(37, 99, 235, 0.2)" : (isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)"),
                      color: pathname === "/contact" ? "#2563eb" : (isDark ? "#94a3b8" : "#64748b"),
                    }}>
                      <PhoneCall size={16} />
                    </div>
                    <span>Contact Us</span>
                  </div>
                  <ChevronRight size={15} style={{ opacity: pathname === "/contact" ? 1 : 0.4 }} />
                </Link>
              </div>

              {/* Bottom Quick Controls & Actions */}
              <div style={styles.mobileMenuDivider} />

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {showGuestThemeToggle && (
                  <button
                    type="button"
                    onClick={togglePublicTheme}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #e2e8f0",
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#f8fafc",
                      color: isDark ? "#f1f5f9" : "#0f172a",
                      fontSize: "13.5px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    className="mobile-action-pill"
                    aria-label={`Switch to ${publicTheme === "light" ? "dark" : "light"} mode`}
                  >
                    {publicTheme === "light" ? (
                      <>
                        <Moon size={15} style={{ color: "#6366f1" }} />
                        <span>Dark mode</span>
                      </>
                    ) : (
                      <>
                        <Sun size={15} style={{ color: "#f59e0b" }} />
                        <span>Light mode</span>
                      </>
                    )}
                  </button>
                )}

                {!isLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      router.push("/login");
                    }}
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: isDark ? "1px solid rgba(255, 255, 255, 0.1)" : "1px solid #e2e8f0",
                      backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "#f8fafc",
                      color: isDark ? "#f1f5f9" : "#0f172a",
                      fontSize: "13.5px",
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    className="mobile-action-pill"
                  >
                    <LogIn size={15} style={{ color: isDark ? "#94a3b8" : "#64748b" }} />
                    <span>Log in</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openLeadServicesModal();
                }}
                style={{
                  ...styles.mobileCtaBtn,
                  background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
                  color: "#ffffff",
                  border: "none",
                }}
                className="cta-hover public-mobile-cta"
              >
                <span>Get Started</span>
                <ArrowRight size={16} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 980px) {
          .public-site-nav .desktop-menu,
          .public-site-nav .nav-buttons {
            display: none !important;
          }
          .public-site-nav .mobile-menu-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          .public-site-nav .landing-nav-content {
            padding-right: 12px;
          }
        }

        /* Keep mobile nav behavior consistent with the home page */
        @media (max-width: 768px) {
          .landing-nav-shell {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0;
            width: 100%;
          }
          .landing-nav-content {
            padding: 10px 16px !important;
          }
        }

        .public-mobile-menu-panel::-webkit-scrollbar {
          width: 5px;
        }
        .public-mobile-menu-panel::-webkit-scrollbar-track {
          background: transparent;
        }
        .public-mobile-menu-panel::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.25);
          border-radius: 9999px;
        }
        .mobile-action-pill:active {
          transform: scale(0.98);
        }
        .public-mobile-cta:active {
          transform: scale(0.98);
        }
        .mobile-menu-item:active {
          transform: scale(0.99);
        }
      `}</style>
    </nav>
  );
}

const styles: Record<string, CSSProperties> = {
  navAuth: {
    position: "sticky",
    top: 0,
    zIndex: 1300,
    width: "100%",
    backgroundColor: "var(--bg-primary)",
    borderBottom: "1px solid var(--border-color)",
    boxShadow: "var(--card-shadow)",
  },
  navAuthInner: {
    width: "100%",
    maxWidth: "100%",
    margin: 0,
    padding: "14px clamp(16px, 4vw, 40px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  authNavRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  authTextLink: {
    fontSize: "15px",
    fontWeight: 500,
    color: "var(--text-secondary)",
    textDecoration: "none",
  },
  nav: {
    position: "sticky",
    top: 0,
    backgroundColor: "color-mix(in srgb, var(--bg-primary) 92%, transparent)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid var(--border-color)",
    zIndex: 1300,
    width: "100%",
  },
  navContent: {
    width: "100%",
    maxWidth: "100%",
    margin: 0,
    padding: "12px clamp(16px, 4vw, 40px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    zIndex: 1305,
  },
  leftNavGroup: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
    minWidth: 0,
    paddingLeft: 0,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    textDecoration: "none",
    flexShrink: 0,
  },
  logoCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "var(--bg-secondary)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    flexShrink: 0,
    padding: "2px",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transform: "scale(1.2)",
  },
  themeEmoji: {
    fontSize: "18px",
    lineHeight: 1,
  },
  mobileThemeEmoji: {
    marginRight: "8px",
    fontSize: "18px",
    lineHeight: 1,
  },
  logoText: {
    fontSize: "20px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  desktopMenu: {
    display: "flex",
    gap: "32px",
    alignItems: "center",
    paddingRight: "24px",
    flexShrink: 0,
  },
  menuItem: {
    fontSize: "15px",
    fontWeight: 500,
    color: "var(--text-primary)",
    cursor: "pointer",
    padding: "8px 0",
    fontFamily: "inherit",
    backgroundColor: "transparent",
    textDecoration: "none",
  },
  navButtons: {
    display: "flex",
    gap: "12px",
    paddingRight: 0,
    alignItems: "center",
  },
  themeToggleBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    transition: "background-color 0.2s ease, border-color 0.2s ease",
  },
  loginBtn: {
    padding: "8px 20px",
    fontSize: "14px",
    fontWeight: 500,
    backgroundColor: "transparent",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "inherit",
    color: "var(--text-primary)",
  },
  ctaBtn: {
    padding: "8px 18px",
    fontSize: "14px",
    fontWeight: 600,
    backgroundColor: "#007AFF",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  mobileMenuBtn: {
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "1px solid transparent",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "10px",
    color: "var(--text-primary)",
    transition: "background-color 0.15s ease, border-color 0.15s ease",
  },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    borderBottom: "1px solid var(--border-color)",
    borderBottomLeftRadius: "24px",
    borderBottomRightRadius: "24px",
    backgroundColor: "var(--bg-primary)",
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    width: "100%",
    zIndex: 1304,
    boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.45)",
    maxHeight: "calc(100dvh - 72px)",
    overflowY: "auto",
    WebkitOverflowScrolling: "touch",
    padding: "14px 16px 24px 16px",
  },
  mobileMenuOverlay: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100vw",
    border: "none",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    zIndex: 1301,
    cursor: "pointer",
  },
  mobileMenuItem: {
    padding: "9px 12px",
    fontSize: "14.5px",
    fontWeight: 500,
    background: "none",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "12px",
    fontFamily: "inherit",
    color: "var(--text-primary)",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    transition: "all 0.15s ease",
  },
  mobileItemLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  mobileIconShell: {
    width: "32px",
    height: "32px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "all 0.18s ease",
  },
  mobileMenuDivider: {
    height: "1px",
    backgroundColor: "var(--border-color)",
    margin: "12px 0",
    opacity: 0.8,
  },
  mobileThemeBtn: {
    padding: "10px 14px",
    fontSize: "13.5px",
    fontWeight: 500,
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    cursor: "pointer",
    fontFamily: "inherit",
    color: "var(--text-primary)",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
  },
  mobileLoginBtn: {
    padding: "10px 14px",
    fontSize: "13.5px",
    fontWeight: 500,
    backgroundColor: "transparent",
    border: "1px solid var(--border-color)",
    borderRadius: "12px",
    cursor: "pointer",
    fontFamily: "inherit",
    color: "var(--text-primary)",
  },
  mobileCtaBtn: {
    width: "100%",
    padding: "12px 20px",
    fontSize: "14.5px",
    fontWeight: 600,
    backgroundColor: "#007AFF",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 4px 16px rgba(37, 99, 235, 0.35)",
    marginTop: "8px",
  },
};
