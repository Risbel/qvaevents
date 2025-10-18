"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { Tables } from "@/types/supabase";

export type Business = Tables<"Business">;
export type OrganizerProfile = Tables<"OrganizerProfile">;

export interface BusinessWithOrganizer extends Business {
  OrganizerProfile: OrganizerProfile;
  BusinessImage: Array<{
    id: number;
    url: string;
    type: string;
    size: number | null;
  }>;
}

export async function getBusinessBySlug(slug: string): Promise<State> {
  try {
    const supabase = await createClient();

    const { data: business, error } = await supabase
      .from("Business")
      .select(
        `
        *,
        BusinessImage(*),
        OrganizerProfile (
          id,
          companyName,
          companyType,
          logo
        )
      `
      )
      .eq("slug", slug)
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
      data: { business: business as BusinessWithOrganizer },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
