import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type Type = Tables<"Type">;
export type SubType = Tables<"SubType">;

export interface TypesWithSubTypes extends Type {
  SubType: SubType[];
}

export async function getTypesAndSubtypes(client: TypedSupabaseClient) {
  const { data, error } = await client.from("Type").select("*, SubType(*)");
  if (error) throw error;
  return data as TypesWithSubTypes[];
}
