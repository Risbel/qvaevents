import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getTypesAndSubtypes, TypeWithSubTypes } from "@/queries/types/getTypesAndSubtypes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TypeSelector } from "./components/TypeSelector";
import { MinorsSuitabilitySelector } from "./components/MinorsSuitabilitySelector";
import { EventVisibilitySelector } from "./components/EventVisibilitySelector";
import { LanguageSelector } from "./components/LanguageSelector";
import { SpaceTypeSelector } from "./components/SpaceTypeSelector";
import { AccessTypeSelector } from "./components/AccessTypeSelector";
import { SavedConfigSelectorWrapper } from "./components/SavedConfigSelectorWrapper";
import { SaveConfigButton } from "./components/SaveConfigButton";
import { EventConfigProvider } from "./components/EventConfigProvider";
import { NextButton } from "./components/NextButton";
import { getTranslations } from "next-intl/server";

const NewBusPage = async ({ params }: { params: Promise<{ codeId: string; locale: string }> }) => {
  const { codeId, locale } = await params;
  const supabase = await createClient();
  const t = await getTranslations("EventCreation");

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    redirect(`/${locale}/auth/org/login`);
  }

  // Fetch Types and SubTypes
  const typesResult = await getTypesAndSubtypes();
  const types: TypeWithSubTypes[] =
    typesResult.status === "success" && Array.isArray(typesResult.data?.types) ? typesResult.data.types : [];

  return (
    <EventConfigProvider>
      <div className="space-y-2 w-full lg:max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <div className="flex justify-between">
          <SavedConfigSelectorWrapper codeId={codeId} />

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
