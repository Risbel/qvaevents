import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type Event = {
  id: number;
  visitsLimit: number;
};

export type Visit = Array<
  Tables<"Visit"> & {
    ClientProfile: Tables<"ClientProfile">;
    ClientCompanion: Array<{
      id: number;
      clientId: number;
      ClientProfile: Tables<"ClientProfile">;
    }>;
  }
>;

interface GetVisitsParams {
  pageParam?: number;
  pageSize?: number;
}

const getVisitsByEventSlug = async (
  client: TypedSupabaseClient,
  slug: string,
  search?: string,
  searchField?: string,
  { pageParam = 0, pageSize = 30 }: GetVisitsParams = {}
) => {
  const eventData = await client
    .from("Event")
    .select("id, visitsLimit")
    .eq("slug", slug)
    .single()
    .then(({ data }) => data as Event);

  // Build base query with inner join to ensure we only get visits with profiles
  const baseQuery = client
    .from("Visit")
    .select(
      `
      *,
      ClientProfile!inner(*),
      ClientCompanion(
        id,
        clientId,
        ClientProfile(
          id,
          name,
          email,
          username,
          avatar
        )
      )
    `
    )
    .eq("eventId", eventData.id);

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
    event: eventData,
    visits: data as Visit,
    nextCursor,
    total: count || 0,
  };
};

export default getVisitsByEventSlug;
