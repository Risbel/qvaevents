"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
        message: "Validation failed",
        errors: validation.error.flatten().fieldErrors,
      } satisfies State;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: validation.data.email,
      password: validation.data.password,
    });

    if (authError) {
      return {
        status: "error",
        message: "Authentication failed",
        errors: {
          auth: [authError.message],
        },
      } satisfies State;
    }

    // Return success state instead of redirecting immediately
    // This allows the client to show the success toast before redirecting
    return {
      status: "success",
      message: "Login successful!",
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
      message: "Something went wrong during login",
    } satisfies State;
  }
}
