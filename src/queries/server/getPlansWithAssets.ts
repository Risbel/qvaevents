"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { Tables } from "@/types/supabase";

export type Plan = Tables<"Plan">;
export type PlanPrice = Tables<"PlanPrice">;
export type Asset = Tables<"Asset">;

export type PlanWithPrices = Plan & {
  PlanPrice: (PlanPrice & {
    Asset: Asset;
  })[];
};

export async function getPlansWithAssets(): Promise<State> {
  try {
    const supabase = await createClient();

    const { data: plans, error } = await supabase
      .from("Plan")
      .select(
        `
        *,
        PlanPrice(
          *,
          Asset(*)
        )
      `
      )
      .eq("isActive", true)
      .eq("PlanPrice.isActive", true)
      .eq("PlanPrice.Asset.isActive", true);

    console.log(plans);
    console.log(error);
    console.log(error?.message);
    if (error) {
      console.log(error);
      return {
        status: "error",
      } satisfies State;
    }

    // Extract unique assets from the plans data
    const assetsMap = new Map();
    (plans as PlanWithPrices[]).forEach((plan) => {
      plan.PlanPrice.forEach((planPrice) => {
        if (planPrice.Asset && !assetsMap.has(planPrice.Asset.id)) {
          assetsMap.set(planPrice.Asset.id, planPrice.Asset);
        }
      });
    });
    const assets = Array.from(assetsMap.values());

    return {
      status: "success",
      data: {
        plans: plans as PlanWithPrices[],
        assets,
      },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
