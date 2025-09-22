import { useQuery } from "@tanstack/react-query";

import useSupabase from "../use-supabase";
import { getEventBySlug } from "@/queries/client/events/getEventBySlug";

const useGetEventBySlug = (slug: string) => {
  const client = useSupabase();
  return useQuery({
    queryKey: ["event", slug],
    queryFn: () => getEventBySlug(client, slug),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
export default useGetEventBySlug;
