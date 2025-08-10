"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";

export interface Plan {
  id: number;
  name: string;
  type: string;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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
        plans: plans || [],
      },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
