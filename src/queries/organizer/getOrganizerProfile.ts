"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { Tables } from "@/types/supabase";

export type OrganizerProfile = Tables<"OrganizerProfile">;
export type Subscription = Tables<"Subscription">;
export type Plan = Tables<"Plan">;

export async function getOrganizerProfile(userId: string): Promise<State> {
  try {
    const supabase = await createClient();

    const { data: organizerProfiles, error } = await supabase
      .from("OrganizerProfile")
      .select("*")
      .eq("user_id", userId)
      .eq("isDeleted", false);

    if (error) {
      return {
        status: "error",
      } satisfies State;
    }

    const organizerProfile = organizerProfiles && organizerProfiles.length > 0 ? organizerProfiles[0] : null;

    return {
      status: "success",
      data: {
        organizerProfile: organizerProfile as OrganizerProfile,
      },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
