"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { z } from "zod";

const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
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
        errors: validation.error.flatten().fieldErrors,
      } satisfies State;
    }

    const { error: authError } = await supabase.auth.signUp({
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

    return {
      status: "success",
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
