import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Instagram } from "lucide-react";

const WAITLIST_BASE_COUNT = 2847;

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

      // Orb 1 — lime
      const x1 = w * 0.3 + Math.sin(time * 0.7) * w * 0.15;
      const y1 = h * 0.4 + Math.cos(time * 0.5) * h * 0.12;
      const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, w * 0.35);
      g1.addColorStop(0, "rgba(200,255,62,0.08)");
      g1.addColorStop(1, "rgba(200,255,62,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      // Orb 2 — purple
      const x2 = w * 0.7 + Math.cos(time * 0.6) * w * 0.12;
      const y2 = h * 0.6 + Math.sin(time * 0.4) * h * 0.15;
      const g2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, w * 0.3);
      g2.addColorStop(0, "rgba(123,92,240,0.06)");
      g2.addColorStop(1, "rgba(123,92,240,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // Orb 3 — pink
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

  // Fetch waitlist count
  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("waitlist")
        .select("id", { count: "exact", head: true });
      if (count !== null) setWaitlistCount(count);
    };
    fetchCount();

    const channel = supabase
      .channel("waitlist-count")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "waitlist" }, () => {
        fetchCount();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    const { error: dbError } = await supabase
      .from("waitlist")
      .insert({ email: email.toLowerCase().trim(), role: role || "artist" });

    setLoading(false);

    if (dbError) {
      if (dbError.code === "23505") {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated canvas background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />

      {/* Noise overlay */}
      <div className="fixed inset-0 z-[1] opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl mx-auto px-6 py-16 flex flex-col items-center text-center">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="font-syne text-2xl font-bold tracking-tight text-white">
            Get<span className="text-[hsl(var(--primary))]">Booked</span>.live
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-syne text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight text-white mb-5"
        >
          The Future of Booking{" "}
          <span className="text-[hsl(var(--primary))]">Starts Here</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-muted-foreground text-base sm:text-lg max-w-md mb-10 leading-relaxed"
        >
          A new platform connecting artists, promoters, and venues — launching soon.
        </motion.p>

        {/* Launch badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mb-12"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[hsl(var(--primary))]/20 bg-[hsl(var(--primary))]/[0.06] text-[hsl(var(--primary))] font-syne text-sm font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse" />
            Launching Q4 2026
          </span>
        </motion.div>

        {/* Form / Success */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              onSubmit={handleSubmit}
              className="w-full max-w-sm space-y-3"
            >
              {/* Role dropdown */}
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-12 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))]/30 transition-all appearance-none cursor-pointer"
              >
                <option value="" className="bg-[#0E1420]">I am a…</option>
                <option value="artist" className="bg-[#0E1420]">Artist</option>
                <option value="promoter" className="bg-[#0E1420]">Promoter</option>
                <option value="venue" className="bg-[#0E1420]">Venue</option>
                <option value="manager" className="bg-[#0E1420]">Manager</option>
              </select>

              {/* Email input */}
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-14 rounded-xl border border-white/[0.08] bg-white/[0.04] pl-4 pr-36 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 focus:border-[hsl(var(--primary))]/30 transition-all"
                  aria-label="Email address"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-11 px-5 rounded-lg bg-[hsl(var(--primary))] text-[#080C14] font-syne font-bold text-sm hover:brightness-110 active:scale-[0.97] transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-[#080C14]/30 border-t-[#080C14] rounded-full animate-spin" />
                      Joining…
                    </span>
                  ) : (
                    "Get Early Access"
                  )}
                </button>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-xs mt-1"
                >
                  {error}
                </motion.p>
              )}
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-3"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-[hsl(var(--primary))]/10 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[hsl(var(--primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-syne text-2xl font-bold text-white">You're on the list.</h2>
              <p className="text-muted-foreground text-sm">We'll let you know when it's time.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live counter */}
        {waitlistCount !== null && waitlistCount > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10"
          >
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.06]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--primary))] opacity-50" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(var(--primary))]" />
              </span>
              <span className="text-white/70 text-sm">
                <span className="font-syne font-bold text-white">{(WAITLIST_BASE_COUNT + waitlistCount).toLocaleString()}</span>
                {" "}people on the waitlist
              </span>
            </div>
          </motion.div>
        )}

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 text-white/30 text-xs uppercase tracking-[0.2em] font-syne"
        >
          Join the next generation of live booking
        </motion.p>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        className="relative z-10 w-full py-8 mt-auto"
      >
        <div className="flex flex-wrap items-center justify-center gap-6 text-white/30 text-xs">
          <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
          <span className="w-px h-3 bg-white/10" />
          <a href="mailto:getbookedlive@gmail.com" className="hover:text-white/60 transition-colors">Contact</a>
          <span className="w-px h-3 bg-white/10" />
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white/60 transition-colors flex items-center gap-1">
            <Instagram className="w-3.5 h-3.5" />
            Instagram
          </a>
        </div>
      </motion.footer>
    </div>
  );
}
