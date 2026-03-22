import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function PricingTeaser() {
  return (
    <section className="fade-in-section py-24 px-4">
      <div className="container mx-auto max-w-lg">
        <div className="rounded-2xl bg-card/60 border border-border p-8 sm:p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/[0.04] rounded-full blur-[80px] pointer-events-none" />
          <Sparkles className="w-5 h-5 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold mb-2 lowercase tracking-tight">start free, upgrade anytime</h2>
          <p className="text-sm text-muted-foreground mb-8 font-body leading-relaxed">
            free accounts get 20% commission. pro drops to 10%. agency just 5%.
          </p>
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
