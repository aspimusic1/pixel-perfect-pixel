import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Music2 } from "lucide-react";

interface TickerItem {
  text: string;
}

const FALLBACK_ITEMS: TickerItem[] = [
  { text: "🎵 DJ Koda booked in Miami, FL — $2,500" },
  { text: "🎵 The Velvet Union booked in Brooklyn, NY — $1,800" },
  { text: "🎵 Maya Chen booked in Los Angeles, CA — $3,200" },
  { text: "🎵 Arlo Washington booked in Chicago, IL — $2,100" },
  { text: "🎵 Prism Events booked in Atlanta, GA — $4,000" },
  { text: "🎵 SoundCraft Audio booked in Nashville, TN — $1,500" },
  { text: "🎵 NightOwl Presents booked in Denver, CO — $2,800" },
  { text: "🎵 The Monarch booked in Austin, TX — $3,500" },
];

export default function ActivityTicker() {
  const [items, setItems] = useState<TickerItem[]>(FALLBACK_ITEMS);

  useEffect(() => {
    async function fetchRecent() {
      const { data, error } = await supabase
        .from("bookings")
        .select("venue_name, guarantee, event_date")
        .order("created_at", { ascending: false })
        .limit(8);

      if (error || !data || data.length === 0) return;

      const mapped = data.map((b: any) => ({
        text: `🎵 ${b.venue_name} booked — $${Number(b.guarantee).toLocaleString()}`,
      }));
      setItems(mapped);
    }
    fetchRecent();
  }, []);

  // Double items for seamless loop
  const doubled = [...items, ...items];

  return (
    <section className="py-6 overflow-hidden border-y border-border">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div
          className="flex animate-marquee hover:[animation-play-state:paused]"
          style={{ width: "max-content" }}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-6 flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Music2 className="w-3.5 h-3.5 text-primary/60" />
              <span className="whitespace-nowrap font-body">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
