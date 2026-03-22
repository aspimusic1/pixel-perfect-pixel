import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Inbox, CheckCircle, XCircle, FileText, Loader2, Download, PenLine, ArrowRightLeft, ChevronLeft, ChevronRight, Shield, Users, BarChart3, Banknote, TrendingUp, Music2 } from "lucide-react";
import { toast } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ArtistSidebar, { type ArtistView } from "@/components/ArtistSidebar";
import OnboardingChecklist from "@/components/OnboardingChecklist";
import BookingAgentPanel from "@/components/BookingAgentPanel";
import SignContractDialog from "@/components/SignContractDialog";
import CounterOfferDialog from "@/components/CounterOfferDialog";
import NegotiationThread from "@/components/NegotiationThread";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import ContractReviewDialog from "@/components/ContractReviewDialog";
import AttendanceReportDialog from "@/components/AttendanceReportDialog";
import BookkeepingSection from "@/components/BookkeepingSection";
import AdvanceRequestDialog from "@/components/AdvanceRequestDialog";
import InsuranceOfferCard from "@/components/InsuranceOfferCard";
import { openSignedContract, downloadSignedContract } from "@/lib/db-call";
import FreeOfferBanner from "@/components/FreeOfferBanner";

type Offer = {
  id: string;
  venue_name: string;
  event_date: string;
  event_time: string | null;
  guarantee: number;
  door_split: number | null;
  merch_split: number | null;
  commission_amount: number | null;
  notes: string | null;
  status: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
};

type Booking = {
  id: string;
  offer_id: string;
  contract_url: string | null;
  status: string;
  artist_id: string;
  promoter_id: string;
  venue_name: string;
  event_date: string;
  guarantee: number;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  accepted: "bg-green-500/10 text-green-400 border-green-500/20",
  declined: "bg-red-500/10 text-red-400 border-red-500/20",
  negotiating: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function ArtistDashboard() {
  const { user, profile } = useAuth();
  const [activeView, setActiveView] = useState<ArtistView>("overview");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;
  const [generatingContract, setGeneratingContract] = useState<string | null>(null);
  const [signatures, setSignatures] = useState<Record<string, string[]>>({});
  const [signDialogBooking, setSignDialogBooking] = useState<{ id: string; venueName: string; eventDate: string; guarantee: number } | null>(null);
  const [counterDialogOffer, setCounterDialogOffer] = useState<Offer | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviewOffer, setReviewOffer] = useState<Offer | null>(null);
  const [attendanceBooking, setAttendanceBooking] = useState<Booking | null>(null);
  const [attendanceReported, setAttendanceReported] = useState<Set<string>>(new Set());
  const [advanceBooking, setAdvanceBooking] = useState<Booking | null>(null);
  const [advanceRequested, setAdvanceRequested] = useState<Set<string>>(new Set());

  const fetchSignatures = async (bookingIds: string[]) => {
    if (bookingIds.length === 0) return;
    const { data } = await supabase
      .from("contract_signatures")
      .select("booking_id, user_id")
      .in("booking_id", bookingIds);
    const sigMap: Record<string, string[]> = {};
    (data ?? []).forEach((s: any) => {
      if (!sigMap[s.booking_id]) sigMap[s.booking_id] = [];
      sigMap[s.booking_id].push(s.user_id);
    });
    setSignatures(sigMap);
  };

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [offersRes, bookingsRes] = await Promise.all([
        supabase.from("offers").select("*").eq("recipient_id", user.id).order("created_at", { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1),
        supabase.from("bookings").select("id, offer_id, contract_url, status, artist_id, promoter_id, venue_name, event_date, guarantee").eq("artist_id", user.id),
      ]);
      const fetchedOffers = (offersRes.data as Offer[]) ?? [];
      setHasMore(fetchedOffers.length === PAGE_SIZE);
      setOffers(fetchedOffers);
      const bks = (bookingsRes.data as Booking[]) ?? [];
      setBookings(bks);
      await fetchSignatures(bks.map((b) => b.id));
      setLoading(false);
    };
    fetchData();
  }, [user, page]);

  const handleRespond = async (offerId: string, status: "accepted" | "declined", addedClauses?: string[]) => {
    if (!user) return;
    setActionLoading(offerId);

    const { error } = await supabase.from("offers").update({ status }).eq("id", offerId);
    if (error) { toast.error(error.message); setActionLoading(null); return; }
    setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, status } : o)));

    if (status === "accepted") {
      const offer = offers.find((o) => o.id === offerId);
      if (!offer) return;

      let notes = offer.notes || "";
      if (addedClauses && addedClauses.length > 0) {
        notes = (notes ? notes + "\n\n" : "") + "AI-Suggested Clauses:\n" + addedClauses.join("\n");
      }

      const { data: booking, error: bookingErr } = await supabase
        .from("bookings")
        .insert({
          offer_id: offerId,
          artist_id: user.id,
          promoter_id: offer.sender_id,
          venue_name: offer.venue_name,
          event_date: offer.event_date,
          event_time: offer.event_time,
          guarantee: offer.guarantee,
        } as any)
        .select()
        .single();

      if (bookingErr) {
        toast.error("Offer accepted but booking creation failed: " + bookingErr.message);
        return;
      }

      const newBooking = booking as unknown as Booking;
      setBookings((prev) => [...prev, newBooking]);
      toast.success("Offer accepted! Generating contract...");

      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "offer-accepted",
            recipientEmail: offer.sender_id,
            idempotencyKey: `offer-accepted-${newBooking.id}`,
            templateData: {
              venueName: offer.venue_name,
              eventDate: offer.event_date,
              guarantee: offer.guarantee,
            },
          },
        });
      } catch {
        // Email is best-effort
      }

      setGeneratingContract(newBooking.id);
      try {
        const { data, error: fnErr } = await supabase.functions.invoke("generate-contract", {
          body: { booking_id: newBooking.id },
        });
        if (fnErr) throw fnErr;
        if (data?.contract_url) {
          setBookings((prev) =>
            prev.map((b) => (b.id === newBooking.id ? { ...b, contract_url: data.contract_url } : b))
          );
          toast.success("Contract generated!");
        }
      } catch (err: any) {
        toast.error("Contract generation failed — you can retry later.");
      } finally {
        setGeneratingContract(null);
      }
    } else {
      toast.success("Offer declined");
    }
    setActionLoading(null);
  };

  const getBookingForOffer = (offerId: string) => bookings.find((b) => b.offer_id === offerId);

  const pendingCount = offers.filter((o) => o.status === "pending").length;
  const acceptedCount = offers.filter((o) => o.status === "accepted").length;
  const totalGuarantee = offers.filter((o) => o.status === "accepted").reduce((s, o) => s + o.guarantee, 0);
  const nextShow = bookings
    .filter((b) => new Date(b.event_date) >= new Date())
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())[0];

  const renderOfferCard = (offer: Offer) => {
    const booking = getBookingForOffer(offer.id);
    const isGenerating = generatingContract === booking?.id;

    return (
      <div key={offer.id} className="rounded-2xl bg-card border border-border p-5 sm:p-6 flex flex-col gap-4 transition-all hover:border-muted-foreground/20">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
              <span className="font-display font-bold text-base lowercase truncate">{offer.venue_name}</span>
              <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${statusColors[offer.status] ?? ""}`}>{offer.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(offer.event_date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-display font-bold text-lg text-primary tabular-nums">${offer.guarantee.toLocaleString()}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">guarantee</p>
          </div>
        </div>

        {offer.status === "pending" && (
          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
            <Button
              size="sm"
              disabled={actionLoading === offer.id}
              onClick={() => setReviewOffer(offer)}
              className="bg-green-600 hover:bg-green-700 text-foreground active:scale-[0.97] transition-transform h-9"
            >
              {actionLoading === offer.id ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Shield className="w-3.5 h-3.5 mr-1.5" />} review & accept
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={actionLoading === offer.id}
              onClick={() => setCounterDialogOffer(offer)}
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10 active:scale-[0.97] transition-transform h-9"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" /> counter
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={actionLoading === offer.id}
              onClick={() => handleRespond(offer.id, "declined")}
              className="border-border hover:bg-destructive/10 active:scale-[0.97] transition-transform h-9"
            >
              <XCircle className="w-3.5 h-3.5 mr-1.5" /> decline
            </Button>
          </div>
        )}

        {offer.status === "negotiating" && (
          <NegotiationThread
            offerId={offer.id}
            offer={offer}
            onOfferUpdated={(newStatus, updatedTerms) => {
              setOffers((prev) => prev.map((o) =>
                o.id === offer.id
                  ? { ...o, status: newStatus, ...(updatedTerms ?? {}) }
                  : o
              ));
            }}
          />
        )}

        {offer.status === "accepted" && booking && (
          <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border flex-wrap">
            {isGenerating ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                generating contract...
              </div>
            ) : booking.contract_url ? (
              <>
                <Button size="sm" variant="outline" onClick={() => openSignedContract(booking.contract_url!)} className="border-primary/30 text-primary hover:bg-primary/10 active:scale-[0.97] transition-transform h-9">
                  <FileText className="w-3.5 h-3.5 mr-1.5" /> view contract
                </Button>
                <Button size="sm" variant="outline" onClick={() => downloadSignedContract(booking.contract_url!)} className="border-border text-muted-foreground hover:text-foreground active:scale-[0.97] transition-transform h-9">
                  <Download className="w-3.5 h-3.5 mr-1.5" /> download
                </Button>
                {user && signatures[booking.id]?.includes(user.id) ? (
                  <div className="flex items-center gap-1.5 text-xs text-primary font-medium px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 h-9 justify-center">
                    <CheckCircle className="w-3.5 h-3.5" /> signed
                  </div>
                ) : (
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-transform h-9"
                    onClick={() => setSignDialogBooking({
                      id: booking.id,
                      venueName: offer.venue_name,
                      eventDate: offer.event_date,
                      guarantee: offer.guarantee,
                    })}
                  >
                    <PenLine className="w-3.5 h-3.5 mr-1.5" /> sign contract
                  </Button>
                )}
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="border-border text-muted-foreground h-9"
                onClick={async () => {
                  setGeneratingContract(booking.id);
                  try {
                    const { data } = await supabase.functions.invoke("generate-contract", {
                      body: { booking_id: booking.id },
                    });
                    if (data?.contract_url) {
                      setBookings((prev) =>
                        prev.map((b) => (b.id === booking.id ? { ...b, contract_url: data.contract_url } : b))
                      );
                      toast.success("Contract generated!");
                    }
                  } catch {
                    toast.error("Generation failed");
                  } finally {
                    setGeneratingContract(null);
                  }
                }}
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" /> generate contract
              </Button>
            )}
            {new Date(offer.event_date) < new Date() && !attendanceReported.has(booking.id) && (
              <Button size="sm" variant="outline" onClick={() => setAttendanceBooking(booking)} className="border-[#FFB83E]/30 text-[#FFB83E] hover:bg-[#FFB83E]/10 active:scale-[0.97] transition-transform h-9">
                <Users className="w-3.5 h-3.5 mr-1.5" /> report attendance
              </Button>
            )}
            {attendanceReported.has(booking.id) && (
              <div className="flex items-center gap-1.5 text-xs text-[#3EFFBE] font-medium px-3 py-1.5 rounded-lg bg-[#3EFFBE]/10 border border-[#3EFFBE]/20 h-9 justify-center">
                <CheckCircle className="w-3.5 h-3.5" /> attendance reported
              </div>
            )}
            {booking.status === "confirmed" && new Date(offer.event_date) > new Date() && !advanceRequested.has(booking.id) && (
              <Button size="sm" variant="outline" onClick={() => setAdvanceBooking(booking)} className="border-[#3EC8FF]/30 text-[#3EC8FF] hover:bg-[#3EC8FF]/10 active:scale-[0.97] transition-transform h-9">
                <Banknote className="w-3.5 h-3.5 mr-1.5" /> request advance
              </Button>
            )}
            {advanceRequested.has(booking.id) && (
              <div className="flex items-center gap-1.5 text-xs text-[#3EC8FF] font-medium px-3 py-1.5 rounded-lg bg-[#3EC8FF]/10 border border-[#3EC8FF]/20 h-9 justify-center">
                <CheckCircle className="w-3.5 h-3.5" /> advance requested
              </div>
            )}
            {user && signatures[booking.id]?.includes(user.id) && (signatures[booking.id]?.length ?? 0) >= 2 && (
              <div className="w-full mt-1">
                <InsuranceOfferCard bookingId={booking.id} guarantee={offer.guarantee} userRole="artist" />
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ArtistSidebar activeView={activeView} onViewChange={setActiveView} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 sm:px-6 pt-16">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Music2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-sm font-bold lowercase leading-tight">{profile?.display_name ?? "artist"}</h1>
                <p className="text-[10px] text-muted-foreground lowercase">artist dashboard</p>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-6">

              {/* Overview View */}
              {activeView === "overview" && (
                <>
                  <OnboardingChecklist />

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="rounded-2xl bg-card border border-border p-5 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Inbox className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">pending</p>
                      <p className="font-display text-2xl font-bold tabular-nums">{loading ? "—" : pendingCount}</p>
                    </div>
                    <div className="rounded-2xl bg-card border border-border p-5 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">confirmed</p>
                      <p className="font-display text-2xl font-bold tabular-nums">{loading ? "—" : acceptedCount}</p>
                    </div>
                    <div className="rounded-2xl bg-card border border-border p-5 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-[#C8FF3E]/10 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-[#C8FF3E]" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">revenue</p>
                      <p className="font-display text-2xl font-bold tabular-nums">{loading ? "—" : `$${totalGuarantee.toLocaleString()}`}</p>
                    </div>
                    <div className="rounded-2xl bg-card border border-border p-5 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-[#FFB83E]/10 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-[#FFB83E]" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">next show</p>
                      <p className="font-display text-sm font-bold truncate">
                        {loading ? "—" : nextShow ? (
                          <span className="lowercase">{nextShow.venue_name} · {new Date(nextShow.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        ) : "none scheduled"}
                      </p>
                    </div>
                  </div>

                  {/* Recent offers preview */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-display text-base font-bold lowercase">recent offers</h2>
                      <Button variant="ghost" size="sm" onClick={() => setActiveView("offers")} className="text-xs text-muted-foreground hover:text-foreground lowercase h-8">
                        view all →
                      </Button>
                    </div>
                    {loading ? (
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="rounded-2xl bg-card border border-border p-5 space-y-3">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        ))}
                      </div>
                    ) : offers.length === 0 ? (
                      <div className="rounded-2xl bg-card border border-border p-8 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                          <Inbox className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">no offers yet</p>
                        <p className="text-xs text-muted-foreground">when promoters send you offers, they'll appear here.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {offers.slice(0, 3).map(renderOfferCard)}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Offers View */}
              {activeView === "offers" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold lowercase">all offers</h2>
                    <span className="text-xs text-muted-foreground tabular-nums">{offers.length} total</span>
                  </div>
                  <FreeOfferBanner mode="received" />
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-2xl bg-card border border-border p-5 space-y-3">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      ))}
                    </div>
                  ) : offers.length === 0 ? (
                    <div className="rounded-2xl bg-card border border-border p-8 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                        <Inbox className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">no offers yet</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {offers.map(renderOfferCard)}
                      </div>
                      {offers.length > 0 && (
                        <div className="flex items-center justify-center gap-3 pt-4">
                          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="border-border active:scale-[0.97] transition-transform h-9">
                            <ChevronLeft className="w-4 h-4 mr-1" /> previous
                          </Button>
                          <span className="text-xs text-muted-foreground tabular-nums">page {page + 1}</span>
                          <Button size="sm" variant="outline" disabled={!hasMore} onClick={() => setPage((p) => p + 1)} className="border-border active:scale-[0.97] transition-transform h-9">
                            next <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Calendar View */}
              {activeView === "calendar" && (
                <>
                  <h2 className="font-display text-lg font-bold lowercase">availability calendar</h2>
                  <AvailabilityCalendar />
                </>
              )}

              {/* Bookkeeping View */}
              {activeView === "bookkeeping" && (
                <>
                  <h2 className="font-display text-lg font-bold lowercase">bookkeeping</h2>
                  <BookkeepingSection />
                </>
              )}

              {/* AI Agent View */}
              {activeView === "agent" && (
                <>
                  <h2 className="font-display text-lg font-bold lowercase">ai booking agent</h2>
                  <BookingAgentPanel />
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Dialogs */}
      {attendanceBooking && (
        <AttendanceReportDialog
          open={!!attendanceBooking}
          onOpenChange={(open) => { if (!open) setAttendanceBooking(null); }}
          booking={attendanceBooking}
          onReported={() => {
            setAttendanceReported((prev) => new Set([...prev, attendanceBooking.id]));
          }}
        />
      )}

      {signDialogBooking && (
        <SignContractDialog
          open={!!signDialogBooking}
          onOpenChange={(open) => { if (!open) setSignDialogBooking(null); }}
          bookingId={signDialogBooking.id}
          venueName={signDialogBooking.venueName}
          eventDate={signDialogBooking.eventDate}
          guarantee={signDialogBooking.guarantee}
          onSigned={() => {
            if (user) {
              setSignatures((prev) => ({
                ...prev,
                [signDialogBooking.id]: [...(prev[signDialogBooking.id] ?? []), user.id],
              }));
            }
          }}
        />
      )}

      {counterDialogOffer && (
        <CounterOfferDialog
          open={!!counterDialogOffer}
          onOpenChange={(open) => { if (!open) setCounterDialogOffer(null); }}
          offerId={counterDialogOffer.id}
          currentTerms={{
            guarantee: counterDialogOffer.guarantee,
            doorSplit: counterDialogOffer.door_split,
            merchSplit: counterDialogOffer.merch_split,
            eventDate: counterDialogOffer.event_date,
            eventTime: counterDialogOffer.event_time,
            venueName: counterDialogOffer.venue_name,
          }}
          onCountered={() => {
            setOffers((prev) => prev.map((o) =>
              o.id === counterDialogOffer.id ? { ...o, status: "negotiating" } : o
            ));
          }}
        />
      )}

      {reviewOffer && (
        <ContractReviewDialog
          open={!!reviewOffer}
          onOpenChange={(open) => { if (!open) setReviewOffer(null); }}
          offerId={reviewOffer.id}
          onProceed={(addedClauses) => {
            handleRespond(reviewOffer.id, "accepted", addedClauses);
            setReviewOffer(null);
          }}
        />
      )}

      {advanceBooking && (
        <AdvanceRequestDialog
          open={!!advanceBooking}
          onOpenChange={(open) => { if (!open) setAdvanceBooking(null); }}
          booking={{
            id: advanceBooking.id,
            guarantee: advanceBooking.guarantee,
            venue_name: advanceBooking.venue_name,
            event_date: advanceBooking.event_date,
            promoter_id: advanceBooking.promoter_id,
          }}
          onRequested={() => {
            setAdvanceRequested((prev) => new Set([...prev, advanceBooking.id]));
          }}
        />
      )}
    </SidebarProvider>
  );
}
