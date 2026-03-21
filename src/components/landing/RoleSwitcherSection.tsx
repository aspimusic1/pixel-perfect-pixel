import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic2, Users, Building2, Wrench, Camera, ArrowRight, ChevronRight } from "lucide-react";

const ROLE_TABS = [
  { key: "artist", label: "artists", icon: Mic2 },
  { key: "promoter", label: "promoters", icon: Users },
  { key: "venue", label: "venues", icon: Building2 },
  { key: "production", label: "production", icon: Wrench },
  { key: "photo_video", label: "photo & video", icon: Camera },
];

const ROLE_DETAILS: Record<string, { headline: string; points: string[] }> = {
  artist: {
    headline: "manage your bookings, build your brand, and get discovered.",
    points: [
      "receive & negotiate offers in deal rooms",
      "request advances on confirmed guarantees",
      "auto-calculate commissions & net pay",
      "track attendance analytics & average draw",
      "smooth your income into equal monthly payouts",
    ],
  },
  promoter: {
    headline: "find talent, send offers, and manage your events.",
    points: [
      "AI booking agent finds best-fit artists for your budget",
      "send structured offers with one click",
      "use flash bids to fill last-minute slots",
      "finance bookings with flexible payment plans",
      "track real attendance data per show",
    ],
  },
  venue: {
    headline: "list your space, fill your calendar, and grow revenue.",
    points: [
      "showcase capacity, amenities & rates",
      "receive booking requests directly",
      "manage availability & holds",
      "show attendance stats: '65% of capacity' badges",
      "connect with local promoters & talent",
    ],
  },
  production: {
    headline: "connect with events that need your expertise.",
    points: [
      "list your services & crew size",
      "get hired for sound, lighting & staging",
      "manage tour assignments with timezone sync",
      "book ground transport per tour stop",
      "build your reputation with reviews",
    ],
  },
  photo_video: {
    headline: "get booked for live coverage and grow your portfolio.",
    points: [
      "showcase your work & style",
      "set your rate & availability",
      "get discovered by promoters",
      "upload reels directly to your profile",
      "build reviews from real events",
    ],
  },
};

export default function RoleSwitcherSection() {
  const [activeRole, setActiveRole] = useState("artist");

  return (
    <section className="fade-in-section py-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="font-display text-2xl sm:text-4xl font-bold text-center mb-3 lowercase">
          built for every role in live music
        </h2>
        <p className="text-muted-foreground text-center text-sm mb-10 max-w-md mx-auto font-body">
          one platform, five roles. everyone gets the tools they need.
        </p>

        <div className="flex justify-center gap-1.5 flex-wrap mb-10">
          {ROLE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveRole(tab.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all active:scale-[0.97] lowercase ${
                activeRole === tab.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 sm:p-8 transition-all duration-300">
          <h3 className="font-display text-lg sm:text-xl font-bold mb-4 lowercase">
            {ROLE_DETAILS[activeRole].headline}
          </h3>
          <ul className="space-y-2.5">
            {ROLE_DETAILS[activeRole].points.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground font-body">
                <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
          <Link to="/auth?tab=signup" className="inline-block mt-6">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium active:scale-[0.97] transition-transform lowercase">
              get started as {activeRole === "photo_video" ? "photo/video" : activeRole === "production" ? "production crew" : `a ${activeRole}`} <ArrowRight className="ml-1.5 w-3 h-3" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
