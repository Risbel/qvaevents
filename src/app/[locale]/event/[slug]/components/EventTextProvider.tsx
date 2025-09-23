"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface EventText {
  id: number;
  title: string;
  description: string;
  locationText: string | null;
  languageId: number;
  Language: {
    id: number;
    code: string;
    icon: string | null;
    name: string;
    native: string;
  };
}

interface EventTextContextType {
  currentText: EventText | null;
  availableTexts: EventText[];
  setCurrentLanguageId: (languageId: number) => void;
  currentLanguage: EventText["Language"] | null;
}

const EventTextContext = createContext<EventTextContextType | undefined>(undefined);

interface EventTextProviderProps {
  children: ReactNode;
  eventTexts: EventText[];
  defaultLocale: string | null;
}

export function EventTextProvider({ children, eventTexts, defaultLocale }: EventTextProviderProps) {
  // Initialize with default locale or first available text
  const getInitialLanguageId = () => {
    if (eventTexts.length === 0) return null;

    // Try to find text matching the default locale
    if (defaultLocale) {
      const defaultText = eventTexts.find((text) => text.Language.code === defaultLocale);
      if (defaultText) return defaultText.languageId;
    }

    // Fallback to first text
    return eventTexts[0].languageId;
  };

  const [currentLanguageId, setCurrentLanguageId] = useState<number | null>(getInitialLanguageId());

  // Get current text based on selected language
  const currentText = eventTexts.find((text) => text.languageId === currentLanguageId) || null;

  // Get current language info
  const currentLanguage = currentText?.Language || null;

  // Update current language when defaultLocale changes
  useEffect(() => {
    setCurrentLanguageId(getInitialLanguageId());
  }, [defaultLocale, eventTexts]);

  const value: EventTextContextType = {
    currentText,
    availableTexts: eventTexts,
    setCurrentLanguageId,
    currentLanguage,
  };

  return <EventTextContext.Provider value={value}>{children}</EventTextContext.Provider>;
}

export function useEventText() {
  const context = useContext(EventTextContext);
  if (context === undefined) {
    throw new Error("useEventText must be used within an EventTextProvider");
  }
  return context;
}
