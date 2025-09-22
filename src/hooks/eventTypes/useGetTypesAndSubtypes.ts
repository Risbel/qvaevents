import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import { getTypesAndSubtypes } from "@/queries/client/eventTypes/getTypesAndSubtypes";

const useGetTypesAndSubtypes = () => {
  const client = useSupabase();

  return useQuery({
    queryKey: ["typesAndSubtypes"],
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    queryFn: () => getTypesAndSubtypes(client),
  });
};

export default useGetTypesAndSubtypes;
