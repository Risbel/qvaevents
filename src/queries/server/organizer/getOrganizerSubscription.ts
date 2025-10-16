"use server";

import { State } from "@/types/state";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

export type Subscription = Tables<"Subscription">;
export type SubscriptionHistory = Tables<"SubscriptionHistory">;
export type Plan = Tables<"Plan">;
export type PlanPrice = Tables<"PlanPrice">;
export type Asset = Tables<"Asset">;

export type SubscriptionWithPlanPriceAndAsset = Subscription & {
  SubscriptionHistory: SubscriptionHistory[];
  Plan: Plan;
  PlanPrice: PlanPrice & {
    Asset: Asset;
  };
};

export async function getOrganizerSubscription(organizerId: number): Promise<State> {
  try {
    const supabase = await createClient();

    const { data: subscriptionData, error } = await supabase
      .from("Subscription")
      .select(
        `
        *,
        SubscriptionHistory (
          *,
          PlanPrice (
            *,
            Asset (*)
          )
        ),
        Plan (
          id,
          name,
          type
        ),
        PlanPrice (
          *,
          Asset (
            id,
            symbol,
            code,
            type
          )
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
        subscription: subscriptionData as SubscriptionWithPlanPriceAndAsset,
      },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
