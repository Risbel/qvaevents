"use server";

import { createClient } from "@/utils/supabase/server";
import { deleteImage } from "@/utils/supabase/storage/client";

export async function deleteBusinessImage(imageId: number, imageUrl: string) {
  try {
    const supabase = await createClient();

    // Delete the image from storage first
    const { error: storageError } = await deleteImage(imageUrl);

    if (storageError) {
      return {
        status: "error" as const,
        error: storageError,
      };
    }

    // Then delete the database record
    const { error: dbError } = await supabase.from("BusinessImage").delete().eq("id", imageId);

    if (dbError) {
      return {
        status: "error" as const,
        error: dbError.message,
      };
    }

    return {
      status: "success" as const,
    };
  } catch (error) {
    return {
      status: "error" as const,
      error: "Failed to delete business image",
    };
  }
}
