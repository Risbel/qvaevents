import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type Business = Tables<"Business">;
export type OrganizerProfile = Tables<"OrganizerProfile">;
export type CustomEventConfig = Tables<"CustomEventConfig">;
export type BusinessImage = Tables<"BusinessImage">;

export interface BusinessWithOrganizer extends Business {
  OrganizerProfile: OrganizerProfile;
  CustomEventConfig: CustomEventConfig[];
  BusinessImage: BusinessImage[];
}

export async function getBusinessByCodeId(client: TypedSupabaseClient, codeId: string): Promise<BusinessWithOrganizer> {
  return await client
    .from("Business")
    .select(
      `
        *,
        BusinessImage(*),
        OrganizerProfile (
          id,
          companyName,
          companyType,
          logo,
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
