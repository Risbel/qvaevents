import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import { getBusinessByCodeId } from "./getBusinessByCodeId";

function useGetBusinessByCodeId(codeId: string) {
  const client = useSupabase();
  const queryKey = ["business", codeId];

  return useQuery({
    queryKey,
    queryFn: () => getBusinessByCodeId(client, codeId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
export default useGetBusinessByCodeId;
