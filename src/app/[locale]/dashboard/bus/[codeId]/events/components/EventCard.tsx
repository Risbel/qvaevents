import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Users, Pencil, BarChart, ExternalLink, CheckCircleIcon, EyeOffIcon } from "lucide-react";
import { toNormalCase } from "@/utils/textFormating";
import { getEventTitle, getEventDescription } from "./eventTextExtraction";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { EventWithTexts } from "@/queries/client/events/getEventsByBusinessCodeId";
import { EventDateTime } from "@/app/components/EventDateTime";

interface EventCardProps {
  event: EventWithTexts;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { locale } = useParams();
  const { codeId } = useParams();
  const t = useTranslations("actions");
  const tEventCard = useTranslations("EventCard");

  return (
    <Card className="shadow-md border-primary/40 transition-shadow gap-4">
      <CardHeader className="relative gap-0">
        <CardTitle className="text-lg">{getEventTitle(event, locale as string)}</CardTitle>
        <CardDescription className="line-clamp-2 text-wrap">
          {getEventDescription(event, locale as string)}
        </CardDescription>

        <div className="flex flex-wrap items-center gap-1 mt-2">
          <Badge variant="outline">{toNormalCase(event.type)}</Badge>
          <Badge variant="outline">{toNormalCase(event.subType)}</Badge>

          {event.isForMinors ? (
            <Badge variant="outline" className="bg-green-300/50">
              {tEventCard("minorsAllowed")}
            </Badge>
          ) : (
            <Badge variant="outline">{tEventCard("onlyForAdults")}</Badge>
          )}

          {/* Published Status Indicator */}
          <Badge variant="outline" className={event.isPublished ? "border-green-500" : "border-yellow-500"}>
            {event.isPublished ? (
              <>
                <CheckCircleIcon className="h-3 w-3 mr-1 " />
                Published
              </>
            ) : (
              <>
                <EyeOffIcon className="h-3 w-3 mr-1" />
                Draft
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-2 text-xs">
          <EventDateTime
            startDate={event.startDate}
            endDate={event.endDate}
            locale={locale as string}
            timeZoneId={event.timeZoneId}
            timeZoneName={event.timeZoneName}
            variant="full"
          />

          {event.visitsLimit && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {tEventCard("visitsLimit")}: {event.visitsLimit} {tEventCard("visitors", { count: event.visitsLimit })}
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm" className="cursor-pointer">
            <BarChart /> {t("viewDetails")}
          </Button>

          {/* View Event Button - Only show if published */}
          {event.isPublished && (
            <Link
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              href={`/${locale}/event/${event.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" /> View Event
            </Link>
          )}

          <Link
            className={cn(buttonVariants({ variant: "default", size: "sm" }))}
            href={`/${locale}/dashboard/bus/${codeId}/new/1?slug=${event.slug}`}
          >
            <Pencil /> {t("edit")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventCard;
