"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useEventConfig } from "./EventConfigProvider";
import { useTranslations } from "next-intl";

export const MinorsSuitabilitySelector = () => {
  const { config, updateConfig } = useEventConfig();
  const t = useTranslations("EventCreation");

  return (
    <>
      <RadioGroup value={config.isForMinors || ""} onValueChange={(value) => updateConfig({ isForMinors: value })}>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="yes" id="subtype-yes" />
            <Label htmlFor="subtype-yes" className="cursor-pointer">
              <Badge
                variant={config.isForMinors === "yes" ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {t("minorsSuitability.yes")}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="no" id="subtype-no" />
            <Label htmlFor="subtype-no" className="cursor-pointer">
              <Badge
                variant={config.isForMinors === "no" ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {t("minorsSuitability.no")}
              </Badge>
            </Label>
          </div>
        </div>
      </RadioGroup>
      {config.isForMinors && (
        <div className="mt-2 text-sm text-muted-foreground">
          {config.isForMinors === "yes"
            ? t("minorsSuitability.suitableForMinors")
            : t("minorsSuitability.notSuitableForMinors")}
        </div>
      )}
    </>
  );
};
