import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle, Circle, X, User, CalendarDays, Music2, Share2, Compass,
  Building2, Send, CreditCard, BarChart3, ChevronDown, ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

type StepDef = {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  action: () => void;
  detectComplete: () => boolean;
};

interface Props {
  variant: "artist" | "promoter";
}

export default function GettingStartedChecklist({ variant }: Props) {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`getbooked_onboarding_dismissed_${user?.id}`) === "true";
  });
  const [collapsed, setCollapsed] = useState(false);
  const [availability, setAvailability] = useState<any[]>([]);
  const [hasOffers, setHasOffers] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (variant === "artist") {
      supabase
        .from("artist_availability")
        .select("id")
        .eq("artist_id", user.id)
        .limit(2)
        .then(({ data }) => setAvailability(data ?? []));
    }
    if (variant === "promoter") {
      supabase
        .from("offers")
        .select("id")
        .eq("sender_id", user.id)
        .limit(1)
        .then(({ data }) => setHasOffers((data ?? []).length > 0));
    }
  }, [user, variant]);

  const copySmartLink = () => {
    const slug = (profile as any)?.slug;
    if (slug) {
      navigator.clipboard.writeText(`${window.location.origin}/p/${slug}`);
      toast.success("Profile link copied!");
    } else {
      toast.error("Complete your profile first to get a link");
    }
  };

  const artistSteps: StepDef[] = [
    {
      key: "complete_profile",
      label: "Complete your profile",
      description: "Add photo, bio, and basic info",
      icon: User,
      action: () => navigate("/profile-setup"),
      detectComplete: () => !!(profile?.avatar_url && profile?.bio && (profile.bio?.length ?? 0) > 20),
    },
    {
      key: "set_dates",
      label: "Set your available dates",
      description: "Let promoters know when you're free",
      icon: CalendarDays,
      action: () => navigate("/dashboard"),
      detectComplete: () => availability.length >= 2,
    },
    {
      key: "connect_spotify",
      label: "Connect your Spotify",
      description: "Show your streaming stats",
      icon: Music2,
      action: () => navigate("/profile-setup"),
      detectComplete: () => !!(profile as any)?.spotify,
    },
    {
      key: "share_link",
      label: "Share your smart link",
      description: "Copy your profile URL to share",
      icon: Share2,
      action: () => {
        copySmartLink();
        if (user) localStorage.setItem(`getbooked_shared_${user.id}`, "true");
      },
      detectComplete: () => !!user && localStorage.getItem(`getbooked_shared_${user.id}`) === "true",
    },
    {
      key: "browse_directory",
      label: "Browse the directory",
      description: "Discover other artists and promoters",
      icon: Compass,
      action: () => {
        if (user) localStorage.setItem(`getbooked_browsed_${user.id}`, "true");
        navigate("/directory");
      },
      detectComplete: () => !!user && localStorage.getItem(`getbooked_browsed_${user.id}`) === "true",
    },
  ];

  const promoterSteps: StepDef[] = [
    {
      key: "complete_profile",
      label: "Complete your company profile",
      description: "Add your company info and bio",
      icon: Building2,
      action: () => navigate("/profile-setup"),
      detectComplete: () => !!(profile?.bio && (profile.bio?.length ?? 0) > 20 && profile?.display_name),
    },
    {
      key: "browse_artists",
      label: "Browse artists in the directory",
      description: "Discover talent for your events",
      icon: Compass,
      action: () => navigate("/directory"),
      detectComplete: () => false,
    },
    {
      key: "send_offer",
      label: "Send your first offer",
      description: "Book an artist for an event",
      icon: Send,
      action: () => navigate("/directory"),
      detectComplete: () => hasOffers,
    },
    {
      key: "verify_payment",
      label: "Verify your payment method",
      description: "Set up billing for bookings",
      icon: CreditCard,
      action: () => navigate("/pricing"),
      detectComplete: () => profile?.subscription_plan !== "free" && profile?.subscription_plan != null,
    },
    {
      key: "promoscore",
      label: "Set your PromoScore preferences",
      description: "Configure your promoter metrics",
      icon: BarChart3,
      action: () => navigate("/dashboard"),
      detectComplete: () => false,
    },
  ];

  const steps = variant === "artist" ? artistSteps : promoterSteps;

  // Check onboarding_steps from profile for manually marked items
  const manualSteps = ((profile as any)?.onboarding_steps as Record<string, boolean>) || {};
  const completedSteps = steps.map((s) => s.detectComplete() || manualSteps[s.key] === true);
  const completedCount = completedSteps.filter(Boolean).length;
  const allDone = completedCount === steps.length;

  if (dismissed) return null;

  const handleMarkDone = async (key: string) => {
    if (!user) return;
    const updated = { ...manualSteps, [key]: true };
    await supabase
      .from("profiles")
      .update({ onboarding_steps: updated } as any)
      .eq("user_id", user.id);
  };

  const ACCENT = variant === "artist" ? "#C8FF3E" : "#FF5C8A";

  // If all done, show collapsed badge
  if (allDone) {
    return (
      <div className="mb-4">
        <button
          onClick={() => { setDismissed(true); if (user) localStorage.setItem(`getbooked_onboarding_dismissed_${user.id}`, "true"); }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:opacity-80 active:scale-[0.97]"
          style={{ backgroundColor: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}30` }}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Getting started — all done!
          <X className="w-3 h-3 ml-1 opacity-60" />
        </button>
      </div>
    );
  }

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all hover:opacity-80"
        style={{ backgroundColor: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}30` }}
      >
        <CheckCircle className="w-3.5 h-3.5" />
        Getting started · {completedCount}/{steps.length}
        <ChevronDown className="w-3 h-3" />
      </button>
    );
  }

  return (
    <div className="rounded-xl bg-[#0e1420] border border-white/[0.06] p-5 mb-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-syne text-base font-semibold mb-0.5">Getting started</h3>
          <p className="text-muted-foreground text-xs">{completedCount} of {steps.length} complete</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCollapsed(true)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Collapse"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setDismissed(true); if (user) localStorage.setItem(`getbooked_onboarding_dismissed_${user.id}`, "true"); }}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <Progress
        value={Math.round((completedCount / steps.length) * 100)}
        className="h-1.5 mb-5 bg-white/[0.06]"
      />

      <div className="space-y-1">
        {steps.map((step, i) => {
          const done = completedSteps[i];
          const StepIcon = step.icon;
          return (
            <button
              key={step.key}
              onClick={() => {
                if (!done) {
                  handleMarkDone(step.key);
                  step.action();
                }
              }}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors
                ${done ? "opacity-50" : "hover:bg-white/[0.03]"}`}
            >
              {done ? (
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: ACCENT }} />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <StepIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className={`text-sm font-medium leading-tight ${done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
