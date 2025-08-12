"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { Tables } from "@/types/supabase";

export type Business = Tables<"Business">;

export async function getOrganizerBusinesses(organizerId: number): Promise<State> {
  try {
    const supabase = await createClient();

    const { data: businesses, error } = await supabase
      .from("Business")
      .select("*")
      .eq("organizerId", organizerId)
      .eq("isDeleted", false)
      .order("createdAt", { ascending: false });

    if (error) {
      return {
        status: "error",
      } satisfies State;
    }

    return {
      status: "success",
      data: { businesses: businesses as Business[] },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
