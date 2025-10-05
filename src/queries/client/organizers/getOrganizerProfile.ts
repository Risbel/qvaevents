import { Tables } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export type OrganizerProfile = Tables<"OrganizerProfile">;
export type Business = Tables<"Business">;

export type OrganizerProfileWithBusiness = OrganizerProfile & {
  business: Business[];
};

export async function getOrganizerProfile(
  client: SupabaseClient,
  userId: string
): Promise<OrganizerProfileWithBusiness> {
  return (
    await client
      .from("OrganizerProfile")
      .select("* , business:Business(id, name, slug, logo, codeId)")
      .eq("user_id", userId)
      .eq("isDeleted", false)
      .single()
  ).data as OrganizerProfileWithBusiness;
}
