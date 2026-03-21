import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Inbox, CheckCircle, XCircle, FileText, Loader2, Download, PenLine } from "lucide-react";
import { toast } from "sonner";
import OnboardingChecklist from "@/components/OnboardingChecklist";
import SignContractDialog from "@/components/SignContractDialog";

type Offer = {
  id: string;
  venue_name: string;
  event_date: string;
  event_time: string | null;
  guarantee: number;
  commission_amount: number | null;
  status: string;
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
};

export default function ArtistDashboard() {
  const { user, profile } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingContract, setGeneratingContract] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const [offersRes, bookingsRes] = await Promise.all([
        supabase.from("offers").select("*").eq("recipient_id", user.id).order("created_at", { ascending: false }),
        supabase.from("bookings").select("id, offer_id, contract_url, status").eq("artist_id", user.id),
      ]);
      setOffers((offersRes.data as Offer[]) ?? []);
      setBookings((bookingsRes.data as Booking[]) ?? []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const handleRespond = async (offerId: string, status: "accepted" | "declined") => {
    if (!user) return;

    const { error } = await supabase.from("offers").update({ status }).eq("id", offerId);
    if (error) { toast.error(error.message); return; }
    setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, status } : o)));

    if (status === "accepted") {
      const offer = offers.find((o) => o.id === offerId);
      if (!offer) return;

      // Create booking
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

      // Generate contract PDF
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
  };

  const getBookingForOffer = (offerId: string) => bookings.find((b) => b.offer_id === offerId);

  const pendingCount = offers.filter((o) => o.status === "pending").length;
  const totalGuarantee = offers.filter((o) => o.status === "accepted").reduce((s, o) => s + o.guarantee, 0);

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="container mx-auto max-w-4xl">
        <h1 className="font-display text-xl sm:text-2xl font-bold mb-1">Welcome back, {profile?.display_name ?? "Artist"}</h1>
        <p className="text-muted-foreground text-sm mb-6 sm:mb-8">Here's your booking overview.</p>

        <OnboardingChecklist />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="rounded-xl bg-card border border-border p-4 sm:p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2"><Inbox className="w-3.5 h-3.5" /> Pending Offers</div>
            <p className="font-display text-xl sm:text-2xl font-bold">{pendingCount}</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-4 sm:p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2"><DollarSign className="w-3.5 h-3.5" /> Confirmed Revenue</div>
            <p className="font-display text-xl sm:text-2xl font-bold">${totalGuarantee.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-4 sm:p-5 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2"><Calendar className="w-3.5 h-3.5" /> Total Offers</div>
            <p className="font-display text-xl sm:text-2xl font-bold">{offers.length}</p>
          </div>
        </div>

        {/* Offers */}
        <h2 className="font-display text-lg font-semibold mb-4">Your Offers</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />)}
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded-xl bg-card border border-border p-6 sm:p-8 text-center">
            <p className="text-muted-foreground mb-2">No offers yet</p>
            <p className="text-sm text-muted-foreground">When promoters send you offers, they'll appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => {
              const booking = getBookingForOffer(offer.id);
              const isGenerating = generatingContract === booking?.id;

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

                  {/* Pending: Accept/Decline */}
                  {offer.status === "pending" && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRespond(offer.id, "accepted")}
                        className="bg-green-600 hover:bg-green-700 text-foreground active:scale-[0.97] transition-transform w-full sm:w-auto h-10 sm:h-9"
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRespond(offer.id, "declined")}
                        className="border-border hover:bg-destructive/10 active:scale-[0.97] transition-transform w-full sm:w-auto h-10 sm:h-9"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Decline
                      </Button>
                    </div>
                  )}

                  {/* Accepted: Contract button */}
                  {offer.status === "accepted" && booking && (
                    <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-border">
                      {isGenerating ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-1">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Generating contract...
                        </div>
                      ) : booking.contract_url ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="border-primary/30 text-primary hover:bg-primary/10 active:scale-[0.97] transition-transform w-full sm:w-auto h-10 sm:h-9"
                          >
                            <a href={booking.contract_url} target="_blank" rel="noopener noreferrer">
                              <FileText className="w-3.5 h-3.5 mr-1" /> View Contract
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            asChild
                            className="border-border text-muted-foreground hover:text-foreground active:scale-[0.97] transition-transform w-full sm:w-auto h-10 sm:h-9"
                          >
                            <a href={booking.contract_url} download>
                              <Download className="w-3.5 h-3.5 mr-1" /> Download
                            </a>
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border text-muted-foreground w-full sm:w-auto h-10 sm:h-9"
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
                          <FileText className="w-3.5 h-3.5 mr-1" /> Generate Contract
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
