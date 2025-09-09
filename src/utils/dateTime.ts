/**
 * Utility functions for date and time handling
 */

/**
 * Converts local date and time to UTC for database storage
 * @param date - Date object in local timezone
 * @param time - Time string in format "HH:mm"
 * @returns UTC Date object
 */
export function convertLocalToUTC(date: Date, time: string): Date {
  // Create a date object with the local date and time
  const localDateTime = new Date(`${date.toISOString().split("T")[0]}T${time}`);

  // Convert to UTC by adjusting for timezone offset
  return new Date(localDateTime.getTime() - localDateTime.getTimezoneOffset() * 60000);
}

/**
 * Converts UTC date from database back to local time for display
 * @param utcDateString - UTC date string from database
 * @returns Local Date object
 */
export function convertUTCToLocal(utcDateString: string): Date {
  const utcDate = new Date(utcDateString);

  // Convert UTC back to local time
  return new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
}

/**
 * Formats a date for display in a readable format
 * @param date - Date object
 * @param includeTime - Whether to include time in the format
 * @param locale - Locale string (e.g., 'en', 'es')
 * @returns Formatted date string
 */
export function formatDateForDisplay(date: Date, includeTime: boolean = false, locale: string = "en"): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (includeTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }

  return date.toLocaleDateString(locale, options);
}

/**
 * Formats a date range for display
 * @param startDate - Start date object
 * @param startTime - Start time string
 * @param endDate - End date object
 * @param endTime - End time string
 * @param locale - Locale string (e.g., 'en', 'es')
 * @returns Formatted date range string
 */
export function formatDateRange(
  startDate: Date,
  startTime: string,
  endDate: Date,
  endTime: string,
  locale: string = "en"
): string {
  const startFormatted = formatDateForDisplay(startDate, false, locale);
  const endFormatted = formatDateForDisplay(endDate, false, locale);

  return `${startFormatted} ${startTime} - ${endFormatted} ${endTime}`;
}
