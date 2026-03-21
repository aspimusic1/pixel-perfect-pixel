import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Inbox, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import OnboardingChecklist from "@/components/OnboardingChecklist";

type Offer = {
  id: string;
  venue_name: string;
  event_date: string;
  guarantee: number;
  commission_amount: number | null;
  status: string;
  sender_id: string;
  created_at: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  accepted: "bg-green-500/10 text-green-400 border-green-500/20",
  declined: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function ArtistDashboard() {
  const { user, profile } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("offers")
        .select("*")
        .eq("recipient_id", user.id)
        .order("created_at", { ascending: false });
      setOffers((data as Offer[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleRespond = async (offerId: string, status: "accepted" | "declined") => {
    const { error } = await supabase.from("offers").update({ status }).eq("id", offerId);
    if (error) { toast.error(error.message); return; }
    setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, status } : o)));
    toast.success(`Offer ${status}`);
  };

  const pendingCount = offers.filter((o) => o.status === "pending").length;
  const totalGuarantee = offers.filter((o) => o.status === "accepted").reduce((s, o) => s + o.guarantee, 0);

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="container mx-auto max-w-4xl">
        <h1 className="font-display text-2xl font-bold mb-1">Welcome back, {profile?.display_name ?? "Artist"}</h1>
        <p className="text-muted-foreground text-sm mb-8">Here's your booking overview.</p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2"><Inbox className="w-3.5 h-3.5" /> Pending Offers</div>
            <p className="font-display text-2xl font-bold">{pendingCount}</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2"><DollarSign className="w-3.5 h-3.5" /> Confirmed Revenue</div>
            <p className="font-display text-2xl font-bold">${totalGuarantee.toLocaleString()}</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2"><Calendar className="w-3.5 h-3.5" /> Total Offers</div>
            <p className="font-display text-2xl font-bold">{offers.length}</p>
          </div>
        </div>

        {/* Offers */}
        <h2 className="font-display text-lg font-semibold mb-4">Your Offers</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />)}
          </div>
        ) : offers.length === 0 ? (
          <div className="rounded-xl bg-card border border-border p-8 text-center">
            <p className="text-muted-foreground mb-2">No offers yet</p>
            <p className="text-sm text-muted-foreground">When promoters send you offers, they'll appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => (
              <div key={offer.id} className="rounded-xl bg-card border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display font-semibold">{offer.venue_name}</span>
                    <Badge variant="outline" className={statusColors[offer.status] ?? ""}>{offer.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(offer.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {" · "}${offer.guarantee.toLocaleString()} guarantee
                  </p>
                </div>
                {offer.status === "pending" && (
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleRespond(offer.id, "accepted")} className="bg-green-600 hover:bg-green-700 text-foreground active:scale-[0.97] transition-transform">
                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleRespond(offer.id, "declined")} className="border-border hover:bg-destructive/10 active:scale-[0.97] transition-transform">
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
