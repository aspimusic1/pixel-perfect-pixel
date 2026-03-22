import {
  Bot, Zap, Shield, DollarSign, BarChart3, Truck, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: Bot,
    title: "AI booking agent",
    desc: "describe what you need — genre, budget, market — and our AI finds the best-fit artists and drafts the offer.",
  },
  {
    icon: Zap,
    title: "flash bids",
    desc: "artists mark open dates. promoters bid in real time. highest bid wins when the clock runs out.",
  },
  {
    icon: Shield,
    title: "deal rooms",
    desc: "every confirmed booking gets a private workspace — milestones, contracts, chat, and logistics in one place.",
  },
  {
    icon: DollarSign,
    title: "income smoothing",
    desc: "convert lumpy show income into predictable monthly payments. we hold guarantees and pay you evenly.",
  },
  {
    icon: BarChart3,
    title: "attendance analytics",
    desc: "track actual draw per artist and venue. real data on profiles — not guesswork.",
  },
  {
    icon: Truck,
    title: "ground transport",
    desc: "book SUVs, vans, and sprinters for each tour stop. drivers list vehicles, rates, and cities served.",
  },
];

export default function PowerFeaturesSection() {
  return (
    <section className="fade-in-section py-24 sm:py-32 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14">
          <span className="section-label">features</span>
          <h2 className="section-heading">everything the live music industry needs</h2>
          <p className="section-subtext mx-auto">AI-powered booking, real-time bidding, financial tools, and logistics — built for how the industry actually works.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group rounded-[14px] p-6 bg-card/80 border border-white/[0.06] hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5 cursor-default"
            >
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-[15px] h-[15px] text-primary" />
              </div>
              <h3 className="font-display font-bold text-sm text-foreground mb-2 lowercase">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-[1.6] font-body">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/auth?tab=signup">
            <button className="bg-primary text-primary-foreground font-display font-bold text-sm rounded-[10px] px-8 h-12 hover:bg-primary/90 active:scale-[0.96] transition-all inline-flex items-center gap-2 lowercase">
              try it free <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
