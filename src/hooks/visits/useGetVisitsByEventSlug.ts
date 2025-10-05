import { useInfiniteQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import getVisitsByEventSlug, { Visit } from "@/queries/client/visits/getVisitsByEventSlug";

export interface VisitsResponse {
  event: {
    id: number;
    visitsLimit: number;
  };
  visits: Visit;
  nextCursor?: number;
  total: number;
}

const useGetVisitsByEventSlug = (slug: string, search?: string, searchField?: string) => {
  const client = useSupabase();

  return useInfiniteQuery<VisitsResponse, Error, VisitsResponse, (string | undefined)[], number>({
    queryKey: ["visits", slug, search, searchField].filter(Boolean) as string[],
    queryFn: (context) =>
      getVisitsByEventSlug(client, slug, search, searchField, { pageParam: context.pageParam as number }),
    getNextPageParam: (lastPage: VisitsResponse) => lastPage.nextCursor,
    initialPageParam: 0,
    enabled: !!slug,
  });
};

export default useGetVisitsByEventSlug;
