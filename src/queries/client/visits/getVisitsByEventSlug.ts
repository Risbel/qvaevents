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
  page?: number; // Changed from pageParam to page for clarity
  pageSize?: number;
}

const getVisitsByEventSlug = async (
  client: TypedSupabaseClient,
  slug: string,
  search?: string,
  searchField?: string,
  { page = 1, pageSize = 20 }: GetVisitsParams = {}
) => {
  // Get event data first
  const eventResponse = await client.from("Event").select("id, visitsLimit").eq("slug", slug).single();
  const eventData = eventResponse.data as Event;

  // Build base query for paginated data
  let query = client
    .from("Visit")
    .select(
      `
      id,
      createdAt,
      companionsCount,
      ClientProfile!inner(
        id,
        name,
        email,
        username,
        avatar
      ),
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
    `,
      { count: "exact" }
    )
    .eq("eventId", eventData.id)
    .order("createdAt", { ascending: false });

  // Apply search filter if provided
  if (search && searchField) {
    query = query.ilike(`ClientProfile.${searchField}`, `%${search}%`);
  }

  // Execute queries in parallel - get paginated data and total counts
  const [{ data, error, count: filteredCount }, { count: totalVisitsCount }, companionsData] = await Promise.all([
    // Get paginated data with companions count
    query.range((page - 1) * pageSize, (page - 1) * pageSize + pageSize - 1),
    // Just get the count, no data needed
    client.from("Visit").select("*", { count: "exact", head: true }).eq("eventId", eventData.id),
    // Fetch just companionsCount column for aggregation
    client.from("Visit").select("companionsCount").eq("eventId", eventData.id),
  ]);

  if (error) throw error;

  if (totalVisitsCount === null) throw new Error("Total visits not found");

  // Calculate total companions from the aggregated data
  const totalCompanions = companionsData.data?.reduce((acc, visit) => acc + (visit.companionsCount || 0), 0) || 0;

  // Use filtered count for pagination (count comes from the main query now)
  const totalPages = Math.ceil((filteredCount ?? 0) / pageSize);

  // Check if there's a next page
  const hasNextPage = page < totalPages;

  return {
    event: eventData,
    visits: data as Visit,
    currentPage: page,
    totalPages,
    hasNextPage,
    totalVisits: totalVisitsCount, // Total visits and total companions to display (totalVisits + totalCompanions/event.visitsLimit)
    totalCompanions,
  };
};

export default getVisitsByEventSlug;
