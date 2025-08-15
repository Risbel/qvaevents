"use client";

import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Calendar, Users, BarChart3, Building2, Globe, Plus, QrCode } from "lucide-react";
import Link from "next/link";
import { BusinessWithOrganizer } from "@/queries/business/getBusinessByCodeId";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

// Navigation data structure
const navigationData = {
  navMain: [
    {
      title: "dashboard",
      url: "#",
      items: [
        {
          title: "overview",
          url: `/dashboard/bus/{codeId}`,
          icon: BarChart3,
        },
        {
          title: "landingSettings",
          url: `/dashboard/bus/{codeId}/landing`,
          icon: Globe,
        },
      ],
    },
    {
      title: "events",
      url: "#",
      items: [
        {
          title: "createEvent",
          url: `/dashboard/bus/{codeId}/new`,
          icon: Plus,
        },
        {
          title: "myEvents",
          url: `/dashboard/bus/{codeId}/events`,
          icon: Calendar,
        },
      ],
    },
    {
      title: "management",
      url: "#",
      items: [
        {
          title: "clients",
          url: `/dashboard/bus/{codeId}/clients`,
          icon: Users,
        },
        {
          title: "qrCodes",
          url: `/dashboard/bus/{codeId}/qr-codes`,
          icon: QrCode,
        },
      ],
    },
  ],
};

interface BusSidebarProps extends React.ComponentProps<typeof Sidebar> {
  locale: string;
  codeId: string;
  business?: BusinessWithOrganizer;
}

export function BusSidebar({ locale, codeId, business, ...props }: BusSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");

  // Helper function to check if a menu item is active
  const isActive = (itemUrl: string) => {
    const fullUrl = `/${locale}${itemUrl.replace("{codeId}", codeId)}`;
    return pathname === fullUrl;
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2">
          <Building2 className="h-5 w-5 text-primary" />
          <Link
            href={`/${locale}/dashboard/org/${business?.OrganizerProfile?.codeId}`}
            className="text-xl font-bold text-primary"
          >
            {business?.name || business?.OrganizerProfile?.companyName || "QvaEvents"}
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Create a SidebarGroup for each parent */}
        {navigationData.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{t(item.title as any)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => {
                  const active = isActive(subItem.url);
                  const href = `/${locale}${subItem.url.replace("{codeId}", codeId)}`;

                  return (
                    <SidebarMenuItem key={subItem.title}>
                      {active ? (
                        // If active, render as a button (no navigation)
                        <div className="flex items-center gap-2 px-2 py-1.5 bg-gradient-to-r from-primary via-primary/80 to-primary/60  transition-colors duration-200 text-primary-foreground rounded-md">
                          <subItem.icon className="h-4 w-4" />
                          <span>{t(subItem.title as any)}</span>
                        </div>
                      ) : (
                        // If not active, render as a link
                        <SidebarMenuButton asChild isActive={active}>
                          <Link href={href} className="group/text">
                            <subItem.icon className="h-4 w-4" />
                            <span className="group-hover/text:translate-x-1 transition-transform duration-200">
                              {t(subItem.title as any)}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
