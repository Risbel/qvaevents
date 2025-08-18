"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useEventConfig } from "./EventConfigProvider";
import { useTranslations } from "next-intl";

const languages = [
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "en", name: "English", flag: "🇺🇸" },
  // { code: "fr", name: "Français", flag: "🇫🇷" },
  // { code: "de", name: "Deutsch", flag: "🇩🇪" },
  // { code: "it", name: "Italiano", flag: "🇮🇹" },
  // { code: "pt", name: "Português", flag: "🇵🇹" },
  // { code: "ru", name: "Русский", flag: "🇷🇺" },
  // { code: "zh", name: "中文", flag: "🇨🇳" },
  // { code: "ja", name: "日本語", flag: "🇯🇵" },
  // { code: "ko", name: "한국어", flag: "🇰🇷" },
];

export const LanguageSelector = () => {
  const { config, updateConfig } = useEventConfig();
  const t = useTranslations("EventCreation");

  const handleLanguageToggle = (languageCode: string) => {
    const newSelection = config.selectedLanguages.includes(languageCode)
      ? config.selectedLanguages.filter((lang) => lang !== languageCode)
      : [...config.selectedLanguages, languageCode];

    updateConfig({ selectedLanguages: newSelection });
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {languages.map((language) => (
          <div key={language.code} className="flex items-center space-x-2">
            <Checkbox
              id={`language-${language.code}`}
              checked={config.selectedLanguages.includes(language.code)}
              onCheckedChange={() => handleLanguageToggle(language.code)}
              className="cursor-pointer"
            />
            <Label htmlFor={`language-${language.code}`} className="cursor-pointer text-sm">
              <Badge
                variant={config.selectedLanguages.includes(language.code) ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <span className="mr-1">{language.flag}</span>
                {language.name}
              </Badge>
            </Label>
          </div>
        ))}
      </div>
    </>
  );
};
