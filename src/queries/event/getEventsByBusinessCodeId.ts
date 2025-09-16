import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

export type Event = Tables<"Event">;
export type EventText = Tables<"EventText">;
export type Language = Tables<"Language">;

export type EventWithTexts = Event & {
  EventText: (EventText & {
    Language: Language;
  })[];
};

export async function getEventsByBusinessCodeId(codeId: string) {
  const supabase = await createClient();

  try {
    // First get the business by codeId to get the businessId
    const { data: business, error: businessError } = await supabase
      .from("Business")
      .select("id")
      .eq("codeId", codeId)
      .eq("isDeleted", false)
      .single();

    if (businessError) {
      return {
        status: "error" as const,
        error: businessError.message,
      };
    }

    if (!business) {
      return {
        status: "error" as const,
        error: "Business not found",
      };
    }

    // Then get all events for this business
    const { data, error } = await supabase
      .from("Event")
      .select(
        `
        *,
        EventText (
          *,
          Language (
            id,
            code,
            name,
            native,
            icon
          )
        )
      `
      )
      .eq("businessId", business.id)
      .eq("isDeleted", false)
      .order("createdAt", { ascending: false });

    if (error) {
      return {
        status: "error" as const,
        error: error.message,
      };
    }

    return {
      status: "success" as const,
      data: {
        events: (data || []) as EventWithTexts[],
      },
    };
  } catch (error) {
    return {
      status: "error" as const,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
