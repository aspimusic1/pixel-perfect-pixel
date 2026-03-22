import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2, Mic2, Megaphone, Building2, Wrench, Camera as CameraIcon } from "lucide-react";
import { toast } from "sonner";
import ReelUploader from "@/components/ReelUploader";

const ROLE_META: Record<string, { icon: any; label: string; accent: string; stepLabel: string }> = {
  artist: { icon: Mic2, label: "Artist", accent: "text-[hsl(var(--role-artist))]", stepLabel: "Set up your artist profile" },
  promoter: { icon: Megaphone, label: "Promoter", accent: "text-[hsl(var(--role-promoter))]", stepLabel: "Set up your promoter profile" },
  venue: { icon: Building2, label: "Venue", accent: "text-[hsl(var(--role-venue))]", stepLabel: "Set up your venue profile" },
  production: { icon: Wrench, label: "Production", accent: "text-[hsl(var(--role-production))]", stepLabel: "Set up your production profile" },
  photo_video: { icon: CameraIcon, label: "Photo/Video", accent: "text-[hsl(var(--role-photo))]", stepLabel: "Set up your creative profile" },
};

export default function ProfileSetup() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const role = profile?.role ?? "artist";
  const meta = ROLE_META[role] ?? ROLE_META.artist;
  const RoleIcon = meta.icon;

  // Shared fields
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [state, setState] = useState(profile?.state ?? "");
  const [timezone, setTimezone] = useState("America/New_York");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Artist-specific
  const [genre, setGenre] = useState(profile?.genre ?? "");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [spotify, setSpotify] = useState("");
  const [rateMin, setRateMin] = useState(profile?.rate_min?.toString() ?? "");
  const [rateMax, setRateMax] = useState(profile?.rate_max?.toString() ?? "");
  // Promoter-specific
  const [companyName, setCompanyName] = useState("");
  const [eventTypes, setEventTypes] = useState("");
  // Venue-specific
  const [venueName, setVenueName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [amenities, setAmenities] = useState("");
  // Production-specific
  const [productionType, setProductionType] = useState("");
  const [crewSize, setCrewSize] = useState("");
  // Photo/Video-specific
  const [specialty, setSpecialty] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = urlData.publicUrl + `?t=${Date.now()}`;
      setAvatarUrl(publicUrl);
      await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("user_id", user.id);
      toast.success("Photo uploaded!");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const baseUpdate: Record<string, any> = {
        bio, city, state, profile_complete: true,
        avatar_url: avatarUrl || null, timezone,
      };

      // Add role-specific fields
      if (role === "artist") {
        baseUpdate.genre = genre;
        baseUpdate.website = website || null;
        baseUpdate.instagram = instagram || null;
        baseUpdate.spotify = spotify || null;
        baseUpdate.rate_min = rateMin ? parseFloat(rateMin) : null;
        baseUpdate.rate_max = rateMax ? parseFloat(rateMax) : null;
      }

      if (role === "venue" && venueName.trim()) {
        baseUpdate.display_name = venueName.trim();
      }

      const { error } = await supabase
        .from("profiles")
        .update(baseUpdate as any)
        .eq("user_id", user.id);
      if (error) throw error;

      // Save venue listing if venue role
      if (role === "venue" && venueName.trim()) {
        const { error: venueError } = await supabase
          .from("venue_listings")
          .upsert(
            {
              name: venueName.trim(),
              city: city || null,
              state: state || null,
              capacity: capacity ? parseInt(capacity) : null,
              amenities: amenities ? amenities.split(",").map((a) => a.trim()).filter(Boolean) : null,
              description: bio || null,
              claimed_by: user.id,
              claim_status: "approved",
            } as any,
            { onConflict: "claimed_by" }
          );
        if (venueError) {
          toast.error("Profile saved, but venue listing failed: " + venueError.message);
        }
      }
      await refreshProfile();
      toast.success("Profile saved!");

      // Route to role-appropriate dashboard
      const dashboardMap: Record<string, string> = {
        artist: "/artist-dashboard",
        promoter: "/promoter-dashboard",
        venue: "/venue-manage",
        production: "/artist-dashboard",
        photo_video: "/artist-dashboard",
      };
      navigate(dashboardMap[role] || "/artist-dashboard");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initials = (profile?.display_name ?? "?")[0].toUpperCase();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-lg">
        {/* Role-aware header */}
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meta.accent.replace("text-", "bg-")}/10`}>
            <RoleIcon className={`w-5 h-5 ${meta.accent}`} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">{meta.stepLabel}</h1>
            <p className="text-muted-foreground text-sm">Tell us a bit about yourself to get started.</p>
          </div>
        </div>

        <div className="rounded-xl bg-card border border-border p-6 mt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Avatar upload */}
            <div className="flex flex-col items-center mb-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="relative w-20 h-20 rounded-full bg-secondary border-2 border-border hover:border-primary/30 transition-colors overflow-hidden group active:scale-[0.97]"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-display font-bold text-2xl text-foreground">{initials}</span>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
                </div>
              </button>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleAvatarUpload} className="hidden" />
              <p className="text-[11px] text-muted-foreground mt-2 font-body">click to upload photo</p>
            </div>

            {/* Bio — all roles */}
            <div>
              <Label className="text-sm">Bio</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder={
                role === "artist" ? "Tell promoters about your sound, style, and live show energy..." :
                role === "promoter" ? "Describe your events, markets, and what artists can expect..." :
                role === "venue" ? "Describe your space, vibe, and what makes it special..." :
                role === "production" ? "Share your experience, gear, and specialties..." :
                "Tell people about your style, equipment, and past work..."
              } className="mt-1.5 bg-background border-border" rows={3} />
            </div>

            {/* Location — all roles */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">City</Label>
                <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Nashville" className="mt-1.5 bg-background border-border" />
              </div>
              <div>
                <Label className="text-sm">State</Label>
                <Input value={state} onChange={(e) => setState(e.target.value)} placeholder="TN" className="mt-1.5 bg-background border-border" />
              </div>
            </div>

            {/* ── ARTIST-SPECIFIC ── */}
            {role === "artist" && (
              <>
                <div>
                  <Label className="text-sm">Genre</Label>
                  <Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Rock, Hip-Hop, Country..." className="mt-1.5 bg-background border-border" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Min fee ($)</Label>
                    <Input type="number" value={rateMin} onChange={(e) => setRateMin(e.target.value)} placeholder="500" className="mt-1.5 bg-background border-border" />
                  </div>
                  <div>
                    <Label className="text-sm">Max fee ($)</Label>
                    <Input type="number" value={rateMax} onChange={(e) => setRateMax(e.target.value)} placeholder="5,000" className="mt-1.5 bg-background border-border" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Website</Label>
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yoursite.com" className="mt-1.5 bg-background border-border" />
                </div>
                <div>
                  <Label className="text-sm">Instagram</Label>
                  <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@yourhandle" className="mt-1.5 bg-background border-border" />
                </div>
                <div>
                  <Label className="text-sm">Spotify</Label>
                  <Input value={spotify} onChange={(e) => setSpotify(e.target.value)} placeholder="https://open.spotify.com/artist/..." className="mt-1.5 bg-background border-border" />
                </div>
              </>
            )}

            {/* ── PROMOTER-SPECIFIC ── */}
            {role === "promoter" && (
              <>
                <div>
                  <Label className="text-sm">Company / Organization</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Live Nation, independent, etc." className="mt-1.5 bg-background border-border" />
                </div>
                <div>
                  <Label className="text-sm">Event types you book</Label>
                  <Input value={eventTypes} onChange={(e) => setEventTypes(e.target.value)} placeholder="Concerts, festivals, private events..." className="mt-1.5 bg-background border-border" />
                </div>
              </>
            )}

            {/* ── VENUE-SPECIFIC ── */}
            {role === "venue" && (
              <>
                <div>
                  <Label className="text-sm">Venue name</Label>
                  <Input value={venueName} onChange={(e) => setVenueName(e.target.value)} placeholder="The Ryman, House of Blues..." className="mt-1.5 bg-background border-border" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Capacity</Label>
                    <Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="500" className="mt-1.5 bg-background border-border" />
                  </div>
                  <div>
                    <Label className="text-sm">Amenities</Label>
                    <Input value={amenities} onChange={(e) => setAmenities(e.target.value)} placeholder="Green room, PA, lighting..." className="mt-1.5 bg-background border-border" />
                  </div>
                </div>
              </>
            )}

            {/* ── PRODUCTION-SPECIFIC ── */}
            {role === "production" && (
              <>
                <div>
                  <Label className="text-sm">Production type</Label>
                  <Input value={productionType} onChange={(e) => setProductionType(e.target.value)} placeholder="Sound engineer, lighting, stage manager..." className="mt-1.5 bg-background border-border" />
                </div>
                <div>
                  <Label className="text-sm">Crew size</Label>
                  <Input value={crewSize} onChange={(e) => setCrewSize(e.target.value)} placeholder="Solo, 2-3, full crew..." className="mt-1.5 bg-background border-border" />
                </div>
              </>
            )}

            {/* ── PHOTO/VIDEO-SPECIFIC ── */}
            {role === "photo_video" && (
              <>
                <div>
                  <Label className="text-sm">Specialty</Label>
                  <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="Concert photography, music videos, live stream..." className="mt-1.5 bg-background border-border" />
                </div>
                <div>
                  <Label className="text-sm">Portfolio URL</Label>
                  <Input value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://yourportfolio.com" className="mt-1.5 bg-background border-border" />
                </div>
              </>
            )}

            {/* Timezone — all roles */}
            <div>
              <Label className="text-sm">Timezone</Label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="mt-1.5 w-full h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground"
              >
                {["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Anchorage", "Pacific/Honolulu", "Europe/London", "Europe/Berlin", "America/Sao_Paulo", "Asia/Tokyo", "Australia/Sydney"].map((tz) => (
                  <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>

            {/* Reel uploader — artists only */}
            {role === "artist" && (
              <div className="pt-2 border-t border-border">
                <ReelUploader />
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-11 active:scale-[0.97] transition-transform">
              {loading ? "Saving..." : "Save & continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
