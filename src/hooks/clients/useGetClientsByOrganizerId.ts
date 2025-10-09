import { useInfiniteQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import getClientsByOrganizerId, { ClientOnOrganizer } from "@/queries/client/clients/getClientsByOrganizerId";

export interface ClientsResponse {
  clients: ClientOnOrganizer;
  nextCursor?: number;
  total: number;
}

const useGetClientsByOrganizerId = (organizerId: number | undefined, search?: string, searchField?: string) => {
  const client = useSupabase();

  return useInfiniteQuery<ClientsResponse, Error, ClientsResponse, (string | number | undefined)[], number>({
    queryKey: ["clients", organizerId, search, searchField].filter(Boolean),
    queryFn: (context) =>
      getClientsByOrganizerId(client, organizerId!, search, searchField, { pageParam: context.pageParam as number }),
    getNextPageParam: (lastPage: ClientsResponse) => lastPage.nextCursor,
    initialPageParam: 0,
    enabled: !!organizerId,
  });
};

export default useGetClientsByOrganizerId;
