import { TypedSupabaseClient } from "@/types/supabase";
import { User } from "@supabase/supabase-js";

const getUser = async (client: TypedSupabaseClient): Promise<User> => {
  return client.auth.getUser().then(({ data }) => data.user as User);
};

export default getUser;
