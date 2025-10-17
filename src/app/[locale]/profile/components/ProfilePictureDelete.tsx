"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteImage } from "@/utils/supabase/storage/client";
import { updateProfilePicture } from "@/actions/profile/updateProfilePicture";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface ProfilePictureDeleteProps {
  organizerId: number;
  logoUrl: string;
}

export default function ProfilePictureDelete({ organizerId, logoUrl }: ProfilePictureDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations("Profile.UploadProfilePicture");
  const tActions = useTranslations("actions");
  const router = useRouter();

  const handleDelete = async () => {
    if (isDeleting) return;

    const deleteToast = toast.loading(t("deletingImage"));
    setIsDeleting(true);

    try {
      // Delete from storage
      const { error: deleteError } = await deleteImage(logoUrl);
      if (deleteError) {
        throw new Error(deleteError);
      }

      // Update profile
      const result = await updateProfilePicture(organizerId, "");
      if (result.status === "error") {
        throw new Error("Error updating profile");
      }

      toast.success(t("deletingImageSuccess"), { id: deleteToast });
      router.refresh();
    } catch (error) {
      toast.error(t("deletingImageError"), { id: deleteToast });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-0 -right-2 rounded-full border-2 h-7 w-7 bg-background/70 cursor-pointer hover:bg-destructive/20"
          disabled={isDeleting}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription>{t("deleteDescription")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tActions("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90 cursor-pointer"
          >
            {isDeleting ? tActions("deleting") : tActions("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
