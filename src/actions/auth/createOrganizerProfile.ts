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
  billingCycle: z.string().min(1, "Billing cycle is required"),
});

export async function createOrganizerProfile(prevState: State, formData: FormData): Promise<State> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error(userError);
      return {
        status: "error",
      } satisfies State;
    }

    const rawData = {
      companyName: formData.get("companyName") as string,
      companyType: formData.get("companyType") as string,
      companyLogo: (formData.get("companyLogo") ?? "") as string,
      planId: formData.get("planId") as string,
      billingCycle: formData.get("billingCycle") as string,
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
      console.error(checkError);
      return {
        status: "error",
      } satisfies State;
    }

    if (existingProfiles && existingProfiles.length > 0) {
      console.error("Organizer profile already exists");
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
      console.error(insertError);
      return {
        status: "error",
      } satisfies State;
    }

    // Calculate expiration date based on billing cycle
    const now = new Date();
    let expDate: Date;

    switch (validatedData.data.billingCycle) {
      case "0": // Monthly
        const nextMonth = addMonths(now, 1);
        // If the current day doesn't exist in the next month, use the last day of that month
        expDate = nextMonth.getDate() !== now.getDate() ? endOfMonth(nextMonth) : nextMonth;
        break;
      case "2": // Quarterly
        const nextQuarter = addMonths(now, 3);
        // If the current day doesn't exist in the next quarter, use the last day of that month
        expDate = nextQuarter.getDate() !== now.getDate() ? endOfMonth(nextQuarter) : nextQuarter;
        break;
      case "1": // Yearly
        const nextYear = addMonths(now, 12);
        // If the current day doesn't exist in the next year (leap year), use the last day of that month
        expDate = nextYear.getDate() !== now.getDate() ? endOfMonth(nextYear) : nextYear;
        break;
      default:
        // Default to monthly if billing cycle is not recognized
        const defaultNextMonth = addMonths(now, 1);
        expDate = defaultNextMonth.getDate() !== now.getDate() ? endOfMonth(defaultNextMonth) : defaultNextMonth;
    }

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
      console.error(subscriptionError);
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
    console.error(error);
    return {
      status: "error",
    } satisfies State;
  }
}
