import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import { getEventsByBusinessCodeId } from "@/queries/client/events/getEventsByBusinessCodeId";

const useGetEventsByBusinessCodeId = (codeId: string, status: string = "upcoming") => {
  const client = useSupabase();
  return useQuery({
    queryKey: ["events", codeId, status],
    queryFn: () => getEventsByBusinessCodeId(client, codeId, status),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useGetEventsByBusinessCodeId;
