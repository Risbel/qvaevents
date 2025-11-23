import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";
import getRolesByCode from "@/queries/client/roles/getRoles";

const useGetRoles = (codeId: string) => {
  const client = useSupabase();
  return useQuery({
    queryKey: ["roles", codeId],
    queryFn: () => getRolesByCode(client, codeId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    enabled: !!codeId,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetRoles;
