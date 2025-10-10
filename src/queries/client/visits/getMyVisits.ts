import { TypedSupabaseClient, Tables } from "@/types/supabase";

export type VisitWithEvent = Tables<"Visit"> & {
  Event: Tables<"Event"> & {
    EventImage: Tables<"EventImage">[];
    EventText: Tables<"EventText">[];
    Business: Tables<"Business">;
  };
  ClientCompanion: Array<
    Tables<"ClientCompanion"> & {
      ClientProfile: Tables<"ClientProfile">;
    }
  >;
};

interface GetMyVisitsParams {
  clientId?: number;
  page?: number;
  limit?: number;
}

interface GetMyVisitsResponse {
  visits: VisitWithEvent[];
  hasMore: boolean;
  total: number;
}

const getMyVisits = async (
  client: TypedSupabaseClient,
  { clientId, page = 1, limit = 10 }: GetMyVisitsParams
): Promise<GetMyVisitsResponse> => {
  if (!clientId) throw new Error("Unauthorized to access this page");

  const start = (page - 1) * limit;
  const end = start + limit;

  const [{ count }, { data, error }] = await Promise.all([
    client.from("Visit").select("*", { count: "exact", head: true }).eq("clientId", Number(clientId)),
    client
      .from("Visit")
      .select(
        `
        *, 
        Event(*, EventImage(*), EventText(*, Language(*)), Business(*)),
        ClientCompanion(*, ClientProfile(*))
      `
      )
      .eq("clientId", Number(clientId))
      .order("createdAt", { ascending: false })
      .range(start, end - 1),
  ]);

  if (error) throw error;

  return {
    visits: data as unknown as VisitWithEvent[],
    hasMore: count ? count > end : false,
    total: count || 0,
  };
};

export default getMyVisits;
