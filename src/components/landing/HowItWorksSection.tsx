import { UserPlus, Handshake, Banknote } from "lucide-react";
import SectionLabel from "@/components/landing/SectionLabel";

const STEPS = [
  {
    icon: UserPlus,
    step: "01",
    title: "create your profile",
    desc: "sign up, pick your role, and build your page in under 2 minutes. artists, promoters, venues, crew — everyone belongs.",
  },
  {
    icon: Handshake,
    step: "02",
    title: "connect & book",
    desc: "browse the directory, send structured offers, negotiate in deal rooms, or let the AI agent find the perfect match.",
  },
  {
    icon: Banknote,
    step: "03",
    title: "get paid & grow",
    desc: "confirm bookings, track attendance, collect reviews, request advances, and let income smoothing handle the rest.",
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

        <div className="grid sm:grid-cols-3 gap-0 sm:gap-0 relative">
          {/* Desktop connecting lines */}
          {[0, 1].map((i) => (
            <div
              key={`line-${i}`}
              className="hidden sm:block absolute top-1/2 -translate-y-1/2 h-px"
              style={{
                left: `${((i + 1) * 100) / 3 - 2}%`,
                width: "4%",
                background: "linear-gradient(90deg, rgba(200,255,62,0.3), rgba(200,255,62,0.0))",
              }}
            />
          ))}

          {STEPS.map((item, i) => (
            <div key={item.step} className="relative px-1.5 mb-4 sm:mb-0">
              <div
                className="relative overflow-hidden rounded-2xl border backdrop-blur-[12px] p-6 text-center transition-all duration-300 hover:border-[rgba(200,255,62,0.3)]"
                style={{
                  background: "rgba(14, 20, 32, 0.6)",
                  border: "0.5px solid rgba(255,255,255,0.07)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                {/* Watermark number */}
                <span
                  className="absolute top-3 left-4 font-display font-bold select-none pointer-events-none"
                  style={{ fontSize: 48, color: "rgba(200,255,62,0.12)", lineHeight: 1 }}
                >
                  {item.step}
                </span>

                <div className="relative z-10 pt-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-base mb-2 lowercase">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-body max-w-[260px] mx-auto">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
