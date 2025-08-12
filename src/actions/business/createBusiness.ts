"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { State } from "@/types/state";

const createBusinessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().optional(),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  organizerId: z.string().min(1, "Organizer ID is required"),
});

export async function createBusiness(prevState: State, formData: FormData): Promise<State> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        status: "error",
      } satisfies State;
    }

    const rawData = {
      name: formData.get("name") as string,
      description: (formData.get("description") ?? "") as string,
      slug: formData.get("slug") as string,
      organizerId: formData.get("organizerId") as string,
    };

    const validatedData = createBusinessSchema.safeParse(rawData);

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
        errors,
      } satisfies State;
    }

    // Check if organizer exists and user has access
    const { data: organizer, error: organizerError } = await supabase
      .from("OrganizerProfile")
      .select("id, user_id")
      .eq("id", parseInt(validatedData.data.organizerId))
      .eq("isDeleted", false)
      .single();

    if (organizerError || !organizer) {
      return {
        status: "error",
      } satisfies State;
    }

    // Check if user owns this organizer
    if (organizer.user_id !== user.id) {
      return {
        status: "error",
      } satisfies State;
    }

    // Check if slug is already taken
    const { data: existingBusiness, error: slugCheckError } = await supabase
      .from("Business")
      .select("id")
      .eq("slug", validatedData.data.slug)
      .single();

    if (slugCheckError && slugCheckError.code !== "PGRST116") {
      // PGRST116 is "not found" error, which is what we want
      return {
        status: "error",
      } satisfies State;
    }

    if (existingBusiness) {
      return {
        status: "error",
        errors: {
          slug: ["This slug is already taken. Please choose a different one."],
        },
      } satisfies State;
    }

    // Create the business
    const { data: newBusiness, error: insertError } = await supabase
      .from("Business")
      .insert({
        name: validatedData.data.name,
        description: validatedData.data.description || "",
        slug: validatedData.data.slug,
        organizerId: parseInt(validatedData.data.organizerId),
        isDeleted: false,
        isActive: true,
      })
      .select()
      .single();

    if (insertError) {
      return {
        status: "error",
      } satisfies State;
    }

    return {
      status: "success",
      data: {
        business: newBusiness,
      },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
