import { getEventBySlug } from "@/queries/event/getEventBySlug";
import { EditBasicInfo } from "./EditBasicInfo";
import { Language } from "@/queries/language/getLanguages";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface LoadBasicInfoProps {
  eventSlug: string;
  languages: Language[];
  businessId: number;
}

export async function LoadBasicInfo({ eventSlug, languages, businessId }: LoadBasicInfoProps) {
  const eventResult = await getEventBySlug(eventSlug);
  const t = await getTranslations("EventError");

  if (eventResult?.status !== "success" || !eventResult?.data?.event) {
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

  return <EditBasicInfo languages={languages} businessId={businessId} event={eventResult.data.event} />;
}
