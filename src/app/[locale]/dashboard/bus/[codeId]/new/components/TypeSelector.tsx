"use client";

import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { PlusCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useEventConfig } from "./EventConfigProvider";
import { useTranslations } from "next-intl";
import { TypeWithSubTypes } from "@/queries/client/eventTypes/getTypesAndSubtypes";

export function TypeSelector({ types }: { types: TypeWithSubTypes[] }) {
  const params = useParams();
  const locale = params.locale as string;
  const { config, updateConfig } = useEventConfig();
  const t = useTranslations("EventCreation");

  // Find the selected type and subtype based on config values
  const selectedType = types.find((type) => type.name === config.type);
  const selectedTypeId = selectedType?.id || null;

  // Find the selected subtype
  const selectedSubType = selectedType?.SubType?.find((subType) => subType.name === config.subType);
  const selectedSubTypeId = selectedSubType?.id || null;
  const isOtherSelected = config.subType === "other" || (config.customSubType && config.customSubType !== "");
  const customType = isOtherSelected ? config.customSubType : "";

  // Helper function to get the correct label based on locale
  const getLocalizedLabel = (type: TypeWithSubTypes) => {
    if (locale === "es" && type.labelEs) {
      return type.labelEs;
    }
    return type.labelEn || type.name; // fallback to name if labelEn is not available
  };

  // Helper function to get the correct SubType label based on locale
  const getLocalizedSubTypeLabel = (subType: any) => {
    if (locale === "es" && subType.labelEs) {
      return subType.labelEs;
    }
    return subType.labelEn || subType.name; // fallback to name if labelEn is not available
  };

  const handleSubTypeChange = (value: string) => {
    if (value === "other") {
      updateConfig({ subType: "other", customSubType: "" });
    } else {
      const subType = selectedType?.SubType?.find((st) => st.id.toString() === value);
      updateConfig({ subType: subType?.name || "", customSubType: "" });
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden inputs for form submission */}
      <input type="hidden" name="typeId" value={selectedTypeId || ""} />
      <input type="hidden" name="subTypeId" value={selectedSubTypeId || ""} />
      <input type="hidden" name="customSubType" value={customType || ""} />

      {/* Types Selection */}
      <div>
        <RadioGroup
          value={selectedTypeId?.toString() || ""}
          onValueChange={(value) => {
            const type = types.find((t) => t.id.toString() === value);
            updateConfig({
              type: type?.name || "",
              subType: "",
            });
          }}
          className="flex flex-wrap gap-1"
        >
          {types.map((type) => (
            <div key={type.id} className="flex items-center space-x-1">
              <RadioGroupItem className="cursor-pointer" value={type.id.toString()} id={`type-${type.id}`} />
              <Label
                htmlFor={`type-${type.id}`}
                className="flex items-center cursor-pointer hover:text-primary transition-colors gap-2"
              >
                <Badge
                  variant={selectedTypeId === type.id ? "default" : "outline"}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <span className="text-lg">{type.icon}</span>
                  <span className="capitalize">{getLocalizedLabel(type)}</span>
                </Badge>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* SubTypes Display */}
      {selectedType && selectedType.SubType && selectedType.SubType.length > 0 && (
        <div className="space-y-1">
          <h3 className="text-sm">{t("typeSelector.selectSubtype", { type: getLocalizedLabel(selectedType) })}</h3>
          <RadioGroup
            value={isOtherSelected ? "other" : selectedSubTypeId?.toString() || ""}
            onValueChange={handleSubTypeChange}
            className="flex flex-wrap gap-2"
          >
            {selectedType.SubType.map((subType) => (
              <div key={subType.id} className="flex items-center space-x-1">
                <RadioGroupItem className="cursor-pointer" value={subType.id.toString()} id={`subtype-${subType.id}`} />
                <Label htmlFor={`subtype-${subType.id}`} className="cursor-pointer">
                  <Badge
                    variant={selectedSubTypeId === subType.id ? "default" : "outline"}
                    className="hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {subType.icon && <span className="text-base">{subType.icon}</span>}
                    {getLocalizedSubTypeLabel(subType)}
                  </Badge>
                </Label>
              </div>
            ))}

            {/* Other option */}
            <div className="flex items-center space-x-2">
              <RadioGroupItem className="cursor-pointer" value="other" id="subtype-other" />
              <Label htmlFor="subtype-other" className="cursor-pointer">
                <Badge
                  variant={isOtherSelected ? "default" : "outline"}
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <PlusCircle className="size-4" /> {t("typeSelector.other")}
                </Badge>
              </Label>
            </div>
          </RadioGroup>

          {/* Custom SubType Input */}
          {isOtherSelected && (
            <div className="mt-3 space-y-2">
              <Label htmlFor="customSubType" className="text-sm font-medium">
                {t("typeSelector.specifyCustom")}
              </Label>
              <Input
                id="customSubType"
                type="text"
                placeholder={t("typeSelector.customPlaceholder")}
                value={customType}
                onChange={(e) => updateConfig({ subType: e.target.value, customSubType: e.target.value })}
                className="max-w-xs"
              />
            </div>
          )}
        </div>
      )}

      {selectedType && (!selectedType.SubType || selectedType.SubType.length === 0) && (
        <div className="text-center py-4 text-muted-foreground">
          <p>{t("typeSelector.noSubtypes", { type: getLocalizedLabel(selectedType) })}</p>
        </div>
      )}
    </div>
  );
}
