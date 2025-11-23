"use server";

import { createClient } from "@/utils/supabase/server";

type CreateRolePermissionResourceResult =
  | { status: "success"; data: { id: number } }
  | { status: "error"; error: string };

export async function createRolePermissionResource(
  roleId: number,
  permissionId: number,
  resourceId: number
): Promise<CreateRolePermissionResourceResult> {
  try {
    const supabase = await createClient();

    // Check if the relationship already exists
    const { data: existing, error: checkError } = await supabase
      .from("rolePermissionResource")
      .select("id")
      .eq("roleId", roleId)
      .eq("permissionId", permissionId)
      .eq("resourceId", resourceId)
      .single();

    if (existing) {
      return {
        status: "error",
        error: "Resource permission already exists for this role",
      };
    }

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is what we want
      return {
        status: "error",
        error: checkError.message,
      };
    }

    const { data, error } = await supabase
      .from("rolePermissionResource")
      .insert({
        roleId,
        permissionId,
        resourceId,
      })
      .select("id")
      .single();

    if (error) {
      return {
        status: "error",
        error: error.message,
      };
    }

    return {
      status: "success",
      data: { id: data.id },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return {
      status: "error",
      error: message,
    };
  }
}
