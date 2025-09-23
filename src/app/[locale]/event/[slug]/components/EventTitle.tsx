"use client";

import { useEventText } from "./EventTextProvider";

export function EventTitle() {
  const { currentText } = useEventText();

  if (!currentText) {
    return null;
  }

  return <h1 className="text-2xl md:text-3xl font-bold text-wrap text-center">{currentText.title}</h1>;
}
