import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Mic2, Megaphone, Building2, Wrench, Camera } from "lucide-react";

const ROLE_COPY: Record<string, { intro: string; detail: string }> = {
  artist: {
    intro: "Your stage awaits.",
    detail: "Set up your profile to start receiving booking offers from promoters, manage your tour dates, and grow your audience — all from one place.",
  },
  promoter: {
    intro: "Let's fill some rooms.",
    detail: "Browse verified artists, send offers with built-in commission tracking, and manage every booking from deal room to showtime.",
  },
  venue: {
    intro: "Your space, your rules.",
    detail: "List your venue, set availability, and let promoters and artists find you. Manage bookings and keep your calendar full.",
  },
  production: {
    intro: "The show runs through you.",
    detail: "Connect with tours and events that need your crew. Manage gigs, track budgets, and build your reputation in the industry.",
  },
  photo_video: {
    intro: "Capture the moment.",
    detail: "Showcase your reel, get booked for live events, and connect with artists and promoters who need your creative eye.",
  },
};

const ROLE_ICON: Record<string, React.ElementType> = {
  artist: Mic2,
  promoter: Megaphone,
  venue: Building2,
  production: Wrench,
  photo_video: Camera,
};

export default function Welcome() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  // If already seen welcome, redirect
  useEffect(() => {
    if (profile && (profile as any).seen_welcome) {
      navigate("/profile-setup", { replace: true });
    }
  }, [profile, navigate]);

  const role = profile?.role || "artist";
  const copy = ROLE_COPY[role] || ROLE_COPY.artist;
  const Icon = ROLE_ICON[role] || Mic2;
  const firstName = profile?.display_name?.split(" ")[0] || "there";

  const handleContinue = async () => {
    if (user) {
      await supabase
        .from("profiles")
        .update({ seen_welcome: true } as any)
        .eq("user_id", user.id);
      await refreshProfile();
    }
    navigate("/profile-setup");
  };

  const handleSkip = async () => {
    if (user) {
      await supabase
        .from("profiles")
        .update({ seen_welcome: true } as any)
        .eq("user_id", user.id);
      await refreshProfile();
    }
    // Route to role-specific dashboard
    const dashMap: Record<string, string> = {
      artist: "/artist-dashboard",
      promoter: "/promoter-dashboard",
      venue: "/venue-manage",
      production: "/production-dashboard",
      photo_video: "/creative-dashboard",
    };
    navigate(dashMap[role] || "/artist-dashboard");
  };

  return (
    <div className="min-h-screen bg-[#080C14] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div
          className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: "rgba(200,255,62,0.1)" }}
        >
          <Icon className="w-7 h-7 text-[#C8FF3E]" />
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="font-syne text-3xl sm:text-4xl font-bold text-[#F0F2F7] leading-tight">
            Welcome to GetBooked.Live,
            <br />
            <span className="text-[#C8FF3E]">{firstName}</span>
          </h1>
          <p className="text-lg text-[#8892A4] font-medium">{copy.intro}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-[#8892A4] leading-relaxed max-w-md mx-auto">
          {copy.detail}
        </p>

        {/* CTA */}
        <button
          onClick={handleContinue}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] bg-[#C8FF3E] text-[#080C14] hover:bg-[#C8FF3E]/90"
        >
          Let's set up your profile
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Skip */}
        <div>
          <button
            onClick={handleSkip}
            className="text-xs text-[#5A6478] hover:text-[#8892A4] transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
