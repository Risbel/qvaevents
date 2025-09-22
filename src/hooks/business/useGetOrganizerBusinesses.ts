import { useQuery } from "@tanstack/react-query";
import { getOrganizerBusinesses } from "./getOrganizerBusinesses";
import useSupabase from "../use-supabase";

const useGetOrganizerBusinesses = (organizerId: number) => {
  const client = useSupabase();
  const queryKey = ["organizerBusinesses", organizerId];
  const queryFn = () => getOrganizerBusinesses(client, organizerId);
  return useQuery({ queryKey, queryFn });
};

export default useGetOrganizerBusinesses;
