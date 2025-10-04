"use client";

import { Button } from "@/components/ui/button";
import { Share2Icon } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface ShareEventButtonProps {
  eventTitle: string;
  eventDate: string;
  eventSlug: string;
  locale: string;
}

const ShareEventButton = ({ eventTitle, eventDate, eventSlug, locale }: ShareEventButtonProps) => {
  const t = useTranslations("EventPage");

  const shareEvent = async () => {
    const eventUrl = `${window.location.origin}/${locale}/event/${eventSlug}`;
    const formattedDate = new Date(eventDate).toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const shareText = `🎉 ${eventTitle}\n📅 ${formattedDate}\n\n${eventUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
          text: t("shareEventText", { eventTitle }),
          url: eventUrl,
        });
      } catch (err) {
        toast.error(t("shareEventFailed"));
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
