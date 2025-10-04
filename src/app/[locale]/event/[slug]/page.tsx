import { getEventBySlug } from "@/queries/server/event/getEventBySlug";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Shield, Ticket } from "lucide-react";
import { notFound } from "next/navigation";
import { LanguageSelector } from "./components/LanguageSelector";
import { ImageCarousel } from "@/app/components/ImageCarousel";
import { EventTextProvider } from "./components/EventTextProvider";
import { EventTitle } from "./components/EventTitle";
import { EventDescription } from "./components/EventDescription";
import { EventLocation } from "./components/EventLocation";
import { EventDateTime } from "@/app/components/EventDateTime";
import EventMap from "./components/EventMap";
import ReservationDialog from "./components/ReservationDialog";
import ClientsNavbar from "@/app/components/ClientsNavbar";
import { getTranslations } from "next-intl/server";

const EventPage = async ({ params }: { params: Promise<{ slug: string; locale: string }> }) => {
  const { slug, locale } = await params;
  const t = await getTranslations("EventPage");

  const eventResult = await getEventBySlug(slug);

  if (!eventResult || eventResult.status !== "success" || !eventResult.data?.event) {
    notFound();
  }

  const event = eventResult.data.event;

  // Get event type and subtype translations
  const eventTypeMap: Record<string, string> = {
    party: "Party",
    conference: "Conference",
    workshop: "Workshop",
    concert: "Concert",
    festival: "Festival",
    exhibition: "Exhibition",
    sports: "Sports",
    cultural: "Cultural",
    business: "Business",
    educational: "Educational",
  };

  const eventSubTypeMap: Record<string, string> = {
    nightClub: "Night Club",
    bar: "Bar",
    restaurant: "Restaurant",
    outdoor: "Outdoor",
    indoor: "Indoor",
    virtual: "Virtual",
    hybrid: "Hybrid",
  };

  return (
    <EventTextProvider eventTexts={event.EventText} defaultLocale={event.defaultLocale}>
      <ClientsNavbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pb-24 pt-6 max-w-2xl">
          <div className="flex items-center justify-end mb-2">
            <LanguageSelector />
          </div>

          <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
            <div className="flex flex-col items-center gap-1 md:gap-2">
              <EventTitle />

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <EventDateTime
                  startDate={event.startDate}
                  endDate={event.endDate}
                  locale={locale}
                  timeZoneId={event.timeZoneId}
                  timeZoneName={event.timeZoneName}
                  showTimeZone={false}
                  className="text-md"
                />
              </div>
            </div>

            {event.EventImage && event.EventImage.length > 0 && (
              <ImageCarousel
                images={event.EventImage}
                alt="Event images"
                autoplayInterval={3000}
                showControls={true}
                showIndicators={true}
              />
            )}

            <div className="grid grid-cols-2 gap-3">
              <ReservationDialog eventId={event.id} />
              <Button variant="outline">{t("shareEvent")}</Button>
            </div>

            <EventDescription />

            <Card className="gap-2">
              <CardHeader>
                <CardTitle>{t("eventDetails")}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-2 border rounded-md">
                  <Calendar className="h-5 w-5 text-primary" />
                  <EventDateTime
                    startDate={event.startDate}
                    endDate={event.endDate}
                    locale={locale}
                    timeZoneId={event.timeZoneId}
                    timeZoneName={event.timeZoneName}
                    showTimeZone={true}
                    twoRows={true}
                  />
                </div>

                <div className="flex items-center gap-3 p-2 border rounded-md">
                  <Ticket className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{eventTypeMap[event.type] || event.type}</p>
                    {event.subType && (
                      <p className="text-sm text-muted-foreground">{eventSubTypeMap[event.subType] || event.subType}</p>
                    )}
                  </div>
                </div>

                {event.visitsLimit && (
                  <div className="flex items-center gap-3 p-2 border rounded-md">
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{t("capacity")}</p>
                      <p className="text-sm text-muted-foreground">{event.visitsLimit.toLocaleString()} people</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-2 border rounded-md">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{t("agePolicy")}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.isForMinors ? t("suitableForMinors") : t("adultsOnly")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <EventLocation />

            <EventMap lat={event.lat || 22.144943} lng={event.lng || -80.448366} />

            <div className="grid grid-cols-2 gap-3">
              <ReservationDialog eventId={event.id} />
              <Button variant="outline">{t("shareEvent")}</Button>
            </div>
          </div>
        </div>
      </main>
    </EventTextProvider>
  );
};

export default EventPage;
