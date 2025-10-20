"use client";

import { uploadImage } from "@/utils/supabase/storage/client";
import { convertBlobUrlToFile } from "@/utils/supabase/storage/utils";
import { ChangeEvent, useRef, useState, useTransition, useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  initialQuality?: number;
}

interface ImageDropzoneProps {
  title?: string;
  description?: string;
  bucket: string;
  folder?: string;
  multiple?: boolean;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  compression?: CompressionOptions;
  onUploadComplete?: (urls: string[], sizes: number[]) => void;
  onUploadError?: (error: string) => void;
  onUploadStateChange?: (isPending: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export function ImageDropzone({
  title = "Upload Images",
  description = "Drag and drop images here, or click to select",
  bucket,
  folder,
  multiple = true,
  maxFiles = 10,
  acceptedFileTypes = ["image/webp", "image/jpeg", "image/png"],
  compression = {
    maxSizeMB: 0.05,
    maxWidthOrHeight: 1200,
    initialQuality: 100,
  },
  onUploadComplete,
  onUploadError,
  onUploadStateChange,
  className,
  disabled = false,
}: ImageDropzoneProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [fileSizes, setFileSizes] = useState<number[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isDragOver, setIsDragOver] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("actions");

  // Notify parent about pending state changes
  useEffect(() => {
    onUploadStateChange?.(isPending);
  }, [isPending, onUploadStateChange]);
  const handleImageChange = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const filesArray = Array.from(files);
      const validFiles = filesArray.filter((file) => {
        if (!acceptedFileTypes.includes(file.type)) {
          onUploadError?.("Invalid file type. Please upload images only.");
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const newImageUrls = validFiles.map((file) => URL.createObjectURL(file));
      const newFileSizes = validFiles.map((file) => file.size);

      const updatedUrls = multiple ? [...imageUrls, ...newImageUrls].slice(0, maxFiles) : newImageUrls.slice(0, 1);
      const updatedSizes = multiple ? [...fileSizes, ...newFileSizes].slice(0, maxFiles) : newFileSizes.slice(0, 1);

      setImageUrls(updatedUrls);
      setFileSizes(updatedSizes);
    },
    [imageUrls, fileSizes, multiple, maxFiles, acceptedFileTypes, onUploadError]
  );

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleImageChange(e.target.files);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (disabled) return;
      handleImageChange(e.dataTransfer.files);
    },
    [disabled, handleImageChange]
  );

  const removeImage = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    const newSizes = fileSizes.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    setFileSizes(newSizes);
  };

  const handleUpload = async () => {
    if (imageUrls.length === 0) return;

    startTransition(async () => {
      const urls: string[] = [];

      for (const url of imageUrls) {
        try {
          const imageFile = await convertBlobUrlToFile(url);

          const { imageUrl, error } = await uploadImage({
            file: imageFile,
            bucket,
            folder,
            compression,
          });

          if (error) {
            onUploadError?.(error);
            return;
          }

          urls.push(imageUrl);
        } catch (error) {
          onUploadError?.("Failed to upload image");
          return;
        }
      }

      onUploadComplete?.(urls, fileSizes);
      setImageUrls([]);
      setFileSizes([]);
    });
  };

  const openFileDialog = () => {
    if (disabled) return;
    imageInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Card
        className={cn(
          "border-2 border-dashed transition-colors cursor-pointer hover:border-primary",
          isDragOver && "border-primary bg-primary/5",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          {imageUrls.length === 0 ? (
            <>
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                {isDragOver ? t("dropImagesHere") : t("clickToSelect")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("acceptedFileTypes", { types: acceptedFileTypes.join(", ") })}
              </p>
            </>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {imageUrls.map((url, index) => (
                <div key={url} className="relative group">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    width={150}
                    height={150}
                    className="rounded-lg object-cover w-full h-32"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className={cn("absolute top-2 right-2 h-6 w-6 p-0", disabled || (isPending && "opacity-50"))}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                    disabled={disabled || isPending}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <input
        type="file"
        hidden
        multiple={multiple}
        ref={imageInputRef}
        onChange={handleFileInputChange}
        accept={acceptedFileTypes.join(",")}
        disabled={disabled}
      />

      {imageUrls.length > 0 && (
        <div className="flex gap-2">
          <Button onClick={handleUpload} disabled={isPending || disabled} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            {isPending ? t("uploading") : t("upload", { count: imageUrls.length })}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setImageUrls([]);
              setFileSizes([]);
            }}
            disabled={isPending || disabled}
          >
            {t("clear")}
          </Button>
        </div>
      )}
    </div>
  );
}
