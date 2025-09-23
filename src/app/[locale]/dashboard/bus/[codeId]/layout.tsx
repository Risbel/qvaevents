"use client";

import { BusSidebar } from "../components/BusSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DynamicBreadcrumb } from "./components/DynamicBreadcrumb";

import ModeToggle from "@/app/components/ModeToggle";
import UserDropdown from "@/app/components/UserDropdown";
import LocaleSwitcher from "@/app/components/LocaleSwitcher";
import { useParams } from "next/navigation";
import useGetBusinessByCodeId from "@/hooks/business/useGetBusinessByCodeId";
import useGetUser from "@/hooks/user/useGetUser";
import { BusinessWithOrganizer } from "@/queries/client/business/getBusinessByCodeId";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Building2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const { locale, codeId } = params;
  const t = useTranslations("Business");

  const { data: user, isLoading: userLoading } = useGetUser();

  const { data: business, isLoading: businessLoading } = useGetBusinessByCodeId(codeId as string);

  if (userLoading || businessLoading) {
    return <div>Loading...</div>;
  }

  if (!user || !business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="max-w-md">
          <Building2 className="h-4 w-4" />
          <AlertTitle>{t("businessNotFound")}</AlertTitle>
          <AlertDescription>{t("businessNotFoundDescription")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <BusSidebar locale={locale as string} codeId={codeId as string} business={business as BusinessWithOrganizer} />
      <SidebarInset className="flex flex-col h-screen">
        <header className="flex h-16 w-full items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-sm border-b-border flex-shrink-0">
          <SidebarTrigger className="-ml-1 cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList className="flex flex-nowrap">
              <BreadcrumbItem className="hidden md:block text-nowrap">
                <BreadcrumbLink>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <DynamicBreadcrumb locale={locale as string} codeId={codeId as string} />
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center justify-end gap-2 w-full">
            <LocaleSwitcher />
            <ModeToggle />
            {user && <UserDropdown user={user as SupabaseUser} />}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center gap-4 p-4 w-full bg-background min-h-full pb-16">
            {children as React.ReactNode}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
