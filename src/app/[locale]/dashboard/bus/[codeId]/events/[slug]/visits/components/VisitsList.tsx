"use client";

import { useSearchParams, useRouter, usePathname, useParams } from "next/navigation";
import useGetVisitsByEventSlug from "@/hooks/visits/useGetVisitsByEventSlug";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Users2Icon, ChevronLeft, ChevronRight, ArrowUpDown, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Tables } from "@/types/supabase";
import VisitsListSkeleton from "./VisitsListSkeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import MessageAllButton from "./MessageAllButton";
import EmailAllButton from "./EmailAllButton";
import CompanionsPopover from "./CompanionsPopover";
import { cn } from "@/lib/utils";

// Import the VisitActions component dynamically to avoid circular dependencies
import dynamic from "next/dynamic";
const VisitActions = dynamic(() => import("./VisitActions"), { ssr: false });

type VisitWithProfile = Tables<"Visit"> & {
  ClientProfile: Tables<"ClientProfile">;
  ClientCompanion: Array<{
    id: number;
    clientId: number;
    ClientProfile: Tables<"ClientProfile">;
  }>;
  clientVisitAffiliated: {
    id: number;
    clientId: number;
    createdAt: string;
    ClientProfile: Tables<"ClientProfile">;
  } | null;
};

const VisitsList = () => {
  const t = useTranslations("VisitsPage");
  const tStatus = useTranslations("status");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { slug } = useParams() as { slug: string };
  const search = searchParams.get("search") || undefined;
  const searchField = searchParams.get("searchField") || undefined;
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = 30;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data, isLoading, isError } = useGetVisitsByEventSlug(slug, currentPage, pageSize, search, searchField);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const getUserAvatar = (visit: VisitWithProfile) => {
    if (visit.ClientProfile?.avatar) return visit.ClientProfile.avatar;
    const name = visit.ClientProfile?.name || visit.ClientProfile?.username || "User";
    const twoFirstLetters = name.slice(0, 2).toUpperCase();
    return `https://avatar.vercel.sh/${encodeURIComponent(name)}.svg?rounded=60&size=30&text=${twoFirstLetters}`;
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const getStatusBadge = (visit: VisitWithProfile) => {
    if (visit.isCanceled) {
      return <Badge variant="destructive">{tStatus("canceled")}</Badge>;
    }
    if (visit.isAttended) {
      return <Badge className="bg-green-500">{tStatus("attended")}</Badge>;
    }
    if (visit.isConfirmed) {
      return <Badge variant="outline">{tStatus("confirmed")}</Badge>;
    }
    return <Badge variant="secondary">{tStatus("pending")}</Badge>;
  };

  const columns = useMemo<ColumnDef<VisitWithProfile>[]>(
    () => [
      {
        id: "client",
        accessorKey: "ClientProfile",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="hover:bg-transparent p-0"
            >
              {t("Filter.name")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const visit = row.original;
          return (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getUserAvatar(visit)} />
                <AvatarFallback>{getInitials(visit.ClientProfile?.username || "")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{visit.ClientProfile?.name || visit.ClientProfile?.username}</p>
                {visit.clientVisitAffiliated && (
                  <p className="text-xs text-muted-foreground">
                    {t("Filter.affiliatedWith")}: {visit.clientVisitAffiliated.ClientProfile?.username}
                  </p>
                )}
              </div>
            </div>
          );
        },
        sortingFn: (rowA, rowB) => {
          const nameA = rowA.original.ClientProfile?.name || rowA.original.ClientProfile?.username || "";
          const nameB = rowB.original.ClientProfile?.name || rowB.original.ClientProfile?.username || "";
          return nameA.localeCompare(nameB);
        },
        enableHiding: false,
      },
      {
        id: "email",
        accessorKey: "email",
        header: t("Filter.email"),
        cell: ({ row }) => {
          return <span className="text-sm">{row.original.ClientProfile?.email || "No email"}</span>;
        },
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: t("Filter.phone"),
        cell: ({ row }) => {
          return <span className="text-sm">{row.original.ClientProfile?.phone || "No phone"}</span>;
        },
      },
      {
        id: "companions",
        accessorKey: "companionsCount",
        header: t("companions"),
        cell: ({ row }) => {
          const visit = row.original;
          const totalCompanions = visit.companionsCount || 0;
          const companions = visit.ClientCompanion || [];

          if (totalCompanions === 0) {
            return <span className="text-sm text-muted-foreground">-</span>;
          }

          return <CompanionsPopover companions={companions} totalCompanions={totalCompanions} />;
        },
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => getStatusBadge(row.original),
      },
      {
        id: "reservedOn",
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="hover:bg-transparent p-0"
            >
              {tStatus("reservedOn")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          return <span className="text-sm">{format(new Date(row.original.createdAt), "PPp")}</span>;
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <VisitActions visit={row.original} />,
        enableHiding: false,
      },
    ],
    [t, tStatus]
  );

  const visits = useMemo(() => {
    return data?.visits || [];
  }, [data]);

  const table = useReactTable({
    data: visits,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  });

  if (isLoading) {
    return <VisitsListSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="w-full">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t("failedToLoadVisits")}</AlertTitle>
        <AlertDescription>{t("failedToLoadVisitsDescription")}</AlertDescription>
      </Alert>
    );
  }

  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 0;
  const totalVisits = data?.totalVisits ?? 0;
  const totalCompanions = data?.totalCompanions ?? 0;
  const visitsLimit = data?.event?.visitsLimit ?? 0;

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between gap-1">
        <Badge variant="outline" className="text-sm">
          {t("visits")}: {totalVisits + totalCompanions} / {visitsLimit}
        </Badge>

        <div className="flex items-center gap-1">
          {totalVisits > 0 && data && (
            <>
              <MessageAllButton data={{ pages: [data] }} />
              <EmailAllButton data={{ pages: [data] }} />
            </>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {t("columns")} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {data?.visits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-2 border rounded-lg">
          <Users2Icon className="size-12 text-muted-foreground" />
          <h3 className="font-semibold text-lg">{t("noVisits")}</h3>
          <p className="text-sm text-muted-foreground text-center">{t("noVisitsDescription")}</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className={cn(row.original.isCanceled && "bg-red-500/10")}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {t("noVisits")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t("page")} {currentPage} {t("of")} {totalPages} ({t("showing")} {visits.length} {t("of")} {total}{" "}
              {t("visits").toLowerCase()})
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                {t("previous")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                {t("next")}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VisitsList;
