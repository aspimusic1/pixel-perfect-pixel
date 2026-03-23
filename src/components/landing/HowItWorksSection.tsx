import { Search, FileText, Check } from "lucide-react";

const STEPS = [
  {
    step: "01",
    title: "find talent or opportunities",
    desc: "browse verified profiles by genre, city, and fee — or let our AI match you.",
    mockup: "search",
  },
  {
    step: "02",
    title: "send or receive an offer",
    desc: "structured offers with guarantee, splits, and hospitality — not a DM.",
    mockup: "offer",
  },
  {
    step: "03",
    title: "close the deal and execute",
    desc: "deal rooms with contracts, milestones, crew, and real-time chat.",
    mockup: "deal",
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
    search: (
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/60 border border-white/[0.06]">
          <Search className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-body">search artists…</span>
        </div>
        {[
          { name: "Maya Chen", genre: "R&B · Soul", fee: "$2,500" },
          { name: "Los Rumberos", genre: "Latin · Cumbia", fee: "$1,800" },
        ].map(a => (
          <div key={a.name} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/40 border border-white/[0.06]">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-display font-bold text-primary">{a.name[0]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-display font-bold text-foreground">{a.name}</p>
              <p className="text-[10px] text-muted-foreground font-body">{a.genre}</p>
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
    deal: (
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
    <section className="fade-in-section py-16 sm:py-28 px-4 sm:px-6 md:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-14">
          <span className="section-label">how it works</span>
          <h2 className="section-heading">from search to show in 3 steps</h2>
        </div>

        <div className="space-y-12 sm:space-y-16">
          {STEPS.map((item, i) => {
            const isReversed = i % 2 === 1;
            return (
              <div
                key={item.step}
                className={`flex flex-col ${isReversed ? "sm:flex-row-reverse" : "sm:flex-row"} gap-6 sm:gap-10 items-center`}
              >
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-xs font-display font-bold text-primary uppercase tracking-wider">{item.step}</span>
                  <h3 className="font-display font-bold text-base sm:text-lg text-foreground mt-2 mb-2 lowercase">{item.title}</h3>
                  <p className="text-[13px] text-muted-foreground font-body leading-relaxed">{item.desc}</p>
                </div>
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
