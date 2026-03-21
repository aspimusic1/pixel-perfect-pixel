import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, DollarSign, TrendingUp, Download } from "lucide-react";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Expense = {
  id: string;
  amount: number;
  category: string;
  description: string;
  expense_date: string;
  booking_id: string | null;
};

type BookingIncome = {
  id: string;
  venue_name: string;
  event_date: string;
  guarantee: number;
};

const EXPENSE_CATEGORIES = [
  { value: "travel_flight", label: "Flights" },
  { value: "travel_ground", label: "Ground Transport" },
  { value: "lodging", label: "Hotels" },
  { value: "crew_fees", label: "Crew Fees" },
  { value: "equipment", label: "Equipment Rental" },
  { value: "meals", label: "Meals & Entertainment" },
  { value: "marketing", label: "Marketing" },
  { value: "insurance", label: "Insurance" },
  { value: "misc", label: "Other" },
];

export default function BookkeepingSection() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<BookingIncome[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [expRes, incRes] = await Promise.all([
        supabase.from("artist_expenses" as any).select("*").eq("user_id", user.id).order("expense_date", { ascending: false }).limit(100),
        supabase.from("bookings").select("id, venue_name, event_date, guarantee").eq("artist_id", user.id).eq("status", "confirmed").order("event_date", { ascending: false }).limit(100),
      ]);
      setExpenses((expRes.data as any[]) ?? []);
      setIncome((incRes.data as BookingIncome[]) ?? []);
      setLoading(false);
    };
    load();
  }, [user]);

  const addExpense = async () => {
    if (!user) return;
    const { data, error } = await supabase.from("artist_expenses" as any).insert({
      user_id: user.id,
      amount: 0,
      category: "misc",
      description: "",
      expense_date: new Date().toISOString().split("T")[0],
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setExpenses([data as any, ...expenses]);
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    await supabase.from("artist_expenses" as any).update(updates).eq("id", id);
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteExpense = async (id: string) => {
    await supabase.from("artist_expenses" as any).delete().eq("id", id);
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const totalIncome = income.reduce((s, b) => s + Number(b.guarantee), 0);
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const netProfit = totalIncome - totalExpenses;

  // Monthly P&L
  const monthlyData = new Map<string, { income: number; expenses: number }>();
  income.forEach((b) => {
    const month = new Date(b.event_date).toLocaleString("en", { month: "short", year: "2-digit" });
    const d = monthlyData.get(month) || { income: 0, expenses: 0 };
    d.income += Number(b.guarantee);
    monthlyData.set(month, d);
  });
  expenses.forEach((e) => {
    const month = new Date(e.expense_date).toLocaleString("en", { month: "short", year: "2-digit" });
    const d = monthlyData.get(month) || { income: 0, expenses: 0 };
    d.expenses += Number(e.amount);
    monthlyData.set(month, d);
  });
  const chartData = Array.from(monthlyData.entries()).map(([month, d]) => ({
    month,
    income: d.income,
    expenses: d.expenses,
    profit: d.income - d.expenses,
  })).reverse().slice(-6);

  // Insights
  const showProfits = income.map((b) => {
    const showExpenses = expenses.filter((e) => e.booking_id === b.id).reduce((s, e) => s + Number(e.amount), 0);
    return { venue: b.venue_name, date: b.event_date, profit: Number(b.guarantee) - showExpenses, guarantee: Number(b.guarantee) };
  });
  const mostProfitable = showProfits.length > 0 ? showProfits.sort((a, b) => b.profit - a.profit)[0] : null;
  const avgExpensePerShow = income.length > 0 ? Math.round(totalExpenses / income.length) : 0;
  const breakEvenGuarantee = avgExpensePerShow;

  if (loading) return <div className="h-48 rounded-xl bg-card animate-pulse" />;

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total Income</p>
          <p className="font-syne text-lg font-bold text-primary">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Total Expenses</p>
          <p className="font-syne text-lg font-bold text-[#FF5C5C]">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Net Profit</p>
          <p className={`font-syne text-lg font-bold ${netProfit >= 0 ? "text-[#3EFFBE]" : "text-[#FF5C5C]"}`}>${netProfit.toLocaleString()}</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Break-even</p>
          <p className="font-syne text-lg font-bold">${breakEvenGuarantee.toLocaleString()}</p>
        </div>
      </div>

      {/* Insights */}
      {mostProfitable && (
        <div className="rounded-xl bg-card border border-primary/20 p-4 flex items-center gap-3">
          <TrendingUp className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-xs font-medium">Most Profitable Show</p>
            <p className="text-xs text-muted-foreground">
              {mostProfitable.venue} — ${mostProfitable.profit.toLocaleString()} profit on ${mostProfitable.guarantee.toLocaleString()} guarantee
            </p>
          </div>
        </div>
      )}

      {/* Monthly P&L Chart */}
      {chartData.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-5">
          <h3 className="font-syne font-semibold text-sm mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-primary" /> Monthly P&L
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="income" fill="#C8FF3E" fillOpacity={0.7} radius={[3, 3, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#FF5C5C" fillOpacity={0.7} radius={[3, 3, 0, 0]} name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Expenses List */}
      <div className="rounded-xl bg-card border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-syne font-semibold text-sm">Expenses</h3>
          <Button size="sm" onClick={addExpense} className="bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.97] transition-transform">
            <Plus className="w-3.5 h-3.5 mr-1" /> Add Expense
          </Button>
        </div>
        {expenses.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No expenses recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {expenses.slice(0, 20).map((exp) => (
              <div key={exp.id} className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
                <div>
                  <Label className="text-[10px] text-muted-foreground">Category</Label>
                  <select
                    value={exp.category}
                    onChange={(e) => updateExpense(exp.id, { category: e.target.value })}
                    className="mt-0.5 h-8 w-full rounded-md border border-border bg-background px-2 text-xs text-foreground"
                  >
                    {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-[10px] text-muted-foreground">Description</Label>
                  <Input value={exp.description} onChange={(e) => updateExpense(exp.id, { description: e.target.value })} className="mt-0.5 h-8 text-xs bg-background border-border" placeholder="What was this for?" maxLength={200} />
                </div>
                <div>
                  <Label className="text-[10px] text-muted-foreground">Amount</Label>
                  <Input type="number" min="0" value={exp.amount} onChange={(e) => updateExpense(exp.id, { amount: parseFloat(e.target.value) || 0 })} className="mt-0.5 h-8 text-xs bg-background border-border" />
                </div>
                <div className="flex gap-1 items-end">
                  <div className="flex-1">
                    <Label className="text-[10px] text-muted-foreground">Date</Label>
                    <Input type="date" value={exp.expense_date} onChange={(e) => updateExpense(exp.id, { expense_date: e.target.value })} className="mt-0.5 h-8 text-xs bg-background border-border" />
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteExpense(exp.id)} className="text-muted-foreground hover:text-destructive h-8">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
