import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import { getEventsByBusinessCodeId } from "@/queries/client/events/getEventsByBusinessCodeId";

const useGetEventsByBusinessCodeId = (codeId: string) => {
  const client = useSupabase();
  return useQuery({
    queryKey: ["events", codeId],
    queryFn: () => getEventsByBusinessCodeId(client, codeId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export default useGetEventsByBusinessCodeId;
