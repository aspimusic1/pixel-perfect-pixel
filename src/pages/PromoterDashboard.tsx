import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Users, Plus, PenLine, CheckCircle, FileText, ChevronLeft, ChevronRight, DollarSign, TrendingUp, Megaphone } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import PromoterSidebar, { type PromoterView } from "@/components/PromoterSidebar";
import SignContractDialog from "@/components/SignContractDialog";
import NegotiationThread from "@/components/NegotiationThread";
import RecommendedArtists from "@/components/RecommendedArtists";
import AttendanceReportDialog from "@/components/AttendanceReportDialog";
import InsuranceOfferCard from "@/components/InsuranceOfferCard";
import FinancingOption from "@/components/FinancingOption";
import { openSignedContract } from "@/lib/db-call";
import FreeOfferBanner from "@/components/FreeOfferBanner";

type Offer = {
  id: string;
  venue_name: string;
  event_date: string;
  event_time: string | null;
  guarantee: number;
  door_split: number | null;
  merch_split: number | null;
  status: string;
  recipient_id: string;
  sender_id: string;
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

export default function PromoterDashboard() {
  const { user, profile } = useAuth();
  const [activeView, setActiveView] = useState<PromoterView>("overview");
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;
  const [signatures, setSignatures] = useState<Record<string, string[]>>({});
  const [signDialogBooking, setSignDialogBooking] = useState<{ id: string; venueName: string; eventDate: string; guarantee: number } | null>(null);
  const [attendanceBooking, setAttendanceBooking] = useState<Booking | null>(null);
  const [attendanceReported, setAttendanceReported] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [offersRes, bookingsRes] = await Promise.all([
        supabase.from("offers").select("*").eq("sender_id", user.id).order("created_at", { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1),
        supabase.from("bookings").select("id, offer_id, contract_url, status, artist_id, promoter_id, venue_name, event_date, guarantee").eq("promoter_id", user.id),
      ]);
      const fetchedOffers = (offersRes.data as Offer[]) ?? [];
      setHasMore(fetchedOffers.length === PAGE_SIZE);
      setOffers(fetchedOffers);
      const bks = (bookingsRes.data as Booking[]) ?? [];
      setBookings(bks);

      if (bks.length > 0) {
        const { data: sigData } = await supabase
          .from("contract_signatures")
          .select("booking_id, user_id")
          .in("booking_id", bks.map((b) => b.id));
        const sigMap: Record<string, string[]> = {};
        (sigData ?? []).forEach((s: any) => {
          if (!sigMap[s.booking_id]) sigMap[s.booking_id] = [];
          sigMap[s.booking_id].push(s.user_id);
        });
        setSignatures(sigMap);
      }

      setLoading(false);
    };
    fetchData();
  }, [user, page]);

  const getBookingForOffer = (offerId: string) => bookings.find((b) => b.offer_id === offerId);

  const sentCount = offers.length;
  const acceptedCount = offers.filter((o) => o.status === "accepted").length;
  const totalSpend = offers.filter((o) => o.status === "accepted").reduce((s, o) => s + o.guarantee, 0);
  const nextEvent = bookings
    .filter((b) => new Date(b.event_date) >= new Date())
    .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())[0];

  const renderOfferCard = (offer: Offer) => {
    const booking = getBookingForOffer(offer.id);
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

        {offer.status === "negotiating" && (
          <NegotiationThread
            offerId={offer.id}
            offer={offer}
            onOfferUpdated={(newStatus, updatedTerms) => {
              setOffers((prev) => prev.map((o) =>
                o.id === offer.id ? { ...o, status: newStatus, ...(updatedTerms ?? {}) } : o
              ));
            }}
          />
        )}

        {offer.status === "accepted" && booking && (
          <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-border flex-wrap">
            {booking.contract_url && (
              <Button size="sm" variant="outline" onClick={() => openSignedContract(booking.contract_url!)} className="border-primary/30 text-primary hover:bg-primary/10 active:scale-[0.97] transition-transform h-9">
                <FileText className="w-3.5 h-3.5 mr-1.5" /> view contract
              </Button>
            )}
            {user && signatures[booking.id]?.includes(user.id) ? (
              <div className="flex items-center gap-1.5 text-xs text-primary font-medium px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 h-9 justify-center">
                <CheckCircle className="w-3.5 h-3.5" /> signed
              </div>
            ) : booking.contract_url ? (
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-transform h-9" onClick={() => setSignDialogBooking({ id: booking.id, venueName: offer.venue_name, eventDate: offer.event_date, guarantee: offer.guarantee })}>
                <PenLine className="w-3.5 h-3.5 mr-1.5" /> sign contract
              </Button>
            ) : null}
            {new Date(offer.event_date) < new Date() && !attendanceReported.has(booking.id) && (
              <Button size="sm" variant="outline" onClick={() => setAttendanceBooking(booking)} className="border-[#FFB83E]/30 text-[#FFB83E] hover:bg-[#FFB83E]/10 active:scale-[0.97] transition-transform h-9">
                <Users className="w-3.5 h-3.5 mr-1.5" /> report attendance
              </Button>
            )}
            {attendanceReported.has(booking.id) && (
              <div className="flex items-center gap-1.5 text-xs text-[#3EFFBE] font-medium px-3 py-1.5 rounded-lg bg-[#3EFFBE]/10 border border-[#3EFFBE]/20 h-9 justify-center">
                <CheckCircle className="w-3.5 h-3.5" /> reported
              </div>
            )}
            {user && signatures[booking.id]?.includes(user.id) && (signatures[booking.id]?.length ?? 0) >= 2 && (
              <div className="w-full mt-1 space-y-2">
                <InsuranceOfferCard bookingId={booking.id} guarantee={offer.guarantee} userRole="promoter" />
                <FinancingOption bookingId={booking.id} guarantee={offer.guarantee} />
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
        <PromoterSidebar activeView={activeView} onViewChange={setActiveView} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 sm:px-6 pt-16">
            <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FF5C8A]/10 flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-[#FF5C8A]" />
              </div>
              <div>
                <h1 className="font-display text-sm font-bold lowercase leading-tight">{profile?.display_name ?? "promoter"}</h1>
                <p className="text-[10px] text-muted-foreground lowercase">promoter dashboard</p>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto space-y-6">

              {/* Overview */}
              {activeView === "overview" && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="rounded-2xl bg-card border border-border p-5 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-[#FF5C8A]/10 flex items-center justify-center">
                        <Send className="w-4 h-4 text-[#FF5C8A]" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">sent</p>
                      <p className="font-display text-2xl font-bold tabular-nums">{loading ? "—" : sentCount}</p>
                    </div>
                    <div className="rounded-2xl bg-card border border-border p-5 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">accepted</p>
                      <p className="font-display text-2xl font-bold tabular-nums">{loading ? "—" : acceptedCount}</p>
                    </div>
                    <div className="rounded-2xl bg-card border border-border p-5 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-primary" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">total spend</p>
                      <p className="font-display text-2xl font-bold tabular-nums">{loading ? "—" : `$${totalSpend.toLocaleString()}`}</p>
                    </div>
                    <div className="rounded-2xl bg-card border border-border p-5 space-y-2">
                      <div className="w-9 h-9 rounded-xl bg-[#FFB83E]/10 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-[#FFB83E]" />
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">next event</p>
                      <p className="font-display text-sm font-bold truncate">
                        {loading ? "—" : nextEvent ? (
                          <span className="lowercase">{nextEvent.venue_name} · {new Date(nextEvent.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        ) : "none scheduled"}
                      </p>
                    </div>
                  </div>

                  {/* Quick action */}
                  <div className="flex justify-end">
                    <Link to="/directory">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium active:scale-[0.97] transition-transform h-9 text-xs lowercase">
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> find artists
                      </Button>
                    </Link>
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
                          <Send className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">no offers sent yet</p>
                        <p className="text-xs text-muted-foreground">find artists in the directory to send your first offer.</p>
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
                  <FreeOfferBanner mode="sent" />
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
                        <Send className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">no offers sent yet</p>
                      <Link to="/directory"><Button variant="outline" className="border-border mt-3 text-xs lowercase">browse directory</Button></Link>
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

              {/* Discover View */}
              {activeView === "discover" && (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold lowercase">discover talent</h2>
                    <Link to="/directory">
                      <Button variant="outline" size="sm" className="border-border text-xs lowercase h-8 active:scale-[0.97] transition-transform">
                        <Plus className="w-3.5 h-3.5 mr-1" /> browse directory
                      </Button>
                    </Link>
                  </div>
                  <RecommendedArtists />
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
    </SidebarProvider>
  );
}
