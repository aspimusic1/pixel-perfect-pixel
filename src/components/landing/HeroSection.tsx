import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Music } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 px-4 overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary/[0.07] blur-[120px] pointer-events-none" />

      <div className="container mx-auto max-w-3xl text-center relative">
        <div className="animate-reveal-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur-sm mb-8">
          <Music className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground font-body">
            the live music operating system
          </span>
        </div>

        <h1
          className="animate-reveal-up font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.92] mb-6 lowercase"
          style={{ animationDelay: "80ms", lineHeight: "0.95" }}
        >
          book shows.{" "}
          <span className="text-gradient-primary">get paid.</span>
          <br />
          grow your career.
        </h1>

        <p
          className="animate-reveal-up text-base sm:text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed font-body"
          style={{ animationDelay: "160ms" }}
        >
          the all-in-one platform for artists, promoters, venues, and crew — from first offer to final payout.
        </p>

        <div className="animate-reveal-up flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: "240ms" }}>
          <Link to="/auth?tab=signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-sm px-8 h-12 active:scale-[0.97] transition-transform lowercase">
              start free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link to="/directory">
            <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary font-display font-medium text-sm px-8 h-12 active:scale-[0.97] transition-transform lowercase">
              browse directory
            </Button>
          </Link>
        </div>

        {/* Social proof numbers */}
        <div
          className="animate-reveal-up mt-14 flex justify-center gap-8 sm:gap-14"
          style={{ animationDelay: "340ms" }}
        >
          {[
            { value: "2,400+", label: "artists" },
            { value: "18,000+", label: "bookings" },
            { value: "$4.2M", label: "paid out" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display font-bold text-xl sm:text-2xl text-foreground tabular-nums">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground font-body tracking-wide uppercase mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
