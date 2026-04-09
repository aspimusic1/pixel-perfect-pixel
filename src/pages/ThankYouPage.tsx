import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SEO from "@/components/SEO";
import logoBlack from "@/assets/logo-black.png";
import { ArrowRight, Instagram, Linkedin } from "lucide-react";

const ROLE_EMOJI: Record<string, string> = {
  artist: "🎤",
  promoter: "📣",
  venue: "🏛️",
  production: "🎛️",
  photo_video: "🎨",
};

const ROLE_MESSAGE: Record<string, { headline: string; sub: string }> = {
  artist: {
    headline: "You're on the list, artist.",
    sub: "We'll let you know the moment GetBooked.Live opens its doors — your first booking offer could be waiting.",
  },
  promoter: {
    headline: "You're on the list, promoter.",
    sub: "We'll reach out when the platform launches — ready to help you find talent and fill rooms faster than ever.",
  },
  venue: {
    headline: "You're on the list.",
    sub: "We'll notify you at launch — get ready to list your space and start receiving booking requests from day one.",
  },
  production: {
    headline: "You're on the list.",
    sub: "We'll be in touch when GetBooked.Live goes live — your next gig could be just a few clicks away.",
  },
  photo_video: {
    headline: "You're on the list, creative.",
    sub: "We'll reach out at launch — start building your reel and get ready to get booked for live events.",
  },
};

const WHAT_NEXT = [
  { emoji: "📬", title: "Check your inbox", desc: "We've sent a confirmation email. Look out for updates and early-access news from us." },
  { emoji: "📲", title: "Download the app", desc: "The GetBooked mobile app is coming Q4 2026 — follow us to be first to know when it drops." },
  { emoji: "🎯", title: "Spread the word", desc: "Share GetBooked.Live with your network — the more people join, the better the platform gets for everyone." },
];

export default function ThankYouPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const role = profile?.role || "artist";
  const emoji = ROLE_EMOJI[role] || "🎉";
  const msg = ROLE_MESSAGE[role] || ROLE_MESSAGE.artist;
  const firstName = profile?.display_name?.split(" ")[0] || "";

  // Confetti burst on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const BRAND = "#C8FF3E";
    const colors = [BRAND, "#ffffff", "#A78BFA", "#FF5C8A", "#3EC8FF"];
    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; alpha: number }[] = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.3,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
        alpha: 1,
      });
    }

    let frame: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.alpha -= 0.012;
        if (p.alpha > 0) {
          alive = true;
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }
      ctx.globalAlpha = 1;
      if (alive) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="min-h-screen bg-[#C8FF3E] flex flex-col">
      <SEO
        title="You're on the list — GetBooked.Live"
        description="Thanks for joining the GetBooked.Live waitlist. We'll be in touch when we launch."
        canonical="https://getbooked.live/thank-you"
      />

      {/* Confetti canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-50"
        aria-hidden="true"
      />

      {/* Brand top bar */}
      <div className="flex justify-center pt-12 pb-8 px-4">
        <img src={logoBlack} alt="GetBooked.Live" className="h-8" />
      </div>

      {/* White card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">

            {/* Big emoji */}
            <div className="text-6xl mb-4 select-none">{emoji}</div>

            {/* Headline */}
            <h1 className="text-2xl font-extrabold text-[#0A0A0A] mb-3 leading-tight">
              {firstName ? `${msg.headline.replace("You're", `You're`)}` : msg.headline}
            </h1>
            {firstName && (
              <p className="text-base font-semibold text-[#C8FF3E] bg-[#0A0A0A] inline-block px-3 py-1 rounded-full mb-4 -mt-1">
                {firstName} ✓
              </p>
            )}
            <p className="text-gray-500 text-sm leading-relaxed mb-8">{msg.sub}</p>

            {/* What's next */}
            <div className="space-y-4 mb-8 text-left">
              {WHAT_NEXT.map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50">
                  <div className="text-2xl flex-shrink-0">{item.emoji}</div>
                  <div>
                    <div className="font-bold text-[#0A0A0A] text-sm mb-0.5">{item.title}</div>
                    <div className="text-gray-400 text-xs leading-relaxed">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex gap-3 justify-center mb-6">
              <a
                href="https://www.instagram.com/getbooked.live"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/company/getbookedlive"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            </div>

            {/* CTA back to home */}
            <button
              onClick={() => navigate("/")}
              className="w-full h-12 rounded-xl bg-[#C8FF3E] text-[#0A0A0A] font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-[#b8ef2e] transition-colors"
            >
              Back to GetBooked.Live
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-center text-xs text-[#0A0A0A]/50 mt-6 font-medium">
            Launching Q4 2026 · getbooked.live
          </p>
        </div>
      </div>
    </div>
  );
}
