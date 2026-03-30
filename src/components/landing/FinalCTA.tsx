import { Link } from "react-router-dom";
import { ArrowRight, Mic2, Megaphone, Building2, Camera, Zap } from "lucide-react";
import { motion } from "framer-motion";

const ROLE_BUTTONS = [
  { label: "Get Booked", sublabel: "I'm an Artist", icon: Mic2, color: "#C8FF3E", textColor: "#080C14", link: "/auth?tab=signup&role=artist", glow: "rgba(200,255,62,0.3)" },
  { label: "Book Talent", sublabel: "I'm a Promoter", icon: Megaphone, color: "#FF5C8A", textColor: "#fff", link: "/auth?tab=signup&role=promoter", glow: "rgba(255,92,138,0.3)" },
  { label: "Find Events", sublabel: "I'm a Venue", icon: Building2, color: "#FFB83E", textColor: "#080C14", link: "/auth?tab=signup&role=venue", glow: "rgba(255,184,62,0.3)" },
  { label: "Find Work", sublabel: "I'm a Creative", icon: Camera, color: "#3EC8FF", textColor: "#080C14", link: "/auth?tab=signup&role=photo_video", glow: "rgba(62,200,255,0.3)" },
];

export default function FinalCTA() {
  return (
    <section className="relative fade-in-section py-20 sm:py-32 px-4 overflow-hidden">
      {/* Dark concert background */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/images/concert-crowd.jpg"
          alt=""
          className="w-full h-full object-cover object-center opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
        {/* Accent glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/[0.06] blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-3xl text-center relative z-10">

        {/* Urgency badge */}
        <motion.div
          className="inline-flex items-center gap-2 bg-primary/[0.08] border border-primary/20 rounded-full px-4 py-1.5 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span className="text-[11px] text-primary/80 font-body tracking-wide">now open · free to join</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="font-display font-extrabold text-[clamp(28px,4.5vw,52px)] text-foreground leading-[1.08] mb-4 lowercase tracking-[-0.02em]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          your next show is one click away.
        </motion.h2>

        {/* Sub */}
        <motion.p
          className="text-[15px] text-white/40 font-body leading-relaxed mb-10 max-w-md mx-auto"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.45 }}
        >
          free to join. first booking takes 60 seconds. no credit card required.
        </motion.p>

        {/* 4 role buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
          {ROLE_BUTTONS.map((btn, i) => {
            const Icon = btn.icon;
            return (
              <Link key={btn.label} to={btn.link}>
                <motion.div
                  className="relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-4 h-[96px] cursor-pointer overflow-hidden"
                  style={{ borderColor: `${btn.color}30`, backgroundColor: `${btn.color}08` }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.4 }}
                  whileHover={{
                    scale: 1.04,
                    backgroundColor: `${btn.color}18`,
                    borderColor: `${btn.color}55`,
                    boxShadow: `0 0 24px ${btn.glow}`,
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon className="w-5 h-5" style={{ color: btn.color }} />
                  <div className="text-center">
                    <p className="text-[11px] font-display font-bold" style={{ color: btn.color }}>{btn.label}</p>
                    <p className="text-[10px] font-body text-white/45 mt-0.5">{btn.sublabel}</p>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.65, duration: 0.4 }}
        >
          <Link to="/auth?tab=signup">
            <motion.button
              className="bg-primary text-primary-foreground font-display font-bold text-sm rounded-[10px] px-10 h-13 h-12 hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-[0_0_28px_hsl(var(--primary)/0.35)]"
              whileHover={{ scale: 1.03, boxShadow: "0 0 40px hsl(var(--primary)/0.5)" }}
              whileTap={{ scale: 0.97 }}
            >
              <Zap className="w-4 h-4" />
              start booking in 60 seconds
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="text-[11px] text-white/25 font-body mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          no credit card · free plan forever · 7-day pro trial included
        </motion.p>

      </div>
    </section>
  );
}
