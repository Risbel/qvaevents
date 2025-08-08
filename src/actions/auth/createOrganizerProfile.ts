"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { State } from "@/types/state";

const createOrganizerProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyType: z.string().min(1, "Company type is required"),
  companyLogo: z.string().url().optional().or(z.literal("")),
});

export async function createOrganizerProfileAction(prevState: State, formData: FormData): Promise<State> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        status: "error",
        message: "User not authenticated",
      } satisfies State;
    }

    const rawData = {
      companyName: formData.get("companyName") as string,
      companyType: formData.get("companyType") as string,
      companyLogo: formData.get("companyLogo") as string,
    };

    const validatedData = createOrganizerProfileSchema.safeParse(rawData);

    if (!validatedData.success) {
      const errors: { [key: string]: string[] } = {};
      validatedData.error.issues.forEach((error) => {
        const field = error.path[0] as string;
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(error.message);
      });

      return {
        status: "error",
        message: "Validation failed",
        errors,
      } satisfies State;
    }

    // Check if user already has an organizer profile
    const { data: existingProfiles, error: checkError } = await supabase
      .from("OrganizerProfile")
      .select("id")
      .eq("user_id", user.id)
      .eq("isDeleted", false);

    if (checkError) {
      return {
        status: "error",
        message: "Failed to check existing profile",
      } satisfies State;
    }

    if (existingProfiles && existingProfiles.length > 0) {
      return {
        status: "error",
        message: "Organizer profile already exists",
      } satisfies State;
    }

    // Create the organizer profile
    const { data: newProfile, error: insertError } = await supabase
      .from("OrganizerProfile")
      .insert({
        user_id: user.id,
        companyName: validatedData.data.companyName,
        companyType: validatedData.data.companyType,
        companyLogo: validatedData.data.companyLogo || "",
        isDeleted: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error creating organizer profile:", insertError);
      return {
        status: "error",
        message: "Failed to create organizer profile",
      } satisfies State;
    }

    return {
      status: "success",
      message: "Organizer profile created successfully!",
      data: {
        profile: newProfile,
      },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
      message: "An unexpected error occurred",
    } satisfies State;
  }
}
