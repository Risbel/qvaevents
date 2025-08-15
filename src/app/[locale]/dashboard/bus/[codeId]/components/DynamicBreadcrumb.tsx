"use client";

import { usePathname } from "@/i18n/navigation";
import { BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";

interface DynamicBreadcrumbProps {
  locale: string;
  codeId: string;
}

export function DynamicBreadcrumb({ locale, codeId }: DynamicBreadcrumbProps) {
  const pathname = usePathname();

  // Extract the path segment after the codeId
  const pathSegments = pathname.split("/");
  const codeIdIndex = pathSegments.findIndex((segment) => segment === codeId);

  // If codeId is found and there's a segment after it
  if (codeIdIndex !== -1 && codeIdIndex + 1 < pathSegments.length) {
    const currentSegment = pathSegments[codeIdIndex + 1];

    // Don't show if it's empty or if it's a special Next.js segment
    if (currentSegment && currentSegment !== "page" && currentSegment !== "route") {
      // Convert kebab-case to Title Case
      const formattedSegment = currentSegment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return (
        <BreadcrumbItem>
          <BreadcrumbPage>{formattedSegment}</BreadcrumbPage>
        </BreadcrumbItem>
      );
    }
  }

  // Return null if no path segment to show
  return null;
}
