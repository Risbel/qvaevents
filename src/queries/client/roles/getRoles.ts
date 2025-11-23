import { Tables, TypedSupabaseClient } from "@/types/supabase";

export type Role = Tables<"Role">;

interface BusinessWithRoles {
  id: number;
  codeId: string;
  name: string;
  organizerId: number;
  Role: Role[] | null;
}

const getRolesByCode = async (client: TypedSupabaseClient, codeId: string): Promise<BusinessWithRoles> => {
  const { data: business, error } = await client
    .from("Business")
    .select(
      `
      id,
      codeId,
      name,
      organizerId,
      Role (
        *
      )
    `
    )
    .eq("codeId", codeId)
    .single();

  const businessWithRoles = business as unknown as BusinessWithRoles;

  return businessWithRoles;
};

export default getRolesByCode;
