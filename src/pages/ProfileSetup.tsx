import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ProfileSetup() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [city, setCity] = useState(profile?.city ?? "");
  const [state, setState] = useState(profile?.state ?? "");
  const [genre, setGenre] = useState(profile?.genre ?? "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ bio, city, state, genre, profile_complete: true })
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-lg">
        <h1 className="font-display text-2xl font-bold mb-2">Complete your profile</h1>
        <p className="text-muted-foreground text-sm mb-6">Tell us a bit about yourself to get started.</p>
        <div className="rounded-xl bg-card border border-border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-11 active:scale-[0.97] transition-transform">
              {loading ? "Saving..." : "Save & continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
