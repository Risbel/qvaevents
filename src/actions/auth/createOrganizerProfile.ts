"use server";

import { createClient } from "@/utils/supabase/server";
import { z } from "zod";
import { State } from "@/types/state";
import { addMonths, endOfMonth } from "date-fns";

const createOrganizerProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  companyType: z.string().min(1, "Company type is required"),
  companyLogo: z.url().optional().or(z.literal("")),
  planId: z.string().min(1, "Plan selection is required"),
  planPriceId: z.string().min(1, "Plan price selection is required"),
});

export async function createOrganizerProfile(prevState: State, formData: FormData) {
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
      planPriceId: formData.get("planPriceId") as string,
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

    if (checkError || (existingProfiles && existingProfiles.length > 0)) {
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

    // Get plan information to determine billing cycle
    const { data: plan, error: planError } = await supabase
      .from("Plan")
      .select("billingCycle")
      .eq("id", validatedData.data.planId)
      .single();

    if (planError || !plan) {
      return {
        status: "error",
      } satisfies State;
    }

    // Calculate expiration date based on billing cycle
    const now = new Date();
    const billingCycleMonths = {
      "0": 1, // Monthly
      "1": 12, // Yearly
      "2": 3, // Quarterly
    };

    const monthsToAdd = billingCycleMonths[plan.billingCycle.toString() as keyof typeof billingCycleMonths] || 1;
    const futureDate = addMonths(now, monthsToAdd);

    // Handle edge case where the current day doesn't exist in the target month
    const expDate = futureDate.getDate() !== now.getDate() ? endOfMonth(futureDate) : futureDate;

    const { data: newSubscription, error: subscriptionError } = await supabase
      .from("Subscription")
      .insert({
        planId: parseInt(validatedData.data.planId),
        planPriceId: parseInt(validatedData.data.planPriceId),
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

    const { data: subscriptionHistory, error: subscriptionHistoryError } = await supabase
      .from("SubscriptionHistory")
      .insert({
        event: "create",
        subscriptionId: newSubscription.id,
        planPriceId: parseInt(validatedData.data.planPriceId),
        startDate: new Date().toISOString(),
        endDate: expDate.toISOString(),
      })
      .select()
      .single();

    if (subscriptionHistoryError) {
      return {
        status: "error",
      } satisfies State;
    }

    return {
      status: "success",
      data: {
        success: true,
        message: "Organizer profile created successfully",
      },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
    } satisfies State;
  }
}
