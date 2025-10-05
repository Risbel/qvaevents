"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Sidebar } from "lucide-react";

const LayoutSkeleton = () => {
  return (
    <SidebarProvider>
      {/* Fake Sidebar */}
      <aside className="fixed left-0 top-0 z-20 h-full w-64 -translate-x-full border-r bg-background transition-transform lg:translate-x-0">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-col gap-4 p-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-6 w-full" />
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <SidebarInset className="flex flex-col h-screen">
        {/* Navbar */}
        <header className="flex h-16 w-full items-center gap-2 border-b px-4 bg-background/50 backdrop-blur-sm border-b-border flex-shrink-0">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />

          <div className="flex items-center justify-end gap-2 w-full">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default LayoutSkeleton;
