import { EventWithTexts } from "@/queries/client/events/getEventsByBusinessCodeId";

/**
 * Extracts the event title in the specified language
 * @param event - The event object with texts
 * @param locale - The target locale code
 * @param fallback - Optional fallback text if no title is found
 * @returns The localized title or fallback
 */
export const getEventTitle = (event: EventWithTexts, locale: string, fallback: string = "Untitled Event"): string => {
  const defaultText = event.EventText.find((text) => text.Language.code === locale);
  return defaultText?.title || event.EventText[0]?.title || fallback;
};

/**
 * Extracts the event description in the specified language
 * @param event - The event object with texts
 * @param locale - The target locale code
 * @returns The localized description or undefined
 */
export const getEventDescription = (event: EventWithTexts, locale: string): string | undefined => {
  const defaultText = event.EventText.find((text) => text.Language.code === locale);
  return defaultText?.description || event.EventText[0]?.description || undefined;
};

/**
 * Extracts the event location text in the specified language
 * @param event - The event object with texts
 * @param locale - The target locale code
 * @returns The localized location text or undefined
 */
export const getEventLocation = (event: EventWithTexts, locale: string): string | undefined => {
  const defaultText = event.EventText.find((text) => text.Language.code === locale);
  return defaultText?.locationText || event.EventText[0]?.locationText || undefined;
};
