import { Tables, TypedSupabaseClient } from "@/types/supabase";

type CustomEventConfig = Tables<"CustomEventConfig">;
type Business = Tables<"Business">;
type SpaceType = Tables<"SpaceType">;
type AccessType = Tables<"AccessType">;
type Type = Tables<"Type">;
type SubType = Tables<"SubType">;

export interface BusinessWithCustomEventConfig extends Business {
  CustomEventConfig: (CustomEventConfig & {
    Type?: Type;
    SubType?: SubType;
    SpaceType?: SpaceType;
    AccessType?: AccessType;
  })[];
}

export const getConfigsByBusinessCodeId = async (client: TypedSupabaseClient, codeId: string) => {
  return await client
    .from("Business")
    .select(
      `
      CustomEventConfig(
        *,
        Type(*),	
        SubType(*),
        SpaceType(*),
        AccessType(*)
      )
    `
    )
    .eq("codeId", codeId)
    .eq("isDeleted", false)
    .eq("isActive", true)
    .single()
    .then(({ data }) => data as BusinessWithCustomEventConfig);
};
