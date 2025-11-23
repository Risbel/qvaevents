import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import getPermissions from "@/queries/client/roles/getPermissions";

const useGetPermissions = () => {
  const client = useSupabase();
  return useQuery({
    queryKey: ["permissions"],
    queryFn: () => getPermissions(client),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export default useGetPermissions;
