import { MessageSquare, FolderKanban, MapPin, Sparkles, FileText, CreditCard } from "lucide-react";

const FEATURES = [
  { icon: FolderKanban, title: "Deal Rooms", desc: "Private workspaces for every booking with milestones and docs." },
  { icon: MapPin, title: "Tour Management", desc: "Plan multi-city runs with crew, budgets, and logistics." },
  { icon: MessageSquare, title: "Messaging", desc: "Threaded conversations tied to every offer and booking." },
  { icon: Sparkles, title: "AI Suggestions", desc: "Get matched with the right artists, venues, and crew." },
  { icon: FileText, title: "Contracts", desc: "Auto-generated contracts with e-signatures built in." },
  { icon: CreditCard, title: "Payments", desc: "Secure payouts with commission tracking and deposits." },
];

export default function FeaturePreviewSection() {
  return (
    <section className="fade-in-section py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <span className="section-label">platform</span>
          <h2 className="section-heading">everything you need. nothing you don't.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="glass-card rounded-xl border border-border p-5 transition-all duration-200 hover:border-primary/20"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <f.icon className="w-5 h-5 text-primary mb-3" />
              <p className="font-display font-bold text-sm text-foreground mb-1">{f.title}</p>
              <p className="text-[12px] text-muted-foreground font-body leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
