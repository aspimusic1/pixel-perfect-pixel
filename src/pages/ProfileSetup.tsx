import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReelUploader from "@/components/ReelUploader";

export default function ProfileSetup() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [state, setState] = useState(profile?.state ?? "");
  const [genre, setGenre] = useState(profile?.genre ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      const publicUrl = urlData.publicUrl + `?t=${Date.now()}`;
      setAvatarUrl(publicUrl);

      await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("user_id", user.id);

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
      const { error } = await supabase
        .from("profiles")
        .update({ bio, city, state, genre, profile_complete: true, avatar_url: avatarUrl || null, timezone } as any)
        .eq("user_id", user.id);
      if (error) throw error;
      await refreshProfile();
      toast.success("Profile saved!");
      navigate(profile?.role === "promoter" ? "/promoter-dashboard" : "/artist-dashboard");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const initials = (profile?.display_name ?? "?")[0].toUpperCase();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-lg">
        <h1 className="font-display text-2xl font-bold mb-2">Complete your profile</h1>
        <p className="text-muted-foreground text-sm mb-6">Tell us a bit about yourself to get started.</p>
        <div className="rounded-xl bg-card border border-border p-6">
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
                  {uploading ? (
                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-white" />
                  )}
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <p className="text-[11px] text-muted-foreground mt-2 font-body">click to upload photo</p>
            </div>

            <div>
              <Label className="text-sm">Bio</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short description..." className="mt-1.5 bg-background border-border" rows={3} />
            </div>
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
            {(profile?.role === "artist" || !profile?.role) && (
              <div>
                <Label className="text-sm">Genre</Label>
                <Input value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Rock, Hip-Hop, Country..." className="mt-1.5 bg-background border-border" />
              </div>
            )}
            {/* Timezone selector */}
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
            {(profile?.role === "artist" || !profile?.role) && (
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
