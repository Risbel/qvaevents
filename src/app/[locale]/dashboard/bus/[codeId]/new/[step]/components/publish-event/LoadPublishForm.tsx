import { getEventBySlug } from "@/queries/event/getEventBySlug";
import { PublishForm } from "./PublishForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface LoadPublishFormProps {
  eventSlug: string;
}

export async function LoadPublishForm({ eventSlug }: LoadPublishFormProps) {
  const eventResult = await getEventBySlug(eventSlug);
  const t = await getTranslations("EventError");

  if (eventResult.status !== "success" || !eventResult.data?.event) {
    return (
      <div className="flex items-center justify-center h-64">
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

  const event = eventResult.data.event;

  return <PublishForm eventId={event.id} eventSlug={event.slug} isPublished={event.isPublished || false} />;
}
