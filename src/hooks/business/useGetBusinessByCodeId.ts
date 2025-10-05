import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import { getBusinessByCodeId } from "@/queries/client/business/getBusinessByCodeId";

function useGetBusinessByCodeId(codeId: string) {
  const client = useSupabase();

  return useQuery({
    queryKey: ["business", codeId],
    queryFn: () => getBusinessByCodeId(client, codeId),
    staleTime: Infinity,
    enabled: !!codeId,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
}
export default useGetBusinessByCodeId;
