import { TypedSupabaseClient } from "@/types/supabase";

const getVisitsCountByEventId = async (client: TypedSupabaseClient, eventId: number) => {
  const { data: visits, error } = await client
    .from("Visit")
    .select(
      `
      id,
      companionsCount
    `
    )
    .eq("eventId", eventId)
    .not("isCanceled", "eq", true); // Don't count canceled visits

  if (error) throw error;

  // Calculate total count including companions
  const totalCount = visits?.reduce((acc, visit) => acc + 1 + (visit.companionsCount || 0), 0) || 0;

  return {
    visitsCount: visits?.length || 0,
    companionsCount: visits?.reduce((acc, visit) => acc + (visit.companionsCount || 0), 0) || 0,
    totalCount,
  };
};

export default getVisitsCountByEventId;
