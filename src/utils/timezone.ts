import { parseISO, subSeconds, formatISO } from "date-fns";

export interface TimezoneData {
  timeZoneId: string;
  timeZoneName: string;
  dstOffset: number; // seconds since epoch (noting daylight saving time offset)
  rawOffset: number; // seconds since epoch (raw offset from UTC)
}

interface TimezoneApiResponse {
  status: string;
  timeZoneId?: string;
  timeZoneName?: string;
  dstOffset?: number;
  rawOffset?: number;
  errorMessage?: string;
}

/**
 * Fetches timezone data from Google Timezone API
 */
async function fetchTimezoneData(lat: number, lng: number, timestamp: number, apiKey: string): Promise<TimezoneData> {
  const params = new URLSearchParams({
    location: `${lat},${lng}`,
    timestamp: String(timestamp),
    key: apiKey,
  });

  const response = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?${params}`, {
    cache: "no-store",
  });

  const data: TimezoneApiResponse = await response.json();

  if (data.status !== "OK" || !data.timeZoneId || !data.timeZoneName) {
    throw new Error(data.errorMessage || "Failed to resolve timezone for coordinates");
  }

  return {
    timeZoneId: data.timeZoneId,
    timeZoneName: data.timeZoneName,
    dstOffset: data.dstOffset || 0,
    rawOffset: data.rawOffset || 0,
  };
}

/**
 * Converts local datetime to UTC using timezone offset
 */
function dateTimeToUTC(localDateTime: string, totalOffsetSeconds: number): string {
  const localDate = parseISO(`${localDateTime}Z`); // Parse as if it's UTC
  const utcDate = subSeconds(localDate, totalOffsetSeconds); // Subtract offset to get true UTC
  return formatISO(utcDate);
}

/**
 * Main function:
 * - Gets timezone data associated with the event coordinates. 🌍 (using google maps api)
 * - Converts the local dates to UTC using the timezone offset obtained from the timezone data. 🕒
 *
 * UTC returned are relative to the place where the event is taking place. 👀
 */
export async function processEventDates(
  lat: number,
  lng: number,
  startDateTime: string,
  endDateTime: string,
  apiKey: string
): Promise<{
  timezoneData: TimezoneData;
  startDateUTC: string;
  endDateUTC: string;
}> {
  // convert into timestamp for fetchTimezoneData (google only accepts timestamp in seconds since epoch)
  const timestamp = Math.floor(parseISO(`${startDateTime}Z`).getTime() / 1000);
  // Fetch timezone data from google maps api
  const timezoneData = await fetchTimezoneData(lat, lng, timestamp, apiKey);

  const totalOffset = timezoneData.dstOffset + timezoneData.rawOffset;

  return {
    timezoneData,
    startDateUTC: dateTimeToUTC(startDateTime, totalOffset),
    endDateUTC: dateTimeToUTC(endDateTime, totalOffset),
  };
}

/**
 * - Converts a UTC date from database in the target timezone (using Intl.DateTimeFormat)
 * - Returns a Date object in the target timezone
 */
export function getDateInTimezone(utcDateString: string, timeZoneId: string): Date {
  console.log("utcDateString: ", utcDateString);

  // Use en-US locale to ensure consistent MM/DD/YYYY format
  const dateString = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZoneId,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(utcDateString));

  // Parse the formatted string back to a Date object
  // Format is: MM/DD/YYYY, HH:mm:ss
  const [datePart, timePart] = dateString.split(", ");
  const [month, day, year] = datePart.split("/");
  const [hour, minute, second] = timePart.split(":");

  // Create a new Date object with the local time values
  return new Date(
    parseInt(year),
    parseInt(month) - 1, // Month is 0-indexed
    parseInt(day),
    parseInt(hour),
    parseInt(minute),
    parseInt(second)
  );
}
