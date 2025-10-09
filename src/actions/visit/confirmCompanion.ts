"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { z } from "zod";

const confirmCompanionSchema = z.object({
  visitId: z.coerce.number().int().positive(),
  clientId: z.coerce.number().int().positive(),
});

export async function confirmCompanion(prevState: State, formData: FormData): Promise<State> {
  const supabase = await createClient();

  if (!formData.get("clientId")) {
    return {
      status: "error",
      errors: { auth: ["You must be logged in to confirm"] },
    } satisfies State;
  }

  const validation = confirmCompanionSchema.safeParse({
    visitId: formData.get("visitId"),
    clientId: formData.get("clientId"),
  });

  if (!validation.success) {
    return {
      status: "error",
      errors: { validation: ["Invalid data"] },
    } satisfies State;
  }

  const { visitId, clientId } = validation.data;

  // Get the visit to check companions count
  const { data: visit, error: visitError } = await supabase
    .from("Visit")
    .select("companionsCount, ClientCompanion(id)")
    .eq("id", visitId)
    .single();

  if (visitError || !visit) {
    return {
      status: "error",
      errors: { visit: ["Visit not found"] },
    } satisfies State;
  }

  // Check if the visit has already reached the maximum number of companions
  const currentCompanionsCount = visit.ClientCompanion?.length || 0;

  if (currentCompanionsCount >= visit.companionsCount) {
    return {
      status: "error",
      errors: { capacity: ["This reservation cannot accept more companions. The limit has been reached."] },
    } satisfies State;
  }

  // Check if this client is already confirmed as a companion
  const { data: existingCompanion } = await supabase
    .from("ClientCompanion")
    .select("id")
    .eq("visitId", visitId)
    .eq("clientId", clientId)
    .maybeSingle();

  if (existingCompanion) {
    return {
      status: "error",
      errors: { duplicate: ["You have already confirmed your attendance for this visit"] },
    } satisfies State;
  }

  // Create the companion confirmation
  const { error: insertError } = await supabase.from("ClientCompanion").insert({
    visitId,
    clientId,
  });

  if (insertError) {
    return {
      status: "error",
      errors: { insert: ["Failed to confirm companion. Please try again."] },
    } satisfies State;
  }

  return {
    status: "success",
    data: {
      message: "Successfully confirmed as companion!",
    },
  } satisfies State;
}
