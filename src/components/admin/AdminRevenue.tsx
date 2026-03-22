import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function AdminRevenue() {
  const { data: subscriptionRevenue } = useQuery({
    queryKey: ["admin-sub-revenue"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("subscription_plan");
      let mrr = 0;
      data?.forEach(p => {
        if (p.subscription_plan === "pro") mrr += 29;
        if (p.subscription_plan === "agency") mrr += 99;
      });
      return mrr;
    },
    staleTime: 30_000,
  });

  const { data: commissionRevenue } = useQuery({
    queryKey: ["admin-commission-revenue"],
    queryFn: async () => {
      const { data } = await supabase.from("offers").select("commission_amount, created_at").not("commission_amount", "is", null);
      return data ?? [];
    },
    staleTime: 30_000,
  });

  const { data: topBookings } = useQuery({
    queryKey: ["admin-top-bookings"],
    queryFn: async () => {
      const { data } = await supabase.from("bookings").select("*").order("guarantee", { ascending: false }).limit(10);
      return data ?? [];
    },
    staleTime: 30_000,
  });

  const { data: profiles } = useQuery({
    queryKey: ["admin-profiles-map"],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("user_id, display_name");
      const map: Record<string, string> = {};
      data?.forEach(p => { map[p.user_id] = p.display_name || "unnamed"; });
      return map;
    },
    staleTime: 60_000,
  });

  const totalCommission = commissionRevenue?.reduce((sum, o) => sum + Number(o.commission_amount || 0), 0) ?? 0;

  // Monthly chart data
  const monthlyData = (() => {
    const months: Record<string, number> = {};
    commissionRevenue?.forEach(o => {
      const key = new Date(o.created_at).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      months[key] = (months[key] || 0) + Number(o.commission_amount || 0);
    });
    return Object.entries(months).map(([month, amount]) => ({ month, amount })).slice(-12);
  })();

  const getName = (id: string) => profiles?.[id] ?? "—";

  return (
    <div>
      <h1 className="font-syne font-bold text-xl text-[#F0F2F7] mb-6 lowercase">revenue</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0E1420] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-[#7B5CF0]" />
            <span className="text-[11px] text-[#5A6478] font-display lowercase">subscription mrr</span>
          </div>
          <p className="text-2xl font-syne font-bold text-[#F0F2F7]">${(subscriptionRevenue ?? 0).toLocaleString()}</p>
        </div>
        <div className="bg-[#0E1420] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-[#C8FF3E]" />
            <span className="text-[11px] text-[#5A6478] font-display lowercase">booking commissions</span>
          </div>
          <p className="text-2xl font-syne font-bold text-[#F0F2F7]">${totalCommission.toLocaleString()}</p>
        </div>
        <div className="bg-[#0E1420] border border-white/[0.06] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#3EFFBE]" />
            <span className="text-[11px] text-[#5A6478] font-display lowercase">total revenue</span>
          </div>
          <p className="text-2xl font-syne font-bold text-[#F0F2F7]">${((subscriptionRevenue ?? 0) + totalCommission).toLocaleString()}</p>
        </div>
      </div>

      {/* Monthly chart */}
      {monthlyData.length > 0 && (
        <div className="bg-[#0E1420] border border-white/[0.06] rounded-xl p-5 mb-8">
          <h2 className="font-syne font-semibold text-sm text-[#F0F2F7] mb-4 lowercase">monthly commission revenue</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fill: "#5A6478", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#5A6478", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip
                contentStyle={{ background: "#141B28", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: "#8892A4" }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, "commission"]}
              />
              <Bar dataKey="amount" fill="#C8FF3E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top bookings */}
      <div className="bg-[#0E1420] border border-white/[0.06] rounded-xl p-5">
        <h2 className="font-syne font-semibold text-sm text-[#F0F2F7] mb-4 lowercase">top 10 highest-value bookings</h2>
        <div className="space-y-2">
          {topBookings?.map((b, i) => (
            <div key={b.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#5A6478] w-5 text-right font-syne">{i + 1}</span>
                <div>
                  <p className="text-xs text-[#F0F2F7] font-medium">{b.venue_name}</p>
                  <p className="text-[10px] text-[#5A6478]">{getName(b.artist_id)} × {getName(b.promoter_id)}</p>
                </div>
              </div>
              <span className="text-sm font-syne font-bold text-[#C8FF3E]">${Number(b.guarantee).toLocaleString()}</span>
            </div>
          ))}
          {(!topBookings || topBookings.length === 0) && (
            <p className="text-xs text-[#5A6478] text-center py-4">no bookings yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
