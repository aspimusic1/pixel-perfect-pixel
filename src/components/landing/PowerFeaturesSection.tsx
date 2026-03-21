import {
  Zap, Shield, DollarSign, BarChart3, Bot, TrendingUp,
  Globe, Truck, Receipt, Umbrella, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const FEATURES = [
  {
    icon: Bot,
    title: "AI booking agent",
    desc: "describe what you need — genre, budget, market — and our AI finds the best-fit artists, estimates fair rates, and drafts the offer for you.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Zap,
    title: "flash bids",
    desc: "artists mark open dates. promoters bid in real time. highest bid wins when the clock runs out. fill last-minute slots instantly.",
    color: "text-role-venue",
    bgColor: "bg-role-venue/10",
  },
  {
    icon: Shield,
    title: "deal rooms",
    desc: "every confirmed booking gets a private workspace — milestones, contracts, chat, and logistics in one place.",
    color: "text-role-photo",
    bgColor: "bg-role-photo/10",
  },
  {
    icon: DollarSign,
    title: "income smoothing",
    desc: "convert lumpy show income into predictable monthly payments. we hold guarantees in escrow and pay you the same amount every month.",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    icon: BarChart3,
    title: "attendance analytics",
    desc: "track actual draw per artist and per venue. see 'average draw: 800–1,400' on profiles — real data, not guesswork.",
    color: "text-role-promoter",
    bgColor: "bg-role-promoter/10",
  },
  {
    icon: TrendingUp,
    title: "advance requests",
    desc: "need cash before the show? request up to 70% of your net guarantee. approved in minutes if the booking checks out.",
    color: "text-role-venue",
    bgColor: "bg-role-venue/10",
  },
  {
    icon: Globe,
    title: "timezone intelligence",
    desc: "all times stored in UTC, displayed in each user's local zone. deal rooms show both: '4:00 PM EST / 9:00 PM GMT.'",
    color: "text-role-photo",
    bgColor: "bg-role-photo/10",
  },
  {
    icon: Truck,
    title: "ground transport",
    desc: "book SUVs, vans, and sprinters for each tour stop. drivers list their vehicles, rates, and cities served. book directly on platform.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Receipt,
    title: "bookkeeping & tax prep",
    desc: "auto-populated income, manual expense entry per tour stop, IRS categories, monthly P&L, and exportable quarterly summaries.",
    color: "text-green-400",
    bgColor: "bg-green-400/10",
  },
  {
    icon: Umbrella,
    title: "cancellation insurance",
    desc: "protect every booking. artist coverage for full guarantee + travel. promoter coverage for deposit protection. from $89.",
    color: "text-role-promoter",
    bgColor: "bg-role-promoter/10",
  },
];

export default function PowerFeaturesSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="fade-in-section py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <p className="text-[11px] tracking-[0.2em] uppercase text-primary/80 text-center mb-3 font-body">
          new on the platform
        </p>
        <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-3 lowercase">
          tools that actually move the needle
        </h2>
        <p className="text-muted-foreground text-center text-sm mb-14 max-w-lg mx-auto font-body">
          AI-powered booking, real-time bidding, financial tools, and logistics — built for how the industry actually works.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-xl p-5 bg-card border border-border hover:border-primary/20 transition-all duration-300 cursor-default"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{
                transitionDelay: hoveredIdx === null ? "0ms" : "0ms",
              }}
            >
              <div className={`w-9 h-9 rounded-lg ${f.bgColor} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                <f.icon className={`w-4 h-4 ${f.color}`} />
              </div>
              <h3 className="font-display font-semibold text-sm mb-1.5 lowercase text-foreground">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-body">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/auth?tab=signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-sm px-8 h-11 active:scale-[0.97] transition-transform lowercase">
              try it free <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
