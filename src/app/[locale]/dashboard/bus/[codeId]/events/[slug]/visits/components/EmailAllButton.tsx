"use client";

import { Button } from "@/components/ui/button";
import { Mail, MailsIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { type VisitsResponse } from "@/hooks/visits/useGetVisitsByEventSlug";
import { useState } from "react";
import EmailAllModal from "./EmailAllModal";

interface EmailAllButtonProps {
  data?: { pages: VisitsResponse[] };
}

const EmailAllButton = ({ data }: EmailAllButtonProps) => {
  const tVisits = useTranslations("VisitsPage");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailsList, setEmailsList] = useState<string[]>([]);

  const handleEmailAll = () => {
    // Collect all email addresses from all pages
    const allEmails = data?.pages
      .flatMap((page) => page.visits)
      .map((visit) => visit.ClientProfile?.email)
      .filter((email): email is string => !!email && email.trim() !== "");

    if (!allEmails || allEmails.length === 0) {
      toast.error(tVisits("noEmails"));
      return;
    }

    // Remove duplicates using Set
    const uniqueEmails = Array.from(new Set(allEmails));

    // Copy to clipboard
    const emailsText = uniqueEmails.join(", ");
    navigator.clipboard.writeText(emailsText);
    toast.success(tVisits("emailsCopied"));

    // Set emails and open modal
    setEmailsList(uniqueEmails);
    setIsModalOpen(true);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleEmailAll}>
        <MailsIcon className="size-4" />
        <span className="hidden md:block">{tVisits("emailAll")}</span>
      </Button>

      <EmailAllModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        emails={emailsList}
        defaultSubject={tVisits("emailSubject")}
        defaultBody={tVisits("emailBody")}
      />
    </>
  );
};

export default EmailAllButton;
