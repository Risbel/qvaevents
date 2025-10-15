"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Ticket } from "lucide-react";
import { useEventConfig } from "./EventConfigProvider";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import useGetAccessTypes from "@/hooks/events/useGetAccessTypes";
import { useParams } from "next/navigation";
import { AccessType } from "@/queries/client/events/getAccessType";

// Icon mapping for access types
const getAccessTypeIcon = (name: string) => {
  const iconMap = {
    confirmations: CheckCircle,
    tickets: Ticket,
    ticketsAndSpaces: Ticket,
    confirmationsAndSpaces: CheckCircle,
  };
  return iconMap[name as keyof typeof iconMap] || CheckCircle;
};

// Get the label based on current locale
const getAccessTypeLabel = (accessType: any, locale: string) => {
  return locale === "es" ? accessType.labelEs : accessType.labelEn;
};

export const AccessTypeSelector = () => {
  const { config, updateConfig } = useEventConfig();
  const t = useTranslations("EventCreation");
  const locale = useParams().locale as string;

  const { data: accessTypesData, isLoading, isError } = useGetAccessTypes();
  const accessTypes = accessTypesData || [];

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 items-center">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-sm text-destructive">Error loading access types. Please try again.</div>;
  }

  return (
    <>
      <RadioGroup
        value={config.accessType || ""}
        onValueChange={(value) => {
          const accessType = accessTypes.find((at) => at.name === value);
          updateConfig({ accessType: value, accessTypeId: accessType?.id });
        }}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {accessTypes.map((accessType: AccessType) => {
            const IconComponent = getAccessTypeIcon(accessType.name);
            const isSelected = config.accessType === accessType.name;
            const label = getAccessTypeLabel(accessType, locale);

            return (
              <div key={accessType.id} className="flex items-center space-x-1">
                <RadioGroupItem className="cursor-pointer" value={accessType.name} id={`access-${accessType.name}`} />
                <Label htmlFor={`access-${accessType.name}`} className="cursor-pointer">
                  <Badge
                    variant={isSelected ? "default" : "outline"}
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <IconComponent className="size-3 mr-1" />
                    {label}
                  </Badge>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
      {config.accessType && (
        <div className="mt-2 text-sm text-muted-foreground">
          {t(`accessType.${config.accessType}Description` as any)}
        </div>
      )}
    </>
  );
};
