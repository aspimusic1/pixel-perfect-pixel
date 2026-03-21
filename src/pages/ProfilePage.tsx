import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Music, Globe, ExternalLink, Share2, CalendarDays, Check, X, Send } from "lucide-react";
import { toast } from "sonner";
import { format, startOfToday, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import ShowNightMode from "@/components/ShowNightMode";
import TranslateButton from "@/components/TranslateButton";
import ReelDisplay from "@/components/ReelDisplay";

type ProfileData = {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  genre: string | null;
  role: string | null;
  website: string | null;
  instagram: string | null;
  spotify: string | null;
  is_verified: boolean | null;
  slug: string | null;
};

type AvailDate = { date: string; is_available: boolean };
type AttendanceStats = { avg_min: number; avg_max: number; shows: number };
const SITE_URL = "https://getbookedlive.lovable.app";
const SITE_NAME = "GetBooked.Live";

const roleColorMap: Record<string, string> = {
  artist: "bg-role-artist/10 text-role-artist border-role-artist/20",
  promoter: "bg-role-promoter/10 text-role-promoter border-role-promoter/20",
  venue: "bg-role-venue/10 text-role-venue border-role-venue/20",
  production: "bg-role-production/10 text-role-production border-role-production/20",
  photo_video: "bg-role-photo/10 text-role-photo border-role-photo/20",
};

export default function ProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [availability, setAvailability] = useState<AvailDate[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      const { data, error } = await supabase
        .from("public_profiles")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const p = data as unknown as ProfileData;
      setProfile(p);

      // Fetch availability for artists
      if (p.role === "artist" && p.user_id) {
        const today = format(startOfToday(), "yyyy-MM-dd");
        const { data: avail } = await supabase
          .from("artist_availability")
          .select("date, is_available")
          .eq("artist_id", p.user_id)
          .gte("date", today)
          .order("date")
          .limit(14);
        setAvailability((avail as AvailDate[]) ?? []);
      }

      setLoading(false);
    };
    load();
  }, [slug]);

  const handleShare = () => {
    const url = `${SITE_URL}/p/${profile?.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Profile link copied!");
  };

  // SEO values
  const name = profile?.display_name ?? "Artist";
  const locationParts = [profile?.city, profile?.state].filter(Boolean);
  const location = locationParts.length > 0 ? locationParts.join(", ") : null;
  const pageTitle = `${name} — ${profile?.genre ?? "Artist"} | ${SITE_NAME}`;
  const pageDescription = [
    `Book ${name}`,
    profile?.genre ? `(${profile.genre})` : null,
    location ? `based in ${location}` : null,
    "on GetBooked.Live — the music booking marketplace.",
  ]
    .filter(Boolean)
    .join(" ");
  const canonicalUrl = `${SITE_URL}/p/${profile?.slug ?? slug}`;
  const ogImage = profile?.avatar_url ?? `${SITE_URL}/og-default.png`;

  const genres = profile?.genre?.split(",").map((g) => g.trim()).filter(Boolean) ?? [];
  const isOwnProfile = user?.id === profile?.user_id;

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="h-32 w-32 rounded-full bg-card animate-pulse mx-auto mb-6" />
          <div className="h-8 w-48 bg-card animate-pulse mx-auto mb-3 rounded-lg" />
          <div className="h-4 w-64 bg-card animate-pulse mx-auto rounded-lg" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center">
        <Helmet>
          <title>Profile Not Found | {SITE_NAME}</title>
        </Helmet>
        <h1 className="font-syne text-2xl font-bold mb-2">Profile not found</h1>
        <p className="text-muted-foreground">This profile doesn't exist or the link is broken.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4 pb-16">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Helmet>

      <div className="container mx-auto max-w-2xl">
        {/* Hero section */}
        <div className="flex flex-col items-center mb-8">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={`${name} profile photo`}
              className="w-28 h-28 rounded-full object-cover border-2 border-white/[0.06] mb-4"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-card border border-white/[0.06] flex items-center justify-center text-3xl font-syne font-bold text-muted-foreground mb-4">
              {name.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex items-center gap-2 mb-1">
            <h1 className="font-syne text-2xl font-bold">{name}</h1>
            {profile?.is_verified && (
              <Badge className="bg-[hsl(var(--role-venue))]/10 text-[hsl(var(--role-venue))] border-[hsl(var(--role-venue))]/20 text-xs">
                Verified
              </Badge>
            )}
          </div>

          {/* Role badge */}
          {profile?.role && (
            <Badge variant="outline" className={cn("text-xs mb-2 capitalize", roleColorMap[profile.role] ?? "")}>
              {profile.role.replace("_", "/")}
            </Badge>
          )}

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {location}
              </span>
            )}
          </div>

          {/* Genre pills */}
          {genres.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mb-4">
              {genres.map((g) => (
                <span key={g} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Social links */}
          <div className="flex items-center gap-2 mb-2">
            {profile?.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="w-3.5 h-3.5" /> Website
              </a>
            )}
            {profile?.instagram && (
              <a href={`https://instagram.com/${profile.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                Instagram
              </a>
            )}
            {profile?.spotify && (
              <a href={profile.spotify} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                Spotify
              </a>
            )}
            <button onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors active:scale-[0.97]">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
          </div>
        </div>

        {/* Bio */}
        {profile?.bio && (
          <div className="rounded-xl bg-card border border-white/[0.06] p-5 mb-4">
            <h2 className="font-syne text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">About</h2>
            <p className="text-sm text-foreground leading-relaxed" style={{ textWrap: "pretty" }}>{profile.bio}</p>
            <TranslateButton text={profile.bio} className="mt-2" />
          </div>
        )}

        {/* Performance Reel */}
        {profile?.role === "artist" && profile?.user_id && (
          <ReelDisplay userId={profile.user_id} />
        )}

        {/* Show Night Mode — auto-activates on booking day */}
        {profile?.role === "artist" && profile?.user_id && (
          <ShowNightMode
            artistUserId={profile.user_id}
            artistName={name}
            isOwner={isOwnProfile}
          />
        )}

        {/* Availability strip */}
        {profile?.role === "artist" && availability.length > 0 && (
          <div className="rounded-xl bg-card border border-white/[0.06] p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <CalendarDays className="w-4 h-4 text-primary" />
              <h2 className="font-syne text-sm font-semibold text-muted-foreground uppercase tracking-wider">Upcoming Availability</h2>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {availability.map((a) => {
                const d = new Date(a.date + "T00:00:00");
                return (
                  <div
                    key={a.date}
                    className={cn(
                      "flex-shrink-0 w-14 rounded-lg border text-center py-2 transition-colors",
                      a.is_available
                        ? "bg-green-500/10 border-green-500/20 text-green-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                    )}
                  >
                    <div className="text-[10px] font-medium uppercase opacity-70">
                      {format(d, "EEE")}
                    </div>
                    <div className="text-sm font-bold">{format(d, "d")}</div>
                    <div className="text-[10px] uppercase opacity-70">{format(d, "MMM")}</div>
                    <div className="mt-0.5">
                      {a.is_available ? (
                        <Check className="w-3 h-3 mx-auto" />
                      ) : (
                        <X className="w-3 h-3 mx-auto" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500/40" /> Available
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500/40" /> Unavailable
              </span>
            </div>
          </div>
        )}

        {/* CTA */}
        {!isOwnProfile && profile?.role === "artist" && (
          <div className="text-center mt-6">
            <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-12 px-10 text-base active:scale-[0.97] transition-transform">
              <Link to={`/offer?artist=${profile?.user_id}`}>
                <Send className="w-4 h-4 mr-2" /> Send Booking Offer
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
