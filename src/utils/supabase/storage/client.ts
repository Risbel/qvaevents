import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import { createClient } from "../client";

function getStorage() {
  const { storage } = createClient();
  return storage;
}

interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  initialQuality?: number;
}

type UploadProps = {
  file: File;
  bucket: string;
  folder?: string;
  compression?: CompressionOptions;
};
export const uploadImage = async ({ file, bucket, folder, compression }: UploadProps) => {
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.webp`;

  try {
    // Default compression options
    const defaultOptions = {
      maxSizeMB: 0.05, // 50KB limit
      maxWidthOrHeight: 1200, // Maintain reasonable resolution
      initialQuality: 100, // Start with good quality
    };

    // Merge with custom options if provided
    const compressionOptions = {
      ...defaultOptions,
      ...compression,
      // Fixed options that shouldn't be overridden
      useWebWorker: true, // Better performance
      fileType: "image/webp", // WebP for better compression and quality
      alwaysKeepResolution: false, // Allow resizing for better compression
      preserveExif: false, // Remove metadata to save space
    };

    file = await imageCompression(file, compressionOptions);
  } catch (error) {
    return { imageUrl: "", error: "Image compression failed" };
  }

  const storage = getStorage();

  const { data, error } = await storage.from(bucket).upload(path, file);

  if (error) {
    return { imageUrl: "", error: `Image upload failed: ${error.message}` };
  }

  // Use the getPublicUrl method from Supabase storage
  const { data: publicUrlData } = storage.from(bucket).getPublicUrl(data.path);
  const imageUrl = publicUrlData.publicUrl;

  return { imageUrl, error: "" };
};

export const deleteImage = async (imageUrl: string) => {
  const bucketAndPathString = imageUrl.split("/storage/v1/object/public/")[1];
  const firstSlashIndex = bucketAndPathString.indexOf("/");

  const bucket = bucketAndPathString.slice(0, firstSlashIndex);
  const path = bucketAndPathString.slice(firstSlashIndex + 1);

  const storage = getStorage();

  const { data, error } = await storage.from(bucket).remove([path]);

  if (error) {
    return { data: null, error: `Image deletion failed: ${error.message}` };
  }

  return { data, error };
};
