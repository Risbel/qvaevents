import { getEventBySlug } from "@/queries/server/event/getEventBySlug";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Shield, Ticket, CalendarClockIcon } from "lucide-react";
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
import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "@/app/components/LocaleSwitcher";
import ModeToggle from "@/app/components/ModeToggle";
import ClientsUserDropdown from "@/app/components/ClientsUserDropdown";
import Link from "next/link";
import Image from "next/image";
import ShareEventButton from "./components/ShareEventButton";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getEventSubType, getEventType } from "@/utils/eventTypesSelector";

const EventPage = async ({ params }: { params: Promise<{ slug: string; locale: string }> }) => {
  const { slug, locale } = await params;
  const t = await getTranslations("EventPage");
  const eventResult = await getEventBySlug(slug);

  if (!eventResult || eventResult.status !== "success" || !eventResult.data?.event) {
    notFound();
  }

  const event = eventResult.data.event;
  const isExpired = new Date(event.endDate) < new Date();

  return (
    <EventTextProvider eventTexts={event.EventText} defaultLocale={event.defaultLocale}>
      <nav className="flex flex-1 justify-between items-center space-x-2 px-2 md:px-4 py-2 sticky top-0 z-50 bg-background/50 backdrop-blur-sm border-b">
        <div className="flex items-center gap-2">
          {eventResult.data?.event.Business.logo && (
            <Image
              src={eventResult.data?.event.Business.logo}
              alt={eventResult.data?.event.Business.name || "Business Logo"}
              width={32}
              height={32}
            />
          )}
          <Link className="font-bold" href={`/${locale}/${eventResult.data?.event.Business.slug}`}>
            {eventResult.data?.event.Business.name}
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ModeToggle />
          <ClientsUserDropdown />
        </div>
      </nav>
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

            <div className={cn("grid grid-cols-2 gap-3", isExpired && "hidden")}>
              <ReservationDialog
                isFull={event.isFull}
                eventId={event.id}
                visitsLimit={event.visitsLimit || 0}
                businessId={event.Business.id}
              />
              <ShareEventButton eventDate={event.startDate} eventSlug={event.slug} locale={locale} />
            </div>
            {isExpired && (
              <Alert variant="destructive" className="shadow-md shadow-red-500/20">
                <CalendarClockIcon className="h-5 w-5 text-primary" />
                <AlertTitle>{t("eventExpired")}</AlertTitle>
                <AlertDescription>{t("eventExpiredDescription")}</AlertDescription>
              </Alert>
            )}

            <EventDescription />
            <EventLocation />
            <EventMap lat={event.lat || 22.144943} lng={event.lng || -80.448366} />

            <div className={cn("grid grid-cols-2 gap-3", isExpired && "hidden")}>
              <ReservationDialog
                isFull={event.isFull}
                eventId={event.id}
                visitsLimit={event.visitsLimit || 0}
                businessId={event.Business.id}
              />
              <ShareEventButton eventDate={event.startDate} eventSlug={event.slug} locale={locale} />
            </div>
            <Card className="gap-2 shadow-md shadow-primary/20">
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
                    className="text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 p-2 border rounded-md">
                  <Ticket className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium flex items-center gap-2">
                      <span>{getEventType(event.type, locale).label}</span>
                      {getEventType(event.type, locale).icon && <span>{getEventType(event.type, locale).icon}</span>}
                    </p>
                    {event.subType && (
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <span>{getEventSubType(event.subType, locale).label}</span>
                        {getEventSubType(event.subType, locale).icon && (
                          <span>{getEventSubType(event.subType, locale).icon}</span>
                        )}
                      </p>
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
          </div>
        </div>
      </main>
    </EventTextProvider>
  );
};

export default EventPage;
