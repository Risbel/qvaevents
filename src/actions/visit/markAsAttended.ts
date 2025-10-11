"use server";

import { createClient } from "@/utils/supabase/server";

export async function markAsAttended(visitId: number) {
  const supabase = await createClient();

  // Update the visit to mark as attended
  const { error, data } = await supabase
    .from("Visit")
    .update({
      isAttended: true,
    })
    .eq("id", visitId)
    .eq("isCanceled", false);

  if (error) {
    throw new Error("Failed to mark visit as attended");
  }

  return { success: true, data };
}
