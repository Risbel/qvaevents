import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type ClientOnOrganizer = Array<
  Tables<"clientOnOrganizer"> & {
    ClientProfile: Tables<"ClientProfile">;
  }
>;

const getClientsByOrganizerId = async (
  client: TypedSupabaseClient,
  page: number = 1,
  pageSize: number = 30,
  search?: string,
  searchField?: string
) => {
  // Get current user
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Get organizer profile
  const { data: organizerProfile, error: organizerError } = await client
    .from("OrganizerProfile")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (organizerError || !organizerProfile) {
    throw new Error("Organizer profile not found");
  }

  // Calculate offset based on page
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Build base query with inner join to ensure we only get clients with profiles
  let query = client
    .from("clientOnOrganizer")
    .select("*, ClientProfile!inner(*)", { count: "exact" })
    .eq("organizerId", organizerProfile.id);

  // Apply search filter if provided
  if (search && searchField) {
    query = query.ilike(`ClientProfile.${searchField}`, `%${search}%`);
  }

  // Get paginated data with count
  const { data, error, count: totalCount } = await query.order("createdAt", { ascending: false }).range(from, to);

  if (error) throw error;

  const total = totalCount || 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    clients: data as ClientOnOrganizer,
    total,
    totalPages,
    currentPage: page,
    organizerProfile,
  };
};

export default getClientsByOrganizerId;
