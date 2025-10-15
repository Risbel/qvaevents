"use server";

import { createClient } from "@/utils/supabase/server";
import { State } from "@/types/state";
import { z } from "zod";
import { processEventDates } from "@/utils/timezone";

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
    startDateTime: z.string().min(1, "Start local datetime is required"),
    endDateTime: z.string().min(1, "End local datetime is required"),
    lat: z.number().optional(),
    lng: z.number().optional(),
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
      // Validate that end date is after start date (naive local strings)
      const startDateTime = new Date(data.startDateTime);
      const endDateTime = new Date(data.endDateTime);
      return startDateTime < endDateTime;
    },
    {
      message: "End date must be after start date",
      path: ["endDateTime"],
    }
  );

export async function createEventBasicInfo(prevState: State, formData: FormData): Promise<any> {
  const supabase = await createClient();

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("userError: ", userError);
      return {
        status: "error",
        errors: { auth: ["User not authenticated"] },
      } satisfies State;
    }

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
      startDateTime: formData.get("startDateTime") as string,
      endDateTime: formData.get("endDateTime") as string,
      eventTexts: JSON.parse(formData.get("eventTexts") as string),
      lat: Number(formData.get("lat")),
      lng: Number(formData.get("lng")),
    };

    const validatedData = createEventBasicInfoSchema.safeParse(rawData);

    if (!validatedData.success) {
      console.log("validatedData.error: ", validatedData.error);
      return {
        status: "error",
        errors: validatedData.error.issues.reduce((acc, error) => {
          acc[error.path[0] as string] = [error.message];
          return acc;
        }, {} as { [key: string]: string[] }),
      } satisfies State;
    }

    const {
      lat,
      lng,
      startDateTime,
      endDateTime,
      visitsLimit,
      type,
      subType,
      isPublic,
      isForMinors,
      spaceType,
      accessType,
      businessId,
      defaultLocale,
      keywords,
      eventTexts,
    } = validatedData.data;

    try {
      const { timezoneData, startDateUTC, endDateUTC } = await processEventDates(
        lat!,
        lng!,
        startDateTime,
        endDateTime,
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string
      );

      // Start a transaction by creating the event first
      const { data: event, error: eventError } = await supabase
        .from("Event")
        .insert({
          step: 1, // Initially 1 when creating basic info
          visitsLimit: visitsLimit,
          typeId: type,
          subTypeId: subType,
          isPublic: isPublic,
          isForMinors: isForMinors,
          spaceTypeId: spaceType,
          accessTypeId: accessType,
          businessId: businessId,
          defaultLocale: defaultLocale,
          keywords: keywords || [],
          startDate: startDateUTC,
          endDate: endDateUTC,
          lat: lat,
          lng: lng,
          timeZoneId: timezoneData.timeZoneId,
          timeZoneName: timezoneData.timeZoneName,
        })
        .select("id, slug")
        .single();

      if (eventError) {
        console.log("eventError: ", eventError);
        return {
          status: "error",
          errors: { event: [eventError.message] },
        } satisfies State;
      }

      const eventId = event.id;

      // Insert event texts
      const eventTextsData = eventTexts.map((text) => ({
        title: text.title,
        description: text.description,
        locationText: text.locationText || null,
        languageId: text.languageId,
        eventId: eventId,
      }));

      const { error: eventTextsError } = await supabase.from("EventText").insert(eventTextsData);

      if (eventTextsError) {
        console.log("eventTextsError: ", eventTextsError);
        return {
          status: "error",
          errors: { eventTexts: [eventTextsError.message] },
        } satisfies State;
      }

      return {
        status: "success",
        data: { eventId: eventId, slug: event.slug },
      } satisfies State;
    } catch (tzError) {
      console.log("tzError: ", tzError);
      return {
        status: "error",
        errors: {
          timezone: [tzError instanceof Error ? tzError.message : "Unexpected error contacting Google Timezone API"],
        },
      } satisfies State;
    }
  } catch (error) {
    console.log("error: ", error);

    return {
      status: "error",
      errors: { general: ["An unexpected error occurred"] },
    } satisfies State;
  }
}
