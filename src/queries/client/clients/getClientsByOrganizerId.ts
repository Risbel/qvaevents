import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type ClientOnOrganizer = Array<
  Tables<"clientOnOrganizer"> & {
    ClientProfile: Tables<"ClientProfile">;
  }
>;

interface GetClientsParams {
  pageParam?: number;
  pageSize?: number;
}

const getClientsByOrganizerId = async (
  client: TypedSupabaseClient,
  organizerId: number,
  search?: string,
  searchField?: string,
  { pageParam = 0, pageSize = 30 }: GetClientsParams = {}
) => {
  // Build base query with inner join to ensure we only get clients with profiles
  const baseQuery = client.from("clientOnOrganizer").select("*, ClientProfile!inner(*)").eq("organizerId", organizerId);

  // Apply search filter if provided
  const filteredQuery =
    search && searchField ? baseQuery.ilike(`ClientProfile.${searchField}`, `%${search}%`) : baseQuery;

  // Get paginated data
  const { data, error } = await filteredQuery
    .order("createdAt", { ascending: false })
    .range(pageParam, pageParam + pageSize - 1);

  if (error) throw error;

  // Get total count of filtered results
  const { data: countResult } = await filteredQuery.select("id");
  const count = countResult?.length || 0;

  const nextCursor = count > pageParam + pageSize ? pageParam + pageSize : undefined;

  return {
    clients: data as ClientOnOrganizer,
    nextCursor,
    total: count || 0,
  };
};

export default getClientsByOrganizerId;
