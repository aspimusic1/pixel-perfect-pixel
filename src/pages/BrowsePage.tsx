import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import PageTransition from "@/components/PageTransition";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Music, Building2, User } from "lucide-react";

type ProfileCard = {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  genre: string | null;
  city: string | null;
  state: string | null;
  role: string | null;
  slug: string | null;
  is_verified: boolean | null;
  bio: string | null;
};

const ROLE_FILTERS = [
  { value: "all", label: "All" },
  { value: "artist", label: "Artists" },
  { value: "venue", label: "Venues" },
  { value: "promoter", label: "Promoters" },
  { value: "production", label: "Production" },
  { value: "photo_video", label: "Creatives" },
];

export default function BrowsePage() {
  const [profiles, setProfiles] = useState<ProfileCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchProfiles();
  }, [roleFilter]);

  async function fetchProfiles() {
    setLoading(true);
    let query = supabase
      .from("public_profiles")
      .select("id, user_id, display_name, avatar_url, genre, city, state, role, slug, is_verified, bio")
      .order("display_name", { ascending: true })
      .limit(60);

    if (roleFilter !== "all") {
      query = query.eq("role", roleFilter as "artist" | "promoter" | "venue" | "production" | "photo_video");
    }

    const { data } = await query;
    setProfiles((data as ProfileCard[]) || []);
    setLoading(false);
  }

  const filtered = profiles.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.display_name?.toLowerCase().includes(q) ||
      p.genre?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q)
    );
  });

  return (
    <PageTransition>
      <SEO
        title="Browse Directory | GetBooked.Live"
        description="Discover artists, venues, promoters, and production crews on GetBooked.Live. Search by genre, city, or role."
      />
      <div className="min-h-screen bg-background pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h1 className="font-syne text-3xl md:text-4xl font-bold text-foreground mb-2">
            Browse Artists & Venues
          </h1>
          <p className="text-muted-foreground mb-8 max-w-xl">
            Discover talent, venues, and crews across the live music industry.
          </p>

          {/* Search + Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, genre, or city…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-white/[0.06]"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {ROLE_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setRoleFilter(f.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    roleFilter === f.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground border border-white/[0.06] hover:text-foreground"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-card animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <User className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <Link
                  key={p.id}
                  to={p.slug ? `/p/${p.slug}` : `/p/${p.user_id}`}
                  className="group block rounded-xl bg-card border border-white/[0.06] p-5 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {p.avatar_url ? (
                      <img
                        src={p.avatar_url}
                        alt={p.display_name || "Profile"}
                        className="w-12 h-12 rounded-full object-cover"
                        loading="lazy"
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-lg">
                        {(p.display_name || "?")[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-syne font-semibold text-foreground truncate">
                          {p.display_name || "Unnamed"}
                        </h3>
                        {p.is_verified && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">✓</Badge>
                        )}
                      </div>
                      {p.genre && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Music className="w-3 h-3" />
                          {p.genre}
                        </div>
                      )}
                      {(p.city || p.state) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {[p.city, p.state].filter(Boolean).join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                  {p.bio && (
                    <p className="text-xs text-muted-foreground mt-3 line-clamp-2">{p.bio}</p>
                  )}
                  <div className="mt-3">
                    <Badge variant="outline" className="text-[10px] capitalize">
                      {p.role === "photo_video" ? "Creative" : p.role || "Artist"}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
