"use client";

import type { CSSProperties } from "react";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Smartphone,
  PhoneCall,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  MessageSquare,
  Globe,
} from "lucide-react";
import API from "../../../core/services/apiService";
import { SOCIAL_PLATFORM_META } from "../../../lib/social-platforms";
import { usePublicTheme } from "../../providers/PublicThemeProvider";
import { createPublicTicket } from "../../../core/services/ticketService";
import { PhoneInputWithCountry } from "@/components/ui/PhoneInputWithCountry";
import {
  CONTACT_TIME_SLOT_GROUPS,
  getSlotISTRange,
  getBookingDateLimits,
  POPULAR_TIMEZONES,
} from "@/core/utils/contactScheduling";

const defaultContactInfo = {
  headquarters: "T-35, Rajarhat Main Road, Diamond Enclave,kolkata-700157",
  email: "sales@websmithdigital.com",
  sales_email: "",
  no_reply_email: "",
  hr_email: "",
  phone: "+1 815-426-9572",
  mobile_number: "",
  landline_number: "",
};

const SUBJECT_OPTIONS = [
  "Web Development & Architecture",
  "Mobile App Development (iOS / Android)",
  "Custom Software & ERP Solutions",
  "UI/UX & Product Design",
  "AI & Process Automation",
  "Cloud Infrastructure & DevOps",
  "Digital Marketing & SEO",
  "Consulting & Technical Advisory",
  "General Inquiry / Partnership",
];

function PurchaseEnquiryForm() {
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product") || "";
  const planParam = searchParams.get("plan") || "";
  const versionParam = searchParams.get("version") || "";
  const cartItemsParam = searchParams.get("cart_items") || "";
  const cartItems: { product: string; plan: string; version: string; quantity: number }[] = (() => {
    try { return JSON.parse(cartItemsParam); } catch { return []; }
  })();
  const hasCartItems = cartItems.length > 0;
  const isPurchaseEnquiry = !!(productParam || planParam || versionParam || hasCartItems);
  const productList = hasCartItems
    ? cartItems.map(i => `${i.product}${i.plan ? ` (${i.plan})` : ''} x${i.quantity}`).join('\n')
    : productParam;

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile: "",
    company: "",
    country: "",
    requirements: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const enquiryBody: any = {
        product_name: productParam || (hasCartItems ? cartItems.map(i => i.product).join(', ') : ''),
        selected_plan: planParam || '',
        product_version: versionParam || '',
        ...formData,
      };
      if (hasCartItems) {
        enquiryBody.requirements = (formData.requirements ? formData.requirements + '\n\n' : '') +
          'Cart Items:\n' + productList;
        enquiryBody.cart_items = cartItems;
      }
      const res = await fetch("/internal/backend/store/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(enquiryBody),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to submit enquiry");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isPurchaseEnquiry) return null;

  if (submitted) {
    const submittedProduct = hasCartItems ? cartItems.map(i => i.product).join(', ') : productParam;
    return (
      <section className="contact-purchase-enquiry" style={styles.purchaseSection}>
        <div style={styles.successBox}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={{ ...styles.subHeading, textAlign: "center" }}>Enquiry Submitted!</h2>
          <p style={{ ...styles.narrative, textAlign: "center" }}>
            Thank you for your interest in <strong>{submittedProduct}</strong>. Our sales team will contact you shortly at <strong>{formData.email}</strong>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="contact-purchase-enquiry" style={styles.purchaseSection}>
      <div style={styles.purchaseHeader}>
        <span style={styles.purchaseBadge}>Purchase Enquiry</span>
        <h2 style={styles.subHeading}>
          {hasCartItems ? `Checkout (${cartItems.length} item${cartItems.length !== 1 ? 's' : ''})` : `Buy ${productParam}`}
        </h2>
        {hasCartItems ? (
          <div style={{ ...styles.purchaseMeta, fontSize: '13px', lineHeight: '1.6' }}>
            {cartItems.map((item, i) => (
              <div key={i}>
                • {item.product}{item.plan ? ` — ${item.plan}` : ''} (x{item.quantity})
              </div>
            ))}
          </div>
        ) : (planParam || versionParam) ? (
          <p style={styles.purchaseMeta}>
            {planParam && <><strong>Plan:</strong> {planParam}</>}
            {planParam && versionParam && <span style={{ margin: "0 8px", opacity: 0.3 }}>|</span>}
            {versionParam && <><strong>Version:</strong> {versionParam}</>}
          </p>
        ) : null}
        <p style={styles.narrative}>Fill in your details and our team will reach out to complete your purchase.</p>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit} style={styles.purchaseForm}>
        <div className="contact-form-grid" style={styles.formGrid}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name <span style={{ color: "#FF3B30" }}>*</span></label>
            <input name="full_name" value={formData.full_name} onChange={handleChange} required placeholder="John Doe" style={styles.input} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email Address <span style={{ color: "#FF3B30" }}>*</span></label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" style={styles.input} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Mobile Number <span style={{ color: "#FF3B30" }}>*</span></label>
            <input name="mobile" type="tel" value={formData.mobile} onChange={handleChange} required placeholder="+1 234 567 890" style={styles.input} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Company</label>
            <input name="company" value={formData.company} onChange={handleChange} placeholder="Acme Inc." style={styles.input} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Country</label>
            <input name="country" value={formData.country} onChange={handleChange} placeholder="United States" style={styles.input} />
          </div>
          <div style={{ ...styles.fieldGroup, gridColumn: "1 / -1" }}>
            <label style={styles.label}>Requirements / Message</label>
            <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={3} placeholder="Tell us about your specific requirements..." style={{ ...styles.input, resize: "vertical", minHeight: "80px" }} />
          </div>
        </div>
        <button type="submit" disabled={submitting} style={{ ...styles.submitBtn, opacity: submitting ? 0.6 : 1 }}>
          {submitting ? "Submitting..." : "Submit Enquiry"}
        </button>
      </form>
    </section>
  );
}

/**
 * Exact Get In Touch Contact Form
 * Pixel-perfect implementation of the provided design mockup:
 * - Row 1: Name * | Email *
 * - Row 2: Calling Number * | WhatsApp Number * (with "Same as calling" checkbox)
 * - Row 3: Preferred Date * (Next 7 days only) | Preferred Time Slot * | Your Timezone * (Detected)
 * - Row 4: Company | Subject *
 * - Row 5: Message *
 * - Row 6: Consent checkbox
 * - Row 7: Full-width Send Message button
 */
function ExactGetInTouchContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [callingPhone, setCallingPhone] = useState("");
  const [callingCountry, setCallingCountry] = useState("IN");
  const [callingDial, setCallingDial] = useState("+91");
  const [whatsappPhone, setWhatsappPhone] = useState("");
  const [whatsappCountry, setWhatsappCountry] = useState("IN");
  const [whatsappDial, setWhatsappDial] = useState("+91");
  const [sameAsCalling, setSameAsCalling] = useState(false);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("");
  const [userTimeZone, setUserTimeZone] = useState("Asia/Kolkata");
  const [company, setCompany] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Timezone auto-detect
  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
      setUserTimeZone(tz);
    } catch {}
  }, []);

  const bookingDateLimits = useMemo(() => getBookingDateLimits(7), []);

  const calculatedIST = useMemo(() => {
    if (!preferredTimeSlot) return "";
    return getSlotISTRange(preferredDate, preferredTimeSlot, userTimeZone || "Asia/Kolkata");
  }, [preferredDate, preferredTimeSlot, userTimeZone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid business email address.");
      return;
    }
    if (!callingPhone.trim()) {
      setError("Please enter your calling phone number.");
      return;
    }
    if (!sameAsCalling && !whatsappPhone.trim()) {
      setError("Please enter your WhatsApp number or check 'Same as calling'.");
      return;
    }
    if (!subject) {
      setError("Please select a subject.");
      return;
    }
    if (!message.trim()) {
      setError("Please tell us about your project.");
      return;
    }
    if (!consent) {
      setError("Please accept the privacy policy consent to proceed.");
      return;
    }

    setSubmitting(true);

    try {
      const callingFull = `${callingDial} ${callingPhone.trim()}`;
      const whatsappFull = sameAsCalling ? callingFull : `${whatsappDial} ${whatsappPhone.trim()}`;

      const scheduleString = [
        preferredDate ? `Date: ${preferredDate}` : null,
        preferredTimeSlot ? `Slot: ${preferredTimeSlot} (${userTimeZone})` : null,
        calculatedIST ? `IST: ${calculatedIST}` : null,
      ].filter(Boolean).join(" · ");

      const ticket = await createPublicTicket({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        callingPhone: callingFull,
        whatsappPhone: whatsappFull,
        preferredContactDate: scheduleString || undefined,
        preferredContactTime: preferredTimeSlot || undefined,
        timeZone: userTimeZone,
        clientTimeZone: userTimeZone,
        adminCallTimeIST: calculatedIST,
        company: company.trim(),
        subject: subject,
        message: message.trim(),
        source: "public_contact",
      });

      setSubmittedRef(ticket?.requestId || "WSD-SUBMITTED");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Could not send your message. Please check your connection or contact us via email."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedRef) {
    return (
      <div style={styles.exactFormSuccess}>
        <CheckCircle2 size={48} color="#007AFF" style={{ margin: "0 auto" }} />
        <h3 style={styles.exactSuccessTitle}>Message Sent Successfully!</h3>
        <p style={styles.exactSuccessRef}>Reference ID: <strong>{submittedRef}</strong></p>
        <p style={styles.exactSuccessDesc}>
          Thank you, <strong>{name}</strong>! We have received your inquiry regarding <em>{subject}</em>. An email confirmation has been sent to <strong>{email}</strong>. Our enterprise team will respond shortly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmittedRef(null);
            setName("");
            setEmail("");
            setCallingPhone("");
            setWhatsappPhone("");
            setCompany("");
            setSubject("");
            setMessage("");
            setConsent(false);
          }}
          style={styles.exactSendAnotherBtn}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.exactFormCard} className="exact-get-in-touch-form">
      {error && <div style={styles.exactErrorAlert}>{error}</div>}

      {/* Row 1: Name * | Email * */}
      <div className="exact-form-row exact-row-2 exact-row-identity">
        <div style={styles.exactField} className="exact-form-field">
          <label style={styles.exactLabel} className="exact-form-label">
            Name <span style={{ color: "#FF3B30" }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Your Name"
            style={styles.exactInput}
            className="exact-form-input"
          />
        </div>

        <div style={styles.exactField} className="exact-form-field">
          <label style={styles.exactLabel} className="exact-form-label">
            Email <span style={{ color: "#FF3B30" }}>*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="john@example.com"
            style={styles.exactInput}
            className="exact-form-input"
          />
        </div>
      </div>

      {/* Row 2: Calling Number * | WhatsApp Number * */}
      <div className="exact-form-row exact-row-2 exact-row-phones">
        <div style={styles.exactField} className="exact-form-field">
          <label style={styles.exactLabel} className="exact-form-label">
            Calling Number <span style={{ color: "#FF3B30" }}>*</span>
          </label>
          <PhoneInputWithCountry
            id="exact-calling-phone"
            value={callingPhone}
            countryCode={callingCountry}
            onCountryChange={(c) => {
              setCallingCountry(c.code);
              setCallingDial(c.dial);
            }}
            onChange={(digits) => setCallingPhone(digits)}
            placeholder="Phone number"
            icon={<Phone size={14} color="#8e8e93" />}
          />
        </div>

        <div style={styles.exactField} className="exact-form-field">
          <div style={styles.labelWithAction} className="exact-label-with-action">
            <label style={styles.exactLabel} className="exact-form-label">
              WhatsApp Number <span style={{ color: "#FF3B30" }}>*</span>
            </label>
            <label style={styles.sameAsCallingLabel} className="exact-same-as-calling-label">
              <input
                type="checkbox"
                checked={sameAsCalling}
                onChange={(e) => setSameAsCalling(e.target.checked)}
                style={{ cursor: "pointer", accentColor: "#007AFF" }}
              />
              Same as calling
            </label>
          </div>
          <PhoneInputWithCountry
            id="exact-whatsapp-phone"
            value={sameAsCalling ? callingPhone : whatsappPhone}
            countryCode={sameAsCalling ? callingCountry : whatsappCountry}
            disabled={sameAsCalling}
            onCountryChange={(c) => {
              setWhatsappCountry(c.code);
              setWhatsappDial(c.dial);
            }}
            onChange={(digits) => setWhatsappPhone(digits)}
            placeholder="WhatsApp number"
            icon={<MessageSquare size={14} color="#8e8e93" />}
          />
        </div>
      </div>

      {/* Row 3: Preferred Date * | Preferred Time Slot * | Your Timezone * */}
      <div className="exact-form-row exact-row-3 exact-row-schedule">
        <div style={styles.exactField} className="exact-form-field">
          <div style={styles.labelWithAction} className="exact-label-with-action">
            <label style={styles.exactLabel} className="exact-form-label">
              Preferred Date <span style={{ color: "#FF3B30" }}>*</span>
            </label>
            <span style={styles.helperNotice} className="exact-helper-notice">Next 7 days only</span>
          </div>
          <input
            type="date"
            min={bookingDateLimits.minDate}
            max={bookingDateLimits.maxDate}
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            style={styles.exactInput}
            className="exact-form-input"
          />
        </div>

        <div style={styles.exactField} className="exact-form-field">
          <label style={styles.exactLabel} className="exact-form-label">
            Preferred Time Slot <span style={{ color: "#FF3B30" }}>*</span>
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <select
              value={preferredTimeSlot}
              onChange={(e) => setPreferredTimeSlot(e.target.value)}
              className="exact-form-input"
              style={{
                ...styles.exactInput,
                paddingRight: "36px",
                color: preferredTimeSlot ? "inherit" : "#8e8e93",
              }}
            >
              <option value="">Select preferred slot...</option>
              {CONTACT_TIME_SLOT_GROUPS.map((grp) => (
                <optgroup key={grp.group} label={grp.group} style={{ fontWeight: 700, backgroundColor: "var(--bg-secondary)" }}>
                  {grp.slots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
            <ChevronDown
              size={15}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#8e8e93",
              }}
            />
          </div>
        </div>

        <div style={styles.exactField} className="exact-form-field">
          <div style={styles.labelWithAction} className="exact-label-with-action">
            <label style={styles.exactLabel} className="exact-form-label">
              Your Timezone <span style={{ color: "#FF3B30" }}>*</span>
            </label>
            <span style={styles.detectedBadge} className="exact-detected-badge">
              <Globe size={11} /> Detected
            </span>
          </div>
          <div style={{ position: "relative", width: "100%" }}>
            <select
              value={userTimeZone}
              onChange={(e) => setUserTimeZone(e.target.value)}
              className="exact-form-input"
              style={{
                ...styles.exactInput,
                paddingRight: "36px",
                color: "inherit",
              }}
            >
              <option value="Asia/Kolkata">Calcutta (Asia/Calcutta)</option>
              {POPULAR_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#8e8e93",
              }}
            />
          </div>
        </div>
      </div>

      {/* Row 4: Company | Subject * */}
      <div className="exact-form-row exact-row-2 exact-row-details">
        <div style={styles.exactField} className="exact-form-field">
          <label style={styles.exactLabel} className="exact-form-label">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company / Organization"
            style={styles.exactInput}
            className="exact-form-input"
          />
        </div>

        <div style={styles.exactField} className="exact-form-field">
          <label style={styles.exactLabel} className="exact-form-label">
            Subject <span style={{ color: "#FF3B30" }}>*</span>
          </label>
          <div style={{ position: "relative", width: "100%" }}>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="exact-form-input"
              style={{
                ...styles.exactInput,
                paddingRight: "36px",
                color: subject ? "inherit" : "#8e8e93",
              }}
            >
              <option value="">Select a subject...</option>
              {SUBJECT_OPTIONS.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
            <ChevronDown
              size={15}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#8e8e93",
              }}
            />
          </div>
        </div>
      </div>

      {/* Row 5: Message * */}
      <div style={styles.exactField} className="exact-form-field exact-field-message">
        <label style={styles.exactLabel} className="exact-form-label">
          Message <span style={{ color: "#FF3B30" }}>*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={3}
          placeholder="Tell us about your project..."
          style={{ ...styles.exactInput, resize: "vertical", minHeight: "90px" }}
          className="exact-form-input"
        />
      </div>

      {/* Row 6: Consent Checkbox */}
      <div style={styles.consentRow} className="exact-consent-row">
        <input
          type="checkbox"
          id="exact-contact-consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          style={{
            cursor: "pointer",
            width: "16px",
            height: "16px",
            accentColor: "#007AFF",
            flexShrink: 0,
            marginTop: "2px",
          }}
        />
        <label htmlFor="exact-contact-consent" style={styles.consentLabel} className="exact-consent-label">
          I consent to WebSmith Digital collecting and processing my contact details to respond to my inquiry in accordance with the{" "}
          <Link href="/privacy" style={{ color: "#007AFF", textDecoration: "underline" }} target="_blank">
            Privacy Policy
          </Link>
          .
        </label>
      </div>

      {/* Row 7: Full Width Send Message Button */}
      <button
        type="submit"
        disabled={submitting}
        style={{ ...styles.exactSubmitBtn, opacity: submitting ? 0.65 : 1 }}
        className="exact-submit-button"
      >
        {submitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}

export default function ContactPage() {
  const { publicTheme } = usePublicTheme();
  const isDark = publicTheme === "dark";
  const [contactInfo, setContactInfo] = useState(defaultContactInfo);
  const socials = SOCIAL_PLATFORM_META.map((platform) => ({
    ...platform,
    href: contactInfo[platform.key] || "",
  })).filter((social) => Boolean(social.href));

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('/settings/public/contact_info');
        if (res.data && res.data.success && res.data.data) {
          const data = res.data.data;
          setContactInfo({
            ...defaultContactInfo,
            ...data,
            headquarters: data.headquarters || defaultContactInfo.headquarters,
            phone: data.phone || defaultContactInfo.phone,
          });
        }
      } catch (error) {
        console.error('Failed to fetch contact settings', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div
      className={`contact-fullscreen-page ${isDark ? "theme-dark" : "theme-light"}`}
      style={{
        width: "100%",
        maxWidth: "100%",
        minHeight: "100%",
        boxSizing: "border-box",
        backgroundColor: "transparent",
        color: isDark ? "#ffffff" : "#0f172a",
      }}
    >
      {/* Centered Grand Hero Section */}
      <section
        className="contact-hero-section"
        style={{
          ...styles.hero,
          background: isDark
            ? "radial-gradient(ellipse at 50% -20%, rgba(59, 130, 246, 0.22), transparent 72%)"
            : "radial-gradient(ellipse at 50% -20%, rgba(6, 182, 212, 0.16), transparent 72%)",
        }}
      >
        <div style={styles.heroGlowA} />
        <div style={styles.heroGlowB} />
        <div className="contact-hero-inner" style={styles.heroInner}>
          <span className="contact-hero-eyebrow" style={styles.eyebrowBadge}>
            <Sparkles size={13} style={{ display: "inline-block", marginRight: "4px" }} />
            Get In Touch
          </span>
          <h1 className="contact-hero-title" style={styles.heroTitle}>
            Connect with WebSmith Digital
          </h1>
          <p className="contact-hero-desc" style={styles.heroDesc}>
            Ready to build something exceptional? Connect directly with our enterprise software architects, product engineers, and technical leadership.
          </p>
          <div className="contact-hero-pills" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px", marginTop: "4px" }}>
            <span style={styles.heroPill}>⚡ Rapid 2-Hour Response</span>
            <span style={styles.heroPill}>🔒 100% NDA Protected</span>
            <span style={styles.heroPill}>💼 Direct Engineering Consultation</span>
          </div>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="contact-body-container" style={styles.bodyContainer}>
        <Suspense fallback={null}>
          <PurchaseEnquiryForm />
        </Suspense>

        {/* Reach Out Directly - Contact Info Cards */}
        <section className="contact-info-section" style={styles.section}>
          <div className="contact-info-header" style={{ textAlign: "center", marginBottom: "8px" }}>
            <h2 className="contact-subheading" style={styles.subHeading}>Reach Out Directly</h2>
            <p className="contact-subdesc" style={styles.subDesc}>Immediate channels to reach our technical and executive teams</p>
          </div>

          <div className="contact-info-grid" style={styles.infoGrid}>
            {/* Card 1: Support */}
            <div className="contact-card" style={styles.infoCard}>
              <div style={styles.cardHeader}>
                <span className="contact-card-icon" style={styles.cardIconWrap}>
                  <Mail size={14} color="#007AFF" />
                </span>
                <span className="contact-card-label" style={styles.cardLabel}>General Inquiries</span>
              </div>
              <h3 className="contact-card-title" style={styles.cardTitle}>Support</h3>
              <a href={`mailto:${contactInfo.email}`} className="contact-card-link" style={styles.cardLink} title={contactInfo.email}>
                {contactInfo.email}
              </a>
            </div>

            {/* Card 2: Consultation */}
            <div className="contact-card" style={styles.infoCard}>
              <div style={styles.cardHeader}>
                <span className="contact-card-icon" style={styles.cardIconWrap}>
                  <Mail size={14} color="#007AFF" />
                </span>
                <span className="contact-card-label" style={styles.cardLabel}>Sales & Business</span>
              </div>
              <h3 className="contact-card-title" style={styles.cardTitle}>Consultation</h3>
              <a href={`mailto:${contactInfo.sales_email || contactInfo.email}`} className="contact-card-link" style={styles.cardLink} title={contactInfo.sales_email || contactInfo.email}>
                {contactInfo.sales_email || contactInfo.email}
              </a>
            </div>

            {/* Card 3: Call Us */}
            <div className="contact-card" style={styles.infoCard}>
              <div style={styles.cardHeader}>
                <span className="contact-card-icon" style={styles.cardIconWrap}>
                  <Phone size={14} color="#007AFF" />
                </span>
                <span className="contact-card-label" style={styles.cardLabel}>Call Us</span>
              </div>
              <h3 className="contact-card-title" style={styles.cardTitle}>Phone Number</h3>
              <a href={`tel:${contactInfo.phone}`} className="contact-card-link" style={styles.cardLink}>
                {contactInfo.phone}
              </a>
            </div>

            {/* Card 4: Mobile */}
            <div className="contact-card" style={styles.infoCard}>
              <div style={styles.cardHeader}>
                <span className="contact-card-icon" style={styles.cardIconWrap}>
                  <Smartphone size={14} color="#007AFF" />
                </span>
                <span className="contact-card-label" style={styles.cardLabel}>Mobile</span>
              </div>
              <h3 className="contact-card-title" style={styles.cardTitle}>Mobile Number</h3>
              <a href={`tel:${contactInfo.mobile_number || contactInfo.phone}`} className="contact-card-link" style={styles.cardLink}>
                {contactInfo.mobile_number || contactInfo.phone}
              </a>
            </div>

            {/* Card 5: Landline */}
            <div className="contact-card" style={styles.infoCard}>
              <div style={styles.cardHeader}>
                <span className="contact-card-icon" style={styles.cardIconWrap}>
                  <PhoneCall size={14} color="#007AFF" />
                </span>
                <span className="contact-card-label" style={styles.cardLabel}>Landline</span>
              </div>
              <h3 className="contact-card-title" style={styles.cardTitle}>Fixed/Landline</h3>
              <a href={`tel:${contactInfo.landline_number || contactInfo.phone}`} className="contact-card-link" style={styles.cardLink}>
                {contactInfo.landline_number || contactInfo.phone}
              </a>
            </div>

            {/* Card 6: Headquarters */}
            <div className="contact-card contact-card-address" style={styles.infoCard}>
              <div style={styles.cardHeader}>
                <span className="contact-card-icon" style={styles.cardIconWrap}>
                  <MapPin size={14} color="#007AFF" />
                </span>
                <span className="contact-card-label" style={styles.cardLabel}>Headquarters</span>
              </div>
              <h3 className="contact-card-title" style={styles.cardTitle}>Address</h3>
              <span className="contact-card-text" style={styles.cardText} title={contactInfo.headquarters}>
                {contactInfo.headquarters}
              </span>
            </div>
          </div>
        </section>

        {/* Send a Message - 2-Column Grid: 3 Stacked Perks on Left, Form on Right */}
        <section className="contact-form-section" style={{ ...styles.section, marginTop: "8px" }}>
          {/* Section Header */}
          <div style={{ textAlign: "center", marginBottom: "18px" }}>
            <span className="contact-card-label" style={{ ...styles.cardLabel, display: "inline-block", marginBottom: "6px" }}>
              DIRECT INQUIRY
            </span>
            <h2 className="contact-subheading" style={{ ...styles.subHeading, fontSize: "clamp(22px, 3.5vw, 30px)" }}>
              Send a Message
            </h2>
            <p className="contact-subdesc" style={{ ...styles.subDesc, maxWidth: "600px", margin: "4px auto 0" }}>
              Provide details about your project, timeline, and consultation preferences.
            </p>
          </div>

          {/* 2-Column Balanced Grid: Left Perks Sidebar + Right Contact Form */}
          <div className="contact-inquiry-grid" style={styles.inquiryGrid}>
            {/* Left Column: 3 Trust Perk Cards Stacked Vertically */}
            <div className="contact-perks-sidebar" style={styles.perksSidebar}>
              <div className="contact-perk-card" style={styles.perkCard}>
                <div style={styles.perkIconWrap}>
                  <Clock size={22} color="#007AFF" />
                </div>
                <div style={styles.perkContent}>
                  <span className="contact-perk-badge" style={styles.perkBadge}>SLA COMMITMENT</span>
                  <h4 className="contact-perk-title" style={styles.perkTitle}>2-Hour Response SLA</h4>
                  <p className="contact-perk-desc" style={styles.perkDesc}>
                    Rapid direct evaluation by senior engineering consultants during active business hours.
                  </p>
                  <div className="contact-perk-meta" style={styles.perkMeta}>
                    <span style={styles.perkDot} /> Initial consultation review &lt; 45 mins
                  </div>
                </div>
              </div>

              <div className="contact-perk-card" style={styles.perkCard}>
                <div style={styles.perkIconWrap}>
                  <ShieldCheck size={22} color="#007AFF" />
                </div>
                <div style={styles.perkContent}>
                  <span className="contact-perk-badge" style={styles.perkBadge}>IP PROTECTION</span>
                  <h4 className="contact-perk-title" style={styles.perkTitle}>Confidential & Protected</h4>
                  <p className="contact-perk-desc" style={styles.perkDesc}>
                    Your project specifications, codebases, and business data remain protected under standard NDA.
                  </p>
                  <div className="contact-perk-meta" style={styles.perkMeta}>
                    <span style={styles.perkDot} /> Strict mutual NDA agreements
                  </div>
                </div>
              </div>

              <div className="contact-perk-card" style={styles.perkCard}>
                <div style={styles.perkIconWrap}>
                  <Sparkles size={22} color="#007AFF" />
                </div>
                <div style={styles.perkContent}>
                  <span className="contact-perk-badge" style={styles.perkBadge}>CONSULTATION</span>
                  <h4 className="contact-perk-title" style={styles.perkTitle}>Dedicated Solutions Lead</h4>
                  <p className="contact-perk-desc" style={styles.perkDesc}>
                    Direct pairing with specialists matched to your tech stack, system budget, and delivery goals.
                  </p>
                  <div className="contact-perk-meta" style={styles.perkMeta}>
                    <span style={styles.perkDot} /> Direct technical executive pairing
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Centered Exact Form Container */}
            <div className="contact-exact-form-wrapper" style={styles.formWrapper}>
              <ExactGetInTouchContactForm />
            </div>
          </div>
        </section>

        {/* Social Media & Networks - In Mobile View Shows ONLY the Logo! */}
        {socials.length > 0 && (
          <section className="contact-social-section" style={styles.section}>
            <div className="contact-info-header" style={{ textAlign: "center", marginBottom: "8px" }}>
              <h2 className="contact-subheading" style={styles.subHeading}>Social Media & Networks</h2>
              <p className="contact-subdesc" style={styles.subDesc}>Stay connected with WebSmith Digital across global tech communities</p>
            </div>
            <div className="contact-social-grid" style={styles.socialGrid}>
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.key}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.socialItem}
                    className="contact-social-link"
                    title={social.label}
                    aria-label={social.label}
                  >
                    <span style={{ ...styles.socialIcon, backgroundColor: social.color }} className="contact-social-icon-badge">
                      <Icon size={16} color="#FFFFFF" />
                    </span>
                    <div className="contact-social-text-wrap" style={{ minWidth: 0, flex: 1 }}>
                      <span className="contact-social-name" style={styles.socialLabel}>{social.label}</span>
                      <span className="contact-social-url" style={styles.socialValue}>{social.href}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Why Contact WebSmith Digital */}
        <section className="contact-why-section" style={styles.section}>
          <div className="contact-info-header" style={{ textAlign: "center", marginBottom: "8px" }}>
            <h2 className="contact-subheading" style={styles.subHeading}>Why Contact WebSmith Digital</h2>
            <p className="contact-subdesc" style={styles.subDesc}>Enterprise engineering standard, proven delivery timelines, and direct accountability</p>
          </div>
          <div className="contact-why-grid" style={styles.whyGrid}>
            {[
              "Professional and timely communication",
              "Expert guidance for your business needs",
              "Reliable consultation and support",
              "Customized solutions for every business size",
              "Long-term partnership focused approach"
            ].map((item, idx) => (
              <div key={item} className="contact-why-item" style={styles.whyItem}>
                <div style={styles.whyNumber}>0{idx + 1}</div>
                <div style={styles.whyTextWrap}>
                  <div style={styles.listDot} />
                  <span className="contact-why-text" style={styles.listText}>{item}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="contact-closure-section" style={styles.closure}>
          <h2 className="contact-closure-title" style={styles.narrativeLarge}>
            Let&apos;s Build Something Great Together
          </h2>
          <p className="contact-closure-desc" style={styles.narrativeCenter}>
            Whether you are starting a new business, upgrading your legacy systems, or scaling your global digital presence, 
            WebSmith Digital is ready to help you move forward with confidence.
          </p>
          <div style={{ marginTop: "14px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            <a
              href={`mailto:${contactInfo.sales_email || contactInfo.email}`}
              className="contact-cta-primary"
              style={styles.closurePrimaryBtn}
            >
              Email Executive Sales
            </a>
            <a
              href={`tel:${contactInfo.phone}`}
              className="contact-cta-secondary"
              style={styles.closureSecondaryBtn}
            >
              Call Our Office
            </a>
          </div>
        </section>
      </div>

      {/* Scoped CSS for Full Screen Desktop, Exact Form Grid, and Ultra-Compact Mobile */}
      <style>{`
        .contact-fullscreen-page {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: hidden;
        }

        .contact-hero-section {
          width: 100% !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
        }

        .contact-hero-inner {
          width: 100% !important;
          max-width: 900px !important;
          margin: 0 auto !important;
          text-align: center !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
        }

        .contact-hero-title {
          text-align: center !important;
          margin: 0 auto !important;
        }

        .contact-hero-desc {
          text-align: center !important;
          margin: 0 auto !important;
          max-width: 760px !important;
        }

        .contact-body-container {
          width: 100% !important;
          max-width: 100% !important;
          padding: clamp(20px, 3vw, 40px) clamp(20px, 4vw, 56px) 56px !important;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
        }

        .contact-why-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 12px;
        }

        .contact-social-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
        }

        .contact-card, .contact-why-item, .contact-social-link {
          transition: all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .contact-card:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 122, 255, 0.4) !important;
          box-shadow: 0 10px 24px -6px rgba(0, 122, 255, 0.12);
        }

        .contact-social-link:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 122, 255, 0.35) !important;
          box-shadow: 0 8px 20px rgba(0, 122, 255, 0.1);
        }

        .exact-submit-button:hover, .contact-cta-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px -4px rgba(0, 122, 255, 0.45) !important;
        }

        .contact-cta-secondary:hover {
          transform: translateY(-1px);
          border-color: #007AFF !important;
          color: #007AFF !important;
        }

        /* 2-Column Full Screen Inquiry Grid: 35% Perks Sidebar + 65% Contact Form */
        .contact-inquiry-grid {
          display: grid;
          grid-template-columns: 35fr 65fr !important;
          gap: 24px;
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 auto;
          align-items: stretch;
          box-sizing: border-box;
        }

        .contact-perks-sidebar {
          display: flex;
          flex-direction: column;
          gap: 14px;
          width: 100%;
          justify-content: space-between;
        }

        .contact-perk-card {
          transition: all 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .contact-perk-card:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 122, 255, 0.4) !important;
          box-shadow: 0 10px 24px -6px rgba(0, 122, 255, 0.12);
        }

        /* Exact Form Row Grids */
        .exact-form-row {
          display: grid;
          gap: 16px;
          width: 100%;
        }

        .exact-row-2 {
          grid-template-columns: 1fr 1fr;
        }

        .exact-row-3 {
          grid-template-columns: 1fr 1fr 1fr;
        }

        /* Tablet Adjustments */
        @media (max-width: 1024px) {
          .contact-inquiry-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .contact-perks-sidebar {
            display: grid !important;
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
            gap: 10px !important;
          }
          .exact-row-3 {
            grid-template-columns: 1fr 1fr !important;
          }
        }

        /* ============================================================
           MOBILE VIEW: ULTRA-COMPACT & STREAMLINED (<= 768px)
           ============================================================ */
        @media (max-width: 768px) {
          /* Fixed Mobile Nav Clearance */
          .contact-fullscreen-page {
            padding-top: 72px !important;
          }

          .contact-hero-section {
            padding: 24px 16px 14px !important;
          }

          .contact-hero-inner {
            padding: 0 !important;
            gap: 8px !important;
          }

          .contact-hero-eyebrow {
            font-size: 10px !important;
            padding: 4px 10px !important;
          }

          .contact-hero-title {
            font-size: 22px !important;
            line-height: 1.2 !important;
          }

          .contact-hero-desc {
            font-size: 12px !important;
            line-height: 1.4 !important;
          }

          .contact-body-container {
            padding: 12px 12px 36px !important;
            gap: 14px !important;
          }

          .contact-subheading {
            font-size: 16px !important;
          }

          .contact-subdesc {
            font-size: 11px !important;
            margin-top: 2px !important;
          }

          /* ------------------------------------------------------------
             USER REQUEST: ULTRA-COMPACT 2-COLUMN CONTACT CARDS
             ------------------------------------------------------------ */
          .contact-info-grid {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            gap: 6px !important;
          }

          .contact-card {
            padding: 7px 9px !important;
            border-radius: 10px !important;
            gap: 1px !important;
            min-height: auto !important;
          }

          .contact-card-icon {
            width: 18px !important;
            height: 18px !important;
            border-radius: 5px !important;
          }

          .contact-card-icon svg {
            width: 10px !important;
            height: 10px !important;
          }

          .contact-card-label {
            font-size: 7.5px !important;
            letter-spacing: 0.04em !important;
          }

          .contact-card-title {
            font-size: 11.5px !important;
            margin: 1px 0 2px 0 !important;
            line-height: 1.2 !important;
          }

          .contact-card-link, .contact-card-text {
            font-size: 10.5px !important;
            line-height: 1.25 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            display: block !important;
          }

          .contact-card-address {
            grid-column: span 1 !important;
          }

          .contact-card-address .contact-card-text {
            white-space: nowrap !important;
            text-overflow: ellipsis !important;
          }

          /* ------------------------------------------------------------
             USER REQUEST: IN MOBILE VIEW JUST SHOW THE LOGO (SOCIALS)
             ------------------------------------------------------------ */
          .contact-social-grid {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 10px !important;
          }

          .contact-social-link {
            width: 42px !important;
            height: 42px !important;
            min-width: 42px !important;
            padding: 0 !important;
            border-radius: 12px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
          }

          .contact-social-icon-badge {
            width: 100% !important;
            height: 100% !important;
            border-radius: 12px !important;
            margin: 0 !important;
          }

          .contact-social-icon-badge svg {
            width: 20px !important;
            height: 20px !important;
          }

          .contact-social-text-wrap {
            display: none !important;
          }

          /* ------------------------------------------------------------
             EXACT FORM COMPACT ON MOBILE
             ------------------------------------------------------------ */
          .contact-inquiry-grid {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
          }

          .contact-perks-sidebar {
            display: flex !important;
            flex-direction: column !important;
            gap: 8px !important;
          }

          .contact-perk-card {
            padding: 9px 12px !important;
            border-radius: 12px !important;
            gap: 10px !important;
          }

          .contact-perk-card .contact-perk-badge {
            font-size: 10px !important;
          }

          .contact-perk-card .contact-perk-title {
            font-size: 14px !important;
          }

          .contact-perk-card .contact-perk-desc {
            font-size: 11.5px !important;
            line-height: 1.35 !important;
          }

          .contact-perk-meta {
            display: none !important;
          }

          /* ------------------------------------------------------------
             USER REQUEST: ULTRA-COMPACT FORM ON MOBILE (<= 768px)
             ------------------------------------------------------------ */
          .exact-get-in-touch-form {
            padding: 12px 10px !important;
            border-radius: 14px !important;
            gap: 8px !important;
          }

          .exact-form-row {
            gap: 6px !important;
          }

          /* Row 1 (Name & Email): 2 columns on mobile */
          .exact-row-identity {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }

          /* Row 2 (Phones): 1 column on mobile for full dial code + number comfort */
          .exact-row-phones {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 6px !important;
          }

          /* Row 3 (Schedule): 1 column on mobile */
          .exact-row-schedule {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 6px !important;
          }

          /* Row 4 (Company & Subject): 2 columns on mobile */
          .exact-row-details {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }

          .exact-form-field {
            gap: 2px !important;
          }

          .exact-form-label {
            font-size: 10px !important;
            font-weight: 600 !important;
            margin-bottom: 0px !important;
            line-height: 1.2 !important;
          }

          .exact-form-input {
            padding: 5px 8px !important;
            height: 31px !important;
            font-size: 11.5px !important;
            border-radius: 7px !important;
          }

          /* Textarea compact */
          textarea.exact-form-input {
            height: auto !important;
            min-height: 50px !important;
            padding: 5px 8px !important;
            font-size: 11.5px !important;
          }

          .exact-label-with-action {
            margin-bottom: 0px !important;
          }

          /* Phone Input components inside the form on mobile */
          .exact-get-in-touch-form .phone-input-root {
            height: 31px !important;
            min-height: 31px !important;
            border-radius: 7px !important;
          }

          .exact-get-in-touch-form .phone-country-btn {
            padding: 3px 6px !important;
            font-size: 10.5px !important;
            height: 29px !important;
          }

          .exact-get-in-touch-form .phone-country-flag {
            font-size: 12px !important;
          }

          .exact-get-in-touch-form .phone-country-dial {
            font-size: 10.5px !important;
          }

          .exact-get-in-touch-form .phone-number-input {
            padding: 4px 6px 4px 22px !important;
            font-size: 11.5px !important;
            height: 29px !important;
          }

          .exact-same-as-calling-label {
            font-size: 9.5px !important;
            gap: 3px !important;
          }

          .exact-same-as-calling-label input {
            width: 11px !important;
            height: 11px !important;
          }

          .exact-helper-notice, .exact-detected-badge {
            font-size: 9px !important;
          }

          .exact-consent-row {
            gap: 6px !important;
            margin-top: 1px !important;
          }

          .exact-consent-row input {
            width: 12px !important;
            height: 12px !important;
            margin-top: 1px !important;
          }

          .exact-consent-label {
            font-size: 9.5px !important;
            line-height: 1.3 !important;
          }

          .exact-submit-button {
            height: 34px !important;
            font-size: 12px !important;
            margin-top: 2px !important;
            border-radius: 9999px !important;
          }

          /* Why Us Compact */
          .contact-why-grid {
            grid-template-columns: 1fr !important;
            gap: 5px !important;
          }

          .contact-why-item {
            padding: 8px 10px !important;
            border-radius: 8px !important;
            gap: 8px !important;
          }

          .contact-why-text {
            font-size: 11px !important;
          }

          /* Closure Compact */
          .contact-closure-section {
            padding: 16px 12px !important;
            border-radius: 12px !important;
            margin-top: 10px !important;
          }

          .contact-closure-title {
            font-size: 15px !important;
            margin-bottom: 4px !important;
          }

          .contact-closure-desc {
            font-size: 11px !important;
            line-height: 1.35 !important;
          }

          .contact-cta-primary, .contact-cta-secondary {
            padding: 7px 16px !important;
            font-size: 11.5px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  hero: {
    position: "relative",
    overflow: "hidden",
    padding: "clamp(44px, 6vw, 76px) clamp(20px, 4vw, 56px) clamp(32px, 5vw, 52px)",
    width: "100%",
    boxSizing: "border-box",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  heroGlowA: {
    position: "absolute",
    top: "-120px",
    left: "50%",
    transform: "translateX(-60%)",
    width: "540px",
    height: "540px",
    borderRadius: "999px",
    background: "radial-gradient(circle, rgba(59,130,246,0.22) 0%, rgba(59,130,246,0) 70%)",
    pointerEvents: "none",
  },
  heroGlowB: {
    position: "absolute",
    bottom: "-140px",
    left: "50%",
    transform: "translateX(-40%)",
    width: "580px",
    height: "580px",
    borderRadius: "999px",
    background: "radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(6,182,212,0) 70%)",
    pointerEvents: "none",
  },
  heroInner: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
    maxWidth: "880px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  heroPill: {
    display: "inline-flex",
    alignItems: "center",
    padding: "4px 12px",
    borderRadius: "9999px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-secondary)",
  },
  eyebrowBadge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 14px",
    borderRadius: "9999px",
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    border: "1px solid rgba(37, 99, 235, 0.28)",
    color: "#007AFF",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(26px, 4.5vw, 46px)",
    fontWeight: 800,
    lineHeight: 1.14,
    letterSpacing: "-0.03em",
    color: "var(--text-primary)",
  },
  heroDesc: {
    margin: 0,
    maxWidth: "760px",
    color: "var(--text-secondary)",
    fontSize: "clamp(14px, 1.8vw, 16px)",
    lineHeight: 1.6,
  },
  bodyContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "36px",
    width: "100%",
    boxSizing: "border-box",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "100%",
  },
  subHeading: {
    margin: 0,
    fontSize: "21px",
    fontWeight: 700,
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
  },
  subDesc: {
    margin: "4px 0 0 0",
    fontSize: "13.5px",
    color: "var(--text-secondary)",
  },
  infoGrid: {
    width: "100%",
  },
  infoCard: {
    padding: "16px 18px",
    borderRadius: "14px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    boxSizing: "border-box",
    minWidth: 0,
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  cardIconWrap: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardLabel: {
    fontSize: "9.5px",
    fontWeight: 700,
    color: "#007AFF",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },
  cardTitle: {
    margin: "1px 0 2px 0",
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  cardLink: {
    fontSize: "13px",
    fontWeight: 500,
    color: "#007AFF",
    textDecoration: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  cardText: {
    fontSize: "12.5px",
    fontWeight: 500,
    color: "var(--text-secondary)",
    lineHeight: 1.4,
  },

  // 2-Column Full Screen Inquiry Grid & Left Perks Sidebar (35% / 65%)
  inquiryGrid: {
    display: "grid",
    gridTemplateColumns: "35fr 65fr",
    gap: "24px",
    width: "100%",
    maxWidth: "100%",
    margin: "0 auto",
    boxSizing: "border-box",
    alignItems: "stretch",
  },
  perksSidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    width: "100%",
    justifyContent: "space-between",
  },
  perkCard: {
    padding: "22px 24px",
    borderRadius: "18px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    boxSizing: "border-box",
    flex: 1,
  },
  perkIconWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    backgroundColor: "rgba(0, 122, 255, 0.12)",
    border: "1px solid rgba(0, 122, 255, 0.2)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginTop: "2px",
  },
  perkContent: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    minWidth: 0,
    flex: 1,
  },
  perkBadge: {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "#007AFF",
    textTransform: "uppercase",
  },
  perkTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "var(--text-primary)",
    letterSpacing: "-0.015em",
  },
  perkDesc: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.55,
    color: "var(--text-secondary)",
  },
  perkMeta: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    marginTop: "6px",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    opacity: 0.9,
  },
  perkDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#34C759",
    flexShrink: 0,
  },

  // Form Container (Right Column)
  formWrapper: {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
  },
  exactFormCard: {
    backgroundColor: "var(--bg-primary)",
    border: "1px solid var(--border-color)",
    borderRadius: "22px",
    padding: "clamp(24px, 3.5vw, 36px) clamp(20px, 3vw, 32px)",
    boxShadow: "0 6px 24px rgba(0, 0, 0, 0.04)",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    width: "100%",
    boxSizing: "border-box",
  },
  exactField: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    width: "100%",
  },
  exactLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-primary)",
    letterSpacing: "-0.01em",
  },
  labelWithAction: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sameAsCallingLabel: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "12px",
    color: "var(--text-secondary)",
    cursor: "pointer",
    fontWeight: 400,
    userSelect: "none",
  },
  helperNotice: {
    fontSize: "11.5px",
    color: "var(--text-secondary)",
    fontWeight: 400,
  },
  detectedBadge: {
    fontSize: "11.5px",
    color: "#007AFF",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  exactInput: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "11px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
    fontSize: "13.5px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  },
  consentRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginTop: "2px",
  },
  consentLabel: {
    fontSize: "12.5px",
    color: "var(--text-secondary)",
    lineHeight: 1.45,
    cursor: "pointer",
  },
  exactSubmitBtn: {
    width: "100%",
    height: "46px",
    borderRadius: "9999px",
    border: "none",
    background: "#007AFF",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 16px rgba(0, 122, 255, 0.3)",
    transition: "all 0.2s ease",
    marginTop: "4px",
  },
  exactErrorAlert: {
    padding: "10px 14px",
    borderRadius: "10px",
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    border: "1px solid rgba(255, 59, 48, 0.3)",
    color: "#FF3B30",
    fontSize: "13px",
    fontWeight: 500,
  },
  exactFormSuccess: {
    padding: "40px 24px",
    borderRadius: "22px",
    backgroundColor: "var(--bg-primary)",
    border: "1px solid #34C759",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    gap: "12px",
    maxWidth: "960px",
    margin: "0 auto",
  },
  exactSuccessTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  exactSuccessRef: {
    margin: 0,
    fontSize: "14px",
    color: "#007AFF",
    fontWeight: 600,
  },
  exactSuccessDesc: {
    margin: 0,
    fontSize: "13.5px",
    lineHeight: 1.6,
    color: "var(--text-secondary)",
    maxWidth: "500px",
  },
  exactSendAnotherBtn: {
    marginTop: "8px",
    padding: "9px 24px",
    borderRadius: "9999px",
    border: "1px solid #007AFF",
    backgroundColor: "transparent",
    color: "#007AFF",
    fontSize: "13.5px",
    fontWeight: 600,
    cursor: "pointer",
  },

  socialGrid: {
    width: "100%",
  },
  socialItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 14px",
    borderRadius: "12px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    textDecoration: "none",
    minWidth: 0,
  },
  socialIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  socialLabel: {
    display: "block",
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
    whiteSpace: "nowrap",
  },
  socialValue: {
    display: "block",
    fontSize: "11px",
    color: "var(--text-secondary)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  whyGrid: {
    width: "100%",
  },
  whyItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    borderRadius: "12px",
    backgroundColor: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
  },
  whyNumber: {
    fontSize: "11.5px",
    fontWeight: 800,
    color: "#007AFF",
    opacity: 0.8,
  },
  whyTextWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    minWidth: 0,
  },
  listDot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    backgroundColor: "#007AFF",
    flexShrink: 0,
  },
  listText: {
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--text-secondary)",
  },
  closure: {
    padding: "32px 20px",
    borderRadius: "20px",
    backgroundColor: "var(--bg-secondary)",
    textAlign: "center",
    border: "1px solid var(--border-color)",
  },
  narrativeLarge: {
    margin: "0 0 6px 0",
    fontSize: "20px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
    color: "var(--text-primary)",
  },
  narrativeCenter: {
    margin: "0 auto",
    fontSize: "13.5px",
    lineHeight: 1.55,
    color: "var(--text-secondary)",
    maxWidth: "760px",
  },
  closurePrimaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "9px 22px",
    borderRadius: "9999px",
    background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
    color: "#ffffff",
    fontSize: "13px",
    fontWeight: 700,
    textDecoration: "none",
    boxShadow: "0 8px 20px -4px rgba(37, 99, 235, 0.4)",
    transition: "all 0.2s ease",
  },
  closureSecondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    padding: "9px 20px",
    borderRadius: "9999px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontSize: "13px",
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.2s ease",
  },
  purchaseSection: {
    padding: "20px",
    borderRadius: "16px",
    border: "2px solid #007AFF",
    backgroundColor: "var(--bg-secondary)",
    marginBottom: "12px",
  },
  purchaseHeader: {
    display: "grid",
    gap: "8px",
    marginBottom: "16px",
  },
  purchaseBadge: {
    display: "inline-block",
    width: "fit-content",
    padding: "3px 10px",
    borderRadius: "20px",
    backgroundColor: "#007AFF",
    color: "#fff",
    fontSize: "9.5px",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  purchaseMeta: {
    margin: 0,
    fontSize: "12.5px",
    color: "var(--text-secondary)",
  },
  purchaseForm: {
    display: "grid",
    gap: "14px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid var(--border-color)",
    backgroundColor: "var(--bg-primary)",
    color: "var(--text-primary)",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  },
  submitBtn: {
    width: "fit-content",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 24px",
    borderRadius: "9999px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)",
    color: "#fff",
    fontSize: "13.5px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 20px -4px rgba(37, 99, 235, 0.4)",
    transition: "all 0.2s ease",
  },
  successBox: {
    padding: "28px",
    borderRadius: "14px",
    border: "1px solid #34C759",
    backgroundColor: "rgba(52,199,89,0.06)",
    display: "grid",
    gap: "8px",
    justifyContent: "center",
  },
  successIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#34C759",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: 700,
    margin: "0 auto",
  },
  errorBox: {
    padding: "9px 12px",
    borderRadius: "8px",
    backgroundColor: "rgba(255,59,48,0.1)",
    border: "1px solid rgba(255,59,48,0.3)",
    color: "#FF3B30",
    fontSize: "12.5px",
  },
};
