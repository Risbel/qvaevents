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

interface EventConfigContextType {
  config: EventConfig;
  updateConfig: (updates: Partial<EventConfig>) => void;
  buildUrl: () => string;
  resetConfig: () => void;
}

const EventConfigContext = createContext<EventConfigContextType | undefined>(undefined);

const initialConfig: EventConfig = {
  selectedLanguages: [],
  isPublic: true,
};

export const EventConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<EventConfig>(initialConfig);

  const updateConfig = (updates: Partial<EventConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig(initialConfig);
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
    resetConfig,
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
