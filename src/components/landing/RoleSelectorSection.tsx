import { useNavigate } from "react-router-dom";
import { Music, Megaphone, Building2, SlidersHorizontal, Camera } from "lucide-react";

const ROLES = [
  { key: "artist", label: "Artist", icon: Music, emoji: "🎵", desc: "Get booked and grow your fanbase", color: "text-primary border-primary/20 hover:border-primary/40" },
  { key: "promoter", label: "Promoter", icon: Megaphone, emoji: "📣", desc: "Find and book the right talent", color: "text-role-promoter border-role-promoter/20 hover:border-role-promoter/40" },
  { key: "venue", label: "Venue", icon: Building2, emoji: "🏛", desc: "Fill your calendar with real events", color: "text-role-venue border-role-venue/20 hover:border-role-venue/40" },
  { key: "production", label: "Production", icon: SlidersHorizontal, emoji: "🎚", desc: "Get hired for shows and tours", color: "text-role-production border-role-production/20 hover:border-role-production/40" },
  { key: "photo_video", label: "Photo / Video", icon: Camera, emoji: "📷", desc: "Book gigs and build your portfolio", color: "text-role-photo border-role-photo/20 hover:border-role-photo/40" },
];

export default function RoleSelectorSection() {
  const navigate = useNavigate();

  const handleSelect = (role: string) => {
    localStorage.setItem("selectedRole", role);
    navigate("/auth?tab=signup");
  };

  return (
    <section className="fade-in-section py-16 sm:py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="section-heading">who are you?</h2>
          <p className="section-subtext mx-auto">pick your role to get started.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {ROLES.map((r) => (
            <button
              key={r.key}
              onClick={() => handleSelect(r.key)}
              className={`glass-card p-5 text-left rounded-xl border transition-all duration-200 hover:-translate-y-1 active:scale-[0.97] group ${r.color}`}
            >
              <div className="text-2xl mb-3">{r.emoji}</div>
              <p className="font-display font-bold text-sm text-foreground mb-1">{r.label}</p>
              <p className="text-[12px] text-muted-foreground font-body leading-relaxed">{r.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
