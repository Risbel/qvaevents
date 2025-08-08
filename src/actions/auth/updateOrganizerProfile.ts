"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { State } from "@/types/state";

const updateOrganizerProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyType: z.string().min(1, "Company type is required"),
  companyLogo: z.string().url().optional().or(z.literal("").or(z.null())),
});

export async function updateOrganizerProfileAction(prevState: State, formData: FormData): Promise<State> {
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

    const validatedData = updateOrganizerProfileSchema.safeParse(rawData);

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

    const { data: updatedProfile, error: updateError } = await supabase
      .from("OrganizerProfile")
      .update({
        companyName: validatedData.data.companyName,
        companyType: validatedData.data.companyType,
        companyLogo: validatedData.data.companyLogo || "",
        updatedAt: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("isDeleted", false)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating organizer profile:", updateError);
      return {
        status: "error",
        message: "Failed to update organizer profile",
      } satisfies State;
    }

    return {
      status: "success",
      message: "Organizer profile updated successfully!",
      data: {
        profile: updatedProfile,
      },
    } satisfies State;
  } catch (error) {
    console.error("Unexpected error updating organizer profile:", error);
    return {
      status: "error",
      message: "An unexpected error occurred",
    } satisfies State;
  }
}
