import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Users,
  Pencil,
  ExternalLink,
  CheckCircleIcon,
  EyeOffIcon,
  MoreVertical,
  ListChecks,
  MessageSquare,
  CalendarClockIcon,
} from "lucide-react";
import { toNormalCase } from "@/utils/textFormating";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { getEventTitle, getEventDescription } from "./eventTextExtraction";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { EventWithTexts } from "@/queries/client/events/getEventsByBusinessCodeId";
import { EventDateTime } from "@/app/components/EventDateTime";
import EventDeleteAction from "./EventDeleteAction";
import EventSetFullAction from "./EventSetFullAction";
import Image from "next/image";

interface EventCardProps {
  event: EventWithTexts;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const { locale } = useParams();
  const { codeId } = useParams();
  const t = useTranslations("actions");
  const tStatus = useTranslations("status");
  const tEventCard = useTranslations("EventCard");

  const imageUrl = event.EventImage[0]?.url || "";
  const isExpired = new Date(event.endDate) < new Date();

  return (
    <Card
      className={cn(
        "shadow-md transition-shadow gap-4",
        isExpired ? "border-red-500/40 shadow-red-500/20" : "border-primary/40 shadow-primary/40"
      )}
    >
      <CardHeader className="relative gap-0">
        <div className="flex flex-row gap-2">
          {imageUrl && (
            <Image
              src={imageUrl}
              className="w-24 h-20 object-cover rounded-lg"
              loading="lazy"
              alt={getEventTitle(event, locale as string)}
              width={100}
              height={80}
            />
          )}
          <div>
            <CardTitle className="text-md">{getEventTitle(event, locale as string)}</CardTitle>
            <CardDescription className="line-clamp-2 text-wrap">
              {getEventDescription(event, locale as string)}
            </CardDescription>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1 mt-2">
          <Badge variant="outline">{toNormalCase(event.type)}</Badge>
          <Badge variant="outline">{toNormalCase(event.subType)}</Badge>

          {event.isForMinors ? (
            <Badge variant="outline" className="bg-green-300/50 shadow-md shadow-green-300/20">
              {tEventCard("minorsAllowed")}
            </Badge>
          ) : (
            <Badge variant="outline">{tEventCard("onlyForAdults")}</Badge>
          )}

          {/* Published Status Indicator */}
          {!isExpired && (
            <Badge
              variant="outline"
              className={
                event.isPublished
                  ? "border-green-500 shadow-md shadow-green-500/20"
                  : "border-yellow-500 shadow-md shadow-yellow-500/20"
              }
            >
              {event.isPublished ? (
                <>
                  <CheckCircleIcon className="h-3 w-3 text-green-500" />
                  {tEventCard("published")}
                </>
              ) : (
                <>
                  <EyeOffIcon className="h-3 w-3 text-yellow-500" />
                  {tEventCard("draft")}
                </>
              )}
            </Badge>
          )}
          {isExpired && (
            <Badge variant="outline" className="border-red-500 shadow-md shadow-red-500/20">
              <CalendarClockIcon className="h-3 w-3" />
              {tStatus("expired")}
            </Badge>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="absolute right-4">
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild className="cursor-pointer">
              {event.isPublished && (
                <Link href={`/${locale}/event/${event.slug}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" /> {tEventCard("viewEvent")}
                </Link>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href={`/${locale}/dashboard/bus/${codeId}/events/${event.slug}/visits`}
                className="flex items-center"
              >
                <ListChecks className="h-4 w-4" />
                {tEventCard("visits")}
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href={`/${locale}/dashboard/bus/${codeId}/events/${event.slug}/reviews`}
                className="flex items-center"
              >
                <MessageSquare className="h-4 w-4 text-primary" />
                {tEventCard("reviews")}
              </Link>
            </DropdownMenuItem> */}

            <DropdownMenuSeparator />

            {!isExpired && (
              <DropdownMenuItem asChild className="cursor-pointer ">
                <Link href={`/${locale}/dashboard/bus/${codeId}/new/1?slug=${event.slug}`}>
                  <Pencil className="h-4 w-4" /> {t("edit")}
                </Link>
              </DropdownMenuItem>
            )}
            <EventDeleteAction eventId={event.id} />

            {!isExpired && <EventSetFullAction eventId={event.id} isFull={event.isFull || false} />}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="relative">
        <div className="space-y-2 text-xs">
          <EventDateTime
            startDate={event.startDate}
            endDate={event.endDate}
            locale={locale as string}
            timeZoneId={event.timeZoneId}
            timeZoneName={event.timeZoneName}
            showTimeZone={false}
            className="text-lg font-bold"
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
      </CardContent>
    </Card>
  );
};

export default EventCard;
