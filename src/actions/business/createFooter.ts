"use server";

import { createClient } from "@/utils/supabase/server";
import { footerConfigSchema, FooterConfigType } from "@/lib/validations/footer";
import { State } from "@/types/state";

export async function updateFooter(
  footer: FooterConfigType,
  businessId: string
): Promise<State<{ footerConfig: FooterConfigType }>> {
  try {
    // Validate the footer configuration
    const validationResult = footerConfigSchema.safeParse(footer);

    if (!validationResult.success) {
      return {
        status: "error",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const supabase = await createClient();

    // Update the business with the validated footer configuration
    const { data, error } = await supabase
      .from("Business")
      .update({ footerConfig: validationResult.data })
      .eq("id", businessId)
      .select()
      .single();

    if (error) {
      return {
        status: "error",
        errors: {
          general: [error.message],
        },
      };
    }

    return {
      status: "success",
      data: { footerConfig: validationResult.data },
    };
  } catch (error) {
    return {
      status: "error",
      errors: {
        general: ["An unexpected error occurred while saving the footer configuration"],
      },
    };
  }
}
