"use client";

import { format, formatDistanceToNow, isSameDay, isToday, isTomorrow, isYesterday } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface EventDateTimeProps {
  startDate: string; // UTC date string from database
  endDate: string; // UTC date string from database
  locale: string;
  variant?: "full" | "compact" | "relative" | "time-only" | "date-only";
}

const getDateFnsLocale = (locale: string) => {
  switch (locale) {
    case "es":
      return es;
    case "en":
      return enUS;
    default:
      return enUS;
  }
};

export const EventDateTime = ({ startDate, endDate, locale, variant = "full" }: EventDateTimeProps) => {
  // Convert UTC dates to local time for display
  const startDateLocal = new Date(startDate);
  const endDateLocal = new Date(endDate);
  const dateFnsLocale = getDateFnsLocale(locale);

  // Check if it's the same day
  const isSameDayEvent = isSameDay(startDateLocal, endDateLocal);

  // Check if event duration is more than 12 hours
  const durationInHours = (endDateLocal.getTime() - startDateLocal.getTime()) / (1000 * 60 * 60);
  const isLongEvent = durationInHours > 12;

  if (variant === "time-only") {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="font-medium">{format(startDateLocal, "h:mm a", { locale: dateFnsLocale })}</span>
        <span>-</span>
        <span className="font-medium">{format(endDateLocal, "h:mm a", { locale: dateFnsLocale })}</span>
      </div>
    );
  }

  if (variant === "date-only") {
    return (
      <div className="text-xs">
        <p className="font-medium">{format(startDateLocal, "EEEE, MMMM d, yyyy", { locale: dateFnsLocale })}</p>
        {!isSameDayEvent && (
          <p className="text-muted-foreground">
            to {format(endDateLocal, "EEEE, MMMM d, yyyy", { locale: dateFnsLocale })}
          </p>
        )}
      </div>
    );
  }

  if (variant === "relative") {
    const now = new Date();
    const isEventToday = isToday(startDateLocal);
    const isEventTomorrow = isTomorrow(startDateLocal);
    const isEventYesterday = isYesterday(startDateLocal);

    let relativeText = "";
    if (isEventToday) {
      relativeText = "Today";
    } else if (isEventTomorrow) {
      relativeText = "Tomorrow";
    } else if (isEventYesterday) {
      relativeText = "Yesterday";
    } else {
      relativeText = formatDistanceToNow(startDateLocal, { addSuffix: true, locale: dateFnsLocale });
    }

    return (
      <div className="text-xs">
        <p className="font-medium">{relativeText}</p>
        <p className="text-muted-foreground">
          {format(startDateLocal, "h:mm a", { locale: dateFnsLocale })} -{" "}
          {format(endDateLocal, "h:mm a", { locale: dateFnsLocale })}
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    if (isSameDayEvent || !isLongEvent) {
      // Same day event or short duration
      return (
        <div className="text-xs">
          <p className="font-medium">
            {format(startDateLocal, "MMM d, yyyy", { locale: dateFnsLocale })} •{" "}
            {format(startDateLocal, "h:mm a", { locale: dateFnsLocale })} -{" "}
            {format(endDateLocal, "h:mm a", { locale: dateFnsLocale })}
          </p>
        </div>
      );
    } else {
      // Multi-day event or long duration - no time shown
      return (
        <div className="text-xs">
          <p className="font-medium">
            {format(startDateLocal, "MMM d", { locale: dateFnsLocale })} -{" "}
            {format(endDateLocal, "MMM d, yyyy", { locale: dateFnsLocale })}
          </p>
        </div>
      );
    }
  }

  // Full variant (default)
  if (isSameDayEvent || !isLongEvent) {
    return (
      <div className="text-xs">
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-medium">{format(startDateLocal, "EEEE, MMMM d, yyyy", { locale: dateFnsLocale })}</span>
          <span>•</span>
          <span className="text-muted-foreground">
            {format(startDateLocal, "h:mm a", { locale: dateFnsLocale })} -{" "}
            {format(endDateLocal, "h:mm a", { locale: dateFnsLocale })}
          </span>
        </div>
      </div>
    );
  } else {
    return (
      <div className="text-xs">
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-medium">
            {format(startDateLocal, "EEEE, MMMM d", { locale: dateFnsLocale })} -{" "}
            {format(endDateLocal, "EEEE, MMMM d, yyyy", { locale: dateFnsLocale })}
          </span>
        </div>
      </div>
    );
  }
};
