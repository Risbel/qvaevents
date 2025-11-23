"use server";

import { createClient } from "@/utils/supabase/server";

export async function deleteRole(roleId: number) {
  const supabase = await createClient();

  const { error } = await supabase.from("Role").delete().eq("id", roleId);

  if (error) {
    throw new Error("Failed to delete role");
  }

  return {
    status: "success" as const,
    data: { deleted: true },
    error: null,
  };
}
