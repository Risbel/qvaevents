"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { LogIn, User as UserIcon, LogOut, Ticket } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams, useRouter } from "next/navigation";
import AuthModal from "./AuthModal";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useGetMyClientProfile from "@/hooks/me/useGetMyClientProfile";

const ClientsUserDropdown = () => {
  const t = useTranslations("Auth");
  const tProfile = useTranslations("Profile");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const queryClient = useQueryClient();

  const { data: user, isLoading, isFetching } = useGetMyClientProfile();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success(t("signout.signOutSuccess"));
    queryClient.invalidateQueries({ queryKey: ["myClientProfile"] });
    queryClient.invalidateQueries({ queryKey: ["user"] });
    window.location.reload();
  };

  // Show skeleton loader while loading or fetching
  if (isLoading || (isFetching && !user)) {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="animate-pulse bg-muted">U</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  if (user) {
    const getUserName = () => {
      return user.name || user.email?.split("@")[0] || "User";
    };

    const twoFirstLetters = getUserName().slice(0, 2).toUpperCase();

    const getUserAvatar = () => {
      if (user.avatar) return user.avatar;
      // Generate colored avatar URL using Vercel Avatar
      const name = encodeURIComponent(getUserName());
      return `https://avatar.vercel.sh/${name}.svg?rounded=60&size=30&text=${twoFirstLetters}`;
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={getUserAvatar()} alt={getUserName()} />
              <AvatarFallback className="text-xs">{twoFirstLetters}</AvatarFallback>
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

          <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/${locale}/me`)}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>{tProfile("title")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => router.push(`/${locale}/tickets`)}>
            <Ticket className="mr-2 h-4 w-4" />
            <span>Tickets</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("signout.signOut")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Only show login button if we're not loading and there's no user
  if (!isLoading && !isFetching && !user) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsLoginModalOpen(true)}
          className="flex items-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          {t("login.signIn")}
        </Button>

        <AuthModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </>
    );
  }

  // Return null as a fallback (shouldn't reach here due to previous conditions)
  return null;
};

export default ClientsUserDropdown;
