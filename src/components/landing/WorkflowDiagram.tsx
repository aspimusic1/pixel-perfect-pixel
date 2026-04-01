import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Send,
  FileSignature,
  CreditCard,
  Star,
  Mic2,
  Megaphone,
  Building2,
  Wrench,
  Camera,
  ArrowDown,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

/* ─── Types ─── */
type Phase = {
  id: string;
  num: string;
  icon: typeof Search;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  glow: string;
  roles: { icon: typeof Mic2; label: string; color: string }[];
  details: string[];
};

/* ─── Phase data ─── */
const PHASES: Phase[] = [
  {
    id: "discover",
    num: "01",
    icon: Search,
    title: "Discover & Match",
    subtitle: "find your perfect match",
    description:
      "Browse verified profiles by genre, city, draw, and budget. Our AI recommendation engine surfaces the best matches based on your history and preferences.",
    color: "#C8FF3E",
    glow: "rgba(200,255,62,0.15)",
    roles: [
      { icon: Megaphone, label: "Promoter searches", color: "#FF5C8A" },
      { icon: Mic2, label: "Artist discovered", color: "#C8FF3E" },
      { icon: Building2, label: "Venue matched", color: "#FFB83E" },
    ],
    details: [
      "AI-powered artist recommendations",
      "Filter by genre, city, draw, fee range",
      "Verified profiles with streaming stats",
      "Availability calendar check",
    ],
  },
  {
    id: "offer",
    num: "02",
    icon: Send,
    title: "Send & Negotiate",
    subtitle: "structured offers, no more DMs",
    description:
      "Send professional booking offers with guarantee, door split, hospitality rider, and production requirements — all in a structured deal room.",
    color: "#FF5C8A",
    glow: "rgba(255,92,138,0.15)",
    roles: [
      { icon: Megaphone, label: "Promoter sends offer", color: "#FF5C8A" },
      { icon: Mic2, label: "Artist reviews terms", color: "#C8FF3E" },
      { icon: Building2, label: "Venue confirms date", color: "#FFB83E" },
    ],
    details: [
      "Guarantee + door split structure",
      "Counter-offer with AI suggestions",
      "Hospitality & rider details",
      "Real-time negotiation thread",
    ],
  },
  {
    id: "contract",
    num: "03",
    icon: FileSignature,
    title: "Contract & Sign",
    subtitle: "auto-generated, legally reviewed",
    description:
      "Once terms are agreed, a contract is auto-generated from the deal room. E-sign in seconds. No lawyers needed for standard bookings.",
    color: "#3EC8FF",
    glow: "rgba(62,200,255,0.15)",
    roles: [
      { icon: FileSignature, label: "Contract generated", color: "#3EC8FF" },
      { icon: Mic2, label: "Artist signs", color: "#C8FF3E" },
      { icon: Megaphone, label: "Promoter signs", color: "#FF5C8A" },
    ],
    details: [
      "Auto-generated from deal terms",
      "E-signature in 30 seconds",
      "Milestone & payment schedule",
      "Cancellation & force majeure clauses",
    ],
  },
  {
    id: "payment",
    num: "04",
    icon: CreditCard,
    title: "Pay & Perform",
    subtitle: "escrow-protected payments",
    description:
      "Deposits flow through Stripe Connect. Funds are held in escrow until milestones are met. Production and crew get paid on completion.",
    color: "#7B5CF0",
    glow: "rgba(123,92,240,0.15)",
    roles: [
      { icon: CreditCard, label: "Deposit secured", color: "#7B5CF0" },
      { icon: Wrench, label: "Crew assigned", color: "#7B5CF0" },
      { icon: Camera, label: "Creative booked", color: "#3EC8FF" },
    ],
    details: [
      "Stripe Connect escrow payments",
      "Milestone-based releases",
      "Advance request option",
      "Transparent fee breakdown",
    ],
  },
  {
    id: "review",
    num: "05",
    icon: Star,
    title: "Review & Grow",
    subtitle: "reputation drives your next booking",
    description:
      "After the show, both sides review each other. Your rating, reliability score, and booking history become your professional reputation.",
    color: "#FFB83E",
    glow: "rgba(255,184,62,0.15)",
    roles: [
      { icon: Star, label: "Mutual reviews", color: "#FFB83E" },
      { icon: Sparkles, label: "Reputation grows", color: "#C8FF3E" },
      { icon: Search, label: "Next booking", color: "#3EC8FF" },
    ],
    details: [
      "Verified post-show reviews",
      "Reliability & professionalism scores",
      "Portfolio & media uploads",
      "Repeat booking suggestions",
    ],
  },
];

/* ─── Connector ─── */
function PhaseConnector({ fromColor, toColor }: { fromColor: string; toColor: string }) {
  return (
    <div className="flex justify-center py-2">
      <motion.div
        className="flex flex-col items-center gap-1"
        initial={{ opacity: 0, scaleY: 0 }}
        whileInView={{ opacity: 1, scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="w-px h-8"
          style={{
            background: `linear-gradient(to bottom, ${fromColor}40, ${toColor}40)`,
          }}
        />
        <ArrowDown className="w-4 h-4" style={{ color: `${toColor}60` }} />
      </motion.div>
    </div>
  );
}

/* ─── Phase card ─── */
function PhaseCard({
  phase,
  index,
  isActive,
  onClick,
}: {
  phase: Phase;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = phase.icon;

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <motion.div
        className="relative rounded-2xl border p-5 sm:p-6 transition-all duration-300"
        style={{
          borderColor: isActive ? `${phase.color}40` : "rgba(255,255,255,0.06)",
          backgroundColor: isActive ? `${phase.color}08` : "rgba(255,255,255,0.02)",
        }}
        whileHover={{
          borderColor: `${phase.color}30`,
          backgroundColor: `${phase.color}06`,
        }}
        onClick={onClick}
        layout
      >
        {/* Glow */}
        {isActive && (
          <motion.div
            className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{ boxShadow: `0 0 60px ${phase.glow}, inset 0 0 60px ${phase.glow}` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* Header row */}
        <div className="flex items-start gap-4 relative z-10">
          {/* Icon */}
          <div
            className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${phase.color}12`, border: `1px solid ${phase.color}25` }}
          >
            <Icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: phase.color }} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-display font-bold uppercase tracking-[0.15em]"
                style={{ color: phase.color }}
              >
                Phase {phase.num}
              </span>
            </div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-foreground leading-tight">
              {phase.title}
            </h3>
            <p className="text-xs text-muted-foreground font-body mt-0.5 lowercase">
              {phase.subtitle}
            </p>
          </div>

          {/* Expand indicator */}
          <motion.div
            className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border"
            style={{
              borderColor: isActive ? `${phase.color}40` : "rgba(255,255,255,0.08)",
              backgroundColor: isActive ? `${phase.color}10` : "transparent",
            }}
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowDown className="w-3.5 h-3.5" style={{ color: isActive ? phase.color : "rgba(255,255,255,0.3)" }} />
          </motion.div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="relative z-10"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="pt-5 space-y-5">
                {/* Description */}
                <p className="text-sm text-white/60 font-body leading-relaxed">
                  {phase.description}
                </p>

                {/* Role flow */}
                <div className="flex flex-wrap gap-2">
                  {phase.roles.map((role, ri) => {
                    const RIcon = role.icon;
                    return (
                      <motion.div
                        key={role.label}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 border"
                        style={{
                          borderColor: `${role.color}20`,
                          backgroundColor: `${role.color}08`,
                        }}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ri * 0.08 }}
                      >
                        <RIcon className="w-3.5 h-3.5" style={{ color: role.color }} />
                        <span className="text-[11px] font-body text-white/70">{role.label}</span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Detail bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {phase.details.map((detail, di) => (
                    <motion.div
                      key={di}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + di * 0.05 }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: phase.color }}
                      />
                      <span className="text-xs text-white/50 font-body">{detail}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ─── Main component ─── */
export default function WorkflowDiagram() {
  const [activePhase, setActivePhase] = useState<string | null>("discover");

  return (
    <section id="workflow" className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/[0.03] blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FF5C8A]/[0.02] blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-display font-bold tracking-[0.2em] uppercase text-primary/70 mb-3">
            platform workflow
          </p>
          <h2 className="font-display font-extrabold text-[clamp(26px,4.5vw,44px)] text-foreground lowercase tracking-[-0.02em] leading-[1.1]">
            from discovery to encore
          </h2>
          <p className="text-sm text-white/40 font-body mt-3 max-w-lg mx-auto leading-relaxed">
            every booking flows through five phases. click each phase to see exactly how
            artists, promoters, venues, and crews collaborate on GetBooked.Live.
          </p>
        </motion.div>

        {/* Phase timeline */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-6 sm:left-7 top-0 bottom-0 w-px bg-gradient-to-b from-[#C8FF3E]/20 via-[#FF5C8A]/20 via-[#3EC8FF]/20 via-[#7B5CF0]/20 to-[#FFB83E]/20 hidden sm:block" />

          <div className="space-y-0">
            {PHASES.map((phase, i) => (
              <div key={phase.id}>
                <PhaseCard
                  phase={phase}
                  index={i}
                  isActive={activePhase === phase.id}
                  onClick={() => setActivePhase(activePhase === phase.id ? null : phase.id)}
                />
                {i < PHASES.length - 1 && (
                  <PhaseConnector
                    fromColor={phase.color}
                    toColor={PHASES[i + 1].color}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom badges */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {[
            { icon: Shield, label: "Escrow-protected", color: "#3EC8FF" },
            { icon: Zap, label: "AI-powered matching", color: "#C8FF3E" },
            { icon: Sparkles, label: "Auto-contracts", color: "#FF5C8A" },
          ].map((badge) => {
            const BIcon = badge.icon;
            return (
              <div
                key={badge.label}
                className="flex items-center gap-2 rounded-full px-4 py-2 border"
                style={{
                  borderColor: `${badge.color}20`,
                  backgroundColor: `${badge.color}06`,
                }}
              >
                <BIcon className="w-3.5 h-3.5" style={{ color: badge.color }} />
                <span className="text-[11px] font-display font-bold tracking-wide" style={{ color: `${badge.color}CC` }}>
                  {badge.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
