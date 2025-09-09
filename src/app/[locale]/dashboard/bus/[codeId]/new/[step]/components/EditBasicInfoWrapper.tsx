import { getEventBySlug } from "@/queries/event/getEventBySlug";
import { EditBasicInfo } from "./EditBasicInfo";
import { Language } from "@/queries/language/getLanguages";

interface EditBasicInfoWrapperProps {
  eventSlug: string;
  languages: Language[];
  businessId: number;
}

export async function EditBasicInfoWrapper({ eventSlug, languages, businessId }: EditBasicInfoWrapperProps) {
  const eventResult = await getEventBySlug(eventSlug);

  if (eventResult.status !== "success" || !eventResult.data?.event) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading event: {eventResult.error}</p>
      </div>
    );
  }

  return <EditBasicInfo languages={languages} businessId={businessId} event={eventResult.data.event} />;
}
