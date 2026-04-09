import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Instagram, Linkedin, Mic2, Megaphone, Building2, Camera, Wrench } from "lucide-react";
import { waitlistSchema } from "@/lib/publicInputValidation";
import SEO from "@/components/SEO";

const ROLE_OPTIONS = [
  { value: "artist",       label: "ARTIST",           icon: Mic2,      color: "#C8FF3E" },
  { value: "promoter",    label: "PROMOTER",          icon: Megaphone, color: "#FF5C8A" },
  { value: "venue",       label: "VENUE",             icon: Building2, color: "#FFB83E" },
  { value: "photo_video", label: "CREATIVE",          icon: Camera,    color: "#3EC8FF" },
  { value: "production",  label: "CREW / PRODUCTION", icon: Wrench,    color: "#A78BFA" },
];

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
        name: parsed.data.name || null,
        role: parsed.data.role,
      });

    setLoading(false);

    if (dbError) {
      if (dbError.code === "23505") {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
      return;
    }
    // Send confirmation email (fire-and-forget)
    supabase.functions.invoke("waitlist-confirm", {
      body: { email: parsed.data.email, name: parsed.data.name || "" },
    }).catch(() => {});
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[#0A0F1C] overflow-hidden px-6">
      <SEO title="Coming Soon | GetBooked.Live" description="GetBooked.Live is launching soon. Join the waitlist for early access." />

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
          Sign up for the waitlist&nbsp;&mdash;&nbsp;
          <span className="text-[#C8FF3E] font-semibold">get early access &amp; exclusive perks ✨</span>
        </p>
      </div>

      {/* Form / Success */}
      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg space-y-5"
        >
          {/* Role selector */}
          <div className="w-full">
            <p className="text-xs text-white/30 font-syne uppercase tracking-[0.15em] mb-3 text-center">I am a…</p>
            <div className="grid grid-cols-5 gap-2.5">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const selected = role === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setRole(opt.value)}
                    className="relative flex flex-col items-center justify-center gap-2 rounded-xl border p-3 h-20 cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: selected ? opt.color : `${opt.color}40`,
                      backgroundColor: selected ? `${opt.color}15` : `${opt.color}08`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: opt.color }} />
                    <span
                      className="text-[9px] font-syne font-bold tracking-wider uppercase leading-tight text-center"
                      style={{ color: selected ? opt.color : `${opt.color}99` }}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Name input */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full h-14 rounded-xl border border-white/10 bg-white/5 px-5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#C8FF3E]/30 focus:border-[#C8FF3E]/30 transition-all"
            aria-label="Name"
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
              aria-label="Email address"
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
            <p className="text-red-400 text-xs mt-1 text-center" role="alert">{error}</p>
          )}
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#C8FF3E]/10 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-[#C8FF3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-syne text-2xl font-bold text-white">You're on the list.</h2>
          <p className="text-white/50 text-sm">We'll be in touch soon — check your inbox for a confirmation.</p>
        </div>
      )}

      {/* Tagline */}
      <p className="mt-20 text-white/20 text-xs uppercase tracking-[0.2em] font-syne text-center">
        Join the next generation of live booking
      </p>

      {/* Footer */}
      <footer className="absolute bottom-8 left-0 right-0">
        <div className="flex flex-wrap items-center justify-center gap-6 text-white/30 text-xs">
          <a href="https://www.instagram.com/getbooked.live" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors flex items-center gap-1.5">
            <Instagram className="w-3.5 h-3.5" />
            Instagram
          </a>
          <span className="w-px h-3 bg-white/10" />
          <a href="https://www.linkedin.com/company/getbookedlive/" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors flex items-center gap-1.5">
            <Linkedin className="w-3.5 h-3.5" />
            LinkedIn
          </a>
          <span className="w-px h-3 bg-white/10" />
          <a
            href="/admin-login"
            className="text-[10px] text-white/10 hover:text-white/30 transition-colors tracking-widest uppercase"
          >
            Admin
          </a>
        </div>
      </footer>
    </div>
  );
}
