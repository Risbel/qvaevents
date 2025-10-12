"use server";

import { createClient } from "@/utils/supabase/server";

export async function deleteEvent(eventId: number) {
  const supabase = await createClient();

  // Soft delete: mark event as deleted
  const { error, data } = await supabase
    .from("Event")
    .update({
      isDeleted: true,
    })
    .eq("id", eventId)
    .eq("isDeleted", false);

  if (error) {
    throw new Error("Failed to delete event");
  }

  return { success: true, data };
}
