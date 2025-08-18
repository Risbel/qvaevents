"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEventConfig } from "./EventConfigProvider";
import { useTranslations } from "next-intl";

export const SavedConfigSelector = () => {
  const { config, loadSavedConfig, getSavedConfigs } = useEventConfig();
  const t = useTranslations("EventCreation");

  const handleConfigChange = (value: string) => {
    if (value) {
      loadSavedConfig(value);
    }
  };

  const savedConfigs = getSavedConfigs();

  return (
    <div className="flex items-center gap-2">
      <Select value={config.savedConfigId || ""} onValueChange={handleConfigChange}>
        <SelectTrigger size="sm" className="text-sm w-64">
          <SelectValue placeholder={t("useSavedConfig")} className="text-sm" />
        </SelectTrigger>
        <SelectContent>
          {savedConfigs.map((savedConfig) => (
            <SelectItem key={savedConfig.id} value={savedConfig.id} className="text-sm">
              <span className="font-medium">{savedConfig.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {config.savedConfigId && <div className="text-xs text-muted-foreground">✓ {t("loaded")}</div>}
    </div>
  );
};
