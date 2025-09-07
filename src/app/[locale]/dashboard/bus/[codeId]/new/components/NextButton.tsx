"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useEventConfig } from "./EventConfigProvider";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export const NextButton = () => {
  const router = useRouter();
  const params = useParams();
  const codeId = params.codeId as string;
  const { buildUrl, config } = useEventConfig();
  const t = useTranslations("EventCreation");

  const handleNext = () => {
    if (config.selectedLanguages.length === 0) {
      toast.error(t("validation.languagesRequired"), {
        description: t("validation.languagesDescription"),
        duration: 4000,
      });
      return;
    }

    // Check if we have a valid subtype
    const hasValidSubType = config.subType && config.subType !== "other";
    const hasValidCustomSubType = config.customSubType && config.customSubType.trim() !== "";

    if (!hasValidSubType && !hasValidCustomSubType) {
      toast.error(t("validation.subtypeRequired"), {
        description: t("validation.subtypeDescription"),
        duration: 4000,
      });
      return;
    }

    const queryString = buildUrl();
    const nextUrl = `/dashboard/bus/${codeId}/new/${0}/${queryString}`;
    router.push(nextUrl);
  };

  const hasValidSubType = config.subType && config.subType !== "other";
  const hasValidCustomSubType = config.customSubType && config.customSubType.trim() !== "";

  const hasBasicConfig =
    config.type &&
    (hasValidSubType || hasValidCustomSubType) &&
    config.isForMinors &&
    config.isPublic &&
    config.spaceType &&
    config.accessType &&
    config.selectedLanguages.length > 0;

  return (
    <Button
      variant="outline"
      className="cursor-pointer w-1/2 md:w-1/3 lg:w-1/4"
      size="sm"
      onClick={handleNext}
      disabled={!hasBasicConfig}
    >
      {t("next")} <ChevronRight className="size-4" />
    </Button>
  );
};
