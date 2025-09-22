"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEventConfig } from "./EventConfigProvider";
import { useTranslations } from "next-intl";
import { CustomEventConfig } from "@/hooks/business/getBusinessByCodeId";

export const SavedConfigSelector = ({ customEventConfigs }: { customEventConfigs: CustomEventConfig[] }) => {
  const { config, updateConfig } = useEventConfig();
  const t = useTranslations("EventCreation");

  const handleConfigChange = (value: string) => {
    if (value) {
      const dbConfig = customEventConfigs.find((c) => c.id.toString() === value);
      if (dbConfig) {
        // Convert database config to the format expected by the provider
        const convertedConfig = {
          type: dbConfig.type,
          subType: dbConfig.subType || "",
          isForMinors: dbConfig.isForMinors ? "yes" : "no",
          isPublic: dbConfig.isPublic,
          spaceType: dbConfig.spaceType,
          accessType: dbConfig.accessType,
          selectedLanguages: dbConfig.selectedLanguages || [],
          savedConfigId: value,
        };

        // Update all config values at once
        updateConfig(convertedConfig);
      }
    }
  };

  // Only use database configs
  const allConfigs = customEventConfigs.map((dbConfig) => ({
    id: dbConfig.id.toString(),
    name: dbConfig.name,
  }));

  return (
    <div className="flex items-center gap-2">
      <Select value={config.savedConfigId || ""} onValueChange={handleConfigChange}>
        <SelectTrigger size="sm" className="text-sm w-64">
          <SelectValue placeholder={t("useSavedConfig")} className="text-sm" />
        </SelectTrigger>
        <SelectContent>
          {allConfigs.map((configItem) => (
            <SelectItem key={configItem.id} value={configItem.id} className="text-sm">
              <span className="font-medium">{configItem.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {config.savedConfigId && <div className="text-xs text-muted-foreground">✓ {t("loaded")}</div>}
    </div>
  );
};
