import { EditBasicInfo } from "./EditBasicInfo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import useGetEventBySlug from "@/hooks/events/useGetEventBySlug";
import { useTranslations } from "next-intl";
import useGetLanguages from "@/hooks/languages/useGetLanguages";

interface LoadBasicInfoProps {
  eventSlug: string;
  businessId: number;
}

export function LoadBasicInfo({ eventSlug, businessId }: LoadBasicInfoProps) {
  const { data: eventResult, isLoading: eventLoading, isError: eventError } = useGetEventBySlug(eventSlug);
  const { data: languagesResult, isLoading: languagesLoading, isError: languagesError } = useGetLanguages();
  const t = useTranslations("EventError");

  if (eventError || languagesError) {
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

  if (eventLoading || languagesLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (!eventResult || !languagesResult) {
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

  return <EditBasicInfo languages={languagesResult} businessId={businessId} event={eventResult} />;
}
