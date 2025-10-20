"use client";

import { Alert } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useGetEventsByBusinessSlug from "@/hooks/events/useGetEventsByBusinessSlug";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { EventDateTime } from "@/app/components/EventDateTime";
import { ImageCarousel } from "@/app/components/ImageCarousel";
import { useTranslations } from "next-intl";
import ButtonShare from "./ButtonShare";

const EventList = () => {
  const tActions = useTranslations("actions");
  const { slug, locale } = useParams();

  const { data, status, isLoading, error } = useGetEventsByBusinessSlug(slug as string);

  if (isLoading) return <Skeleton className="w-full h-48" />;
  if (error) return <Alert variant="destructive">{error.message}</Alert>;
  if (status !== "success" || !data?.data?.Events || data.data.Events.length === 0) return null;

  const eventsData = data.data.Events;

  return (
    <div className="space-y-4">
      {eventsData.map((event) => (
        <Card
          key={event.id}
          className="shadow-md shadow-primary/50 py-0 overflow-hidden relative border-none rounded-none"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <ImageCarousel
              images={event.EventImage.map((image) => ({ id: image.id, url: image.url }))}
              alt="Event images"
              className="md:max-h-40 md:max-w-40 max-h-48 max-w-full"
              rounded="rounded-none"
              showControls={false}
            />
            <div className="flex-1 flex flex-col py-4 px-2">
              <EventDateTime
                className="text-sm"
                startDate={event.startDate}
                endDate={event.endDate}
                locale={locale as string}
              />
              <h3 className="text-xl font-medium">
                {event.EventText.find((text) => text.Language.code === locale)?.title || event.EventText[0].title}
              </h3>
              <p className="text-muted-foreground line-clamp-2 mb-4 flex-1">
                {event.EventText.find((text) => text.Language.code === locale)?.description ||
                  event.EventText[0].description}
              </p>
              <div className="flex gap-2 ">
                <Button size="sm" className="flex-1 md:flex-none w-fit" asChild>
                  <Link href={`/${locale}/event/${event.slug}`}>{tActions("reserveNow")}</Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 md:flex-none w-fit" asChild>
                  <Link href={`/${locale}/event/${event.slug}`}>
                    {tActions("viewDetails")}
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          <ButtonShare
            locale={locale as string}
            eventSlug={event.slug}
            eventTitle={
              event.EventText.find((text) => text.Language.code === locale)?.title || event.EventText[0].title
            }
            eventDescription={
              event.EventText.find((text) => text.Language.code === locale)?.description ||
              event.EventText[0].description
            }
          />
        </Card>
      ))}
    </div>
  );
};

export default EventList;
