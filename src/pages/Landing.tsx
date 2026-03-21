import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Music, Zap, Shield, DollarSign, Users, Calendar, ArrowRight,
  Send, FileText, CreditCard, MapPin, MessageCircle, Star,
  Mic2, Building2, Camera, Wrench, ChevronRight
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ─── Sample profiles for the marquee ─── */
const SAMPLE_PROFILES = [
  { name: "Maya Chen", role: "artist", genre: "R&B / Neo-Soul", city: "Los Angeles, CA", rating: 4.9 },
  { name: "DJ Koda", role: "artist", genre: "Electronic", city: "Miami, FL", rating: 4.8 },
  { name: "The Velvet Union", role: "artist", genre: "Indie Rock", city: "Brooklyn, NY", rating: 4.7 },
  { name: "Prism Events", role: "promoter", genre: "EDM / Hip-Hop", city: "Atlanta, GA", rating: 4.9 },
  { name: "The Monarch", role: "venue", genre: "Capacity: 800", city: "Austin, TX", rating: 4.6 },
  { name: "SoundCraft Audio", role: "production", genre: "Full Production", city: "Nashville, TN", rating: 5.0 },
  { name: "Lens & Light Co", role: "photo_video", genre: "Live + Promo", city: "Portland, OR", rating: 4.8 },
  { name: "Arlo Washington", role: "artist", genre: "Jazz / Funk", city: "Chicago, IL", rating: 4.7 },
  { name: "NightOwl Presents", role: "promoter", genre: "Club / Festival", city: "Denver, CO", rating: 4.5 },
  { name: "The Glass House", role: "venue", genre: "Capacity: 1,200", city: "Phoenix, AZ", rating: 4.8 },
];

const roleColor: Record<string, string> = {
  artist: "bg-role-artist/15 text-role-artist",
  promoter: "bg-role-promoter/15 text-role-promoter",
  venue: "bg-role-venue/15 text-role-venue",
  production: "bg-role-production/15 text-role-production",
  photo_video: "bg-role-photo/15 text-role-photo",
};

const roleLabel: Record<string, string> = {
  artist: "artist",
  promoter: "promoter",
  venue: "venue",
  production: "production",
  photo_video: "photo/video",
};

/* ─── Role switcher ─── */
const ROLE_TABS = [
  { key: "artist", label: "artists", icon: Mic2 },
  { key: "promoter", label: "promoters", icon: Users },
  { key: "venue", label: "venues", icon: Building2 },
  { key: "production", label: "production", icon: Wrench },
  { key: "photo_video", label: "photo & video", icon: Camera },
];

const ROLE_DETAILS: Record<string, { headline: string; points: string[] }> = {
  artist: {
    headline: "manage your bookings, build your brand, and get discovered.",
    points: ["receive & negotiate offers in one place", "auto-calculate commissions & net pay", "build a shareable EPK profile", "track your tour schedule"],
  },
  promoter: {
    headline: "find talent, send offers, and manage your events.",
    points: ["browse a curated artist directory", "send structured offers with one click", "track responses & confirmations", "manage multi-show rosters"],
  },
  venue: {
    headline: "list your space, fill your calendar, and grow revenue.",
    points: ["showcase capacity, amenities & rates", "receive booking requests directly", "manage availability & holds", "connect with local promoters"],
  },
  production: {
    headline: "connect with events that need your expertise.",
    points: ["list your services & crew size", "get hired for sound, lighting & staging", "manage tour assignments", "build your reputation with reviews"],
  },
  photo_video: {
    headline: "get booked for live coverage and grow your portfolio.",
    points: ["showcase your work & style", "set your rate & availability", "get discovered by promoters", "build reviews from real events"],
  },
};

/* ─── Feature tabs ─── */
const FEATURE_TABS = [
  { key: "booking", label: "booking & offers" },
  { key: "profiles", label: "profiles & EPK" },
  { key: "payments", label: "payments" },
  { key: "tours", label: "tour management" },
  { key: "messaging", label: "messaging" },
];

const FEATURE_DETAILS: Record<string, { cards: { icon: any; title: string; desc: string }[] }> = {
  booking: {
    cards: [
      { icon: Send, title: "structured offers", desc: "6-step guided flow with guarantee, door split, merch terms, and hospitality — no more email chains." },
      { icon: Shield, title: "deal rooms", desc: "private workspace for each offer. counter, accept, or decline with full negotiation history." },
      { icon: Zap, title: "instant notifications", desc: "know the moment an offer lands, gets accepted, or needs your attention." },
      { icon: Calendar, title: "event scheduling", desc: "date, time, venue, load-in, soundcheck — everything in one structured view." },
      { icon: FileText, title: "offer history", desc: "every offer you've sent or received, searchable and filterable by status." },
      { icon: Star, title: "BookScore™", desc: "reputation score based on response time, accept rate, and post-show reviews." },
    ],
  },
  profiles: {
    cards: [
      { icon: Users, title: "public profiles", desc: "shareable profile pages that work as your electronic press kit." },
      { icon: Music, title: "genre & style tags", desc: "get discovered by the right promoters with detailed genre classification." },
      { icon: MapPin, title: "location-based discovery", desc: "find talent and venues near you with city and state filtering." },
      { icon: Star, title: "verified badges", desc: "stand out with a verified profile that signals professionalism." },
      { icon: FileText, title: "media & links", desc: "embed Spotify, Instagram, website, and more directly on your profile." },
      { icon: Shield, title: "privacy controls", desc: "choose what's public and what's visible only to logged-in users." },
    ],
  },
  payments: {
    cards: [
      { icon: DollarSign, title: "transparent commissions", desc: "see exactly what you pay and earn. flat-rate or percentage — always visible." },
      { icon: CreditCard, title: "secure payments", desc: "stripe-powered payments with automatic splits and payouts (coming soon)." },
      { icon: FileText, title: "invoicing", desc: "auto-generated invoices for every confirmed booking." },
      { icon: Shield, title: "escrow protection", desc: "funds held securely until show completion (coming soon)." },
      { icon: Zap, title: "instant settlement", desc: "get paid within 48 hours of a completed show." },
      { icon: Star, title: "pricing tiers", desc: "free, pro, and business plans with decreasing commission rates." },
    ],
  },
  tours: {
    cards: [
      { icon: MapPin, title: "tour itineraries", desc: "plan multi-city runs with dates, venues, and logistics in one view." },
      { icon: Users, title: "crew manifests", desc: "assign crew members, set day rates, and manage contact info." },
      { icon: DollarSign, title: "budget tracking", desc: "estimated vs. actual costs per category — stay on top of spending." },
      { icon: FileText, title: "document storage", desc: "upload contracts, riders, and agreements for each tour." },
      { icon: Calendar, title: "tour calendar", desc: "visual calendar of all tour dates with color-coded status." },
      { icon: Zap, title: "logistics hub", desc: "load-in times, soundcheck, doors, and show times — all organized." },
    ],
  },
  messaging: {
    cards: [
      { icon: MessageCircle, title: "offer chat", desc: "threaded messages attached to each offer for context-rich conversations." },
      { icon: Zap, title: "real-time updates", desc: "messages appear instantly — no page refresh needed." },
      { icon: Shield, title: "deal room discussions", desc: "private conversations within each booking's deal room." },
      { icon: FileText, title: "message history", desc: "full conversation archive, searchable and organized by offer." },
      { icon: Users, title: "team communication", desc: "loop in crew and collaborators on relevant conversations." },
      { icon: Star, title: "smart notifications", desc: "get notified only for messages that matter to you." },
    ],
  },
};

/* ─── Scroll reveal hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    el.querySelectorAll(".fade-in-section").forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Landing() {
  const revealRef = useScrollReveal();
  const [activeRole, setActiveRole] = useState("artist");
  const [activeFeature, setActiveFeature] = useState("booking");

  return (
    <div ref={revealRef} className="min-h-screen">
      {/* ─── Hero ─── */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.06),transparent_60%)]" />
        <div className="container mx-auto max-w-3xl text-center relative">
          <p className="animate-reveal-up text-xs tracking-[0.2em] uppercase text-primary/80 mb-6 font-body">
            the live music booking platform
          </p>
          <h1
            className="animate-reveal-up font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-6 lowercase"
            style={{ animationDelay: "80ms" }}
          >
            the all-in-one booking platform for{" "}
            <span className="text-gradient-primary">live music</span>
          </h1>
          <p
            className="animate-reveal-up text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed font-body"
            style={{ animationDelay: "160ms" }}
          >
            connecting artists, promoters, venues, and crew — from first offer to final settlement.
          </p>
          <div className="animate-reveal-up flex flex-col sm:flex-row gap-3 justify-center" style={{ animationDelay: "240ms" }}>
            <Link to="/auth?tab=signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-sm px-8 h-11 active:scale-[0.97] transition-transform lowercase">
                start free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/directory">
              <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary font-display font-medium text-sm px-8 h-11 active:scale-[0.97] transition-transform lowercase">
                browse directory
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Profile Marquee ─── */}
      <section className="fade-in-section py-12 overflow-hidden">
        <p className="text-center text-xs tracking-[0.15em] uppercase text-muted-foreground mb-6 font-body">
          this could be your profile
        </p>
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex animate-marquee hover:[animation-play-state:paused]" style={{ width: "max-content" }}>
            {[...SAMPLE_PROFILES, ...SAMPLE_PROFILES].map((p, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-56 mx-2 rounded-xl bg-card border border-border p-4 hover:border-primary/20 transition-colors duration-300"
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-display font-bold text-xs text-foreground">
                    {p.name[0]}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-display font-semibold truncate">{p.name}</h4>
                    <span className={`inline-block px-1.5 py-0.5 text-[9px] font-semibold rounded ${roleColor[p.role]}`}>
                      {roleLabel[p.role]}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mb-1">{p.genre}</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{p.city}</span>
                  <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-role-venue" />{p.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Role Switcher ─── */}
      <section className="fade-in-section py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-3 lowercase">
            built for every role in live music
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-10 max-w-md mx-auto font-body">
            one platform, five roles. everyone gets the tools they need.
          </p>

          <div className="flex justify-center gap-1.5 flex-wrap mb-10">
            {ROLE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveRole(tab.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all active:scale-[0.97] lowercase ${
                  activeRole === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl bg-card border border-border p-6 sm:p-8 transition-all duration-300">
            <h3 className="font-display text-lg sm:text-xl font-bold mb-4 lowercase">
              {ROLE_DETAILS[activeRole].headline}
            </h3>
            <ul className="space-y-2.5">
              {ROLE_DETAILS[activeRole].points.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground font-body">
                  <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <Link to="/auth?tab=signup" className="inline-block mt-6">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium active:scale-[0.97] transition-transform lowercase">
                get started as {activeRole === "photo_video" ? "photo/video" : activeRole === "production" ? "production crew" : `a ${activeRole}`} <ArrowRight className="ml-1.5 w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Feature Tabs (Bento) ─── */}
      <section className="fade-in-section py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-3 lowercase">
            everything you need to book confidently
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-10 max-w-md mx-auto font-body">
            no more spreadsheets, DM threads, or mystery fees.
          </p>

          <div className="flex justify-center gap-1 flex-wrap mb-8">
            {FEATURE_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFeature(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all active:scale-[0.97] lowercase ${
                  activeFeature === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURE_DETAILS[activeFeature].cards.map((card, i) => (
              <div
                key={`${activeFeature}-${i}`}
                className="rounded-xl p-5 bg-card border border-border hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <card.icon className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-sm mb-1.5 lowercase">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-body">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="fade-in-section py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-3 lowercase">
            how it works
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-12 max-w-md mx-auto font-body">
            three steps to your next booking.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "create your profile", desc: "sign up, pick your role, and build your page in under 2 minutes." },
              { step: "02", title: "connect & book", desc: "browse the directory, send or receive offers, and negotiate in deal rooms." },
              { step: "03", title: "get paid & grow", desc: "confirm bookings, manage tours, collect reviews, and build your reputation." },
            ].map((item) => (
              <div key={item.step} className="text-center sm:text-left">
                <span className="inline-block font-display font-bold text-3xl text-primary/30 mb-2">{item.step}</span>
                <h3 className="font-display font-semibold text-base mb-2 lowercase">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed font-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing Teaser ─── */}
      <section className="fade-in-section py-20 px-4">
        <div className="container mx-auto max-w-lg">
          <div className="rounded-2xl bg-card border border-border p-8 text-center">
            <h2 className="font-display text-2xl font-bold mb-2 lowercase">start free, upgrade anytime</h2>
            <p className="text-sm text-muted-foreground mb-6 font-body">
              free accounts get 25% commission. pro drops to 10%. business just 5%.
            </p>
            <Link to="/pricing">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 text-xs font-medium active:scale-[0.97] transition-transform lowercase">
                view pricing <ArrowRight className="ml-1.5 w-3 h-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="fade-in-section py-20 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl sm:text-4xl font-bold mb-4 lowercase">ready to streamline your bookings?</h2>
          <p className="text-muted-foreground text-sm mb-8 font-body">join the platform built by and for the live music industry.</p>
          <Link to="/auth?tab=signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-sm px-10 h-11 active:scale-[0.97] transition-transform lowercase">
              get started free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-body">
          <div className="flex items-center gap-2 font-display font-bold text-sm text-foreground">
            <Music className="w-4 h-4 text-primary" />
            getbooked.live
          </div>
          <div className="flex gap-6">
            <Link to="/directory" className="hover:text-foreground transition-colors">directory</Link>
            <Link to="/pricing" className="hover:text-foreground transition-colors">pricing</Link>
            <Link to="/auth" className="hover:text-foreground transition-colors">sign in</Link>
          </div>
          <p>© {new Date().getFullYear()} GetBooked.Live</p>
        </div>
      </footer>
    </div>
  );
}
