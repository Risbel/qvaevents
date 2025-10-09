import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import getMyOrganizerProfile from "@/queries/client/organizers/getMyOrganizerProfile";

const useGetMyOrganizerProfile = (options?: { enabled?: boolean }) => {
  const client = useSupabase();

  return useQuery({
    queryKey: ["myOrganizerProfile"],
    queryFn: () => getMyOrganizerProfile(client),
    enabled: options?.enabled ?? true,
  });
};

export default useGetMyOrganizerProfile;
