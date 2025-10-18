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
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteImage } from "@/utils/supabase/storage/client";
import { useTranslations } from "next-intl";
import { updateBusinessLogo } from "@/actions/business/updateBusinessLogo";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface BusinessLogoDeleteProps {
  businessId: number;
  logoUrl: string;
}

export default function BusinessLogoDelete({ businessId, logoUrl }: BusinessLogoDeleteProps) {
  const [isPending, startTransition] = useTransition();
  const tUploadFiles = useTranslations("uploadFiles");
  const tActions = useTranslations("actions");
  const queryClient = useQueryClient();
  const params = useParams();
  const { codeId } = params;

  const handleDelete = async () => {
    if (isPending) return;

    const pendingToast = toast.loading(tUploadFiles("deleting"));
    startTransition(async () => {
      try {
        // Execute both operations in parallel
        const [deleteResult, updateResult] = await Promise.all([
          deleteImage(logoUrl),
          updateBusinessLogo(businessId, ""),
        ]);

        if (deleteResult.error) {
          throw new Error(deleteResult.error);
        }

        if (updateResult.status === "error") {
          throw new Error(updateResult.error as string);
        }

        queryClient.invalidateQueries({ queryKey: ["business", codeId] });
        toast.success(tUploadFiles("deletingImageSuccess"), { id: pendingToast });
      } catch (error) {
        toast.error(tUploadFiles("error"), { id: pendingToast });
        console.error(error);
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-0 -right-2 rounded-full border-2 h-6 w-6 bg-background/70 cursor-pointer hover:bg-destructive/20"
          disabled={isPending}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{tUploadFiles("dialogTitle")}</AlertDialogTitle>
          <AlertDialogDescription>{tUploadFiles("dialogDescription")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{tActions("cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/90 cursor-pointer"
          >
            {isPending ? tActions("deleting") : tActions("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
