"use client";

import { Button } from "@/components/ui/button";
import { MessageSquare, MessageSquareShareIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { type VisitsResponse } from "@/hooks/visits/useGetVisitsByEventSlug";

interface MessageAllButtonProps {
  data?: { pages: VisitsResponse[] };
}

const MessageAllButton = ({ data }: MessageAllButtonProps) => {
  const tVisits = useTranslations("VisitsPage");

  const handleMessageAll = () => {
    // Collect all phone numbers from all pages
    const allPhoneNumbers = data?.pages
      .flatMap((page) => page.visits)
      .map((visit) => visit.ClientProfile?.phone)
      .filter((phone): phone is string => !!phone && phone.trim() !== "");

    if (!allPhoneNumbers || allPhoneNumbers.length === 0) {
      toast.error(tVisits("noPhoneNumbers"));
      return;
    }

    // Remove duplicates using Set
    const uniquePhoneNumbers = Array.from(new Set(allPhoneNumbers));

    // Copy to clipboard (one number per line for easy pasting in WhatsApp/messaging apps)
    const phonesList = uniquePhoneNumbers.join("\n");
    navigator.clipboard.writeText(phonesList);
    toast.success(tVisits("phonesCopied"));
  };

  return (
    <Button variant="outline" size="sm" onClick={handleMessageAll}>
      <MessageSquareShareIcon className="size-4" />
      <span className="hidden md:block">{tVisits("messageAll")}</span>
    </Button>
  );
};

export default MessageAllButton;
