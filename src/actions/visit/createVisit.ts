"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { z } from "zod";

const createVisitSchema = z.object({
  eventId: z.coerce.number().int().positive(),
  clientId: z.coerce.number().int().positive(),
  businessId: z.coerce.number().int().positive().optional(),
  companionsCount: z.string().min(0).max(30).default("0"),
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
    businessId: formData.get("businessId"),
    companionsCount: formData.get("companionsCount"),
  });

  if (!validation.success) {
    console.log(validation.error);
    return {
      status: "error",
      errors: { visit: ["Invalid payload"] },
    } satisfies State;
  }

  const { eventId, clientId, businessId, companionsCount } = validation.data;

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
      companionsCount: Number(companionsCount),
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

  if (businessId) {
    // Check if client is already registered with this business
    const { data: existingRelation, error: existingRelationError } = await supabase
      .from("clientOnBusiness")
      .select("id")
      .eq("clientId", clientId)
      .eq("businessId", businessId)
      .maybeSingle();

    // Only add if not already registered
    if (!existingRelation?.id) {
      const { error: insertError, data } = await supabase.from("clientOnBusiness").insert({
        clientId,
        businessId,
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
