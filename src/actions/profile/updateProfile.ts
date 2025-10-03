"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { z } from "zod";

const updateProfileSchema = z.object({
  id: z.number(),
  username: z.string().min(1, "Username is required"),
  info: z.string().nullable(),
  birthday: z.string().nullable(),
  sex: z.string().nullable(),
});

export async function updateProfile(prevState: State, formData: FormData): Promise<State> {
  const supabase = await createClient();

  try {
    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        status: "error",
        errors: {
          auth: ["Unauthorized"],
        },
      } satisfies State;
    }

    const data = {
      id: parseInt(formData.get("id") as string),
      username: formData.get("username") as string,
      info: (formData.get("info") as string) || null,
      birthday: (formData.get("birthday") as string) || null,
      sex: (formData.get("sex") as string) || null,
    };

    const validation = updateProfileSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.error.flatten().fieldErrors,
      } satisfies State;
    }

    const { id, username, info, birthday, sex } = validation.data;

    // Verify the profile belongs to the authenticated user
    const { data: existingProfile, error: fetchError } = await supabase
      .from("ClientProfile")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !existingProfile) {
      return {
        status: "error",
        errors: {
          profile: ["Profile not found"],
        },
      } satisfies State;
    }

    if (existingProfile.user_id !== user.id) {
      return {
        status: "error",
        errors: {
          auth: ["Unauthorized"],
        },
      } satisfies State;
    }

    // Update the profile
    const { error: updateError } = await supabase
      .from("ClientProfile")
      .update({
        username,
        info,
        birthday,
        sex,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return {
        status: "error",
        errors: {
          profile: ["Failed to update profile"],
        },
      } satisfies State;
    }

    return {
      status: "success",
    } satisfies State;
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      status: "error",
      errors: {
        profile: ["Internal server error"],
      },
    } satisfies State;
  }
}
