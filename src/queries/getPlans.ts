"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";

import { Tables } from "@/types/supabase";

export type Plan = Tables<"Plan">;

export async function getActivePlans(): Promise<State> {
  try {
    const supabase = await createClient();

    const { data: plans, error } = await supabase
      .from("Plan")
      .select("*")
      .eq("isActive", true)
      .order("price", { ascending: true });

    if (error) {
      return {
        status: "error",
      } satisfies State;
    }

    return {
      status: "success",
      data: {
        plans: plans as Plan[],
      },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
