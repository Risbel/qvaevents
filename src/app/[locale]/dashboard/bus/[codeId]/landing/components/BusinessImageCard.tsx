import { useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, ImageOff } from "lucide-react";
import { deleteBusinessImage } from "@/actions/business/deleteBusinessImage";
import { toast } from "sonner";
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
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

interface BusinessImageCardProps {
  image: {
    id: number;
    url: string;

    size: number | null;
  };
  onDelete?: () => void;
}

export function BusinessImageCard({ image, onDelete }: BusinessImageCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const t = useTranslations("actions");
  const tUploadFiles = useTranslations("uploadFiles");
  const queryClient = useQueryClient();
  const params = useParams();
  const { codeId } = params;

  const handleDelete = () => {
    if (isPending) return;

    const pendingToast = toast.loading(t("deleting"));
    startTransition(async () => {
      try {
        const result = await deleteBusinessImage(image.id, image.url);

        if (result.status === "success") {
          queryClient.invalidateQueries({ queryKey: ["business", codeId] });
          toast.success(tUploadFiles("deletingImageSuccess"), { id: pendingToast });
          onDelete?.();
        } else {
          toast.error(result.error || tUploadFiles("error"), { id: pendingToast });
        }
      } catch (error) {
        toast.error(tUploadFiles("error"), { id: pendingToast });
        console.error(error);
      }
    });
  };

  return (
    <div className="relative group">
      {/* Image */}

      {/* Let's use dimentions for a mobile view that ocupy the full h of the screen */}
      <Image
        src={image.url}
        alt={`Business banner ${image.id}`}
        width={100}
        height={150}
        priority={true}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`w-full h-64 object-cover rounded-lg border ${isLoading || isError ? "opacity-0" : "opacity-100"}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsError(true);
          setIsLoading(false);
        }}
      />

      {/* Loading skeleton */}
      {isLoading && !isError && <Skeleton className="absolute inset-0 rounded-lg" />}

      {/* Error fallback */}
      {isError && (
        <div className="absolute inset-0 rounded-lg border flex items-center justify-center bg-muted/40">
          <ImageOff className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="absolute rounded-full top-2 right-2 h-8 w-8 p-0 cursor-pointer bg-background/70"
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
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90 cursor-pointer"
            >
              {isPending ? t("deleting") : t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Loading Overlay */}
      {isPending && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
          <div className="text-white text-sm">{t("deleting")}</div>
        </div>
      )}
    </div>
  );
}
