import { getLanguages } from "@/queries/language/getLanguages";
import { getBusinessByCodeId } from "@/queries/business/getBusinessByCodeId";
import { getEventBySlug } from "@/queries/event/getEventBySlug";
import { LoadBasicInfo } from "./components/basic-info/LoadBasicInfo";
import LoadEventWithImages from "./components/upload-files/LoadEventWithImages";
import { LoadPublishForm } from "./components/publish-event/LoadPublishForm";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CreateBasicInfo } from "./components/basic-info/CreateBasicInfo";
import { StepBar } from "./components/StepBar";

const NewStepPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ step: string; codeId: string; locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { step, codeId } = await params;
  const searchParamsData = await searchParams;
  const eventSlug = searchParamsData.slug as string;
  const t = await getTranslations("EventError");

  // Parse step as number for step bar
  // URL step 0 (Create Basic Info) -> Step bar 1
  // URL step 1 (Edit Basic Info) -> Step bar 1
  // URL step 2 (Upload Images) -> Step bar 2
  // URL step 3 (Publish Event) -> Step bar 3
  const currentStep = parseInt(step) === 0 ? 1 : parseInt(step);

  // Fetch required data
  const [languagesResult, businessResult] = await Promise.all([getLanguages(), getBusinessByCodeId(codeId)]);

  // Fetch event data if we have a slug (for existing events)
  let eventResult = null;
  if (eventSlug) {
    eventResult = await getEventBySlug(eventSlug);
  }

  if (
    languagesResult.status !== "success" ||
    !languagesResult.data?.languages ||
    languagesResult.data.languages?.length === 0
  ) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading languages</p>
      </div>
    );
  }

  if (businessResult.status !== "success" || !businessResult.data?.business) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading business</p>
      </div>
    );
  }

  const languages = languagesResult.data.languages;
  const business = businessResult.data.business;

  // Determine completed steps from event data
  let completedSteps = 0;
  if (eventResult?.status === "success" && eventResult.data?.event) {
    const event = eventResult.data.event;
    completedSteps = event.step || 0;

    // If event is published, all steps are completed
    if (event.isPublished) {
      completedSteps = 3;
    }
  }

  // Dynamic form rendering based on step
  const renderForm = () => {
    switch (step) {
      case "0":
        return <CreateBasicInfo languages={languages} businessId={business.id} />;
      case "1":
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading event...</p>
              </div>
            }
          >
            <LoadBasicInfo eventSlug={eventSlug} languages={languages} businessId={business.id} />
          </Suspense>
        );

      case "2":
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading event images...</p>
              </div>
            }
          >
            <LoadEventWithImages eventSlug={eventSlug} />
          </Suspense>
        );

      case "3":
        return (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading publish form...</p>
              </div>
            }
          >
            <LoadPublishForm eventSlug={eventSlug} />
          </Suspense>
        );

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
      <StepBar
        currentStep={currentStep}
        completedSteps={completedSteps}
        businessCodeId={codeId}
        eventSlug={eventSlug}
        allowNavigation={step !== "0"}
      />

      {/* Form Content */}
      <div className="flex justify-center py-6 w-full">{renderForm()}</div>
    </div>
  );
};

export default NewStepPage;
