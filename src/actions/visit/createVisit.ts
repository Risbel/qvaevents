"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { z } from "zod";

const createVisitSchema = z.object({
  eventId: z.coerce.number().int().positive(),
  clientId: z.coerce.number().int().positive(),
  organizerId: z.coerce.number().int().positive().optional(),
  companionsCount: z.coerce.number().int().min(0).max(10).default(0),
});

export async function createVisit(prevState: State, formData: FormData): Promise<State> {
  const supabase = await createClient();

  if (!formData.get("clientId")) {
    return {
      status: "error",
      errors: { profile: ["Unauthorized"] },
    } satisfies State;
  }

  const validation = createVisitSchema.safeParse({
    eventId: formData.get("eventId"),
    clientId: formData.get("clientId"),
    organizerId: formData.get("organizerId"),
    companionsCount: formData.get("companionsCount"),
  });

  if (!validation.success) {
    return {
      status: "error",
      errors: { visit: ["Invalid payload"] },
    } satisfies State;
  }

  const { eventId, clientId, organizerId, companionsCount } = validation.data;

  // Prevent duplicate reservations for the same event and client
  const { count: existingCount, error: existsError } = await supabase
    .from("Visit")
    .select("id", { count: "exact", head: true })
    .eq("eventId", eventId)
    .eq("clientId", clientId);

  if (!existsError && (existingCount ?? 0) > 0) {
    return {
      status: "error",
      errors: { visit: ["You already have a reservation for this event"] },
    } satisfies State;
  }

  const { error: insertError, data: visitData } = await supabase
    .from("Visit")
    .insert({
      eventId,
      clientId,
      companionsCount,
      isAttended: false,
      isCanceled: false,
      isConfirmed: false,
      canceledAt: null,
    })
    .select()
    .single();

  if (insertError) {
    return {
      status: "error",
      errors: { visit: ["Failed to create reservation"] },
    } satisfies State;
  }

  if (organizerId) {
    // Check if client is already registered with this organizer
    const { data: existingRelation, error: existingRelationError } = await supabase
      .from("clientOnOrganizer")
      .select("id")
      .eq("clientId", clientId)
      .eq("organizerId", organizerId)
      .maybeSingle();

    // Only add if not already registered
    if (!existingRelation?.id) {
      const { error: insertError, data } = await supabase.from("clientOnOrganizer").insert({
        clientId,
        organizerId,
      });
    }
  }

  return {
    status: "success",
    data: {
      visitCode: visitData.code,
      companionsCount: companionsCount,
    },
  } satisfies State;
}
