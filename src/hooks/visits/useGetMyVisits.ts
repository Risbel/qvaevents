import { useInfiniteQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import getMyVisits from "@/queries/client/visits/getMyVisits";

const useGetMyVisits = (clientId?: number, limit: number = 10) => {
  const client = useSupabase();
  return useInfiniteQuery({
    queryKey: ["myVisits", clientId, limit],
    queryFn: ({ pageParam = 1 }) => getMyVisits(client, { clientId, page: pageParam, limit }),
    getNextPageParam: (lastPage, pages) => (lastPage.hasMore ? pages.length + 1 : undefined),
    initialPageParam: 1,
  });
};

export default useGetMyVisits;
