import { ImageDropzone } from "@/components/ui/image-dropzone";
import { useState } from "react";
import { toast } from "sonner";
import { saveEventImages } from "@/actions/event/saveEventImages";
import { useTranslations } from "next-intl";
import { useUploadContext } from "./UploadProvider";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

interface UploadPostersProps {
  eventId: number;
  currentImageCount?: number;
}

// This component will be used within the UploadProvider context
const UploadPosters = ({ eventId, currentImageCount = 0 }: UploadPostersProps) => {
  const t = useTranslations("EventImagesManager");
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") as string;
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const { setUploading, isUploading } = useUploadContext();
  const queryClient = useQueryClient();

  const maxImages = 2;
  const remainingSlots = maxImages - currentImageCount;

  const handleUploadComplete = async (urls: string[], sizes: number[]) => {
    try {
      const result = await saveEventImages(eventId, urls, sizes);

      if (result.status === "success") {
        setUploadedUrls((prev) => [...prev, ...urls]);
        toast.success(t("uploadImagesSuccess", { count: urls.length }));
        queryClient.invalidateQueries({ queryKey: ["event", slug] });
      } else {
        toast.error(result.error || t("uploadImagesError"));
      }
    } catch (error) {
      toast.error(t("uploadImagesError"));
    }
  };

  const handleUploadError = (error: string) => {
    toast.error(error || t("uploadImagesError"));
  };

  return (
    <ImageDropzone
      title={t("eventPosters")}
      description={t("eventPostersDescription")}
      bucket="events"
      folder="posters"
      multiple={true}
      maxFiles={remainingSlots}
      acceptedFileTypes={["image/webp", "image/jpeg", "image/png"]}
      onUploadComplete={handleUploadComplete}
      onUploadError={handleUploadError}
      onUploadStateChange={setUploading}
      className="w-full lg:w-4xl"
      disabled={isUploading}
    />
  );
};

export default UploadPosters;
