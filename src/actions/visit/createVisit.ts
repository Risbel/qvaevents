"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { z } from "zod";

const createVisitSchema = z.object({
  eventId: z.coerce.number().int().positive(),
  clientId: z.coerce.number().int().positive(),
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
  });
  if (!validation.success) {
    return {
      status: "error",
      errors: { visit: ["Invalid payload"] },
    } satisfies State;
  }

  const { eventId, clientId } = validation.data;

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

  const { error: insertError } = await supabase.from("Visit").insert({
    eventId,
    clientId,
    isAttended: false,
    isCanceled: false,
    isConfirmed: false,
    canceledAt: null,
    createdAt: new Date().toISOString(),
  });

  if (insertError) {
    return {
      status: "error",
      errors: { visit: ["Failed to create reservation"] },
    } satisfies State;
  }

  return { status: "success" } satisfies State;
}
