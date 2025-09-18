import { getLanguages } from "@/queries/language/getLanguages";
import { getBusinessByCodeId } from "@/queries/business/getBusinessByCodeId";
import { LoadBasicInfo } from "./components/basic-info/LoadBasicInfo";
import LoadEventWithImages from "./components/upload-files/LoadEventWithImages";
import { LoadPublishForm } from "./components/publish-event/LoadPublishForm";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CreateBasicInfo } from "./components/basic-info/CreateBasicInfo";

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
  // Fetch required data
  const [languagesResult, businessResult] = await Promise.all([getLanguages(), getBusinessByCodeId(codeId)]);

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

  return <div className="flex justify-center py-6 w-full">{renderForm()}</div>;
};

export default NewStepPage;
