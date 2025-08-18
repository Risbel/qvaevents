"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface EventConfig {
  type?: string;
  subType?: string;
  customSubType?: string;
  isForMinors?: string;
  isPublic?: boolean;
  spaceType?: string;
  accessType?: string;
  selectedLanguages: string[];
  savedConfigId?: string;
}

interface SavedConfig {
  id: string;
  name: string;
  type: string;
  subType: string;
  customSubType: string;
  isForMinors: string;
  isPublic: boolean;
  spaceType: string;
  accessType: string;
  selectedLanguages: string[];
}

interface EventConfigContextType {
  config: EventConfig;
  updateConfig: (updates: Partial<EventConfig>) => void;
  buildUrl: () => string;
  loadSavedConfig: (configId: string) => void;
  resetConfig: () => void;
  getSavedConfigs: () => SavedConfig[];
}

const EventConfigContext = createContext<EventConfigContextType | undefined>(undefined);

const savedConfigurations: SavedConfig[] = [
  {
    id: "1",
    name: "Party Club Nocturno",
    type: "party",
    subType: "nightClub",
    customSubType: "",
    isForMinors: "no",
    isPublic: true,
    spaceType: "mixed",
    accessType: "ticketsAndSpaces",
    selectedLanguages: ["es"],
  },
  {
    id: "2",
    name: "Conierto",
    type: "art",
    subType: "concert",
    customSubType: "",
    isForMinors: "no",
    isPublic: true,
    spaceType: "outdoors",
    accessType: "ticketsAndSpaces",
    selectedLanguages: ["es"],
  },
  {
    id: "3",
    name: "Taller de Cocina",
    type: "educational",
    subType: "workshop",
    customSubType: "",
    isForMinors: "yes",
    isPublic: false,
    spaceType: "indoor",
    accessType: "confirmations",
    selectedLanguages: ["es"],
  },
  {
    id: "4",
    name: "Art Exhibition",
    type: "art",
    subType: "gallery",
    customSubType: "",
    isForMinors: "yes",
    isPublic: true,
    spaceType: "indoor",
    accessType: "tickets",
    selectedLanguages: ["es", "en"],
  },
  {
    id: "5",
    name: "Excursion",
    type: "excursion",
    subType: "playa",
    customSubType: "",
    isForMinors: "yes",
    isPublic: false,
    spaceType: "outdoors",
    accessType: "seat",
    selectedLanguages: ["es"],
  },
];

const initialConfig: EventConfig = {
  selectedLanguages: [],
  isPublic: true,
};

export const EventConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<EventConfig>(initialConfig);

  const updateConfig = (updates: Partial<EventConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const loadSavedConfig = (configId: string) => {
    const savedConfig = savedConfigurations.find((config) => config.id === configId);
    if (savedConfig) {
      setConfig({
        ...savedConfig,
        savedConfigId: configId,
      });
    }
  };

  const resetConfig = () => {
    setConfig(initialConfig);
  };

  const getSavedConfigs = (): SavedConfig[] => {
    return savedConfigurations;
  };

  const buildUrl = (): string => {
    const params = new URLSearchParams();

    // Add all non-empty values to URL params
    if (config.type) params.set("type", config.type);

    // Handle subtype vs custom subtype - only include one
    if (config.customSubType && config.customSubType !== "") {
      // If we have a custom subtype, use that
      params.set("customSubType", config.customSubType);
    } else if (config.subType && config.subType !== "" && config.subType !== "other") {
      // If we have a regular subtype (not "other"), use that
      params.set("subType", config.subType);
    }

    if (config.isForMinors) params.set("isForMinors", config.isForMinors);
    if (config.isPublic) params.set("isPublic", config.isPublic.toString());
    if (config.spaceType) params.set("spaceType", config.spaceType);
    if (config.accessType) params.set("accessType", config.accessType);
    if (config.selectedLanguages.length > 0) {
      params.set("languages", config.selectedLanguages.join(","));
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  const value: EventConfigContextType = {
    config,
    updateConfig,
    buildUrl,
    loadSavedConfig,
    resetConfig,
    getSavedConfigs,
  };

  return <EventConfigContext.Provider value={value}>{children}</EventConfigContext.Provider>;
};

export const useEventConfig = (): EventConfigContextType => {
  const context = useContext(EventConfigContext);
  if (context === undefined) {
    throw new Error("useEventConfig must be used within an EventConfigProvider");
  }
  return context;
};
