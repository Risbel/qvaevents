import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, Snowflake, Sun, SunSnow, Umbrella } from "lucide-react";
import { useEventConfig } from "./EventConfigProvider";
import { useTranslations } from "next-intl";
import useGetSpaceTypes from "@/hooks/events/useGetSpaceTypes";
import { useParams } from "next/navigation";
import { Tables } from "@/types/supabase";

type SpaceType = Tables<"SpaceType">;

// Icon mapping for space types
const getSpaceTypeIcon = (name: string) => {
  const iconMap = {
    indoor: Home,
    outdoor: Sun,
    semicovered: Umbrella,
    airConditioned: Snowflake,
    climatizedAndOutdor: SunSnow,
    coveredAndOutdoor: Home, // Will be combined with Sun
  };
  return iconMap[name as keyof typeof iconMap] || Home;
};

// Get the label based on current locale
const getSpaceTypeLabel = (spaceType: any, locale: string) => {
  return locale === "es" ? spaceType.labelEs : spaceType.labelEn;
};

export const SpaceTypeSelector = () => {
  const { config, updateConfig } = useEventConfig();
  const t = useTranslations("EventCreation");
  const locale = useParams().locale as string;

  const { data: spaceTypesData, isLoading, isError } = useGetSpaceTypes();
  const spaceTypes = spaceTypesData || [];

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2 items-center">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-sm text-destructive">Error loading space types. Please try again.</div>;
  }

  return (
    <>
      <RadioGroup
        value={config.spaceType || ""}
        onValueChange={(value) => {
          const spaceType = spaceTypes.find((st) => st.name === value);
          updateConfig({ spaceType: value, spaceTypeId: spaceType?.id });
        }}
      >
        <div className="flex flex-wrap gap-2 items-center">
          {spaceTypes.map((spaceType: SpaceType) => {
            const IconComponent = getSpaceTypeIcon(spaceType.name);
            const isSelected = config.spaceType === spaceType.name;
            const label = getSpaceTypeLabel(spaceType, locale);

            return (
              <div key={spaceType.id} className="flex items-center space-x-1">
                <RadioGroupItem className="cursor-pointer" value={spaceType.name} id={`space-${spaceType.name}`} />
                <Label htmlFor={`space-${spaceType.name}`} className="cursor-pointer">
                  <Badge
                    variant={isSelected ? "default" : "outline"}
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {spaceType.name === "coveredAndOutdoor" ? (
                      <>
                        <Home className="size-3" />
                        <Sun className="size-2 -translate-y-[3px]" />
                      </>
                    ) : (
                      <IconComponent className="size-3" />
                    )}
                    {label}
                  </Badge>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
      {config.spaceType && (
        <div className="mt-2 text-sm text-muted-foreground">{t(`spaceType.${config.spaceType}Venue` as any)}</div>
      )}
    </>
  );
};
