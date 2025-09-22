import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type Business = Tables<"Business">;

export async function getOrganizerBusinesses(client: TypedSupabaseClient, organizerId: number): Promise<Business[]> {
  return await client
    .from("Business")
    .select("*")
    .eq("organizerId", organizerId)
    .eq("isDeleted", false)
    .order("createdAt", { ascending: false })
    .then(({ data }) => data as Business[]);
}
