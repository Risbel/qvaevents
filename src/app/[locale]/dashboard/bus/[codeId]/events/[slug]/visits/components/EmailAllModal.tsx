"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface EmailAllModalProps {
  isOpen: boolean;
  onClose: () => void;
  emails: string[];
  defaultSubject: string;
  defaultBody: string;
}

const EmailAllModal = ({ isOpen, onClose, emails, defaultSubject, defaultBody }: EmailAllModalProps) => {
  const tVisits = useTranslations("VisitsPage");
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [filteredEmails, setFilteredEmails] = useState<string[]>(emails);

  // Update filtered emails when modal opens with new emails
  useEffect(() => {
    if (isOpen) {
      setFilteredEmails(emails);
      setSubject(defaultSubject);
      setBody(defaultBody);
    }
  }, [isOpen, emails, defaultSubject, defaultBody]);

  const handleRemoveEmail = (emailToRemove: string) => {
    setFilteredEmails((prev) => prev.filter((email) => email !== emailToRemove));
  };

  const handleSubmit = () => {
    if (filteredEmails.length === 0) return;

    // Get subject and body
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    // Open email client with BCC, subject, and body
    const mailtoUrl = `mailto:?bcc=${filteredEmails.join(",")}&subject=${encodedSubject}&body=${encodedBody}`;
    window.location.href = mailtoUrl;

    // Close modal after redirect
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className=" lg:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{tVisits("emailAll")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-y-auto">
          {/* Recipients List */}
          <div className="space-y-2">
            <Label>
              {tVisits("recipients")} ({filteredEmails.length})
            </Label>
            <div className="border rounded-md p-3 max-h-24 overflow-y-auto bg-muted/30">
              {filteredEmails.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {filteredEmails.map((email, index) => (
                    <Badge key={index} variant="secondary" className="text-xs flex items-center gap-1 pr-1">
                      <span>{email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(email)}
                        className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                        aria-label="Remove email"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">{tVisits("noRecipientsSelected")}</p>
              )}
            </div>
          </div>

          {/* Subject Input */}
          <div className="space-y-2">
            <Label htmlFor="subject">{tVisits("subject")}</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder={tVisits("emailSubject")}
            />
          </div>

          {/* Body Textarea */}
          <div className="space-y-2">
            <Label htmlFor="body">{tVisits("body")}</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={tVisits("emailBody")}
              rows={8}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            {tVisits("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!subject.trim() || !body.trim() || filteredEmails.length === 0}>
            {tVisits("sendEmail")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailAllModal;
