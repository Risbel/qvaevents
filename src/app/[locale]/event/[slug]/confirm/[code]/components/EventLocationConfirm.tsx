"use client";

import { useEventText } from "../../../components/EventTextProvider";
import { MapPin } from "lucide-react";

export default function EventLocationConfirm() {
  const { currentText } = useEventText();

  if (!currentText?.locationText) return null;

  return (
    <div className="flex items-center gap-3">
      <MapPin className="h-5 w-5 text-primary" />
      <p className="text-sm">{currentText.locationText}</p>
    </div>
  );
}
