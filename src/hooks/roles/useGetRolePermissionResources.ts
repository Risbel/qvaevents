import getRolePermissionResources from "@/queries/client/roles/getRolePermissionResources";
import { useQuery } from "@tanstack/react-query";
import useSupabase from "../use-supabase";

const useGetRolePermissionResources = (roleId: number, permissionId: number) => {
  const client = useSupabase();
  return useQuery({
    queryKey: ["rolePermissionResources", roleId, permissionId],
    queryFn: () => getRolePermissionResources(client, roleId, permissionId),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export default useGetRolePermissionResources;
