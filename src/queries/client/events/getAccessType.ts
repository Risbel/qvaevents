import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type AccessType = Tables<"AccessType">;

export async function getAccessTypes(client: TypedSupabaseClient) {
  return await client
    .from("AccessType")
    .select("*")
    .eq("isActive", true)
    .then(({ data }) => data as AccessType[]);
}
