import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="fade-in-section py-28 px-4">
      <div className="container mx-auto max-w-3xl">
        <div
          className="relative rounded-3xl overflow-hidden border px-8 py-16 sm:py-20 text-center"
          style={{
            border: "0.5px solid rgba(255,255,255,0.07)",
            background: "rgba(14, 20, 32, 0.6)",
          }}
        >
          {/* Radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(200,255,62,0.12) 0%, transparent 70%)",
            }}
          />

          <div className="relative z-10">
            <h2
              className="font-display text-3xl sm:text-5xl font-bold mb-5 lowercase tracking-tight"
              style={{
                background: "linear-gradient(135deg, #FFFFFF 0%, hsl(82 100% 62%) 50%, #FFFFFF 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                lineHeight: 1.1,
              }}
            >
              ready to streamline<br />your bookings?
            </h2>
            <p className="text-muted-foreground text-sm mb-10 font-body max-w-md mx-auto leading-relaxed">
              join the platform built by and for the live music industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/auth?tab=signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-display font-semibold text-sm px-10 h-13 active:scale-[0.96] transition-transform lowercase shadow-[0_0_24px_rgba(200,255,62,0.35)]">
                  get started free <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/directory">
                <Button size="lg" variant="outline" className="bg-white/[0.05] border-white/[0.12] backdrop-blur-[10px] text-foreground hover:bg-white/[0.08] hover:border-white/[0.2] font-display font-medium text-sm px-10 h-13 active:scale-[0.96] transition-transform lowercase">
                  browse directory
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
