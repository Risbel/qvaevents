"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteEventImage } from "@/actions/event/deleteEventImage";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("actions");
  const tEventImagesManager = useTranslations("EventImagesManager");

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteEventImage(image.id, image.url);

      if (result.status === "success") {
        toast.success(tEventImagesManager("deletedSuccessfully"));
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
      <Image
        src={image.url}
        alt={`Event image ${image.id}`}
        width={200}
        height={200}
        className="w-full h-32 object-cover rounded-lg border"
      />

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
