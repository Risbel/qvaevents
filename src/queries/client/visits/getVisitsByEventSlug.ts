import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type Event = {
  id: number;
  visitsLimit: number;
};

export type Visit = Array<
  Tables<"Visit"> & {
    ClientProfile: Tables<"ClientProfile">;
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

  let query = client.from("Visit").select("*, ClientProfile!inner(*)").eq("eventId", eventData.id);

  // Only apply search if both search term and field are provided
  if (search && searchField) {
    query = query.ilike(`ClientProfile.${searchField}`, `%${search}%`);
  }

  const { data: countData } = await query.select("id");
  const total = countData?.length || 0;

  const { data, error } = await query
    .select("*, ClientProfile(*)")
    .order("createdAt", { ascending: false })
    .range(pageParam, pageParam + pageSize - 1);

  if (error) throw error;

  const nextCursor = total > pageParam + pageSize ? pageParam + pageSize : undefined;

  return {
    event: eventData,
    visits: data as Visit,
    nextCursor,
    total,
  };
};

export default getVisitsByEventSlug;
