"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Cloud, Home, Snowflake, Sun, SunSnow, Umbrella, Zap } from "lucide-react";
import { useEventConfig } from "./EventConfigProvider";
import { useTranslations } from "next-intl";

export const SpaceTypeSelector = () => {
  const { config, updateConfig } = useEventConfig();
  const t = useTranslations("EventCreation");

  return (
    <>
      <RadioGroup value={config.spaceType || ""} onValueChange={(value) => updateConfig({ spaceType: value })}>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="indoor" id="space-indoor" />
            <Label htmlFor="space-indoor" className="cursor-pointer">
              <Badge
                variant={config.spaceType === "indoor" ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Home className="size-3" />
                {t("spaceType.indoor")}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="outdoors" id="space-outdoors" />
            <Label htmlFor="space-outdoors" className="cursor-pointer">
              <Badge
                variant={config.spaceType === "outdoors" ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Sun className="size-3" />
                {t("spaceType.outdoors")}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="semiCovered" id="spaceSemiCovered" />
            <Label htmlFor="spaceSemiCovered" className="cursor-pointer">
              <Badge
                variant={config.spaceType === "semiCovered" ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Umbrella className="size-3" />
                {t("spaceType.semiCovered")}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="airConditioned" id="space-airConditioned" />
            <Label htmlFor="space-airConditioned" className="cursor-pointer">
              <Badge
                variant={config.spaceType === "airConditioned" ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Snowflake className="size-3" />
                {t("spaceType.airConditioned")}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="mixed" id="space-mixed" />
            <Label htmlFor="space-mixed" className="cursor-pointer">
              <Badge
                variant={config.spaceType === "mixed" ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <SunSnow className="size-3" />
                {t("spaceType.mixed")}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="mixed2" id="space-mixed2" />
            <Label htmlFor="space-mixed2" className="cursor-pointer">
              <Badge
                variant={config.spaceType === "mixed2" ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors -space-x-2"
              >
                <Home className="size-3" />
                <Sun className="size-2 -translate-y-[3px]" />
                {t("spaceType.mixed2")}
              </Badge>
            </Label>
          </div>
        </div>
      </RadioGroup>
      {config.spaceType && (
        <div className="mt-2 text-sm text-muted-foreground">
          {config.spaceType === "indoor" && t("spaceType.indoorVenue")}
          {config.spaceType === "outdoors" && t("spaceType.outdoorVenue")}
          {config.spaceType === "semiCovered" && t("spaceType.semiCoveredVenue")}
          {config.spaceType === "airConditioned" && t("spaceType.airConditionedVenue")}
          {config.spaceType === "mixed" && t("spaceType.mixedVenue")}
        </div>
      )}
    </>
  );
};
