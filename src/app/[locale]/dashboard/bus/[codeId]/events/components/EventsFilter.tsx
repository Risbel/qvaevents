"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Calendar, CalendarClock } from "lucide-react";

const EventsFilter = () => {
  const t = useTranslations("EventsFilter");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentFilter = searchParams.get("status") || "upcoming";

  const handleFilterChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("status", status);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={currentFilter === "upcoming" ? "default" : "outline"}
        onClick={() => handleFilterChange("upcoming")}
        className="cursor-pointer"
      >
        <Calendar className="h-4 w-4" />
        {t("upcoming")}
      </Button>

      <Button
        variant={currentFilter === "expired" ? "default" : "outline"}
        onClick={() => handleFilterChange("expired")}
        className="cursor-pointer"
      >
        <CalendarClock className="h-4 w-4" />
        {t("expired")}
      </Button>
    </div>
  );
};

export default EventsFilter;
