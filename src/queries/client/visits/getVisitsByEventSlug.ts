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
    clientVisitAffiliated: {
      id: number;
      clientId: number;
      createdAt: string;
      ClientProfile: Tables<"ClientProfile">;
    } | null;
  }
>;

const getVisitsByEventSlug = async (
  client: TypedSupabaseClient,
  slug: string,
  page: number = 1,
  pageSize: number = 30,
  search?: string,
  searchField?: string
) => {
  // Get event data
  const { data: eventData, error: eventError } = await client
    .from("Event")
    .select("id, visitsLimit, slug")
    .eq("slug", slug)
    .single();

  if (eventError || !eventData) {
    throw new Error("Event not found");
  }

  // Calculate offset based on page
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Build base query for paginated data
  let query = client
    .from("Visit")
    .select(
      `
      id,
      createdAt,
      companionsCount,
      isAttended,
      isCanceled,
      isConfirmed,
      ClientProfile!inner(
        id,
        name,
        email,
        phone,
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
          phone,
          username,
          avatar
        )
      ), 
      clientVisitAffiliated(
        id,
        clientId,
        createdAt,
        ClientProfile(
          id,
          name,
          phone,
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
    // Get paginated data with count
    query.range(from, to),
    // Get total visits count
    client.from("Visit").select("*", { count: "exact", head: true }).eq("eventId", eventData.id),
    // Get companions count data
    client.from("Visit").select("companionsCount").eq("eventId", eventData.id),
  ]);

  if (error) throw error;

  if (totalVisitsCount === null) throw new Error("Total visits not found");

  // Calculate total companions from the aggregated data
  const totalCompanions = companionsData.data?.reduce((acc, visit) => acc + (visit.companionsCount || 0), 0) || 0;

  // Use filtered count for pagination
  const total = filteredCount ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    event: eventData,
    visits: data as Visit,
    total,
    totalPages,
    currentPage: page,
    totalVisits: totalVisitsCount,
    totalCompanions,
  };
};

export default getVisitsByEventSlug;
