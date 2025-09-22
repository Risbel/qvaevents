import { Tables } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export type OrganizerProfile = Tables<"OrganizerProfile">;
export type Subscription = Tables<"Subscription">;
export type Plan = Tables<"Plan">;

export async function getOrganizerProfile(client: SupabaseClient, userId: string): Promise<OrganizerProfile> {
  return (await client.from("OrganizerProfile").select("*").eq("user_id", userId).eq("isDeleted", false).single())
    .data as OrganizerProfile;
}
