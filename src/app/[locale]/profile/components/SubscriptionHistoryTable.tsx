"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { History } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

interface SubscriptionHistoryItem {
  id: number;
  event: string;
  endDate: string | null;
  createdAt: string;
  startDate: string | null;
  planPriceId: number | null;
  subscriptionId: number;
  PlanPrice?: {
    id: number;
    amount: number;
    Asset: {
      id: number;
      symbol: string;
      code: string;
      type: string;
    };
  } | null;
}

interface SubscriptionHistoryTableProps {
  history: SubscriptionHistoryItem[];
}

export default function SubscriptionHistoryTable({ history }: SubscriptionHistoryTableProps) {
  const tStatus = useTranslations("status");
  const t = useTranslations("Profile.SubscriptionHistory");
  const params = useParams();
  const locale = params.locale as string;

  if (!history || history.length === 0) {
    return null;
  }

  const getEventBadgeVariant = (event: string) => {
    switch (event.toLowerCase()) {
      case "create":
        return "default";
      case "renew":
        return "secondary";
      case "cancel":
        return "destructive";
      case "pause":
        return "outline";
      default:
        return "default";
    }
  };

  const formatEventName = (event: string) => {
    return tStatus(event as any);
  };

  return (
    <Card className="gap-4 shadow-md shadow-primary/40">
      <CardHeader>
        <div className="flex items-center gap-2">
          <History className="w-5 h-5" />
          <CardTitle className="text-xl">Subscription History</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("event")}</TableHead>
                <TableHead>{t("price")}</TableHead>
                <TableHead>{t("startDate")}</TableHead>
                <TableHead>{t("endDate")}</TableHead>
                <TableHead>{t("createdAt")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Badge className="rounded-full" variant={getEventBadgeVariant(item.event)}>
                      {formatEventName(item.event)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.PlanPrice ? (
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {item.PlanPrice.Asset.symbol}
                          {item.PlanPrice.amount}
                        </span>
                        <span className="text-xs text-muted-foreground">{item.PlanPrice.Asset.code}</span>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {item.startDate
                      ? new Date(item.startDate).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {item.endDate
                      ? new Date(item.endDate).toLocaleDateString(locale, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {new Date(item.createdAt).toLocaleDateString(locale, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
