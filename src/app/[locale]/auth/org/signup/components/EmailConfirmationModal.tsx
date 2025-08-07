"use client";

import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, ExternalLink } from "lucide-react";

interface EmailConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function EmailConfirmationModal({ isOpen, onClose, email }: EmailConfirmationModalProps) {
  const t = useTranslations("Auth.emailConfirmation");

  const getInboxUrl = () => {
    // Extract domain from email to determine email provider
    const domain = email.split("@")[1]?.toLowerCase();

    if (domain?.includes("gmail.com") || domain?.includes("googlemail.com")) {
      return "https://mail.google.com/mail/u/0/#inbox";
    } else if (domain?.includes("outlook.com") || domain?.includes("hotmail.com") || domain?.includes("live.com")) {
      return "https://outlook.live.com/mail/0/inbox";
    } else if (domain?.includes("yahoo.com")) {
      return "https://mail.yahoo.com/";
    } else if (domain?.includes("icloud.com") || domain?.includes("me.com")) {
      return "https://www.icloud.com/mail/";
    } else {
      // Default to Gmail for unknown domains
      return "https://mail.google.com/mail/u/0/#inbox";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-semibold">{t("title")}</DialogTitle>
          <DialogDescription className="text-center text-base">{t("description")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="font-medium text-sm">{t("accountCreated")}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("checkEmail")} <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-sm">{t("nextSteps")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>{t("step1")}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>{t("step2")}</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <span>{t("step3")}</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col space-y-2 pt-2">
            <Button asChild className="w-full">
              <a href={getInboxUrl()} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                {t("openEmailApp")}
              </a>
            </Button>
            <Button variant="outline" onClick={onClose} className="w-full">
              {t("close")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
