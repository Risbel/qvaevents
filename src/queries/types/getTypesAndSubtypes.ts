"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { Tables } from "@/types/supabase";

export type Types = Tables<"Types">;
export type SubType = Tables<"SubType">;

export interface TypeWithSubTypes extends Types {
  SubType: SubType[];
}

export async function getTypesAndSubtypes(): Promise<State> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("Types").select("*, SubType(*)");

    if (error) {
      return {
        status: "error",
      } satisfies State;
    }

    const typesWithSubTypes = data as TypeWithSubTypes[];

    return {
      status: "success",
      data: { types: typesWithSubTypes },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
