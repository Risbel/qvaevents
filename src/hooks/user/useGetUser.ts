import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import getUser from "./getUser";

const useGetUser = () => {
  const client = useSupabase();
  const queryKey = ["user"];
  const queryFn = async () => {
    return getUser(client);
  };
  return useQuery({ queryKey, queryFn });
};

export default useGetUser;
