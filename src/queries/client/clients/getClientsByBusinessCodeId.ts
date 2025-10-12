import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type ClientsOnBusiness = Array<
  Tables<"clientOnBusiness"> & {
    ClientProfile: Tables<"ClientProfile">;
  }
>;

const getClientsByBusinessCodeId = async (
  client: TypedSupabaseClient,
  codeId?: string,
  page: number = 1,
  pageSize: number = 30,
  search?: string,
  searchField?: string
) => {
  if (!codeId || codeId === "") {
    throw new Error("Code ID is required");
  }

  const { data: businessProfile, error: businessError } = await client
    .from("Business")
    .select("*")
    .eq("codeId", codeId)
    .single();

  if (businessError || !businessProfile) {
    throw new Error("Businessnot found");
  }

  // Calculate offset based on page
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Build base query with inner join to ensure we only get clients with profiles
  let query = client
    .from("clientOnBusiness")
    .select("*, ClientProfile!inner(*)", { count: "exact" })
    .eq("businessId", businessProfile.id);

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
    clients: data as ClientsOnBusiness,
    total,
    totalPages,
    currentPage: page,
  };
};

export default getClientsByBusinessCodeId;
