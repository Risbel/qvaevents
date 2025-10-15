import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import { getConfigsByBusinessCodeId } from "@/queries/client/events/getConfigsByBusinessCodeId";

const useGetConfigsByBusinessCodeId = (codeId: string) => {
  const client = useSupabase();

  return useQuery({
    queryKey: ["configs", codeId],
    queryFn: () => getConfigsByBusinessCodeId(client, codeId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !!codeId,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetConfigsByBusinessCodeId;
