"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Ticket } from "lucide-react";
import { useEventConfig } from "./EventConfigProvider";
import { useTranslations } from "next-intl";

export const AccessTypeSelector = () => {
  const { config, updateConfig } = useEventConfig();
  const t = useTranslations("EventCreation");

  return (
    <>
      <RadioGroup value={config.accessType || ""} onValueChange={(value) => updateConfig({ accessType: value })}>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="confirmations" id="access-confirmations" />
            <Label htmlFor="access-confirmations" className="cursor-pointer">
              <Badge
                variant={config.accessType === "confirmations" ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <CheckCircle className="size-3 mr-1" />
                {t("accessType.confirmations")}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="tickets" id="access-tickets" />
            <Label htmlFor="access-tickets" className="cursor-pointer">
              <Badge
                variant={config.accessType === "tickets" ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Ticket className="size-3 mr-1" />
                {t("accessType.tickets")}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="ticketsAndSpaces" id="access-tickets-spaces" />
            <Label htmlFor="access-tickets-spaces" className="cursor-pointer">
              <Badge
                variant={config.accessType === "ticketsAndSpaces" ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Ticket className="size-3 mr-1" />
                {t("accessType.ticketsAndSpaces")}
              </Badge>
            </Label>
          </div>
          <div className="flex items-center space-x-1">
            <RadioGroupItem className="cursor-pointer" value="seat" id="access-seat" />
            <Label htmlFor="access-seat" className="cursor-pointer">
              <Badge
                variant={config.accessType === "seat" ? "default" : "outline"}
                className="hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {t("accessType.spaces")}
              </Badge>
            </Label>
          </div>
        </div>
      </RadioGroup>
      {config.accessType && (
        <div className="mt-2 text-sm text-muted-foreground">
          {config.accessType === "confirmations" && t("accessType.simpleAccess")}
          {config.accessType === "tickets" && t("accessType.ticketBased")}
          {config.accessType === "ticketsAndSpaces" && t("accessType.ticketsWithSpaces")}
          {config.accessType === "seat" && t("accessType.idealForTheaters")}
        </div>
      )}
    </>
  );
};
