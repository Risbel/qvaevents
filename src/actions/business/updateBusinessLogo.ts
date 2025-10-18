"use server";

import { createClient } from "@/utils/supabase/server";

export async function updateBusinessLogo(businessId: number, logoUrl: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("Business").update({ logo: logoUrl }).eq("id", businessId);

    if (error) {
      return { status: "error" as const, error };
    }

    return { status: "success" as const };
  } catch (error) {
    return { status: "error" as const, error };
  }
}
