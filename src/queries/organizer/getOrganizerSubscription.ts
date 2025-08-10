"client";

import { State } from "@/types/state";
import { createClient } from "@/utils/supabase/server";

export async function getOrganizerSubscription(organizerId: number): Promise<State> {
  try {
    const supabase = await createClient();

    const { data: subscriptionData, error } = await supabase
      .from("Subscription")
      .select(
        `
        *,
        Plan (
          id,
          name,
          type,
          price
        )
      `
      )
      .eq("organizerId", organizerId)
      .eq("status", 1)
      .single();

    if (error) {
      return {
        status: "error",
      } satisfies State;
    }

    return {
      status: "success",
      data: {
        subscription: subscriptionData,
      },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
