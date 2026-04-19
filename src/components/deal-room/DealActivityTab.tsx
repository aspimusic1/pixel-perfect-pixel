import {
  FileSignature,
  CreditCard,
  Handshake,
  MessageSquare,
  Play,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import type {
  ContractSignature,
  DealRoomBooking,
  DealRoomMessage,
  DealRoomOffer,
  DealRoomParticipant,
} from "@/lib/dealRoom";

type ActivityItem = {
  id: string;
  timestamp: string;
  title: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
};

function buildActivity(input: {
  booking: DealRoomBooking;
  offer: DealRoomOffer | null;
  signatures: ContractSignature[];
  messages: DealRoomMessage[];
  participants: DealRoomParticipant[];
}): ActivityItem[] {
  const { booking, offer, signatures, messages, participants } = input;
  const items: ActivityItem[] = [];
  const nameFor = (userId: string) =>
    participants.find((p) => p.user_id === userId)?.display_name ?? "Someone";

  if (offer) {
    items.push({
      id: `offer-${offer.id}`,
      timestamp: booking.id ? booking.event_date : offer.event_date,
      title: "Offer sent",
      detail: `${nameFor(offer.sender_id)} proposed $${Number(
        offer.guarantee,
      ).toLocaleString()} for ${offer.venue_name}`,
      icon: Handshake,
      tone: "text-[#3EC8FF]",
    });
  }

  for (const sig of signatures) {
    items.push({
      id: `sig-${sig.id}`,
      timestamp: sig.signed_at,
      title: "Contract signed",
      detail: `${nameFor(sig.user_id)} signed the performance agreement`,
      icon: FileSignature,
      tone: "text-[hsl(var(--primary))]",
    });
  }

  if (booking.deposit_paid_at) {
    items.push({
      id: "payment-deposit",
      timestamp: booking.deposit_paid_at,
      title: "Deposit paid",
      detail: `Deposit of $${Math.round(
        Number(booking.guarantee) * 0.25,
      ).toLocaleString()} received via Stripe`,
      icon: CreditCard,
      tone: "text-[#3EFFBE]",
    });
  }
  if (booking.final_paid_at) {
    items.push({
      id: "payment-final",
      timestamp: booking.final_paid_at,
      title: "Balance paid",
      detail: "Final payment received. Show is fully settled.",
      icon: CreditCard,
      tone: "text-[#3EFFBE]",
    });
  }

  for (const msg of messages) {
    if (msg.message_type === "system" || msg.message_type === "offer_update") {
      items.push({
        id: `msg-${msg.id}`,
        timestamp: msg.created_at,
        title: msg.message_type === "offer_update" ? "Offer updated" : "Event",
        detail: msg.content,
        icon: MessageSquare,
        tone: "text-muted-foreground",
      });
    }
  }

  if (booking.status === "completed") {
    items.push({
      id: "show-completed",
      timestamp: booking.event_date,
      title: "Show completed",
      detail: "Both parties can now leave reviews and verified credits.",
      icon: Play,
      tone: "text-[hsl(var(--primary))]",
    });
  }

  items.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  return items;
}

export default function DealActivityTab(props: {
  booking: DealRoomBooking;
  offer: DealRoomOffer | null;
  signatures: ContractSignature[];
  messages: DealRoomMessage[];
  participants: DealRoomParticipant[];
}) {
  const items = buildActivity(props);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-background/30 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No activity yet. Once the deal moves forward, every action will be
          logged here for a full audit trail.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-background/30 p-5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-4">
        Activity Log
      </p>
      <ol className="relative border-l border-white/[0.06] ml-2 space-y-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id} className="pl-6 relative">
              <span
                className={`absolute -left-[11px] top-0 h-5 w-5 rounded-full border border-white/[0.08] bg-background flex items-center justify-center ${item.tone}`}
              >
                <Icon className="h-3 w-3" />
              </span>
              <p className="font-display font-semibold text-sm">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                {format(parseISO(item.timestamp), "MMM d, yyyy · h:mm a")}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
