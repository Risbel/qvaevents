import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type Resource = Tables<"Resource">;

const getResources = async (client: TypedSupabaseClient) => {
  return await client
    .from("Resource")
    .select("*")
    .then(({ data }) => data as Resource[]);
};

export default getResources;
