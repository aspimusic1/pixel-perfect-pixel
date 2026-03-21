import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, Users, Plus } from "lucide-react";

type Offer = {
  id: string;
  venue_name: string;
  event_date: string;
  guarantee: number;
  status: string;
  recipient_id: string;
  created_at: string;
};

export default function PromoterDashboard() {
  const { user, profile } = useAuth();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("offers")
        .select("*")
        .eq("sender_id", user.id)
        .order("created_at", { ascending: false });
      setOffers((data as Offer[]) ?? []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold mb-1">Welcome back, {profile?.display_name ?? "Promoter"}</h1>
            <p className="text-muted-foreground text-sm">Manage your offers and discover talent.</p>
          </div>
          <Link to="/directory">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium active:scale-[0.97] transition-transform">
              <Plus className="w-4 h-4 mr-1" /> Find Artists
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2"><Send className="w-3.5 h-3.5" /> Offers Sent</div>
            <p className="font-display text-2xl font-bold">{offers.length}</p>
          </div>
          <div className="rounded-xl bg-card border border-border p-5">
            <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium mb-2"><Users className="w-3.5 h-3.5" /> Accepted</div>
            <p className="font-display text-2xl font-bold">{offers.filter((o) => o.status === "accepted").length}</p>
          </div>
        </div>

        <h2 className="font-display text-lg font-semibold mb-4">Your Offers</h2>
        {loading ? (
          <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />)}</div>
        ) : offers.length === 0 ? (
          <div className="rounded-xl bg-card border border-border p-8 text-center">
            <p className="text-muted-foreground mb-2">No offers sent yet</p>
            <Link to="/directory"><Button variant="outline" className="border-border">Browse the directory</Button></Link>
          </div>
        ) : (
          <div className="space-y-3">
            {offers.map((offer) => (
              <div key={offer.id} className="rounded-xl bg-card border border-border p-5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-semibold">{offer.venue_name}</span>
                  <Badge variant="outline">{offer.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(offer.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · ${offer.guarantee.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
