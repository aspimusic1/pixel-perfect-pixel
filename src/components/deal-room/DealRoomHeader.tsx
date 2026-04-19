import { Calendar, Clock, MapPin } from "lucide-react";
import { format, parseISO } from "date-fns";
import DealStatusBadge from "./DealStatusBadge";
import DealRoomParticipants from "./DealRoomParticipants";
import type {
  DealRoomBooking,
  DealRoomParticipant,
  DealStatus,
} from "@/lib/dealRoom";

export default function DealRoomHeader({
  booking,
  participants,
  status,
}: {
  booking: DealRoomBooking;
  participants: DealRoomParticipant[];
  status: DealStatus;
}) {
  return (
    <div className="glass-card p-5 sm:p-6 space-y-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1.5 min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Deal Room
          </p>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight break-words">
            {booking.venue_name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {format(parseISO(booking.event_date), "EEE, MMM d, yyyy")}
            </span>
            {booking.event_time ? (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {booking.event_time.slice(0, 5)}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {booking.venue_name}
            </span>
          </div>
        </div>
        <DealStatusBadge status={status} />
      </div>

      <div className="pt-2 border-t border-white/[0.06]">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
          Participants
        </p>
        <DealRoomParticipants participants={participants} />
      </div>
    </div>
  );
}
