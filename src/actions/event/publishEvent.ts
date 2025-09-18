"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function publishEvent(eventId: number) {
  try {
    const supabase = await createClient();

    // Update the event to set isPublished to true
    const { data, error } = await supabase
      .from("Event")
      .update({ isPublished: true })
      .eq("id", eventId)
      .select()
      .single();

    if (error) {
      return {
        status: "error" as const,
        error: error.message,
      };
    }

    // Revalidate the dashboard to show updated event status
    revalidatePath("/dashboard");

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
