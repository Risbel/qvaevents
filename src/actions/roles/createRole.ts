"use server";

import { createClient } from "@/utils/supabase/server";

type CreateRoleResult = { status: "success"; data: { id: number } } | { status: "error"; error: string };

export async function createRole(businessId: number, name: string): Promise<CreateRoleResult> {
  try {
    const supabase = await createClient();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return {
        status: "error",
        error: "Role name is required",
      };
    }

    const { data, error } = await supabase
      .from("Role")
      .insert({
        businessId,
        name: trimmedName,
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
