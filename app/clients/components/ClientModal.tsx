// C:\websmith\app\clients\components\ClientModal.tsx
// Client Modal - Form for adding/editing clients with rich CRM profile details
// Features: Client ID badge, contact & company info, website, industry, location, project scope notes, validation

'use client';

import { useState, useEffect } from 'react';
import { X, Globe, Building2, User, Mail, Phone, MapPin, FileText, CheckCircle2, Shield } from 'lucide-react';
import { Client, ClientPayload } from '../services/clientService';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: ClientPayload) => Promise<void>;
  client?: Client | null;
  isSaving?: boolean;
  submitError?: string | null;
}

interface FormData {
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  industry: string;
  address: string;
  city: string;
  country: string;
  notes: string;
  status: 'active' | 'inactive';
  published: boolean;
}

const COMMON_INDUSTRIES = [
  "Adaptive Learning Systems",
  "FinTech & Wealth Management",
  "Healthcare & Telemedicine",
  "Transportation & Fleet",
  "eCommerce & Retail",
  "Cloud & Infrastructure",
  "Urban Transit & IoT",
  "Renewable Energy & CleanTech",
  "Institutional Digital Custody",
  "Enterprise Logistics & Supply Chain",
  "Artificial Intelligence & ML",
  "SaaS & Software Services",
];

export default function ClientModal({ isOpen, onClose, onSave, client, isSaving = false, submitError }: ClientModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    industry: '',
    address: '',
    city: '',
    country: '',
    notes: '',
    status: 'active',
    published: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || '',
        contactPerson: client.contactPerson || '',
        email: client.email || '',
        phone: client.phone || '',
        company: client.company || '',
        website: client.website || '',
        industry: client.industry || '',
        address: client.address || '',
        city: client.city || '',
        country: client.country || '',
        notes: client.notes || '',
        status: client.status || 'active',
        published: Boolean(client.published),
      });
    } else {
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        company: '',
        website: '',
        industry: '',
        address: '',
        city: '',
        country: '',
        notes: '',
        status: 'active',
        published: false,
      });
    }
    setErrors({});
  }, [client, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Client name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      website: formData.website.trim(),
      industry: formData.industry.trim(),
      contactPerson: formData.contactPerson.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      country: formData.country.trim(),
      notes: formData.notes.trim(),
      status: formData.status,
      published: formData.published,
    });
  };

  const updateField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} className="wsd-client-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.modalHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={styles.modalTitle}>{client ? 'Edit Client' : 'New Client'}</h2>
            {client?.customId && (
              <span style={styles.customIdBadge}>
                {client.customId}
              </span>
            )}
          </div>
          <button onClick={onClose} style={styles.closeBtn} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <p style={styles.modalSubtitle}>
          {client ? 'Update client account details, company info, and public portal status.' : 'Register a new client profile with credentials generated automatically.'}
        </p>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Contact & Identity */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <User size={15} color="#007AFF" />
              <span style={styles.sectionTitle}>Contact & Identity</span>
            </div>
            
            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Client Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
                  placeholder="e.g. Horizon EdTech"
                  disabled={isSaving}
                  className="modal-input-focus"
                />
                {errors.name && <p style={styles.errorText}>{errors.name}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Primary Contact Person</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => updateField('contactPerson', e.target.value)}
                  style={styles.input}
                  placeholder="e.g. Dr. Sarah Jenkins"
                  disabled={isSaving}
                  className="modal-input-focus"
                />
              </div>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
                  placeholder="e.g. hello@horizonedtech.org"
                  disabled={isSaving}
                  className="modal-input-focus"
                />
                {errors.email && <p style={styles.errorText}>{errors.email}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  style={{ ...styles.input, ...(errors.phone ? styles.inputError : {}) }}
                  placeholder="e.g. +1 234 567 8900"
                  disabled={isSaving}
                  className="modal-input-focus"
                />
                {errors.phone && <p style={styles.errorText}>{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Company & Web Presence */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <Building2 size={15} color="#007AFF" />
              <span style={styles.sectionTitle}>Company & Industry</span>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Company Name</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  style={{ ...styles.input, ...(errors.company ? styles.inputError : {}) }}
                  placeholder="e.g. Adaptive Learning Systems"
                  disabled={isSaving}
                  className="modal-input-focus"
                />
                {errors.company && <p style={styles.errorText}>{errors.company}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Website / Domain</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => updateField('website', e.target.value)}
                    style={styles.input}
                    placeholder="e.g. https://horizonedtech.org"
                    disabled={isSaving}
                    className="modal-input-focus"
                  />
                  <Globe size={15} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Industry / Sector</label>
              <input
                type="text"
                list="industryList"
                value={formData.industry}
                onChange={(e) => updateField('industry', e.target.value)}
                style={styles.input}
                placeholder="Select or enter industry (e.g. EdTech, FinTech, Healthcare)"
                disabled={isSaving}
                className="modal-input-focus"
              />
              <datalist id="industryList">
                {COMMON_INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Section 3: Location & Business Scope */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <MapPin size={15} color="#007AFF" />
              <span style={styles.sectionTitle}>Location & Project Scope</span>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>City / Region</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  style={styles.input}
                  placeholder="e.g. Stockholm / New York"
                  disabled={isSaving}
                  className="modal-input-focus"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  style={styles.input}
                  placeholder="e.g. Sweden / USA"
                  disabled={isSaving}
                  className="modal-input-focus"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Physical Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                style={{ ...styles.input, ...(errors.address ? styles.inputError : {}) }}
                placeholder="e.g. Suite 400, 100 Innovation Way"
                disabled={isSaving}
                className="modal-input-focus"
              />
              {errors.address && <p style={styles.errorText}>{errors.address}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Business Scope / Brief</label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                style={styles.textarea}
                placeholder="Brief summary of client's engagement, requirements, or architecture notes..."
                rows={2}
                disabled={isSaving}
                className="modal-input-focus"
              />
            </div>
          </div>

          {/* Section 4: Account Status & Visibility */}
          <div style={styles.sectionCard}>
            <div style={styles.sectionHeader}>
              <Shield size={15} color="#007AFF" />
              <span style={styles.sectionTitle}>Status & Portal Settings</span>
            </div>

            <div style={styles.row}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value as 'active' | 'inactive')}
                  style={styles.select}
                  disabled={isSaving}
                >
                  <option value="active">Active Client</option>
                  <option value="inactive">Inactive / Archived</option>
                </select>
              </div>

              <div style={{ ...styles.formGroup, display: 'flex', alignItems: 'center', paddingTop: '22px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => updateField('published', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#007AFF', cursor: 'pointer' }}
                  />
                  <span>Publish this client on the public website</span>
                </label>
              </div>
            </div>
          </div>

          {!client && (
            <div style={styles.infoBox}>
              <p style={styles.infoText}>
                <strong>Note:</strong> Credentials and setup access will be generated and emailed to the client automatically upon saving.
              </p>
            </div>
          )}

          {submitError && <p style={styles.submitError}>{submitError}</p>}

          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.cancelBtn} disabled={isSaving}>Cancel</button>
            <button type="submit" style={styles.saveBtn} disabled={isSaving}>
              {isSaving ? 'Saving...' : client ? 'Update Client' : 'Save Client'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .modal-input-focus:focus {
          border-color: #007AFF !important;
          box-shadow: 0 0 0 3px rgba(0,122,255,0.12) !important;
        }
        @media (max-width: 640px) {
          .wsd-client-modal {
            width: calc(100vw - 20px) !important;
            max-height: calc(100vh - 20px) !important;
            padding: 20px !important;
            border-radius: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: any = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '16px',
  },
  modal: {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '24px',
    padding: '28px 32px',
    width: 'min(96%, 680px)',
    maxWidth: '680px',
    maxHeight: '92vh',
    overflowY: 'auto',
    animation: 'modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
    border: '1px solid var(--border-color)',
    boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.5px',
    margin: 0,
  },
  customIdBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 8px',
    fontSize: '11.5px',
    fontWeight: 700,
    borderRadius: '6px',
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    color: '#007AFF',
    border: '1px solid rgba(0, 122, 255, 0.25)',
  },
  modalSubtitle: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    margin: '0 0 20px 0',
  },
  closeBtn: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  },
  sectionCard: {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
    padding: '18px 20px',
    marginBottom: '16px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '14px',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    color: 'var(--text-primary)',
  },
  formGroup: {
    marginBottom: '14px',
    flex: 1,
    minWidth: '220px',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '6px',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%',
    padding: '11px 14px',
    fontSize: '14px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    outline: 'none',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '11px 14px',
    fontSize: '14px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    outline: 'none',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '11px 14px',
    fontSize: '14px',
    backgroundColor: 'var(--bg-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    outline: 'none',
    color: 'var(--text-primary)',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: '11.5px',
    color: '#FF3B30',
    marginTop: '4px',
    fontWeight: 500,
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  infoBox: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
    padding: '14px 16px',
    borderRadius: '12px',
    marginBottom: '16px',
    border: '1px solid rgba(0, 122, 255, 0.12)',
  },
  infoText: {
    fontSize: '12.5px',
    color: '#007AFF',
    margin: 0,
    lineHeight: 1.5,
  },
  submitError: {
    fontSize: '13px',
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: '14px',
    fontWeight: 600,
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-color)',
  },
  cancelBtn: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    fontFamily: 'inherit',
    transition: 'all 0.15s ease',
  },
  saveBtn: {
    padding: '10px 24px',
    fontSize: '14px',
    fontWeight: 600,
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    boxShadow: '0 4px 12px rgba(0,122,255,0.25)',
    transition: 'all 0.15s ease',
  },
};
