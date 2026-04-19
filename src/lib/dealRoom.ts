import { supabase } from "@/integrations/supabase/client";

export const DEAL_STATUSES = [
  "draft",
  "sent",
  "in_negotiation",
  "awaiting_signature",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type DealStatus = (typeof DEAL_STATUSES)[number];

export const DEAL_STATUS_LABELS: Record<DealStatus, string> = {
  draft: "Draft",
  sent: "Sent",
  in_negotiation: "In Negotiation",
  awaiting_signature: "Awaiting Signature",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const DEAL_STATUS_COLORS: Record<DealStatus, string> = {
  draft: "bg-[#5A6478]/10 text-[#8892A4] border-[#5A6478]/20",
  sent: "bg-[#3EC8FF]/10 text-[#3EC8FF] border-[#3EC8FF]/20",
  in_negotiation: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  awaiting_signature: "bg-purple-500/10 text-purple-300 border-purple-500/20",
  confirmed: "bg-[#3EFFBE]/10 text-[#3EFFBE] border-[#3EFFBE]/20",
  completed: "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] border-[hsl(var(--primary))]/20",
  cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export type DealRoomBooking = {
  id: string;
  offer_id: string;
  artist_id: string;
  promoter_id: string;
  venue_name: string;
  event_date: string;
  event_time: string | null;
  guarantee: number;
  contract_url: string | null;
  status: string;
  payment_status?: string | null;
  deposit_paid_at?: string | null;
  final_paid_at?: string | null;
};

export type DealRoomOffer = {
  id: string;
  status: string;
  guarantee: number;
  door_split: number | null;
  merch_split: number | null;
  event_date: string;
  event_time: string | null;
  venue_name: string;
  hospitality: string | null;
  backline: string | null;
  notes: string | null;
  sender_id: string;
  recipient_id: string;
};

export type DealRoomParticipant = {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string | null;
  participant_role: "artist" | "promoter";
};

export type DealRoomMessage = {
  id: string;
  deal_room_id: string;
  sender_id: string;
  content: string;
  message_type: "text" | "file" | "system" | "offer_update";
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type ContractSignature = {
  id: string;
  booking_id: string;
  user_id: string;
  signed_at: string;
  signature_type: string;
};

/**
 * Derive the canonical Deal Room status from the underlying booking, offer,
 * and contract state. Keeping this pure-functional (no IO) makes it trivial
 * to test and keeps the derived status in sync with reality instead of
 * drifting from a separately-persisted field.
 */
export function computeDealStatus(input: {
  booking: Pick<DealRoomBooking, "status" | "contract_url"> | null;
  offer: Pick<DealRoomOffer, "status"> | null;
  signatures: Pick<ContractSignature, "user_id">[];
  participantIds: string[];
}): DealStatus {
  const { booking, offer, signatures, participantIds } = input;

  if (booking?.status === "completed") return "completed";
  if (booking?.status === "cancelled") return "cancelled";

  if (offer?.status === "declined") return "cancelled";
  if (offer?.status === "expired") return "cancelled";

  const uniqueSigners = new Set(signatures.map((s) => s.user_id));
  const allParticipantsSigned =
    participantIds.length > 0 &&
    participantIds.every((id) => uniqueSigners.has(id));

  if (allParticipantsSigned) return "confirmed";

  if (booking) {
    // Booking exists: at least one side has accepted. If a contract URL is
    // attached or at least one signature was captured, we're at the
    // signature stage; otherwise confirmed means "deal terms locked".
    if (booking.contract_url || uniqueSigners.size > 0) {
      return "awaiting_signature";
    }
    return "confirmed";
  }

  if (offer?.status === "accepted") return "awaiting_signature";
  if (offer?.status === "negotiating") return "in_negotiation";
  if (offer?.status === "pending") return "sent";

  return "draft";
}

/**
 * Fetch or lazily create the deal_rooms row for a booking. Safe to call on
 * every mount; the unique constraint on booking_id guarantees at most one
 * room per booking.
 */
export async function ensureDealRoom(bookingId: string): Promise<string | null> {
  const { data: existing, error: selectErr } = await supabase
    .from("deal_rooms")
    .select("id")
    .eq("booking_id", bookingId)
    .maybeSingle();
  if (selectErr) {
    console.error("deal_rooms select failed", selectErr);
    return null;
  }
  if (existing?.id) return existing.id;

  const { data: inserted, error: insertErr } = await supabase
    .from("deal_rooms")
    .insert({ booking_id: bookingId })
    .select("id")
    .single();
  if (insertErr) {
    // Race: another client created it between our select and insert.
    const { data: retry } = await supabase
      .from("deal_rooms")
      .select("id")
      .eq("booking_id", bookingId)
      .maybeSingle();
    return retry?.id ?? null;
  }
  return inserted.id;
}

/**
 * Demo booking for /deals/demo — renders the full experience without
 * touching Supabase so the feature can be exercised pre-launch by prospects
 * and internal QA.
 */
export function getDemoDealRoom(): {
  booking: DealRoomBooking;
  offer: DealRoomOffer;
  participants: DealRoomParticipant[];
  signatures: ContractSignature[];
  messages: DealRoomMessage[];
  dealRoomId: string;
} {
  const artistId = "demo-artist";
  const promoterId = "demo-promoter";
  const bookingId = "demo-booking";
  const dealRoomId = "demo-deal-room";
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return {
    dealRoomId,
    booking: {
      id: bookingId,
      offer_id: "demo-offer",
      artist_id: artistId,
      promoter_id: promoterId,
      venue_name: "The Rooftop — Los Angeles",
      event_date: new Date(now + 21 * day).toISOString().slice(0, 10),
      event_time: "21:00",
      guarantee: 4500,
      contract_url: null,
      status: "confirmed",
      payment_status: "deposit_paid",
      deposit_paid_at: new Date(now - 2 * day).toISOString(),
      final_paid_at: null,
    },
    offer: {
      id: "demo-offer",
      status: "accepted",
      guarantee: 4500,
      door_split: 70,
      merch_split: 100,
      event_date: new Date(now + 21 * day).toISOString().slice(0, 10),
      event_time: "21:00",
      venue_name: "The Rooftop — Los Angeles",
      hospitality: "3x hotel rooms, dinner for 4, greenroom with waters + snacks",
      backline: "Full DJ setup, CDJ-3000 x2, DJM-900, 2 wedges, 1 sub",
      notes: "Doors at 20:00. Sound check 17:30. Performance 22:30–00:30.",
      sender_id: promoterId,
      recipient_id: artistId,
    },
    participants: [
      {
        user_id: artistId,
        display_name: "Nova Reyes",
        avatar_url: null,
        role: "artist",
        participant_role: "artist",
      },
      {
        user_id: promoterId,
        display_name: "Skyline Presents",
        avatar_url: null,
        role: "promoter",
        participant_role: "promoter",
      },
    ],
    signatures: [
      {
        id: "demo-sig-1",
        booking_id: bookingId,
        user_id: promoterId,
        signed_at: new Date(now - 3 * day).toISOString(),
        signature_type: "typed",
      },
    ],
    messages: [
      {
        id: "m1",
        deal_room_id: dealRoomId,
        sender_id: promoterId,
        content: "Offer sent — $4,500 guarantee + 70/30 door after $2k.",
        message_type: "offer_update",
        metadata: {},
        created_at: new Date(now - 5 * day).toISOString(),
      },
      {
        id: "m2",
        deal_room_id: dealRoomId,
        sender_id: artistId,
        content:
          "Looks solid. Can we add 3 hotel rooms and extend sound check to 60 minutes?",
        message_type: "text",
        metadata: {},
        created_at: new Date(now - 4 * day).toISOString(),
      },
      {
        id: "m3",
        deal_room_id: dealRoomId,
        sender_id: promoterId,
        content: "Done. Updated rider attached. Let's lock it in.",
        message_type: "text",
        metadata: {},
        created_at: new Date(now - 3.5 * day).toISOString(),
      },
      {
        id: "m4",
        deal_room_id: dealRoomId,
        sender_id: promoterId,
        content: "Promoter signed the agreement.",
        message_type: "system",
        metadata: { event: "contract.signed" },
        created_at: new Date(now - 3 * day).toISOString(),
      },
      {
        id: "m5",
        deal_room_id: dealRoomId,
        sender_id: promoterId,
        content: "Deposit of $1,125 paid via Stripe.",
        message_type: "system",
        metadata: { event: "payment.deposit" },
        created_at: new Date(now - 2 * day).toISOString(),
      },
    ],
  };
}

export const DEMO_BOOKING_ID = "demo";
