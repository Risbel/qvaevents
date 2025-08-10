"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { State } from "@/types/state";
import { addMonths, endOfMonth } from "date-fns";

const createOrganizerProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyType: z.string().min(1, "Company type is required"),
  companyLogo: z.string().url().optional().or(z.literal("")),
  planId: z.string().min(1, "Plan selection is required"),
});

export async function createOrganizerProfile(prevState: State, formData: FormData): Promise<State> {
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
      companyName: formData.get("companyName") as string,
      companyType: formData.get("companyType") as string,
      companyLogo: (formData.get("companyLogo") ?? "") as string,
      planId: formData.get("planId") as string,
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
      } satisfies State;
    }

    if (existingProfiles && existingProfiles.length > 0) {
      return {
        status: "error",
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
      return {
        status: "error",
      } satisfies State;
    }

    // Calculate expiration date (same day next month, handling month length differences)
    const now = new Date();
    const nextMonth = addMonths(now, 1);

    // If the current day doesn't exist in the next month, use the last day of that month
    const expDate = nextMonth.getDate() !== now.getDate() ? endOfMonth(nextMonth) : nextMonth;

    const { data: newSubscription, error: subscriptionError } = await supabase
      .from("Subscription")
      .insert({
        planId: parseInt(validatedData.data.planId),
        organizerId: newProfile.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expDate: expDate.toISOString(),
      })
      .select()
      .single();

    if (subscriptionError) {
      return {
        status: "error",
      } satisfies State;
    }

    return {
      status: "success",
      data: {
        profile: newProfile,
        subscription: newSubscription,
      },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
