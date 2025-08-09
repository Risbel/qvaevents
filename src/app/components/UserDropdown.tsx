"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Loader2, Building } from "lucide-react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { signOut } from "@/actions/auth/signOut";
import Link from "next/link";
import { startTransition, useTransition } from "react";

export default function UserDropdown({ user }: { user: SupabaseUser }) {
  const t = useTranslations("Auth");
  const tProfile = useTranslations("Profile");
  const params = useParams();
  const locale = params.locale as string;

  const [isPending, startTransition] = useTransition();

  const signOutAction = async () => {
    startTransition(async () => {
      await signOut();
    });
  };

  const getUserName = () => {
    return user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
  };

  const getUserAvatar = () => {
    return user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-10 w-10 rounded-full cursor-pointer">
          <Avatar className="h-10 w-10">
            <AvatarImage src={getUserAvatar()} alt={getUserName()} />
            <AvatarFallback className="text-xs">{getInitials(getUserName())}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getUserName()}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/profile`} className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>{tProfile("title")}</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={signOutAction} className="w-full">
            <button className="flex w-full items-center text-left cursor-pointer" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
              <span>{t("signout.signOut")}</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
