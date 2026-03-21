import { MapPin, Star } from "lucide-react";

const SAMPLE_PROFILES = [
  { name: "Maya Chen", role: "artist", genre: "R&B / Neo-Soul", city: "Los Angeles, CA", rating: 4.9, draw: "800–1,200" },
  { name: "DJ Koda", role: "artist", genre: "Electronic", city: "Miami, FL", rating: 4.8, draw: "600–900" },
  { name: "The Velvet Union", role: "artist", genre: "Indie Rock", city: "Brooklyn, NY", rating: 4.7, draw: "400–700" },
  { name: "Prism Events", role: "promoter", genre: "EDM / Hip-Hop", city: "Atlanta, GA", rating: 4.9 },
  { name: "The Monarch", role: "venue", genre: "Capacity: 800", city: "Austin, TX", rating: 4.6 },
  { name: "SoundCraft Audio", role: "production", genre: "Full Production", city: "Nashville, TN", rating: 5.0 },
  { name: "Lens & Light Co", role: "photo_video", genre: "Live + Promo", city: "Portland, OR", rating: 4.8 },
  { name: "Arlo Washington", role: "artist", genre: "Jazz / Funk", city: "Chicago, IL", rating: 4.7, draw: "500–900" },
  { name: "NightOwl Presents", role: "promoter", genre: "Club / Festival", city: "Denver, CO", rating: 4.5 },
  { name: "The Glass House", role: "venue", genre: "Capacity: 1,200", city: "Phoenix, AZ", rating: 4.8 },
];

const roleColor: Record<string, string> = {
  artist: "bg-primary/15 text-primary",
  promoter: "bg-role-promoter/15 text-role-promoter",
  venue: "bg-role-venue/15 text-role-venue",
  production: "bg-role-production/15 text-role-production",
  photo_video: "bg-role-photo/15 text-role-photo",
};

const roleLabel: Record<string, string> = {
  artist: "artist",
  promoter: "promoter",
  venue: "venue",
  production: "production",
  photo_video: "photo/video",
};

export default function ProfileMarquee() {
  return (
    <section className="py-10 overflow-hidden">
      <p className="text-center text-[11px] tracking-[0.15em] uppercase text-muted-foreground mb-6 font-body">
        this could be your profile
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-28 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex animate-marquee hover:[animation-play-state:paused]" style={{ width: "max-content" }}>
          {[...SAMPLE_PROFILES, ...SAMPLE_PROFILES].map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-56 mx-2 rounded-xl bg-card border border-border p-4 hover:border-primary/20 transition-colors duration-300"
            >
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-display font-bold text-xs text-foreground">
                  {p.name[0]}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-display font-semibold truncate">{p.name}</h4>
                  <span className={`inline-block px-1.5 py-0.5 text-[9px] font-semibold rounded ${roleColor[p.role]}`}>
                    {roleLabel[p.role]}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mb-1">{p.genre}</p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{p.city}</span>
                <span className="flex items-center gap-0.5"><Star className="w-2.5 h-2.5 text-role-venue" />{p.rating}</span>
              </div>
              {p.draw && (
                <p className="text-[9px] text-primary/70 mt-1.5 font-body">avg draw: {p.draw}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
