import { Tables } from "@/types/supabase";
import { TypedSupabaseClient } from "@/types/supabase";

export type Permission = Tables<"Permission">;

const getPermissions = async (client: TypedSupabaseClient) => {
  return await client
    .from("Permission")
    .select("*")
    .then(({ data }) => data as Permission[]);
};

export default getPermissions;
