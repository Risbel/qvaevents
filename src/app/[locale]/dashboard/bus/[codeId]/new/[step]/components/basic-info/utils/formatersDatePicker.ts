/**
 * Converts a date and time from the date picker to a date time string
 * @param date - date from the date picker
 * @param time - time from the date picker
 * @returns The date time string eg. 2025-01-01T00:00:00
 */
export const joinDateAndTime = (date: Date, time: string) => {
  if (!date || !time) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T${time}`;
};
