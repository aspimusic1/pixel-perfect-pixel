import { Search, FileText, Users, MapPin, Check, X } from "lucide-react";

const STEPS = [
  {
    step: "Step 1",
    title: "find the right artist",
    desc: "browse verified profiles by genre, city, and booking fee. see streaming stats, reviews, and availability in one place.",
    mockup: "directory",
  },
  {
    step: "Step 2",
    title: "send a structured offer",
    desc: "fill out date, venue, guarantee, door split, and hospitality. the artist gets a clean, professional offer — not a DM.",
    mockup: "offer",
  },
  {
    step: "Step 3",
    title: "manage the deal room",
    desc: "once accepted, everything lives in one place — contracts, milestones, crew, and real-time chat between both parties.",
    mockup: "dealroom",
  },
  {
    step: "Step 4",
    title: "hit the road",
    desc: "plan multi-city tours with an interactive itinerary, crew manifests, budgets, and ground transport — all connected.",
    mockup: "tour",
  },
];

function StepMockup({ type }: { type: string }) {
  const chrome = (
    <div className="h-7 bg-secondary flex items-center px-3 gap-1.5 border-b border-white/[0.06]">
      <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
    </div>
  );

  const inner: Record<string, React.ReactNode> = {
    directory: (
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/60 border border-white/[0.06]">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-body">search artists…</span>
        </div>
        {[
          { name: "Maya Chen", genre: "R&B · Soul", fee: "$2,500", listeners: "142K" },
          { name: "Los Rumberos", genre: "Latin · Cumbia", fee: "$1,800", listeners: "89K" },
        ].map(a => (
          <div key={a.name} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-white/[0.06]">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-display font-bold text-primary">{a.name[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-display font-bold text-foreground">{a.name}</p>
              <p className="text-[10px] text-muted-foreground font-body">{a.genre} · {a.listeners} listeners</p>
            </div>
            <span className="text-[10px] font-display font-bold text-primary">{a.fee}</span>
          </div>
        ))}
      </div>
    ),
    offer: (
      <div className="p-4 space-y-3">
        <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">new offer</p>
        {[
          { label: "venue", value: "House of Blues, Chicago" },
          { label: "date", value: "Dec 14, 2026" },
          { label: "guarantee", value: "$2,500" },
        ].map(f => (
          <div key={f.label} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
            <span className="text-[10px] text-muted-foreground font-body">{f.label}</span>
            <span className="text-xs font-display font-semibold text-foreground">{f.value}</span>
          </div>
        ))}
        <button className="w-full mt-1 h-8 rounded-lg bg-primary text-primary-foreground text-xs font-display font-bold">send offer</button>
      </div>
    ),
    dealroom: (
      <div className="p-4 space-y-3">
        <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">deal room · house of blues</p>
        {[
          { label: "Contract signed", done: true },
          { label: "Deposit received", done: true },
          { label: "Rider submitted", done: false },
          { label: "Sound check confirmed", done: false },
        ].map(m => (
          <div key={m.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${m.done ? "bg-primary" : "border border-white/[0.1]"}`}>
              {m.done && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
            </div>
            <span className={`text-xs font-body ${m.done ? "text-foreground" : "text-muted-foreground"}`}>{m.label}</span>
          </div>
        ))}
      </div>
    ),
    tour: (
      <div className="p-4 space-y-2.5">
        <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">winter tour 2026</p>
        {[
          { city: "Chicago, IL", venue: "House of Blues", date: "Dec 14" },
          { city: "Detroit, MI", venue: "El Club", date: "Dec 16" },
          { city: "Cleveland, OH", venue: "Beachland", date: "Dec 17" },
        ].map(s => (
          <div key={s.city} className="flex items-center gap-3 py-2 border-b border-white/[0.04]">
            <MapPin className="w-3 h-3 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-display font-semibold text-foreground">{s.venue}</p>
              <p className="text-[10px] text-muted-foreground font-body">{s.city}</p>
            </div>
            <span className="text-[10px] font-display text-muted-foreground">{s.date}</span>
          </div>
        ))}
      </div>
    ),
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/[0.08] bg-card">
      {chrome}
      {inner[type]}
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="fade-in-section py-24 sm:py-32 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <span className="section-label">how it works</span>
          <h2 className="section-heading">from search to show in 4 steps</h2>
          <p className="section-subtext mx-auto">a streamlined workflow that takes you from discovering talent to managing the tour.</p>
        </div>

        <div className="space-y-16 sm:space-y-20">
          {STEPS.map((item, i) => {
            const isReversed = i % 2 === 1;
            return (
              <div
                key={item.step}
                className={`flex flex-col ${isReversed ? "sm:flex-row-reverse" : "sm:flex-row"} gap-8 sm:gap-12 items-center`}
              >
                {/* Text */}
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-xs font-display font-bold text-primary uppercase tracking-wider">{item.step}</span>
                  <h3 className="font-display font-bold text-base sm:text-lg text-foreground mt-2 mb-2 lowercase">{item.title}</h3>
                  <p className="text-[13px] text-muted-foreground font-body leading-relaxed">{item.desc}</p>
                </div>
                {/* Mockup */}
                <div className="flex-1 w-full max-w-sm sm:max-w-none">
                  <StepMockup type={item.mockup} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
