import React from "react";
import { EventWithTexts } from "@/queries/event/getEventsByBusinessCodeId";
import { Calendar } from "lucide-react";
import EventCard from "./EventCard";
import { getTranslations } from "next-intl/server";

interface EventsListProps {
  events: EventWithTexts[];
}

const EventsList: React.FC<EventsListProps> = async ({ events }) => {
  const t = await getTranslations("EventsList");

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground">
          <Calendar className="mx-auto h-12 w-12 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t("noEvents")}</h3>
          <p>{t("noEventsDescription")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventsList;
