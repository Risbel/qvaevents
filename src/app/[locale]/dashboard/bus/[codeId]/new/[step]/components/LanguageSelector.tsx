"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Language } from "@/queries/language/getLanguages";
import { useTranslations } from "next-intl";

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguages: number[];
  onLanguageChange: (languageIds: number[]) => void;
}

export const LanguageSelector = ({ languages, selectedLanguages, onLanguageChange }: LanguageSelectorProps) => {
  const t = useTranslations("EventCreation");

  const handleLanguageSelect = (languageId: string) => {
    const id = parseInt(languageId);
    onLanguageChange([id]); // Only select one language as default
  };

  return (
    <RadioGroup
      value={selectedLanguages.length > 0 ? selectedLanguages[0].toString() : ""}
      onValueChange={handleLanguageSelect}
      className="flex flex-wrap gap-2"
    >
      {languages.map((language) => (
        <div key={language.id} className="flex items-center space-x-2">
          <RadioGroupItem value={language.id.toString()} id={`language-${language.id}`} className="cursor-pointer" />
          <Label htmlFor={`language-${language.id}`} className="cursor-pointer text-sm">
            <Badge
              variant={selectedLanguages.includes(language.id) ? "default" : "outline"}
              className="hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <span className="mr-1">{language.icon || "🌐"}</span>
              {language.native} ({language.name})
            </Badge>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};
