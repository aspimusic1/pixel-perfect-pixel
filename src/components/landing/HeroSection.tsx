import { Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import { motion, useMotionValue, useSpring, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

function MockupWindow() {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-card shadow-[0_32px_80px_hsl(var(--primary)/0.1),0_0_0_1px_hsl(var(--primary)/0.05)]">
      {/* macOS chrome bar */}
      <div className="h-8 bg-secondary flex items-center px-3 gap-2 border-b border-white/[0.06]">
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="ml-3 text-[11px] text-muted-foreground font-body">getbooked.live/dashboard</span>
      </div>

      {/* Mini dashboard UI */}
      <div className="p-5 sm:p-6 space-y-4">
        {/* Metric cards row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "offers", value: "8", color: "text-primary" },
            { label: "bookings", value: "3", color: "text-role-venue" },
            { label: "earnings", value: "$4.2k", color: "text-foreground" },
          ].map((m) => (
            <div key={m.label} className="rounded-xl bg-secondary/60 border border-white/[0.06] p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs text-muted-foreground font-body uppercase tracking-wider">{m.label}</p>
              <p className={`text-lg sm:text-2xl font-display font-bold ${m.color} mt-1 tabular-nums`}>{m.value}</p>
            </div>
          ))}
        </div>

        {/* Offer card */}
        <div className="rounded-xl bg-secondary/40 border border-white/[0.06] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground font-body">new offer · house of blues, chicago</p>
              <p className="text-sm font-display font-bold text-foreground mt-1">$2,500 guarantee · dec 14</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button className="h-8 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-display font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> accept
              </button>
              <button className="h-8 px-3 rounded-lg border border-white/[0.1] text-muted-foreground text-xs font-display flex items-center gap-1">
                <X className="w-3 h-3" /> decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Animated stat counter ─── */
function AnimatedStat({ value, label }: { value: string; label: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  // Parse numeric part
  const numericMatch = value.match(/^[\d,.]+/);
  const numericStr = numericMatch ? numericMatch[0] : "";
  const suffix = value.slice(numericStr.length);
  const target = parseFloat(numericStr.replace(/,/g, "")) || 0;
  const isDecimal = numericStr.includes(".");
  const hasK = suffix.startsWith("K") || suffix.startsWith("k");

  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (isInView) motionVal.set(target);
  }, [isInView, target, motionVal]);

  const displayRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      if (!displayRef.current) return;
      const rounded = isDecimal ? v.toFixed(1) : Math.round(v);
      const formatted = Number(rounded).toLocaleString();
      displayRef.current.textContent = formatted + suffix;
    });
    return unsubscribe;
  }, [spring, suffix, isDecimal]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display font-bold text-xl sm:text-2xl text-foreground tabular-nums">
        <span ref={displayRef}>0{suffix}</span>
      </p>
      <p className="text-[11px] text-muted-foreground font-body tracking-wide uppercase mt-1">{label}</p>
    </div>
  );
}

/* ─── Hero word animation ─── */
const HERO_LINE_1 = "book shows. get paid.";
const HERO_LINE_2 = "grow your career.";

function AnimatedHeadline() {
  const words1 = HERO_LINE_1.split(" ");
  const words2 = HERO_LINE_2.split(" ");

  return (
    <h1
      className="font-display font-extrabold tracking-[-0.03em] text-foreground mb-5 lowercase text-3xl sm:text-5xl md:text-6xl"
      style={{ lineHeight: "1.05" }}
    >
      {words1.map((word, i) => {
        const w = word.replace(/[^a-z]/gi, '').toLowerCase();
        const highlight = w === 'get' || w === 'paid';
        return (
          <motion.span
            key={`l1-${i}`}
            className={`inline-block mr-[0.25em]${highlight ? ' text-primary' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
          >
            {word}
          </motion.span>
        );
      })}
      <br />
      {words2.map((word, i) => (
        <motion.span
          key={`l2-${i}`}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (words1.length + i) * 0.08, duration: 0.5, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}

export default function HeroSection() {
  return (
    <section className="relative pt-24 sm:pt-40 pb-16 sm:pb-28 px-4 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/[0.04] blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-3xl text-center relative">
        {/* Label tag */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <span className="section-label">all-in-one music booking platform</span>
        </motion.div>

        {/* Headline */}
        <AnimatedHeadline />

        {/* Subtext */}
        <motion.p
          className="section-subtext mx-auto mb-10"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
        >
          the all-in-one platform for artists, promoters, venues, and crew — from first offer to final payout.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
        >
          <Link to="/auth?tab=signup">
            <motion.button
              className="bg-primary text-primary-foreground font-display font-bold text-sm rounded-[10px] px-8 h-12 hover:bg-primary/90 active:scale-[0.96] transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              start free <motion.span whileHover={{ x: 4 }}><ArrowRight className="w-4 h-4" /></motion.span>
            </motion.button>
          </Link>
          <Link to="/directory">
            <motion.button
              className="border border-white/[0.1] text-foreground font-display font-medium text-sm rounded-[10px] px-8 h-12 hover:bg-secondary hover:border-white/[0.15] active:scale-[0.96] transition-all w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              browse directory
            </motion.button>
          </Link>
        </motion.div>

        {/* Product screenshot mockup */}
        <motion.div
          className="mt-14 sm:mt-20 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <MockupWindow />
        </motion.div>

        {/* Social proof — animated counters */}
        <div className="mt-14 grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-8">
          {[
            { value: "2,400+", label: "artists" },
            { value: "920+", label: "promoters" },
            { value: "840+", label: "venues" },
            { value: "380+", label: "production crews" },
            { value: "640+", label: "creatives" },
            { value: "12K+", label: "shows booked" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.06, duration: 0.4, ease: "easeOut" }}
            >
              <AnimatedStat value={stat.value} label={stat.label} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
