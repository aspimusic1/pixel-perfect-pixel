import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function PricingTeaser() {
  return (
    <section className="fade-in-section py-24 px-4">
      <div className="container mx-auto max-w-lg">
        <div className="rounded-2xl bg-card border border-border p-8 text-center">
          <h2 className="font-display text-2xl font-bold mb-2 lowercase">start free, upgrade anytime</h2>
          <p className="text-sm text-muted-foreground mb-6 font-body">
            free accounts get 20% commission. pro drops to 10%. agency just 5%.
          </p>
          <Link to="/pricing">
            <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10 text-xs font-medium active:scale-[0.97] transition-transform lowercase">
              view pricing <ArrowRight className="ml-1.5 w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
