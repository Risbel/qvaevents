"use client";

import { Button } from "@/components/ui/button";
import { Share2Icon } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useEventText } from "./EventTextProvider";

interface ShareEventButtonProps {
  eventDate: string;
  eventSlug: string;
  locale: string;
}

const ShareEventButton = ({ eventDate, eventSlug, locale }: ShareEventButtonProps) => {
  const t = useTranslations("EventPage");
  const { currentText } = useEventText();

  const shareEvent = async () => {
    const eventUrl = `${window.location.origin}/${locale}/event/${eventSlug}`;
    const formattedDate = new Date(eventDate).toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const shareText = `${t("shareEventText", { eventTitle: currentText?.title || "" })}\n📅 ${formattedDate}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: currentText?.title,
          text: shareText,
          url: eventUrl,
        });
      } catch (err) {
        return;
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast.success(t("shareEventCopied"));
    }
  };

  return (
    <Button variant="outline" className="flex items-center gap-2 cursor-pointer" onClick={shareEvent}>
      <Share2Icon className="h-4 w-4" />
      {t("shareEvent")}
    </Button>
  );
};

export default ShareEventButton;
