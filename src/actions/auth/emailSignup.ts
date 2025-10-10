"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { z } from "zod";

const signupSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export async function emailSignup(prevState: State, formData: FormData): Promise<State> {
  const supabase = await createClient();

  try {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    };

    const validation = signupSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        errors: {
          auth: ["Invalid email or password"],
        },
      } satisfies State;
    }

    // Check if user already exists in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
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

    // Check if ClientProfile already exists (safety check)
    if (authData.user) {
      const { data: existingProfile } = await supabase
        .from("ClientProfile")
        .select("id")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (existingProfile) {
        return {
          status: "error",
          errors: {
            auth: ["A profile already exists for this user"],
          },
        } satisfies State;
      }

      // Check if email is already used by another profile
      const { data: emailExists } = await supabase
        .from("ClientProfile")
        .select("id")
        .eq("email", validation.data.email)
        .maybeSingle();

      if (emailExists) {
        return {
          status: "error",
          errors: {
            auth: ["emailAlreadyRegistered"],
          },
        } satisfies State;
      }

      // Create ClientProfile
      const username = validation.data.email.split("@")[0];

      const { error: profileError } = await supabase.from("ClientProfile").insert({
        user_id: authData.user.id,
        username: username,
        email: validation.data.email,
        name: authData.user.user_metadata?.full_name || authData.user.user_metadata?.name || username,
      });

      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        // However, this is tricky as we'd need admin privileges
        return {
          status: "error",
          errors: {
            auth: ["Failed to create user profile. Please contact support."],
          },
        } satisfies State;
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
