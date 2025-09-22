import { PublishForm } from "./PublishForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import useGetEventBySlug from "@/hooks/events/useGetEventBySlug";

export function LoadPublishForm({ eventSlug }: { eventSlug: string }) {
  const { data: eventResult, isLoading: eventLoading, isError: eventError } = useGetEventBySlug(eventSlug);
  const t = useTranslations("EventError");

  if (eventLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (eventError || !eventResult) {
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

  return (
    <PublishForm eventId={eventResult.id} eventSlug={eventResult.slug} isPublished={eventResult.isPublished || false} />
  );
}
