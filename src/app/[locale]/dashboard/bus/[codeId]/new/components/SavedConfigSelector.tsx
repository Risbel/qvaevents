"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEventConfig } from "./EventConfigProvider";
import { useTranslations } from "next-intl";
import { Tables } from "@/types/supabase";

type CustomEventConfigWithJoins = Tables<"CustomEventConfig"> & {
  Type?: Tables<"Type">;
  SubType?: Tables<"SubType">;
  SpaceType?: Tables<"SpaceType">;
  AccessType?: Tables<"AccessType">;
};

export const SavedConfigSelector = ({ customEventConfigs }: { customEventConfigs: CustomEventConfigWithJoins[] }) => {
  const { config, updateConfig } = useEventConfig();
  const t = useTranslations("EventCreation");

  const handleConfigChange = (value: string) => {
    if (value) {
      const dbConfig = customEventConfigs.find((c) => c.id.toString() === value);
      if (dbConfig) {
        // Convert database config to the format expected by the provider
        const convertedConfig = {
          type: dbConfig.Type?.name || "",
          subType: dbConfig.SubType?.name || "",
          typeId: dbConfig.typeId || undefined,
          subTypeId: dbConfig.subTypeId || undefined,
          isForMinors: dbConfig.isForMinors ? "yes" : "no",
          isPublic: dbConfig.isPublic,
          spaceType: dbConfig.SpaceType?.name || "",
          accessType: dbConfig.AccessType?.name || "",
          spaceTypeId: dbConfig.spaceTypeId || undefined,
          accessTypeId: dbConfig.accessTypeId || undefined,
          selectedLanguages: dbConfig.selectedLanguages || [],
          savedConfigId: value,
        };

        // Update all config values at once
        updateConfig(convertedConfig);
      }
    }
  };

  // Only show configs if there are any
  if (!customEventConfigs || customEventConfigs.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={config.savedConfigId || ""} onValueChange={handleConfigChange}>
        <SelectTrigger size="sm" className="text-sm w-64">
          <SelectValue placeholder={t("useSavedConfig")} className="text-sm" />
        </SelectTrigger>
        <SelectContent>
          {customEventConfigs.map((configItem) => (
            <SelectItem key={configItem.id} value={configItem.id.toString()} className="text-sm">
              <span className="font-medium">{configItem.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {config.savedConfigId && <div className="text-xs text-muted-foreground">✓ {t("loaded")}</div>}
    </div>
  );
};
