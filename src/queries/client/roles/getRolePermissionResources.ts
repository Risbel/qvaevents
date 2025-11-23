import React from "react";
import { TypedSupabaseClient } from "@/types/supabase";
import { Tables } from "@/types/supabase";

export type RolePermissionResource = Tables<"rolePermissionResource">;
export type Resource = Tables<"Resource">;

export type RolePermissionResourceWithResource = RolePermissionResource & {
  Resource?: Resource;
};

const getRolePermissionResources = async (client: TypedSupabaseClient, roleId: number, permissionId: number) => {
  return await client
    .from("rolePermissionResource")
    .select(
      `*,
			Resource(
				id,
				name,
				description,
				key
			)
		`
    )
    .eq("roleId", roleId)
    .eq("permissionId", permissionId)
    .then(({ data }) => data as RolePermissionResourceWithResource[]);
};

export default getRolePermissionResources;
