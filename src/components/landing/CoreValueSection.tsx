import { Check } from "lucide-react";

const BULLETS = [
  "Promoters send structured booking offers",
  "Artists see exact payouts before accepting",
  "Venues get filled with real events",
  "Creatives get hired into real shows",
];

export default function CoreValueSection() {
  return (
    <section className="fade-in-section py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <span className="section-label">how it works</span>
            <h2 className="section-heading">everything starts with a real offer</h2>
            <ul className="space-y-3 mt-6">
              {BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-[14px] text-foreground/80 font-body">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Offer card mock */}
          <div className="glass-card rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-muted-foreground font-body uppercase tracking-wider">new offer</p>
              <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-display font-bold">pending</span>
            </div>
            <div>
              <p className="font-display font-bold text-foreground text-sm">House of Blues · Chicago</p>
              <p className="text-[12px] text-muted-foreground font-body mt-1">Dec 14, 2025 · 8:00 PM</p>
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between text-[13px] font-body">
                <span className="text-muted-foreground">guarantee</span>
                <span className="text-foreground font-display font-bold">$2,500</span>
              </div>
              <div className="flex justify-between text-[13px] font-body">
                <span className="text-muted-foreground">commission (10%)</span>
                <span className="text-destructive font-display">−$250</span>
              </div>
              <div className="flex justify-between text-[13px] font-body border-t border-border pt-2">
                <span className="text-foreground font-medium">your payout</span>
                <span className="text-primary font-display font-bold text-base">$2,250</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
