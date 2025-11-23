"use server";

import { createClient } from "@/utils/supabase/server";

type DeleteRolePermissionResourceResult = { status: "success" } | { status: "error"; error: string };

export async function deleteRolePermissionResource(
  roleId: number,
  permissionId: number,
  resourceId: number
): Promise<DeleteRolePermissionResourceResult> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("rolePermissionResource")
      .delete()
      .eq("roleId", roleId)
      .eq("permissionId", permissionId)
      .eq("resourceId", resourceId);

    if (error) {
      return {
        status: "error",
        error: error.message,
      };
    }

    return { status: "success" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return {
      status: "error",
      error: message,
    };
  }
}
