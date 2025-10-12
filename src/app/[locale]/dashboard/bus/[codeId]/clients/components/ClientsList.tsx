"use client";

import { useSearchParams, useRouter, usePathname, useParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Users2Icon, ChevronLeft, ChevronRight } from "lucide-react";
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
import { ArrowUpDown, ChevronDown } from "lucide-react";
import BadgeSelect from "./BadgeSelect";
import { Tables } from "@/types/supabase";
import ClientsListSkeleton from "./ClientsListSkeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetClientsByBusinessCodeId from "@/hooks/clients/useGetClientsByBusinessCodeId";

type ClientOnBusinessWithProfile = Tables<"clientOnBusiness"> & {
  ClientProfile: Tables<"ClientProfile">;
};

const ClientsList = () => {
  const t = useTranslations("ClientsPage");
  const router = useRouter();
  const pathname = usePathname();
  const { codeId: codeIdParam } = useParams();
  const codeId = codeIdParam as string;
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;
  const searchField = searchParams.get("searchField") || undefined;
  const currentPage = parseInt(searchParams.get("page") || "1");
  const pageSize = 30;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const { data, isLoading, isError } = useGetClientsByBusinessCodeId(
    codeId,
    currentPage,
    pageSize,
    search,
    searchField
  );

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const getUserAvatar = (client: ClientOnBusinessWithProfile) => {
    if (client.ClientProfile?.avatar) return client.ClientProfile.avatar;
    const name = encodeURIComponent(client.ClientProfile?.name || client.ClientProfile?.username || "User");
    const twoFirstLetters = (client.ClientProfile?.name || client.ClientProfile?.username || "U")
      .slice(0, 2)
      .toUpperCase();
    return `https://avatar.vercel.sh/${name}.svg?rounded=60&size=30&text=${twoFirstLetters}`;
  };

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  const columns = useMemo<ColumnDef<ClientOnBusinessWithProfile>[]>(
    () => [
      {
        id: "name",
        accessorKey: "ClientProfile",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="hover:bg-transparent p-0"
            >
              {t("name")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const client = row.original;
          return (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getUserAvatar(client)} />
                <AvatarFallback>{getInitials(client.ClientProfile?.username || "")}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{client.ClientProfile?.name || client.ClientProfile?.username}</span>
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
        header: t("email"),
        cell: ({ row }) => {
          return <span className="text-sm">{row.original.ClientProfile?.email || "No email"}</span>;
        },
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: t("phone"),
        cell: ({ row }) => {
          return <span className="text-sm">{row.original.ClientProfile?.phone || "No phone"}</span>;
        },
      },
      {
        id: "badge",
        accessorKey: "badge",
        header: t("badge"),
        cell: ({ row }) => {
          return <BadgeSelect clientId={row.original.id} initialBadge={row.original.badge} />;
        },
      },
      {
        id: "registeredOn",
        accessorKey: "createdAt",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className="hover:bg-transparent p-0"
            >
              {t("registeredOn")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          return <span className="text-sm">{format(new Date(row.original.createdAt), "PPp")}</span>;
        },
      },
    ],
    [t]
  );

  const clients = useMemo(() => {
    return data?.clients || [];
  }, [data]);

  const table = useReactTable({
    data: clients,
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
    return <ClientsListSkeleton />;
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="w-full">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t("failedToLoadClients")}</AlertTitle>
        <AlertDescription>{t("failedToLoadClientsDescription")}</AlertDescription>
      </Alert>
    );
  }

  const totalClients = data?.total || 0;
  const totalPages = data?.totalPages || 0;

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between gap-2">
        <Badge variant="outline" className="text-sm">
          {t("totalClients")}: {totalClients}
        </Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              {t("columns")} <ChevronDown className="ml-2 h-4 w-4" />
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

      {data?.clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-2 border rounded-lg">
          <Users2Icon className="size-12 text-muted-foreground" />
          <h3 className="font-semibold text-lg">{t("noClients")}</h3>
          <p className="text-sm text-muted-foreground text-center">{t("noClientsDescription")}</p>
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
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {t("noClients")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {t("page")} {currentPage} {t("of")} {totalPages} ({t("showing")} {clients.length} {t("of")} {totalClients}{" "}
              {t("clients").toLowerCase()})
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

export default ClientsList;
