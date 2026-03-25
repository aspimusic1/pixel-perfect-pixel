import { useState } from "react";

const ROLES = [
  {
    key: "artists",
    label: "Artists",
    color: "text-primary border-primary/30 bg-primary/10",
    bullets: ["Get booked with structured offers", "See real payouts before accepting", "Accept or counter instantly"],
  },
  {
    key: "promoters",
    label: "Promoters",
    color: "text-role-promoter border-role-promoter/30 bg-role-promoter/10",
    bullets: ["Send structured offers in minutes", "Manage multiple deals at once", "Discover better-matched talent"],
  },
  {
    key: "venues",
    label: "Venues",
    color: "text-role-venue border-role-venue/30 bg-role-venue/10",
    bullets: ["Fill your calendar with real events", "Showcase your space to promoters", "Get discovered by touring artists"],
  },
  {
    key: "production",
    label: "Production",
    color: "text-role-production border-role-production/30 bg-role-production/10",
    bullets: ["Get hired for shows and festivals", "Join tours as crew", "Build credibility with verified gigs"],
  },
  {
    key: "creatives",
    label: "Photo / Video",
    color: "text-role-photo border-role-photo/30 bg-role-photo/10",
    bullets: ["Get booked for live content", "Deliver and track your work", "Build your portfolio with real shows"],
  },
];

export default function RoleValueSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="fade-in-section py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <span className="section-label">for every role</span>
          <h2 className="section-heading">built for all sides of live music</h2>
        </div>

        {/* Tab buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {ROLES.map((r, i) => (
            <button
              key={r.key}
              onClick={() => setActive(i)}
              className={`text-xs font-display font-bold px-4 py-2 rounded-full border transition-all ${
                active === i ? r.color : "text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="glass-card rounded-2xl border border-border p-8 min-h-[160px]">
          <ul className="space-y-3">
            {ROLES[active].bullets.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
                <span className="text-[15px] text-foreground/90 font-body">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
