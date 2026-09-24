"use client";

import { createContext, useContext, useMemo, useState } from "react";
import LeadFunnelWizardModal from "../../components/lead-funnel/LeadFunnelWizardModal";

export interface SelectedLeadService {
  id: string;
  name: string;
}

export type InitialLeadServiceInput = SelectedLeadService | SelectedLeadService[] | string | string[];

export interface OpenLeadFunnelOptions {
  service?: InitialLeadServiceInput;
  initialStep?: LeadWizardStep;
}

export type OpenLeadModalParam = InitialLeadServiceInput | OpenLeadFunnelOptions;

export type LeadWizardStep = "services" | "details" | "success";

interface LeadFunnelContextValue {
  selectedServices: SelectedLeadService[];
  setSelectedServices: (services: SelectedLeadService[]) => void;
  toggleService: (service: SelectedLeadService) => void;
  clearSelectedServices: () => void;
  leadServicesModalOpen: boolean;
  leadWizardStep: LeadWizardStep;
  setLeadWizardStep: (step: LeadWizardStep) => void;
  openLeadServicesModal: (param?: OpenLeadModalParam) => void;
  closeLeadServicesModal: () => void;
}

const LeadFunnelContext = createContext<LeadFunnelContextValue | undefined>(undefined);

const STORAGE_KEY = "wsd_lead_selected_services";

const getInitialServices = (): SelectedLeadService[] => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    sessionStorage.removeItem(STORAGE_KEY);
    return [];
  }
};

export function LeadFunnelProvider({ children }: { children: React.ReactNode }) {
  const [selectedServices, setSelectedServicesState] = useState<SelectedLeadService[]>(getInitialServices);
  const [leadServicesModalOpen, setLeadServicesModalOpen] = useState(false);
  const [leadWizardStep, setLeadWizardStep] = useState<LeadWizardStep>("services");

  const persist = (services: SelectedLeadService[]) => {
    setSelectedServicesState(services);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    }
  };

  const toggleService = (service: SelectedLeadService) => {
    const exists = selectedServices.some(
      (item) => item.id === service.id || item.name.toLowerCase() === service.name.toLowerCase()
    );
    persist(
      exists
        ? selectedServices.filter(
            (item) => item.id !== service.id && item.name.toLowerCase() !== service.name.toLowerCase()
          )
        : [...selectedServices, service]
    );
  };

  const clearSelectedServices = () => {
    persist([]);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo(
    () => ({
      selectedServices,
      setSelectedServices: persist,
      toggleService,
      clearSelectedServices,
      leadServicesModalOpen,
      leadWizardStep,
      setLeadWizardStep,
      openLeadServicesModal: (param?: OpenLeadModalParam) => {
        let targetService: InitialLeadServiceInput | undefined;
        let targetStep: LeadWizardStep = "services";

        if (param) {
          const isOptions =
            typeof param === "object" &&
            param !== null &&
            !Array.isArray(param) &&
            ("service" in param || "initialStep" in param);

          if (isOptions) {
            const opts = param as OpenLeadFunnelOptions;
            targetService = opts.service;
            targetStep = opts.initialStep || (opts.service ? "details" : "services");
          } else {
            targetService = param as InitialLeadServiceInput;
            targetStep = "details";
          }
        }

        if (targetService) {
          if (typeof targetService === "string") {
            persist([{ id: targetService.toLowerCase().replace(/\s+/g, "-"), name: targetService }]);
          } else if (Array.isArray(targetService)) {
            const formatted = targetService.map((item) =>
              typeof item === "string"
                ? { id: item.toLowerCase().replace(/\s+/g, "-"), name: item }
                : item
            );
            persist(formatted);
          } else {
            persist([targetService]);
          }
        }

        setLeadWizardStep(targetStep);
        setLeadServicesModalOpen(true);
      },
      closeLeadServicesModal: () => {
        setLeadServicesModalOpen(false);
        setLeadWizardStep("services");
      },
    }),
    [selectedServices, leadServicesModalOpen, leadWizardStep]
  );

  return (
    <LeadFunnelContext.Provider value={value}>
      {children}
      <LeadFunnelWizardModal
        isOpen={leadServicesModalOpen}
        onClose={() => {
          setLeadServicesModalOpen(false);
          setLeadWizardStep("services");
        }}
      />
    </LeadFunnelContext.Provider>
  );
}

export function useLeadFunnel() {
  const context = useContext(LeadFunnelContext);

  if (!context) {
    throw new Error("useLeadFunnel must be used within LeadFunnelProvider");
  }

  return context;
}
