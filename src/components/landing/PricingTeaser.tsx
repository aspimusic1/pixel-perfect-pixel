import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    unit: "forever",
    popular: false,
    features: ["3 offers per month", "20% commission", "Basic profile"],
    cta: "Get started",
  },
  {
    name: "Pro",
    price: "$29",
    unit: "/month",
    popular: true,
    features: ["Unlimited offers", "10% commission", "Verified badge", "Deal rooms & contracts"],
    cta: "Start free trial",
  },
  {
    name: "Agency",
    price: "Custom",
    unit: "",
    popular: false,
    features: ["Up to 25 profiles", "6–7% commission", "Team seats", "API access"],
    cta: "Contact us",
  },
];

export default function PricingTeaser() {
  return (
    <section className="fade-in-section py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <span className="section-label">pricing</span>
          <h2 className="section-heading">start free. upgrade when you grow.</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative glass-card rounded-2xl p-7 border transition-all ${
                plan.popular ? "border-primary/30" : "border-border"
              }`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-display font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full">
                  popular
                </span>
              )}

              <p className="text-xs text-muted-foreground font-display uppercase tracking-wider mb-3">{plan.name}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className={`font-display font-black text-[38px] leading-none ${plan.popular ? "text-primary" : "text-foreground"}`}>
                  {plan.price}
                </span>
                {plan.unit && <span className="text-[13px] text-muted-foreground font-body">{plan.unit}</span>}
              </div>

              <div className="border-t border-border my-5" />

              <ul className="space-y-3 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span className="text-[13px] text-foreground/80 font-body">{f}</span>
                  </li>
                ))}
              </ul>

              <Link to={plan.name === "Agency" ? "/pricing" : "/auth?tab=signup"}>
                <button
                  className={`w-full h-11 rounded-[10px] text-sm font-display font-bold transition-all active:scale-[0.96] ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border text-foreground hover:bg-secondary"
                  }`}
                >
                  {plan.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/auth?tab=signup" className="inline-flex items-center gap-1 text-primary text-sm font-display font-bold hover:underline">
            start free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
