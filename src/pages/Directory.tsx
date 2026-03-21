import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Send, ArrowRight, Mic2, Calendar } from "lucide-react";

type Profile = {
  id: string;
  user_id: string;
  display_name: string | null;
  role: string | null;
  city: string | null;
  state: string | null;
  genre: string | null;
  bio: string | null;
  avatar_url: string | null;
};

type ArtistListing = {
  id: string;
  name: string;
  genre: string | null;
  upcoming_concerts: number;
};

const ROLE_TABS = [
  { value: "", label: "All" },
  { value: "artist", label: "Artists" },
  { value: "promoter", label: "Promoters" },
  { value: "venue", label: "Venues" },
  { value: "production", label: "Production" },
  { value: "photo_video", label: "Photo/Video" },
];

const roleColorMap: Record<string, string> = {
  artist: "bg-role-artist/10 text-role-artist",
  promoter: "bg-role-promoter/10 text-role-promoter",
  venue: "bg-role-venue/10 text-role-venue",
  production: "bg-role-production/10 text-role-production",
  photo_video: "bg-role-photo/10 text-role-photo",
};

export default function Directory() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [artistListings, setArtistListings] = useState<ArtistListing[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // Fetch user profiles
      let profileQuery = supabase.from("profiles").select("*").eq("profile_complete", true);
      if (roleFilter) profileQuery = profileQuery.eq("role", roleFilter as any);
      const { data: profileData } = await profileQuery.order("created_at", { ascending: false });
      setProfiles((profileData as Profile[]) ?? []);

      // Fetch artist listings (only when showing "All" or "Artists")
      if (!roleFilter || roleFilter === "artist") {
        const { data: artistData } = await supabase
          .from("artist_listings")
          .select("*")
          .order("upcoming_concerts", { ascending: false });
        setArtistListings((artistData as ArtistListing[]) ?? []);
      } else {
        setArtistListings([]);
      }

      setLoading(false);
    };
    load();
  }, [roleFilter]);

  useEffect(() => {
    const el = ref.current;
    if (!el || loading) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    el.querySelectorAll("[data-reveal]").forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [loading, profiles, artistListings]);

  const filteredProfiles = profiles.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      p.display_name?.toLowerCase().includes(s) ||
      p.city?.toLowerCase().includes(s) ||
      p.genre?.toLowerCase().includes(s)
    );
  });

  const filteredArtists = artistListings.filter((a) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(s) ||
      a.genre?.toLowerCase().includes(s)
    );
  });

  const hasResults = filteredProfiles.length > 0 || filteredArtists.length > 0;

  return (
    <div ref={ref} className="min-h-screen pt-20 px-4 pb-12">
      <div className="container mx-auto max-w-5xl">
        {/* CTA Banner */}
        <div className="mb-8 rounded-xl bg-primary/5 border border-primary/10 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground font-body">
            <span className="text-foreground font-medium">make your profile today</span> — get discovered by promoters, venues, and production teams
          </p>
          <Link to="/auth?tab=signup">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium lowercase h-8 active:scale-[0.97] transition-transform whitespace-nowrap">
              get started free <ArrowRight className="ml-1.5 w-3 h-3" />
            </Button>
          </Link>
        </div>

        <h1 className="font-display text-3xl font-bold mb-2">Directory</h1>
        <p className="text-muted-foreground text-sm mb-8 font-body">Discover artists, venues, crew, and more.</p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search by name, city, or genre..."
              className="pl-9 bg-card border-border font-body"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {ROLE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setRoleFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all active:scale-[0.97] ${
                  roleFilter === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="h-40 rounded-xl bg-card animate-pulse" />)}
          </div>
        ) : !hasResults ? (
          <div className="rounded-xl bg-card border border-border p-8 text-center">
            <p className="text-muted-foreground font-body">No profiles found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* User profiles */}
            {filteredProfiles.length > 0 && (
              <div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProfiles.map((p) => (
                    <div key={p.id} data-reveal className="fade-in-section rounded-xl bg-card border border-border p-5 hover:border-primary/20 transition-all duration-300">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-display font-bold text-sm text-foreground shrink-0">
                          {(p.display_name ?? "?")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display font-semibold text-sm truncate">{p.display_name}</h3>
                          {p.role && (
                            <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded mt-1 ${roleColorMap[p.role] ?? ""}`}>
                              {p.role === "photo_video" ? "Photo/Video" : p.role.charAt(0).toUpperCase() + p.role.slice(1)}
                            </span>
                          )}
                        </div>
                      </div>
                      {p.bio && <p className="text-xs text-muted-foreground line-clamp-2 mb-2 font-body">{p.bio}</p>}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
                          {(p.city || p.state) && (
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{[p.city, p.state].filter(Boolean).join(", ")}</span>
                          )}
                          {p.genre && <span>{p.genre}</span>}
                        </div>
                        {p.role === "artist" && (
                          <Link to={`/offer?artist=${p.user_id}`}>
                            <Button size="sm" variant="outline" className="h-7 text-xs border-primary/30 text-primary hover:bg-primary/10 active:scale-[0.97] transition-transform">
                              <Send className="w-3 h-3 mr-1" /> Book
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Artist listings from imported data */}
            {filteredArtists.length > 0 && (
              <div>
                <h2 data-reveal className="fade-in-section font-display text-lg font-bold mb-3 text-foreground/80 lowercase">
                  artists on tour — {filteredArtists.length} artists
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredArtists.map((a) => (
                    <div
                      key={a.id}
                      data-reveal
                      className="fade-in-section rounded-xl bg-card border border-border p-4 hover:border-role-artist/20 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-role-artist/10 flex items-center justify-center shrink-0">
                          <Mic2 className="w-4 h-4 text-role-artist" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display font-semibold text-sm truncate">{a.name}</h3>
                          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded mt-1 bg-role-artist/10 text-role-artist">
                            Artist
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
                          {a.genre && <span>{a.genre}</span>}
                          {a.upcoming_concerts > 0 && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {a.upcoming_concerts} shows
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
