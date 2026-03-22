import { UserPlus, Handshake, Banknote } from "lucide-react";
import SectionLabel from "@/components/landing/SectionLabel";

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "create your profile",
    desc: "sign up, pick your role, and build your page in under 2 minutes. artists, promoters, venues, crew — everyone belongs.",
    badge: "2 minutes",
  },
  {
    icon: Handshake,
    step: "02",
    title: "connect & book",
    desc: "browse the directory, send structured offers, negotiate in deal rooms, or let the AI agent find the perfect match.",
    badge: "AI-assisted",
  },
  {
    icon: Banknote,
    step: "03",
    title: "get paid & grow",
    desc: "confirm bookings, track attendance, collect reviews, request advances, and let income smoothing handle the rest.",
    badge: "auto-payout",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="fade-in-section py-28 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <SectionLabel>simple process</SectionLabel>
          <h2 className="font-display text-2xl sm:text-4xl font-bold mb-3 lowercase tracking-tight">
            how it works
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto font-body">
            three steps to your next booking.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {STEPS.map((item, i) => (
            <div
              key={item.step}
              className="relative text-center group rounded-2xl border border-white/[0.07] backdrop-blur-[12px] p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_20px_rgba(200,255,62,0.06)]"
              style={{ background: "rgba(14, 20, 32, 0.6)", boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)" }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="inline-block font-display font-bold text-2xl text-primary/20 mb-2">{item.step}</span>
              <h3 className="font-display font-semibold text-base mb-2 lowercase">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-body max-w-[260px] mx-auto mb-4">{item.desc}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium text-primary border border-primary/20" style={{ background: "rgba(200,255,62,0.08)" }}>
                {item.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
