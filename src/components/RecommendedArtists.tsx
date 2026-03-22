import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";

type Recommendation = {
  user_id: string;
  display_name: string;
  genre: string | null;
  city: string | null;
  state: string | null;
  slug: string | null;
  avatar_url: string | null;
  rate_min: number | null;
  rate_max: number | null;
  reason: string;
  match_score: number;
};

export default function RecommendedArtists() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("recommend-artists");
        if (error) throw error;
        setRecs(data?.recommendations ?? []);
      } catch {
        // Silently fail — section just won't show
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (!loading && recs.length === 0) return null;

  return (
    <div className="mb-6 sm:mb-8">
      <h3 className="font-syne font-semibold text-sm mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" /> Recommended for You
      </h3>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
          <Loader2 className="w-4 h-4 animate-spin" /> Finding artists for you…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recs.map((rec) => (
            <Link
              key={rec.user_id}
              to={rec.slug ? `/p/${rec.slug}` : "/directory"}
              className="shrink-0 w-52 rounded-xl bg-card border border-border p-4 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-2">
                {rec.avatar_url ? (
                  <img src={rec.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {(rec.display_name || "?")[0]}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{rec.display_name}</p>
                  <p className="text-[10px] text-muted-foreground">{rec.genre} · {rec.city}</p>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] mb-2">
                {rec.match_score}% match
              </Badge>
              <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{rec.reason}</p>
              {rec.rate_min && (
                <p className="text-[10px] text-muted-foreground mt-1">
                  ${rec.rate_min?.toLocaleString()}–${rec.rate_max?.toLocaleString()}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
