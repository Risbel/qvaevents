"use client";

import { format, formatDistanceToNow, isSameDay, isToday, isTomorrow, isYesterday } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface EventDateTimeProps {
  startDate: string; // UTC date string from database
  endDate: string; // UTC date string from database
  locale: string;
  timeZoneId?: string | null; // Timezone ID from event (e.g., "America/Havana")
  timeZoneName?: string | null; // Timezone name from event (e.g., "Cuba Standard Time")
  variant?: "full" | "compact" | "relative" | "time-only" | "date-only";
  twoRows?: boolean; // Show time on a separate line below the date
  showTimeZone?: boolean; // Show time zone
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
  variant = "full",
  twoRows = false,
  showTimeZone = true,
}: EventDateTimeProps) => {
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
    const startTime = formatTimeOnly(startDate, timeZoneId, locale);
    const endTime = formatTimeOnly(endDate, timeZoneId, locale);
    const timezoneDisplay = getTimezoneDisplay(timeZoneId, timeZoneName);

    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="font-medium">{startTime}</span>
        <span>-</span>
        <span className="font-medium">{endTime}</span>
        {timezoneDisplay && showTimeZone && (
          <>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground">{timezoneDisplay}</span>
          </>
        )}
      </div>
    );
  }

  if (variant === "date-only") {
    const startDateFormatted = formatDateToLocal(startDate, timeZoneId, locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const endDateFormatted = formatDateToLocal(endDate, timeZoneId, locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timezoneDisplay = getTimezoneDisplay(timeZoneId, timeZoneName);

    return (
      <div className="text-xs">
        <p className="font-medium">
          {startDateFormatted}
          {timezoneDisplay && <span className="text-muted-foreground"> • {timezoneDisplay}</span>}
        </p>
        {!isSameDayEvent && showTimeZone && (
          <p className="text-muted-foreground">
            to {endDateFormatted}
            {timezoneDisplay && <span> • {timezoneDisplay}</span>}
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

    const startTime = formatTimeOnly(startDate, timeZoneId, locale);
    const endTime = formatTimeOnly(endDate, timeZoneId, locale);
    const timezoneDisplay = getTimezoneDisplay(timeZoneId, timeZoneName);

    return (
      <div className="text-xs">
        <p className="font-medium">{relativeText}</p>
        <p className="text-muted-foreground">
          {startTime} - {endTime}
          {timezoneDisplay && showTimeZone && <span> • {timezoneDisplay}</span>}
        </p>
      </div>
    );
  }

  if (variant === "compact") {
    if (isSameDayEvent || !isLongEvent) {
      // Same day event or short duration
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
          <div className="text-xs">
            <div className="font-medium">
              {dateFormatted} • {startTime} - {endTime}
            </div>
            {timezoneDisplay && showTimeZone && <div className="text-muted-foreground">({timezoneDisplay})</div>}
          </div>
        );
      }

      return (
        <div className="text-xs">
          <p className="font-medium">
            {dateFormatted} • {startTime} - {endTime}
            {timezoneDisplay && showTimeZone && <span className="text-muted-foreground"> • {timezoneDisplay}</span>}
          </p>
        </div>
      );
    } else {
      // Multi-day event or long duration - no time shown
      const startDateFormatted = formatDateToLocal(startDate, timeZoneId, locale, {
        month: "short",
        day: "numeric",
      });
      const endDateFormatted = formatDateToLocal(endDate, timeZoneId, locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const timezoneDisplay = getTimezoneDisplay(timeZoneId, timeZoneName);

      if (twoRows) {
        return (
          <div className="text-xs">
            <div className="font-medium">
              {startDateFormatted} - {endDateFormatted}
            </div>
            {timezoneDisplay && showTimeZone && <div className="text-muted-foreground">({timezoneDisplay})</div>}
          </div>
        );
      }

      return (
        <div className="text-xs">
          <p className="font-medium">
            {startDateFormatted} - {endDateFormatted}
            {timezoneDisplay && showTimeZone && <span className="text-muted-foreground"> • {timezoneDisplay}</span>}
          </p>
        </div>
      );
    }
  }

  // Full variant (default)
  if (isSameDayEvent || !isLongEvent) {
    const dateFormatted = formatDateToLocal(startDate, timeZoneId, locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const startTime = formatTimeOnly(startDate, timeZoneId, locale);
    const endTime = formatTimeOnly(endDate, timeZoneId, locale);
    const timezoneDisplay = getTimezoneDisplay(timeZoneId, timeZoneName);

    if (twoRows) {
      return (
        <div className="text-xs">
          <div className="font-medium">{dateFormatted}</div>
          <div className="text-muted-foreground">
            {startTime} - {endTime}
            {timezoneDisplay && showTimeZone && <span> • ({timezoneDisplay})</span>}
          </div>
        </div>
      );
    }

    return (
      <div className="text-xs">
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-medium">{dateFormatted}</span>
          <span>•</span>
          <span className="text-muted-foreground">
            {startTime} - {endTime}
            {timezoneDisplay && showTimeZone && <span> • {timezoneDisplay}</span>}
          </span>
        </div>
      </div>
    );
  } else {
    const startDateFormatted = formatDateToLocal(startDate, timeZoneId, locale, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    const endDateFormatted = formatDateToLocal(endDate, timeZoneId, locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timezoneDisplay = getTimezoneDisplay(timeZoneId, timeZoneName);

    if (twoRows) {
      return (
        <div className="text-xs">
          <div className="font-medium">
            {startDateFormatted} - {endDateFormatted}
          </div>
          {timezoneDisplay && showTimeZone && <div className="text-muted-foreground">({timezoneDisplay})</div>}
        </div>
      );
    }

    return (
      <div className="text-xs">
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-medium">
            {startDateFormatted} - {endDateFormatted}
            {timezoneDisplay && showTimeZone && <span className="text-muted-foreground"> • {timezoneDisplay}</span>}
          </span>
        </div>
      </div>
    );
  }
};
