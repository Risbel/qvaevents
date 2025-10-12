import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import getClientsByOrganizerId, { ClientOnOrganizer } from "@/queries/client/clients/getClientsByOrganizerId";
import { Tables } from "@/types/supabase";

export interface ClientsResponse {
  clients: ClientOnOrganizer;
  total: number;
  totalPages: number;
  currentPage: number;
  organizerProfile: Tables<"OrganizerProfile">;
}

const useGetClientsByOrganizerId = (page: number = 1, pageSize: number = 30, search?: string, searchField?: string) => {
  const client = useSupabase();

  return useQuery<ClientsResponse, Error>({
    queryKey: ["clients", page, pageSize, search, searchField].filter(Boolean),
    queryFn: () => getClientsByOrganizerId(client, page, pageSize, search, searchField),
  });
};

export default useGetClientsByOrganizerId;
