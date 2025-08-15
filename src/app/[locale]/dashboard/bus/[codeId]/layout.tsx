import { BusSidebar } from "../components/BusSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DynamicBreadcrumb } from "./components/DynamicBreadcrumb";
import { getBusinessByCodeId, BusinessWithOrganizer } from "@/queries/business/getBusinessByCodeId";
import ModeToggle from "@/app/components/ModeToggle";
import UserDropdown from "@/app/components/UserDropdown";
import { createClient } from "@/utils/supabase/server";
import LocaleSwitcher from "@/app/components/LocaleSwitcher";
import { redirect } from "next/navigation";

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

  // Fetch business data
  const businessResult = await getBusinessByCodeId(codeId);
  const business =
    businessResult.status === "success" ? (businessResult.data?.business as BusinessWithOrganizer) : undefined;

  return (
    <SidebarProvider>
      <BusSidebar locale={locale} codeId={codeId} business={business} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
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
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
