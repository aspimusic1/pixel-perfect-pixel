import { DollarSign, Users, Percent, Music2, ScrollText } from "lucide-react";
import { format, parseISO } from "date-fns";
import NegotiationThread from "@/components/NegotiationThread";
import type { DealRoomBooking, DealRoomOffer } from "@/lib/dealRoom";

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-background/50 p-4">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="font-display font-bold text-lg">{value}</p>
    </div>
  );
}

export default function DealTermsTab({
  booking,
  offer,
  onOfferUpdated,
}: {
  booking: DealRoomBooking;
  offer: DealRoomOffer | null;
  onOfferUpdated?: (newStatus: string) => void;
}) {
  const source = offer ?? {
    guarantee: booking.guarantee,
    door_split: null as number | null,
    merch_split: null as number | null,
    event_date: booking.event_date,
    event_time: booking.event_time,
    hospitality: null as string | null,
    backline: null as string | null,
    notes: null as string | null,
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat
          label="Guarantee"
          value={`$${Number(source.guarantee).toLocaleString()}`}
          icon={DollarSign}
        />
        <Stat
          label="Door Split"
          value={source.door_split != null ? `${source.door_split}%` : "—"}
          icon={Percent}
        />
        <Stat
          label="Merch Split"
          value={source.merch_split != null ? `${source.merch_split}%` : "—"}
          icon={Users}
        />
        <Stat
          label="Show Date"
          value={format(parseISO(source.event_date), "MMM d")}
          icon={Music2}
        />
      </div>

      {(source.hospitality || source.backline || source.notes) && (
        <div className="rounded-xl border border-white/[0.06] bg-background/30 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ScrollText className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-display font-semibold text-sm">Rider &amp; Notes</h3>
          </div>
          {source.hospitality ? (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Hospitality
              </p>
              <p className="text-sm whitespace-pre-wrap">{source.hospitality}</p>
            </div>
          ) : null}
          {source.backline ? (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Backline / Tech
              </p>
              <p className="text-sm whitespace-pre-wrap">{source.backline}</p>
            </div>
          ) : null}
          {source.notes ? (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                Notes
              </p>
              <p className="text-sm whitespace-pre-wrap">{source.notes}</p>
            </div>
          ) : null}
        </div>
      )}

      {offer && offer.status === "negotiating" ? (
        <div className="rounded-xl border border-white/[0.06] bg-background/30 p-5">
          <NegotiationThread
            offerId={offer.id}
            offer={{
              guarantee: offer.guarantee,
              door_split: offer.door_split,
              merch_split: offer.merch_split,
              event_date: offer.event_date,
              event_time: offer.event_time,
              venue_name: offer.venue_name,
              sender_id: offer.sender_id,
              recipient_id: offer.recipient_id,
            }}
            onOfferUpdated={(newStatus) => onOfferUpdated?.(newStatus)}
          />
        </div>
      ) : null}
    </div>
  );
}
