import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Music, Zap, Shield, DollarSign, Users, Calendar, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const ROLES = [
  { label: "Artists", color: "bg-role-artist text-primary-foreground", desc: "Manage offers, build your touring profile, and get discovered." },
  { label: "Promoters", color: "bg-role-promoter text-primary-foreground", desc: "Find talent, send offers, and track your event roster." },
  { label: "Venues", color: "bg-role-venue text-primary-foreground", desc: "List your space, receive booking requests, and fill your calendar." },
  { label: "Production", color: "bg-role-production text-primary-foreground", desc: "Connect with events that need sound, lighting, and staging." },
  { label: "Photo/Video", color: "bg-role-photo text-primary-foreground", desc: "Get hired for live coverage and build your portfolio." },
];

const FEATURES = [
  { icon: Zap, title: "Instant Offer Flow", desc: "6-step guided offers with live commission calculator. No more email chains." },
  { icon: Shield, title: "Deal Rooms", desc: "Private negotiation spaces for each offer. Counter, accept, or decline with full context." },
  { icon: DollarSign, title: "Commission Transparency", desc: "See exactly what you pay and earn. Flat-rate or percentage — always visible." },
  { icon: Users, title: "Unified Directory", desc: "Discover artists, venues, crew, and photographers — all in one searchable hub." },
  { icon: Calendar, title: "Tour Management", desc: "Itineraries, crew manifests, budgets, and documents for every run of dates." },
  { icon: Music, title: "Real-time Notifications", desc: "Know the moment an offer lands, gets accepted, or needs your attention." },
];

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("animate-reveal-up");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    const children = el.querySelectorAll("[data-reveal]");
    children.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Landing() {
  const revealRef = useScrollReveal();

  return (
    <div ref={revealRef} className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="container mx-auto max-w-4xl text-center relative">
          <div className="animate-reveal-up">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wide uppercase rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
              The live music booking platform
            </span>
          </div>
          <h1 className="animate-reveal-up font-display text-5xl sm:text-7xl font-bold tracking-tight leading-[0.95] mb-6" style={{ animationDelay: "80ms" }}>
            Book shows,<br />
            <span className="text-gradient-primary">not headaches.</span>
          </h1>
          <p className="animate-reveal-up text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: "160ms" }}>
            GetBooked.Live connects artists, promoters, venues, and crew on one platform — from first offer to final settlement.
          </p>
          <div className="animate-reveal-up flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: "240ms" }}>
            <Link to="/auth?tab=signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-base px-8 h-12 active:scale-[0.97] transition-transform">
                Create your profile <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/directory">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary font-display font-medium text-base px-8 h-12 active:scale-[0.97] transition-transform">
                Browse directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 data-reveal className="font-display text-3xl sm:text-4xl font-bold text-center mb-4 opacity-0">Built for every role in live music</h2>
          <p data-reveal className="text-muted-foreground text-center mb-16 max-w-lg mx-auto opacity-0">One platform, five roles. Everyone gets the tools they need.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROLES.map((role, i) => (
              <div
                key={role.label}
                data-reveal
                className="opacity-0 rounded-xl p-6 bg-card border border-border hover:border-border/80 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 active:scale-[0.98]"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md mb-3 ${role.color}`}>{role.label}</span>
                <p className="text-sm text-muted-foreground leading-relaxed">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 bg-card/40">
        <div className="container mx-auto max-w-5xl">
          <h2 data-reveal className="font-display text-3xl sm:text-4xl font-bold text-center mb-4 opacity-0">Everything you need to book confidently</h2>
          <p data-reveal className="text-muted-foreground text-center mb-16 max-w-lg mx-auto opacity-0">No more spreadsheets, DM threads, or mystery fees.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                data-reveal
                className="opacity-0 group rounded-xl p-6 bg-card border border-border hover:border-primary/30 transition-all duration-300"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div data-reveal className="opacity-0 container mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Ready to streamline your bookings?</h2>
          <p className="text-muted-foreground mb-8">Join the platform built by and for the live music industry.</p>
          <Link to="/auth?tab=signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-base px-10 h-12 active:scale-[0.97] transition-transform">
              Get started free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-display font-bold text-foreground">
            <Music className="w-4 h-4 text-primary" />
            GetBooked.Live
          </div>
          <p>© {new Date().getFullYear()} GetBooked.Live. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
