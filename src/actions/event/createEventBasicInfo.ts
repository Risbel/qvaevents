"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const createEventBasicInfoSchema = z
  .object({
    visitsLimit: z.number().optional(),
    type: z.string().min(1, "Type is required"),
    subType: z.string().min(1, "SubType is required"),
    isPublic: z.boolean(),
    isForMinors: z.boolean(),
    spaceType: z.string().min(1, "Space type is required"),
    accessType: z.string().min(1, "Access type is required"),
    businessId: z.number().min(1, "Business ID is required"),
    defaultLocale: z.string().default("es"),
    keywords: z.array(z.string()).optional(),
    startDate: z.string().min(1, "Start date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endDate: z.string().min(1, "End date is required"),
    endTime: z.string().min(1, "End time is required"),
    eventTexts: z.array(
      z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        locationText: z.string().optional(),
        languageId: z.number().min(1, "Language ID is required"),
      })
    ),
  })
  .refine(
    (data) => {
      // Validate that end date/time is after start date/time
      const startDateTime = new Date(`${data.startDate.split("T")[0]}T${data.startTime}`);
      const endDateTime = new Date(`${data.endDate.split("T")[0]}T${data.endTime}`);
      return startDateTime < endDateTime;
    },
    {
      message: "End date/time must be after start date/time",
      path: ["endDate"],
    }
  );

export async function createEventBasicInfo(prevState: State, formData: FormData): Promise<any> {
  const supabase = await createClient();

  try {
    // Get user to ensure authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return {
        status: "error",
        errors: { auth: ["User not authenticated"] },
      } satisfies State;
    }

    // Parse and validate form data
    const rawData = {
      visitsLimit: formData.get("visitsLimit") ? Number(formData.get("visitsLimit")) : undefined,
      type: formData.get("type") as string,
      subType: formData.get("subType") as string,
      isPublic: formData.get("isPublic") === "true",
      isForMinors: formData.get("isForMinors") === "true",
      spaceType: formData.get("spaceType") as string,
      accessType: formData.get("accessType") as string,
      businessId: Number(formData.get("businessId")),
      defaultLocale: (formData.get("defaultLocale") as string) || "es",
      keywords: formData
        .getAll("keywords")
        .map((keyword) => keyword as string)
        .filter((keyword) => keyword.trim() !== ""),
      startDate: formData.get("startDate") as string,
      startTime: formData.get("startTime") as string,
      endDate: formData.get("endDate") as string,
      endTime: formData.get("endTime") as string,
      eventTexts: JSON.parse(formData.get("eventTexts") as string),
    };

    const validatedData = createEventBasicInfoSchema.parse(rawData);

    // Combine date and time into datetime strings in UTC
    const startDateTime = new Date(`${validatedData.startDate.split("T")[0]}T${validatedData.startTime}Z`);
    const endDateTime = new Date(`${validatedData.endDate.split("T")[0]}T${validatedData.endTime}Z`);

    // Start a transaction by creating the event first
    const { data: event, error: eventError } = await supabase
      .from("Event")
      .insert({
        step: 1, // Initially 1 when creating basic info
        visitsLimit: validatedData.visitsLimit,
        type: validatedData.type,
        subType: validatedData.subType,
        isPublic: validatedData.isPublic,
        isForMinors: validatedData.isForMinors,
        spaceType: validatedData.spaceType,
        accessType: validatedData.accessType,
        businessId: validatedData.businessId,
        defaultLocale: validatedData.defaultLocale,
        keywords: validatedData.keywords || [],
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        isActive: true,
        isDeleted: false,
      })
      .select("id, slug")
      .single();

    if (eventError) {
      console.log(eventError);

      return {
        status: "error",
        errors: { event: [eventError.message] },
      } satisfies State;
    }

    const eventId = event.id;

    // Insert event texts
    const eventTextsData = validatedData.eventTexts.map((text) => ({
      title: text.title,
      description: text.description,
      locationText: text.locationText || null,
      languageId: text.languageId,
      eventId: eventId,
    }));

    const { error: eventTextsError } = await supabase.from("EventText").insert(eventTextsData);

    if (eventTextsError) {
      return {
        status: "error",
        errors: { eventTexts: [eventTextsError.message] },
      } satisfies State;
    }

    return {
      status: "success",
      data: { eventId: eventId, slug: event.slug },
    } satisfies State;
  } catch (error) {
    return {
      status: "error",
      errors: { general: ["An unexpected error occurred"] },
    } satisfies State;
  }
}
