import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type Business = Tables<"Business">;
export type OrganizerProfile = Tables<"OrganizerProfile">;
export type CustomEventConfig = Tables<"CustomEventConfig">;

export interface BusinessWithOrganizer extends Business {
  OrganizerProfile: OrganizerProfile;
  CustomEventConfig: CustomEventConfig[];
}

export async function getBusinessByCodeId(client: TypedSupabaseClient, codeId: string): Promise<BusinessWithOrganizer> {
  return await client
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
        ),
        CustomEventConfig(*)
      `
    )
    .eq("codeId", codeId)
    .eq("isDeleted", false)
    .eq("isActive", true)
    .single()
    .then(({ data }) => data as BusinessWithOrganizer);
}
