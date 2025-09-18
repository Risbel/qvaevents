import { getEventBySlug } from "@/queries/event/getEventBySlug";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import EventImagesManager from "./EventImagesManager";

export const LoadEventWithImages = async ({ eventSlug }: { eventSlug: string }) => {
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
  const images = event.EventImage || [];
  const maxImages = 2;
  const canUploadMore = images.length < maxImages;

  return <EventImagesManager eventId={event.id} images={images} maxImages={maxImages} canUploadMore={canUploadMore} />;
};

export default LoadEventWithImages;
