import {
  Zap, Shield, DollarSign, BarChart3, Bot, TrendingUp,
  Globe, Truck, Receipt, Umbrella, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import SectionLabel from "@/components/landing/SectionLabel";

const FEATURES = [
  {
    icon: Bot,
    title: "AI booking agent",
    desc: "describe what you need — genre, budget, market — and our AI finds the best-fit artists, estimates fair rates, and drafts the offer for you.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    badge: "AI-powered",
  },
  {
    icon: Zap,
    title: "flash bids",
    desc: "artists mark open dates. promoters bid in real time. highest bid wins when the clock runs out. fill last-minute slots instantly.",
    color: "text-role-venue",
    bgColor: "bg-role-venue/10",
    badge: "real-time",
  },
  {
    icon: Shield,
    title: "deal rooms",
    desc: "every confirmed booking gets a private workspace — milestones, contracts, chat, and logistics in one place.",
    color: "text-role-photo",
    bgColor: "bg-role-photo/10",
    badge: "all-in-one",
  },
  {
    icon: DollarSign,
    title: "income smoothing",
    desc: "convert lumpy show income into predictable monthly payments. we hold guarantees in escrow and pay you the same amount every month.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    badge: "2% fee",
  },
  {
    icon: BarChart3,
    title: "attendance analytics",
    desc: "track actual draw per artist and per venue. see 'average draw: 800–1,400' on profiles — real data, not guesswork.",
    color: "text-role-promoter",
    bgColor: "bg-role-promoter/10",
    badge: "data-driven",
  },
  {
    icon: TrendingUp,
    title: "advance requests",
    desc: "need cash before the show? request up to 70% of your net guarantee. approved in minutes if the booking checks out.",
    color: "text-role-venue",
    bgColor: "bg-role-venue/10",
    badge: "up to 70%",
  },
  {
    icon: Globe,
    title: "timezone intelligence",
    desc: "all times stored in UTC, displayed in each user's local zone. deal rooms show both: '4:00 PM EST / 9:00 PM GMT.'",
    color: "text-role-photo",
    bgColor: "bg-role-photo/10",
    badge: "auto-sync",
  },
  {
    icon: Truck,
    title: "ground transport",
    desc: "book SUVs, vans, and sprinters for each tour stop. drivers list their vehicles, rates, and cities served. book directly on platform.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    badge: "door-to-door",
  },
  {
    icon: Receipt,
    title: "bookkeeping & tax prep",
    desc: "auto-populated income, manual expense entry per tour stop, IRS categories, monthly P&L, and exportable quarterly summaries.",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
    badge: "IRS-ready",
  },
  {
    icon: Umbrella,
    title: "cancellation insurance",
    desc: "protect every booking. artist coverage for full guarantee + travel. promoter coverage for deposit protection. from $89.",
    color: "text-role-promoter",
    bgColor: "bg-role-promoter/10",
    badge: "from $89",
  },
];

export default function PowerFeaturesSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="fade-in-section py-28 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <SectionLabel>new on the platform</SectionLabel>
          <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3 lowercase tracking-tight">
            tools that actually move the needle
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto font-body">
            AI-powered booking, real-time bidding, financial tools, and logistics — built for how the industry actually works.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group relative rounded-2xl p-5 border border-white/[0.07] backdrop-blur-[12px] transition-all duration-300 cursor-default hover:border-primary/20 hover:shadow-[0_0_20px_rgba(200,255,62,0.06)]"
              style={{ background: "rgba(14, 20, 32, 0.6)", boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)" }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className={`w-10 h-10 rounded-lg ${f.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className={`w-[18px] h-[18px] ${f.color}`} />
              </div>
              <h3 className="font-display font-semibold text-[15px] mb-2 lowercase text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-body mb-4">{f.desc}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium text-primary border border-primary/20" style={{ background: "rgba(200,255,62,0.08)" }}>
                {f.badge}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/auth?tab=signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-sm px-8 h-12 active:scale-[0.96] transition-transform lowercase shadow-[0_0_24px_rgba(200,255,62,0.25)]">
              try it free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
