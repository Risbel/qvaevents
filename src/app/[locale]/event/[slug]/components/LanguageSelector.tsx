"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Languages } from "lucide-react";
import { useEventText } from "./EventTextProvider";

export function LanguageSelector() {
  const { currentLanguage, availableTexts, setCurrentLanguageId } = useEventText();

  const handleLanguageChange = (newLanguageId: string) => {
    setCurrentLanguageId(parseInt(newLanguageId));
  };

  // Don't show selector if there's only one language or no languages
  if (!availableTexts || availableTexts.length <= 1) {
    return null;
  }

  // Don't show selector if no current language is selected
  if (!currentLanguage) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-muted-foreground" />
      <Select value={currentLanguage.id.toString()} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-auto min-w-[120px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              <span>{currentLanguage.icon || "🌐"}</span>
              <span>{currentLanguage.native}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {availableTexts.map((text) => (
            <SelectItem key={text.languageId} value={text.languageId.toString()}>
              <div className="flex items-center gap-2">
                <span>{text.Language.icon || "🌐"}</span>
                <span>{text.Language.native}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
