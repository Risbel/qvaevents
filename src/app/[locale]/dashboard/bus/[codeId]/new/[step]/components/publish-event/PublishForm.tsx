import { useState, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Globe, BarChart, ArrowLeft, Loader2, ExternalLinkIcon } from "lucide-react";
import { publishEvent } from "@/actions/event/publishEvent";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface PublishFormProps {
  eventId: number;
  eventSlug: string;
  isPublished?: boolean;
}

export function PublishForm({ eventId, eventSlug, isPublished = false }: PublishFormProps) {
  const params = useParams();
  const { locale, codeId } = params;
  const [isPending, startTransition] = useTransition();
  const [isPublishedState, setIsPublishedState] = useState(isPublished);
  const router = useRouter();
  const t = useTranslations("EventPublish");
  const tNavigation = useTranslations("navigation");
  const queryClient = useQueryClient();
  const handlePublish = () => {
    startTransition(async () => {
      try {
        const result = await publishEvent(eventId);

        if (result.status === "success") {
          setIsPublishedState(true);
          toast.success(t("publishSuccess"));
          queryClient.invalidateQueries({ queryKey: ["event", eventSlug] });
        } else {
          toast.error(result.error || t("publishError"));
        }
      } catch (error) {
        toast.error(t("publishError"));
      }
    });
  };

  if (isPublishedState) {
    return (
      <div className="w-full lg:w-2xl mx-auto space-y-6">
        <Card className="border-primary/50 shadow-md shadow-primary/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">{t("publishedTitle")}</CardTitle>
            <CardDescription>{t("publishedDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <a
              className={cn(buttonVariants({ variant: "outline" }), "cursor-pointer", isPending && "opacity-50")}
              href={`/${locale}/event/${eventSlug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              {t("viewEvent")}
            </a>
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={() => router.push(`/${locale}/dashboard/bus/${codeId}/events`)}
              disabled={isPending}
            >
              <BarChart className="h-4 w-4" />
              {t("details")}
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-start pt-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/${locale}/dashboard/bus/${codeId}/new/2?slug=${eventSlug}`)}
            className="flex items-center gap-2 cursor-pointer"
            disabled={isPending}
          >
            <ArrowLeft className="h-4 w-4" />
            {tNavigation("goBack")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            {t("publishTitle")}
          </CardTitle>
          <CardDescription>{t("publishDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              {t("publishWarningTitle")}
            </AlertTitle>
            <AlertDescription>{t("publishWarningDescription")}</AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h4 className="font-semibold">{t("beforePublishing")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {t("checklistBasicInfo")}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {t("checklistImages")}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {t("checklistContent")}
              </li>
            </ul>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={handlePublish}
              disabled={isPending}
              size="lg"
              className="flex items-center gap-2 cursor-pointer"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
              {isPending ? t("publishing") : t("publishEvent")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-start pt-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/${locale}/dashboard/bus/${codeId}/new/2?slug=${eventSlug}`)}
          className="flex items-center gap-2 cursor-pointer"
          disabled={isPending}
        >
          <ArrowLeft className="h-4 w-4" />
          {tNavigation("goBack")}
        </Button>
      </div>
    </div>
  );
}
