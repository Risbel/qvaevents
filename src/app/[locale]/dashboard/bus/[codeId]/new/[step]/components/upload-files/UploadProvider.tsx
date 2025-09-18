"use client";

import { createContext, useContext, ReactNode, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

// Context for managing upload state
interface UploadContextType {
  isUploading: boolean;
  setUploading: (isUploading: boolean) => void;
  onUploadComplete: () => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

// Hook to use the upload context
export const useUploadContext = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error("useUploadContext must be used within an UploadProvider");
  }
  return context;
};

// Custom hook for upload state management
const useUploadState = () => {
  const [isUploading, setIsUploading] = useTransition();
  const router = useRouter();
  const tActions = useTranslations("actions");

  const setUploading = (uploading: boolean) => {
    if (uploading) {
      setIsUploading(() => {
        // This will set isUploading to true
      });
    }
  };

  const onUploadComplete = () => {
    router.refresh();
  };

  // Handle toast notifications based on upload state
  useEffect(() => {
    if (isUploading) {
      toast.loading(tActions("uploading"), { id: "upload-images" });
    } else {
      toast.dismiss("upload-images");
    }
  }, [isUploading, tActions]);

  return { isUploading, setUploading, onUploadComplete };
};

// Provider component
export const UploadProvider = ({ children }: { children: ReactNode }) => {
  const uploadState = useUploadState();

  return <UploadContext.Provider value={uploadState}>{children}</UploadContext.Provider>;
};
