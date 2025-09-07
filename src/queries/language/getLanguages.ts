"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { Tables } from "@/types/supabase";

export type Language = Tables<"Language">;

export async function getLanguages(): Promise<State<{ languages: Language[] }>> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("Language").select("*").order("name");

    if (error) {
      return {
        status: "error",
      } satisfies State;
    }

    const languages = data as Language[];

    return {
      status: "success",
      data: { languages },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
