import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="fade-in-section py-28 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent pointer-events-none" />
      <div className="container mx-auto max-w-2xl text-center relative">
        <h2 className="font-display text-3xl sm:text-5xl font-bold mb-5 lowercase tracking-tight">
          ready to streamline<br />your bookings?
        </h2>
        <p className="text-muted-foreground text-sm mb-10 font-body max-w-md mx-auto leading-relaxed">
          join the platform built by and for the live music industry.
        </p>
        <Link to="/auth?tab=signup">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-sm px-12 h-13 active:scale-[0.96] transition-transform lowercase shadow-[0_0_24px_rgba(200,255,62,0.35)]">
            get started free <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
