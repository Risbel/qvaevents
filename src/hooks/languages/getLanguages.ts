import { Tables } from "@/types/supabase";
import { SupabaseClient } from "@supabase/supabase-js";

export type Language = Tables<"Language">;

export async function getLanguages(client: SupabaseClient): Promise<Language[]> {
  return await client
    .from("Language")
    .select("*")
    .order("name")
    .then(({ data }) => data as Language[]);
}
