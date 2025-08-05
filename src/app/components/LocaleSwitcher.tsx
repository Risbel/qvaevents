"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (locale: string) => {
    const pathWithoutLocale = pathname.split("/").slice(2).join("/");
    const newPath = `/${locale}/${pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="cursor-pointer" variant="outline" size="icon" aria-label="Change language">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => switchLocale("en")}>
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => switchLocale("es")}>
          🇪🇸 Español
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleSwitcher;
