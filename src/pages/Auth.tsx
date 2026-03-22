import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Mic2, Megaphone, Building2, Wrench, Camera } from "lucide-react";
import { toast } from "sonner";
import logoBlack from "@/assets/logo-black.png";

const ROLES = [
  { value: "artist", label: "Artist", icon: Mic2, accent: "text-primary-foreground border-primary-foreground/30 bg-primary-foreground/10", tagline: "Get booked. Get paid. Tour smarter." },
  { value: "promoter", label: "Promoter", icon: Megaphone, accent: "text-primary-foreground border-primary-foreground/30 bg-primary-foreground/10", tagline: "Find talent. Fill rooms. Build your brand." },
  { value: "venue", label: "Venue", icon: Building2, accent: "text-primary-foreground border-primary-foreground/30 bg-primary-foreground/10", tagline: "List your space. Book artists. Sell out shows." },
  { value: "production", label: "Production", icon: Wrench, accent: "text-primary-foreground border-primary-foreground/30 bg-primary-foreground/10", tagline: "Crew up. Get hired. Run the show." },
  { value: "photo_video", label: "Photo/Video", icon: Camera, accent: "text-primary-foreground border-primary-foreground/30 bg-primary-foreground/10", tagline: "Capture moments. Build your reel. Get booked." },
];

export default function Auth() {
  const [searchParams] = useSearchParams();
  const presetRole = searchParams.get("role") || "";
  const [isSignUp, setIsSignUp] = useState(searchParams.get("tab") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedRole, setSelectedRole] = useState(presetRole);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate("/profile-setup"); }, [user, navigate]);
  useEffect(() => { if (presetRole) { setSelectedRole(presetRole); setIsSignUp(true); } }, [presetRole]);

  const activeRoleInfo = ROLES.find((r) => r.value === selectedRole);
  const ActiveIcon = activeRoleInfo?.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        if (!selectedRole) { toast.error("Please select your role"); setLoading(false); return; }
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { display_name: displayName }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
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
      const msg = err.message ?? "Something went wrong";
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        toast.error("An account with this email already exists. Try signing in instead.");
      } else if (msg.includes("Invalid login")) {
        toast.error("Invalid email or password. Please try again.");
      } else {
        toast.error(msg);
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {isSignUp && activeRoleInfo && ActiveIcon ? (
            <>
              <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center bg-white/[0.06]">
                <ActiveIcon className="w-6 h-6 text-[#C8FF3E]" />
              </div>
              <h1 className="font-display font-bold text-xl mb-1.5 lowercase text-primary-foreground">
                sign up as <span className="text-primary-foreground">{activeRoleInfo.label.toLowerCase()}</span>
              </h1>
              <p className="text-primary-foreground/60 text-sm font-body">{activeRoleInfo.tagline}</p>
            </>
          ) : (
            <>
              <img src={logoBlack} alt="GetBooked.Live" className="h-6 mx-auto mb-4 opacity-90" />
              <h1 className="font-display font-bold text-xl mb-1 lowercase text-primary-foreground">
                {isSignUp ? "create your account" : "welcome back"}
              </h1>
              <p className="text-primary-foreground/60 text-sm font-body">
                {isSignUp ? "join the live music operating system" : "sign in to your account"}
              </p>
            </>
          )}
        </div>

        <div className="rounded-2xl bg-primary-foreground/[0.08] border border-primary-foreground/[0.12] p-7 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <Label htmlFor="name" className="text-sm font-display font-medium lowercase text-primary-foreground/80">display name</Label>
                  <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name or artist name" required className="mt-2 bg-primary-foreground/[0.06] border-primary-foreground/[0.12] text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-primary-foreground/30" />
                </div>
                <div>
                  <Label className="text-sm font-display font-medium lowercase mb-2.5 block text-primary-foreground/80">I am a...</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((role) => {
                      const Icon = role.icon;
                      const selected = selectedRole === role.value;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setSelectedRole(role.value)}
                          className={`px-3 py-2.5 rounded-lg border text-sm font-display font-medium transition-all active:scale-[0.96] flex items-center gap-2 lowercase ${
                            selected
                              ? "border-primary-foreground/40 bg-primary-foreground/15 text-primary-foreground"
                              : "border-primary-foreground/[0.1] text-primary-foreground/50 hover:text-primary-foreground/70 hover:border-primary-foreground/20"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0" />
                          {role.label.toLowerCase()}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
            <div>
              <Label htmlFor="email" className="text-sm font-display font-medium lowercase text-primary-foreground/80">email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="mt-2 bg-primary-foreground/[0.06] border-primary-foreground/[0.12] text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-primary-foreground/30" />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-display font-medium lowercase text-primary-foreground/80">password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="mt-2 bg-primary-foreground/[0.06] border-primary-foreground/[0.12] text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:ring-primary-foreground/30" />
              {!isSignUp && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) { toast.error("Enter your email first"); return; }
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: window.location.origin + "/reset-password",
                    });
                    if (error) toast.error(error.message);
                    else toast.success("Check your email for a reset link");
                  }}
                  className="text-xs text-primary-foreground/60 hover:text-primary-foreground/80 transition-colors mt-2 float-right font-display"
                >
                  forgot password?
                </button>
              )}
            </div>
            <Button type="submit" disabled={loading} className="w-full font-display font-semibold h-11 lowercase bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              {loading ? "loading..." : isSignUp ? "create account" : "sign in"}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-primary-foreground/[0.1]" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-transparent px-3 text-primary-foreground/50 font-body">or continue with</span></div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 font-display font-medium lowercase border-primary-foreground/[0.12] text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={async () => {
                const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
                if (error) toast.error(error.message ?? "Google sign-in failed");
              }}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 font-display font-medium lowercase border-primary-foreground/[0.12] text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
              onClick={async () => {
                const { error } = await lovable.auth.signInWithOAuth("apple", { redirect_uri: window.location.origin });
                if (error) toast.error(error.message ?? "Apple sign-in failed");
              }}
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              apple
            </Button>
          </div>

          <div className="mt-5 text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-primary-foreground/50 hover:text-primary-foreground/70 transition-colors font-body">
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
