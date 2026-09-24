"use client";

import { CheckCircle2, ArrowLeft } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useLeadFunnel } from "../../app/providers/LeadFunnelProvider";
import ServiceSelectionClient from "../../app/services/components/ServiceSelectionClient";
import LeadFormClient from "../../app/lead-form/components/LeadFormClient";

type LeadFunnelWizardModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LeadFunnelWizardModal({ isOpen, onClose }: LeadFunnelWizardModalProps) {
  const { leadWizardStep, setLeadWizardStep } = useLeadFunnel();

  const title =
    leadWizardStep === "services"
      ? "Get started with Websmith"
      : leadWizardStep === "details"
        ? "Tell us about your project"
        : "You're all set";

  const headerAction =
    leadWizardStep === "details" ? (
      <button
        type="button"
        onClick={() => setLeadWizardStep("services")}
        className="wsd-modal-back-btn"
        aria-label="Back to services"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "5px 12px",
          borderRadius: "8px",
          fontSize: "12.5px",
          fontWeight: 500,
          color: "var(--text-secondary)",
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          cursor: "pointer",
          transition: "all 0.15s ease",
          whiteSpace: "nowrap",
        }}
      >
        <ArrowLeft size={14} />
        <span className="wsd-modal-back-text">Back to services</span>
      </button>
    ) : undefined;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      headerAction={headerAction}
      maxWidth={leadWizardStep === "details" ? "920px" : "960px"}
      footer={
        leadWizardStep === "success" ? (
          <Button onClick={onClose}>Close</Button>
        ) : undefined
      }
    >
      <div className="lead-funnel-wizard-content" style={{ width: "100%" }}>
        {leadWizardStep === "services" && (
          <ServiceSelectionClient variant="wizard" onWizardContinue={() => setLeadWizardStep("details")} />
        )}
        {leadWizardStep === "details" && (
          <LeadFormClient
            variant="wizard"
            onSuccess={() => setLeadWizardStep("success")}
          />
        )}
        {leadWizardStep === "success" && (
          <div style={{ textAlign: "center", padding: "24px 8px 16px" }}>
            <CheckCircle2 size={56} color="#34C759" style={{ marginBottom: "16px" }} aria-hidden />
            <h3 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
              Thank You! Your Request Has Been Received.
            </h3>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.65, fontSize: "14px", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
              We have sent a confirmation email with your project summary and a direct two-way live chat link. Our agency team will review your consultation schedule shortly.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
