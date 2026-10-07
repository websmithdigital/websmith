// C:\websmith\app\projects\components\ProjectModal.tsx
// Project Modal - Form for adding/editing projects
// Features: Form validation, status/priority dropdowns, date pickers

'use client';

import { useState, useEffect } from 'react';
import { X, Sparkles, Globe, ExternalLink, Image as ImageIcon, RotateCw, CheckCircle2 } from 'lucide-react';
import { Project } from '../services/projectService';
import { getUsersByRole, RoleUser } from '../../../core/services/userService';
import { getStoredUser } from '../../../lib/auth';

type ProjectStatus = 'pending' | 'in-progress' | 'completed' | 'on-hold';
type ProjectPriority = 'low' | 'medium' | 'high';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: any) => void;
  project?: Project | null;
}

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' },
];

const priorityOptions: { value: ProjectPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

interface FormData {
  name: string;
  description: string;
  publicUrl: string;
  previewImage: string;
  client: string;
  clientId: string;
  assignedDevId: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  expectedCompletionDate: string;
  budget: string;
  customClientId: string;
  clientEmail: string;
  clientPhone: string;
  clientCompany: string;
  published: boolean;
  category: string;
  metrics: string;
  techStack: string;
  challenge: string;
  solution: string;
  isFeatured: boolean;
}

export default function ProjectModal({ isOpen, onClose, onSave, project }: ProjectModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    publicUrl: '',
    previewImage: '',
    client: '',
    clientId: '',
    assignedDevId: '',
    status: 'pending',
    priority: 'medium',
    startDate: '',
    endDate: '',
    expectedCompletionDate: '',
    budget: '',
    customClientId: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    published: false,
    category: 'Web Apps',
    metrics: '',
    techStack: '',
    challenge: '',
    solution: '',
    isFeatured: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [clients, setClients] = useState<RoleUser[]>([]);
  const [developers, setDevelopers] = useState<RoleUser[]>([]);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [previewNotice, setPreviewNotice] = useState<string>('');
  const [previewMeta, setPreviewMeta] = useState<{
    ogImage: string | null;
    screenshotUrl: string | null;
    title: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const currentUser = getStoredUser();
    if (!isOpen || currentUser?.role !== 'admin') return;

    const loadAssignments = async () => {
      try {
        const [clientUsers, developerUsers] = await Promise.all([
          getUsersByRole('client'),
          getUsersByRole('developer'),
        ]);
        setClients(clientUsers);
        setDevelopers(developerUsers);
      } catch (error) {
        console.error('Load assignment users error:', error);
      }
    };

    loadAssignments();
  }, [isOpen]);

  useEffect(() => {
    if (project) {
      const rawClientId = typeof project.clientId === 'object' && project.clientId !== null
        ? ((project.clientId as any)._id || '')
        : (project.clientId || '');

      setFormData({
        name: project.name || '',
        description: project.description || '',
        publicUrl: project.publicUrl || '',
        previewImage: project.previewImage || '',
        client: project.client || '',
        clientId: rawClientId,
        assignedDevId: project.assignedDevId || '',
        status: project.status || 'pending',
        priority: project.priority || 'medium',
        startDate: project.startDate?.split('T')[0] || '',
        endDate: project.endDate?.split('T')[0] || '',
        expectedCompletionDate: project.expectedCompletionDate?.split('T')[0] || '',
        budget: project.budget?.toString() || '',
        customClientId: project.customClientId || '',
        clientEmail: (project as any).clientEmail || '',
        clientPhone: (project as any).clientPhone || '',
        clientCompany: (project as any).clientCompany || '',
        published: Boolean(project.published),
        category: (project as any).category || (project as any).projectType || 'Web Apps',
        metrics: (project as any).metrics || '',
        techStack: Array.isArray((project as any).techStack) ? (project as any).techStack.join(', ') : ((project as any).techStack || ''),
        challenge: (project as any).challenge || '',
        solution: (project as any).solution || '',
        isFeatured: Boolean((project as any).isFeatured),
      });
      setPreviewNotice('');
      setPreviewMeta(null);
    } else {
      setFormData({
        name: '',
        description: '',
        publicUrl: '',
        previewImage: '',
        client: '',
        clientId: '',
        assignedDevId: '',
        status: 'pending',
        priority: 'medium',
        startDate: '',
        endDate: '',
        expectedCompletionDate: '',
        budget: '',
        customClientId: '',
        clientEmail: '',
        clientPhone: '',
        clientCompany: '',
        published: false,
        category: 'Web Apps',
        metrics: '',
        techStack: '',
        challenge: '',
        solution: '',
        isFeatured: false,
      });
    }
    setErrors({});
  }, [project, isOpen]);

  useEffect(() => {
    if (clients.length > 0 && project) {
      setFormData((prev) => {
        const currentMatch = clients.find((c) => c._id === prev.clientId);
        if (currentMatch) {
          return {
            ...prev,
            customClientId: prev.customClientId || currentMatch.customId || '',
            client: prev.client || currentMatch.name || '',
            clientEmail: prev.clientEmail || currentMatch.email || '',
            clientCompany: prev.clientCompany || currentMatch.company || '',
          };
        }

        const match = clients.find((c) =>
          (prev.customClientId && c.customId === prev.customClientId) ||
          (project.customClientId && c.customId === project.customClientId) ||
          (prev.clientCompany && c.company?.toLowerCase() === prev.clientCompany.toLowerCase()) ||
          (project.clientCompany && c.company?.toLowerCase() === project.clientCompany.toLowerCase()) ||
          (prev.client && c.name?.toLowerCase() === prev.client.toLowerCase()) ||
          (project.client && c.name?.toLowerCase() === project.client.toLowerCase()) ||
          (prev.clientEmail && c.email?.toLowerCase() === prev.clientEmail.toLowerCase())
        );

        if (match) {
          return {
            ...prev,
            clientId: match._id,
            customClientId: prev.customClientId || match.customId || '',
            client: prev.client || match.name || '',
            clientEmail: prev.clientEmail || match.email || '',
            clientPhone: prev.clientPhone || match.phone || '',
            clientCompany: prev.clientCompany || match.company || '',
          };
        }
        return prev;
      });
    }
  }, [clients, project]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.client.trim() && !formData.clientId.trim()) newErrors.client = 'Client or project owner name is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (formData.publicUrl && !/^https?:\/\/.+/i.test(formData.publicUrl)) {
      if (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(formData.publicUrl.trim())) {
        formData.publicUrl = `https://${formData.publicUrl.trim()}`;
      } else {
        newErrors.publicUrl = 'Hosted URL must start with http:// or https://';
      }
    }
    if (formData.previewImage && !/^(https?:\/\/|\/).+/i.test(formData.previewImage)) newErrors.previewImage = 'Preview image URL must start with http://, https://, or /';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFetchWebsitePreview = async (inputUrl?: string) => {
    let raw = (inputUrl || formData.publicUrl).trim();
    if (!raw) return;
    if (!/^https?:\/\//i.test(raw)) {
      raw = `https://${raw}`;
      updateField('publicUrl', raw);
    }

    setIsFetchingPreview(true);
    setPreviewNotice('');
    try {
      const res = await fetch(`/api/projects/preview?url=${encodeURIComponent(raw)}`);
      const data = await res.json();
      if (data.success) {
        setPreviewMeta({
          ogImage: data.ogImage || null,
          screenshotUrl: data.screenshotUrl || null,
          title: data.title || '',
          description: data.description || '',
        });
        const chosenImage = data.previewImage || data.screenshotUrl;
        if (chosenImage) {
          updateField('previewImage', chosenImage);
        }
        setPreviewNotice(data.ogImage ? 'Captured website social preview banner!' : 'Captured live website screenshot!');
      } else {
        const fallbackShot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(raw)}?w=1280&h=800`;
        updateField('previewImage', fallbackShot);
        setPreviewNotice('Generated live website screenshot thumbnail!');
      }
    } catch {
      const fallbackShot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(raw)}?w=1280&h=800`;
      updateField('previewImage', fallbackShot);
      setPreviewNotice('Generated live website screenshot thumbnail!');
    } finally {
      setIsFetchingPreview(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let finalPreview = formData.previewImage.trim();
    if (!finalPreview && formData.publicUrl.trim()) {
      let norm = formData.publicUrl.trim();
      if (!/^https?:\/\//i.test(norm)) norm = `https://${norm}`;
      finalPreview = `https://s0.wp.com/mshots/v1/${encodeURIComponent(norm)}?w=1280&h=800`;
    }

    const submitData = {
      ...formData,
      previewImage: finalPreview,
      client: formData.client.trim() || 'Client',
      customClientId: formData.customClientId.trim() || (formData.clientId ? undefined : 'PORTFOLIO'),
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      techStack: formData.techStack ? formData.techStack.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
    };
    onSave(submitData);
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  const handleClientChange = (id: string) => {
    const selectedClient = clients.find((client) => client._id === id);
    setFormData((prev) => ({
      ...prev,
      clientId: id,
      customClientId: selectedClient?.customId || prev.customClientId,
      client: selectedClient?.name || prev.client,
      clientEmail: selectedClient?.email || prev.clientEmail,
      clientPhone: selectedClient?.phone || prev.clientPhone,
      clientCompany: selectedClient?.company || prev.clientCompany,
    }));
    if (errors.clientId || errors.client) {
      setErrors((prev) => ({ ...prev, clientId: '', client: '' }));
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} className="wsd-project-modal" onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Project Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              style={{ ...styles.input, ...(errors.name ? styles.inputError : {}) }}
              placeholder="e.g., E-commerce Website"
            />
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              style={{ ...styles.textarea, ...(errors.description ? styles.inputError : {}) }}
              placeholder="Brief description of the project"
              rows={3}
            />
            {errors.description && <p style={styles.errorText}>{errors.description}</p>}
          </div>

          <div style={styles.row} className="wsd-form-row">
            <div style={styles.formGroup}>
              <label style={styles.label}>Registered Client (Optional)</label>
              <select
                value={formData.clientId}
                onChange={(e) => handleClientChange(e.target.value)}
                style={styles.select}
              >
                <option value="">-- No registered client (Custom / Showcase) --</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.customId ? `[${client.customId}] ` : ''}{client.name}{client.company ? ` • ${client.company}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Client / Brand Name *</label>
              <input
                type="text"
                value={formData.client}
                onChange={(e) => updateField('client', e.target.value)}
                placeholder="e.g., Niyaj Enterprise or MZH Resin Art"
                style={{ ...styles.input, ...(errors.client ? styles.inputError : {}) }}
              />
              {errors.client && <p style={styles.errorText}>{errors.client}</p>}
            </div>
          </div>

          <div style={styles.clientSnapshot}>
            <div style={styles.clientSnapshotHeader}>
              <h3 style={styles.clientSnapshotTitle}>Client details</h3>
              <p style={styles.clientSnapshotHint}>Auto-populated from selected client or enter manually for portfolio items.</p>
            </div>
            <div style={styles.row} className="wsd-form-row">
              <div style={styles.formGroup}>
                <label style={styles.label}>Client ID</label>
                <input
                  type="text"
                  value={formData.customClientId}
                  onChange={(e) => updateField('customClientId', e.target.value)}
                  placeholder="e.g., CL-0001 or PORTFOLIO"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Company / Sector</label>
                <input
                  type="text"
                  value={formData.clientCompany}
                  onChange={(e) => updateField('clientCompany', e.target.value)}
                  placeholder="e.g., Artisan Luxury Leather Goods"
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Client Email</label>
                <input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => updateField('clientEmail', e.target.value)}
                  placeholder="contact@client.com"
                  style={styles.input}
                />
              </div>
            </div>
          </div>

          <div style={styles.row} className="wsd-form-row">
            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => updateField('status', e.target.value as ProjectStatus)}
                style={styles.select}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Assigned Developer</label>
              <select
                value={formData.assignedDevId}
                onChange={(e) => updateField('assignedDevId', e.target.value)}
                style={styles.select}
              >
                <option value="">Unassigned</option>
                {developers.map((developer) => (
                  <option key={developer._id} value={developer._id}>
                    {developer.name} ({developer.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.row} className="wsd-form-row">
            <div style={styles.formGroup}>
              <label style={styles.label}>Start Date *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => updateField('startDate', e.target.value)}
                style={{ ...styles.input, ...(errors.startDate ? styles.inputError : {}) }}
              />
              {errors.startDate && <p style={styles.errorText}>{errors.startDate}</p>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => updateField('priority', e.target.value as ProjectPriority)}
                style={styles.select}
              >
                {priorityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.row} className="wsd-form-row">
            <div style={styles.formGroup}>
              <label style={styles.label}>End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => updateField('endDate', e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Estimation Delivery Date *</label>
              <input
                type="date"
                value={formData.expectedCompletionDate}
                onChange={(e) => updateField('expectedCompletionDate', e.target.value)}
                style={{ ...styles.input, ...(errors.expectedCompletionDate ? styles.inputError : {}) }}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Budget ($)</label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => updateField('budget', e.target.value)}
                style={styles.input}
                placeholder="e.g., 5000"
              />
            </div>
          </div>

          {/* Hosted URL & Automated Preview */}
          <div style={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ ...styles.label, marginBottom: 0 }}>Hosted Project URL</label>
              {formData.publicUrl && (
                <button
                  type="button"
                  onClick={() => handleFetchWebsitePreview()}
                  disabled={isFetchingPreview}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    backgroundColor: 'rgba(37, 99, 235, 0.12)',
                    color: '#3b82f6',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                    cursor: isFetchingPreview ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Sparkles size={12} style={{ animation: isFetchingPreview ? 'spin 1s linear infinite' : 'none' }} />
                  {isFetchingPreview ? 'Fetching Preview...' : 'Auto-Capture Preview'}
                </button>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="url"
                value={formData.publicUrl}
                onChange={(e) => updateField('publicUrl', e.target.value)}
                onBlur={() => {
                  if (formData.publicUrl && !formData.previewImage) {
                    handleFetchWebsitePreview();
                  }
                }}
                style={styles.input}
                placeholder="https://example.com"
              />
            </div>
            {errors.publicUrl && <p style={styles.errorText}>{errors.publicUrl}</p>}
            {previewNotice && (
              <p style={{ margin: '6px 0 0 0', fontSize: '11.5px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={13} /> {previewNotice}
              </p>
            )}
          </div>

          {/* Preview Image & Live Preview Card */}
          <div style={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ ...styles.label, marginBottom: 0 }}>Project Preview Image URL</label>
              {formData.previewImage && (
                <button
                  type="button"
                  onClick={() => updateField('previewImage', '')}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '11px',
                    color: '#ef4444',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Clear preview
                </button>
              )}
            </div>
            <input
              type="text"
              value={formData.previewImage}
              onChange={(e) => updateField('previewImage', e.target.value)}
              style={{ ...styles.input, ...(errors.previewImage ? styles.inputError : {}) }}
              placeholder="/images/portfolio/marketplace_mockup.jpg or auto-generated screenshot"
            />
            {errors.previewImage && <p style={styles.errorText}>{errors.previewImage}</p>}

            {/* Visual Preview Card Box */}
            {formData.previewImage && (
              <div
                style={{
                  marginTop: '12px',
                  padding: '12px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ImageIcon size={13} /> Card Visual Preview:
                  </span>
                  {formData.previewImage.includes('s0.wp.com') ? (
                    <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 700 }}>
                      LIVE SCREENSHOT
                    </span>
                  ) : formData.previewImage.startsWith('http') ? (
                    <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', fontWeight: 700 }}>
                      WEB BANNER
                    </span>
                  ) : (
                    <span style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '4px', backgroundColor: 'rgba(148, 163, 184, 0.15)', color: '#94a3b8', fontWeight: 700 }}>
                      LOCAL MOCKUP
                    </span>
                  )}
                </div>

                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '170px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <img
                    src={formData.previewImage}
                    alt="Project card preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/websmith_original.jpg';
                    }}
                  />
                </div>

                {/* Switcher & Autofill Options */}
                {previewMeta && (
                  <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                    {previewMeta.screenshotUrl && formData.previewImage !== previewMeta.screenshotUrl && (
                      <button
                        type="button"
                        onClick={() => updateField('previewImage', previewMeta.screenshotUrl!)}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          color: '#e2e8f0',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          cursor: 'pointer',
                        }}
                      >
                        Switch to Screenshot
                      </button>
                    )}
                    {previewMeta.ogImage && formData.previewImage !== previewMeta.ogImage && (
                      <button
                        type="button"
                        onClick={() => updateField('previewImage', previewMeta.ogImage!)}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(255, 255, 255, 0.06)',
                          color: '#e2e8f0',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          cursor: 'pointer',
                        }}
                      >
                        Switch to Website Banner
                      </button>
                    )}
                    {previewMeta.title && (!formData.name || formData.name === 'New Project') && (
                      <button
                        type="button"
                        onClick={() => {
                          updateField('name', previewMeta.title);
                          if (previewMeta.description && !formData.description) {
                            updateField('description', previewMeta.description);
                          }
                        }}
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'rgba(59, 130, 246, 0.15)',
                          color: '#60a5fa',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          cursor: 'pointer',
                        }}
                      >
                        Apply Title &amp; Description
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Portfolio & Showcase Details */}
          <div style={{ marginTop: '16px', marginBottom: '16px', padding: '16px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#3b82f6' }}>
              Public Portfolio Showcase Fields
            </h4>
            
            <div style={styles.row} className="wsd-form-row">
              <div style={styles.formGroup}>
                <label style={styles.label}>Portfolio Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  style={styles.select}
                >
                  <option value="Home & Commercial Services">Home & Commercial Services</option>
                  <option value="Startups & SMBs">Startups & SMBs</option>
                  <option value="E-Commerce & Retail">E-Commerce & Retail</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Education">Education</option>
                  <option value="Logistics">Logistics</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Restaurants & Hospitality">Restaurants & Hospitality</option>
                  <option value="Professional Services">Professional Services</option>
                  <option value="Web Apps">Web Apps</option>
                  <option value="Mobile Apps">Mobile Apps</option>
                  <option value="Enterprise ERP">Enterprise ERP</option>
                  <option value="Cloud & APIs">Cloud & APIs</option>
                  <option value="FinTech">FinTech</option>
                  <option value="AI">AI</option>
                  <option value="SaaS">SaaS</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Results / Metrics Highlight</label>
                <input
                  type="text"
                  value={formData.metrics}
                  onChange={(e) => updateField('metrics', e.target.value)}
                  style={styles.input}
                  placeholder="e.g. Reduced inventory discrepancy by 94%"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Tech Stack (comma-separated)</label>
              <input
                type="text"
                value={formData.techStack}
                onChange={(e) => updateField('techStack', e.target.value)}
                style={styles.input}
                placeholder="Next.js 16, PostgreSQL, Tailwind CSS, Redis"
              />
            </div>

            <div style={styles.row} className="wsd-form-row">
              <div style={styles.formGroup}>
                <label style={styles.label}>Challenge</label>
                <textarea
                  rows={2}
                  value={formData.challenge}
                  onChange={(e) => updateField('challenge', e.target.value)}
                  style={{ ...styles.input, height: 'auto', minHeight: '60px' }}
                  placeholder="The primary business/technical challenge..."
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Solution</label>
                <textarea
                  rows={2}
                  value={formData.solution}
                  onChange={(e) => updateField('solution', e.target.value)}
                  style={{ ...styles.input, height: 'auto', minHeight: '60px' }}
                  placeholder="How Websmith engineered the solution..."
                />
              </div>
            </div>

            <label style={{ ...styles.label, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))} />
              Featured Project (Highlighted in Portfolio)
            </label>
          </div>

          <label style={{ ...styles.label, display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <input type="checkbox" checked={formData.published} onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))} />
            Publish this project on the public website
          </label>

          <div style={styles.modalFooter}>
            <button type="button" onClick={onClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" style={styles.saveBtn}>Save Project</button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @media (max-width: 640px) {
          .wsd-project-modal {
            width: calc(100vw - 24px) !important;
            max-height: calc(100vh - 24px) !important;
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '24px',
    padding: '28px',
    width: 'min(90%, 600px)',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflowY: 'auto',
    animation: 'modalFadeIn 0.3s ease',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#8E8E93',
    padding: '4px',
  },
  formGroup: {
    marginBottom: '20px',
    flex: 1,
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '1.5px solid var(--border-color)',
    borderRadius: '12px',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '1.5px solid var(--border-color)',
    borderRadius: '12px',
    outline: 'none',
    fontFamily: 'inherit',
    resize: 'vertical',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '1.5px solid var(--border-color)',
    borderRadius: '12px',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: '12px',
    color: '#FF3B30',
    marginTop: '6px',
  },
  clientSnapshot: {
    marginBottom: '20px',
    padding: '18px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 92%, #ffffff 8%)',
  },
  clientSnapshotHeader: {
    marginBottom: '14px',
  },
  clientSnapshotTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  clientSnapshotHint: {
    margin: '6px 0 0 0',
    fontSize: '12px',
    color: 'var(--text-secondary)',
  },
  readOnlyInput: {
    opacity: 0.9,
    cursor: 'not-allowed',
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  modalFooter: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
    paddingTop: '16px',
    borderTop: '1px solid var(--border-color)',
  },
  cancelBtn: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: 'var(--bg-secondary)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    color: 'var(--text-primary)',
  },
  saveBtn: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: 600,
    backgroundColor: '#007AFF',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
};
