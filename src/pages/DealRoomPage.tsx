import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import DealRoomHeader from "@/components/deal-room/DealRoomHeader";
import DealTermsTab from "@/components/deal-room/DealTermsTab";
import DealMessagesTab from "@/components/deal-room/DealMessagesTab";
import DealContractTab from "@/components/deal-room/DealContractTab";
import DealPaymentTab from "@/components/deal-room/DealPaymentTab";
import DealLogisticsTab from "@/components/deal-room/DealLogisticsTab";
import DealActivityTab from "@/components/deal-room/DealActivityTab";
import {
  computeDealStatus,
  ensureDealRoom,
  getDemoDealRoom,
  type ContractSignature,
  type DealRoomBooking,
  type DealRoomMessage,
  type DealRoomOffer,
  type DealRoomParticipant,
} from "@/lib/dealRoom";

type DealRoomData = {
  dealRoomId: string;
  booking: DealRoomBooking;
  offer: DealRoomOffer | null;
  participants: DealRoomParticipant[];
  signatures: ContractSignature[];
  demoMessages?: DealRoomMessage[];
};

export default function DealRoomPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { user } = useAuth();
  const isDemo = bookingId === "demo";

  const [data, setData] = useState<DealRoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const refresh = useCallback(() => setRefreshTick((n) => n + 1), []);

  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      if (isDemo) {
        const demo = getDemoDealRoom();
        if (cancelled) return;
        setData({
          dealRoomId: demo.dealRoomId,
          booking: demo.booking,
          offer: demo.offer,
          participants: demo.participants,
          signatures: demo.signatures,
          demoMessages: demo.messages,
        });
        setLoading(false);
        return;
      }

      const { data: booking, error: bErr } = await supabase
        .from("bookings")
        .select(
          "id, offer_id, artist_id, promoter_id, venue_name, event_date, event_time, guarantee, contract_url, status",
        )
        .eq("id", bookingId!)
        .maybeSingle();

      if (cancelled) return;

      if (bErr || !booking) {
        setError("Deal Room not found or you don't have access.");
        setLoading(false);
        return;
      }

      // Fetch payment fields separately (not in generated types yet).
      const { data: paymentRow } = await supabase
        .from("bookings")
        .select("*" as never)
        .eq("id", bookingId!)
        .maybeSingle();
      const paymentExt = (paymentRow ?? {}) as Record<string, unknown>;

      const typedBooking: DealRoomBooking = {
        ...booking,
        payment_status: (paymentExt.payment_status as string | null) ?? null,
        deposit_paid_at: (paymentExt.deposit_paid_at as string | null) ?? null,
        final_paid_at:
          (paymentExt.final_paid_at as string | null) ??
          (paymentExt.final_payment_paid_at as string | null) ??
          null,
      };

      const [offerRes, sigsRes, profilesRes, dealRoomIdResult] =
        await Promise.all([
          supabase
            .from("offers")
            .select(
              "id, status, guarantee, door_split, merch_split, event_date, event_time, venue_name, hospitality, backline, notes, sender_id, recipient_id",
            )
            .eq("id", typedBooking.offer_id)
            .maybeSingle(),
          supabase
            .from("contract_signatures")
            .select("id, booking_id, user_id, signed_at, signature_type")
            .eq("booking_id", typedBooking.id),
          supabase
            .from("profiles")
            .select("user_id, display_name, avatar_url, role")
            .in("user_id", [typedBooking.artist_id, typedBooking.promoter_id]),
          ensureDealRoom(typedBooking.id),
        ]);

      if (cancelled) return;

      const offer = offerRes.data
        ? ({
            ...offerRes.data,
            hospitality:
              (offerRes.data as { hospitality?: string | null }).hospitality ??
              null,
            backline:
              (offerRes.data as { backline?: string | null }).backline ?? null,
            notes: (offerRes.data as { notes?: string | null }).notes ?? null,
          } as DealRoomOffer)
        : null;

      const profileMap = new Map(
        (profilesRes.data ?? []).map((p) => [
          p.user_id as string,
          p as {
            user_id: string;
            display_name: string | null;
            avatar_url: string | null;
            role: string | null;
          },
        ]),
      );

      const participants: DealRoomParticipant[] = [
        {
          user_id: typedBooking.artist_id,
          display_name:
            profileMap.get(typedBooking.artist_id)?.display_name ?? "Artist",
          avatar_url:
            profileMap.get(typedBooking.artist_id)?.avatar_url ?? null,
          role: profileMap.get(typedBooking.artist_id)?.role ?? "artist",
          participant_role: "artist",
        },
        {
          user_id: typedBooking.promoter_id,
          display_name:
            profileMap.get(typedBooking.promoter_id)?.display_name ??
            "Promoter",
          avatar_url:
            profileMap.get(typedBooking.promoter_id)?.avatar_url ?? null,
          role: profileMap.get(typedBooking.promoter_id)?.role ?? "promoter",
          participant_role: "promoter",
        },
      ];

      if (!dealRoomIdResult) {
        setError(
          "Could not access the Deal Room. Please ensure the booking belongs to you.",
        );
        setLoading(false);
        return;
      }

      setData({
        dealRoomId: dealRoomIdResult,
        booking: typedBooking,
        offer,
        participants,
        signatures: (sigsRes.data ?? []) as ContractSignature[],
      });
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [bookingId, isDemo, refreshTick]);

  const status = useMemo(() => {
    if (!data) return "draft" as const;
    return computeDealStatus({
      booking: data.booking,
      offer: data.offer,
      signatures: data.signatures,
      participantIds: data.participants.map((p) => p.user_id),
    });
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-amber-400 mb-3" />
        <h1 className="font-display font-bold text-xl mb-1">
          Deal Room unavailable
        </h1>
        <p className="text-sm text-muted-foreground max-w-md">{error}</p>
        <Button asChild variant="outline" className="mt-6 border-white/[0.06]">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to dashboard
          </Link>
        </Button>
      </div>
    );
  }

  const canInteract = !isDemo && !!user;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen py-6 sm:py-8"
    >
      <SEO
        title={`${data.booking.venue_name} · Deal Room | GetBooked.Live`}
        description={`Negotiate terms, sign contracts, and track payments for ${data.booking.venue_name} on ${data.booking.event_date}.`}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Link to={isDemo ? "/" : "/dashboard"}>
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              {isDemo ? "Back to landing" : "Back to dashboard"}
            </Link>
          </Button>
          {isDemo ? (
            <span className="text-[10px] uppercase tracking-wider text-[hsl(var(--primary))] border border-[hsl(var(--primary))]/30 rounded-full px-2.5 py-0.5">
              Demo mode
            </span>
          ) : null}
        </div>

        <DealRoomHeader
          booking={data.booking}
          participants={data.participants}
          status={status}
        />

        <Tabs defaultValue="terms" className="w-full">
          <TabsList
            className="w-full h-auto flex flex-wrap gap-1 bg-background/40 border border-white/[0.06] p-1 rounded-xl"
            data-testid="deal-room-tabs"
          >
            <TabsTrigger
              value="terms"
              className="flex-1 min-w-[100px] data-[state=active]:bg-[hsl(var(--primary))]/10 data-[state=active]:text-[hsl(var(--primary))]"
            >
              Terms
            </TabsTrigger>
            <TabsTrigger
              value="messages"
              className="flex-1 min-w-[100px] data-[state=active]:bg-[hsl(var(--primary))]/10 data-[state=active]:text-[hsl(var(--primary))]"
            >
              Messages
            </TabsTrigger>
            <TabsTrigger
              value="contract"
              className="flex-1 min-w-[100px] data-[state=active]:bg-[hsl(var(--primary))]/10 data-[state=active]:text-[hsl(var(--primary))]"
            >
              Contract
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="flex-1 min-w-[100px] data-[state=active]:bg-[hsl(var(--primary))]/10 data-[state=active]:text-[hsl(var(--primary))]"
            >
              Payment
            </TabsTrigger>
            <TabsTrigger
              value="logistics"
              className="flex-1 min-w-[100px] data-[state=active]:bg-[hsl(var(--primary))]/10 data-[state=active]:text-[hsl(var(--primary))]"
            >
              Logistics
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="flex-1 min-w-[100px] data-[state=active]:bg-[hsl(var(--primary))]/10 data-[state=active]:text-[hsl(var(--primary))]"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="terms" className="mt-4">
            <DealTermsTab
              booking={data.booking}
              offer={data.offer}
              onOfferUpdated={refresh}
            />
          </TabsContent>

          <TabsContent value="messages" className="mt-4">
            <DealMessagesTab
              dealRoomId={data.dealRoomId}
              participants={data.participants}
              readOnly={!canInteract}
              initialMessages={data.demoMessages}
            />
          </TabsContent>

          <TabsContent value="contract" className="mt-4">
            <DealContractTab
              booking={data.booking}
              participants={data.participants}
              signatures={data.signatures}
              readOnly={isDemo}
              onSigned={refresh}
            />
          </TabsContent>

          <TabsContent value="payment" className="mt-4">
            <DealPaymentTab booking={data.booking} readOnly={isDemo} />
          </TabsContent>

          <TabsContent value="logistics" className="mt-4">
            <DealLogisticsTab booking={data.booking} offer={data.offer} />
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <DealActivityTab
              booking={data.booking}
              offer={data.offer}
              signatures={data.signatures}
              messages={data.demoMessages ?? []}
              participants={data.participants}
            />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
