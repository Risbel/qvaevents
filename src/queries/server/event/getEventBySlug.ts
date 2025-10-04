import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

export type Event = Tables<"Event">;
export type EventText = Tables<"EventText">;
export type Language = Tables<"Language">;
export type EventImage = Tables<"EventImage">;
export type Business = Tables<"Business">;

export type EventWithTextsAndImagesAndBusiness = Event & {
  EventText: (EventText & {
    Language: Language;
  })[];
  EventImage: EventImage[];
  Business: Business;
};

export async function getEventBySlug(slug: string) {
  if (!slug) {
    return {
      status: "error" as const,
      error: "Event not found",
    };
  }
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("Event")
      .select(`*, EventText (*, Language (id, code, name, native, icon)), EventImage (*), Business (*)`)
      .eq("slug", slug)
      .eq("isDeleted", false)
      .single();

    if (error) {
      return {
        status: "error" as const,
        error: error.message,
      };
    }

    if (!data) {
      return {
        status: "error" as const,
        error: "Event not found",
      };
    }

    return {
      status: "success" as const,
      data: {
        event: data as EventWithTextsAndImagesAndBusiness,
      },
    };
  } catch (error) {
    return {
      status: "error" as const,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
