import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Phone, Mail, Globe, Lock, ArrowRight } from "lucide-react";

type VenueListing = {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  region: string | null;
};

const REGIONS = [
  "", "Miami / South Florida", "Orlando & Tampa", "Atlanta", "Charlotte / Carolinas",
  "DMV — DC / MD / VA", "Philadelphia / Mid-Atlantic", "Tri-State — NY / NJ / CT",
  "Chicago & Suburbs", "Dallas / Fort Worth", "Houston", "Las Vegas", "Los Angeles",
  "San Francisco / Bay Area", "Phoenix", "Salt Lake City", "Columbus",
  "Gulf Port / Gulf Coast", "Indianapolis", "St. Louis",
];

export default function Venues() {
  const [venues, setVenues] = useState<VenueListing[]>([]);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const ref = useRef<HTMLDivElement>(null);

  // For now, "pro" access = any logged-in user with a profile
  // In production this would check a subscriptions table
  const hasPaidPlan = !!profile;

  useEffect(() => {
    const load = async () => {
      let query = supabase.from("venue_listings").select("*");
      if (regionFilter) query = query.eq("region", regionFilter);
      const { data } = await query.order("name", { ascending: true });
      setVenues((data as VenueListing[]) ?? []);
      setLoading(false);
    };
    load();
  }, [regionFilter]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    el.querySelectorAll("[data-reveal]").forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [venues]);

  const filtered = venues.filter((v) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      v.name.toLowerCase().includes(s) ||
      v.city?.toLowerCase().includes(s) ||
      v.state?.toLowerCase().includes(s) ||
      v.region?.toLowerCase().includes(s)
    );
  });

  const grouped = filtered.reduce<Record<string, VenueListing[]>>((acc, v) => {
    const key = v.region || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(v);
    return acc;
  }, {});

  return (
    <div ref={ref} className="min-h-screen pt-20 px-4 pb-12">
      <div className="container mx-auto max-w-5xl">
        {/* Upgrade banner for free users */}
        {!hasPaidPlan && (
          <div data-reveal className="fade-in-section mb-8 rounded-xl bg-primary/5 border border-primary/10 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-sm font-display font-semibold text-foreground">unlock venue contact info</p>
              <p className="text-xs text-muted-foreground font-body">
                upgrade to Pro or Business to see phone numbers, emails & websites
              </p>
            </div>
            <Link to="/pricing">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium lowercase h-8 active:scale-[0.97] transition-transform whitespace-nowrap">
                view plans <ArrowRight className="ml-1.5 w-3 h-3" />
              </Button>
            </Link>
          </div>
        )}

        <h1 data-reveal className="fade-in-section font-display text-3xl font-bold mb-2">venue directory</h1>
        <p data-reveal className="fade-in-section text-muted-foreground text-sm mb-8 font-body">
          46 venues across 20 U.S. markets. Contact info available for Pro & Business members.
        </p>

        {/* Search & region filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="search by venue name, city, or state..."
              className="pl-9 bg-card border-border font-body"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setRegionFilter("")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all active:scale-[0.97] ${
                !regionFilter
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Region chips - scrollable */}
        <div className="flex gap-1.5 overflow-x-auto pb-4 mb-2">
          {REGIONS.filter(Boolean).map((r) => (
            <button
              key={r}
              onClick={() => setRegionFilter(regionFilter === r ? "" : r)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all active:scale-[0.97] ${
                regionFilter === r
                  ? "bg-role-venue/15 text-role-venue border border-role-venue/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-36 rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="rounded-xl bg-card border border-border p-8 text-center">
            <p className="text-muted-foreground font-body">No venues found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([region, venueList]) => (
              <div key={region}>
                <h2 data-reveal className="fade-in-section font-display text-lg font-bold mb-3 text-foreground/80 lowercase">
                  {region}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {venueList.map((v) => (
                    <div
                      key={v.id}
                      data-reveal
                      className="fade-in-section rounded-xl bg-card border border-border p-4 hover:border-role-venue/20 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-role-venue/10 flex items-center justify-center shrink-0">
                          <MapPin className="w-4 h-4 text-role-venue" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-display font-semibold text-sm truncate">{v.name}</h3>
                          <p className="text-xs text-muted-foreground font-body">
                            {[v.city, v.state].filter(Boolean).join(", ")}
                          </p>
                        </div>
                      </div>

                      {v.address && v.address !== `${v.city}, ${v.state}` && (
                        <p className="text-[11px] text-muted-foreground/70 mb-2 font-body truncate">{v.address}</p>
                      )}

                      {/* Contact info — gated */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {v.phone && (
                          hasPaidPlan ? (
                            <a href={`tel:${v.phone}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs text-foreground hover:bg-secondary/80 transition-colors font-body">
                              <Phone className="w-3 h-3 text-role-venue" /> {v.phone}
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground font-body">
                              <Lock className="w-3 h-3" /> phone
                            </span>
                          )
                        )}
                        {v.email && (
                          hasPaidPlan ? (
                            <a href={`mailto:${v.email}`} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs text-foreground hover:bg-secondary/80 transition-colors font-body">
                              <Mail className="w-3 h-3 text-role-venue" /> {v.email}
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground font-body">
                              <Lock className="w-3 h-3" /> email
                            </span>
                          )
                        )}
                        {v.website && (
                          hasPaidPlan ? (
                            <a href={`https://${v.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-xs text-foreground hover:bg-secondary/80 transition-colors font-body">
                              <Globe className="w-3 h-3 text-role-venue" /> {v.website}
                            </a>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary/50 text-xs text-muted-foreground font-body">
                              <Lock className="w-3 h-3" /> website
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
