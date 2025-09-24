"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventText } from "./EventTextProvider";

export function EventDescription() {
  const { currentText } = useEventText();

  if (!currentText) {
    return null;
  }

  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-break-spaces">{currentText.description}</p>
      </CardContent>
    </Card>
  );
}
