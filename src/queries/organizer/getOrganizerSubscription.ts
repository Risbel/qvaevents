"use server";

import { State } from "@/types/state";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

export type Subscription = Tables<"Subscription">;

export type Plan = Tables<"Plan">;

export type SubscriptionWithPlan = Subscription & {
  Plan: Plan;
};

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
        subscription: subscriptionData as SubscriptionWithPlan,
      },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
