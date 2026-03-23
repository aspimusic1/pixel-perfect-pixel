import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield, DollarSign, BarChart3, Zap, Bot, Truck, ArrowRight, FileText, Target, Ticket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TabKey = "booking" | "operations" | "growth";

const TABS: { key: TabKey; label: string }[] = [
  { key: "booking", label: "Booking" },
  { key: "operations", label: "Operations" },
  { key: "growth", label: "Growth" },
];

const FEATURES: Record<TabKey, { icon: React.ElementType; title: string; desc: string }[]> = {
  booking: [
    { icon: FileText, title: "structured offers", desc: "send complete offers with guarantee, splits, hospitality, and backline — no more DM chaos." },
    { icon: DollarSign, title: "live commission calculator", desc: "see your exact net pay before you accept. commission auto-calculates by tier." },
    { icon: Bot, title: "AI booking agent", desc: "describe what you need and our AI finds best-fit artists and drafts the offer." },
  ],
  operations: [
    { icon: Shield, title: "deal rooms", desc: "private workspace per booking — contracts, milestones, chat, and logistics in one place." },
    { icon: Target, title: "tour management hub", desc: "plan multi-city runs with itinerary, crew, budget, and ground transport." },
    { icon: Truck, title: "market rate intelligence", desc: "see what artists in your genre and market are charging before you set your price." },
  ],
  growth: [
    { icon: BarChart3, title: "BookScore™", desc: "build your reputation with verified attendance, reviews, and show history." },
    { icon: Zap, title: "flash bidding", desc: "artists mark open dates. promoters bid in real time. highest bid wins." },
    { icon: Ticket, title: "fan presale", desc: "capture demand before the show. presale signups prove draw and sell tickets early." },
  ],
};

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const containerVariants = {
  animate: { transition: { staggerChildren: 0.07 } },
};

export default function PowerFeaturesSection() {
  const [tab, setTab] = useState<TabKey>("booking");
  const features = FEATURES[tab];

  return (
    <section className="fade-in-section py-16 sm:py-28 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <span className="section-label">features</span>
          <h2 className="section-heading">everything the live music industry needs</h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-full border border-white/[0.08] p-1 bg-secondary/40">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`text-xs font-display font-bold px-5 py-2 rounded-full transition-all lowercase ${
                  tab === t.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="group rounded-[14px] p-6 bg-card/80 border border-white/[0.06] hover:border-primary/20 transition-all duration-300 cursor-default"
                variants={cardVariants}
                transition={{ delay: i * 0.07, duration: 0.3, ease: "easeOut" }}
              >
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-[15px] h-[15px] text-primary" />
                </div>
                <h3 className="font-display font-bold text-sm text-foreground mb-2 lowercase">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-[1.6] font-body">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-10">
          <Link to="/auth?tab=signup">
            <motion.button
              className="bg-primary text-primary-foreground font-display font-bold text-sm rounded-[10px] px-8 h-12 hover:bg-primary/90 transition-all inline-flex items-center gap-2 lowercase"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              try it free <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}
