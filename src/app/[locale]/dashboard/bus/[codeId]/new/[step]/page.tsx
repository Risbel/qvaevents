"use client";

import { useParams, useSearchParams } from "next/navigation";
import { LoadBasicInfo } from "./components/basic-info/LoadBasicInfo";
import LoadEventWithImages from "./components/upload-files/LoadEventWithImages";
import { LoadPublishForm } from "./components/publish-event/LoadPublishForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { CreateBasicInfo } from "./components/basic-info/CreateBasicInfo";
import { StepBar } from "./components/StepBar";
import { useTranslations } from "next-intl";
import useGetBusinessByCodeId from "@/hooks/business/useGetBusinessByCodeId";

const NewStepPage = () => {
  const { step, codeId } = useParams();
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get("slug") as string;
  const t = useTranslations("EventError");

  // Dynamic form rendering based on step
  const renderForm = () => {
    switch (step) {
      case "0":
        return <CreateBasicInfo />;
      case "1":
        return <LoadBasicInfo eventSlug={eventSlug} />;

      case "2":
        return <LoadEventWithImages eventSlug={eventSlug} />;

      case "3":
        return <LoadPublishForm eventSlug={eventSlug} />;

      default:
        return (
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{t("title")}</AlertTitle>
            <AlertDescription>{t("description")}</AlertDescription>
          </Alert>
        );
    }
  };

  return (
    <div className="w-full">
      {/* Step Progress Bar */}
      <StepBar />

      {/* Form Content */}
      <div className="flex justify-center py-6 w-full">{renderForm()}</div>
    </div>
  );
};

export default NewStepPage;
