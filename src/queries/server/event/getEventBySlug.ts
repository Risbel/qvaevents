import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

export type Event = Tables<"Event">;
export type EventText = Tables<"EventText">;
export type Language = Tables<"Language">;
export type EventImage = Tables<"EventImage">;
export type Business = Tables<"Business">;
export type Type = Tables<"Type">;
export type SubType = Tables<"SubType">;
export type SpaceType = Tables<"SpaceType">;
export type AccessType = Tables<"AccessType">;

export type EventWithTextsAndImagesAndBusiness = Event & {
  EventText: (EventText & {
    Language: Language;
  })[];
  EventImage: EventImage[];
  Business: Business;
  Type: Type;
  SubType: SubType;
  SpaceType: SpaceType;
  AccessType: AccessType;
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
      .select(
        `*, 
        EventText (*, Language (id, code, name, native, icon)), 
        EventImage (*), 
        Type (id, name, labelEn, labelEs, icon), 
        SubType (id, name, labelEn, labelEs, icon), 
        SpaceType (id, name, labelEn, labelEs), 
        AccessType (id, name, labelEn, labelEs), 
        Business (*)`
      )
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
