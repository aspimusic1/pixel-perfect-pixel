import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Loader2, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SectionLabel from "@/components/landing/SectionLabel";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STRIPE_TIERS = {
  pro: {
    price_id: "price_1TDYpGRdIALML9YuWtcG1UCG",
    product_id: "prod_UBwiBhPDnrEdUZ",
  },
  business: {
    price_id: "price_1TDYpZRdIALML9YuPIs1CHiA",
    product_id: "prod_UBwjw5DHeMV0yo",
  },
};

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    desc: "Get started and explore the platform.",
    commission: "25%",
    features: ["Create your profile", "Receive & respond to offers", "Basic directory listing", "5 offers/month"],
    cta: "Get started",
    highlight: false,
    tier: "free" as const,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    desc: "For working artists and active promoters.",
    commission: "10%",
    features: ["Everything in Free", "Unlimited offers", "Priority directory placement", "Tour management tools", "Deal room access", "Analytics dashboard"],
    cta: "Start Pro trial",
    highlight: true,
    tier: "pro" as const,
  },
  {
    name: "Business",
    price: "$79",
    period: "/mo",
    desc: "For agencies, venues, and power users.",
    commission: "5%",
    features: ["Everything in Pro", "Team accounts (up to 5)", "Custom branding", "API access", "Priority support", "Bulk offer tools"],
    cta: "Contact us",
    highlight: false,
    tier: "business" as const,
  },
];

export default function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const { user, profile, subscription, checkSubscription } = useAuth();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status
  useEffect(() => {
    if (!user) return;
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }).then(({ data }) => {
      if (data) setIsAdmin(true);
    });
  }, [user]);

  // Check for success/cancel URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      toast.success("Subscription activated! Welcome aboard.");
      checkSubscription();
      window.history.replaceState({}, "", "/pricing");
    } else if (params.get("canceled") === "true") {
      toast("Checkout canceled. No charges were made.");
      window.history.replaceState({}, "", "/pricing");
    }
  }, [checkSubscription]);

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

  const currentPlan = isAdmin ? "admin" : (profile?.subscription_plan || "free");

  const handleCheckout = async (tier: "pro" | "business") => {
    if (!user) {
      window.location.href = "/auth?tab=signup";
      return;
    }

    setLoadingTier(tier);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: STRIPE_TIERS[tier].price_id },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout");
    } finally {
      setLoadingTier(null);
    }
  };

  const handleManageSubscription = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to open subscription management");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div ref={ref} className="min-h-screen pt-24 px-4 pb-16">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <div data-reveal className="opacity-0">
            <SectionLabel>pricing</SectionLabel>
          </div>
          <h1 data-reveal className="opacity-0 font-display text-4xl sm:text-5xl font-bold mb-4">Simple, transparent pricing</h1>
          <p data-reveal className="opacity-0 text-muted-foreground text-lg max-w-md mx-auto" style={{ animationDelay: "80ms" }}>
            Lower commissions as you grow. No hidden fees, ever.
          </p>
        </div>

        {isAdmin && (
          <div data-reveal className="opacity-0 mb-8 flex justify-center">
            <div className="px-5 py-3 rounded-xl bg-[#C8FF3E]/10 border border-[#C8FF3E]/20 text-center">
              <p className="text-[#C8FF3E] font-syne font-bold text-sm">🛡️ admin — all access</p>
              <p className="text-[10px] text-muted-foreground mt-1">you have full platform access as an administrator</p>
            </div>
          </div>
        )}

        {subscription?.subscribed && (
          <div data-reveal className="opacity-0 mb-8 flex justify-center">
            <Button
              variant="outline"
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="border-primary/30 text-primary hover:bg-primary/10 active:scale-[0.97] transition-transform"
            >
              {portalLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Settings className="w-4 h-4 mr-2" />}
              Manage Subscription
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => {
            const isCurrentPlan = currentPlan === plan.tier;
            const isLoading = loadingTier === plan.tier;

            return (
              <div
                key={plan.name}
                data-reveal
                className={`opacity-0 rounded-2xl p-6 border transition-all duration-300 ${
                  plan.highlight
                    ? "bg-card border-primary/40 glow-primary scale-[1.02]"
                    : "bg-card border-border hover:border-border/80"
                } ${isCurrentPlan ? "ring-2 ring-primary/50" : ""}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {isCurrentPlan && (
                  <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#3EFFBE] text-[#080C14] mb-4">Your Plan</span>
                )}
                {plan.highlight && !isCurrentPlan && (
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

                {plan.tier === "free" ? (
                  <Link to={user ? "#" : "/auth?tab=signup"}>
                    <Button
                      disabled={isCurrentPlan}
                      className="w-full mb-6 font-medium h-10 active:scale-[0.97] transition-transform bg-secondary text-foreground hover:bg-secondary/80"
                    >
                      {isCurrentPlan ? "Current plan" : plan.cta} {!isCurrentPlan && <ArrowRight className="ml-2 w-3.5 h-3.5" />}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    disabled={isCurrentPlan || isLoading}
                    onClick={() => handleCheckout(plan.tier)}
                    className={`w-full mb-6 font-medium h-10 active:scale-[0.97] transition-transform ${
                      plan.highlight
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : isCurrentPlan ? (
                      "Current plan"
                    ) : (
                      <>
                        {plan.cta} <ArrowRight className="ml-2 w-3.5 h-3.5" />
                      </>
                    )}
                  </Button>
                )}

                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
