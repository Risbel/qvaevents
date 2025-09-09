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
import { LanguageSelector } from "./LanguageSelector";
import { DateTimePicker } from "./DateTimePicker";
import { Language } from "@/queries/language/getLanguages";
import { State } from "@/types/state";
import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { EventWithTexts } from "@/queries/event/getEventBySlug";
import { format, parseISO } from "date-fns";
import { convertUTCToLocal, formatDateRange } from "@/utils/dateTime";

interface EditBasicInfoProps {
  languages: Language[];
  businessId: number;
  event: EventWithTexts;
}

export const EditBasicInfo = ({ languages, businessId, event }: EditBasicInfoProps) => {
  const t = useTranslations("EventCreation");
  const router = useRouter();
  const params = useParams();
  const locale = params.locale;
  const codeId = params.codeId;

  // Initialize form state with existing event data
  const [keywords, setKeywords] = useState<string[]>(event.keywords || []);

  // Get existing event texts and organize by language
  const existingEventTexts = event.EventText.reduce((acc, text) => {
    acc[text.languageId] = {
      id: text.id,
      title: text.title,
      description: text.description,
      locationText: text.locationText || "",
    };
    return acc;
  }, {} as { [languageId: number]: { id: number; title: string; description: string; locationText: string } });

  // Get language IDs from existing texts
  const existingLanguageIds = event.EventText.map((text) => text.languageId);
  const hasMultipleLanguages = existingLanguageIds.length > 1;

  // Determine default language
  const defaultLanguageId = languages.find((lang) => lang.code === event.defaultLocale)?.id || existingLanguageIds[0];

  const [selectedLanguageIds, setSelectedLanguageIds] = useState<number[]>(
    hasMultipleLanguages ? [defaultLanguageId] : existingLanguageIds
  );
  const [currentLanguageId, setCurrentLanguageId] = useState<number | null>(defaultLanguageId);
  const [eventTexts, setEventTexts] = useState<{
    [languageId: number]: { id: number; title: string; description: string; locationText: string };
  }>(existingEventTexts);

  // Date and time state - parse from existing event (UTC) and convert to local
  const startDateLocal = convertUTCToLocal(event.startDate);
  const endDateLocal = convertUTCToLocal(event.endDate);

  // Extract date and time components from local time
  const startDateOnly = new Date(startDateLocal.getFullYear(), startDateLocal.getMonth(), startDateLocal.getDate());
  const endDateOnly = new Date(endDateLocal.getFullYear(), endDateLocal.getMonth(), endDateLocal.getDate());

  // Extract time components from local time
  const startTimeOnly = format(startDateLocal, "HH:mm");
  const endTimeOnly = format(endDateLocal, "HH:mm");

  const [startDateState, setStartDateState] = useState<Date | undefined>(startDateOnly);
  const [startTime, setStartTime] = useState<string>(startTimeOnly);
  const [endDateState, setEndDateState] = useState<Date | undefined>(endDateOnly);
  const [endTime, setEndTime] = useState<string>(endTimeOnly);

  const initialState: State = { status: undefined };
  const [state, formAction, isPending] = useActionState(updateEventBasicInfo, initialState);

  // Handle successful form submission
  useEffect(() => {
    if (state?.status === "success") {
      router.refresh();
      // router.push(`/dashboard/bus/${codeId}/new/2?slug=${state.data?.slug}`);
    }
  }, [state?.status, state?.data?.slug, router, codeId]);

  const handleLanguageChange = (languageIds: number[]) => {
    setSelectedLanguageIds(languageIds);
  };

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

  const handleGenerateWithAI = () => {
    // TODO: Implement AI generation logic
    console.log("Generate with AI for languages:", existingLanguageIds);
  };

  // Check if at least one form is complete
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

  // Check if date/time fields are valid
  const isDateTimeValid = () => {
    if (!startDateState || !startTime || !endDateState || !endTime) return false;

    const startDateTime = new Date(`${startDateState.toISOString().split("T")[0]}T${startTime}`);
    const endDateTime = new Date(`${endDateState.toISOString().split("T")[0]}T${endTime}`);

    return startDateTime < endDateTime;
  };

  // Get the selected language code for defaultLocale
  const selectedLanguage = languages.find((lang) => lang.id === selectedLanguageIds[0]);
  const defaultLocale = selectedLanguage?.code || event.defaultLocale;

  // Prepare event texts array for submission - only include texts with content
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
    <div className="space-y-6 w-full md:w-auto lg:w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("basicInfo.title")}</h1>
        <p className="text-muted-foreground">{t("basicInfo.description")}</p>
      </div>

      <form action={formAction} className="space-y-4 md:space-y-6">
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

        {/* Hidden inputs for keywords */}
        {keywords.map((keyword, index) => (
          <input key={index} type="hidden" name="keywords" value={keyword} />
        ))}

        {/* Hidden inputs for date/time - send current form state */}
        <input type="hidden" name="startDate" value={startDateState ? startDateState.toISOString() : ""} />
        <input type="hidden" name="startTime" value={startTime} />
        <input type="hidden" name="endDate" value={endDateState ? endDateState.toISOString() : ""} />
        <input type="hidden" name="endTime" value={endTime} />

        {/* Event Date and Time */}
        <Card>
          <CardHeader>
            <CardTitle>{t("basicInfo.eventDateTime")}</CardTitle>
            <CardDescription>
              {t("basicInfo.eventDateTimeDescription")}
              <br />
              <span className="text-sm font-medium">
                {startDateState &&
                  endDateState &&
                  formatDateRange(startDateState, startTime, endDateState, endTime, locale as string)}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DateTimePicker
                label={t("basicInfo.startDateTime")}
                date={startDateState}
                time={startTime}
                onDateChange={setStartDateState}
                onTimeChange={setStartTime}
                required={true}
                minDate={new Date(new Date().setHours(0, 0, 0, 0))}
              />
              <div className="space-y-2">
                <DateTimePicker
                  label={t("basicInfo.endDateTime")}
                  date={endDateState}
                  time={endTime}
                  onDateChange={setEndDateState}
                  onTimeChange={setEndTime}
                  required={true}
                  minDate={startDateState || new Date(new Date().setHours(0, 0, 0, 0))}
                />
                {startDateState && startTime && endDateState && endTime && !isDateTimeValid() && (
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
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateWithAI}
                    className="flex items-center cursor-pointer font-light"
                  >
                    <Sparkles className="h-4 w-4 text-primary" />
                    Generate other languages with<span className="font-semibold">AI</span>
                  </Button>
                )}
              </CardTitle>
              <CardDescription>{t("basicInfo.eventTextsDescription")}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2 md:space-y-4">
              {/* Language Switcher - only for multiple languages */}
              {hasMultipleLanguages && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {existingLanguageIds.map((languageId) => {
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
        <div className="flex justify-end">
          <Button type="submit" disabled={existingLanguageIds.length === 0 || !isDateTimeValid() || isPending}>
            {t("basicInfo.updateEvent")} {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
          </Button>
        </div>

        {/* Error Display */}
        {state?.status === "error" && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-destructive">{t("basicInfo.errorUpdating")}</p>
          </div>
        )}
      </form>
    </div>
  );
};
