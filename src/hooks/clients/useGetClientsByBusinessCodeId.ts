import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import { ClientsOnBusiness } from "@/queries/client/clients/getClientsByBusinessCodeId";
import getClientsByBusinessCodeId from "@/queries/client/clients/getClientsByBusinessCodeId";

export interface ClientsResponse {
  clients: ClientsOnBusiness;
  total: number;
  totalPages: number;
  currentPage: number;
}

const useGetClientsByBusinessCodeId = (
  codeId?: string,
  page: number = 1,
  pageSize: number = 30,
  search?: string,
  searchField?: string
) => {
  const client = useSupabase();

  return useQuery<ClientsResponse, Error>({
    queryKey: ["clients", page, pageSize, codeId, search, searchField].filter(Boolean),
    queryFn: () => getClientsByBusinessCodeId(client, codeId, page, pageSize, search, searchField),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!codeId,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetClientsByBusinessCodeId;
