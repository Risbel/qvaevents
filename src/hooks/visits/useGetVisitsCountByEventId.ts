import getVisitsCountByEventId from "@/queries/client/visits/getVisitsCountByEventId";
import useSupabase from "../use-supabase";
import { useQuery } from "@tanstack/react-query";

const useGetVisitsCountByEventId = (eventId: number) => {
  const client = useSupabase();

  return useQuery({
    queryKey: ["visitsCount", eventId],
    queryFn: () => getVisitsCountByEventId(client, eventId),
  });
};

export default useGetVisitsCountByEventId;
