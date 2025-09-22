import { Tables } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export type Event = Tables<"Event">;
export type EventText = Tables<"EventText">;
export type Language = Tables<"Language">;
export type EventImage = Tables<"EventImage">;

export type EventWithTextsAndImages = Event & {
  EventText: (EventText & {
    Language: Language;
  })[];
  EventImage: EventImage[];
};

export async function getEventBySlug(client: SupabaseClient, slug: string): Promise<EventWithTextsAndImages> {
  return await client
    .from("Event")
    .select(`*, EventText (*, Language (id, code, name, native, icon)), EventImage (*)`)
    .eq("slug", slug)
    .eq("isDeleted", false)
    .single()
    .then(({ data }) => data as EventWithTextsAndImages);
}
