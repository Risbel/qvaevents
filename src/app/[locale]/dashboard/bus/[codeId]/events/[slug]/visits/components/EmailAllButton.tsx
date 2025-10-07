import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { type VisitsResponse } from "@/hooks/visits/useGetVisitsByEventSlug";

interface EmailAllButtonProps {
  data?: { pages: VisitsResponse[] };
}

const EmailAllButton = ({ data }: EmailAllButtonProps) => {
  const tVisits = useTranslations("VisitsPage");

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

    // Copy to clipboard
    const emailsList = allEmails.join(", ");
    navigator.clipboard.writeText(emailsList);
    toast.success(tVisits("emailsCopied"));

    // Get subject and body from translations
    const subject = encodeURIComponent(tVisits("emailSubject"));
    const body = encodeURIComponent(tVisits("emailBody"));

    // Open email client with BCC, subject, and body
    // Format: mailto:?bcc=emails&subject=Subject&body=Body
    const mailtoUrl = `mailto:?bcc=${allEmails.join(",")}&subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
  };

  return (
    <Button variant="outline" size="sm" onClick={handleEmailAll}>
      <Mail className="size-4" />
      {tVisits("emailAll")}
    </Button>
  );
};

export default EmailAllButton;
