import { Link } from "react-router-dom";
import { ArrowRight, Mic2, Megaphone, Building2, Camera, Zap, Play } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/* ─── Parallax concert background ─── */
function ConcertBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <motion.div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity: 1 }}>
      <motion.div className="absolute inset-0 w-full h-[130%] -top-[10%]" style={{ y }}>
        <img
          src="/images/concert-crowd.jpg"
          alt=""
          className="w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
        />
      </motion.div>
      {/* Heavy overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      {/* Accent glows */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-primary/[0.06] blur-[120px]" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[#FF5C8A]/[0.04] blur-[120px]" />
    </motion.div>
  );
}

/* ─── 4 persona entry cards ─── */
const PERSONAS = [
  { id: "artist", icon: Mic2, identity: "I'm an Artist", cta: "Get Booked", color: "#C8FF3E", link: "/auth?tab=signup&role=artist" },
  { id: "promoter", icon: Megaphone, identity: "I'm a Promoter", cta: "Book Talent", color: "#FF5C8A", link: "/auth?tab=signup&role=promoter" },
  { id: "venue", icon: Building2, identity: "I'm a Venue", cta: "Host Events", color: "#FFB83E", link: "/auth?tab=signup&role=venue" },
  { id: "creative", icon: Camera, identity: "I'm a Creative", cta: "Find Work", color: "#3EC8FF", link: "/auth?tab=signup&role=photo_video" },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center pt-20 pb-16 px-4 sm:px-6 overflow-hidden">
      <ConcertBackground />

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        {/* Live badge */}
        <motion.div
          className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.1] rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[11px] text-white/50 font-body tracking-wide">platform live · free to join</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-display font-extrabold tracking-[-0.03em] text-foreground mb-5"
          style={{ fontSize: "clamp(32px, 5.5vw, 64px)", lineHeight: "1.06" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          Book artists. <span className="text-primary">Close deals.</span>
          <br />
          Run your shows — all in one place.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-base sm:text-lg text-white/45 font-body leading-relaxed mx-auto mb-8 max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          The all-in-one platform for artists, promoters, venues, and creatives to connect and close bookings faster.
        </motion.p>

        {/* Primary + Secondary CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Link to="/auth?tab=signup">
            <motion.button
              className="bg-primary text-primary-foreground font-display font-bold text-sm rounded-xl px-8 h-12 hover:bg-primary/90 transition-all flex items-center gap-2 shadow-[0_0_32px_hsl(var(--primary)/0.35)]"
              whileHover={{ scale: 1.03, boxShadow: "0 0 44px hsl(var(--primary)/0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Zap className="w-4 h-4" /> Get Started
            </motion.button>
          </Link>
          <Link to="/browse">
            <motion.button
              className="border border-white/[0.12] text-white/70 font-display font-medium text-sm rounded-xl px-7 h-12 hover:bg-white/[0.06] hover:border-white/[0.2] hover:text-white transition-all flex items-center gap-2 backdrop-blur-sm"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Play className="w-3.5 h-3.5" /> Explore Platform
            </motion.button>
          </Link>
        </motion.div>

        {/* 4 persona entry cards */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          {PERSONAS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Link key={p.id} to={p.link}>
                <motion.div
                  className="group relative flex flex-col items-center gap-2.5 rounded-2xl border p-5 cursor-pointer overflow-hidden"
                  style={{ borderColor: `${p.color}25`, backgroundColor: `${p.color}06` }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
                  whileHover={{
                    scale: 1.04,
                    backgroundColor: `${p.color}14`,
                    borderColor: `${p.color}50`,
                    boxShadow: `0 0 24px ${p.color}30`,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${p.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] text-white/50 font-body">{p.identity}</p>
                    <p className="text-xs font-display font-bold flex items-center justify-center gap-1 mt-0.5" style={{ color: p.color }}>
                      {p.cta} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="text-[11px] text-white/25 font-body mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          no credit card · free plan forever · 7-day pro trial included
        </motion.p>
      </div>
    </section>
  );
}
