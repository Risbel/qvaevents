import { v4 as uuidv4 } from "uuid";
import imageCompression from "browser-image-compression";
import { createClient } from "../client";

function getStorage() {
  const { storage } = createClient();
  return storage;
}

type UploadProps = {
  file: File;
  bucket: string;
  folder?: string;
};
export const uploadImage = async ({ file, bucket, folder }: UploadProps) => {
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.webp`;

  try {
    file = await imageCompression(file, {
      maxSizeMB: 0.05, // 50KB limit
      maxWidthOrHeight: 1200, // Maintain reasonable resolution
      useWebWorker: true, // Better performance
      fileType: "image/webp", // WebP for better compression and quality
      initialQuality: 0.8, // Start with good quality
      alwaysKeepResolution: false, // Allow resizing for better compression
      preserveExif: false, // Remove metadata to save space
    });
  } catch (error) {
    return { imageUrl: "", error: "Image compression failed" };
  }

  const storage = getStorage();

  const { data, error } = await storage.from(bucket).upload(path, file);

  if (error) {
    console.error("Upload error:", error);
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

  return { data, error };
};
