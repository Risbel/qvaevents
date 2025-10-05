import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import getUser from "@/queries/client/user/getUser";

const useGetUser = () => {
  const client = useSupabase();
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(client),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetUser;
