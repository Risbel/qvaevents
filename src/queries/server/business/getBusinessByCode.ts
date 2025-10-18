"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { Tables } from "@/types/supabase";

export type Business = Tables<"Business">;

export async function getBusinessByCode(codeId: string): Promise<State<Business>> {
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
      } satisfies State<Business>;
    }

    return {
      status: "success",
      data: business as Business,
    } as State<Business>;
  } catch (error) {
    return {
      status: "error",
    } as State<Business>;
  }
}
