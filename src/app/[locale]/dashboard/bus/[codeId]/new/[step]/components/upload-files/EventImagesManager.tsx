"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import UploadPosters from "./UploadPosters";
import { EventImageCard } from "./EventImageCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { UploadProvider, useUploadContext } from "./UploadProvider";

interface EventImagesManagerProps {
  eventId: number;
  images: Array<{
    id: number;
    url: string;
    type: string;
    size: number | null;
  }>;
  maxImages: number;
  canUploadMore: boolean;
}
// Component that uses the context (must be inside UploadProvider)
const EventImagesManagerContent = ({ eventId, images, maxImages, canUploadMore }: EventImagesManagerProps) => {
  const router = useRouter();
  const params = useParams();
  const { codeId } = params as { codeId: string };
  const searchParams = useSearchParams();
  const eventSlug = searchParams.get("slug") as string;
  const t = useTranslations("EventImagesManager");
  const tNavigation = useTranslations("navigation");

  const { isUploading } = useUploadContext();

  const handleImageDelete = () => {
    router.refresh();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Existing Images Section */}
      {images.length > 0 && (
        <Card className="w-ful lg:w-4xl border-primary/50 shadow-md shadow-primary/50">
          <CardHeader className="gap-0">
            <CardTitle className="text-lg font-semibold">
              {t("currentEventImages", { count: images.length })} ({images.length}/{maxImages})
            </CardTitle>
            <CardDescription>{t("uploadImagesDescription")}</CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <EventImageCard key={image.id} image={image} onDelete={handleImageDelete} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Upload Section - Only show if under limit */}
      {canUploadMore && <UploadPosters eventId={eventId} currentImageCount={images.length} />}

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={() => router.push(`/dashboard/bus/${codeId}/new/1?slug=${eventSlug}`)}
          disabled={isUploading}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          {tNavigation("goBack")}
        </Button>

        <Button
          onClick={() => router.push(`/dashboard/bus/${codeId}/new/3?slug=${eventSlug}`)}
          disabled={images.length === 0 || isUploading}
          className="flex items-center gap-2 cursor-pointer"
        >
          {tNavigation("next")}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Main component that provides the context
const EventImagesManager = (props: EventImagesManagerProps) => {
  return (
    <UploadProvider>
      <EventImagesManagerContent {...props} />
    </UploadProvider>
  );
};

export default EventImagesManager;
