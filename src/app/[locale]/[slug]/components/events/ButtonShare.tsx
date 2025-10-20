import { Button } from "@/components/ui/button";
import { Share2Icon } from "lucide-react";
import { toast } from "sonner";

interface ButtonShareProps {
  locale: string;
  eventSlug: string;
  eventTitle: string;
  eventDescription: string;
}

const ButtonShare = ({ locale, eventSlug, eventTitle, eventDescription }: ButtonShareProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute top-4 right-4 bg-background backdrop-blur-sm"
      onClick={async () => {
        const url = `${window.location.origin}/${locale}/event/${eventSlug}`;
        const title = `Event: ${eventTitle}`;
        const description = `${eventDescription}`;

        if (navigator.share) {
          try {
            await navigator.share({
              title,
              text: description,
              url,
            });
          } catch (error) {
            toast.info("Share cancelled");
          }
        } else {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
        }
      }}
    >
      <Share2Icon className="w-4 h-4 text-primary" />
    </Button>
  );
};

export default ButtonShare;
