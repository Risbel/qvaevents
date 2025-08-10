"use server";

import { createClient } from "@/utils/supabase/server";
import { SubscriptionStatus } from "@/utils/subscriptionStatus";
import { State } from "@/types/state";

export interface OrganizerProfile {
  id: number;
  isDeleted: boolean;
  isActive: boolean;
  updatedAt: string;
  user_id: string;
  createdAt: string;
  companyName: string;
  companyType: string;
  companyLogo: string;
}

export interface Plan {
  id: number;
  name: string;
  type: string;
  price: number;
}

export interface Subscription {
  id: number;
  planId: number;
  organizerId: number;
  status: SubscriptionStatus;
  createdAt: string;
  updatedAt: string;
  expDate: string;
  Plan: Plan;
}

export async function getOrganizerProfile(userId: string): Promise<State> {
  try {
    const supabase = await createClient();

    const { data: organizerProfiles, error } = await supabase
      .from("OrganizerProfile")
      .select("*")
      .eq("user_id", userId)
      .eq("isDeleted", false);

    if (error) {
      return {
        status: "error",
      } satisfies State;
    }

    const organizerProfile = organizerProfiles && organizerProfiles.length > 0 ? organizerProfiles[0] : null;

    return {
      status: "success",
      data: {
        organizerProfile,
      },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
