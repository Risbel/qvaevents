import { TypedSupabaseClient } from "@/types/supabase";
import { Tables } from "@/types/supabase";
import { Business } from "../business/getBusinessByCodeId";

export type Event = Tables<"Event">;
export type EventText = Tables<"EventText">;
export type Language = Tables<"Language">;
export type EventImage = Tables<"EventImage">;

export type EventWithTexts = Event & {
  EventText: (EventText & {
    Language: Language;
  })[];
  EventImage: EventImage[];
};

export async function getEventsByBusinessCodeId(
  client: TypedSupabaseClient,
  codeId: string,
  status: string = "upcoming"
) {
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

  const now = new Date().toISOString();

  // Build the query based on status filter
  let query = client
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
        ),
        EventImage (
          id,
          url,
          type
        )
      `
    )
    .eq("isDeleted", false)
    .eq("businessId", business.id);

  // Apply date filter based on status
  if (status === "upcoming") {
    query = query.gte("endDate", now);
  } else if (status === "expired") {
    query = query.lt("endDate", now);
  }

  const events = await query.order("createdAt", { ascending: false }).then(({ data }) => data as EventWithTexts[]);

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
