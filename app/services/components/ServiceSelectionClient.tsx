// C:\websmith\app\services\components\ServiceSelectionClient.tsx
// Features: List available services, select/deselect, navigate to lead form

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Layers3, ArrowRight } from "lucide-react";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { getPublicServices, PublicService } from "../../../core/services/leadService";
import { useLeadFunnel } from "../../providers/LeadFunnelProvider";

type ServiceSelectionClientProps = {
  variant?: "page" | "modal" | "wizard";
  onRequestClose?: () => void;
  /** When `variant` is `wizard`, continue stays inside the parent modal (no navigation). */
  onWizardContinue?: () => void;
};

export default function ServiceSelectionClient(props?: ServiceSelectionClientProps) {
  const { variant = "page", onRequestClose, onWizardContinue } = props ?? {};
  const router = useRouter();
  const { selectedServices, toggleService, setSelectedServices } = useLeadFunnel();
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getPublicServices();
        setServices(data);
        const nextSelectedServices = selectedServices
          .map((selected) => {
            const matched = data.find(
              (service) =>
                service.id === selected.id ||
                service.name.toLowerCase() === selected.name.toLowerCase()
            );
            return matched ? { id: matched.id, name: matched.name } : selected;
          })
          .filter((selectedService) =>
            data.some(
              (service) =>
                service.id === selectedService.id ||
                service.name.toLowerCase() === selectedService.name.toLowerCase()
            )
          );

        const hasSelectionChanged =
          nextSelectedServices.length !== selectedServices.length ||
          nextSelectedServices.some((service, index) => service.id !== selectedServices[index]?.id);

        if (hasSelectionChanged) {
          setSelectedServices(nextSelectedServices);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedServices, setSelectedServices]);

  const isModal = variant === "modal" || variant === "wizard";
  const wrapperStyle = isModal
    ? { ...styles.wrapper, ...styles.wrapperModal }
    : styles.wrapper;

  return (
    <div style={wrapperStyle}>
      <div className={isModal ? "lead-modal-hero-card" : undefined} style={isModal ? { ...styles.heroCard, ...styles.heroCardModal } : styles.heroCard}>
        <p className={isModal ? "lead-modal-eyebrow" : undefined} style={isModal ? { ...styles.eyebrow, ...styles.eyebrowModal } : styles.eyebrow}>Step 1 of 3</p>
        <h1 className={isModal ? "lead-modal-title" : undefined} style={isModal ? { ...styles.title, ...styles.titleModal } : styles.title}>Choose the services you want help with</h1>
        <p className={isModal ? "lead-modal-subtitle" : undefined} style={isModal ? { ...styles.subtitle, ...styles.subtitleModal } : styles.subtitle}>
          Select one or more services. We&apos;ll use them to personalize the next step and qualify your lead properly.
        </p>
      </div>

      {loading && (
        <div style={styles.messageCard}>
          <div style={styles.spinner}></div>
          <p style={styles.message}>Loading available services...</p>
        </div>
      )}
      
      {error && (
        <div style={{ ...styles.messageCard, borderLeft: '6px solid #FF3B30' }}>
          <p style={{ ...styles.message, color: "#FF3B30", fontWeight: 700 }}>{error}</p>
        </div>
      )}

      {!loading && !error && services.length === 0 && (
        <div style={styles.messageCard}>
          <p style={styles.message}>No services are currently available. Please check back later.</p>
        </div>
      )}

      {!loading && !error && services.length > 0 && (
        <>
          <div className={isModal ? "lead-modal-grid" : undefined} style={isModal ? { ...styles.grid, ...styles.gridModal } : styles.grid}>
            {services.map((service) => {
              const selected = selectedServices.some(
                (item) => item.id === service.id || item.name.toLowerCase() === service.name.toLowerCase()
              );

              return (
                <button
                  key={service.id}
                  type="button"
                  className="lead-modal-service-btn"
                  onClick={() => toggleService({ id: service.id, name: service.name })}
                  style={{
                    ...styles.serviceButton,
                    ...(isModal ? styles.serviceButtonModal : {}),
                    ...(selected ? styles.serviceButtonSelected : {}),
                  }}
                >
                  <div
                    className="lead-modal-compact-card"
                    style={{
                      padding: isModal ? "12px 14px" : "20px",
                      borderRadius: isModal ? "14px" : "20px",
                      borderColor: selected ? "#007AFF" : "var(--border-color)",
                      backgroundColor: selected ? "rgba(0, 122, 255, 0.05)" : "var(--bg-primary)",
                      boxShadow: selected ? "0 8px 24px rgba(0,122,255,0.12)" : "0 2px 8px rgba(0,0,0,0.02)",
                      borderWidth: "1.5px",
                      borderStyle: "solid",
                      transition: "border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div className="lead-modal-card-top" style={isModal ? { ...styles.cardTop, marginBottom: "8px" } : styles.cardTop}>
                      <div className="lead-modal-icon-wrap" style={{
                        ...(isModal ? styles.iconWrapModal : styles.iconWrap),
                        background: selected ? "linear-gradient(135deg, #007AFF 0%, #34C759 100%)" : "var(--bg-secondary)",
                        border: selected ? "none" : "1px solid var(--border-color)"
                      }}>
                        <Layers3 size={isModal ? 15 : 18} color={selected ? "#FFFFFF" : "#007AFF"} />
                      </div>
                      <CheckCircle2 className="lead-modal-check-icon" size={isModal ? 18 : 20} color={selected ? "#34C759" : "var(--border-color)"} fill={selected ? "#34C75922" : "transparent"} />
                    </div>
                    <h3 className="lead-modal-service-title" style={isModal ? { ...styles.serviceTitle, fontSize: "14.5px", marginBottom: "4px" } : styles.serviceTitle}>{service.name}</h3>
                    <p className="lead-modal-service-desc" style={isModal ? { ...styles.serviceDescription, fontSize: "12px", lineHeight: 1.35, minHeight: "32px" } : styles.serviceDescription}>{service.description}</p>

                    {service.subServices && service.subServices.length > 0 && (
                      <div className="lead-modal-subservices-wrap" style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: isModal ? "8px" : "12px" }}>
                        {service.subServices.slice(0, 3).map((sub, sIdx) => (
                          <span
                            key={sub.id || sIdx}
                            className="lead-modal-subservice-pill"
                            style={{
                              fontSize: isModal ? "10px" : "11px",
                              fontWeight: 600,
                              padding: isModal ? "2px 6px" : "3px 8px",
                              borderRadius: "6px",
                              backgroundColor: selected ? "rgba(0, 122, 255, 0.1)" : "var(--bg-secondary)",
                              color: selected ? "#007AFF" : "var(--text-secondary)",
                              border: "1px solid var(--border-color)",
                            }}
                          >
                            {sub.name}
                          </span>
                        ))}
                        {service.subServices.length > 3 && (
                          <span
                            className="lead-modal-subservice-pill-more"
                            style={{
                              fontSize: "10px",
                              fontWeight: 600,
                              padding: "2px 4px",
                              color: "var(--text-secondary)",
                            }}
                          >
                            +{service.subServices.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className={isModal ? "lead-modal-footer-card" : undefined} style={isModal ? { ...styles.footerCard, ...styles.footerCardModal } : styles.footerCard}>
            <div style={styles.footerInfo} className="lead-modal-footer-info">
              <p className="lead-modal-footer-label" style={isModal ? { ...styles.footerLabel, margin: "0 0 6px", fontSize: "11px" } : styles.footerLabel}>Selected Services</p>
              <div style={styles.selectedList} className="lead-modal-selected-list">
                {selectedServices.length > 0 ? (
                  selectedServices.map((service) => (
                    <span key={service.id} className="lead-modal-selected-chip" style={isModal ? { ...styles.selectedChip, padding: "5px 12px", fontSize: "12px", borderRadius: "10px" } : styles.selectedChip}>{service.name}</span>
                  ))
                ) : (
                  <span style={styles.emptyText} className="lead-modal-empty-text">Select one or more services to proceed to the next step.</span>
                )}
              </div>
            </div>

            <Button
              size={isModal ? "md" : "lg"}
              className="lead-modal-continue-btn"
              onClick={() => {
                if (selectedServices.length === 0) return;
                if (variant === "wizard" && onWizardContinue) {
                  onWizardContinue();
                  return;
                }
                router.push("/lead-form");
                onRequestClose?.();
              }}
              disabled={selectedServices.length === 0}
              rightIcon={<ArrowRight size={isModal ? 16 : 20} />}
              style={isModal ? { padding: '0 24px', height: '42px', borderRadius: '12px', fontSize: '14px', fontWeight: 600 } : { padding: '0 36px', height: '58px', borderRadius: '16px', fontSize: '16px', fontWeight: 700 }}
            >
              Continue to Details
            </Button>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 640px) {
          .lead-modal-hero-card {
            padding: 8px 10px !important;
            border-radius: 10px !important;
            margin-bottom: 6px !important;
          }
          .lead-modal-eyebrow {
            font-size: 9.5px !important;
            margin-bottom: 2px !important;
            letter-spacing: 0.08em !important;
          }
          .lead-modal-title {
            font-size: 13.5px !important;
            line-height: 1.25 !important;
            margin-bottom: 2px !important;
          }
          .lead-modal-subtitle {
            font-size: 10.5px !important;
            line-height: 1.3 !important;
          }
          .lead-modal-grid {
            gap: 6px !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .lead-modal-service-btn {
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
          }
          .lead-modal-compact-card {
            padding: 8px 8px !important;
            border-radius: 10px !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            height: 100% !important;
            box-sizing: border-box !important;
          }
          .lead-modal-card-top {
            margin-bottom: 3px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
          }
          .lead-modal-icon-wrap {
            width: 22px !important;
            height: 22px !important;
            border-radius: 5px !important;
            flex-shrink: 0 !important;
          }
          .lead-modal-icon-wrap svg {
            width: 12px !important;
            height: 12px !important;
          }
          .lead-modal-check-icon {
            width: 15px !important;
            height: 15px !important;
            flex-shrink: 0 !important;
          }
          .lead-modal-service-title {
            font-size: 11.5px !important;
            line-height: 1.25 !important;
            margin-bottom: 2px !important;
            font-weight: 600 !important;
            min-height: 28px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }
          .lead-modal-service-desc {
            font-size: 9.5px !important;
            line-height: 1.25 !important;
            min-height: auto !important;
            margin-bottom: 3px !important;
            display: -webkit-box !important;
            -webkit-line-clamp: 2 !important;
            -webkit-box-orient: vertical !important;
            overflow: hidden !important;
          }
          .lead-modal-subservices-wrap {
            gap: 2px !important;
            margin-top: 3px !important;
          }
          .lead-modal-subservice-pill {
            font-size: 8px !important;
            padding: 1px 4px !important;
            border-radius: 3px !important;
            line-height: 1.15 !important;
            max-width: 100% !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            display: inline-block !important;
          }
          .lead-modal-subservice-pill-more {
            font-size: 8px !important;
            padding: 1px 2px !important;
          }
          @media (max-width: 400px) {
            .lead-modal-grid {
              gap: 4px !important;
            }
            .lead-modal-compact-card {
              padding: 7px 6px !important;
            }
            .lead-modal-service-title {
              font-size: 11px !important;
            }
            .lead-modal-service-desc {
              font-size: 9px !important;
            }
          }
          .lead-modal-footer-card {
            padding: 8px 10px !important;
            gap: 8px !important;
            border-radius: 10px !important;
            margin-top: 6px !important;
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .lead-modal-footer-info {
            min-width: 0 !important;
          }
          .lead-modal-footer-label {
            font-size: 9.5px !important;
            margin-bottom: 3px !important;
          }
          .lead-modal-selected-list {
            gap: 4px !important;
          }
          .lead-modal-selected-chip {
            padding: 2px 7px !important;
            font-size: 10.5px !important;
            border-radius: 6px !important;
          }
          .lead-modal-empty-text {
            font-size: 11px !important;
          }
          .lead-modal-continue-btn {
            height: 36px !important;
            font-size: 13px !important;
            padding: 0 16px !important;
            border-radius: 8px !important;
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}

const styles: any = {
  wrapper: {
    maxWidth: "100%",
    margin: "0",
    padding: "var(--space-section) var(--space-page-x) 80px",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    backgroundColor: 'var(--bg-primary)',
    color: 'var(--text-primary)',
  },
  wrapperModal: {
    padding: "0 0 4px",
    gap: "10px",
    backgroundColor: "transparent",
  },
  heroCard: {
    padding: "28px 32px",
    maxWidth: "100%",
    margin: "0",
    width: "100%",
    borderRadius: "24px",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
  },
  heroCardModal: {
    padding: "12px 16px",
    borderRadius: "14px",
  },
  eyebrow: {
    margin: "0 0 12px 0",
    color: "#007AFF",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  eyebrowModal: {
    margin: "0 0 4px 0",
    fontSize: "11px",
  },
  title: {
    margin: "0 0 12px",
    fontSize: "28px",
    fontWeight: 700,
    color: "var(--text-primary)",
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  },
  titleModal: {
    margin: "0 0 4px",
    fontSize: "17px",
    letterSpacing: "-0.01em",
  },
  subtitle: {
    margin: 0,
    maxWidth: "840px",
    color: "var(--text-secondary)",
    fontSize: "15px",
    lineHeight: 1.5,
    fontWeight: 500,
  },
  subtitleModal: {
    fontSize: "12.5px",
    lineHeight: 1.4,
  },
  messageCard: {
    padding: "64px",
    borderRadius: "28px",
    backgroundColor: 'var(--bg-secondary)',
    border: "1.5px solid var(--border-color)",
    textAlign: "center",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid var(--border-color)',
    borderTopColor: '#007AFF',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  message: {
    margin: 0,
    fontSize: "17px",
    fontWeight: 500,
    color: "var(--text-secondary)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  gridModal: {
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "10px",
  },
  serviceButton: {
    background: "transparent",
    border: "none",
    padding: 0,
    textAlign: "left",
    cursor: "pointer",
    borderRadius: "16px",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    transform: "none !important",
  },
  serviceButtonModal: {
    borderRadius: "14px",
    transform: "none !important",
  },
  serviceButtonSelected: {},
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: '16px',
  },
  iconWrap: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapModal: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  serviceTitle: {
    margin: "0 0 8px",
    fontSize: "18px",
    fontWeight: 700,
    color: "var(--text-primary)",
    letterSpacing: '-0.3px',
  },
  serviceDescription: {
    margin: 0,
    fontSize: "14px",
    color: "var(--text-secondary)",
    lineHeight: 1.5,
    minHeight: "60px",
  },
  price: {
    margin: "24px 0 0",
    color: "#007AFF",
    fontSize: "15px",
    fontWeight: 800,
    letterSpacing: '-0.2px',
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px'
  },
  footerCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "32px",
    padding: "36px 40px",
    backgroundColor: "var(--bg-primary)",
    border: "1.5px solid var(--border-color)",
    borderRadius: "28px",
    boxShadow: "0 18px 48px rgba(0,0,0,0.12)",
    flexWrap: "wrap",
    position: 'sticky',
    bottom: '32px',
    zIndex: 100,
    backdropFilter: 'blur(20px)',
  },
  footerCardModal: {
    position: "static",
    bottom: "auto",
    padding: "10px 14px",
    marginTop: "4px",
    backdropFilter: "none",
    boxShadow: "none",
    borderRadius: "14px",
    gap: "12px",
  },
  footerInfo: {
    flex: 1,
    minWidth: '240px',
  },
  footerLabel: {
    margin: "0 0 16px",
    fontSize: "13px",
    fontWeight: 800,
    color: "var(--text-secondary)",
    textTransform: "uppercase",
    letterSpacing: "0.15em",
  },
  selectedList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },
  selectedChip: {
    padding: "10px 20px",
    borderRadius: "14px",
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    color: "#007AFF",
    fontSize: "14px",
    fontWeight: 700,
    border: '1.5px solid rgba(0, 122, 255, 0.15)',
  },
  emptyText: {
    color: "var(--text-secondary)",
    fontSize: "15px",
    fontStyle: 'italic',
    fontWeight: 500,
  },
};
