import useSupabase from "../use-supabase";
import { useQuery } from "@tanstack/react-query";
import { getOrganizerProfile } from "@/queries/client/organizers/getOrganizerProfile";

const useGetOrganizerProfile = (userId: string) => {
  const client = useSupabase();
  const queryKey = ["organizer"];

  const queryFn = async () => {
    return getOrganizerProfile(client, userId);
  };
  return useQuery({ queryKey, queryFn, enabled: !!userId });
};

export default useGetOrganizerProfile;
