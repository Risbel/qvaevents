import { getLanguages } from "@/queries/language/getLanguages";
import { getBusinessByCodeId } from "@/queries/business/getBusinessByCodeId";
import { CreateBasicInfo } from "./components/CreateBasicInfo";
import { EditBasicInfoWrapper } from "./components/EditBasicInfoWrapper";
import { Suspense } from "react";

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
        if (eventSlug) {
          return (
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-64">
                  <p className="text-muted-foreground">Loading event...</p>
                </div>
              }
            >
              <EditBasicInfoWrapper eventSlug={eventSlug} languages={languages} businessId={business.id} />
            </Suspense>
          );
        } else {
          return (
            <div className="flex items-center justify-center h-64">
              <p className="text-destructive">Event slug is required</p>
            </div>
          );
        }
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-destructive">Invalid step</p>
          </div>
        );
    }
  };

  return <div className="flex justify-center py-6 w-full">{renderForm()}</div>;
};

export default NewStepPage;
