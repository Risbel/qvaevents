import { useQuery } from "@tanstack/react-query";
import { getLanguages } from "./getLanguages";
import useSupabase from "../use-supabase";

const useGetLanguages = () => {
  const client = useSupabase();
  return useQuery({
    queryKey: ["languages"],
    queryFn: () => getLanguages(client),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export default useGetLanguages;
