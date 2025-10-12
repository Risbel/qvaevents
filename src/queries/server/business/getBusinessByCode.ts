"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { Tables } from "@/types/supabase";

export type Business = Tables<"Business">;

export async function getBusinessByCode(codeId: string) {
  try {
    const supabase = await createClient();

    const { data: business, error } = await supabase
      .from("Business")
      .select("*")
      .eq("codeId", codeId)
      .eq("isDeleted", false)
      .eq("isActive", true)
      .single();

    if (error) {
      return {
        status: "error",
      } satisfies State;
    }

    return {
      status: "success",
      data: { business: business as Business },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
