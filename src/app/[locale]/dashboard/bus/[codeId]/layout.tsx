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
import { getBusinessByCodeId, BusinessWithOrganizer } from "@/queries/business/getBusinessByCodeId";
import ModeToggle from "@/app/components/ModeToggle";
import UserDropdown from "@/app/components/UserDropdown";
import { createClient } from "@/utils/supabase/server";
import LocaleSwitcher from "@/app/components/LocaleSwitcher";
import { redirect, notFound } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; codeId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { locale, codeId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/org/login`);
  }

  const businessResult = await getBusinessByCodeId(codeId);

  if (businessResult.status === "error") {
    notFound();
  }

  const business = businessResult.data?.business as BusinessWithOrganizer;

  return (
    <SidebarProvider>
      <BusSidebar locale={locale} codeId={codeId} business={business} />
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
              <DynamicBreadcrumb locale={locale} codeId={codeId} />
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex items-center justify-end gap-2 w-full">
            <LocaleSwitcher />
            <ModeToggle />
            {user && <UserDropdown user={user} />}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center gap-4 p-4 w-full bg-background min-h-full">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
