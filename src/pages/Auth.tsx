import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const ROLES = [
  { value: "artist", label: "Artist", color: "border-role-artist text-role-artist" },
  { value: "promoter", label: "Promoter", color: "border-role-promoter text-role-promoter" },
  { value: "venue", label: "Venue", color: "border-role-venue text-role-venue" },
  { value: "production", label: "Production", color: "border-role-production text-role-production" },
  { value: "photo_video", label: "Photo/Video", color: "border-role-photo text-role-photo" },
];

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("tab") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/profile-setup");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        if (!selectedRole) {
          toast.error("Please select your role");
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: displayName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;

        // Update profile with role after signup
        const { data: { user: newUser } } = await supabase.auth.getUser();
        if (newUser) {
          await supabase.from("profiles").update({ role: selectedRole as any, display_name: displayName }).eq("user_id", newUser.id);
        }
        toast.success("Account created! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 font-display font-bold text-xl mb-2">
            <Music className="w-5 h-5 text-primary" />
            GetBooked<span className="text-primary">.Live</span>
          </div>
          <p className="text-muted-foreground text-sm">
            {isSignUp ? "Create your account" : "Sign in to your account"}
          </p>
        </div>

        <div className="rounded-xl bg-card border border-border p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <Label htmlFor="name" className="text-sm">Display name</Label>
                  <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name or artist name" required className="mt-1.5 bg-background border-border" />
                </div>
                <div>
                  <Label className="text-sm mb-2 block">I am a...</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((role) => (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => setSelectedRole(role.value)}
                        className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all active:scale-[0.97] ${
                          selectedRole === role.value
                            ? `${role.color} bg-secondary`
                            : "border-border text-muted-foreground hover:border-border/80"
                        }`}
                      >
                        {role.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-1.5 bg-background border-border" />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="mt-1.5 bg-background border-border" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium h-11 active:scale-[0.97] transition-transform">
              {loading ? "Loading..." : isSignUp ? "Create account" : "Sign in"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
