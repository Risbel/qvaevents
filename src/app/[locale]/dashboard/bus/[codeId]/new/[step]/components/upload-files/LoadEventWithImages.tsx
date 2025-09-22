import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import EventImagesManager from "./EventImagesManager";
import useGetEventBySlug from "@/hooks/events/useGetEventBySlug";

export const LoadEventWithImages = ({ eventSlug }: { eventSlug: string }) => {
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

  const images = eventResult.EventImage || [];
  const maxImages = 2;
  const canUploadMore = images.length < maxImages;

  return (
    <EventImagesManager eventId={eventResult?.id} images={images} maxImages={maxImages} canUploadMore={canUploadMore} />
  );
};

export default LoadEventWithImages;
