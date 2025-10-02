"use client";

import { useActionState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { updateEventBasicInfo } from "@/actions/event/updateEventBasicInfo";
import { MetaTagsInput } from "./MetaTagsInput";
import { EventText, Language } from "@/queries/client/events/getEventsByBusinessCodeId";
import { State } from "@/types/state";
import { useState } from "react";
import { ArrowRight, Loader2, Save, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { LanguageSelector } from "./LanguageSelector";
import { DateTimePicker } from "./DateTimePicker";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { EventWithTextsAndImages } from "@/queries/client/events/getEventBySlug";
import { EventDateTime } from "@/app/components/EventDateTime";
import InteractiveMap from "./InteractiveMap";
import { getDateInTimezone } from "@/utils/timezone";
import { joinDateAndTime } from "./utils/formatersDatePicker";

interface EditBasicInfoProps {
  languages: Language[];
  businessId: number;
  event: EventWithTextsAndImages;
}

export const EditBasicInfo = ({ languages, businessId, event }: EditBasicInfoProps) => {
  const t = useTranslations("EventCreation");
  const tAction = useTranslations("actions");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;
  const codeId = params.codeId;

  const [keywords, setKeywords] = useState<string[]>(event.keywords || []);
  // 🔹 Handle existing event texts
  const existingEventTexts = event.EventText.reduce(
    (
      acc: { [languageId: number]: { id: number; title: string; description: string; locationText: string } },
      text: EventText
    ) => {
      acc[text.languageId] = {
        id: text.id,
        title: text.title,
        description: text.description,
        locationText: text.locationText || "",
      };
      return acc;
    },
    {} as { [languageId: number]: { id: number; title: string; description: string; locationText: string } }
  );

  const existingLanguageIds = event.EventText.map((text: EventText) => text.languageId);
  const hasMultipleLanguages = existingLanguageIds.length > 1;
  const defaultLanguageId = languages.find((lang) => lang.code === event.defaultLocale)?.id || existingLanguageIds[0];
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<number[]>(
    hasMultipleLanguages ? [defaultLanguageId] : existingLanguageIds
  );
  const [currentLanguageId, setCurrentLanguageId] = useState<number | null>(defaultLanguageId);
  const [eventTexts, setEventTexts] = useState<{
    [languageId: number]: { id: number; title: string; description: string; locationText: string };
  }>(existingEventTexts);

  // 🔹 Handle event date and time
  const eventStartDate = getDateInTimezone(event.startDate, event.timeZoneId || "America/New_York");
  const eventEndDate = getDateInTimezone(event.endDate, event.timeZoneId || "America/New_York");
  // Extract date and time components from events dates
  const startDateOnly = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate());
  const endDateOnly = new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate());
  // Extract time components from events dates
  const startTimeOnly = format(eventStartDate, "HH:mm");
  const endTimeOnly = format(eventEndDate, "HH:mm");

  const [startDate, setStartDate] = useState<Date | undefined>(startDateOnly);
  const [startTime, setStartTime] = useState<string>(startTimeOnly);
  const [endDate, setEndDate] = useState<Date | undefined>(endDateOnly);
  const [endTime, setEndTime] = useState<string>(endTimeOnly);

  // 🔹 Handle coordinates
  const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>({
    lat: (event as any).lat || 22.144932, // Default Cuba coordinates if not set
    lng: (event as any).lng || -80.448374,
  });

  // 🔹 Handle form state
  const initialState: State = { status: undefined };
  const [state, formAction, isPending] = useActionState(updateEventBasicInfo, initialState);
  const queryClient = useQueryClient();

  // 🔹 Handle successful form submission
  useEffect(() => {
    if (state?.status === "success") {
      toast.success(t("basicInfo.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["event", event.slug] });
    }
  }, [state?.status, queryClient, event.slug]);

  // 🔹 Handle language change
  const handleLanguageChange = (languageIds: number[]) => {
    setSelectedLanguageIds(languageIds);
  };

  // 🔹 Handle event text change
  const handleEventTextChange = (
    field: keyof { id: number; title: string; description: string; locationText: string },
    value: string | number
  ) => {
    if (!currentLanguageId) return;

    setEventTexts((prev) => ({
      ...prev,
      [currentLanguageId]: {
        id: prev[currentLanguageId]?.id || 0,
        title: prev[currentLanguageId]?.title || "",
        description: prev[currentLanguageId]?.description || "",
        locationText: prev[currentLanguageId]?.locationText || "",
        [field]: value,
      },
    }));
  };

  // 🔹 Handle generate with AI
  const handleGenerateWithAI = () => {
    alert("Generate with AI for languages is not implemented yet, we will implement it soon :)");
  };

  // 🔹 Handle map location select
  const handleMapLocationSelect = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
  };

  // 🔹 Check if at least one form is complete
  const isAnyFormComplete = () => {
    return Object.values(eventTexts).some(
      (text) =>
        text &&
        typeof text.title === "string" &&
        typeof text.description === "string" &&
        text.title.trim() !== "" &&
        text.description.trim() !== ""
    );
  };

  // 🔹 Check if date/time fields are valid
  const isDateTimeValid = () => {
    if (!startDate || !startTime || !endDate || !endTime) return false;

    const startDateTime = joinDateAndTime(startDate, startTime);
    const endDateTime = joinDateAndTime(endDate, endTime);

    return startDateTime < endDateTime;
  };

  // 🔹 Get the selected language code for defaultLocale
  const selectedLanguage = languages.find((lang) => lang.id === selectedLanguageIds[0]);
  const defaultLocale = selectedLanguage?.code || event.defaultLocale;

  // 🔹 Prepare event texts array for submission - only include texts with content
  const eventTextsArray = Object.entries(eventTexts)
    .filter(
      ([_, text]) =>
        text &&
        typeof text.title === "string" &&
        typeof text.description === "string" &&
        (text.title.trim() !== "" || text.description.trim() !== "")
    )
    .map(([languageId, text]) => ({
      id: text.id,
      title: text.title,
      description: text.description,
      locationText: text.locationText,
      languageId: parseInt(languageId),
    }));

  return (
    <form action={formAction} className="space-y-4 md:space-y-6 w-full md:w-auto lg:w-5xl">
      {/* Hidden inputs for form data */}
      <input type="hidden" name="eventId" value={event.id} />
      <input type="hidden" name="type" value={event.type} />
      <input type="hidden" name="subType" value={event.subType} />
      <input type="hidden" name="isForMinors" value={event.isForMinors?.toString() || "false"} />
      <input type="hidden" name="isPublic" value={event.isPublic?.toString() || "false"} />
      <input type="hidden" name="spaceType" value={event.spaceType || ""} />
      <input type="hidden" name="accessType" value={event.accessType || ""} />
      <input type="hidden" name="businessId" value={businessId.toString()} />
      <input type="hidden" name="defaultLocale" value={defaultLocale || ""} />
      <input type="hidden" name="eventTexts" value={JSON.stringify(eventTextsArray)} />
      <input type="hidden" name="lat" value={coordinates.lat || ""} />
      <input type="hidden" name="lng" value={coordinates.lng || ""} />
      {keywords.map((keyword, index) => (
        <input key={index} type="hidden" name="keywords" value={keyword} />
      ))}
      {/* Hidden inputs for date/time - send local naive datetimes; server will convert using Google TZ API */}
      <input
        type="hidden"
        name="startDateTime"
        value={(() => {
          if (!startDate || !startTime) return "";
          return joinDateAndTime(startDate, startTime);
        })()}
      />
      <input
        type="hidden"
        name="endDateTime"
        value={(() => {
          if (!endDate || !endTime) return "";
          return joinDateAndTime(endDate, endTime);
        })()}
      />

      {/* Event Date and Time */}
      <Card>
        <CardHeader>
          <CardTitle>{t("basicInfo.eventDateTime")}</CardTitle>
          <CardDescription>
            <EventDateTime
              startDate={event.startDate}
              endDate={event.endDate}
              locale={locale as string}
              timeZoneId={event.timeZoneId}
              timeZoneName={event.timeZoneName}
              variant="full"
              twoRows={true}
            />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DateTimePicker
              label={t("basicInfo.startDateTime")}
              date={startDate}
              time={startTime}
              onDateChange={setStartDate}
              onTimeChange={setStartTime}
              required={true}
              minDate={new Date(new Date().setHours(0, 0, 0, 0))}
            />
            <div className="space-y-2">
              <DateTimePicker
                label={t("basicInfo.endDateTime")}
                date={endDate}
                time={endTime}
                onDateChange={setEndDate}
                onTimeChange={setEndTime}
                required={true}
                minDate={startDate || new Date(new Date().setHours(0, 0, 0, 0))}
              />
              {startDate && startTime && endDate && endTime && !isDateTimeValid() && (
                <p className="text-xs text-destructive">{t("basicInfo.endDateMustBeAfterStart")}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Language Selector - for setting defaultLocale in Event table */}
      {hasMultipleLanguages && (
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>{t("basicInfo.defaultLanguage")}</CardTitle>
          </CardHeader>
          <CardContent>
            <LanguageSelector
              languages={languages}
              selectedLanguages={selectedLanguageIds}
              onLanguageChange={handleLanguageChange}
            />
          </CardContent>
        </Card>
      )}

      {/* Event Texts */}
      {existingLanguageIds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{languages.find((lang) => lang.id === currentLanguageId)?.icon || "🌐"}</span>
                {t("basicInfo.eventTexts")} - {languages.find((lang) => lang.id === currentLanguageId)?.native}
              </div>
              {isAnyFormComplete() && hasMultipleLanguages && (
                <Button
                  title="Generate languages with AI"
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateWithAI}
                  className="flex items-center cursor-pointer font-light"
                >
                  <Sparkles className="h-4 w-4 text-primary" />
                </Button>
              )}
            </CardTitle>
            <CardDescription>{t("basicInfo.eventTextsDescription")}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-2 md:space-y-4">
            {/* Language Switcher - only for multiple languages */}
            {hasMultipleLanguages && (
              <div className="flex flex-wrap gap-2 mb-4">
                {existingLanguageIds.map((languageId: number) => {
                  const language = languages.find((lang) => lang.id === languageId);
                  const isActive = currentLanguageId === languageId;
                  const hasContent =
                    eventTexts[languageId] &&
                    typeof eventTexts[languageId].title === "string" &&
                    typeof eventTexts[languageId].description === "string" &&
                    (eventTexts[languageId].title.trim() !== "" || eventTexts[languageId].description.trim() !== "");

                  return (
                    <Button
                      key={languageId}
                      type="button"
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentLanguageId(languageId)}
                      className="flex items-center gap-2"
                    >
                      <span>{language?.icon || "🌐"}</span>
                      {language?.native}
                      {hasContent && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Text Inputs */}
            {currentLanguageId && (
              <div className="space-y-2 md:space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">{t("basicInfo.eventTitle")}</Label>
                  <Input
                    id="title"
                    value={eventTexts[currentLanguageId]?.title || ""}
                    onChange={(e) => handleEventTextChange("title", e.target.value)}
                    placeholder={t("basicInfo.titlePlaceholder")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t("basicInfo.eventDescription")}</Label>
                  <Textarea
                    id="description"
                    value={eventTexts[currentLanguageId]?.description || ""}
                    onChange={(e) => handleEventTextChange("description", e.target.value)}
                    placeholder={t("basicInfo.descriptionPlaceholder")}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="locationText">{t("basicInfo.locationText")}</Label>
                  <Input
                    id="locationText"
                    value={eventTexts[currentLanguageId]?.locationText || ""}
                    onChange={(e) => handleEventTextChange("locationText", e.target.value)}
                    placeholder={t("basicInfo.locationTextPlaceholder")}
                  />
                </div>

                {/* Interactive Map */}
                <div className="mt-4">
                  <InteractiveMap
                    lat={coordinates.lat || 22.144932}
                    lng={coordinates.lng || -80.448374}
                    zoom={coordinates.lat && coordinates.lng ? 15 : 14}
                    isInteractive={true}
                    onLocationSelect={handleMapLocationSelect}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Basic Event Info */}
      <Card>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="visitsLimit">{t("basicInfo.visitsLimit")}</Label>
              <Input
                id="visitsLimit"
                name="visitsLimit"
                type="number"
                min={10}
                defaultValue={event.visitsLimit || ""}
                placeholder={t("basicInfo.visitsLimitPlaceholder")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keywords */}
      <Card>
        <CardHeader>
          <CardTitle>{t("basicInfo.keywords")}</CardTitle>
          <CardDescription>{t("basicInfo.keywordsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <MetaTagsInput value={keywords} onChange={setKeywords} />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={existingLanguageIds.length === 0 || !isDateTimeValid() || isPending}>
          {tAction("update")}{" "}
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin cursor-pointer" />
          ) : (
            <Save className="w-4 h-4 cursor-pointer" />
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          className="cursor-pointer"
          onClick={() => router.push(`/${locale}/dashboard/bus/${codeId}/new/2?slug=${event.slug}`)}
        >
          {tAction("next")} <ArrowRight className="h-4 w-4 cursor-pointer" />
        </Button>
      </div>

      {/* Error Display */}
      {state?.status === "error" && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">{t("basicInfo.errorUpdating")}</p>
        </div>
      )}
    </form>
  );
};
