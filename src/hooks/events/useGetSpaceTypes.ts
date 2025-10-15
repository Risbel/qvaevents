import { useQuery } from "@tanstack/react-query";
import { getSpaceTypes } from "@/queries/client/events/getSpaceTypes";
import useSupabase from "../use-supabase";

const useGetSpaceTypes = () => {
  const client = useSupabase();

  return useQuery({
    queryKey: ["spaceTypes"],
    queryFn: () => getSpaceTypes(client),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export default useGetSpaceTypes;
