import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="fade-in-section py-24 px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="font-display text-2xl sm:text-4xl font-bold mb-4 lowercase">ready to streamline your bookings?</h2>
        <p className="text-muted-foreground text-sm mb-8 font-body">join the platform built by and for the live music industry.</p>
        <Link to="/auth?tab=signup">
          <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-sm px-10 h-12 active:scale-[0.97] transition-transform lowercase">
            get started free <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
