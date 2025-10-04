import { format } from "date-fns";
import Image from "next/image";
import { EventDateTime } from "@/app/components/EventDateTime";
import { VisitWithEvent } from "@/queries/client/visits/getMyVisits";
import TicketStatusBadge from "@/app/components/TicketStatusBadge";
import { useTranslations } from "next-intl";

interface TicketCardProps {
  visit: VisitWithEvent;
  locale: string;
}

const TicketCard = ({ visit, locale }: TicketCardProps) => {
  const t = useTranslations("TicketsPage");

  return (
    <div className="bg-card hover:bg-accent/50 rounded-lg shadow-md shadow-primary/50 border transition-colors">
      <div className="flex flex-row">
        {visit.Event.EventImage && visit.Event.EventImage.length > 0 && (
          <div className="relative w-32 md:w-48 aspect-square flex-shrink-0">
            <Image
              src={visit.Event.EventImage[0].url}
              alt={visit.Event.EventText[0]?.title || "Event image"}
              fill
              sizes="(max-width: 768px) 96px, 192px"
              priority={false}
              loading="lazy"
              className="object-cover rounded-l-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://placehold.co/600x400?text=No+Image";
              }}
            />
          </div>
        )}
        <div className="flex-1 p-3 md:p-4">
          <div className="flex justify-between items-start gap-2 mb-2">
            <div>
              <h3 className="text-sm md:text-md font-semibold line-clamp-1">
                {visit.Event.EventText[0]?.title || "Event Title"}
              </h3>
              <p className="text-muted-foreground text-xs md:text-sm">{visit.Event.Business.name}</p>
            </div>
            <TicketStatusBadge
              isAttended={visit.isAttended}
              isConfirmed={visit.isConfirmed}
              isCanceled={visit.isCanceled}
            />
          </div>

          <div className="space-y-1">
            <EventDateTime
              startDate={visit.Event.startDate}
              endDate={visit.Event.endDate}
              timeZoneName={visit.Event.timeZoneName}
              locale={locale}
              showTimeZone={false}
              className="text-sm md:text-md font-bold text-violet-400"
            />
          </div>

          <div className="flex flex-row justify-between pt-2 mt-2 border-t gap-2">
            <p className="text-muted-foreground text-[10px] md:text-xs">
              {t("reservedOn")} {format(new Date(visit.createdAt), "MMM d, yyyy")}
            </p>
            {visit.canceledAt && (
              <p className="text-destructive text-[10px] md:text-xs">
                {t("canceledOn")} {format(new Date(visit.canceledAt), "MMM d, yyyy")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
