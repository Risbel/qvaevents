"use client";

import { ImageDropzone } from "@/components/ui/image-dropzone";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import BusinessLogoDelete from "./BusinessLogoDelete";
import BusinessLogoUpload from "./BusinessLogoUpload";
import { BusinessWithOrganizer } from "@/queries/client/business/getBusinessByCodeId";

const UploadLogo = ({ business }: { business: BusinessWithOrganizer }) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative inline-block">
        <Avatar className="h-32 w-32">
          <AvatarImage src={business.logo || undefined} />
          <AvatarFallback className="text-4xl">{getInitials(business.name || "N/A")}</AvatarFallback>
        </Avatar>
        {business.logo ? (
          <BusinessLogoDelete businessId={business.id} logoUrl={business.logo} />
        ) : (
          <BusinessLogoUpload businessId={business.id} />
        )}
      </div>
      <Alert variant="default" className="w-fit border-2 border-primary/50">
        <AlertTitle>Upload your business logo</AlertTitle>
        <AlertDescription className="text-xs">Recomended size: 400x400px</AlertDescription>
      </Alert>
    </div>
  );
};

export default UploadLogo;
