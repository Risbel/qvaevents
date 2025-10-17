"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";

export async function updateProfilePicture(organizerId: number, imageUrl: string): Promise<State> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("OrganizerProfile")
      .update({
        logo: imageUrl,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", organizerId);

    if (error) {
      return {
        status: "error",
        errors: {
          profile: ["Failed to update profile picture"],
        },
      } satisfies State;
    }

    return {
      status: "success",
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
      errors: {
        profile: ["Failed to update profile picture"],
      },
    } satisfies State;
  }
}
