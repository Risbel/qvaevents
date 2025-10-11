"use server";

import { createClient } from "@/utils/supabase/server";

export async function cancelVisit(visitId: number) {
  const supabase = await createClient();

  // Update the visit to mark as canceled
  const { error, data } = await supabase
    .from("Visit")
    .update({
      isCanceled: true,
    })
    .eq("id", visitId)
    .eq("isCanceled", false); // Only cancel if not already canceled

  if (error) {
    throw new Error("Failed to cancel visit");
  }

  return { success: true, data };
}
