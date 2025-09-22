import { EventWithTexts } from "@/hooks/events/getEventsByBusinessCodeId";

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

/**
 * Gets all available language codes for an event
 * @param event - The event object with texts
 * @returns Array of language codes
 */
export const getEventAvailableLanguages = (event: EventWithTexts): string[] => {
  return event.EventText.map((text) => text.Language.code);
};

/**
 * Checks if an event has text in a specific language
 * @param event - The event object with texts
 * @param locale - The target locale code
 * @returns True if the event has text in the specified language
 */
export const hasEventTextInLanguage = (event: EventWithTexts, locale: string): boolean => {
  return event.EventText.some((text) => text.Language.code === locale);
};
