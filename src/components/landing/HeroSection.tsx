import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-36 pb-28 px-4 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/[0.06] blur-[150px] pointer-events-none" />
      <div className="absolute top-[100px] right-[10%] w-[300px] h-[300px] rounded-full bg-role-promoter/[0.04] blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-4xl text-center relative">
        <div
          className="animate-reveal-up inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.06] mb-10"
        >
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] tracking-[0.15em] uppercase text-primary font-display font-medium">
            the live music operating system
          </span>
        </div>

        <h1
          className="animate-reveal-up font-display text-5xl sm:text-7xl lg:text-8xl font-bold tracking-[-0.03em] mb-7 lowercase"
          style={{ animationDelay: "80ms", lineHeight: "0.92" }}
        >
          book shows.{" "}
          <span className="text-gradient-primary">get paid.</span>
          <br />
          grow your career.
        </h1>

        <p
          className="animate-reveal-up text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed font-body"
          style={{ animationDelay: "160ms" }}
        >
          the all-in-one platform for artists, promoters, venues, and crew — from first offer to final payout.
        </p>

        <div className="animate-reveal-up flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: "240ms" }}>
          <Link to="/auth?tab=signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-sm px-10 h-13 active:scale-[0.96] transition-transform lowercase shadow-[0_0_40px_-8px_hsl(var(--primary)/0.4)]">
              start free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link to="/directory">
            <Button size="lg" variant="outline" className="border-border hover:border-primary/30 text-foreground hover:bg-secondary font-display font-medium text-sm px-10 h-13 active:scale-[0.96] transition-transform lowercase">
              browse directory
            </Button>
          </Link>
        </div>

        {/* Social proof */}
        <div
          className="animate-reveal-up mt-16 flex justify-center gap-10 sm:gap-16"
          style={{ animationDelay: "360ms" }}
        >
          {[
            { value: "2,400+", label: "artists" },
            { value: "18,000+", label: "bookings" },
            { value: "$4.2M", label: "paid out" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display font-bold text-2xl sm:text-3xl text-foreground tabular-nums">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground font-body tracking-wide uppercase mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
