import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/utils/supabase/storage/client";
import { useTranslations } from "next-intl";
import { updateBusinessLogo } from "@/actions/business/updateBusinessLogo";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface BusinessLogoUploadProps {
  businessId: number;
}

export default function BusinessLogoUpload({ businessId }: BusinessLogoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const tUploadFiles = useTranslations("uploadFiles");
  const queryClient = useQueryClient();
  const params = useParams();
  const { codeId } = params;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error(tUploadFiles("invalidImageType"));
      return;
    }

    const pendingToast = toast.loading(tUploadFiles("uploading"));
    startTransition(async () => {
      try {
        // Execute both operations in parallel
        const [uploadResult, updateResult] = await Promise.all([
          uploadImage({
            file,
            bucket: "organizers",
            folder: "business-logos",
            compression: {
              maxSizeMB: 0.02,
              maxWidthOrHeight: 400,
              initialQuality: 0.8,
            },
          }),
          // We'll await this later after checking upload result
          Promise.resolve(),
        ]);

        if (uploadResult.error) {
          throw new Error(uploadResult.error);
        }

        const result = await updateBusinessLogo(businessId, uploadResult.imageUrl);
        if (result.status === "error") {
          throw new Error(result.error as string);
        }

        queryClient.invalidateQueries({ queryKey: ["business", codeId] });
        toast.success(tUploadFiles("success"), { id: pendingToast });
      } catch (error) {
        toast.error(tUploadFiles("error"), { id: pendingToast });
        console.error(error);
      }
    });
  };

  const handleClick = () => {
    if (isPending) return;
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-2 right-2 rounded-full border-2 h-6 w-6 bg-background/70 cursor-pointer hover:bg-primary/20"
        onClick={handleClick}
        disabled={isPending}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isPending}
      />
    </>
  );
}
