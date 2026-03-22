import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import SectionLabel from "@/components/landing/SectionLabel";

export default function PricingTeaser() {
  return (
    <section className="fade-in-section py-24 px-4">
      <div className="container mx-auto max-w-lg">
        <div
          className="rounded-2xl border border-white/[0.07] backdrop-blur-[12px] p-8 sm:p-10 text-center relative overflow-hidden transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_20px_rgba(200,255,62,0.06)]"
          style={{ background: "rgba(14, 20, 32, 0.6)", boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)" }}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/[0.04] rounded-full blur-[80px] pointer-events-none" />
          <div className="mb-4">
            <SectionLabel>pricing</SectionLabel>
          </div>
          <h2 className="font-display text-2xl font-bold mb-2 lowercase tracking-tight">start free, upgrade anytime</h2>
          <p className="text-sm text-muted-foreground mb-8 font-body leading-relaxed">
            free accounts get 20% commission. pro drops to 10%. agency just 5%.
          </p>
          <div className="flex justify-center gap-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium text-primary border border-primary/20 mb-6" style={{ background: "rgba(200,255,62,0.08)" }}>
              10% fee
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium text-primary border border-primary/20 mb-6" style={{ background: "rgba(200,255,62,0.08)" }}>
              unlimited offers
            </span>
          </div>
          <Link to="/pricing">
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 text-xs font-display font-semibold active:scale-[0.96] transition-transform lowercase h-11 px-7">
              view pricing <ArrowRight className="ml-2 w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
