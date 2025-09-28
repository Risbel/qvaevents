"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const GoBackButton = ({ text, className, url }: { text?: string; className?: string; url?: string }) => {
  const router = useRouter();
  const t = useTranslations("navigation");

  return (
    <Button
      onClick={() => (url ? router.push(url) : router.back())}
      variant="outline"
      className={cn("gap-2 flex items-center cursor-pointer", className)}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">{text || t("goBack")}</span>
    </Button>
  );
};

export default GoBackButton;
