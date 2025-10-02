"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { z } from "zod";
import { processEventDates } from "@/utils/timezone";

const updateEventBasicInfoSchema = z
  .object({
    eventId: z.number().min(1, "Event ID is required"),
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
    startDateTime: z.string().min(1, "Start local datetime is required"),
    endDateTime: z.string().min(1, "End local datetime is required"),
    lat: z.number().optional(),
    lng: z.number().optional(),
    eventTexts: z.array(
      z.object({
        id: z.number().min(1, "Text ID is required"),
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        locationText: z.string().optional(),
        languageId: z.number().min(1, "Language ID is required"),
      })
    ),
  })
  .refine(
    (data) => {
      const startDateTime = new Date(data.startDateTime);
      const endDateTime = new Date(data.endDateTime);
      return startDateTime < endDateTime;
    },
    {
      message: "End date must be after start date",
      path: ["endDateTime"],
    }
  );

export async function updateEventBasicInfo(prevState: State, formData: FormData): Promise<any> {
  const supabase = await createClient();

  try {
    const rawData = {
      eventId: Number(formData.get("eventId")),
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
      startDateTime: formData.get("startDateTime") as string,
      endDateTime: formData.get("endDateTime") as string,
      lat: Number(formData.get("lat")),
      lng: Number(formData.get("lng")),
      eventTexts: JSON.parse(formData.get("eventTexts") as string),
    };

    const validatedData = updateEventBasicInfoSchema.parse(rawData);

    try {
      const { timezoneData, startDateUTC, endDateUTC } = await processEventDates(
        validatedData.lat!,
        validatedData.lng!,
        validatedData.startDateTime,
        validatedData.endDateTime,
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
      );

      const { data: event, error: eventError } = await supabase
        .from("Event")
        .update({
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
          startDate: startDateUTC,
          endDate: endDateUTC,
          lat: validatedData.lat,
          lng: validatedData.lng,
          timeZoneId: timezoneData.timeZoneId,
          timeZoneName: timezoneData.timeZoneName,
        })
        .eq("id", validatedData.eventId)
        .select("id, slug")
        .single();

      if (eventError) {
        return {
          status: "error",
          errors: { event: [eventError.message] },
        } satisfies State;
      }

      for (const text of validatedData.eventTexts) {
        const { error: updateError } = await supabase
          .from("EventText")
          .update({
            title: text.title,
            description: text.description,
            locationText: text.locationText || null,
          })
          .eq("id", text.id);

        if (updateError) {
          return {
            status: "error",
            errors: { eventTexts: [updateError.message] },
          } satisfies State;
        }
      }

      return {
        status: "success",
        data: { eventId: validatedData.eventId, slug: event.slug },
      } satisfies State;
    } catch (tzError) {
      return {
        status: "error",
        errors: {
          timezone: [tzError instanceof Error ? tzError.message : "Unexpected error contacting Google Timezone API"],
        },
      } satisfies State;
    }
  } catch (error) {
    return {
      status: "error",
      errors: { general: ["An unexpected error occurred"] },
    } satisfies State;
  }
}
