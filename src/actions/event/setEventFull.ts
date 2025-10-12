"use server";

import { createClient } from "@/utils/supabase/server";

export async function setEventFull(eventId: number, isFull: boolean) {
  const supabase = await createClient();

  // Update event full status
  const { error, data } = await supabase
    .from("Event")
    .update({
      isFull: isFull,
    })
    .eq("id", eventId);

  if (error) {
    throw new Error("Failed to update event status");
  }

  return { success: true, data };
}
