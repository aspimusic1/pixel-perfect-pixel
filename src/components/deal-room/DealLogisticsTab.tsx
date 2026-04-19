import { Hotel, Plane, Truck, Users, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import type { DealRoomBooking, DealRoomOffer } from "@/lib/dealRoom";

type Props = {
  booking: DealRoomBooking;
  offer: DealRoomOffer | null;
};

export default function DealLogisticsTab({ booking, offer }: Props) {
  const eventDate = parseISO(booking.event_date);
  const showTime = booking.event_time ?? "—";

  const blocks = [
    { label: "Load-in", time: "15:00", icon: Truck },
    { label: "Sound check", time: "17:30", icon: Users },
    { label: "Doors", time: "20:00", icon: CalendarIcon },
    {
      label: "Performance",
      time: showTime.slice(0, 5) || "21:00",
      icon: Users,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/[0.06] bg-background/50 p-5">
        <h3 className="font-display font-semibold">Day-of Schedule</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {format(eventDate, "EEEE, MMM d, yyyy")} · {booking.venue_name}
        </p>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {blocks.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.label}
                className="rounded-lg bg-background/60 border border-white/[0.06] p-4"
              >
                <Icon className="h-4 w-4 text-muted-foreground mb-2" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {b.label}
                </p>
                <p className="font-display font-bold text-lg mt-0.5">{b.time}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.06] bg-background/30 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Hotel className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-display font-semibold text-sm">Hospitality</h4>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {offer?.hospitality ?? "Not specified yet — confirm with promoter."}
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-background/30 p-5">
          <div className="flex items-center gap-2 mb-2">
            <Plane className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-display font-semibold text-sm">Travel &amp; Backline</h4>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {offer?.backline ?? "Not specified yet — confirm with promoter."}
          </p>
        </div>
      </div>

      {offer?.notes ? (
        <div className="rounded-xl border border-white/[0.06] bg-background/30 p-5">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
            Additional Notes
          </p>
          <p className="text-sm whitespace-pre-wrap">{offer.notes}</p>
        </div>
      ) : null}
    </div>
  );
}
