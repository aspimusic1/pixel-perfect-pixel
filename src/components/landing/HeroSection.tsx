import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import logoWhite from "@/assets/logo-white.svg";

const TRUST_STATS = [
  "2,400+ artists",
  "840+ venues",
  "12,000+ bookings",
  "$4.2M paid out",
];

export default function HeroSection() {
  return (
    <section className="relative pt-6 pb-20 sm:pb-32 px-4 sm:px-6 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-primary/[0.03] blur-[140px] pointer-events-none" />

      {/* Top nav bar */}
      <nav className="container mx-auto max-w-5xl flex items-center justify-between py-4 mb-16 sm:mb-24 relative z-10">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoWhite} alt="GetBooked.Live" className="h-5 opacity-90" onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
          }} />
          <span className="hidden font-display font-bold text-foreground text-sm">GetBooked.Live</span>
        </Link>
        <div className="flex items-center gap-5">
          <Link to="/browse" className="hidden sm:inline text-[13px] text-muted-foreground hover:text-foreground transition-colors font-body">browse</Link>
          <Link to="/pricing" className="hidden sm:inline text-[13px] text-muted-foreground hover:text-foreground transition-colors font-body">pricing</Link>
          <Link to="/auth" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors font-body">sign in</Link>
          <Link to="/auth?tab=signup">
            <button className="bg-primary text-primary-foreground font-display font-bold text-xs rounded-lg px-5 h-9 hover:bg-primary/90 active:scale-[0.97] transition-all">
              start free
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero content */}
      <div className="container mx-auto max-w-3xl text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="section-label">all-in-one booking platform</span>
        </motion.div>

        <motion.h1
          className="font-display font-extrabold tracking-[-0.03em] text-foreground mb-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
        >
          the operating system for{" "}
          <span className="text-primary">live bookings</span>
        </motion.h1>

        <motion.p
          className="section-subtext mx-auto mb-3"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          artists, promoters, venues, and creatives — all in one place.
        </motion.p>

        <motion.p
          className="text-[13px] text-muted-foreground/70 font-body mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          send offers. get booked. run your shows.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-14"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <Link to="/auth?tab=signup">
            <motion.button
              className="bg-primary text-primary-foreground font-display font-bold text-sm rounded-[10px] px-8 h-12 hover:bg-primary/90 active:scale-[0.96] transition-all flex items-center gap-2 w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              start free <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
          <Link to="/browse">
            <motion.button
              className="border border-border text-foreground font-display font-medium text-sm rounded-[10px] px-8 h-12 hover:bg-secondary hover:border-border/80 active:scale-[0.96] transition-all w-full sm:w-auto"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              browse marketplace
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          className="flex flex-wrap justify-center gap-x-6 gap-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {TRUST_STATS.map((stat, i) => (
            <span key={i} className="text-[13px] text-muted-foreground font-body">
              {stat}
              {i < TRUST_STATS.length - 1 && <span className="ml-6 text-border hidden sm:inline">·</span>}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
