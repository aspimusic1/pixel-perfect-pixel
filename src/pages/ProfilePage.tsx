import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Music, Globe, ExternalLink, Share2, CalendarDays, Check, X, Send, Users, Star } from "lucide-react";
import { toast } from "sonner";
import { format, startOfToday, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import ShowNightMode from "@/components/ShowNightMode";
import TranslateButton from "@/components/TranslateButton";
import ReelDisplay from "@/components/ReelDisplay";
import TopTracksSection from "@/components/TopTracksSection";
import DemandMap from "@/components/DemandMap";
import { Download, Loader2 } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_name: string | null;
  reviewer_avatar: string | null;
};

type ProfileData = {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  bio: string | null;
  city: string | null;
  state: string | null;
  genre: string | null;
  role: string | null;
  website: string | null;
  instagram: string | null;
  spotify: string | null;
  apple_music: string | null;
  soundcloud: string | null;
  youtube: string | null;
  tiktok: string | null;
  bandcamp: string | null;
  beatport: string | null;
  bandsintown: string | null;
  songkick: string | null;
  facebook: string | null;
  twitter: string | null;
  threads: string | null;
  is_verified: boolean | null;
  slug: string | null;
  streaming_stats: {
    monthly_listeners?: number;
    followers?: number;
    top_city?: string;
    top_track?: string;
    top_tracks?: { name: string; album: string; album_art: string; popularity: number; spotify_url: string; uri: string }[];
    top_cities?: { city: string; listeners: number }[];
    source?: string;
  } | null;
  pitch_card_url: string | null;
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
  const [reviews, setReviews] = useState<Review[]>([]);

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

      // Fetch attendance stats for artists
      if (p.role === "artist" && p.user_id) {
        const { data: attendance } = await supabase
          .from("show_attendance" as any)
          .select("actual_attendance")
          .eq("artist_id", p.user_id);
        if (attendance && attendance.length >= 2) {
          const values = (attendance as any[]).map((a) => a.actual_attendance).sort((a: number, b: number) => a - b);
          const q1 = values[Math.floor(values.length * 0.25)];
          const q3 = values[Math.floor(values.length * 0.75)];
          setAttendanceStats({ avg_min: q1, avg_max: q3, shows: values.length });
        }
      }

      // Fetch reviews where this user is the reviewee
      if (p.user_id) {
        const { data: reviewData } = await supabase
          .from("reviews" as any)
          .select("id, rating, comment, created_at, reviewer_id")
          .eq("reviewee_id", p.user_id)
          .order("created_at", { ascending: false })
          .limit(10);
        if (reviewData && reviewData.length > 0) {
          // Fetch reviewer profiles
          const reviewerIds = [...new Set((reviewData as any[]).map((r: any) => r.reviewer_id))];
          const { data: reviewerProfiles } = await supabase
            .from("public_profiles" as any)
            .select("user_id, display_name, avatar_url")
            .in("user_id", reviewerIds);
          const profileMap = new Map((reviewerProfiles as any[] || []).map((p: any) => [p.user_id, p]));
          setReviews((reviewData as any[]).map((r: any) => ({
            id: r.id,
            rating: r.rating,
            comment: r.comment,
            created_at: r.created_at,
            reviewer_name: profileMap.get(r.reviewer_id)?.display_name || "Anonymous",
            reviewer_avatar: profileMap.get(r.reviewer_id)?.avatar_url || null,
          })));
        }
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
        <div className="container mx-auto max-w-2xl flex flex-col items-center">
          <Skeleton className="w-28 h-28 rounded-full mb-6" />
          <Skeleton className="h-7 w-48 mb-3" />
          <Skeleton className="h-4 w-64 mb-2" />
          <div className="flex gap-2 mt-4">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
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
        {/* Banner */}
        {profile?.banner_url && (
          <div className="w-full h-40 sm:h-52 rounded-2xl overflow-hidden border border-white/[0.06] mb-6 -mt-4">
            <img src={profile.banner_url} alt={`${name} banner`} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Hero section */}
        <div className="flex flex-col items-center mb-8">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={`${name} profile photo`}
              className={cn("w-28 h-28 rounded-full object-cover border-2 border-white/[0.06] mb-4", profile?.banner_url && "-mt-20 ring-4 ring-background")}
            />
          ) : (
            <div className={cn("w-28 h-28 rounded-full bg-card border border-white/[0.06] flex items-center justify-center text-3xl font-syne font-bold text-muted-foreground mb-4", profile?.banner_url && "-mt-20 ring-4 ring-background")}>
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

          {/* Attendance stats */}
          {attendanceStats && profile?.role === "artist" && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-[#FFB83E]/10 border border-[#FFB83E]/20">
              <Users className="w-4 h-4 text-[#FFB83E]" />
              <span className="text-xs font-medium text-[#FFB83E]">
                Average draw: {attendanceStats.avg_min.toLocaleString()}–{attendanceStats.avg_max.toLocaleString()}
              </span>
              <span className="text-[10px] text-muted-foreground">({attendanceStats.shows} shows)</span>
            </div>
          )}

          {/* Social & music links */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
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
            {profile?.apple_music && (
              <a href={profile.apple_music} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                Apple Music
              </a>
            )}
            {profile?.soundcloud && (
              <a href={profile.soundcloud} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                SoundCloud
              </a>
            )}
            {profile?.youtube && (
              <a href={profile.youtube} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                YouTube
              </a>
            )}
            {profile?.tiktok && (
              <a href={profile.tiktok.startsWith("http") ? profile.tiktok : `https://tiktok.com/@${profile.tiktok.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                TikTok
              </a>
            )}
            {profile?.bandcamp && (
              <a href={profile.bandcamp} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                Bandcamp
              </a>
            )}
            {profile?.beatport && (
              <a href={profile.beatport} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                Beatport
              </a>
            )}
            {profile?.bandsintown && (
              <a href={profile.bandsintown} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                Bandsintown
              </a>
            )}
            {profile?.songkick && (
              <a href={profile.songkick} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                Songkick
              </a>
            )}
            {profile?.facebook && (
              <a href={profile.facebook} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                Facebook
              </a>
            )}
            {profile?.twitter && (
              <a href={profile.twitter} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                X / Twitter
              </a>
            )}
            {profile?.threads && (
              <a href={profile.threads} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-muted-foreground hover:text-foreground transition-colors">
                Threads
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

        {/* Streaming Stats */}
        {profile?.streaming_stats && (profile.streaming_stats.monthly_listeners || profile.streaming_stats.top_track) && (
          <div className="rounded-xl bg-card border border-white/[0.06] p-4 mb-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
              {profile.streaming_stats.monthly_listeners && (
                <span className="text-foreground font-display font-semibold tabular-nums">
                  {profile.streaming_stats.monthly_listeners >= 1_000_000
                    ? `${(profile.streaming_stats.monthly_listeners / 1_000_000).toFixed(1)}M`
                    : profile.streaming_stats.monthly_listeners >= 1_000
                    ? `${(profile.streaming_stats.monthly_listeners / 1_000).toFixed(0)}K`
                    : profile.streaming_stats.monthly_listeners} monthly listeners
                </span>
              )}
              {profile.streaming_stats.top_city && (
                <span className="text-muted-foreground">Top city: <span className="text-foreground">{profile.streaming_stats.top_city}</span></span>
              )}
              {profile.streaming_stats.top_track && (
                <span className="text-muted-foreground">#1 track: <span className="text-foreground font-medium">{profile.streaming_stats.top_track}</span></span>
              )}
              {profile.streaming_stats.source === "spotify_api" && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-white/[0.06]" style={{ color: "#1DB954" }}>
                  ✓ Spotify verified
                </span>
              )}
            </div>
          </div>
        )}

        {profile?.role === "artist" && profile?.user_id && (
          <ReelDisplay userId={profile.user_id} />
        )}

        {/* Top Tracks */}
        {profile?.role === "artist" && (
          <TopTracksSection
            tracks={(profile.streaming_stats as any)?.top_tracks ?? []}
            spotifyUrl={profile.spotify}
          />
        )}

        {/* Demand Map */}
        {profile?.role === "artist" && (profile.streaming_stats as any)?.top_cities && (
          <DemandMap cities={(profile.streaming_stats as any).top_cities} />
        )}

        {/* Download EPK */}
        {profile?.role === "artist" && (profile as any)?.pitch_card_url && (
          <div className="mb-4">
            <a href={(profile as any).pitch_card_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="h-8 text-xs border-white/[0.06] hover:bg-white/5 active:scale-[0.97]">
                <Download className="w-3 h-3 mr-1.5" /> Download EPK
              </Button>
            </a>
          </div>
        )}

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

        {/* Reviews */}
        {reviews.length > 0 && (
          <div className="rounded-xl bg-card border border-white/[0.06] p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-primary" />
              <h2 className="font-syne text-sm font-semibold text-muted-foreground uppercase tracking-wider">Reviews</h2>
              <span className="text-xs text-muted-foreground ml-auto">
                {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)} avg · {reviews.length} review{reviews.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="flex gap-3">
                  {r.reviewer_avatar ? (
                    <img src={r.reviewer_avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-syne font-bold text-muted-foreground flex-shrink-0">
                      {(r.reviewer_name ?? "A").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium truncate">{r.reviewer_name}</span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              i < r.rating ? "text-primary fill-primary" : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground ml-auto flex-shrink-0">
                        {format(new Date(r.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                    {r.comment && (
                      <p className="text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                    )}
                  </div>
                </div>
              ))}
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
