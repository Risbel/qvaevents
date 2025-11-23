import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import getResources from "@/queries/client/roles/getResources";

const useGetResources = () => {
  const client = useSupabase();
  return useQuery({
    queryKey: ["resources"],
    queryFn: () => getResources(client),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export default useGetResources;
