import { Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";

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

export default function HeroSection() {
  return (
    <section className="relative pt-24 sm:pt-40 pb-16 sm:pb-28 px-4 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/[0.04] blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-3xl text-center relative">
        {/* Label tag */}
        <div className="animate-reveal-up">
          <span className="section-label">all-in-one music booking platform</span>
        </div>

        {/* Headline */}
        <h1
          className="animate-reveal-up font-display font-extrabold tracking-[-0.03em] text-foreground mb-5 lowercase text-3xl sm:text-5xl md:text-6xl"
          style={{ animationDelay: "80ms", lineHeight: "1.05" }}
        >
          book shows. get paid.
          <br />
          grow your career.
        </h1>

        {/* Subtext */}
        <p
          className="animate-reveal-up section-subtext mx-auto mb-10"
          style={{ animationDelay: "140ms" }}
        >
          the all-in-one platform for artists, promoters, venues, and crew — from first offer to final payout.
        </p>

        {/* CTA buttons */}
        <div className="animate-reveal-up flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: "200ms" }}>
          <Link to="/auth?tab=signup">
            <button className="bg-primary text-primary-foreground font-display font-bold text-sm rounded-[10px] px-8 h-12 hover:bg-primary/90 active:scale-[0.96] transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
              start free <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link to="/directory">
            <button className="border border-white/[0.1] text-foreground font-display font-medium text-sm rounded-[10px] px-8 h-12 hover:bg-secondary hover:border-white/[0.15] active:scale-[0.96] transition-all w-full sm:w-auto">
              browse directory
            </button>
          </Link>
        </div>

        {/* Product screenshot mockup */}
        <div
          className="animate-reveal-up mt-14 sm:mt-20 max-w-2xl mx-auto"
          style={{ animationDelay: "320ms" }}
        >
          <MockupWindow />
        </div>

        {/* Social proof */}
        <div
          className="animate-reveal-up mt-14 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:flex sm:justify-center sm:gap-14"
          style={{ animationDelay: "440ms" }}
        >
          {[
            { value: "2,400+", label: "artists" },
            { value: "920+", label: "promoters" },
            { value: "840+", label: "venues" },
            { value: "380+", label: "production crews" },
            { value: "640+", label: "creatives" },
            { value: "12K+", label: "shows booked" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display font-bold text-xl sm:text-2xl text-foreground tabular-nums">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground font-body tracking-wide uppercase mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
