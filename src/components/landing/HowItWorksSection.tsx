import { Search, Send, Handshake } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Find the right talent", desc: "Browse verified artists, venues, and crews by genre, city, and availability." },
  { icon: Send, title: "Send a structured offer", desc: "No more back-and-forth DMs. One clear offer with all the details." },
  { icon: Handshake, title: "Close the deal", desc: "Accept, counter, or decline. Contracts and payouts handled automatically." },
];

export default function HowItWorksSection() {
  return (
    <section className="fade-in-section py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <span className="section-label">3 simple steps</span>
          <h2 className="section-heading">how it works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((s, i) => (
            <div key={i} className="glass-card rounded-xl border border-border p-6 text-center" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <p className="font-display font-bold text-sm text-foreground mb-2">{s.title}</p>
              <p className="text-[13px] text-muted-foreground font-body leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
