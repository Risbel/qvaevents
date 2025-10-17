"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadImage } from "@/utils/supabase/storage/client";
import { updateProfilePicture } from "@/actions/profile/updateProfilePicture";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface ProfilePictureUploadProps {
  organizerId: number;
}

export default function ProfilePictureUpload({ organizerId }: ProfilePictureUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const t = useTranslations("Profile.UploadProfilePicture");
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error(t("invalidImageType"));
      return;
    }

    // Show upload started toast
    const uploadToast = toast.loading(t("uploadingImage"));
    setIsUploading(true);

    try {
      // Upload new image to Supabase storage with custom compression
      const { imageUrl, error: uploadError } = await uploadImage({
        file,
        bucket: "organizers",
        folder: "profile-logos",
        compression: {
          maxSizeMB: 0.02, // 20KB for better quality profile pictures
          maxWidthOrHeight: 400, // Good size for profile pictures
          initialQuality: 0.8, // Higher quality for profile pictures
        },
      });

      if (uploadError) {
        throw new Error(uploadError);
      }

      // Update profile with new image URL
      const result = await updateProfilePicture(organizerId, imageUrl);

      if (result.status === "error") {
        throw new Error("Error updating profile picture");
      }

      // Success
      toast.success(t("profilePictureUpdated"), { id: uploadToast });
      router.refresh();
    } catch (error) {
      toast.error(t("errorUpdatingProfilePicture"), { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-0 -right-2 rounded-full border-2 h-7 w-7 bg-background/70 cursor-pointer hover:bg-primary/20"
        onClick={handleClick}
        disabled={isUploading}
      >
        <Plus className="h-4 w-4" />
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
      />
    </>
  );
}
