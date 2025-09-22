import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type Types = Tables<"Types">;
export type SubType = Tables<"SubType">;

export interface TypeWithSubTypes extends Types {
  SubType: SubType[];
}

export async function getTypesAndSubtypes(client: TypedSupabaseClient) {
  const { data, error } = await client.from("Types").select("*, SubType(*)");
  if (error) throw error;
  return data as TypeWithSubTypes[];
}
