"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { Tables } from "@/types/supabase";

export type Business = Tables<"Business">;
export type OrganizerProfile = Tables<"OrganizerProfile">;

export interface BusinessWithOrganizer extends Business {
  OrganizerProfile: OrganizerProfile;
}

export async function getBusinessByCodeId(codeId: string): Promise<State> {
  try {
    const supabase = await createClient();

    const { data: business, error } = await supabase
      .from("Business")
      .select(
        `
        *,
        OrganizerProfile (
          id,
          companyName,
          companyType,
          companyLogo,
          codeId,
          user_id,
          isDeleted
        )
      `
      )
      .eq("codeId", codeId)
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
