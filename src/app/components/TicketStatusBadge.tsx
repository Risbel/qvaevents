import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

interface TicketStatusBadgeProps {
  isAttended: boolean;
  isConfirmed: boolean;
  isCanceled: boolean;
}

const TicketStatusBadge = ({ isAttended, isConfirmed, isCanceled }: TicketStatusBadgeProps) => {
  const t = useTranslations("TicketsPage");

  if (isCanceled) return <Badge variant="destructive">{t("canceled")}</Badge>;
  if (isAttended) return <Badge variant="default">{t("attended")}</Badge>;
  if (isConfirmed) return <Badge variant="secondary">{t("confirmed")}</Badge>;
  return <Badge variant="outline">{t("pending")}</Badge>;
};

export default TicketStatusBadge;
