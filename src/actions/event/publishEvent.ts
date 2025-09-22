"use server";

import { createClient } from "@/utils/supabase/server";

export async function publishEvent(eventId: number) {
  try {
    const supabase = await createClient();

    // Update the event to set isPublished to true and step to 3
    const { data, error } = await supabase
      .from("Event")
      .update({ isPublished: true, step: 3 })
      .eq("id", eventId)
      .select()
      .single();

    if (error) {
      return {
        status: "error" as const,
        error: error.message,
      };
    }

    return {
      status: "success" as const,
      data: data,
    };
  } catch (error) {
    return {
      status: "error" as const,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
