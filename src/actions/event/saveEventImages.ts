"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveEventImages(eventId: number, imageUrls: string[], fileSizes?: number[]) {
  try {
    const supabase = await createClient();

    // Prepare image data for insertion
    const imageData = imageUrls.map((url, index) => ({
      eventId,
      url,
      type: "poster", // or you can determine this based on context
      size: fileSizes?.[index] || null,
    }));

    // Insert images into EventImage table
    const { data, error } = await supabase.from("EventImage").insert(imageData).select();

    if (error) {
      return {
        status: "error" as const,
        error: error.message,
        data: null,
      };
    }

    const { error: updateError } = await supabase.from("Event").update({ step: 2 }).eq("id", eventId).lt("step", 2); // Only update if current step is less than 2

    if (updateError) {
      return {
        status: "error" as const,
        error: updateError.message,
        data: null,
      };
    }

    return {
      status: "success" as const,
      data: { images: data },
      error: null,
    };
  } catch (error) {
    return {
      status: "error" as const,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      data: null,
    };
  }
}
