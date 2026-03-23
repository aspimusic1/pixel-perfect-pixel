import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Calendar, DollarSign, GripVertical, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const COLUMNS = [
  { key: "pending", label: "Pending", color: "#FFB83E" },
  { key: "negotiating", label: "Negotiating", color: "#3EC8FF" },
  { key: "accepted", label: "Accepted", color: "#3EFFBE" },
  { key: "declined", label: "Declined", color: "#FF5C5C" },
  { key: "expired", label: "Expired", color: "#5A6478" },
] as const;

type ColumnKey = typeof COLUMNS[number]["key"];

interface OfferCard {
  id: string;
  status: string;
  guarantee: number;
  event_date: string;
  venue_name: string;
  recipient_id: string;
  recipient_name: string | null;
  recipient_avatar: string | null;
}

export default function Pipeline() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [offers, setOffers] = useState<OfferCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  // Redirect non-promoters
  useEffect(() => {
    if (profile && profile.role !== "promoter") {
      navigate("/dashboard");
    }
  }, [profile, navigate]);

  const fetchOffers = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    let query = supabase
      .from("offers")
      .select("id, status, guarantee, event_date, venue_name, recipient_id")
      .eq("sender_id", user.id)
      .order("event_date", { ascending: true });

    if (dateFilter) {
      query = query.eq("event_date", dateFilter);
    }

    const { data, error } = await query;
    if (error) {
      toast.error("Failed to load offers");
      setLoading(false);
      return;
    }

    // Fetch recipient profiles
    const recipientIds = [...new Set((data || []).map((o) => o.recipient_id))];
    let profileMap: Record<string, { display_name: string | null; avatar_url: string | null }> = {};

    if (recipientIds.length > 0) {
      const { data: profiles } = await supabase
        .from("public_profiles" as any)
        .select("user_id, display_name, avatar_url")
        .in("user_id", recipientIds);

      for (const p of (profiles as any[]) || []) {
        profileMap[p.user_id] = { display_name: p.display_name, avatar_url: p.avatar_url };
      }
    }

    setOffers(
      (data || []).map((o) => ({
        ...o,
        recipient_name: profileMap[o.recipient_id]?.display_name ?? null,
        recipient_avatar: profileMap[o.recipient_id]?.avatar_url ?? null,
      }))
    );
    setLoading(false);
  }, [user, dateFilter]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleDragStart = (id: string) => setDragItem(id);
  const handleDragEnd = () => { setDragItem(null); setDragOverCol(null); };

  const handleDrop = async (targetStatus: ColumnKey) => {
    setDragOverCol(null);
    if (!dragItem) return;

    const offer = offers.find((o) => o.id === dragItem);
    if (!offer || offer.status === targetStatus) {
      setDragItem(null);
      return;
    }

    // Senders can only move to: expired, negotiating (per RLS)
    const allowed: ColumnKey[] = ["expired", "negotiating"];
    if (!allowed.includes(targetStatus)) {
      toast.error(`You can't move offers to "${targetStatus}" — only the artist can accept or decline.`);
      setDragItem(null);
      return;
    }

    // Optimistic update
    setOffers((prev) => prev.map((o) => (o.id === dragItem ? { ...o, status: targetStatus } : o)));

    const { error } = await supabase
      .from("offers")
      .update({ status: targetStatus })
      .eq("id", dragItem);

    if (error) {
      toast.error("Failed to update offer status");
      fetchOffers(); // revert
    } else {
      toast.success(`Offer moved to ${targetStatus}`);
    }
    setDragItem(null);
  };

  const grouped = COLUMNS.reduce<Record<ColumnKey, OfferCard[]>>((acc, col) => {
    acc[col.key] = offers.filter((o) => o.status === col.key);
    return acc;
  }, {} as any);

  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h1 className="font-syne text-2xl font-bold text-[#F0F2F7]">Pipeline</h1>
            <p className="text-sm text-[#8892A4]">Track every offer from sent to confirmed.</p>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#5A6478]" />
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by date"
              className="w-44 bg-[#0E1420] border-white/[0.06] text-sm h-9"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="text-xs text-[#8892A4] hover:text-[#F0F2F7] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-[#C8FF3E]" />
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {COLUMNS.map((col) => {
              const cards = grouped[col.key];
              const total = cards.reduce((s, c) => s + Number(c.guarantee), 0);

              return (
                <div
                  key={col.key}
                  className={cn(
                    "flex-shrink-0 w-64 rounded-xl border border-white/[0.06] bg-[#0E1420] flex flex-col",
                    dragOverCol === col.key && "ring-1 ring-[#C8FF3E]/40"
                  )}
                  onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.key); }}
                  onDragLeave={() => setDragOverCol(null)}
                  onDrop={() => handleDrop(col.key)}
                >
                  {/* Column header */}
                  <div className="px-3 py-3 border-b border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#F0F2F7]">
                        {col.label}
                      </span>
                      <span className="text-[10px] text-[#5A6478] ml-0.5">{cards.length}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8892A4]">
                      ${total.toLocaleString()}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 p-2 space-y-2 min-h-[200px] overflow-y-auto max-h-[60vh]">
                    {cards.length === 0 ? (
                      <p className="text-[11px] text-[#5A6478] text-center py-8">No offers</p>
                    ) : (
                      cards.map((card) => (
                        <div
                          key={card.id}
                          draggable
                          onDragStart={() => handleDragStart(card.id)}
                          onDragEnd={handleDragEnd}
                          className={cn(
                            "rounded-lg bg-[#141B28] border border-white/[0.06] p-3 cursor-grab active:cursor-grabbing transition-all hover:border-white/[0.12] active:scale-[0.97]",
                            dragItem === card.id && "opacity-40"
                          )}
                        >
                          <div className="flex items-start gap-2.5">
                            <GripVertical className="w-3.5 h-3.5 text-[#5A6478] mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              {/* Artist row */}
                              <div className="flex items-center gap-2 mb-1.5">
                                {card.recipient_avatar ? (
                                  <img
                                    src={card.recipient_avatar}
                                    alt=""
                                    className="w-5 h-5 rounded-full object-cover"
                                    loading="lazy"
                                    width={20}
                                    height={20}
                                  />
                                ) : (
                                  <div className="w-5 h-5 rounded-full bg-[#1C2535] flex items-center justify-center text-[9px] font-bold text-[#8892A4]">
                                    {(card.recipient_name ?? "?")[0]?.toUpperCase()}
                                  </div>
                                )}
                                <span className="text-sm font-medium text-[#F0F2F7] truncate">
                                  {card.recipient_name ?? "Unknown"}
                                </span>
                              </div>

                              {/* Venue */}
                              <p className="text-[11px] text-[#8892A4] truncate mb-1.5">{card.venue_name}</p>

                              {/* Date + Guarantee */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-[11px] text-[#5A6478]">
                                  <Calendar className="w-3 h-3" />
                                  {format(parseISO(card.event_date), "MMM d")}
                                </div>
                                <div className="flex items-center gap-0.5 font-syne font-bold text-sm text-[#F0F2F7]">
                                  <DollarSign className="w-3 h-3 text-[#C8FF3E]" />
                                  {Number(card.guarantee).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
