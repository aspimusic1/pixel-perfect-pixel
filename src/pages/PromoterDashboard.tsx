import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Users, Plus, PenLine, CheckCircle, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import SignContractDialog from "@/components/SignContractDialog";
import NegotiationThread from "@/components/NegotiationThread";
import { openSignedContract } from "@/lib/db-call";

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
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  accepted: "bg-green-500/10 text-green-400 border-green-500/20",
  declined: "bg-red-500/10 text-red-400 border-red-500/20",
  negotiating: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function PromoterDashboard() {
  const { user, profile } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 20;
  const [signatures, setSignatures] = useState<Record<string, string[]>>({});
  const [signDialogBooking, setSignDialogBooking] = useState<{ id: string; venueName: string; eventDate: string; guarantee: number } | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [offersRes, bookingsRes] = await Promise.all([
        supabase.from("offers").select("*").eq("sender_id", user.id).order("created_at", { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1),
        supabase.from("bookings").select("id, offer_id, contract_url, status").eq("promoter_id", user.id),
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

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold mb-1">Welcome back, {profile?.display_name ?? "Promoter"}</h1>
            <p className="text-muted-foreground text-sm">Manage your offers and discover talent.</p>
          </div>
          <Link to="/directory">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium active:scale-[0.97] transition-transform">
              <Plus className="w-4 h-4 mr-1" /> Find Artists
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="rounded-xl bg-card border border-border p-4 sm:p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2"><Send className="w-3.5 h-3.5" /> Offers Sent</div>
            <p className="font-display text-xl sm:text-2xl font-bold">{offers.length}</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-4 sm:p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2"><Users className="w-3.5 h-3.5" /> Accepted</div>
            <p className="font-display text-xl sm:text-2xl font-bold">{offers.filter((o) => o.status === "accepted").length}</p>
          </div>
        </div>

        <h2 className="font-display text-lg font-semibold mb-4">Your Offers</h2>
        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />)}</div>
        ) : offers.length === 0 ? (
          <div className="rounded-xl bg-card border border-border p-6 sm:p-8 text-center">
            <p className="text-muted-foreground mb-2">No offers sent yet</p>
            <Link to="/directory"><Button variant="outline" className="border-border">Browse the directory</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => {
              const booking = getBookingForOffer(offer.id);
              return (
                <div key={offer.id} className="rounded-xl bg-card border border-border p-4 sm:p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-display font-semibold text-sm sm:text-base truncate">{offer.venue_name}</span>
                        <Badge variant="outline" className={statusColors[offer.status] ?? ""}>{offer.status}</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {new Date(offer.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {" · "}${offer.guarantee.toLocaleString()} guarantee
                      </p>
                    </div>
                  </div>

                  {/* Negotiating: show thread */}
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

                  {/* Accepted: Contract + Sign */}
                  {offer.status === "accepted" && booking && (
                    <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-border">
                      {booking.contract_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openSignedContract(booking.contract_url!)}
                          className="border-primary/30 text-primary hover:bg-primary/10 active:scale-[0.97] transition-transform w-full sm:w-auto h-10 sm:h-9"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" /> View Contract
                        </Button>
                      )}
                      {user && signatures[booking.id]?.includes(user.id) ? (
                        <div className="flex items-center gap-1.5 text-xs text-[hsl(var(--primary))] font-medium px-3 py-1.5 rounded-md bg-[hsl(var(--primary))]/10 border border-[hsl(var(--primary))]/20 w-full sm:w-auto h-10 sm:h-9 justify-center">
                          <CheckCircle className="w-3.5 h-3.5" /> Signed
                        </div>
                      ) : booking.contract_url ? (
                        <Button
                          size="sm"
                          className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 active:scale-[0.97] transition-transform w-full sm:w-auto h-10 sm:h-9"
                          onClick={() => setSignDialogBooking({
                            id: booking.id,
                            venueName: offer.venue_name,
                            eventDate: offer.event_date,
                            guarantee: offer.guarantee,
                          })}
                        >
                          <PenLine className="w-3.5 h-3.5 mr-1" /> Sign Contract
                        </Button>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {offers.length > 0 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="border-border active:scale-[0.97] transition-transform h-9"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <span className="text-xs text-muted-foreground">Page {page + 1}</span>
            <Button
              size="sm"
              variant="outline"
              disabled={!hasMore}
              onClick={() => setPage((p) => p + 1)}
              className="border-border active:scale-[0.97] transition-transform h-9"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Sign Contract Dialog */}
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
    </div>
  );
}
