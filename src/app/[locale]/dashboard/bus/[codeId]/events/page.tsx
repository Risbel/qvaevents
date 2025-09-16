import React from "react";
import { getEventsByBusinessCodeId } from "@/queries/event/getEventsByBusinessCodeId";
import EventsList from "./components/EventsList";
import { getTranslations } from "next-intl/server";

const EventsPage = async ({ params }: { params: Promise<{ codeId: string; locale: string }> }) => {
  const { codeId } = await params;
  const t = await getTranslations("EventsList");

  const result = await getEventsByBusinessCodeId(codeId);

  if (result.status !== "success" || !result.data?.events) {
    throw new Error(result.error);
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">{t("events")}:</h1>

      <EventsList events={result.data?.events} />
    </div>
  );
};

export default EventsPage;
