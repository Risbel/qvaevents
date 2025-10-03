import { TypedSupabaseClient } from "@/types/supabase";
import { Tables } from "@/types/supabase";

const getMyClientProfile = async (client: TypedSupabaseClient): Promise<Tables<"ClientProfile"> | null> => {
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError || !userData?.user) {
    return null;
  }

  const { data, error } = await client.from("ClientProfile").select("*").eq("user_id", userData.user.id).single();

  if (error) {
    return null;
  }

  return data as Tables<"ClientProfile">;
};

export default getMyClientProfile;
