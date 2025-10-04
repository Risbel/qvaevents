"use client";

import { cn } from "@/lib/utils";
import { format, formatDistanceToNow, isSameDay, isToday, isTomorrow, isYesterday } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface EventDateTimeProps {
  startDate: string; // UTC date string from database
  endDate: string; // UTC date string from database
  locale: string;
  timeZoneId?: string | null; // Timezone ID from event (e.g., "America/Havana")
  timeZoneName?: string | null; // Timezone name from event (e.g., "Cuba Standard Time")
  twoRows?: boolean; // Show time on a separate line below the date
  showTimeZone?: boolean; // Show time zone
  className?: string;
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

// Format UTC date to local timezone using Intl.DateTimeFormat
const formatDateToLocal = (
  utcDateString: string,
  timeZoneId: string | null | undefined,
  locale: string,
  options: Intl.DateTimeFormatOptions = {}
) => {
  const utcDate = new Date(utcDateString);

  // If no timezone is provided, fall back to local timezone
  const timeZone = timeZoneId || Intl.DateTimeFormat().resolvedOptions().timeZone;

  return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-US", {
    timeZone,
    ...options,
  }).format(utcDate);
};

// Format only time from UTC date (always use en-US for uppercase AM/PM)
const formatTimeOnly = (utcDateString: string, timeZoneId: string | null | undefined, _locale: string) => {
  const utcDate = new Date(utcDateString);
  const timeZone = timeZoneId || Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Always use en-US locale to ensure uppercase AM/PM regardless of user locale
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone,
  }).format(utcDate);
};

// Get human-readable timezone name
const getTimezoneDisplay = (timeZoneId: string | null | undefined, timeZoneName: string | null | undefined) => {
  if (timeZoneName) {
    return timeZoneName;
  }

  if (timeZoneId) {
    // Convert timezone ID to a more readable format
    // e.g., "America/Havana" -> "Havana Time"
    const parts = timeZoneId.split("/");
    if (parts.length > 1) {
      const city = parts[parts.length - 1].replace(/_/g, " ");
      return `${city} Time`;
    }
    return timeZoneId;
  }

  return null;
};

export const EventDateTime = ({
  startDate,
  endDate,
  locale,
  timeZoneId,
  timeZoneName,
  twoRows = false,
  showTimeZone = true,
  className = "",
}: EventDateTimeProps) => {
  // Convert UTC dates to local time for display
  const startDateLocal = new Date(startDate);
  const endDateLocal = new Date(endDate);
  const dateFnsLocale = getDateFnsLocale(locale);

  // Check if it's the same day (using UTC dates for accurate comparison)
  const isSameDayEvent = isSameDay(startDateLocal, endDateLocal);

  // Check if event duration is more than 12 hours
  // Calculate duration using the actual time difference, not timezone conversion
  const startTime = new Date(startDate).getTime();
  const endTime = new Date(endDate).getTime();
  const durationInHours = (endTime - startTime) / (1000 * 60 * 60);
  const isLongEvent = durationInHours > 12;

  // Use compact variant logic for all cases
  if (isSameDayEvent || !isLongEvent) {
    // Same day event OR multi-day event with duration < 12 hours
    const dateFormatted = formatDateToLocal(startDate, timeZoneId, locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const startTime = formatTimeOnly(startDate, timeZoneId, locale);
    const endTime = formatTimeOnly(endDate, timeZoneId, locale);
    const timezoneDisplay = getTimezoneDisplay(timeZoneId, timeZoneName);

    if (twoRows) {
      return (
        <div className={cn("flex flex-wrap", className)}>
          <p>
            {dateFormatted} • {startTime} - {endTime}
          </p>
          {timezoneDisplay && showTimeZone && <p className="text-muted-foreground">({timezoneDisplay})</p>}
        </div>
      );
    }

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <p>
          {dateFormatted} • {startTime} - {endTime}
          {timezoneDisplay && showTimeZone && <span className="text-muted-foreground"> • {timezoneDisplay}</span>}
        </p>
      </div>
    );
  } else {
    // Multi-day event with duration >= 12 hours - show date range with time interval
    const startDateFormatted = formatDateToLocal(startDate, timeZoneId, locale, {
      month: "short",
      day: "numeric",
    });
    const endDateFormatted = formatDateToLocal(endDate, timeZoneId, locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const startTime = formatTimeOnly(startDate, timeZoneId, locale);
    const endTime = formatTimeOnly(endDate, timeZoneId, locale);
    const timezoneDisplay = getTimezoneDisplay(timeZoneId, timeZoneName);

    if (twoRows) {
      return (
        <div className={cn("flex items-center gap-2", className)}>
          <div className="font-medium">
            {startDateFormatted} - {endDateFormatted} • {startTime} - {endTime}
          </div>
          {timezoneDisplay && showTimeZone && <div className="text-muted-foreground">({timezoneDisplay})</div>}
        </div>
      );
    }

    return (
      <div className={cn("flex items-center gap-2", className)}>
        <p className="font-medium">
          {startDateFormatted} - {endDateFormatted} • {startTime} - {endTime}
          {timezoneDisplay && showTimeZone && <span className="text-muted-foreground"> • {timezoneDisplay}</span>}
        </p>
      </div>
    );
  }
};
