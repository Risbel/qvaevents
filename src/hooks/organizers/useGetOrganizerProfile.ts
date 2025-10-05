import useSupabase from "../use-supabase";
import { useQuery } from "@tanstack/react-query";
import { getOrganizerProfile } from "@/queries/client/organizers/getOrganizerProfile";

const useGetOrganizerProfile = (userId: string) => {
  const client = useSupabase();

  return useQuery({ queryKey: ["organizer"], queryFn: () => getOrganizerProfile(client, userId), enabled: !!userId });
};

export default useGetOrganizerProfile;
