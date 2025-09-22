import { EditBasicInfo } from "./EditBasicInfo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import useGetEventBySlug from "@/hooks/events/useGetEventBySlug";
import { useTranslations } from "next-intl";
import useGetLanguages from "@/hooks/languages/useGetLanguages";
import useGetBusinessByCodeId from "@/hooks/business/useGetBusinessByCodeId";
import { useParams } from "next/navigation";
import { CreateBasicInfoSkeleton } from "../Skeletons";

interface LoadBasicInfoProps {
  eventSlug: string;
}

export function LoadBasicInfo({ eventSlug }: LoadBasicInfoProps) {
  const params = useParams();
  const { codeId } = params as { codeId: string };
  const { data: eventResult, isLoading: eventLoading, isError: eventError } = useGetEventBySlug(eventSlug);
  const { data: languagesResult, isLoading: languagesLoading, isError: languagesError } = useGetLanguages();
  const { data: businessResult, isError, isLoading: businessLoading } = useGetBusinessByCodeId(codeId as string);

  const t = useTranslations("EventError");

  if (eventError || languagesError || isError) {
    return (
      <div className="flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <p>{t("title")}</p>
          </AlertTitle>

          <AlertDescription>
            <p>{t("description")}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (eventLoading || languagesLoading || businessLoading) {
    return <CreateBasicInfoSkeleton />;
  }

  if (!eventResult || !languagesResult || !businessResult) {
    return (
      <div className="flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <p>{t("title")}</p>
          </AlertTitle>
          <AlertDescription>
            <p>{t("description")}</p>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <EditBasicInfo languages={languagesResult} businessId={businessResult.id} event={eventResult} />;
}
