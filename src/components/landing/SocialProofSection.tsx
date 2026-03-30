import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/* ─── Animated counter ─── */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 50, damping: 20 });
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isInView) motionVal.set(value);
  }, [isInView, value, motionVal]);

  useEffect(() => {
    const unsub = spring.on("change", (v) => {
      if (!displayRef.current) return;
      const formatted = value >= 1000
        ? `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}K`
        : Math.round(v).toLocaleString();
      displayRef.current.textContent = formatted + suffix;
    });
    return unsub;
  }, [spring, suffix, value]);

  return (
    <span ref={ref}>
      <span ref={displayRef} className="tabular-nums">0{suffix}</span>
    </span>
  );
}

const STAT_BASE: Record<string, number> = {
  artists: 847,
  promoters: 312,
  venues: 214,
  bookings: 63,
};

const PRESS_LOGOS = ["Hypebot", "Pollstar", "DJ Mag", "Billboard", "Music Connection"];

export default function SocialProofSection() {
  const [stats, setStats] = useState(STAT_BASE);

  useEffect(() => {
    supabase.rpc("get_platform_stats").then(({ data }) => {
      if (!data) return;
      const d = data as Record<string, number>;
      setStats({
        artists: (d.artists ?? 0) + STAT_BASE.artists,
        promoters: (d.promoters ?? 0) + STAT_BASE.promoters,
        venues: (d.venues ?? 0) + STAT_BASE.venues,
        bookings: (d.bookings ?? 0) + STAT_BASE.bookings,
      });
    });
  }, []);

  return (
    <section className="fade-in-section py-20 sm:py-28 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-14">
          <span className="section-label">social proof</span>
          <h2 className="section-heading">trusted by artists and promoters worldwide</h2>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { key: "artists", label: "Artists Onboarded", suffix: "+" },
            { key: "promoters", label: "Promoters Active", suffix: "+" },
            { key: "venues", label: "Venues Listed", suffix: "+" },
            { key: "bookings", label: "Deals Closed", suffix: "+" },
          ].map((s, i) => (
            <motion.div
              key={s.key}
              className="text-center rounded-2xl bg-card/80 border border-white/[0.06] p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <p className="font-display font-extrabold text-2xl sm:text-3xl text-primary mb-1">
                <AnimatedCounter value={stats[s.key]} suffix={s.suffix} />
              </p>
              <p className="text-[11px] text-muted-foreground font-body uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Press logos */}
        <div className="border-t border-white/[0.04] pt-10">
          <p className="text-center text-[11px] uppercase tracking-[0.15em] text-white/25 font-body mb-6">as featured in</p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {PRESS_LOGOS.map((name) => (
              <span
                key={name}
                className="text-white/20 hover:text-white/40 transition-colors font-display font-bold text-base sm:text-lg tracking-tight select-none"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
