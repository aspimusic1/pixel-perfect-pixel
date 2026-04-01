import { motion } from "framer-motion";
import { Mic2, Megaphone, Building2, Wrench, Camera, ArrowRight } from "lucide-react";

/* ─── Role nodes ─── */
const ROLES = [
  { id: "artist", icon: Mic2, label: "Artist", color: "#C8FF3E", desc: "Perform & get paid" },
  { id: "promoter", icon: Megaphone, label: "Promoter", color: "#FF5C8A", desc: "Book & promote shows" },
  { id: "venue", icon: Building2, label: "Venue", color: "#FFB83E", desc: "Host & manage events" },
  { id: "production", icon: Wrench, label: "Production", color: "#7B5CF0", desc: "Sound, lights & stage" },
  { id: "creative", icon: Camera, label: "Creative", color: "#3EC8FF", desc: "Photo, video & design" },
];

/* ─── Connection lines ─── */
const CONNECTIONS = [
  { from: "promoter", to: "artist", label: "sends offers" },
  { from: "promoter", to: "venue", label: "books venue" },
  { from: "artist", to: "venue", label: "performs at" },
  { from: "production", to: "venue", label: "crews event" },
  { from: "creative", to: "artist", label: "captures content" },
];

export default function EcosystemMap() {
  return (
    <section className="relative py-24 sm:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/[0.02] blur-[180px] rounded-full" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[11px] font-display font-bold tracking-[0.2em] uppercase text-primary/70 mb-3">
            the ecosystem
          </p>
          <h2 className="font-display font-extrabold text-[clamp(26px,4.5vw,44px)] text-foreground lowercase tracking-[-0.02em] leading-[1.1]">
            five roles, one platform
          </h2>
          <p className="text-sm text-white/40 font-body mt-3 max-w-md mx-auto leading-relaxed">
            every role in live music connects through GetBooked.Live.
            here's how the ecosystem works together.
          </p>
        </motion.div>

        {/* Desktop: circular layout / Mobile: vertical list */}

        {/* ─── Mobile layout ─── */}
        <div className="sm:hidden space-y-3">
          {ROLES.map((role, i) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.id}
                className="flex items-center gap-4 rounded-2xl border p-4"
                style={{
                  borderColor: `${role.color}20`,
                  backgroundColor: `${role.color}06`,
                }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${role.color}15`, border: `1px solid ${role.color}30` }}
                >
                  <Icon className="w-6 h-6" style={{ color: role.color }} />
                </div>
                <div>
                  <p className="font-display font-bold text-sm" style={{ color: role.color }}>
                    {role.label}
                  </p>
                  <p className="text-xs text-white/40 font-body">{role.desc}</p>
                </div>
              </motion.div>
            );
          })}

          {/* Mobile connections */}
          <div className="pt-4 space-y-2">
            {CONNECTIONS.map((conn, i) => {
              const fromRole = ROLES.find((r) => r.id === conn.from)!;
              const toRole = ROLES.find((r) => r.id === conn.to)!;
              return (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 text-[11px] font-body text-white/30 justify-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                >
                  <span style={{ color: fromRole.color }}>{fromRole.label}</span>
                  <ArrowRight className="w-3 h-3 text-white/20" />
                  <span className="text-white/40">{conn.label}</span>
                  <ArrowRight className="w-3 h-3 text-white/20" />
                  <span style={{ color: toRole.color }}>{toRole.label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ─── Desktop: pentagonal layout ─── */}
        <div className="hidden sm:block relative mx-auto" style={{ width: 600, height: 520 }}>
          {/* SVG connection lines */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 600 520"
          >
            <defs>
              {CONNECTIONS.map((conn, i) => {
                const fromRole = ROLES.find((r) => r.id === conn.from)!;
                const toRole = ROLES.find((r) => r.id === conn.to)!;
                return (
                  <linearGradient
                    key={`grad-${i}`}
                    id={`line-grad-${i}`}
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0%" stopColor={fromRole.color} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={toRole.color} stopOpacity="0.25" />
                  </linearGradient>
                );
              })}
            </defs>
            {CONNECTIONS.map((conn, i) => {
              const positions: Record<string, { x: number; y: number }> = {
                artist: { x: 300, y: 40 },
                promoter: { x: 548, y: 200 },
                venue: { x: 455, y: 440 },
                production: { x: 145, y: 440 },
                creative: { x: 52, y: 200 },
              };
              const from = positions[conn.from];
              const to = positions[conn.to];
              return (
                <motion.line
                  key={i}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={`url(#line-grad-${i})`}
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                />
              );
            })}
          </svg>

          {/* Role nodes positioned in a pentagon */}
          {ROLES.map((role, i) => {
            const Icon = role.icon;
            const positions: Record<string, { top: string; left: string }> = {
              artist: { top: "0px", left: "50%" },
              promoter: { top: "160px", left: "calc(100% - 52px)" },
              venue: { top: "400px", left: "calc(100% - 145px)" },
              production: { top: "400px", left: "145px" },
              creative: { top: "160px", left: "52px" },
            };
            const pos = positions[role.id];
            return (
              <motion.div
                key={role.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2"
                style={{ top: pos.top, left: pos.left }}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 backdrop-blur-sm"
                  style={{
                    borderColor: `${role.color}40`,
                    backgroundColor: `${role.color}10`,
                    boxShadow: `0 0 40px ${role.color}15`,
                  }}
                  whileHover={{
                    scale: 1.15,
                    boxShadow: `0 0 60px ${role.color}30`,
                    borderColor: `${role.color}70`,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="w-7 h-7" style={{ color: role.color }} />
                </motion.div>
                <p className="font-display font-bold text-xs" style={{ color: role.color }}>
                  {role.label}
                </p>
                <p className="text-[10px] text-white/35 font-body text-center max-w-[100px]">
                  {role.desc}
                </p>
              </motion.div>
            );
          })}

          {/* Center badge */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <div className="w-20 h-20 rounded-full border-2 border-primary/30 bg-primary/[0.06] flex items-center justify-center backdrop-blur-sm">
              <span className="font-display font-extrabold text-primary text-xs tracking-tight text-center leading-tight">
                Get
                <br />
                Booked
              </span>
            </div>
          </motion.div>
        </div>

        {/* Connection labels (desktop) */}
        <div className="hidden sm:flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8">
          {CONNECTIONS.map((conn, i) => {
            const fromRole = ROLES.find((r) => r.id === conn.from)!;
            const toRole = ROLES.find((r) => r.id === conn.to)!;
            return (
              <motion.div
                key={i}
                className="flex items-center gap-1.5 text-[10px] font-body"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1 + i * 0.05 }}
              >
                <span className="font-display font-bold" style={{ color: fromRole.color }}>
                  {fromRole.label}
                </span>
                <ArrowRight className="w-2.5 h-2.5 text-white/20" />
                <span className="text-white/35">{conn.label}</span>
                <ArrowRight className="w-2.5 h-2.5 text-white/20" />
                <span className="font-display font-bold" style={{ color: toRole.color }}>
                  {toRole.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
