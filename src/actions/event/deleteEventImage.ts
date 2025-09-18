"use server";

import { createClient } from "@/utils/supabase/server";
import { deleteImage } from "@/utils/supabase/storage/client";
import { revalidatePath } from "next/cache";

export async function deleteEventImage(imageId: number, imageUrl: string) {
  try {
    const supabase = await createClient();

    // Delete from storage first
    const { error: storageError } = await deleteImage(imageUrl);

    if (storageError) {
      console.error("Storage deletion error:", storageError);
      // Continue with database deletion even if storage fails
    }

    // Delete from database
    const { error: dbError } = await supabase.from("EventImage").delete().eq("id", imageId);

    if (dbError) {
      return {
        status: "error" as const,
        error: dbError.message,
        data: null,
      };
    }

    // Revalidate the page to show updated images
    revalidatePath("/dashboard");

    return {
      status: "success" as const,
      data: { deleted: true },
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
