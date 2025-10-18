import { ImageDropzone } from "@/components/ui/image-dropzone";
import { BusinessImage, BusinessWithOrganizer } from "@/queries/client/business/getBusinessByCodeId";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { createBusinessImages } from "@/actions/business/createBusinessImages";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { BusinessImageCard } from "./BusinessImageCard";

export const UploadBannerImages = ({ business }: { business: BusinessWithOrganizer }) => {
  const t = useTranslations("uploadFiles");
  const queryClient = useQueryClient();
  const params = useParams();
  const { codeId } = params;
  const [isUploading, startUploadTransition] = useTransition();

  const businessImages = business.BusinessImage || [];

  const handleUploadComplete = async (urls: string[], sizes: number[]) => {
    startUploadTransition(async () => {
      const result = await createBusinessImages(business.id, urls, sizes);
      if (result.status === "success") {
        queryClient.invalidateQueries({ queryKey: ["business", codeId] });
        toast.success(t("success"));
      } else {
        toast.error(result.error || t("error"));
      }
    });
  };

  const handleUploadError = (error: string) => {
    toast.error(t("error"));
  };

  return (
    <div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {businessImages.map((image) => (
            <BusinessImageCard key={image.id} image={image} />
          ))}
        </div>

        {businessImages.length < 2 && (
          <ImageDropzone
            title="Upload Banner Images"
            description="Recomended size: 1920x1080px"
            bucket="organizers"
            folder="business-banners"
            multiple={true}
            maxFiles={2}
            acceptedFileTypes={["image/webp", "image/jpeg", "image/png"]}
            className="space-y-2"
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            disabled={isUploading}
          />
        )}
      </div>
    </div>
  );
};
