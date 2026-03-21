import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    desc: "Get started and explore the platform.",
    commission: "15%",
    features: ["Create your profile", "Receive & respond to offers", "Basic directory listing", "5 offers/month"],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    desc: "For working artists and active promoters.",
    commission: "8%",
    features: ["Everything in Free", "Unlimited offers", "Priority directory placement", "Tour management tools", "Deal room access", "Analytics dashboard"],
    cta: "Start Pro trial",
    highlight: true,
  },
  {
    name: "Business",
    price: "$79",
    period: "/mo",
    desc: "For agencies, venues, and power users.",
    commission: "4%",
    features: ["Everything in Pro", "Team accounts (up to 5)", "Custom branding", "API access", "Priority support", "Bulk offer tools"],
    cta: "Contact us",
    highlight: false,
  },
];

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("animate-reveal-up"); observer.unobserve(e.target); } }),
      { threshold: 0.15 }
    );
    el.querySelectorAll("[data-reveal]").forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="min-h-screen pt-24 px-4 pb-16">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h1 data-reveal className="opacity-0 font-display text-4xl sm:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
          <p data-reveal className="opacity-0 text-muted-foreground text-lg max-w-md mx-auto" style={{ animationDelay: "80ms" }}>
            Lower commissions as you grow. No hidden fees, ever.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              data-reveal
              className={`opacity-0 rounded-2xl p-6 border transition-all duration-300 ${
                plan.highlight
                  ? "bg-card border-primary/40 glow-primary scale-[1.02]"
                  : "bg-card border-border hover:border-border/80"
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {plan.highlight && (
                <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-primary text-primary-foreground mb-4">Most popular</span>
              )}
              <h3 className="font-display text-xl font-bold mb-1">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
              <div className="mb-1">
                <span className="font-display text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Commission: <span className="text-primary font-semibold">{plan.commission}</span>
              </p>
              <Link to="/auth?tab=signup">
                <Button
                  className={`w-full mb-6 font-medium h-10 active:scale-[0.97] transition-transform ${
                    plan.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {plan.cta} <ArrowRight className="ml-2 w-3.5 h-3.5" />
                </Button>
              </Link>
              <ul className="space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
