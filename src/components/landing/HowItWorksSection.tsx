import { UserPlus, Handshake, Banknote } from "lucide-react";

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
    <section className="fade-in-section py-24 px-4 bg-card/20">
      <div className="container mx-auto max-w-3xl">
        <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-3 lowercase">
          how it works
        </h2>
        <p className="text-muted-foreground text-center text-sm mb-14 max-w-md mx-auto font-body">
          three steps to your next booking.
        </p>

        <div className="grid sm:grid-cols-3 gap-8">
          {STEPS.map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="inline-block font-display font-bold text-xs text-primary/40 tracking-widest mb-2">{item.step}</span>
              <h3 className="font-display font-semibold text-base mb-2 lowercase">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-body">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
