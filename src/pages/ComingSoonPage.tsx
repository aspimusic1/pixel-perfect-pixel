import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Instagram, Linkedin } from "lucide-react";
import { waitlistSchema } from "@/lib/publicInputValidation";
import SEO from "@/components/SEO";

const WAITLIST_BASE_COUNT = 2847;

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Animated gradient background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth * 2;
      canvas.height = window.innerHeight * 2;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      time += 0.003;
      const w = canvas.width;
      const h = canvas.height;

      ctx.fillStyle = "#050810";
      ctx.fillRect(0, 0, w, h);

      const x1 = w * 0.3 + Math.sin(time * 0.7) * w * 0.15;
      const y1 = h * 0.4 + Math.cos(time * 0.5) * h * 0.12;
      const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, w * 0.35);
      g1.addColorStop(0, "rgba(200,255,62,0.08)");
      g1.addColorStop(1, "rgba(200,255,62,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const x2 = w * 0.7 + Math.cos(time * 0.6) * w * 0.12;
      const y2 = h * 0.6 + Math.sin(time * 0.4) * h * 0.15;
      const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, w * 0.3);
      g2.addColorStop(0, "rgba(123,92,240,0.06)");
      g2.addColorStop(1, "rgba(123,92,240,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      const x3 = w * 0.5 + Math.sin(time * 0.8) * w * 0.1;
      const y3 = h * 0.3 + Math.cos(time * 0.3) * h * 0.1;
      const g3 = ctx.createRadialGradient(x3, y3, 0, x3, y3, w * 0.25);
      g3.addColorStop(0, "rgba(255,92,138,0.04)");
      g3.addColorStop(1, "rgba(255,92,138,0)");
      ctx.fillStyle = g3;
      ctx.fillRect(0, 0, w, h);

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

   // Waitlist count is no longer publicly queryable for security reasons.
  // Show only the base count as a static number.
  useEffect(() => {
    setWaitlistCount(0);
  }, []);

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
  const fadeIn = mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4";
  const transition = "transition-all duration-700 ease-out";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <SEO title="Coming Soon | GetBooked.Live" description="GetBooked.Live is launching soon. Join the waitlist for early access." />
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      <div className="fixed inset-0 z-[1] opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }}
      />

      <div className="relative z-10 w-full max-w-xl mx-auto px-6 py-16 flex flex-col items-center text-center">

        {/* Logo */}
        <div className={`mb-16 ${fadeIn} ${transition}`}>
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663474163600/CNVjdejEzeGWRZMX.webp"
            alt="GetBooked"
            className="h-8 w-auto"
          />
        </div>

        {/* Headline */}
        <h1 className={`font-syne text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-foreground mb-5 ${fadeIn} ${transition}`}
          style={{ transitionDelay: "150ms" }}
        >
          The Future of Booking{" "}
          <span className="text-primary">Starts Here</span>
        </h1>

        {/* Subheadline */}
        <p className={`text-muted-foreground text-base sm:text-lg max-w-md mb-10 leading-relaxed ${fadeIn} ${transition}`}
          style={{ transitionDelay: "300ms" }}
        >
          A new platform connecting artists, promoters, and venues — launching soon.
        </p>

        {/* Launch badge */}
        <div className={`mb-12 ${fadeIn} ${transition}`} style={{ transitionDelay: "450ms" }}>
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/[0.06] text-primary font-syne text-sm font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Launching Q4 2026
          </span>
        </div>

        {/* Form / Success */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className={`w-full max-w-sm space-y-3 ${fadeIn} ${transition}`}
            style={{ transitionDelay: "550ms" }}
          >
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-card">I am a…</option>
              <option value="artist" className="bg-card">Artist</option>
              <option value="promoter" className="bg-card">Promoter</option>
              <option value="venue" className="bg-card">Venue</option>
              <option value="production" className="bg-card">Crew / Production</option>
              <option value="photo_video" className="bg-card">Creative</option>
            </select>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full h-12 rounded-xl border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
              aria-label="Name"
              maxLength={100}
            />

            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-14 rounded-xl border border-border bg-card pl-4 pr-36 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all"
                aria-label="Email address"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-11 px-5 rounded-lg bg-primary text-primary-foreground font-syne font-bold text-sm hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Joining…
                  </span>
                ) : (
                  "Get Early Access"
                )}
              </button>
            </div>

            {error && (
              <p className="text-destructive text-xs mt-1" role="alert">{error}</p>
            )}
          </form>
        ) : (
          <div className={`text-center space-y-3 ${fadeIn} ${transition}`}>
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-syne text-2xl font-bold text-foreground">You're on the list.</h2>
            <p className="text-muted-foreground text-sm">We'll be in touch soon — check your inbox for a confirmation.</p>
          </div>
        )}

        {/* Live counter */}
        {waitlistCount !== null && waitlistCount > 0 && (
          <div className={`mt-10 ${fadeIn} ${transition}`} style={{ transitionDelay: "800ms" }}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card border border-border">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-50" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="text-muted-foreground text-sm">
                <span className="font-syne font-bold text-foreground">{(WAITLIST_BASE_COUNT + waitlistCount).toLocaleString()}</span>
                {" "}people on the waitlist
              </span>
            </div>
          </div>
        )}

        {/* Social proof */}
        <p className={`mt-16 text-muted-foreground/50 text-xs uppercase tracking-[0.2em] font-syne ${fadeIn} ${transition}`}
          style={{ transitionDelay: "1000ms" }}
        >
          Join the next generation of live booking
        </p>
      </div>

      {/* Footer */}
      <footer className={`relative z-10 w-full py-8 mt-auto ${fadeIn} ${transition}`} style={{ transitionDelay: "1100ms" }}>
        <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground/50 text-xs">
          <a href="https://www.instagram.com/getbooked.live" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground transition-colors flex items-center gap-1">
            <Instagram className="w-3.5 h-3.5" />
            Instagram
          </a>
          <span className="w-px h-3 bg-border" />
          <a href="https://www.linkedin.com/company/getbookedlive/" target="_blank" rel="noopener noreferrer" className="hover:text-muted-foreground transition-colors flex items-center gap-1">
            <Linkedin className="w-3.5 h-3.5" />
            LinkedIn
          </a>
        </div>
        {/* Discreet admin login — nearly invisible to visitors, clickable by admin */}
        <div className="flex justify-center mt-4">
          <a
            href="/admin-login"
            className="text-[10px] text-muted-foreground/20 hover:text-muted-foreground/50 transition-colors tracking-widest uppercase"
          >
            Admin
          </a>
        </div>
      </footer>
    </div>
  );
}
