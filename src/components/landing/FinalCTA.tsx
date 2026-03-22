import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const MINI_PROFILES = [
  { name: "Maya Chen", role: "Artist · R&B", score: 94, online: true },
  { name: "Tomás Herrera", role: "Promoter · Austin", score: 88, online: true },
  { name: "Jake Lindgren", role: "Production", score: 91, online: false },
];

export default function FinalCTA() {
  return (
    <section className="fade-in-section py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="rounded-[20px] overflow-hidden border border-white/[0.08] bg-card/60 flex flex-col sm:flex-row">
          {/* Left — text */}
          <div className="flex-[3] p-10 sm:p-14 flex flex-col justify-center">
            <h2 className="font-display font-extrabold text-[clamp(28px,4vw,38px)] text-foreground leading-[1.1] mb-4 lowercase">
              ready to get booked?
            </h2>
            <p className="text-[15px] text-muted-foreground font-body leading-relaxed mb-8 max-w-md">
              free to join. first booking takes minutes. no credit card required.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/auth?tab=signup">
                <button className="bg-primary text-primary-foreground font-display font-bold text-sm rounded-[10px] px-7 h-11 hover:bg-primary/90 active:scale-[0.96] transition-all inline-flex items-center gap-2">
                  start free <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/directory">
                <button className="border border-white/[0.1] text-foreground font-display font-medium text-sm rounded-[10px] px-7 h-11 hover:bg-secondary hover:border-white/[0.15] active:scale-[0.96] transition-all">
                  browse directory
                </button>
              </Link>
            </div>
          </div>

          {/* Right — decorative profile cards (hidden on mobile) */}
          <div className="hidden sm:flex flex-[2] bg-background/80 p-8 flex-col justify-center gap-3">
            {MINI_PROFILES.map((p) => (
              <div
                key={p.name}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-card/80 border border-white/[0.06]"
              >
                <div className="relative shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/[0.12] flex items-center justify-center text-sm font-display font-bold text-primary">
                    {p.name[0]}
                  </div>
                  {p.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-display font-bold text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground font-body">{p.role}</p>
                </div>
                <span className="text-[10px] font-display font-bold text-primary bg-primary/[0.1] px-2 py-0.5 rounded-full">
                  ★ {p.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
