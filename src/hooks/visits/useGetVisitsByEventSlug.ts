import { useInfiniteQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import getVisitsByEventSlug, { Visit } from "@/queries/client/visits/getVisitsByEventSlug";

export interface VisitsResponse {
  event: {
    id: number;
    visitsLimit: number;
  };
  visits: Visit;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  totalVisits: number;
  totalCompanions: number;
}

export interface UseGetVisitsByEventSlugOptions {
  pageSize?: number;
  enabled?: boolean;
  initialPage?: number;
}

const useGetVisitsByEventSlug = (
  slug: string,
  search?: string,
  searchField?: string,
  options: UseGetVisitsByEventSlugOptions = {}
) => {
  const { pageSize, enabled = true, initialPage = 1 } = options;
  const client = useSupabase();

  const query = useInfiniteQuery<VisitsResponse, Error>({
    queryKey: ["visits", slug, search, searchField, pageSize].filter(Boolean) as string[],
    queryFn: (context) =>
      getVisitsByEventSlug(client, slug, search, searchField, {
        page: context.pageParam as number,
        pageSize,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined),
    initialPageParam: initialPage,
    enabled: enabled && !!slug,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Calculate total items across all fetched pages
  const allVisits = query.data?.pages.flatMap((page) => page.visits) ?? [];
  const totalItems = allVisits.length;

  return {
    ...query,
    totalItems,
    allVisits,
  };
};

export default useGetVisitsByEventSlug;
