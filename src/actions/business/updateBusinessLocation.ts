"use server";

import { createClient } from "@/utils/supabase/server";

type UpdateBusinessLocationResult = { status: "success" } | { status: "error"; error: string };

export async function updateBusinessLocation(
  businessId: number,
  lat: number,
  lng: number
): Promise<UpdateBusinessLocationResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("Business").update({ lat, lng }).eq("id", businessId);

    if (error) {
      return {
        status: "error",
        error: error.message,
      };
    }

    return { status: "success" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return {
      status: "error",
      error: message,
    };
  }
}
