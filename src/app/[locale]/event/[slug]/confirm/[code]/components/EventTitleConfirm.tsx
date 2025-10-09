"use client";

import { useEventText } from "../../../components/EventTextProvider";

export default function EventTitleConfirm() {
  const { currentText } = useEventText();
  return <>{currentText?.title || "Event"}</>;
}
