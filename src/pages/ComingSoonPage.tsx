import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Instagram, Linkedin, ChevronDown } from "lucide-react";
import { waitlistSchema } from "@/lib/publicInputValidation";
import SEO from "@/components/SEO";

const ROLE_OPTIONS = [
  {
    value: "artist",
    label: "Artist",
    emoji: "🎤",
    color: "#C8FF3E",
    bg: "rgba(200,255,62,0.10)",
    border: "rgba(200,255,62,0.30)",
    glow: "rgba(200,255,62,0.20)",
    tagline: "Performers & Musicians",
    description: "Get discovered by promoters and venues looking for your sound. Manage bookings, set your rates, and grow your live career — all in one place.",
  },
  {
    value: "promoter",
    label: "Promoter",
    emoji: "📣",
    color: "#FF5C8A",
    bg: "rgba(255,92,138,0.10)",
    border: "rgba(255,92,138,0.30)",
    glow: "rgba(255,92,138,0.20)",
    tagline: "Event Organisers & Bookers",
    description: "Find and book the right talent for any event. Browse verified artists, compare rates, and handle contracts without the back-and-forth.",
  },
  {
    value: "venue",
    label: "Venue",
    emoji: "🏟️",
    color: "#FFB83E",
    bg: "rgba(255,184,62,0.10)",
    border: "rgba(255,184,62,0.30)",
    glow: "rgba(255,184,62,0.20)",
    tagline: "Clubs, Bars & Festivals",
    description: "Fill your calendar with the right acts. Connect directly with artists and promoters, manage your availability, and build your venue's reputation.",
  },
  {
    value: "photo_video",
    label: "Creative",
    emoji: "📸",
    color: "#3EC8FF",
    bg: "rgba(62,200,255,0.10)",
    border: "rgba(62,200,255,0.30)",
    glow: "rgba(62,200,255,0.20)",
    tagline: "Photographers & Videographers",
    description: "Get hired for live events. Showcase your portfolio, connect with artists and venues, and turn your passion into paid gigs.",
  },
  {
    value: "production",
    label: "Production",
    emoji: "🎛️",
    color: "#A78BFA",
    bg: "rgba(167,139,250,0.10)",
    border: "rgba(167,139,250,0.30)",
    glow: "rgba(167,139,250,0.20)",
    tagline: "Sound, Lighting & Stage Crew",
    description: "Be the backbone of every great show. Get discovered by artists and venues who need reliable, professional crew for their events.",
  },
];

export default function ComingSoonPage() {
  const navigate = useNavigate();
  const [email, setEmail]               = useState("");
  const [name, setName]                 = useState("");
  const [role, setRole]                 = useState("");
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsed = waitlistSchema.safeParse({
      email,
      name: name || undefined,
      role: role || "artist",
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const { error: dbError } = await supabase
      .from("waitlist")
      .insert({
        email: parsed.data.email,
        role: parsed.data.role,
      });

    setLoading(false);

    if (dbError) {
      if (dbError.code === "23505") {
        navigate("/thankyou");
      } else {
        setError("Something went wrong. Please try again.");
      }
      return;
    }
    supabase.functions.invoke("waitlist-confirm", {
      body: { email: parsed.data.email, name: parsed.data.name || "" },
    }).catch(() => {});
    navigate("/thankyou");
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#0A0F1C] overflow-hidden px-6">
      <SEO title="Coming Soon | GetBooked.Live" description="GetBooked.Live is launching soon. Join the waitlist for early access." />

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#C8FF3E]/5 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#C8FF3E]/3 blur-[100px]" />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center py-16 relative z-10">

        {/* Logo */}
        <div className="mb-16">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663474163600/CNVjdejEzeGWRZMX.webp"
            alt="GetBooked"
            className="h-10 w-auto"
          />
        </div>

        {/* Headline */}
        <h1 className="font-syne text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight text-white text-center mb-6 max-w-4xl">
          The Future<br />of Booking<br />
          <span className="text-[#C8FF3E]">Starts Here</span>
        </h1>

        {/* Subheadline */}
        <p className="text-white/50 text-base sm:text-lg max-w-xl text-center mb-10 leading-relaxed">
          A new platform connecting artists, promoters, and venues — launching soon.
        </p>

        {/* Launch badge + waitlist CTA */}
        <div className="mb-12 flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-[#C8FF3E]/30 bg-[#C8FF3E]/5 text-[#C8FF3E] font-syne text-xs font-bold tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-[#C8FF3E] animate-pulse" />
            Launching Q4 2026
          </span>
          <p className="text-white/40 text-sm font-syne tracking-wide text-center">
            Sign up for the waitlist &mdash;{" "}
            <span className="text-[#C8FF3E] font-semibold">get early access &amp; exclusive perks ✨</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-3">

          {/* Role label */}
          <p className="text-white/30 text-xs uppercase tracking-widest font-syne text-center mb-1">
            I am a…
          </p>

          {/* Full-width colorful role cards — stacked, on top */}
          <div className="space-y-2">
            {ROLE_OPTIONS.map((opt) => {
              const isSelected  = role === opt.value;
              const isExpanded  = expandedRole === opt.value;

              return (
                <div key={opt.value}>
                  <button
                    type="button"
                    onClick={() => {
                      setRole(isSelected ? "" : opt.value);
                      setExpandedRole(isExpanded ? null : opt.value);
                    }}
                    className="w-full flex items-center justify-between px-5 py-4 rounded-2xl border transition-all duration-200 text-left"
                    style={{
                      backgroundColor: isSelected || isExpanded ? opt.bg : "rgba(255,255,255,0.04)",
                      borderColor: isSelected || isExpanded ? opt.border : "rgba(255,255,255,0.08)",
                      boxShadow: isSelected ? `0 0 24px ${opt.glow}` : "none",
                    }}
                  >
                    {/* Left: emoji + label + tagline */}
                    <div className="flex items-center gap-4">
                      <span
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                        style={{
                          backgroundColor: isSelected || isExpanded ? `${opt.color}20` : "rgba(255,255,255,0.06)",
                          border: `1px solid ${isSelected || isExpanded ? opt.border : "rgba(255,255,255,0.08)"}`,
                        }}
                      >
                        {opt.emoji}
                      </span>
                      <div>
                        <p
                          className="font-syne font-bold text-sm uppercase tracking-wide"
                          style={{ color: isSelected || isExpanded ? opt.color : "rgba(255,255,255,0.75)" }}
                        >
                          {opt.label}
                        </p>
                        <p className="text-[11px] text-white/35 mt-0.5">{opt.tagline}</p>
                      </div>
                    </div>

                    {/* Right: selected dot or chevron */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isSelected && (
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: opt.color }}
                        />
                      )}
                      <ChevronDown
                        className="w-4 h-4 transition-transform duration-300"
                        style={{
                          color: isSelected || isExpanded ? opt.color : "rgba(255,255,255,0.20)",
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      />
                    </div>
                  </button>

                  {/* Expanded explanation */}
                  {isExpanded && (
                    <div
                      className="mx-1 px-5 py-4 rounded-b-2xl -mt-1"
                      style={{
                        backgroundColor: `${opt.color}08`,
                        borderLeft: `1px solid ${opt.border}`,
                        borderRight: `1px solid ${opt.border}`,
                        borderBottom: `1px solid ${opt.border}`,
                      }}
                    >
                      <p className="text-[13px] text-white/60 leading-relaxed">
                        {opt.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-white/20 text-xs font-syne uppercase tracking-widest">your details</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Name */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full h-14 rounded-xl border border-white/10 bg-white/5 px-5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C8FF3E]/30 focus:border-[#C8FF3E]/30 transition-all"
            maxLength={100}
          />

          {/* Email + Submit */}
          <div className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 h-14 rounded-xl border border-white/10 bg-white/5 px-5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C8FF3E]/30 focus:border-[#C8FF3E]/30 transition-all"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="h-14 px-8 rounded-xl bg-[#C8FF3E] text-black font-syne font-bold text-sm hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-60 whitespace-nowrap"
            >
              {loading ? "Joining…" : "Get Early Access"}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center" role="alert">{error}</p>
          )}
        </form>

      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 flex flex-col items-center gap-4">
        <p className="text-white/20 text-xs uppercase tracking-[0.2em] font-syne text-center">
          Join the next generation of live booking
        </p>
        <div className="flex items-center justify-center gap-6 text-white/30 text-xs">
          <a href="https://www.instagram.com/getbooked.live" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors flex items-center gap-1.5">
            <Instagram className="w-3.5 h-3.5" />
            Instagram
          </a>
          <span className="w-px h-3 bg-white/10" />
          <a href="https://www.linkedin.com/company/getbookedlive/" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors flex items-center gap-1.5">
            <Linkedin className="w-3.5 h-3.5" />
            LinkedIn
          </a>
        </div>
        <a
          href="/admin-login"
          className="text-[10px] text-white/10 hover:text-white/30 transition-colors tracking-widest uppercase mt-1"
        >
          Admin
        </a>
      </footer>
    </div>
  );
}
