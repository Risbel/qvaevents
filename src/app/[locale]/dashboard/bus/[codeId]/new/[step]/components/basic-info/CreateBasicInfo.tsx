import { useActionState, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { createEventBasicInfo } from "@/actions/event/createEventBasicInfo";
import { MetaTagsInput } from "./MetaTagsInput";
import { State } from "@/types/state";
import { AlertTriangle, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateEventParams } from "../validations/event-params";
import { DateTimePicker } from "./DateTimePicker";
import { LanguageSelector } from "./LanguageSelector";
import useGetLanguages from "@/hooks/languages/useGetLanguages";
import { CreateBasicInfoSkeleton } from "../Skeletons";
import useGetBusinessByCodeId from "@/hooks/business/useGetBusinessByCodeId";
import InteractiveMap from "./InteractiveMap";
import { joinDateAndTime } from "./utils/formatersDatePicker";

interface EventText {
  title: string;
  description: string;
  locationText: string;
}

export const CreateBasicInfo = () => {
  const t = useTranslations("EventCreation");
  const tNavigation = useTranslations("navigation");
  const searchParams = useSearchParams();
  // Get URL parameters from the previous step
  const urlParams = {
    type: searchParams.get("type"),
    subType: searchParams.get("subType"),
    customSubType: searchParams.get("customSubType"),
    isForMinors: searchParams.get("isForMinors"),
    isPublic: searchParams.get("isPublic"),
    spaceType: searchParams.get("spaceType"),
    accessType: searchParams.get("accessType"),
    languages: searchParams.get("languages"),
  };
  // Pre-validated language codes from URL for initial UI state
  const preSelectedLanguageCodes = (urlParams.languages?.split(/%2C|,/) || []).filter(Boolean);
  const params = useParams();
  const { codeId } = params as { codeId: string };
  const router = useRouter();
  // Local state for form - these need to be called before any conditional returns
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<number[]>([]);
  const [currentLanguageId, setCurrentLanguageId] = useState<number | null>(null);
  // Date and time state
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<string>("");
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<string>("");
  // Event texts for each language - only for the languages in the URL
  const [eventTexts, setEventTexts] = useState<{ [languageId: number]: EventText }>({});
  // Coordinates state - separate from eventTexts
  const [coordinates, setCoordinates] = useState<{ lat: number | null; lng: number | null }>({
    lat: 22.144916,
    lng: -80.448374,
  });
  const { data: languagesResult, isLoading: languagesLoading, isError: languagesError } = useGetLanguages();
  const { data: businessResult, isError, isLoading: businessLoading } = useGetBusinessByCodeId(codeId as string);

  const initialState: State = { status: undefined };
  const [state, formAction, isPending] = useActionState(createEventBasicInfo, initialState);

  // Map language codes to IDs for initial selection
  const initialLanguageIds = languagesResult
    ? languagesResult.filter((lang) => preSelectedLanguageCodes.includes(lang.code)).map((lang) => lang.id)
    : [];

  // Determine default language logic
  const hasMultipleLanguages = initialLanguageIds.length > 1;
  // Handle successful form submission
  useEffect(() => {
    if (state?.status === "success") {
      router.push(`/dashboard/bus/${codeId}/new/2?slug=${state.data?.slug}`);
    }
  }, [state?.status, state?.data?.slug, router, codeId]);

  // Initialize state values based on calculated values
  useEffect(() => {
    if (languagesResult && initialLanguageIds.length > 0) {
      const hasMultipleLanguages = initialLanguageIds.length > 1;
      let defaultLanguageId: number | null = null;

      if (hasMultipleLanguages) {
        // If multiple languages, prioritize Spanish (es) or English (en) as default
        const spanishLanguage = languagesResult.find((lang) => lang.code === "es");
        const englishLanguage = languagesResult.find((lang) => lang.code === "en");

        if (spanishLanguage && initialLanguageIds.includes(spanishLanguage.id)) {
          defaultLanguageId = spanishLanguage.id;
        } else if (englishLanguage && initialLanguageIds.includes(englishLanguage.id)) {
          defaultLanguageId = englishLanguage.id;
        } else {
          defaultLanguageId = initialLanguageIds[0];
        }
      } else if (initialLanguageIds.length === 1) {
        // If only one language, use it as current language
        defaultLanguageId = initialLanguageIds[0];
      }

      if (selectedLanguageIds.length === 0) {
        setSelectedLanguageIds(hasMultipleLanguages ? [defaultLanguageId!] : initialLanguageIds);
      }
      if (currentLanguageId === null) {
        setCurrentLanguageId(defaultLanguageId);
      }
    }
  }, [languagesResult, initialLanguageIds, selectedLanguageIds.length, currentLanguageId]);

  if (languagesLoading || businessLoading) {
    return <CreateBasicInfoSkeleton />;
  }

  // Early returns for loading and error states
  if (languagesError || isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Error loading Create Basic Info</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!languagesResult || !businessResult) {
    return (
      <div className="flex items-center justify-center">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Error loading Create Basic Info</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Validate parameters using Zod schema
  const validationResult = validateEventParams(urlParams, languagesResult);

  if (!validationResult.success) {
    return (
      <div>
        <Alert variant="destructive" className="max-w-md mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t("basicInfo.missingRequiredParameters")}</AlertTitle>

          <AlertDescription>{t("basicInfo.missingRequiredParametersDescription")}</AlertDescription>
        </Alert>

        <Button variant="outline" onClick={() => router.push(`/dashboard/bus/${codeId}/new`)}>
          <ArrowLeft className="h-4 w-4" /> {tNavigation("goBack")}
        </Button>
      </div>
    );
  }

  // Parse validated parameters
  const validatedParams = validationResult.data!;
  const isForMinors = validatedParams.isForMinors === "yes";
  const isPublic = validatedParams.isPublic === "true";
  const selectedLanguageCodes = validatedParams.languages?.split(/%2C|,/) || [];
  const customSubType = urlParams.customSubType;

  const handleLanguageChange = (languageIds: number[]) => {
    setSelectedLanguageIds(languageIds);
    // Don't change currentLanguageId - default language selector only affects defaultLocale
  };

  const handleEventTextChange = (field: keyof EventText, value: string) => {
    if (!currentLanguageId) return;

    setEventTexts((prev) => ({
      ...prev,
      [currentLanguageId]: {
        title: prev[currentLanguageId]?.title || "",
        description: prev[currentLanguageId]?.description || "",
        locationText: prev[currentLanguageId]?.locationText || "",
        [field]: value,
      },
    }));
  };

  const handleMapLocationSelect = (lat: number, lng: number) => {
    // Update coordinates from map click
    setCoordinates({ lat, lng });
  };

  const handleGenerateWithAI = () => {
    // TODO: Implement AI generation logic
    alert("Generate with AI for languages is not implemented yet, we will implement it soon :)");
  };

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
    if (!startDate || !startTime || !endDate || !endTime) return false;

    const startDateTime = new Date(joinDateAndTime(startDate, startTime));
    const endDateTime = new Date(joinDateAndTime(endDate, endTime));

    return startDateTime < endDateTime;
  };

  // Get the selected language code for defaultLocale
  const selectedLanguage = languagesResult.find((lang) => lang.id === selectedLanguageIds[0]);
  const defaultLocale = selectedLanguage?.code || "es";

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
      ...text,
      languageId: parseInt(languageId),
    }));

  return (
    <form action={formAction} className="space-y-4 md:space-y-6 w-full md:w-auto lg:w-5xl">
      {/* Hidden inputs for form data */}
      <input type="hidden" name="type" value={validatedParams.type || ""} />
      <input type="hidden" name="subType" value={customSubType || validatedParams.subType || ""} />
      <input type="hidden" name="isForMinors" value={isForMinors.toString()} />
      <input type="hidden" name="isPublic" value={isPublic.toString()} />
      <input type="hidden" name="spaceType" value={validatedParams.spaceType || ""} />
      <input type="hidden" name="accessType" value={validatedParams.accessType || ""} />
      <input type="hidden" name="businessId" value={businessResult.id.toString()} />
      <input type="hidden" name="defaultLocale" value={defaultLocale} />
      <input type="hidden" name="eventTexts" value={JSON.stringify(eventTextsArray)} />

      {/* Hidden inputs for coordinates */}
      <input type="hidden" name="lat" value={coordinates.lat || 22.144916} />
      <input type="hidden" name="lng" value={coordinates.lng || -80.448374} />

      {/* Hidden inputs for keywords */}
      {keywords.map((keyword, index) => (
        <input key={index} type="hidden" name="keywords" value={keyword} />
      ))}

      {/* Hidden inputs for date/time - send local naive datetimes; server will convert using Google TZ API */}
      <input
        type="hidden"
        name="startDateTime"
        value={startDate && startTime ? joinDateAndTime(startDate, startTime) : ""}
      />
      <input type="hidden" name="endDateTime" value={endDate && endTime ? joinDateAndTime(endDate, endTime) : ""} />

      {/* Event Date and Time */}
      <Card>
        <CardHeader>
          <CardTitle>{t("basicInfo.eventDateTime")}</CardTitle>
          <CardDescription>{t("basicInfo.eventDateTimeDescription")}</CardDescription>
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
              languages={languagesResult}
              selectedLanguages={selectedLanguageIds}
              onLanguageChange={handleLanguageChange}
            />
          </CardContent>
        </Card>
      )}

      {/* Event Texts */}
      {selectedLanguageIds.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{languagesResult.find((lang) => lang.id === currentLanguageId)?.icon || "🌐"}</span>
                {t("basicInfo.eventTexts")} - {languagesResult.find((lang) => lang.id === currentLanguageId)?.native}
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
            {/* Language Switcher - only for multiple languages from URL */}
            {hasMultipleLanguages && (
              <div className="flex flex-wrap gap-2 mb-4">
                {initialLanguageIds.map((languageId) => {
                  const language = languagesResult.find((lang) => lang.id === languageId);
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
                  <Textarea
                    id="locationText"
                    value={eventTexts[currentLanguageId]?.locationText || ""}
                    onChange={(e) => handleEventTextChange("locationText", e.target.value)}
                    placeholder={t("basicInfo.locationTextPlaceholder")}
                    rows={3}
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
        <Button type="submit" disabled={selectedLanguageIds.length === 0 || !isDateTimeValid() || isPending}>
          {t("basicInfo.createEvent")} {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        </Button>
      </div>

      {/* Error Display */}
      {state?.status === "error" && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">{t("basicInfo.errorCreating")}</p>
        </div>
      )}
    </form>
  );
};
