"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useEventText } from "./EventTextProvider";

export function EventLocation() {
  const { currentText } = useEventText();

  if (!currentText || !currentText.locationText) {
    return null;
  }

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-break-spaces">{currentText.locationText}</p>
      </CardContent>
    </Card>
  );
}
