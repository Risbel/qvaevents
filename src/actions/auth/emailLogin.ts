"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function emailLogin(prevState: State, formData: FormData): Promise<State> {
  const supabase = await createClient();

  try {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const validation = loginSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        errors: validation.error.flatten().fieldErrors,
      } satisfies State;
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: validation.data.email,
      password: validation.data.password,
    });

    if (authError) {
      return {
        status: "error",
        errors: {
          auth: [authError.message],
        },
      } satisfies State;
    }

    // Check if user has a ClientProfile, create one if it doesn't exist
    if (authData.user) {
      const { data: existingProfile } = await supabase
        .from("ClientProfile")
        .select("id")
        .eq("user_id", authData.user.id)
        .single();

      // If no existing profile, create one
      if (!existingProfile && authData.user.email) {
        // Extract username from email (part before @)
        const username = authData.user.email.split("@")[0];

        const { error: profileError } = await supabase.from("ClientProfile").insert({
          user_id: authData.user.id,
          username: username,
        });
      }
    }

    return {
      status: "success",
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
