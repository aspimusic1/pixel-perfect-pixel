import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { CalendarDays, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format, isSameDay, startOfToday } from "date-fns";
import FlashBidToggle from "@/components/FlashBidToggle";

type AvailabilityEntry = {
  id: string;
  date: string;
  is_available: boolean;
  notes: string | null;
  flash_bid_enabled: boolean;
  flash_bid_deadline: string | null;
  flash_bid_min_price: number;
};

export default function AvailabilityCalendar() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<AvailabilityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [bulkAction, setBulkAction] = useState<"available" | "unavailable" | null>(null);

  const reload = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("artist_availability")
      .select("id, date, is_available, notes, flash_bid_enabled, flash_bid_deadline, flash_bid_min_price" as any)
      .eq("artist_id", user.id)
      .gte("date", format(startOfToday(), "yyyy-MM-dd"))
      .order("date");
    setEntries((data as any as AvailabilityEntry[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    reload();
  }, [user]);

  const getEntry = (date: Date) =>
    entries.find((e) => isSameDay(new Date(e.date + "T00:00:00"), date));

  const toggleDate = async (date: Date, markAvailable: boolean) => {
    if (!user) return;
    setSaving(true);
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = getEntry(date);

    if (existing) {
      if (existing.is_available === markAvailable) {
        // Remove entry (toggle off)
        const { error } = await supabase
          .from("artist_availability")
          .delete()
          .eq("id", existing.id);
        if (error) { toast.error("Failed to update"); setSaving(false); return; }
        setEntries((prev) => prev.filter((e) => e.id !== existing.id));
      } else {
        // Flip availability
        const { error } = await supabase
          .from("artist_availability")
          .update({ is_available: markAvailable })
          .eq("id", existing.id);
        if (error) { toast.error("Failed to update"); setSaving(false); return; }
        setEntries((prev) =>
          prev.map((e) => (e.id === existing.id ? { ...e, is_available: markAvailable } : e))
        );
      }
    } else {
      // Insert new
      const { data, error } = await supabase
        .from("artist_availability")
        .insert({ artist_id: user.id, date: dateStr, is_available: markAvailable })
        .select("id, date, is_available, notes")
        .single();
      if (error) { toast.error("Failed to save"); setSaving(false); return; }
      setEntries((prev) => [...prev, data as AvailabilityEntry]);
    }
    setSaving(false);
  };

  const availableDates = entries.filter((e) => e.is_available).map((e) => new Date(e.date + "T00:00:00"));
  const unavailableDates = entries.filter((e) => !e.is_available).map((e) => new Date(e.date + "T00:00:00"));

  const selectedEntry = selectedDate ? getEntry(selectedDate) : null;

  return (
    <div className="rounded-xl bg-card border border-border p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold text-sm">Availability Calendar</h3>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < startOfToday()}
            className={cn("p-0 pointer-events-auto")}
            modifiers={{
              available: availableDates,
              unavailable: unavailableDates,
            }}
            modifiersClassNames={{
              available: "bg-green-500/20 text-green-400 font-semibold border border-green-500/30",
              unavailable: "bg-red-500/20 text-red-400 font-semibold border border-red-500/30",
            }}
          />

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/40 border border-green-500/50" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/50" />
              Unavailable
            </span>
          </div>

          {/* Actions for selected date */}
          {selectedDate && selectedDate >= startOfToday() && (
            <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
              <p className="text-xs text-muted-foreground mb-2">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
                {selectedEntry && (
                  <span className={cn(
                    "ml-2 font-medium",
                    selectedEntry.is_available ? "text-green-400" : "text-red-400"
                  )}>
                    — {selectedEntry.is_available ? "Available" : "Unavailable"}
                  </span>
                )}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={saving}
                  onClick={() => toggleDate(selectedDate, true)}
                  className={cn(
                    "h-8 text-xs active:scale-[0.97] transition-transform",
                    selectedEntry?.is_available
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : "border-border"
                  )}
                >
                  {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Check className="w-3 h-3 mr-1" />}
                  Available
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={saving}
                  onClick={() => toggleDate(selectedDate, false)}
                  className={cn(
                    "h-8 text-xs active:scale-[0.97] transition-transform",
                    selectedEntry && !selectedEntry.is_available
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "border-border"
                  )}
                >
                  {saving ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <X className="w-3 h-3 mr-1" />}
                  Unavailable
                </Button>
              </div>

              {/* Flash Bid toggle — only show for available dates */}
              {selectedEntry?.is_available && (
                <FlashBidToggle
                  availabilityId={selectedEntry.id}
                  date={selectedEntry.date}
                  flashBidEnabled={selectedEntry.flash_bid_enabled}
                  flashBidDeadline={selectedEntry.flash_bid_deadline}
                  flashBidMinPrice={selectedEntry.flash_bid_min_price}
                  onUpdate={reload}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
