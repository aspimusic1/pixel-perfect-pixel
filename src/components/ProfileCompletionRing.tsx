import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

type CheckItem = {
  label: string;
  key: string;
  weight: number;
  complete: boolean;
  section?: string;
};

const ACCENT = "#C8FF3E";

export default function ProfileCompletionRing() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();

  const items: CheckItem[] = useMemo(() => {
    if (!profile) return [];
    return [
      { label: "Profile photo", key: "avatar", weight: 15, complete: !!profile.avatar_url, section: "profile" },
      { label: "Bio", key: "bio", weight: 15, complete: !!profile.bio && profile.bio.length > 10, section: "profile" },
      { label: "Genre", key: "genre", weight: 15, complete: !!profile.genre, section: "profile" },
      { label: "Fee range", key: "fee", weight: 15, complete: (profile.rate_min ?? 0) > 0 || (profile.rate_max ?? 0) > 0, section: "profile" },
      { label: "Location", key: "location", weight: 10, complete: !!profile.city && !!profile.state, section: "profile" },
      { label: "Instagram", key: "instagram", weight: 10, complete: !!(profile as any).instagram, section: "profile" },
      { label: "Spotify", key: "spotify", weight: 10, complete: !!(profile as any).spotify, section: "profile" },
    ];
  }, [profile]);

  const score = useMemo(() => items.reduce((sum, i) => sum + (i.complete ? i.weight : 0), 0), [items]);
  const incomplete = items.filter((i) => !i.complete);

  // Persist score
  useEffect(() => {
    if (!user || !profile) return;
    if ((profile as any).completion_score !== score) {
      supabase.from("profiles").update({ completion_score: score } as any).eq("user_id", user.id).then(() => {});
    }
  }, [score, user, profile]);

  if (!profile || score === 100) return null;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#0e1420] p-5">
      <div className="flex items-start gap-5">
        {/* SVG Ring */}
        <div className="relative shrink-0 w-[96px] h-[96px]">
          <svg width="96" height="96" viewBox="0 0 96 96" className="transform -rotate-90">
            <circle cx="48" cy="48" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
            <circle
              cx="48" cy="48" r={radius}
              fill="none"
              stroke={ACCENT}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          {/* Avatar in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#1C2535] flex items-center justify-center">
                <span className="font-display font-bold text-lg text-foreground">
                  {(profile.display_name ?? "?")[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
          {/* Score label */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums" style={{ backgroundColor: ACCENT, color: "#080C14" }}>
            {score}%
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground mb-0.5">
            Your profile is <span className="font-display font-bold" style={{ color: ACCENT }}>{score}%</span> complete
          </p>
          <p className="text-[11px] text-muted-foreground mb-3">Complete your profile to get more offers</p>

          {incomplete.length > 0 && (
            <div className="space-y-1">
              {incomplete.map((item) => (
                <button
                  key={item.key}
                  onClick={() => navigate("/setup")}
                  className="flex items-center gap-2 text-[11px] text-muted-foreground hover:text-foreground transition-colors group w-full text-left"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[#C8FF3E]/50 transition-colors shrink-0" />
                  <span>Add {item.label.toLowerCase()}</span>
                  <span className="ml-auto text-[10px] tabular-nums opacity-50">+{item.weight}%</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
