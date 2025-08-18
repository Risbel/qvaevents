"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Lock } from "lucide-react";
import { useEventConfig } from "./EventConfigProvider";
import { useTranslations } from "next-intl";

export const EventVisibilitySelector = () => {
  const { config, updateConfig } = useEventConfig();
  const t = useTranslations("EventCreation");

  return (
    <>
      <RadioGroup
        value={config.isPublic ? "public" : "private"}
        onValueChange={(value) => updateConfig({ isPublic: value === "public" })}
      >
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="public" id="visibility-public" />
            <Label htmlFor="visibility-public" className="cursor-pointer">
              <Badge
                variant={config.isPublic ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Globe className="size-3 mr-1" />
                {t("eventVisibility.public")}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="private" id="visibility-private" />
            <Label htmlFor="visibility-private" className="cursor-pointer">
              <Badge
                variant={!config.isPublic ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Lock className="size-3 mr-1" />
                {t("eventVisibility.private")}
              </Badge>
            </Label>
          </div>
        </div>
      </RadioGroup>
      {config.isPublic ? (
        <div className="mt-2 text-sm text-muted-foreground">{t("eventVisibility.publicEvent")}</div>
      ) : (
        <div className="mt-2 text-sm text-muted-foreground">{t("eventVisibility.invitationRequired")}</div>
      )}
    </>
  );
};
