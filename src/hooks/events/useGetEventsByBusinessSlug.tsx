import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import { getEventsByBusinessSlug } from "@/queries/client/events/getEventsByBusinessSlug";

const useGetEventsByBusinessSlug = (slug: string) => {
  const client = useSupabase();

  return useQuery({
    queryKey: ["events", slug],
    queryFn: () => getEventsByBusinessSlug(client, slug),
    staleTime: 1000 * 60 * 5 * 60, // 60 minutes
    enabled: !!slug,
  });
};

export default useGetEventsByBusinessSlug;
