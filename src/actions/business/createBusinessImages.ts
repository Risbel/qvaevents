"use server";

import { createClient } from "@/utils/supabase/server";

export async function createBusinessImages(businessId: number, imageUrls: string[], fileSizes?: number[]) {
  try {
    const supabase = await createClient();

    const imageData = imageUrls.map((url, index) => ({
      businessId,
      url,
      size: fileSizes?.[index] || null,
    }));

    const { data, error } = await supabase.from("BusinessImage").insert(imageData).select();

    if (error) {
      return {
        status: "error" as const,
        error: error.message,
        data: null,
      };
    }

    return {
      status: "success" as const,
      data: data,
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
