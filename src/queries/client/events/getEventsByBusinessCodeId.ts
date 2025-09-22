import { TypedSupabaseClient } from "@/types/supabase";
import { Tables } from "@/types/supabase";
import { Business } from "../business/getBusinessByCodeId";

export type Event = Tables<"Event">;
export type EventText = Tables<"EventText">;
export type Language = Tables<"Language">;

export type EventWithTexts = Event & {
  EventText: (EventText & {
    Language: Language;
  })[];
};

export async function getEventsByBusinessCodeId(client: TypedSupabaseClient, codeId: string) {
  const business = await client
    .from("Business")
    .select("id")
    .eq("codeId", codeId)
    .single()
    .then(({ data }) => data as Business);

  if (!business) {
    return {
      status: "error" as const,
      error: "Business not found",
    };
  }

  // Then get all events for this business
  const events = await client
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
    .order("createdAt", { ascending: false })
    .then(({ data }) => data as EventWithTexts[]);

  if (!events) {
    return {
      status: "error" as const,
      error: "Events not found",
    };
  }

  return {
    status: "success" as const,
    data: {
      events: (events || []) as EventWithTexts[],
    },
  };
}
