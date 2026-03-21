import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Music, Globe, ExternalLink, Share2 } from "lucide-react";
import { toast } from "sonner";

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
  rate_min: number | null;
  rate_max: number | null;
};

const SITE_URL = "https://getbookedlive.lovable.app";
const SITE_NAME = "GetBooked.Live";

export default function ProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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
      } else {
        setProfile(data as unknown as ProfileData);
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
        <p className="text-muted-foreground">This artist doesn't exist or the link is broken.</p>
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
        {/* Avatar */}
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

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            {profile?.genre && (
              <span className="flex items-center gap-1">
                <Music className="w-3.5 h-3.5" />
                {profile.genre}
              </span>
            )}
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {location}
              </span>
            )}
          </div>

          {/* Social links */}
          <div className="flex items-center gap-2 mb-6">
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
          <div className="rounded-xl bg-card border border-white/[0.06] p-5 mb-6">
            <h2 className="font-syne text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">About</h2>
            <p className="text-sm text-foreground leading-relaxed" style={{ textWrap: "pretty" }}>{profile.bio}</p>
          </div>
        )}

        {/* Booking info */}
        {(profile?.rate_min != null || profile?.rate_max != null) && (
          <div className="rounded-xl bg-card border border-white/[0.06] p-5 mb-6">
            <h2 className="font-syne text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Fee Range</h2>
            <p className="font-syne text-xl font-bold">
              {profile.rate_min != null && profile.rate_max != null
                ? `$${profile.rate_min.toLocaleString()} – $${profile.rate_max.toLocaleString()}`
                : profile.rate_min != null
                  ? `From $${profile.rate_min.toLocaleString()}`
                  : `Up to $${profile.rate_max!.toLocaleString()}`}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-11 px-8 active:scale-[0.97] transition-transform">
            <a href={`/offer?recipient=${profile?.user_id}`}>
              <ExternalLink className="w-4 h-4 mr-2" /> Book {name}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
