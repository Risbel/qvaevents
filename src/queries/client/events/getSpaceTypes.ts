import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type SpaceType = Tables<"SpaceType">;

export const getSpaceTypes = async (client: TypedSupabaseClient) => {
  return await client
    .from("SpaceType")
    .select("*")
    .then(({ data }) => data as SpaceType[]);
};
