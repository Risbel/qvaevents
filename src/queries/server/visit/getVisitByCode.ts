import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/supabase";

export type Visit = Tables<"Visit"> & {
  Event: Tables<"Event"> & {
    EventText: (Tables<"EventText"> & {
      Language: Tables<"Language">;
    })[];
    Business: Tables<"Business">;
  };
  ClientProfile: Tables<"ClientProfile">;
  ClientCompanion: Tables<"ClientCompanion">[];
};

export async function getVisitByCode(
  code: string
): Promise<{ status: "success" | "error"; data?: { visit: Visit }; error?: string }> {
  const supabase = await createClient();

  const { data: visit, error } = await supabase
    .from("Visit")
    .select(
      `
      *,
      Event!inner(
        *,
        EventText(*, Language(id, code, name, native, icon)),
        Business(
          *
        )
      ),
      ClientProfile!inner(
        id,
        name,
        email,
        avatar
      ),
      ClientCompanion(
        id,
        clientId,
        ClientProfile(
          id,
          name,
          email,
          avatar
        )
      )
    `
    )
    .eq("code", code)
    .maybeSingle();

  if (error) {
    return {
      status: "error" as const,
      error: error.message,
    };
  }

  if (!visit) {
    return {
      status: "error" as const,
      error: "Visit not found",
    };
  }

  return {
    status: "success" as const,
    data: { visit: visit as Visit },
  };
}
