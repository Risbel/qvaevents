"use client";

import { useTranslations } from "next-intl";
import VisitsList from "./components/VisitsList";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const VisitsPage = () => {
  const t = useTranslations("VisitsPage.Filter");
  const tVisits = useTranslations("VisitsPage");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize form with URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchField, setSearchField] = useState(searchParams.get("searchField") || "name");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (search) {
      params.set("search", search);
      params.set("searchField", searchField);
    } else {
      params.delete("search");
      params.delete("searchField");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="max-w-2xl w-full space-y-4">
      <h1 className="text-2xl font-bold mb-2">{tVisits("visits")}</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 border p-1 rounded-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            placeholder={`${t("searchPlaceholder")} ${searchField}`}
          />
        </div>
        <div className="relative">
          <Select value={searchField} onValueChange={setSearchField}>
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder={t("searchBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">{t("name")}</SelectItem>
              <SelectItem value="email">{t("email")}</SelectItem>
              <SelectItem value="phone">{t("phone")}</SelectItem>
              <SelectItem value="username">{t("username")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" variant="default" className="cursor-pointer">
          <Search className="h-4 w-4" />
          {t("search")}
        </Button>
      </form>

      <VisitsList />
    </div>
  );
};

export default VisitsPage;
