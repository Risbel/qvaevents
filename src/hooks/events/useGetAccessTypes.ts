import { getAccessTypes } from "@/queries/client/events/getAccessType";
import useSupabase from "../use-supabase";
import { useQuery } from "@tanstack/react-query";

const useGetAccessTypes = () => {
  const client = useSupabase();

  return useQuery({
    queryKey: ["accessTypes"],
    queryFn: () => getAccessTypes(client),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export default useGetAccessTypes;
