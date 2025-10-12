"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventText } from "./EventTextProvider";
import { useTranslations } from "next-intl";

export function EventDescription() {
  const { currentText } = useEventText();
  const t = useTranslations("EventPage");

  if (!currentText) {
    return null;
  }

  return (
    <Card className="gap-2 shadow-md shadow-primary/20">
      <CardHeader>
        <CardTitle>{t("aboutEvent")}:</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-break-spaces">{currentText.description}</p>
      </CardContent>
    </Card>
  );
}
