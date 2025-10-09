import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import getMyClientProfile from "@/queries/client/me/getMyClientProfile";
import { Tables } from "@/types/supabase";

interface UseGetMyClientProfileOptions {
  enabled?: boolean;
}

const useGetMyClientProfile = (options?: UseGetMyClientProfileOptions) => {
  const client = useSupabase();
  return useQuery({
    queryKey: ["myClientProfile"],
    queryFn: () => getMyClientProfile(client),
    enabled: options?.enabled ?? true,
  });
};

export default useGetMyClientProfile;
