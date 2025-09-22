"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypeSelector } from "./components/TypeSelector";
import { MinorsSuitabilitySelector } from "./components/MinorsSuitabilitySelector";
import { EventVisibilitySelector } from "./components/EventVisibilitySelector";
import { LanguageSelector } from "./components/LanguageSelector";
import { SpaceTypeSelector } from "./components/SpaceTypeSelector";
import { AccessTypeSelector } from "./components/AccessTypeSelector";
import { SavedConfigSelectorWrapper } from "./components/SavedConfigSelectorWrapper";
import { EventConfigProvider } from "./components/EventConfigProvider";
import { NextButton } from "./components/NextButton";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import useGetUser from "@/hooks/user/useGetUser";
import useGetTypesAndSubtypes from "@/hooks/eventTypes/useGetTypesAndSubtypes";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import NewEventConfigSkeleton from "./components/Skeleton";

const NewBusPage = () => {
  const { codeId, locale } = useParams();
  const router = useRouter();

  const t = useTranslations("EventCreation");

  const { data: user, isLoading: userLoading, isError: userError } = useGetUser();

  if (userError || !user) {
    router.push(`/${locale}/auth/org/login`);
  }

  // Fetch Types and SubTypes
  const { data: types, isLoading: typesLoading, isError: typesError } = useGetTypesAndSubtypes();
  if (typesLoading) {
    return <NewEventConfigSkeleton />;
  }

  if (typesError || !types) {
    return (
      <div className="flex items-center justify-center h-64">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Error loading types and subtypes</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <EventConfigProvider>
      <div className="space-y-2 w-full lg:max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <div className="flex justify-between">
          <SavedConfigSelectorWrapper />

          {/* <SaveConfigButton /> NFMVP*/}
        </div>

        <div className="flex flex-col gap-2 md:gap-3 w-full lg:w-4xl">
          <Card className="gap-4">
            <CardHeader>
              <CardTitle>{t("typeSelector.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <TypeSelector types={types} />
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
            <Card className="gap-2">
              <CardHeader>
                <CardTitle>{t("minorsSuitability.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <MinorsSuitabilitySelector />
              </CardContent>
            </Card>
            <Card className="gap-2">
              <CardHeader>
                <CardTitle>{t("eventVisibility.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <EventVisibilitySelector />
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
            <Card className="gap-2">
              <CardHeader>
                <CardTitle>{t("spaceType.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <SpaceTypeSelector />
              </CardContent>
            </Card>
            <Card className="gap-2">
              <CardHeader>
                <CardTitle>{t("accessType.title")}</CardTitle>
              </CardHeader>
              <CardContent>
                <AccessTypeSelector />
              </CardContent>
            </Card>
          </div>
          <Card className="gap-2">
            <CardHeader>
              <CardTitle>{t("languages.title")}</CardTitle>
              <CardDescription>{t("languages.description")}</CardDescription>
            </CardHeader>
            <CardContent>
              <LanguageSelector />
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end w-full">
          <NextButton />
        </div>
      </div>
    </EventConfigProvider>
  );
};

export default NewBusPage;
