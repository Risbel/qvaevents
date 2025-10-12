import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import getVisitsByEventSlug, { Visit, Event } from "@/queries/client/visits/getVisitsByEventSlug";

export interface VisitsResponse {
  event: {
    id: number;
    visitsLimit: number | null;
    slug: string;
  };
  visits: Visit;
  total: number;
  totalPages: number;
  currentPage: number;
  totalVisits: number;
  totalCompanions: number;
}

const useGetVisitsByEventSlug = (
  slug: string,
  page: number = 1,
  pageSize: number = 30,
  search?: string,
  searchField?: string
) => {
  const client = useSupabase();

  return useQuery<VisitsResponse, Error>({
    queryKey: ["visits", slug, page, pageSize, search, searchField].filter(Boolean),
    queryFn: () => getVisitsByEventSlug(client, slug, page, pageSize, search, searchField),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

export default useGetVisitsByEventSlug;
