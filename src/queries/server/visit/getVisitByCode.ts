import { createClient } from "@/utils/supabase/server";

export async function getVisitByCode(code: string) {
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
    data: { visit },
  };
}
