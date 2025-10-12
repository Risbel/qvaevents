"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const VisitsSearchFilter = () => {
  const t = useTranslations("VisitsPage.Filter");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize form with URL params
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchField, setSearchField] = useState(searchParams.get("searchField") || "name");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    const trimmedSearch = search.trim();
    setSearch(trimmedSearch);

    if (trimmedSearch) {
      params.set("search", trimmedSearch);
      params.set("searchField", searchField);
    } else {
      params.delete("search");
      params.delete("searchField");
    }

    // Reset to page 1 when searching
    params.set("page", "1");

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
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
  );
};

export default VisitsSearchFilter;
