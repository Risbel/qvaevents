import { TypedSupabaseClient } from "@/types/supabase";
import { Tables } from "@/types/supabase";

export type Business = Tables<"Business">;
export type Event = Tables<"Event">;
export type EventText = Tables<"EventText">;
export type Language = Tables<"Language">;
export type EventImage = Tables<"EventImage">;

export type BusinessWithEvents = Business & {
  Events: Array<
    Event & {
      EventText: Array<
        EventText & {
          Language: Language;
        }
      >;
      EventImage: EventImage[];
    }
  >;
};

export async function getEventsByBusinessSlug(client: TypedSupabaseClient, slug: string) {
  const { data, error } = await client
    .from("Business")
    .select(
      `
      *,
      Events:Event (
        *,
        EventText (
          *,
          Language (*)
        ),
        EventImage (*)
      )
    `
    )
    .eq("slug", slug)
    .eq("Events.isDeleted", false)
    .gte("Events.endDate", new Date().toISOString())
    .maybeSingle();

  if (error || !data?.Events?.length) {
    return {
      status: "error" as const,
      error: error?.message || "No events found",
    };
  }

  return {
    status: "success" as const,
    data: data as unknown as BusinessWithEvents,
  };
}
