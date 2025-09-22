import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";
import { ImageOff } from "lucide-react";
import { deleteEventImage } from "@/actions/event/deleteEventImage";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

interface EventImageCardProps {
  image: {
    id: number;
    url: string;
    type: string;
    size: number | null;
  };
  onDelete?: () => void;
}

export function EventImageCard({ image, onDelete }: EventImageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const t = useTranslations("actions");
  const tEventImagesManager = useTranslations("EventImagesManager");
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") as string;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteEventImage(image.id, image.url);

      if (result.status === "success") {
        toast.success(tEventImagesManager("deletedSuccessfully"));
        queryClient.invalidateQueries({ queryKey: ["event", slug] });
        onDelete?.();
      } else {
        toast.error(result.error || tEventImagesManager("uploadImagesError"));
      }
    } catch (error) {
      toast.error(tEventImagesManager("uploadImagesError"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative group">
      {/* Image */}
      <Image
        src={image.url}
        alt={`Event image ${image.id}`}
        width={200}
        height={200}
        className={`w-full h-32 object-cover rounded-lg border transition-opacity duration-300 ${
          isLoading || isError ? "opacity-0" : "opacity-100"
        }`}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setIsError(true);
          setIsLoading(false);
        }}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 200px"
      />

      {/* Loading skeleton */}
      {isLoading && !isError && <Skeleton className="absolute inset-0 rounded-lg" />}

      {/* Error fallback */}
      {isError && (
        <div className="absolute inset-0 rounded-lg border flex items-center justify-center bg-muted/40">
          <ImageOff className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {/* Delete Button */}
      <Button
        variant="destructive"
        size="sm"
        className="absolute top-2 right-2 h-8 w-8 p-0 cursor-pointer"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Loading Overlay */}
      {isDeleting && (
        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
          <div className="text-white text-sm">{t("deleting")}</div>
        </div>
      )}
    </div>
  );
}
